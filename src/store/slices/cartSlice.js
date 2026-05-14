import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import supabase from '../../utils/supabase'

/**
 * Cart Thunks
 * Orchestrate the high-fidelity synchronization between Redux, LocalStorage, and the Database heritage.
 */

// Universal helper to calculate the new cart state
const calculateNewItems = (currentItems, action, payload) => {
  let newItems = [...currentItems]
  
  if (action === 'ADD') {
    const { product, variant, quantity = 1 } = payload
    const existingIndex = newItems.findIndex(item => item.variant.id === variant.id)
    
    if (existingIndex !== -1) {
      // Create a shallow copy to respect Redux immutability
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity
      }
    } else {
      newItems.push({
        product: {
          id: product.id,
          name: product.name,
          type: product.type,
          catalog_id: product.catalog_id
        },
        variant,
        quantity
      })
    }
  } else if (action === 'UPDATE') {
    const { variantId, quantity } = payload
    newItems = newItems.map(item => 
      item.variant.id === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  } else if (action === 'REMOVE') {
    const variantId = payload
    newItems = newItems.filter(item => item.variant.id !== variantId)
  } else if (action === 'CLEAR') {
    newItems = []
  }
  
  return newItems
}

// Atomic Thunk: Add Item
export const addItemThunk = createAsyncThunk(
  'cart/addItem',
  async (payload, { getState, dispatch }) => {
    const { auth, cart } = getState()
    const newItems = calculateNewItems(cart.items, 'ADD', payload)
    
    if (auth.isAuthenticated && auth.user) {
      const { data, error } = await supabase.rpc('sync_latej_cart', { input_items: newItems })
      if (error) throw error
      return data
    } else {
      localStorage.setItem('latej_cart', JSON.stringify(newItems))
      return newItems
    }
  }
)

// Atomic Thunk: Update Quantity
export const updateQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async (payload, { getState }) => {
    const { auth, cart } = getState()
    const newItems = calculateNewItems(cart.items, 'UPDATE', payload)
    
    if (auth.isAuthenticated && auth.user) {
      const { data, error } = await supabase.rpc('sync_latej_cart', { input_items: newItems })
      if (error) throw error
      return data
    } else {
      localStorage.setItem('latej_cart', JSON.stringify(newItems))
      return newItems
    }
  }
)

// Atomic Thunk: Remove Item
export const removeItemThunk = createAsyncThunk(
  'cart/removeItem',
  async (payload, { getState }) => {
    const { auth, cart } = getState()
    const newItems = calculateNewItems(cart.items, 'REMOVE', payload)
    
    if (auth.isAuthenticated && auth.user) {
      const { data, error } = await supabase.rpc('sync_latej_cart', { input_items: newItems })
      if (error) throw error
      return data
    } else {
      localStorage.setItem('latej_cart', JSON.stringify(newItems))
      return newItems
    }
  }
)

// Atomic Thunk: Clear Cart
export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState }) => {
    const { auth } = getState()
    if (auth.isAuthenticated && auth.user) {
      const { data, error } = await supabase.rpc('sync_latej_cart', { input_items: [] })
      if (error) throw error
      return data
    } else {
      localStorage.removeItem('latej_cart')
      return []
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isOpen: false,
    status: 'idle' // idle, loading, failed
  },
  reducers: {
    setCartData: (state, action) => {
      state.items = action.payload || []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemThunk.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(updateQuantityThunk.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(removeItemThunk.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.items = action.payload
      })
  }
})

export const { 
  setCartData, 
  toggleCart, 
  openCart, 
  closeCart 
} = cartSlice.actions

export default cartSlice.reducer
