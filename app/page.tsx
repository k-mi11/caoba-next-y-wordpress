import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * NUEVA HOME PAGE - WooCommerce
 * Versión limpia sin dependencias de Shopify
 */

// Conexión WooCommerce
import {
  getProducts as getWooProducts,
  getCollections as getWooCollections
} from '@/lib/woocommerce';

// Componentes simples
import { ProductCard } from '@/components/ui/product-card';
import CategorySectionMinimal from '@/components/custom/CategorySectionMinimal';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import { BannerCarousel } from '@/components/custom/BannerCarousel';

export const metadata = {
  title: 'Pinneacle Perfumería - Tu Tienda Online de Perfumería y Belleza',
  description: 'Descubre los mejores productos de perfumería, belleza y cuidado personal en Pinneacle Perfumería. Calidad premium y los mejores precios.',
  keywords: 'perfumería, belleza, cuidado personal, cosméticos, tienda online, Pinneacle Perfumería',
};

async function getFeaturedProducts() {
  try {
    console.log('📦 Fetching productos...');

    // Importar directamente los tipos y query necesarios
    const { woocommerceFetch } = await import('@/lib/woocommerce');
    const { getProductsQuery } = await import('@/lib/woocommerce/queries/product');

    // Hacer fetch directo a WooCommerce sin reshape
    const res = await woocommerceFetch<any>({
      query: getProductsQuery,
      variables: {}
    });

    const products = res.body.data.products?.nodes || [];

    console.log('✅ Productos OBTENIDOS DIRECTAMENTE DE WOOCOMMERCE:');
    console.table(products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      hasImage: !!p.image
    })));

    if (!products || products.length === 0) {
      console.log('⚠️ No hay productos');
      return [];
    }

    // Adaptar a formato simple
    const adapted = products.slice(0, 8).map((product: any) => {
      const adaptedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price || 'Precio no disponible',
        image: product.image?.sourceUrl || product.image?.url || '/placeholder.jpg',
        category: 'Accesorios',
        description: product.description || product.shortDescription || ''
      };
      console.log('🔄 Producto adaptado:', adaptedProduct);
      return adaptedProduct;
    });

    console.log('✅ Productos adaptados:', adapted);

    return adapted;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    console.error('Error completo:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const collections = await getWooCollections();

    if (!collections || collections.length === 0) {
      return [];
    }

    // Adaptar a formato compatible con CategorySectionMinimal
    return collections
      .filter((collection: any) =>
        collection.handle &&
        collection.handle !== 'undefined' &&
        collection.handle !== '' &&
        collection.handle !== 'all' &&
        !collection.handle.toLowerCase().includes('uncategorized')
      )
      .map((collection: any) => ({
        title: collection.title || collection.name,
        handle: collection.handle,
        path: collection.path || `/search/${collection.handle}`,
        image: {
          url: collection.image?.url || collection.image?.sourceUrl || '/placeholder-category.jpg',
          altText: collection.title || collection.name
        }
      }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  // Obtener datos en paralelo
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <>
      <WooNavbar />
      <main id="main-content" className="min-h-screen bg-[#F7EFE2] text-[#2B1A12]" tabIndex={-1}>
        <section className="relative overflow-hidden">
          <BannerCarousel />
          <div className="absolute inset-0 bg-gradient-to-b from-[#6A432D]/15 via-transparent to-[#4B2B1B]/35" />
        </section>

        {categories.length > 0 && (
          <section className="py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7A6A5D]">Colecciones destacadas</p>
                <h2 className="mt-4 text-3xl font-bold text-[#322018] sm:text-4xl">
                  Categorías que inspiran confianza
                </h2>
                <p className="mt-4 text-base leading-7 text-[#5B3A29]/85">
                  Explora nuestra selección de ropa femenina mayorista, pensada para ofrecer variedad sin perder la elegancia que tu negocio merece.
                </p>
              </div>
            </div>
            <CategorySectionMinimal collections={categories} />
          </section>
        )}

      {/* Productos Destacados */}
      {products.length > 0 && (
        <section className="py-16 bg-[#F7EFE2]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7A6A5D]">Selección premium</p>
                <h2 className="mt-4 text-3xl font-bold text-[#322018] sm:text-4xl">
                  Los más buscados
                </h2>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-[#B58D5E] bg-white px-6 py-3 text-sm font-semibold text-[#5B3A29] shadow-sm transition hover:bg-[#fbf4ea]"
              >
                Ver todos los productos →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterCustom />
    </main>
    </>
  );
}
