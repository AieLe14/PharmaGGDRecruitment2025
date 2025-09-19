"use client"

import { adminLogout } from "@/server/adminAuth"
import '@/styles/dashboard.scss'

export default function AdminDashboard() {
	const handleLogout = async () => {
		await adminLogout()
		window.location.href = "/admin"
	}

	return (
		<div className="dashboard-page admin">
			{/* Header */}
			<header className="dashboard-header">
				<div className="dashboard-header-content">
					<h1 className="dashboard-title">
						Dashboard Administrateur
					</h1>
					<div className="dashboard-user-section">
						<button
							onClick={handleLogout}
							className="logout-button admin"
						>
							Déconnexion
						</button>
					</div>
				</div>
			</header>
		</div>
	)
}