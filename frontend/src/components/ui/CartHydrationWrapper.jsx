"use client"

import { useCart } from "@/contexts/CartContext"
import CartButton from "@/components/cart/CartButton"
import CartHeader from "@/components/ui/CartHeader"

const CartHydrationWrapper = ({ type = 'button' }) => {
  const { isHydrated } = useCart()

  // Ne pas afficher le composant panier avant l'hydratation
  if (!isHydrated) {
    return null
  }

  // Afficher le composant approprié après hydratation
  return type === 'header' ? <CartHeader /> : <CartButton />
}

export default CartHydrationWrapper
