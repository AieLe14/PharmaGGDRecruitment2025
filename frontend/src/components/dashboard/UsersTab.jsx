"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotification } from "@/contexts/NotificationContext"
import Button from "@/components/ui/Button"

// Composant formulaire utilisateur simple
const UserForm = ({ user, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation simple
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Le nom et l\'email sont requis')
      return
    }
    
    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      alert('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    if (!isEditing && formData.password !== formData.password_confirmation) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="user-name">
          Nom complet *
        </label>
        <input
          type="text"
          id="user-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Entrez le nom complet"
        />
      </div>

      <div className="form-group">
        <label htmlFor="user-email">
          Email *
        </label>
        <input
          type="email"
          id="user-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="exemple@pharma-gdd.com"
        />
      </div>

      {!isEditing && (
        <>
          <div className="form-group">
            <label htmlFor="user-password">
              Mot de passe *
            </label>
            <input
              type="password"
              id="user-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password-confirm">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              id="user-password-confirm"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required={!isEditing}
              placeholder="Répétez le mot de passe"
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Annuler
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: isEditing ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = isEditing ? '#218838' : '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = isEditing ? '#28a745' : '#007bff'}
        >
          {isEditing ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  )
}

const UsersTab = () => {
  const { hasPermission, adminInfo } = useAuth()
  const { showNotification } = useNotification()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      } else {
        setError("Erreur lors du chargement des utilisateurs")
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleEditUser = useCallback((user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }, [])

  const handleUserSubmit = useCallback(async (formData) => {
    try {
      const url = selectedUser ? `/api/admin/users/${selectedUser.id}` : '/api/admin/users'
      const method = selectedUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        showNotification(
          selectedUser ? 'Utilisateur modifié avec succès !' : 'Utilisateur créé avec succès !', 
          'success'
        )
        
        if (selectedUser) {
          setUsers(prev => prev.map(u => u.id === selectedUser.id ? data.user : u))
          setIsEditModalOpen(false)
        } else {
          setUsers(prev => [data.user, ...prev])
          setIsCreateModalOpen(false)
        }
        
        setSelectedUser(null)
        return { success: true }
      } else {
        const errorData = await response.json()
        showNotification(errorData.message || "Erreur lors de l'opération", 'error')
        return { success: false, error: errorData.message }
      }
    } catch (error) {
      console.error('Erreur lors de l\'opération utilisateur:', error)
      showNotification("Erreur de connexion", 'error')
      return { success: false, error: "Erreur de connexion" }
    }
  }, [selectedUser, showNotification])

  const handleDeleteUser = useCallback(async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId))
        showNotification('Utilisateur supprimé avec succès !', 'success')
      } else {
        showNotification("Erreur lors de la suppression", 'error')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      showNotification("Erreur de connexion", 'error')
    }
  }, [showNotification])

  const handleCloseModals = useCallback(() => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }, [])

  // Vérifier que seul le super admin peut accéder
  if (!adminInfo?.role || adminInfo.role.code !== 'super_admin') {
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Gestion des Utilisateurs</h2>
        </div>
        <div className="empty-state">
          <p>Accès refusé. Seuls les super administrateurs peuvent gérer les utilisateurs.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Chargement des utilisateurs...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="tab-content">
        <div className="tab-header">
          <h2>Gestion des Utilisateurs</h2>
          {hasPermission('users.create') && (
            <Button
              onClick={handleCreateUser}
              variant="primary"
              size="small"
              title="+ Nouvel Utilisateur"
              className="create-button"
            >
              +
            </Button>
          )}
        </div>

        <div className="users-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    <div className="avatar-circle">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-date">
                      Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {user.email_verified_at && (
                      <span className="verified-badge">✓ Vérifié</span>
                    )}
                  </div>
                  <div className="user-actions">
                    {hasPermission('users.update') && (
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => handleEditUser(user)}
                      >
                        Modifier
                      </Button>
                    )}
                    {hasPermission('users.delete') && (
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Créer un nouvel utilisateur
              </h2>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <UserForm
                onSubmit={handleUserSubmit}
                onCancel={handleCloseModals}
                isEditing={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification d'utilisateur */}
      {isEditModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Modifier l'utilisateur
              </h2>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <UserForm
                user={selectedUser}
                onSubmit={handleUserSubmit}
                onCancel={handleCloseModals}
                isEditing={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersTab
