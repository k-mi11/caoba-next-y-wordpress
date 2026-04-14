import ChildrenWrapper from './children-wrapper';
import { Suspense } from 'react';
import FooterCustom from '@/components/custom/FooterCustom';
import { BannerCarousel } from '@/components/custom/BannerCarousel';
import CategorySectionMinimal from '@/components/custom/CategorySectionMinimal';
import { getCollections as getWooCollections } from '@/lib/woocommerce';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';

async function CategorySectionWrapper() {
  try {
    const collections = await getWooCollections();
    return <CategorySectionMinimal collections={collections} />;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WooNavbar />

      {/* Main container with margin-top for fixed navbar */}
      <div className="bg-white mt-32">
        <div className="relative overflow-hidden">
          <BannerCarousel />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#7f5534]/20 via-transparent to-[#422517]/35" />
        </div>

        <Suspense fallback={<div className="h-40 bg-[#f8f7f4]" />}>
          <CategorySectionWrapper />
        </Suspense>

        <div className="mx-auto max-w-screen-2xl px-4 text-black">
          {/* Contenido principal (centrado con max-width) */}
          <main>
            <Suspense fallback={null}>
              <ChildrenWrapper>{children}</ChildrenWrapper>
            </Suspense>
          </main>
        </div>
      </div>

      <FooterCustom />
    </>
  );
}
