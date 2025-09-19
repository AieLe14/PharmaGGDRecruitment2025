"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"

const DashboardNavigation = ({ activeTab, onTabChange }) => {
  const { hasPermission, adminInfo } = useAuth()

  useEffect(() => {
    if (activeTab === 'users' && (!hasPermission('users.read') || adminInfo?.role?.code !== 'super_admin')) {
      onTabChange('products')
    }
    if (activeTab === 'settings' && !hasPermission('admins.read')) {
      onTabChange('products')
    }
  }, [activeTab, hasPermission, onTabChange, adminInfo])

  const tabs = [
    {
      id: 'products',
      label: '📦 Gestion des Produits',
      permission: null
    },
    {
      id: 'users',
      label: '👥 Utilisateurs',
      permission: 'users.read'
    },
    {
      id: 'settings',
      label: '⚙️ Paramètres',
      permission: 'admins.read'
    }
  ]

  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'users') {
      return hasPermission(tab.permission) && adminInfo?.role?.code === 'super_admin'
    }
    return !tab.permission || hasPermission(tab.permission)
  })

  return (
    <nav className="admin-tabs">
      <div className="tabs-container">
        {visibleTabs.map((tab) => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default DashboardNavigation
