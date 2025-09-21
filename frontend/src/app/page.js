"use client"

import { PublicProductProvider } from "@/contexts/PublicProductContext"
import PublicProductList from "@/components/products/PublicProductList"

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Pharmacie en ligne</h1>
          <p>Découvrez notre gamme de médicaments et compléments alimentaires de qualité</p>
        </div>
      </div>

      <div className="products-section">
        <div className="container">
          <PublicProductProvider>
            <PublicProductList />
          </PublicProductProvider>
        </div>
      </div>
    </div>
  )
}
