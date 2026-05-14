import { createSlice } from '@reduxjs/toolkit'

/**
 * Auth Slice
 * Orchestrates the authentication state for La Tejcreations.
 * Manages both the core User (auth.users) and the high-fidelity Profile (latej_user_profiles).
 */
const initialState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.profile = action.payload.profile
      state.isAuthenticated = !!action.payload.user
      state.loading = false
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.profile = null
      state.isAuthenticated = false
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setAuth, setProfile, clearAuth, setLoading } = authSlice.actions
export default authSlice.reducer
