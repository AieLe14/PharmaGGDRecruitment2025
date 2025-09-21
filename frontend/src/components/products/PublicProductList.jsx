"use client"

import { usePublicProducts } from "@/contexts/PublicProductContext"
import PublicProductCard from "./PublicProductCard"
import Pagination from "@/components/ui/Pagination"

const PublicProductList = () => {
  const { 
    products, 
    pagination, 
    loading, 
    error, 
    fetchProducts, 
    changePage, 
    changePageSize 
  } = usePublicProducts()

  if (error) {
    return (
      <div className="products-error">
        <div className="error-content">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="retry-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="public-products-container">
      <div className="products-content">
        {loading && (
          <div className="products-loading">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Chargement des produits...</p>
            </div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <PublicProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.perPage}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
              showInfo={true}
              showPageSize={true}
            />
          </>
        )}
        {!loading && products.length === 0 && (
          <div className="products-empty">
            <div className="empty-content">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19S21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou de filtrage</p>
              <button 
                onClick={() => fetchProducts()}
                className="refresh-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Actualiser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProductList