import '@/styles/globals.scss';
import { CartProvider } from '@/contexts/CartContext';
import CartButton from '@/components/cart/CartButton';

export const metadata = {
  title: 'Pharma GGD',
  description: 'Application e-commerce pharmaceutique',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
          <CartButton />
        </CartProvider>
      </body>
    </html>
  )
}