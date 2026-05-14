import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProductsData, setError } from '../../store/slices/productSlice'
import { setCartData } from '../../store/slices/cartSlice'
import { useAppUi } from '../../context/AppUiContext'
import supabase from '../../utils/supabase'

/**
 * DataInitializer Component
 * Automatically gets all the products, catalogs, and cart when the site starts.
 * It uses a subtle loading message in the background.
 */
const DataInitializer = () => {
  const dispatch = useDispatch()
  const { setSubtleLoading } = useAppUi()

  useEffect(() => {
    // 1. Initialize Cart from LocalStorage
    const savedCart = localStorage.getItem('latej_cart')
    if (savedCart) {
      try {
        dispatch(setCartData(JSON.parse(savedCart)))
      } catch (err) {
        console.error('Cart Manifest Fallout:', err)
      }
    }

    // 2. Fetch Catalog and Product Registry
    const initializeData = async () => {
      setSubtleLoading(true, 'Updating products...')
      
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('latej_catalogs').select('*'),
          supabase.from('latej_products').select('*, variants:latej_product_variants(*)').order('created_at', { ascending: false })
        ])

        if (catRes.error) throw catRes.error
        if (prodRes.error) throw prodRes.error

        dispatch(setProductsData({
          catalogs: catRes.data || [],
          products: prodRes.data || []
        }))
      } catch (err) {
        console.error('Error fetching data:', err.message)
        dispatch(setError(err.message))
      } finally {
        setSubtleLoading(false)
      }
    }

    initializeData()
  }, [dispatch, setSubtleLoading])

  return null
}

export default DataInitializer
