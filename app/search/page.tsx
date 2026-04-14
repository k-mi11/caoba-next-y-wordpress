import Link from 'next/link';
import { formatPrice } from '@/lib/woocommerce/cart';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import CategorySectionSearch from '@/components/custom/CategorySectionSearch';
import { getCollections } from '@/lib/woocommerce';

/**
 * PÁGINA DE TODOS LOS PRODUCTOS - WooCommerce
 * Muestra TODOS los productos en un grid
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todos los Productos - Tienda Caoba',
  description: 'Explora nuestro catálogo completo de ropa femenina mayorista.',
};

async function getAllProducts() {
  try {
    const { woocommerceFetch } = await import('@/lib/woocommerce');
    const { getProductsQuery } = await import('@/lib/woocommerce/queries/product');

    const res = await woocommerceFetch<any>({
      query: getProductsQuery,
      variables: {}
    });

    const products = res.body.data.products?.nodes || [];

    // Adaptar a formato simple
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price || 'Precio no disponible',
      image: product.image?.sourceUrl || product.image?.url || '/placeholder.jpg',
      shortDescription: product.shortDescription || '',
      stockStatus: product.stockStatus
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const collections = await getCollections();

    if (!collections || collections.length === 0) {
      return [];
    }

    // Adaptar a formato compatible con CategorySectionSearch
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

export default async function SearchPage() {
  // Obtener datos en paralelo
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories()
  ]);

  return (
    <>
      <WooNavbar />
      <main id="main-content" className="min-h-screen bg-[#F7EFE2] text-[#2B1A12]" tabIndex={-1}>
        {/* Categorías - Componente aparte para modificaciones */}
        {categories.length > 0 && (
          <section>
            <CategorySectionSearch collections={categories} />
          </section>
        )}

        {/* Grid de productos */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-[#322018] mb-2">
                No hay productos disponibles
              </h2>
              <p className="text-[#5B3A29] mb-6">
                Lo sentimos, no encontramos productos en este momento.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#B58D5E] bg-[#5B3A29] text-white px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#8f6b4f]"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block bg-white rounded-lg border border-[#B58D5E] hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#322018] mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg text-[#5B3A29] font-medium mb-2">
                      {formatPrice(product.price)}
                    </p>

                    {/* Stock status */}
                    {product.stockStatus && (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        product.stockStatus === 'IN_STOCK'
                          ? 'bg-green-100 text-green-800'
                          : product.stockStatus === 'OUT_OF_STOCK'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.stockStatus === 'IN_STOCK' && 'En stock'}
                        {product.stockStatus === 'OUT_OF_STOCK' && 'Agotado'}
                        {product.stockStatus === 'ON_BACKORDER' && 'Bajo pedido'}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
