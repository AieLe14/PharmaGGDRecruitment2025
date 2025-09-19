"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ProductProvider } from "@/contexts/ProductContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardNavigation from "@/components/dashboard/DashboardNavigation"
import ProductsTab from "@/components/dashboard/ProductsTab"
import UsersTab from "@/components/dashboard/UsersTab"
import SettingsTab from "@/components/dashboard/SettingsTab"
import NotificationWrapper from "@/components/ui/NotificationWrapper"
import "@/styles/dashboard.scss"

const DashboardContent = () => {
  const { adminInfo, loading, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState('products')

  if (loading) {
    return (
      <div className="dashboard-page admin">
        <div className="loading">Chargement...</div>
      </div>
    )
  }

  if (!adminInfo) {
    return (
      <div className="dashboard-page admin">
        <div className="error-message">Erreur de chargement des informations utilisateur</div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />
      case 'users':
        return hasPermission('users.read') ? <UsersTab /> : null
      case 'settings':
        return hasPermission('admins.read') ? <SettingsTab /> : null
      default:
        return <ProductsTab />
    }
  }

  return (
    <div className="dashboard-page admin">
      <DashboardHeader />
      <DashboardNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}

const Dashboard = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <NotificationProvider>
          <DashboardContent />
          <NotificationWrapper />
        </NotificationProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default Dashboard
