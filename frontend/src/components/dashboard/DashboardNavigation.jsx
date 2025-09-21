"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"

const DashboardNavigation = ({ activeTab, onTabChange }) => {
  const { hasPermission, adminInfo } = useAuth()

  useEffect(() => {
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
      id: 'settings',
      label: '⚙️ Paramètres',
      permission: 'admins.read'
    }
  ]

  const visibleTabs = tabs.filter(tab => {
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
