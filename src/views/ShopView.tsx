/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { 
  ChevronDown, 
  LayoutGrid, 
  HelpCircle, 
  RefreshCcw, 
  Search, 
  BadgeAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';

type SortOption = 'relevancia' | 'precio-menor' | 'precio-mayor' | 'rating' | 'descuento';

export default function ShopView() {
  const { 
    products, 
    categories, 
    selectedCategorySlug, 
    setSelectedCategorySlug,
    searchQuery, 
    setSearchQuery,
    currency 
  } = useShop();

  // Filter States
  const [priceLimit, setPriceLimit] = useState(20000);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [dietFilter, setDietFilter] = useState({ glutenFree: false, vegan: false, organic: false });
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>('relevancia');

  // Mobile filters overlay toggler
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync shop category state when nav trigger changed
  const activeCategorySlug = selectedCategorySlug;

  const handleSetCategory = (slug: string | null) => {
    setSelectedCategorySlug(slug);
  };

  const resetAllFilters = () => {
    setPriceLimit(20000);
    setBrandFilter([]);
    setDietFilter({ glutenFree: false, vegan: false, organic: false });
    setMinRating(0);
    setSortOption('relevancia');
    setSearchQuery('');
    setSelectedCategorySlug(null);
  };

  // 1. Process Core Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Category check
      if (activeCategorySlug && prod.categoryId !== activeCategorySlug) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesBrand = prod.brand.toLowerCase().includes(query);
        const matchesCategory = prod.categoryId.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      // Diet checks (AND logic matching multiple diets)
      if (dietFilter.glutenFree && !prod.isGlutenFree) return false;
      if (dietFilter.vegan && !prod.isVegan) return false;
      if (dietFilter.organic && !prod.isOrganic) return false;
      
      // Brand check
      if (brandFilter.length > 0 && !brandFilter.includes(prod.brand)) return false;
      
      // Rating check
      if (minRating > 0 && prod.rating < minRating) return false;
      
      // Price limit check (taking account of selected currency)
      if (prod.price > priceLimit) return false;

      return true;
    });
  }, [products, activeCategorySlug, searchQuery, dietFilter, brandFilter, minRating, priceLimit]);

  // 2. Process Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'precio-menor':
        return list.sort((a, b) => a.price - b.price);
      case 'precio-mayor':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'descuento':
        return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'relevancia':
      default:
        return list; // default order based on seeding
    }
  }, [filteredProducts, sortOption]);

  const activeCategoryData = useMemo(() => {
    if (!activeCategorySlug) return null;
    return categories.find(c => c.slug === activeCategorySlug);
  }, [categories, activeCategorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="shop-view-container">
      
      {/* 1. Page Header with active category visual card banner */}
      <div className="bg-brand-cream rounded-3xl p-6 sm:p-8 border border-brand-beige/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">CATÁLOGO COMPLETO</span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal tracking-tight">
            {activeCategoryData ? activeCategoryData.name : 'Nuestra Tienda Online'}
          </h1>
          <p className="text-xs text-slate-500 font-light max-w-xl leading-relaxed">
            {activeCategoryData 
              ? activeCategoryData.description 
              : 'Explorá decenas de alimentos reales de molienda propia y cosechas orgánicas seleccionadas. Delivery con faja de sanidad e inocuidad garantizada.'}
          </p>
        </div>

        {/* Clear feedback metrics */}
        <div className="bg-white/80 border border-slate-150 py-2.5 px-4 rounded-2xl flex items-center gap-2 font-sans text-xs">
          <span className="text-slate-400 font-medium">Mostrando:</span>
          <span className="font-extrabold text-brand-green-dark">{sortedProducts.length}</span>
          <span className="text-slate-400 font-medium">de {products.length} productos</span>
        </div>
      </div>

      {/* 2. Top Sorters & Mobile Filters Trigger Row */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-150 py-3 px-4 rounded-2xl shadow-sm">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          id="btn-mobile-filters-trigger"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-green" />
          <span>Filtros</span>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <LayoutGrid className="w-4 h-4 text-brand-green" />
          <span>Vista de Cuadrícula</span>
        </div>

        {/* Dynamic feedback of search term if typing */}
        {searchQuery.trim() && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span>Resultados para: <span className="font-bold">"{searchQuery}"</span></span>
            <button onClick={() => setSearchQuery('')} className="p-0.5 hover:text-red-500 rounded"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="flex items-center gap-2 font-sans text-xs shrink-0 pl-1">
          <label htmlFor="sorting-select-box" className="text-slate-400 font-bold hidden sm:inline uppercase tracking-wider text-[11px]">Ordenar por:</label>
          <select
            id="sorting-select-box"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="border border-slate-200 rounded-xl py-1.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="relevancia">Relevancia / Predeterminado</option>
            <option value="precio-menor">Menor Precio</option>
            <option value="precio-mayor">Mayor Precio</option>
            <option value="rating">Mejor Calificados</option>
            <option value="descuento">Mejores Ofertas</option>
          </select>
        </div>
      </div>

      {/* 3. Catalog Base Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Filter Sidebar Columns (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          <FilterSidebar
            selectedCategory={activeCategorySlug}
            setSelectedCategory={handleSetCategory}
            priceLimit={priceLimit}
            setPriceLimit={setPriceLimit}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            dietFilter={dietFilter}
            setDietFilter={setDietFilter}
            minRating={minRating}
            setMinRating={setMinRating}
            resetAllFilters={resetAllFilters}
          />
        </div>

        {/* Right Active Grid Column */}
        <div className="lg:col-span-9 space-y-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {sortedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            /* Empty Case visual feedback */
            <div className="bg-white rounded-3xl border border-slate-150 py-16 px-4 text-center space-y-6 max-w-lg mx-auto shadow-inner">
              <div className="w-16 h-16 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-lg text-brand-charcoal">No encontramos productos coincidentes</h3>
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                  Ningún producto coincide con el conjunto de filtros seleccionados o el término de búsqueda ingresado. Intentá relajando los filtros de precio o dieta.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 bg-brand-green-dark hover:bg-brand-green text-white font-sans font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors cursor-pointer"
                id="btn-empty-reset-filters"
              >
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Limpiar Todos los Filtros
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 4. Portable mobile filter overlay drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end" id="mobile-filters-backdrop">
          <div className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-display font-extrabold text-sm text-brand-charcoal uppercase">Filtrar Catálogo</span>
              <button 
                onClick={() => setMobileFiltersOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              selectedCategory={activeCategorySlug}
              setSelectedCategory={handleSetCategory}
              priceLimit={priceLimit}
              setPriceLimit={setPriceLimit}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              dietFilter={dietFilter}
              setDietFilter={setDietFilter}
              minRating={minRating}
              setMinRating={setMinRating}
              resetAllFilters={resetAllFilters}
            />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 rounded-xl uppercase shadow"
            >
              Aplicar Filtros ({sortedProducts.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
