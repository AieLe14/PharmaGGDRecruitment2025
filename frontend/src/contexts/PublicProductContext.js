"use client"

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"

const PublicProductContext = createContext()

export const usePublicProducts = () => {
  const context = useContext(PublicProductContext)
  if (!context) {
    throw new Error('usePublicProducts must be used within a PublicProductProvider')
  }
  return context
}

export const PublicProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 12
  })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'name',
    order: 'asc'
  })

  const fetchProducts = useCallback(async (page = 1, newFilters = {}, pageSize = null) => {
    setLoading(true)
    setError("")
    
    try {
      const currentPageSize = pageSize || pagination.perPage
      const currentFilters = { ...filters, ...newFilters }
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: currentPageSize.toString(),
        ...currentFilters
      })

      const response = await fetch(`/api/products?${queryParams}`)
      
      if (response.ok) {
        const data = await response.json()
        
        setProducts(data.data || [])
        setPagination(prev => ({
          ...prev,
          currentPage: data.current_page || page,
          totalPages: data.last_page || 1,
          totalItems: data.total || 0,
          perPage: data.per_page || currentPageSize
        }))
        
        if (Object.keys(newFilters).length > 0) {
          setFilters(prev => ({ ...prev, ...newFilters }))
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erreur lors du chargement des produits")
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }, [])

  // Change page
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
      fetchProducts(page)
    }
  }, [fetchProducts, pagination.currentPage, pagination.totalPages])

  const changePageSize = useCallback((newSize) => {
    fetchProducts(1, {}, newSize)
  }, [fetchProducts])

  const updateFilters = useCallback((newFilters) => {
    fetchProducts(1, newFilters)
  }, [fetchProducts])
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      search: '',
      category: '',
      sort: 'name',
      order: 'asc'
    }
    setFilters(defaultFilters)
    fetchProducts(1, defaultFilters)
  }, [fetchProducts])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))]
    return uniqueCategories.sort()
  }, [products])

  const filteredCount = useMemo(() => {
    return pagination.totalItems
  }, [pagination.totalItems])
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || filters.category !== '' || filters.sort !== 'name' || filters.order !== 'asc'
  }, [filters])

  const value = {
    products,
    pagination,
    filters,
    categories,
    filteredCount,
    hasActiveFilters,
    loading,
    error,
    fetchProducts,
    changePage,
    changePageSize,
    updateFilters,
    clearFilters
  }

  useEffect(() => {
    fetchProducts(1)
  }, [])

  return (
    <PublicProductContext.Provider value={value}>
      {children}
    </PublicProductContext.Provider>
  )
}