import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import supabase from '../../utils/supabase'

/**
 * Fetch Latej Orders Thunk
 * Retrieves the high-fidelity procurement history for the authenticated user.
 */
export const fetchLatejOrdersThunk = createAsyncThunk(
  'latejOrders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthenticated')

      const { data, error } = await supabase
        .from('latej_orders')
        .select('*, items:latej_order_items(*)')
        .eq('user_id', user.id)
        .neq('status', 'unpaid')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
  isInitialized: false
}

const latejOrderSlice = createSlice({
  name: 'latejOrders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload
      state.isInitialized = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatejOrdersThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchLatejOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload
        state.isLoading = false
        state.isInitialized = true
        state.error = null
      })
      .addCase(fetchLatejOrdersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { setOrders } = latejOrderSlice.actions
export default latejOrderSlice.reducer
