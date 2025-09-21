"use client"

import { useState, useEffect } from "react"

export function useAdminAuth() {
	const [session, setSession] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		// Marquer comme hydraté côté client
		setIsHydrated(true)
		setIsLoading(false)
	}, [])

	useEffect(() => {
		if (!isHydrated) return
		
		const adminSession = localStorage.getItem('adminSession')
		
		if (adminSession) {
			try {
				const parsedSession = JSON.parse(adminSession)
				setSession(parsedSession)
			} catch (error) {
				localStorage.removeItem('adminSession')
				setSession(null)
			}
		} else {
			setSession(null)
		}
	}, [isHydrated])

	const login = (sessionData) => {
		setSession(sessionData)
		localStorage.setItem('adminSession', JSON.stringify(sessionData))
	}

	const logout = () => {
		setSession(null)
		localStorage.removeItem('adminSession')
	}

	return {
		session,
		isLoading: isLoading || !isHydrated,
		isAdmin: isHydrated && session?.userType === 'admin',
		login,
		logout
	}
}
