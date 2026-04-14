/**
 * Structured Data (JSON-LD) para SEO
 * Implementa schema.org para mejorar la visibilidad en Google
 */

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: string;
  priceCurrency: string;
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
  brand?: string;
  sku?: string;
  url: string;
}

/**
 * Genera JSON-LD para un producto individual
 */
export function generateProductSchema(product: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    brand: product.brand || {
      '@type': 'Brand',
      name: 'Pinneacle Perfumería',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency,
      availability: product.availability,
      url: product.url,
      seller: {
        '@type': 'Organization',
        name: 'Pinneacle Perfumería',
        url: 'https://pinneacleperfumeria.com',
      },
    },
  };

  return schema;
}

/**
 * Genera JSON-LD para la organización
 */
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pinneacle Perfumería',
    url: 'https://pinneacleperfumeria.com',
    logo: 'https://pinneacleperfumeria.com/logo.png',
    description: 'Tu tienda online de perfumería y belleza en Chile',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56-9-4615-2919',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressLocality: 'Santiago',
    },
    sameAs: [
      'https://www.instagram.com/pinneacleperfumeria',
      'https://www.facebook.com/pinneacleperfumeria',
    ],
  };

  return schema;
}

/**
 * Genera JSON-LD para breadcrumbs
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return schema;
}

/**
 * Genera JSON-LD para el sitio web
 */
export function generateWebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pinneacle Perfumería',
    url: 'https://pinneacleperfumeria.com',
    description: 'Tu tienda online de perfumería y belleza en Chile',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pinneacleperfumeria.com/search?q={search_term_string}',
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string',
      },
    },
  };

  return schema;
}
