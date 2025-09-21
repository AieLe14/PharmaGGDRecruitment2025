// Configuration centralisée des URLs et variables d'environnement

// Fonction pour obtenir l'URL du backend selon le contexte (client/serveur)
export const getBackendUrl = () => {
  // Côté serveur, utiliser BACKEND_URL
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL || 'http://localhost:8000'
  }
  // Côté client, utiliser NEXT_PUBLIC_BACKEND_URL
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
}

const config = {
  // Fonction pour obtenir l'URL dynamiquement
  get backendUrl() {
    return getBackendUrl()
  },
  
  // Environnement
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  
  // URLs complètes de l'API (utilisant des getters)
  get api() {
    const baseUrl = getBackendUrl()
    return {
      base: baseUrl,
      auth: `${baseUrl}/api/auth`,
      adminAuth: `${baseUrl}/api/admin/auth`,
      products: `${baseUrl}/api/products`,
      adminProducts: `${baseUrl}/api/admin/products`,
    }
  }
}

export default config
