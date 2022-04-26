import React from 'react'
import TrainingFront from './TrainingFront'
import { CartProvider } from 'react-use-cart'

export default function TrainingComponent() {
  return (
    <div>
           <CartProvider>
      <TrainingFront/>
      </CartProvider>

    </div>
  )
}
