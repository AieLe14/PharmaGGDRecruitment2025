"use client"

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  // Charger le panier depuis localStorage au démarrage
  const [cartItems, setCartItems] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydratation côté client uniquement
  useEffect(() => {
    setIsHydrated(true)
    try {
      const saved = localStorage.getItem('pharma-cart')
      if (saved) {
        setCartItems(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
    }
  }, [])

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('pharma-cart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error)
      }
    }
  }, [cartItems, isHydrated])

  // Ajouter un produit au panier
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Si le produit n'existe pas, l'ajouter
        return [...prev, { ...product, quantity }]
      }
    })
  }, [])

  // Retirer un produit du panier
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [])

  // Mettre à jour la quantité d'un produit
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  // Vider le panier
  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Calculer le total des articles (optimisé avec useMemo)
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  // Calculer le total du panier (optimisé avec useMemo)
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  // Fonctions de calcul (pour compatibilité)
  const getTotalItems = useCallback(() => totalItems, [totalItems])
  const getTotalPrice = useCallback(() => totalPrice, [totalPrice])

  // Vérifier si un produit est dans le panier (optimisé avec useMemo)
  const cartItemsMap = useMemo(() => {
    const map = new Map()
    cartItems.forEach(item => map.set(item.id, item))
    return map
  }, [cartItems])

  const isInCart = useCallback((productId) => {
    return cartItemsMap.has(productId)
  }, [cartItemsMap])

  // Obtenir la quantité d'un produit dans le panier (optimisé)
  const getProductQuantity = useCallback((productId) => {
    const item = cartItemsMap.get(productId)
    return item ? item.quantity : 0
  }, [cartItemsMap])

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getProductQuantity,
    getTotalItems,
    getTotalPrice,
    isInCart,
    isHydrated
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
