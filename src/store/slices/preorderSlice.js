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

export const fetchPreorderRules = createAsyncThunk(
  'preorder/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('latej_preorder_rules')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { preorder } = getState()
      if (preorder.rulesHasFetched || preorder.rulesLoading) {
        return false
      }
    }
  }
)

const initialState = {
  windows: [],
  rules: [],
  loading: false,
  rulesLoading: false,
  hasFetched: false,
  rulesHasFetched: false,
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
      .addCase(fetchPreorderRules.pending, (state) => {
        if (!state.rulesHasFetched) {
          state.rulesLoading = true
        }
      })
      .addCase(fetchPreorderRules.fulfilled, (state, action) => {
        state.rulesLoading = false
        state.rulesHasFetched = true
        if (action.payload) {
          state.rules = action.payload
        }
      })
      .addCase(fetchPreorderRules.rejected, (state, action) => {
        state.rulesLoading = false
        state.error = action.payload
      })
  }
})

export default preorderSlice.reducer
