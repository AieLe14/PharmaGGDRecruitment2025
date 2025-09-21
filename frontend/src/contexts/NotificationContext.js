"use client"

import { createContext, useContext, useState, useCallback } from "react"

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [counter, setCounter] = useState(0)

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = `notification-${Date.now()}-${counter}`
    setCounter(prev => prev + 1)
    const notification = { id, message, type }
    
    setNotifications(prev => [...prev, notification])
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
    
    return id
  }, [])

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value = {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
