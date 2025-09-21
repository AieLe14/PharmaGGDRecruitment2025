"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { useCartAnimation } from "@/hooks/useCartAnimation"

const PublicProductCard = ({ product }) => {
  const { addToCart, isInCart, getProductQuantity, updateQuantity } = useCart()
  const { triggerAnimation } = useCartAnimation()
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleAddToCart = async () => {
    if (isAdding) return
    
    setIsAdding(true)
    
    try {
      addToCart(product, quantity)
      triggerAnimation(quantity, product.name)
      
      // Simuler un délai pour l'effet visuel
      setTimeout(() => {
        setIsAdding(false)
      }, 500) // Réduit le délai
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1)
  }

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1)
  }

  const quantityInCart = getProductQuantity(product.id)
  const inCart = isInCart(product.id)

  return (
    <div className="public-product-card">
      <div className="product-image">
        {product.image && !imageError ? (
          <img 
            src={product.image} 
            alt={product.name}
            onError={handleImageError}
          />
        ) : (
          <div className="product-image-placeholder">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="placeholder-icon"
            >
              {/* Pilule de médicament */}
              <ellipse 
                cx="50" 
                cy="50" 
                rx="25" 
                ry="15" 
                fill="#E5E7EB" 
                stroke="#9CA3AF" 
                strokeWidth="2"
              />
              {/* Ligne de séparation de la pilule */}
              <line 
                x1="50" 
                y1="35" 
                x2="50" 
                y2="65" 
                stroke="#9CA3AF" 
                strokeWidth="2"
              />
              {/* Points sur la pilule */}
              <circle cx="40" cy="45" r="2" fill="#9CA3AF" />
              <circle cx="60" cy="45" r="2" fill="#9CA3AF" />
              <circle cx="40" cy="55" r="2" fill="#9CA3AF" />
              <circle cx="60" cy="55" r="2" fill="#9CA3AF" />
              {/* Croix médicale */}
              <rect x="47" y="20" width="6" height="20" fill="#EF4444" rx="1" />
              <rect x="37" y="27" width="26" height="6" fill="#EF4444" rx="1" />
            </svg>
            <span className="placeholder-text">{product.name}</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-category">
          <span className="category-badge">{product.category}</span>
        </div>
        <div className="product-price">
          <span className="price-amount">{product.price}€</span>
          <span className="price-unit">/unité</span>
        </div>
        <div className="product-stock">
          <span className={`stock-indicator ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
            {product.stock > 10 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock} en stock` : 'Rupture de stock'}
          </span>
        </div>
      </div>
      
      <div className="product-actions">
        {!inCart ? (
          <div className="quantity-controls">
            <div className="quantity-selector">
              <button 
                className="quantity-btn minus"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Diminuer la quantité"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn plus"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                aria-label="Augmenter la quantité"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <button 
              className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
            >
              {isAdding ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19S21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Ajouter {quantity} au panier</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="in-cart-status">
            <div className="cart-status-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="cart-status-text">Dans le panier ({quantityInCart})</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProductCard