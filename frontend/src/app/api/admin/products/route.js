import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (!token?.laravelAccessToken) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/admin/products`, {
			headers: {
				Authorization: `Bearer ${token.laravelAccessToken}`,
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			return NextResponse.json({ error: "Erreur de récupération des produits" }, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)

	} catch (error) {
		console.error("Erreur API admin/products:", error)
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
	}
}

export async function POST(req) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (!token?.laravelAccessToken) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		const body = await req.json()

		const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/admin/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token.laravelAccessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			const errorData = await response.json()
			return NextResponse.json({ error: errorData.message || "Erreur lors de la création du produit" }, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)

	} catch (error) {
		console.error("Erreur API admin/products POST:", error)
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
	}
}
