import React from 'react'
import Cards from './Cards'
import { CartProvider } from 'react-use-cart'
export default function CartListComponent() {
  return (
    <div>
     <CartProvider>
      <Cards/>
      </CartProvider>
    </div>
  )
}
