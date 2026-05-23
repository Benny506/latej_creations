import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'

import authReducer from './slices/authSlice'
import latejOrderReducer from './slices/latejOrderSlice'
import preorderReducer from './slices/preorderSlice'

/**
 * Global Redux Store
 * Orchestrates the institutional state manifestation for the entire platform.
 */
const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    latejOrders: latejOrderReducer,
    preorder: preorderReducer
  }
})

export default store
