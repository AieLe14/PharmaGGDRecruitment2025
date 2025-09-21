"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AdminContext = createContext()

export function AdminProvider({ children }) {
	const [session, setSession] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Hydratation côté client uniquement
		if (typeof window !== 'undefined') {
			const adminSession = localStorage.getItem('adminSession')
			
			if (adminSession) {
				try {
					const parsedSession = JSON.parse(adminSession)
					setSession(parsedSession)
				} catch (error) {
					localStorage.removeItem('adminSession')
				}
			}
		}
		setIsLoading(false)
	}, [])

	const value = {
		session,
		isLoading,
		isAdmin: session?.userType === 'admin',
		setSession
	}

	return (
		<AdminContext.Provider value={value}>
			{children}
		</AdminContext.Provider>
	)
}

export function useAdmin() {
	const context = useContext(AdminContext)
	if (!context) {
		throw new Error("useAdmin must be used within an AdminProvider")
	}
	return context
}
