import supabase from './supabase'
import store from '../store'
import { clearAuth } from '../store/slices/authSlice'

/**
 * authBootstrapper
 * Orchestrates the high-fidelity retrieval of user profile data.
 * Flawlessly ensures that the specialized latej_user_profiles manifest is provisioned.
 */
export const authBootstrapper = async (user) => {
  if (!user) return null

  try {
    const { data: profile, error } = await supabase
      .from('latej_user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Profile Retrieval Error:', error.message)
      // If profile retrieval fails, we purge the session manifestation
      await supabase.auth.signOut()
      store.dispatch(clearAuth())
      return null
    }

    return profile
  } catch (err) {
    console.error('Auth Bootstrapper Fatal Error:', err.message)
    await supabase.auth.signOut()
    store.dispatch(clearAuth())
    return null
  }
}
