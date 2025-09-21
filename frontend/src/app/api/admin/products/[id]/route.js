import { NextResponse } from "next/server"
import config from '@/lib/config'
import { getToken } from "next-auth/jwt"

export async function GET(req, { params }) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (!token?.laravelAccessToken) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		const { id } = params

		const response = await fetch(`${config.api.adminProducts}/${id}`, {
			headers: {
				Authorization: `Bearer ${token.laravelAccessToken}`,
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			return NextResponse.json({ error: "Erreur de récupération du produit" }, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)

	} catch (error) {
		console.error("Erreur API admin/products/[id] GET:", error)
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
	}
}

export async function PUT(req, { params }) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (!token?.laravelAccessToken) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		const { id } = params
		const body = await req.json()

		const response = await fetch(`${config.api.adminProducts}/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token.laravelAccessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			const errorData = await response.json()
			return NextResponse.json({ error: errorData.message || "Erreur lors de la mise à jour du produit" }, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)

	} catch (error) {
		console.error("Erreur API admin/products/[id] PUT:", error)
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
	}
}

export async function DELETE(req, { params }) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (!token?.laravelAccessToken) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		const { id } = params

		const response = await fetch(`${config.api.adminProducts}/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token.laravelAccessToken}`,
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			const errorData = await response.json()
			return NextResponse.json({ error: errorData.message || "Erreur lors de la suppression du produit" }, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)

	} catch (error) {
		console.error("Erreur API admin/products/[id] DELETE:", error)
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
	}
}
