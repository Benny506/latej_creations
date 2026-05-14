import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  catalogs: [],
  products: [],
  isLoading: false,
  error: null
}

/**
 * Product Slice
 * Manages the global state for catalogs, products, and variants.
 */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setProductsData: (state, action) => {
      state.catalogs = action.payload.catalogs
      state.products = action.payload.products
      state.isLoading = false
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

export const { setLoading, setProductsData, setError } = productSlice.actions
export default productSlice.reducer
