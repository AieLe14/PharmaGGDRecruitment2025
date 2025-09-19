"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useProducts } from "@/contexts/ProductContext"
import { useNotification } from "@/contexts/NotificationContext"
import ProductList from "@/components/products/ProductList"
import ProductForm from "@/components/forms/ProductForm"
import Button from "@/components/ui/Button"

// Composant formulaire simple sans hook useForm
const SimpleProductForm = ({ onSubmit, onCancel, hasPricePermission }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    sku: '',
    is_active: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Nom du produit *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du produit"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sku">
            SKU *
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            placeholder="Code SKU"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Description du produit"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">
            Prix * {!hasPricePermission && (
              <span className="permission-warning">
                (Modification restreinte aux administrateurs)
              </span>
            )}
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            disabled={!hasPricePermission}
            className={!hasPricePermission ? 'disabled-field' : ''}
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">
            Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            placeholder="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">
            Catégorie
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Catégorie du produit"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">
            URL de l'image
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          Produit actif
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Annuler
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Créer
        </button>
      </div>
    </form>
  )
}

const ProductsTab = () => {
  const { hasPermission } = useAuth()
  const { products, loading, error, fetchProducts, createProduct } = useProducts()
  const { showNotification } = useNotification()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)


  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleCreateProduct = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleProductSubmit = useCallback(async (formData) => {
    const result = await createProduct(formData)
    
    if (result.success) {
      showNotification('Produit créé avec succès !', 'success')
      setIsCreateModalOpen(false)
      return { success: true }
    } else {
      showNotification(result.error, 'error')
      return { success: false, error: result.error }
    }
  }, [createProduct, showNotification])

  const handleCloseModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  return (
    <div className="tab-content">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="tab-header">
        <h2>Gestion des Produits</h2>
        {hasPermission('products.create') && (
          <Button
            onClick={handleCreateProduct}
            variant="primary"
            size="small"
            title="+ Nouveau Produit"
            className="create-button"
          >
            +
          </Button>
        )}
      </div>

      <ProductList />

      {/* Modal de création de produit */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Créer un nouveau produit
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Content - Formulaire simple */}
            <div style={{ padding: '20px' }}>
              <SimpleProductForm
                onSubmit={handleProductSubmit}
                onCancel={handleCloseModal}
                hasPricePermission={hasPermission('products.price.update')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsTab
