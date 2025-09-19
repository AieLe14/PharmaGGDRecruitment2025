"use client"

import { useState, useCallback, useRef } from "react"

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const initialValuesRef = useRef(initialValues)
  
  initialValuesRef.current = initialValues

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: null
        }
      }
      return prev
    })
  }, [])

  const setError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  const setFormError = useCallback((error) => {
    setErrors(prev => ({
      ...prev,
      form: error
    }))
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValue(name, type === 'checkbox' ? checked : value)
  }, [setValue])

  const reset = useCallback(() => {
    setValues(initialValuesRef.current)
    setErrors({})
    setLoading(false)
  }, [])

  const setLoadingState = useCallback((loading) => {
    setLoading(loading)
  }, [])

  return {
    values,
    errors,
    loading,
    setValue,
    setError,
    setFormError,
    handleChange,
    reset,
    setLoadingState
  }
}
