import ChildrenWrapper from './children-wrapper';
import { Suspense } from 'react';
import FooterCustom from '@/components/custom/FooterCustom';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';

export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WooNavbar />

      {/* Main container with margin-top for fixed navbar */}
      <div className="bg-[#F7EFE2] mt-32 min-h-screen">
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
