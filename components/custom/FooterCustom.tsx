'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-[#4B2B1B] text-[#E9D8C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold tracking-wider">
                <span className="text-[#ffdd9c]">Tienda Caoba</span>
              </div>
            </div>
            <p className="text-[#C4AE95] mb-6 leading-relaxed">
              Moda femenina mayorista con una propuesta elegante y de alta calidad. Ropa al por mayor para tiendas que buscan estilo y presencia.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Nuestras Políticas */}
          <div>
            <h4 className="text-lg mb-6 text-[#ffdd9c]">Nuestras Políticas</h4>
            <ul className="space-y-3">
              <li><Link href="/politica-proteccion-datos" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">Política de protección de datos</Link></li>
              <li><Link href="/politica-reembolso" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">Política de Reembolso</Link></li>
              <li><Link href="/politica-envios" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">Política de Envíos</Link></li>
              <li><Link href="/terminos-y-condiciones" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Espacio vacío para mantener layout de 4 columnas */}
          <div className="hidden lg:block"></div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg mb-6 text-[#ffdd9c]">Contacto</h4>
            <p className="text-[#C4AE95] mb-4">
              Escríbenos para consultas comerciales, pedidos o información de stock.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#ffdd9c] flex-shrink-0" />
                <a href="tel:+573116464677" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">
                  +57 311 6464677
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#ffdd9c] flex-shrink-0" />
                <a href="mailto:tiendacaoba0@gmail.com" className="text-[#C4AE95] hover:text-[#ffdd9c] transition-colors duration-200">
                  tiendacaoba0@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#7A4A32] mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-[#C4AE95] text-sm">
              {new Date().getFullYear()} Tienda Caoba. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <span className="text-[#C4AE95] text-sm">
                Cali, Colombia
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}