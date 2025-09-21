"use client"

import { useState, useCallback } from "react"

export const useCartAnimation = () => {
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [animationData, setAnimationData] = useState({ quantity: 1, productName: '' })

  const triggerAnimation = useCallback((quantity = 1, productName = '') => {
    setAnimationData({ quantity, productName })
    setAnimationTrigger(prev => prev + 1)
  }, [])

  return {
    animationTrigger,
    animationData,
    triggerAnimation
  }
}