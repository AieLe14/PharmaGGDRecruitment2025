"use client"

import { useState, useEffect } from "react"

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = true,
  showPageSize = true,
  pageSize = 12,
  onPageSizeChange,
  totalItems = 0
}) => {
  const [visiblePages, setVisiblePages] = useState([])

  useEffect(() => {
    const generateVisiblePages = () => {
      const pages = []
      const maxVisible = 5
      
      if (totalPages <= maxVisible) {
        // Afficher toutes les pages si le total est petit
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Logique pour afficher les pages de manière intelligente
        if (currentPage <= 3) {
          // Début : 1, 2, 3, 4, ..., dernière
          for (let i = 1; i <= 4; i++) {
            pages.push(i)
          }
          if (totalPages > 4) {
            pages.push('...')
            pages.push(totalPages)
          }
        } else if (currentPage >= totalPages - 2) {
          // Fin : 1, ..., avant-dernière, dernière-1, dernière
          pages.push(1)
          if (totalPages > 4) {
            pages.push('...')
          }
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i)
          }
        } else {
          // Milieu : 1, ..., page-1, page, page+1, ..., dernière
          pages.push(1)
          pages.push('...')
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        }
      }
      
      setVisiblePages(pages)
    }

    generateVisiblePages()
  }, [currentPage, totalPages])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(newSize))
    }
  }


  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="pagination-container">
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          <span className="pagination-text">
            Affichage de <strong>{startItem}</strong> à <strong>{endItem}</strong> sur <strong>{totalItems}</strong> résultats
          </span>
        </div>
      )}

      {showPageSize && onPageSizeChange && (
        <div className="pagination-page-size">
          <label htmlFor="page-size" className="page-size-label">
            Afficher :
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="page-size-select"
          >
            <option value={6}>6 par page</option>
            <option value={12}>12 par page</option>
            <option value={24}>24 par page</option>
            <option value={48}>48 par page</option>
          </select>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-nav">
        <button
          className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Précédent</span>
        </button>

        <div className="pagination-pages">
          {visiblePages.map((page, index) => (
            <button
              key={index}
              className={`pagination-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              aria-label={page === '...' ? 'Plus de pages' : `Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
        >
          <span>Suivant</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        </div>
      )}

    </div>
  )
}

export default Pagination