"use client"

import { createContext, useContext, useState, useCallback } from "react"

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
      } else {
        setError("Erreur lors du chargement des produits")
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = async (productData) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => [data.product, ...prev])
        return { success: true, product: data.product }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message || "Erreur lors de la création du produit" }
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error)
      return { success: false, error: "Erreur de connexion" }
    }
  }

  const updateProduct = async (productId, productData) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p))
        return { success: true, product: data.product }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message || "Erreur lors de la mise à jour du produit" }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      return { success: false, error: "Erreur de connexion" }
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId))
        return { success: true }
      } else {
        return { success: false, error: "Erreur lors de la suppression du produit" }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      return { success: false, error: "Erreur de connexion" }
    }
  }

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
