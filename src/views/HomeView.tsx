/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  HelpCircle, 
  Quote 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeView() {
  const { 
    products, 
    categories, 
    setCurrentView, 
    setSelectedCategorySlug 
  } = useShop();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
  };

  // Best seller products (Featured and rated higher)
  const bestSellers = products.filter(p => p.isFeatured && p.rating >= 4.8).slice(0, 4);

  return (
    <div className="space-y-16 animate-fade-in" id="home-view-container">
      
      {/* 1. Hero Section responsive */}
      <section className="relative bg-brand-cream py-20 px-6 sm:px-8 lg:px-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 overflow-hidden border border-brand-beige/20 shadow-sm" id="hero-banner">
        {/* Absolute fluid overlay designs instead of unrequested telemetry */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 hidden md:block select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1596560548464-f310df27e40d?q=80&w=800&auto=format&fit=crop" 
            alt="Organic food ingredients" 
            className="w-full h-full object-cover rounded-l-full"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green-dark text-xs font-sans font-extrabold px-3 py-1.5 rounded-full select-none uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVO EN ARGENTINA • CALIDAD ORGÁNICA</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-4xl sm:text-7xl text-brand-charcoal tracking-tight leading-none uppercase">
              Almendra
            </h1>
            <p className="font-display font-bold text-xl sm:text-3xl text-brand-green-dark tracking-wide uppercase">
              Almacén Natural
            </p>
          </div>
          
          <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
            Descubrí la mayor despensa natural selecta del país. Lotes certificados cosechados de forma consciente, libres de sulfitos, aditivos y conservantes artificiales. Sano de origen.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => { setSelectedCategorySlug(null); setCurrentView('shop'); }}
              className="bg-brand-green-dark hover:bg-brand-green text-white font-sans font-bold text-xs py-3.5 px-7 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-2"
              id="hero-cta-primary"
            >
              <span>CATÁLOGO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-sans font-bold text-xs py-3.5 px-6 rounded-xl hover:shadow transition-all cursor-pointer"
              id="hero-cta-secondary"
            >
              NUESTRA FILOSOFÍA
            </button>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Grid Section (10 Categories as requested) Categorías Destacadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="home-categories-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">FACILIDAD DE COMPRA</span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-charcoal tracking-tight mt-1">
              Explorá por Categorías Seleccionadas
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategorySlug(null); setCurrentView('shop'); }}
            className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1 cursor-pointer"
            id="see-all-categories-btn"
          >
            <span>Ver Toda la Tienda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const itemCount = products.filter(p => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group relative h-40 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-end p-4"
                id={`home-category-${cat.id}`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent z-10" />
                
                <div className="relative z-20 text-white font-sans">
                  <h3 className="font-display font-extrabold text-xs sm:text-sm tracking-tight leading-none group-hover:text-brand-beige transition-colors">{cat.name}</h3>
                  <span className="text-[10px] text-white/70 block mt-1 leading-none">{itemCount} Productos</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* 4. Best Seller Grid Rows Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="home-bestsellers-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-brand-green animate-bounce" />
              <span>ALTA ROTACIÓN</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-charcoal tracking-tight mt-1">
              Favoritos de Nuestra Comunidad
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategorySlug(null); setCurrentView('shop'); }}
            className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1 cursor-pointer"
            id="see-all-bestsellers-btn"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Clean, Professional Testimonials Block */}
      <section className="bg-brand-gray-light py-16 px-4" id="home-reviews-section">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">CLIENTES FELICES</span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-charcoal">Voces Reales de Nuestra Comunidad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {[
              { text: "El servicio de entrega en Belgrano tardó menos de 3 horas. Las almendras y frutos secos vienen perfectamente envasados, con un olor fresco increíble.", author: "Carolina Speranza (CABA)", rating: 5 },
              { text: "Agradezco la seriedad del empaque. Comprar Sin TACC suele ser un desafío por contaminación cruzada, pero en este almacén confío ciegamente.", author: "Daniel Gigliotti (Mendoza)", rating: 5 },
              { text: "La harina de almendras y la pasta de cajú son fantásticas. La molienda es hiperfina y el precio de 1kg conviene muchísimo.", author: "Ingrid Velásquez (Rosario)", rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative">
                <Quote className="w-8 h-8 text-slate-100 absolute top-4 right-4" />
                <p className="text-xs text-slate-500 leading-relaxed italic z-10">"{testimonial.text}"</p>
                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col">
                  <span className="text-xs font-bold text-brand-charcoal">{testimonial.author}</span>
                  <div className="flex items-center text-amber-500 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, rId) => (
                      <StarIcon key={rId} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// Inline Micro SVG helper for aesthetic reviews
function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );
}
