"use client"

import { useState } from "react"
import { useModal } from "@/hooks/useModal"
import { useProducts } from "@/contexts/ProductContext"
import { useAuth } from "@/contexts/AuthContext"
import { useNotification } from "@/contexts/NotificationContext"
import Button from "@/components/ui/Button"

// Composant formulaire d'édition simple sans hook useForm
const EditProductForm = ({ product, onSubmit, onCancel, hasPricePermission }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
    image: product?.image || '',
    sku: product?.sku || '',
    is_active: product?.is_active ?? true
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
          <label htmlFor="edit-name">
            Nom du produit *
          </label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du produit"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-sku">
            SKU *
          </label>
          <input
            type="text"
            id="edit-sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            placeholder="Code SKU"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="edit-description">
          Description
        </label>
        <textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Description du produit"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="edit-price">
            Prix * {!hasPricePermission && (
              <span className="permission-warning">
                (Modification restreinte aux administrateurs)
              </span>
            )}
          </label>
          <input
            type="number"
            id="edit-price"
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
          <label htmlFor="edit-stock">
            Stock *
          </label>
          <input
            type="number"
            id="edit-stock"
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
          <label htmlFor="edit-category">
            Catégorie
          </label>
          <input
            type="text"
            id="edit-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Catégorie du produit"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-image">
            URL de l'image
          </label>
          <input
            type="url"
            id="edit-image"
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
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Modifier
        </button>
      </div>
    </form>
  )
}

const ProductList = () => {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts()
  const { hasPermission } = useAuth()
  const { showNotification } = useNotification()
  
  const editModal = useModal()
  const deleteDialog = useModal()


  const handleEdit = (product) => {
    editModal.open(product)
  }

  const handleDeleteClick = (product) => {
    deleteDialog.open(product)
  }

  const handleDeleteConfirm = async () => {
    const product = deleteDialog.data
    const result = await deleteProduct(product.id)
    
    if (result.success) {
      showNotification('Produit supprimé avec succès !', 'success')
      deleteDialog.close()
    } else {
      showNotification(result.error, 'error')
    }
  }

  const handleProductSubmit = async (formData) => {
    const product = editModal.data
    const result = await updateProduct(product.id, formData)
    
    if (result.success) {
      showNotification('Produit modifié avec succès !', 'success')
      editModal.close()
      return { success: true }
    } else {
      showNotification(result.error, 'error')
      return { success: false, error: result.error }
    }
  }

  if (loading) {
    return <div className="loading">Chargement des produits...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun produit trouvé.</p>
      </div>
    )
  }

  return (
    <>
      <div className="products-list">
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              hasUpdatePermission={hasPermission('products.update')}
              hasDeletePermission={hasPermission('products.delete')}
            />
          ))}
        </div>
      </div>

      {/* Modal de modification - Simple */}
      {editModal.isOpen && (
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
                Modifier le produit
              </h2>
              <button
                onClick={editModal.close}
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
            
            {/* Content */}
            <div style={{ padding: '20px' }}>
              <EditProductForm
                product={editModal.data}
                onSubmit={handleProductSubmit}
                onCancel={editModal.close}
                hasPricePermission={hasPermission('products.price.update')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation de suppression - Simple */}
      {deleteDialog.isOpen && (
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
            maxWidth: '500px',
            width: '100%',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600' }}>
              Confirmer la suppression
            </h3>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280' }}>
              Êtes-vous sûr de vouloir supprimer le produit "{deleteDialog.data?.name}" ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={deleteDialog.close}
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
                onClick={handleDeleteConfirm}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const ProductCard = ({ product, onEdit, onDelete, hasUpdatePermission, hasDeletePermission }) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }


  return (
    <div className="product-card">
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
              <circle 
                cx="40" 
                cy="45" 
                r="2" 
                fill="#9CA3AF"
              />
              <circle 
                cx="60" 
                cy="45" 
                r="2" 
                fill="#9CA3AF"
              />
              <circle 
                cx="40" 
                cy="55" 
                r="2" 
                fill="#9CA3AF"
              />
              <circle 
                cx="60" 
                cy="55" 
                r="2" 
                fill="#9CA3AF"
              />
              {/* Croix médicale */}
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
            <span className="placeholder-text">{product.name}</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-sku">SKU: {product.sku}</p>
        <p className="product-price">{product.price}€</p>
        <p className="product-stock">Stock: {product.stock}</p>
        {product.category && (
          <p className="product-category">Catégorie: {product.category}</p>
        )}
        <div className="product-status">
          <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
            {product.is_active ? 'ACTIF' : 'INACTIF'}
          </span>
        </div>
      </div>
      <div className="product-actions">
        {hasUpdatePermission && (
          <Button 
            variant="primary" 
            size="small"
            onClick={() => onEdit(product)}
          >
            Modifier
          </Button>
        )}
        {hasDeletePermission && (
          <Button 
            variant="danger" 
            size="small"
            onClick={() => onDelete(product)}
          >
            Supprimer
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProductList
