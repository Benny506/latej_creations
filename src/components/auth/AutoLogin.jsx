import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../store/slices/authSlice'
import { setCartData } from '../../store/slices/cartSlice'
import supabase from '../../utils/supabase'
import { authBootstrapper } from '../../utils/auth'
import { useAppUi } from '../../context/AppUiContext'
import GlobalLoader from '../ui/GlobalLoader'

/**
 * AutoLogin Component
 * Orchestrates the world-class automated entry manifestation.
 * Flawlessly ensures that the user session, profile, and cart registry are synchronized on mount.
 */
const AutoLogin = ({ children }) => {
  const dispatch = useDispatch()
  const { setSiteContent } = useAppUi()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      // 0. Synchronize the Platform Configuration Manifest
      try {
        const { data: content, error: contentError } = await supabase
          .from('latej_site_content')
          .select('*')

        if (!contentError && content) {
          const contentMap = content.reduce((acc, curr) => {
            acc[curr.page_id] = curr.content
            return acc
          }, {})
          setSiteContent(contentMap)
        } else {
          console.warn('Institutional Warning: Content Registry unreachable. Utilizing heritage fallbacks.')
        }
      } catch (err) {
        console.error('Content Manifestation Error:', err)
      }

      try {
        setLoading(true)

        // 1. Retrieve the cinematic session manifestation
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // 2. Synchronize the high-fidelity profile manifestation
          const profile = await authBootstrapper(session.user)

          if (profile) {
            dispatch(setAuth({ user: session.user, profile }))
            
            // 3. Orchestrate the Atomic Cart Synchronization
            const localCart = localStorage.getItem('latej_cart')
            const parsedLocalCart = localCart ? JSON.parse(localCart) : null

            if (parsedLocalCart && parsedLocalCart.length > 0) {
              // Synchronize local discovery with the database heritage
              const { data: syncedItems, error: syncError } = await supabase
                .rpc('sync_latej_cart', { input_items: parsedLocalCart })

              if (!syncError) {
                dispatch(setCartData(syncedItems))
                localStorage.removeItem('latej_cart') // Purge local persistence
              } else {
                console.error('Cart Sync Narrative Error:', syncError.message)
              }
            } else {
              // Fetch fresh, normalized cart manifest
              const { data, error: fetchError } = await supabase
                .from('latej_cart')
                .select(`
                  quantity,
                  variant:latej_product_variants(*, product:latej_products(*))
                `)
                .eq('user_id', session.user.id)

              if (!fetchError && data) {
                const formattedCart = data.map(item => ({
                  quantity: item.quantity,
                  variant: item.variant,
                  product: item.variant.product
                }))
                dispatch(setCartData(formattedCart))
              }
            }
          } else {
            dispatch(setAuth({ user: null, profile: null }))
          }

        } else {
          dispatch(setAuth({ user: null, profile: null }))
          
          // For unauthenticated discovery, we load the local registry
          const localCart = localStorage.getItem('latej_cart')
          if (localCart) {
            dispatch(setCartData(JSON.parse(localCart)))
          }
        }

      } catch (err) {
        console.error('Auto-Login Manifestation Error:', err.message)
        dispatch(setAuth({ user: null, profile: null }))
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [dispatch])

  // While the authentication registry is initializing, we only show the global loader
  if (loading) {
    return <GlobalLoader tempLoad={true} />
  }

  return <>{children}</>
}

export default AutoLogin
