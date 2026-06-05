/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Filter, 
  RotateCcw, 
  Star, 
  BadgeHelp, 
  Leaf, 
  Users, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  priceLimit: number;
  setPriceLimit: (price: number) => void;
  brandFilter: string[];
  setBrandFilter: React.Dispatch<React.SetStateAction<string[]>>;
  dietFilter: { glutenFree: boolean; vegan: boolean; organic: boolean };
  setDietFilter: React.Dispatch<React.SetStateAction<{ glutenFree: boolean; vegan: boolean; organic: boolean }>>;
  minRating: number;
  setMinRating: (rating: number) => void;
  resetAllFilters: () => void;
}

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  priceLimit,
  setPriceLimit,
  brandFilter,
  setBrandFilter,
  dietFilter,
  setDietFilter,
  minRating,
  setMinRating,
  resetAllFilters
}: FilterSidebarProps) {
  const { categories, products, currency } = useShop();

  // Extract unique brands in current product pool
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).slice(0, 8) as string[];

  const toggleBrand = (brandName: string) => {
    setBrandFilter(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName) 
        : [...prev, brandName]
    );
  };

  const toggleDiet = (key: 'glutenFree' | 'vegan' | 'organic') => {
    setDietFilter(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatPriceLabel = (arsAmt: number) => {
    if (currency === 'USD') return `u$s ${(arsAmt / 1000).toFixed(0)}`;
    return `$${arsAmt.toLocaleString('es-AR')}`;
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-150 p-5 space-y-6 font-sans w-full" id="catalog-filter-sidebar">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-display font-extrabold text-sm text-brand-charcoal uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-green" />
          <span>Filtros Avanzados</span>
        </div>
        <button
          onClick={resetAllFilters}
          className="text-[11px] font-sans font-bold text-slate-400 hover:text-brand-green-dark flex items-center gap-1 cursor-pointer transition-colors"
          id="btn-reset-all-filters"
        >
          <RotateCcw className="w-3 h-3" /> Limpiar
        </button>
      </div>

      {/* 1. Category Tree */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categorías</h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              selectedCategory === null 
                ? 'bg-brand-green/10 text-brand-green-dark' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Ver todas las categorías</span>
            <span className="text-[10px] opacity-60">({products.length})</span>
          </button>
          
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'bg-brand-green/10 text-brand-green-dark font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                id={`filter-category-select-${cat.id}`}
              >
                <span>{cat.name}</span>
                <span className="text-[10.5px] text-slate-400 font-bold">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Diets Checklist */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Frecuencias de Dieta</h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 text-xs text-brand-charcoal font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dietFilter.glutenFree}
              onChange={() => toggleDiet('glutenFree')}
              className="rounded text-brand-green focus:ring-brand-green w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase text-[9.5px]">Apto Celíaco / Sin TACC</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-brand-charcoal font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dietFilter.vegan}
              onChange={() => toggleDiet('vegan')}
              className="rounded text-brand-green focus:ring-brand-green w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase text-[9.5px]">Apto Vegano</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-brand-charcoal font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dietFilter.organic}
              onChange={() => toggleDiet('organic')}
              className="rounded text-brand-green focus:ring-brand-green w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase text-[9.5px]">Orgánico Certificado</span>
          </label>
        </div>
      </div>

      {/* 3. Range Selector de Precio */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precio Máximo</h4>
          <span className="text-xs font-bold text-brand-green-dark">{formatPriceLabel(priceLimit)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="20000"
          step="500"
          value={priceLimit}
          onChange={(e) => setPriceLimit(Number(e.target.value))}
          className="w-full accent-brand-green-dark h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          id="filter-price-slider"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
          <span>{formatPriceLabel(500)}</span>
          <span>{formatPriceLabel(20000)}</span>
        </div>
      </div>

      {/* 4. Brand List */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Marcas Seleccionadas</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {uniqueBrands.map(brandName => (
            <label 
              key={brandName} 
              className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none py-0.5"
            >
              <input
                type="checkbox"
                checked={brandFilter.includes(brandName)}
                onChange={() => toggleBrand(brandName)}
                className="rounded text-brand-green focus:ring-brand-green w-3.5 h-3.5 cursor-pointer"
              />
              <span>{brandName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Rating Stars Checklist */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Calificación Mínima</h4>
        <div className="space-y-1">
          {[5, 4.8, 4.6, 4].map(ratingValue => (
            <button
              key={ratingValue}
              onClick={() => setMinRating(ratingValue)}
              className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                minRating === ratingValue 
                  ? 'bg-amber-500/10 text-amber-800' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              id={`filter-rating-${ratingValue}`}
            >
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{ratingValue} o más</span>
              </div>
              <span className="text-[10px] text-slate-400">({products.filter(p => p.rating >= ratingValue).length})</span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
