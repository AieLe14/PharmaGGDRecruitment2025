import { NextResponse } from "next/server"
import config from '@/lib/config'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    // Construire les paramètres de requête
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      category,
      sort,
      order
    })
    
    const response = await fetch(`${config.api.products}?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Erreur de récupération des produits" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("Erreur API products:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}