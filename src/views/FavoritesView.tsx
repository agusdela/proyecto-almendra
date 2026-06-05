/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Heart, Trash2, ArrowRight, ShoppingBag, FolderHeart } from 'lucide-react';

export default function FavoritesView() {
  const { wishlist, toggleWishlist, addToCart, setCurrentView } = useShop();

  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    // Redirect to cart
    setCurrentView('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="favorites-view-container">
      
      {/* 1. Page Header with bulk actions */}
      <div className="bg-brand-cream rounded-3xl p-6 sm:p-8 border border-brand-beige/20 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">MIS FAVORITOS</span>
          <h1 className="font-display font-extrabold text-2xl text-brand-charcoal tracking-tight">
            Lista de Deseos Guardados ({wishlist.length})
          </h1>
          <p className="text-xs text-slate-500 font-light max-w-lg leading-relaxed animate-pulse">
            Tus productos predilectos almacenados para realizar compras rápidas periódicas en un solo click.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="bg-brand-green-dark hover:bg-brand-green text-white font-sans font-bold text-xs py-3 px-5 sm:px-6 rounded-xl shadow cursor-pointer transition-all flex items-center gap-2 leading-none shrink-0"
            id="btn-favorites-bulk-add"
          >
            <ShoppingBag className="w-4 h-4 text-brand-beige" />
            <span>MUDAR TODOS AL CARRITO DE COMPRAS</span>
          </button>
        )}
      </div>

      {/* 2. Grid contents of saved cards */}
      {wishlist.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlist.map((prod) => (
              <div key={prod.id} className="relative group/fav">
                <ProductCard product={prod} />
                
                {/* Secondary manual eject trigger */}
                <button
                  onClick={() => toggleWishlist(prod)}
                  className="absolute bottom-4 left-4 z-10 text-[9px] font-bold text-red-500 hover:text-red-700 bg-white border border-red-100 rounded-lg p-1.5 flex items-center gap-1 shadow-sm opacity-0 group-hover/fav:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Quitar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty wishlist visual feedback */
        <div className="bg-white rounded-3xl border border-slate-150 py-16 px-4 text-center space-y-6 max-w-sm mx-auto shadow-sm">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green-dark border border-brand-green/20 rounded-full flex items-center justify-center mx-auto">
            <FolderHeart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-sm text-brand-charcoal uppercase">Tu lista está vacía</h3>
            <p className="font-sans text-xs text-slate-400 leading-normal font-light">
              Marcá los productos que más te gustan con el corazón ❤️ mientras explorás la tienda online para armar tu lista personalizada de compras mensuales.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-brand-green text-white py-2.5 px-6 rounded-xl font-sans font-bold text-xs shadow cursor-pointer text-center"
            id="btn-favs-empty-shop-now"
          >
            Explorar Tienda
          </button>
        </div>
      )}

    </div>
  );
}
