"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { adminLogout } from "@/server/adminAuth"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fonction pour vérifier les permissions
  const hasPermission = (permission) => {
    if (!adminInfo || !adminInfo.role) return false
    
    // Si l'admin a tous les droits
    if (adminInfo.role.all_permissions) return true
    
    // Vérifier la permission spécifique
    return adminInfo.role.permissions?.some(p => p.code === permission) || false
  }

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('/api/admin/me')
      if (response.ok) {
        const data = await response.json()
        setAdminInfo(data.admin)
      } else {
        // Si pas authentifié, rediriger vers la page de connexion
        window.location.href = "/admin"
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations admin:', error)
      window.location.href = "/admin"
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await adminLogout()
      setAdminInfo(null)
      window.location.href = "/admin"
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const refreshAdminInfo = async () => {
    await fetchAdminInfo()
  }

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  const value = {
    adminInfo,
    user: adminInfo, // Alias pour la compatibilité
    loading,
    hasPermission,
    handleLogout,
    refreshAdminInfo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
