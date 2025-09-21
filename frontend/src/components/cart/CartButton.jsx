"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import CartModal from "./CartModal"
import CartAnimation from "@/components/ui/CartAnimation"
import { useCartAnimation } from "@/hooks/useCartAnimation"

const CartButton = () => {
  const { getTotalItems } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { animationTrigger, animationData, triggerAnimation } = useCartAnimation()
  
  const totalItems = getTotalItems()

  // Ne pas afficher le bouton si le panier est vide
  if (totalItems === 0) {
    return null
  }

  const handleCartClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {/* Bouton panier flottant */}
      <div className="cart-button-container">
        <button 
          className="cart-button"
          onClick={handleCartClick}
          aria-label={`Panier - ${totalItems} article${totalItems > 1 ? 's' : ''}`}
        >
          <div className="cart-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19S21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Badge avec le nombre d'articles */}
          <div className="cart-badge">
            <span className="cart-count">{totalItems}</span>
          </div>
        </button>
      </div>

      {/* Animation d'ajout au panier */}
      <CartAnimation 
        trigger={animationTrigger}
        quantity={animationData.quantity}
        productName={animationData.productName}
      />

      {/* Modal du panier */}
      <CartModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default CartButton
