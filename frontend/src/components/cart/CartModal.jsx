"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import CartItem from "./CartItem"
import CartSummary from "./CartSummary"

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, getTotalItems, clearCart } = useCart()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const totalItems = getTotalItems()

  if (!isOpen) return null

  return (
    <div 
      className={`cart-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`cart-modal ${isClosing ? 'closing' : ''}`}>
        {/* Header du modal */}
        <div className="cart-modal-header">
          <div className="cart-modal-title">
            <h2>Mon Panier</h2>
            <span className="cart-items-count">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </span>
          </div>
          <button 
            className="cart-close-btn"
            onClick={handleClose}
            aria-label="Fermer le panier"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="cart-modal-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19S21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Votre panier est vide</h3>
              <p>Ajoutez des produits pour commencer vos achats</p>
              <button className="continue-shopping-btn" onClick={handleClose}>
                Continuer mes achats
              </button>
            </div>
          ) : (
            <>
              {/* Liste des articles */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Actions du panier */}
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H14M12.67 4L12.13 13.33C12.09 13.69 11.93 14.02 11.67 14.27C11.41 14.52 11.07 14.67 10.72 14.67H5.28C4.93 14.67 4.59 14.52 4.33 14.27C4.07 14.02 3.91 13.69 3.87 13.33L3.33 4M5.33 7.33V12.67M7.33 7.33V12.67M9.33 7.33V12.67M11.33 7.33V12.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Vider le panier
                </button>
              </div>

              {/* Résumé du panier */}
              <CartSummary onClose={handleClose} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartModal
