"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useNotification } from "@/contexts/NotificationContext"
import Button from "@/components/ui/Button"

const DashboardHeader = () => {
  const { adminInfo, handleLogout } = useAuth()
  const { showNotification } = useNotification()

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <h1 className="dashboard-title">
          Dashboard Administrateur
        </h1>
        <div className="dashboard-user-section">
          {adminInfo && (
            <div className="user-info">
              <span className="user-name">{adminInfo.name}</span>
              <span className="user-role">{adminInfo.role?.name}</span>
            </div>
          )}
          <div className="header-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="small"
              className="logout-button"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
