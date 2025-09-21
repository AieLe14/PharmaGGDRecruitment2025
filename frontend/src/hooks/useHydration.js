"use client"

import { useState, useEffect } from 'react'

/**
 * Hook pour gérer l'hydratation côté client
 * Évite les problèmes de SSR/hydratation avec localStorage et autres APIs du navigateur
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook pour accéder à localStorage de manière sécurisée
 * Retourne null pendant SSR, puis la valeur après hydratation
 */
export const useLocalStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue)
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Erreur lors du chargement de ${key}:`, error)
      }
    }
  }, [key, isHydrated])

  const setStoredValue = (newValue) => {
    setValue(newValue)
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde de ${key}:`, error)
      }
    }
  }

  const removeStoredValue = () => {
    setValue(defaultValue)
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Erreur lors de la suppression de ${key}:`, error)
      }
    }
  }

  return [value, setStoredValue, removeStoredValue]
}
