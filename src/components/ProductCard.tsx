/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Check, 
  Eye, 
  Leaf, 
  UtensilsCrossed 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { 
    currency, 
    toggleWishlist, 
    wishlist, 
    addToCart, 
    setCurrentView, 
    setSelectedProduct 
  } = useShop();

  const [addedSuccess, setAddedSuccess] = useState(false);

  const isFavorite = wishlist.some(item => item.id === product.id);

  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleProductDetailNav = () => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-150 p-4 transition-all duration-300 group relative flex flex-col justify-between cursor-pointer"
      onClick={handleProductDetailNav}
      id={`product-card-${product.id}`}
    >
      
      {/* 1. Header Badges & Actions */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          {product.discount && (
            <span className="text-[10px] font-sans font-extrabold bg-red-500 text-white py-1 px-2.5 rounded-full shadow-sm select-none uppercase tracking-wider">
              -{product.discount}% OFF
            </span>
          )}
          {product.isOrganic && (
            <span className="text-[9px] font-sans font-bold bg-emerald-600/90 text-white py-0.5 px-2 rounded-full shadow-sm flex items-center gap-0.5 select-none uppercase">
              <Leaf className="w-2.5 h-2.5" /> Orgánico
            </span>
          )}
          {product.isGlutenFree && (
            <span className="text-[9px] font-sans font-bold bg-[#FAF9F6] border border-orange-200 text-orange-600 py-0.5 px-2 rounded-full shadow-sm flex items-center gap-0.5 select-none uppercase font-semibold">
              <UtensilsCrossed className="w-2.5 h-2.5 text-orange-500" /> Sin TACC
            </span>
          )}
        </div>

        {/* Favorite Target Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm hover:scale-115 transition-all focus:outline-none cursor-pointer"
          aria-label={isFavorite ? "Eliminar de mis favoritos" : "Agregar a mis favoritos"}
          id={`product-card-fav-${product.id}`}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
        </button>

        {/* Product core Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Eye Details Hover Icon overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/95 text-brand-green-dark flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Metadata details */}
      <div className="flex-grow flex flex-col justify-between font-sans">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{product.brand}</span>
          <h3 className="text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-green-dark transition-colors line-clamp-2 mt-1 min-h-[36px]">
            {product.name}
          </h3>
          
          {/* Display Rating & Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="text-[11px] font-bold ml-1">{product.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviewsCount} opiniones)</span>
          </div>
        </div>

        {/* 3. Action buy and price row */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-brand-green-dark leading-none">
                {formatPrice(product.price)}
              </span>
              {product.previousPrice && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(product.previousPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-bold mt-1 block">{product.weight}</span>
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={product.stock <= 0}
            className={`py-2 px-3 sm:px-4 rounded-xl font-bold font-sans text-xs flex items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer select-none ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-green text-white hover:bg-brand-green-dark shadow-sm hover:shadow'
            }`}
            id={`product-card-add-btn-${product.id}`}
          >
            {product.stock <= 0 ? (
              <span>Sin Stock</span>
            ) : addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Listo</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
