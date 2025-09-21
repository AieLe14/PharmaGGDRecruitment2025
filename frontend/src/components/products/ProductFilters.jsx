"use client"

import { useState, useEffect } from "react"
import { usePublicProducts } from "@/contexts/PublicProductContext"

const ProductFilters = () => {
  const { 
    filters, 
    categories, 
    hasActiveFilters, 
    updateFilters, 
    clearFilters,
    loading 
  } = usePublicProducts()
  
  const [localFilters, setLocalFilters] = useState(filters)
  const [isExpanded, setIsExpanded] = useState(false)

  // Sync local filters with context
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    updateFilters(localFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      sort: 'name',
      order: 'asc'
    })
    clearFilters()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filtres et tri</h3>
        <button 
          className={`filters-toggle ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Masquer les filtres' : 'Afficher les filtres'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Barre de recherche */}
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            Rechercher
          </label>
          <div className="search-input-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              id="search"
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nom du produit, description..."
              className="search-input"
            />
            {localFilters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="clear-search-btn"
                aria-label="Effacer la recherche"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtre par catégorie */}
        <div className="filter-group">
          <label htmlFor="category" className="filter-label">
            Catégorie
          </label>
          <select
            id="category"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div className="filter-group">
          <label htmlFor="sort" className="filter-label">
            Trier par
          </label>
          <div className="sort-controls">
            <select
              id="sort"
              value={localFilters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="name">Nom</option>
              <option value="price">Prix</option>
              <option value="created_at">Date d'ajout</option>
            </select>
            <select
              value={localFilters.order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
              className="filter-select order-select"
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="filter-actions">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="apply-filters-btn"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3L9 15M21 3H15M21 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Appliquer
              </>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="clear-filters-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Effacer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilters
