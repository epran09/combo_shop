import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ComboShop Nepal - Football Accessories & Combo Deals',
  description: 'Nepal\'s #1 online store for football accessories. Save big with combo deals on gloves, shin guards, socks, headbands, armbands and more. Prices in NPR. Delivery across Nepal.',
  keywords: 'football accessories nepal, football gear kathmandu, combo deals, shin guards, goalkeeper gloves, nepal football shop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
