/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  PhoneCall, 
  MapPin, 
  Clock, 
  MessageSquareHeart, 
  ShieldCheck, 
  Navigation,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  const { setCurrentView, setSelectedCategorySlug, categories } = useShop();

  const handleCategoryNav = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t-4 border-brand-green-dark" id="site-footer">
      {/* Upper Certifications Trust Banner */}
      <div className="bg-brand-gray-light border-y border-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green-dark shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Calidad Orgánica</p>
              <p className="text-[11px] text-slate-500">100% libre de herbicidas nocivos.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green-dark shrink-0">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Apto Celíacos</p>
              <p className="text-[11px] text-slate-500">Certificación Sin TACC homologada.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green-dark shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Envíos Rápidos</p>
              <p className="text-[11px] text-slate-500">Envíos programados express puerta a puerta.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green-dark shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Atención Premium</p>
              <p className="text-[11px] text-slate-500">Soporte personalizado vía WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Company Profile & Badges */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
              <span className="font-display font-black text-white text-xs">A</span>
            </div>
            <span className="font-display font-extrabold text-white text-base tracking-tight">ALMENDRA</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Inspiramos un estilo de vida más saludable en toda la Argentina, proveyendo granos, frutos secos y delicias gourmet cosechadas respetuosamente bajo los máximos estándares de calidad orgánica.
          </p>
          
          {/* Aesthetic Badges */}
          <div className="flex items-center gap-2 pt-2">
            <div className="text-[9px] font-bold text-slate-800 bg-emerald-500/10 border border-emerald-500/20 py-1 px-2.5 rounded-full uppercase">
              100% Orgánico
            </div>
            <div className="text-[9px] font-bold text-orange-500/10 border border-orange-500/20 py-1 px-2.5 rounded-full uppercase">
              Sin TACC
            </div>
            <div className="text-[9px] font-bold text-sky-500/10 border border-sky-500/20 py-1 px-2.5 rounded-full uppercase">
              Vegano
            </div>
          </div>
        </div>

        {/* Column 2: Categories Shortcuts */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-brand-green pl-2 mb-4">Secciones</h3>
          <ul className="space-y-2.5 text-xs font-medium">
            {categories.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryNav(cat.slug)}
                  className="hover:text-white hover:translate-x-1 hover:underline transition-all cursor-pointer flex items-center gap-1.5"
                  id={`footer-category-link-${cat.id}`}
                >
                  <ArrowUpRight className="w-3 h-3 text-brand-green" />
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Help / Customer Service */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-brand-green pl-2 mb-4">Ayuda & Guías</h3>
          <ul className="space-y-2.5 text-xs">
            {[
              { label: 'Preguntas Frecuentes (FAQ)', view: 'contact' },
              { label: 'Términos & Condiciones de Compra', view: 'about' },
              { label: 'Políticas de Envío y Devoluciones', view: 'about' },
              { label: 'Sucursales & Puntos de Retiro', view: 'contact' },
              { label: 'Defensa del Consumidor', view: 'contact' }
            ].map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentView(item.view as any)}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400 font-light hover:underline block text-left"
                  id={`footer-help-link-${i}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Location Contact Info */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-brand-green pl-2 mb-4">Contacto</h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <a 
                href="https://www.google.com/maps/search/?api=1&query=-31.706861,-65.020361" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors hover:underline"
              >
                Coordenadas: 31°42'24.7"S 65°01'13.3"W (Ver mapa)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-green shrink-0" />
              <a href="mailto:hola@almendra.almacennatural.com" className="hover:text-white transition-colors">hola@almendra.almacennatural.com</a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-brand-green shrink-0" />
              <a href="https://wa.me/5493544635404" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-bold text-brand-green animate-pulse">
                WhatsApp: +54 9 3544 63-5404
              </a>
            </li>
            <li className="flex items-center gap-2 pt-2">
              <a href="https://www.instagram.com/almendra_almacennatural_?igsh=MWEwa2t4dWxwdWZnZw==" target="_blank" rel="noopener noreferrer" aria-label="Visitar Instagram">
                <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-400 cursor-pointer transition-colors" />
              </a>
              <a href="https://www.facebook.com/share/18c8EitSfW/" target="_blank" rel="noopener noreferrer" aria-label="Visitar Facebook">
                <Facebook className="w-5 h-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors pl-1" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub Footer with payment legalities and copyright */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-500">
          <div>
            <span>© {currentYear} Almendra — Almacén Natural. Todos los derechos reservados • Elaborado con estándares de accesibilidad WCAG AA.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] uppercase font-bold tracking-wider">Métodos de Pago:</span>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="font-extrabold text-[10px] text-white">VISA</span>
              <span className="font-bold text-[10px] text-brand-green ml-1">MP</span> {/* MercadoPago */}
              <span className="font-semibold text-[10px] text-slate-400 ml-1">EFECTIVO / TRANSF.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
