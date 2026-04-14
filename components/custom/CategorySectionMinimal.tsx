'use client'
import { useRef, useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from 'next/link';

interface Collection {
  title: string;
  handle: string;
  path: string;
  image?: {
    url: string;
    altText?: string;
  };
}

interface CategorySectionMinimalProps {
  collections: Collection[];
}

export default function CategorySectionMinimal({ collections }: CategorySectionMinimalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const getCategoryImage = (handle: string): string => {
    const handleLower = handle.toLowerCase();
    if (handleLower.includes('cinturon')) return '/cinturones.webp';
    if (handleLower.includes('gorra')) return '/gorras.webp';
    if (handleLower.includes('tarjetero') || handleLower.includes('billetera')) return '/tarjeteros.webp';
    if (handleLower.includes('saco')) return '/sacos.webp';
    if (handleLower.includes('maleta')) return '/sacos.webp';
    if (handleLower.includes('media')) return '/tarjeteros.webp';
    if (handleLower.includes('camiseta')) return '/sacos.webp';
    if (handleLower.includes('combo')) return '/cinturones.webp';
    return '/sacos.webp';
  };

  // Definir categorías fijas en el orden correcto
  const fixedCategories = [
    { title: 'Superior', handle: 'superior', path: '/search/superior' },
    { title: 'Inferior', handle: 'inferior', path: '/search/inferior' },
    { title: 'Conjuntos', handle: 'conjuntos', path: '/search/conjuntos' },
    { title: 'Calzado', handle: 'calzado', path: '/search/calzado' },
    { title: 'Accesorios', handle: 'accesorios', path: '/search/accesorios' },
    { title: 'Lencería', handle: 'lenceria', path: '/search/lenceria' }
  ];

  // Buscar las imágenes reales de WooCommerce para nuestras categorías fijas
  const validCollections = fixedCategories.map(category => {
    // Buscar si existe una colección de WooCommerce que coincida con nuestra categoría fija
    const wooCategory = collections.find(c => 
      c.handle.toLowerCase() === category.handle.toLowerCase()
    );
    
    // Usar la imagen de WooCommerce si existe, sino usar la imagen local por defecto
    const imageSrc = wooCategory?.image?.url || getCategoryImage(category.handle);
    
    return {
      ...category,
      imageSrc: imageSrc
    };
  });

  // Duplicar colecciones para scroll infinito (solo 2 veces para mejor rendimiento)
  const infiniteCollections = [...validCollections, ...validCollections];

  // Inicializar en el medio para permitir scroll en ambas direcciones
  useEffect(() => {
    if (scrollContainerRef.current && validCollections.length > 0) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // 300px + 20px gap para categorías más grandes
      const initialScroll = cardWidth * validCollections.length;
      container.scrollLeft = initialScroll;
    }
  }, [validCollections.length]);

  // Manejar el loop infinito
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isScrolling) return;

    const container = scrollContainerRef.current;
    const cardWidth = 320; // 300px + 20px gap para categorías más grandes
    const totalOriginalWidth = cardWidth * validCollections.length;

    // Si llegamos muy al inicio, saltar al medio
    if (container.scrollLeft < cardWidth) {
      setIsScrolling(true);
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollLeft + totalOriginalWidth;
      container.style.scrollBehavior = 'smooth';
      setTimeout(() => setIsScrolling(false), 50);
    }

    // Si llegamos muy al final, saltar al medio
    if (container.scrollLeft > totalOriginalWidth * 2 - container.clientWidth) {
      setIsScrolling(true);
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollLeft - totalOriginalWidth;
      container.style.scrollBehavior = 'smooth';
      setTimeout(() => setIsScrolling(false), 50);
    }
  }, [isScrolling, validCollections.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (validCollections.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 640; // Mayor scroll para categorías más grandes (300px + 20px gap + padding)
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl">

          {/* Botón izquierdo */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-[#E9D8C2] text-[#5B3A29] shadow-lg rounded-full border border-[#B58D5E] transition-all duration-300 hover:bg-[#5B3A29] hover:text-[#F7EFE2] hover:border-[#5B3A29] cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Botón derecho */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-[#E9D8C2] text-[#5B3A29] shadow-lg rounded-full border border-[#B58D5E] transition-all duration-300 hover:bg-[#5B3A29] hover:text-[#F7EFE2] hover:border-[#5B3A29] cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scroll-smooth px-6"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              WebkitOverflowScrolling: 'touch',
              maxWidth: 'calc(4 * 300px + 3 * 20px + 48px)' // 4 cards + 3 gaps + padding
            }}
          >
            {infiniteCollections.map((category, index) => (
              <Link
                key={`${category.handle}-${index}`}
                href={category.path}
                className="group shrink-0 w-[280px] sm:w-[300px]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-2">
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    sizes="300px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#5B3A29]/0 group-hover:bg-[#5B3A29]/20 transition-all duration-300 rounded-lg" />
                </div>
                <p className="text-sm sm:text-base text-center text-[#5B3A29] group-hover:text-[#8f6b4f] transition-colors duration-300 font-medium">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
