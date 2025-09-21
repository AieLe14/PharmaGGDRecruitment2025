"use client"

import { useMemo } from "react"
import { useCart } from "@/contexts/CartContext"

const CartSummary = ({ onClose }) => {
  const { cartItems, getTotalItems, getTotalPrice } = useCart()

  const summary = useMemo(() => {
    const totalItems = getTotalItems()
    const subtotal = getTotalPrice()
    
    // Calcul des frais de livraison (gratuit au-dessus de 50€)
    const shippingThreshold = 50
    const shippingCost = subtotal >= shippingThreshold ? 0 : 4.99
    
    // TVA (20% en France)
    const taxRate = 0.20
    const tax = subtotal * taxRate
    
    // Total final
    const total = subtotal + shippingCost + tax

    return {
      totalItems,
      subtotal,
      shippingCost,
      shippingThreshold,
      tax,
      total
    }
  }, [cartItems, getTotalItems, getTotalPrice])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handleCheckout = () => {
    // Ici on pourrait rediriger vers une page de checkout
    alert('Fonctionnalité de commande à implémenter')
  }

  const remainingForFreeShipping = summary.shippingThreshold - summary.subtotal

  return (
    <div className="cart-summary">
      <div className="summary-header">
        <h3>Résumé de la commande</h3>
      </div>

      <div className="summary-details">
        {/* Sous-total */}
        <div className="summary-row">
          <span>Sous-total ({summary.totalItems} article{summary.totalItems > 1 ? 's' : ''})</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>

        {/* Frais de livraison */}
        <div className="summary-row shipping">
          <div className="shipping-info">
            <span>Frais de livraison</span>
            {summary.shippingCost === 0 ? (
              <span className="free-shipping">✓ Livraison gratuite</span>
            ) : (
              <span className="shipping-remaining">
                Ajoutez {formatPrice(remainingForFreeShipping)} pour la livraison gratuite
              </span>
            )}
          </div>
          <span className={summary.shippingCost === 0 ? 'free' : ''}>
            {summary.shippingCost === 0 ? 'Gratuit' : formatPrice(summary.shippingCost)}
          </span>
        </div>

        {/* TVA */}
        <div className="summary-row">
          <span>TVA (20%)</span>
          <span>{formatPrice(summary.tax)}</span>
        </div>

        {/* Séparateur */}
        <div className="summary-divider"></div>

        {/* Total */}
        <div className="summary-row total">
          <span>Total</span>
          <span className="total-price">{formatPrice(summary.total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="summary-actions">
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19S21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Commander maintenant
        </button>
        
        <button 
          className="continue-shopping-btn"
          onClick={onClose}
        >
          Continuer mes achats
        </button>
      </div>

      {/* Informations de sécurité */}
      <div className="security-info">
        <div className="security-badges">
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L3 3V7C3 10.5 5.5 13.5 8 14C10.5 13.5 13 10.5 13 7V3L8 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8L7.5 9.5L10.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Paiement sécurisé</span>
          </div>
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2H4C3.45 2 3 2.45 3 3V13C3 13.55 3.45 14 4 14H12C12.55 14 13 13.55 13 13V3C13 2.45 12.55 2 12 2ZM11 11H5V9H11V11ZM11 7H5V5H11V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Livraison rapide</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
