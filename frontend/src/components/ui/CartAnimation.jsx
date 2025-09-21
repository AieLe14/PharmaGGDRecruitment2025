"use client"

import { useState, useEffect } from "react"

const CartAnimation = ({ trigger, onComplete, quantity = 1, productName }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        onComplete?.()
      }, 2000) // Légèrement plus long pour laisser le temps de lire

      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!isAnimating) return null

  return (
    <div className="cart-animation">
      <div className="cart-animation-container">
        <div className="cart-animation-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="cart-animation-text">
          <span className="quantity-added">+{quantity}</span>
          <span className="product-name">{productName}</span>
          <span className="added-text">ajouté(s) au panier</span>
        </div>
      </div>
    </div>
  )
}

export default CartAnimation