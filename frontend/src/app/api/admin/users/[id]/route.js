import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request, { params }) {
  try {
    // Récupérer le token NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
      cookieName: "admin.session-token"
    })

    if (!token?.laravelAccessToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = params

    // Faire la requête vers Laravel
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.laravelAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API user GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Récupérer le token NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
      cookieName: "admin.session-token"
    })

    if (!token?.laravelAccessToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Faire la requête vers Laravel
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.laravelAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API user PUT:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Récupérer le token NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
      cookieName: "admin.session-token"
    })

    if (!token?.laravelAccessToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = params

    // Faire la requête vers Laravel
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.laravelAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API user DELETE:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
