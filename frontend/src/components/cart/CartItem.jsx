"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"

const CartItem = ({ item }) => {
  const [imageError, setImageError] = useState(false)
  const { updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id)
    } else if (newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  const totalItemPrice = item.price * item.quantity
  const isLowStock = item.quantity >= item.stock

  return (
    <div className="cart-item">
      {/* Image du produit */}
      <div className="cart-item-image">
        {item.image && !imageError ? (
          <img 
            src={item.image} 
            alt={item.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="cart-item-placeholder">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse 
                cx="50" 
                cy="50" 
                rx="25" 
                ry="15" 
                fill="#E5E7EB" 
                stroke="#9CA3AF" 
                strokeWidth="2"
              />
              <line 
                x1="50" 
                y1="35" 
                x2="50" 
                y2="65" 
                stroke="#9CA3AF" 
                strokeWidth="2"
              />
              <rect 
                x="47" 
                y="20" 
                width="6" 
                height="20" 
                fill="#EF4444" 
                rx="1"
              />
              <rect 
                x="37" 
                y="27" 
                width="26" 
                height="6" 
                fill="#EF4444" 
                rx="1"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Informations du produit */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        {item.category && (
          <span className="cart-item-category">{item.category}</span>
        )}
        <div className="cart-item-price">
          {formatPrice(item.price)} / unité
        </div>
        {isLowStock && (
          <div className="cart-item-warning">
            ⚠️ Stock limité ({item.stock} disponible{item.stock > 1 ? 's' : ''})
          </div>
        )}
      </div>

      {/* Contrôles de quantité */}
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            className="quantity-btn decrease"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <input
            type="number"
            min="1"
            max={item.stock}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="quantity-input"
            aria-label="Quantité"
          />
          
          <button 
            className="quantity-btn increase"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="Augmenter la quantité"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Prix total */}
        <div className="cart-item-total">
          {formatPrice(totalItemPrice)}
        </div>
      </div>

      {/* Bouton de suppression */}
      <button 
        className="remove-item-btn"
        onClick={handleRemove}
        aria-label="Supprimer cet article"
        title="Supprimer cet article"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5M5 6V16C5 16.5304 5.21071 17.0391 5.58579 17.4142C5.96086 17.7893 6.46957 18 7 18H13C13.5304 18 14.0391 17.7893 14.4142 17.4142C14.7893 17.0391 15 16.5304 15 16V6M5 6H15M8 9V14M12 9V14M13 6V4C13 3.46957 12.7893 2.96086 12.4142 2.58579C12.0391 2.21071 11.5304 2 11 2H9C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default CartItem
