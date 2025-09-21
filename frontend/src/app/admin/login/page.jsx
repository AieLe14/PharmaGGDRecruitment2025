"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import '@/styles/auth.scss'

export default function AdminLoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)
	const router = useRouter()
	const { login } = useAdminAuth()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/login`
			
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({ email, password })
			})

			if (!response.ok) {
				const errorData = await response.json()
				setError(errorData.message || "Email ou mot de passe incorrect")
				return
			}

			const data = await response.json()

			if (!data.user?.role) {
				setError("Accès non autorisé. Seuls les administrateurs peuvent se connecter.")
				return
			}

			const sessionData = {
				user: data.user,
				token: data.token,
				userType: 'admin'
			}
			login(sessionData)

			setSuccess(true)
			setIsLoading(false)
			
			setTimeout(() => {
				router.push("/admin")
			}, 500)
		} catch (err) {
			setError("Erreur de connexion")
			setIsLoading(false)
		}
	}

	return (
		<div className="login-page admin">
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<h1 className="login-title admin">
							Connexion Administrateur
						</h1>
						<p className="login-subtitle admin">
							Accès réservé aux administrateurs
						</p>
					</div>

					<form className="login-form" onSubmit={handleSubmit}>
						{error && (
							<div className="error-message">
								{error}
							</div>
						)}
						
						{success && (
							<div className="success-message">
								✅ Connexion réussie ! Redirection en cours...
								<br />
								<button 
									type="button" 
									onClick={() => router.push("/admin")}
									className="btn-dashboard"
								>
									Aller au dashboard maintenant
								</button>
							</div>
						)}

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">Mot de passe</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="form-input"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="submit-button admin"
						>
							{isLoading ? "Connexion..." : "Se connecter"}
						</button>

						<div className="login-footer">
							<a href="/" className="back-link admin">
								← Retour à l'accueil
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}