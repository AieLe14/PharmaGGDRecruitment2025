"use client"

import { useEffect, useMemo, memo } from "react"
import { useForm } from "@/hooks/useForm"
import Button from "@/components/ui/Button"

const ProductForm = memo(({ 
  product = null, 
  onSubmit, 
  onCancel, 
  hasPricePermission = true,
  loading = false 
}) => {
  const isEditing = !!product
  
  const initialValues = useMemo(() => ({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    image: product?.image || '',
    stock: product?.stock || '',
    is_active: product?.is_active ?? true,
    category: product?.category || '',
    sku: product?.sku || ''
  }), [product])

  const { values, errors, setError, setFormError, handleChange, reset } = useForm(initialValues)

  useEffect(() => {
    if (product) {
      reset()
    }
  }, [product, reset])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!values.name.trim()) newErrors.name = 'Le nom est requis'
    if (!values.price || values.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0'
    if (!values.stock || values.stock < 0) newErrors.stock = 'Le stock ne peut pas être négatif'
    if (!values.sku.trim()) newErrors.sku = 'Le SKU est requis'

    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([key, error]) => {
        setError(key, error)
      })
      return
    }

    const result = await onSubmit(values)
    if (!result.success) {
      setFormError(result.error)
    }
  }

  const InputField = memo(({ label, name, type = 'text', required = false, disabled = false, ...props }) => {
    const InputComponent = type === 'textarea' ? 'textarea' : 'input'
    
    return (
      <div className="form-group">
        <label htmlFor={name}>
          {label} {required && '*'}
          {name === 'price' && !hasPricePermission && (
            <span className="permission-warning">
              (Modification restreinte aux administrateurs)
            </span>
          )}
        </label>
        <InputComponent
          type={type === 'textarea' ? undefined : type}
          id={name}
          name={name}
          value={values[name]}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={disabled ? 'disabled-field' : ''}
          {...props}
        />
        {errors[name] && (
          <div className="error-message">
            {errors[name]}
          </div>
        )}
      </div>
    )
  })

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}

      <div className="form-row">
        <InputField 
          label="Nom du produit" 
          name="name" 
          required 
        />
        <InputField 
          label="SKU" 
          name="sku" 
          required 
        />
      </div>

      <InputField 
        label="Description" 
        name="description" 
        type="textarea"
        rows="4"
      />

      <div className="form-row">
        <InputField 
          label="Prix" 
          name="price" 
          type="number" 
          step="0.01" 
          min="0" 
          required 
          disabled={!hasPricePermission}
        />
        <InputField 
          label="Stock" 
          name="stock" 
          type="number" 
          min="0" 
          required 
        />
      </div>

      <div className="form-row">
        <InputField 
          label="Catégorie" 
          name="category" 
        />
        <InputField 
          label="URL de l'image" 
          name="image" 
          type="url"
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={values.is_active}
            onChange={handleChange}
          />
          Produit actif
        </label>
      </div>

      <div className="modal-actions">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
        >
          {isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
})

export default ProductForm
