import type { Metadata } from 'next';
import './globals.css';
import { RecentlyViewedProvider } from '@/components/providers/RecentlyViewedProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/structured-data';
import { JsonLdScript } from '@/lib/json-ld-script';

export const metadata: Metadata = {
  title: {
    default: 'Tienda Caoba - Moda Femenina al por Mayor',
    template: '%s | Tienda Caoba'
  },
  description: 'Tienda Caoba ofrece moda femenina mayorista con una estética elegante, profesional y de alta calidad.',
  keywords: ['moda femenina', 'ropa al por mayor', 'mayorista', 'elegancia', 'calidad', 'Tienda Caoba'],
  authors: [{ name: 'Tienda Caoba' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tiendacaoba.com',
    siteName: 'Tienda Caoba',
    title: 'Tienda Caoba - Moda Femenina al por Mayor',
    description: 'Descubre la colección mayorista de Tienda Caoba: prendas femeninas con estilo, elegancia y calidad.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="es">
      <head>
        {/* Structured Data global para SEO */}
        <JsonLdScript data={organizationSchema} />
        <JsonLdScript data={webSiteSchema} />
      </head>
      <body className="antialiased">
        {/* Skip Link para accesibilidad - permite saltar al contenido principal */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Saltar al contenido principal
        </a>

        <CartProvider>
          <RecentlyViewedProvider>
            {children}
          </RecentlyViewedProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
