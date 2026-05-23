import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import supabase from '../../utils/supabase'

export const fetchPreorderWindows = createAsyncThunk(
  'preorder/fetchWindows',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('latej_preorder_windows')
        .select('*')

      if (error) throw error
      
      const now = new Date()
      return data.filter(w => w.is_active && w.end_time && new Date(w.end_time) > now)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { preorder } = getState()
      // Cancel the fetch before it even dispatches 'pending'
      if (preorder.hasFetched || preorder.loading) {
        return false
      }
    }
  }
)

const initialState = {
  windows: [],
  loading: false,
  hasFetched: false,
  error: null
}

const preorderSlice = createSlice({
  name: 'preorder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreorderWindows.pending, (state) => {
        if (!state.hasFetched) {
          state.loading = true
        }
      })
      .addCase(fetchPreorderWindows.fulfilled, (state, action) => {
        state.loading = false
        state.hasFetched = true
        // Only update if we actually got new data
        if (action.payload && action.payload !== state.windows) {
          state.windows = action.payload
        }
      })
      .addCase(fetchPreorderWindows.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default preorderSlice.reducer
