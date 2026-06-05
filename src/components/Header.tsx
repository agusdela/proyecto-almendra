/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useShop, ActiveView } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  MapPin, 
  DollarSign, 
  Search, 
  X, 
  History, 
  TrendingUp, 
  Menu, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    products,
    categories,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    currency,
    setCurrency,
    locationProvince,
    setLocationProvince,
    setSelectedProduct,
    setSelectedCategorySlug,
    getCartSubtotal
  } = useShop();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for autocomplete suggestion
  const suggestions = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      setIsSearchOpen(false);
      setSelectedCategorySlug(null);
      setCurrentView('shop');
    }
  };

  const handleSuggestionClick = (prod: any) => {
    addToSearchHistory(prod.name);
    setSelectedProduct(prod);
    setCurrentView('product-detail');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    addToSearchHistory(term);
    setIsSearchOpen(false);
    setSelectedCategorySlug(null);
    setCurrentView('shop');
  };

  const handleQuickCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
    setIsSearchOpen(false);
  };

  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full" id="site-header">
      {/* 1. Ticker / Announcement Bar */}
      <div className="bg-brand-green-dark text-white text-[11px] sm:text-xs font-sans py-2 px-4 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 border-b border-white/10">
        <div className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-brand-beige animate-pulse" />
          <span>Envíos GRATIS en CABA desde $20.000 • GBA desde $25.000 • Interior desde $35.000</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-sans">
          {/* Province Selector Selector de ubicación */}
          <div className="relative flex items-center gap-1 hover:text-brand-beige transition-colors cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-brand-beige" />
            <select 
              value={locationProvince} 
              onChange={(e) => {
                setLocationProvince(e.target.value);
                setShowLocationAlert(true);
                setTimeout(() => setShowLocationAlert(false), 3000);
              }}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer text-xs font-semibold"
              aria-label="Seleccionar ubicación de entrega"
            >
              <option value="CABA" className="text-brand-charcoal">Envíos a CABA</option>
              <option value="GBA" className="text-brand-charcoal">Envíos a GBA</option>
              <option value="Interior" className="text-brand-charcoal">Envíos a Resto del País</option>
            </select>
          </div>

          {/* Currency Selector Selector de moneda */}
          <div className="flex items-center gap-1 hover:text-brand-beige transition-colors border-l border-white/20 pl-3">
            <DollarSign className="w-3.5 h-3.5 text-brand-beige" />
            <button 
              onClick={() => setCurrency(currency === 'ARS' ? 'USD' : 'ARS')}
              className="focus:outline-none cursor-pointer text-xs font-semibold flex items-center gap-0.5"
              aria-label="Cambiar moneda"
            >
              <span>{currency === 'ARS' ? 'Pesos (ARS)' : 'Dólares (USD)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Notification Banner for Location change */}
      <AnimatePresence>
        {showLocationAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-brand-green text-white text-center py-2 text-xs font-sans font-medium shadow-md z-40"
          >
            ✓ Ubicación actualizada a: <span className="font-bold underline">{locationProvince === 'CABA' ? 'Ciudad de Buenos Aires' : locationProvince === 'GBA' ? 'Gran Buenos Aires' : 'Interior del País'}</span>. Tarifas de envío e importes mínimos de bonificación recalculados.
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile hamburger menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-brand-charcoal hover:text-brand-green-dark focus:outline-none"
            aria-label="Abrir menú"
            id="mobile-menu-trigger"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Brand */}
          <div 
            onClick={() => { setCurrentView('home'); setSelectedCategorySlug(null); }} 
            className="flex items-center gap-2 cursor-pointer select-none group"
            id="site-logo"
          >
            <div className="w-9 h-9 rounded-full bg-brand-green-dark flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-white text-base">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-brand-charcoal text-base sm:text-lg tracking-tight leading-none group-hover:text-brand-green-dark transition-colors">ALMENDRA</span>
              <span className="text-[9px] font-sans font-bold text-brand-green tracking-widest uppercase leading-none mt-0.5">Almacén Natural</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-semibold text-xs lg:text-sm text-slate-600">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'shop', label: 'Tienda' },
              { id: 'about', label: 'Nosotros' },
              { id: 'blog', label: 'Blog' },
              { id: 'contact', label: 'Contacto' }
            ].map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setCurrentView(link.id as ActiveView);
                }}
                className={`relative py-1 hover:text-brand-green-dark transition-colors focus:outline-none cursor-pointer ${
                  currentView === link.id || (link.id === 'shop' && currentView === 'product-detail')
                    ? 'text-brand-green-dark' 
                    : ''
                }`}
                id={`nav-link-${link.id}`}
              >
                <span>{link.label}</span>
                {(currentView === link.id || (link.id === 'shop' && currentView === 'product-detail')) && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Search, Favorites, Profile, Cart Section */}
          <div className="flex items-center gap-2 sm:gap-4 relative">
            
            {/* Desktop Search Trigger / Input */}
            <div ref={searchRef} className="relative hidden lg:block w-64 xl:w-80">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar frutos secos, chía, granola..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full bg-brand-gray-light font-sans text-xs pl-9 pr-8 py-2.5 rounded-full border border-slate-200 focus:border-brand-green focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 text-brand-charcoal"
                    id="desktop-search-input"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Advanced Autocomplete Suggestions Dropdown Buscador inteligente */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 left-0 bg-white shadow-xl rounded-2xl p-4 mt-2 border border-slate-100 z-50 max-h-[80vh] overflow-y-auto w-[400px] xl:w-[450px]"
                    id="search-dropdown-overlay"
                  >
                    {/* If search list is empty, show default recommendations */}
                    {!searchQuery && (
                      <div className="space-y-4 font-sans text-slate-600">
                        {searchHistory.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                              <span className="flex items-center gap-1"><History className="w-3 h-3" /> Búsquedas Recientes</span>
                              <button onClick={clearSearchHistory} className="hover:text-red-500 transition-colors cursor-pointer capitalize">Limpiar</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {searchHistory.map((term, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleHistoryClick(term)}
                                  className="text-[11px] bg-slate-50 hover:bg-brand-green/10 hover:text-brand-green-dark border border-slate-100 py-1 px-2.5 rounded-full text-slate-600 transition-colors cursor-pointer"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                            <TrendingUp className="w-3 h-3 text-brand-green" /> Categorías Sugeridas
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                            {categories.slice(0, 4).map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => handleQuickCategoryClick(cat.slug)}
                                className="flex items-center justify-between p-2 rounded-xl bg-brand-gray-light hover:bg-brand-green/5 text-left text-brand-charcoal hover:text-brand-green-dark border border-transparent hover:border-brand-green/20 transition-all cursor-pointer"
                              >
                                <span>{cat.name}</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Productos Más Buscados</span>
                          <div className="space-y-2 mt-2">
                            {products.filter(p => p.isFeatured).slice(0, 3).map(prod => (
                              <div
                                key={prod.id}
                                onClick={() => handleSuggestionClick(prod)}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-brand-gray-light cursor-pointer transition-colors"
                              >
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                                <div className="flex flex-col leading-tight">
                                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</span>
                                  <span className="text-[10px] text-brand-green font-semibold mt-0.5">{formatPrice(prod.price)} • <span className="text-slate-400 font-normal">{prod.weight}</span></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show results dynamically as they type */}
                    {searchQuery && (
                      <div className="font-sans">
                        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Sugerencias de Productos</span>
                        <div className="space-y-2 mt-2">
                          {suggestions.length > 0 ? (
                            suggestions.map(prod => (
                              <div
                                key={prod.id}
                                onClick={() => handleSuggestionClick(prod)}
                                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-brand-gray-light cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                                  <div className="flex flex-col leading-tight">
                                    <span className="text-xs font-bold text-brand-charcoal line-clamp-1">{prod.name}</span>
                                    <span className="text-[10px] text-slate-500 mt-0.5">{prod.brand} • <span className="font-semibold text-brand-green-dark">{formatPrice(prod.price)}</span></span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green-dark">{prod.weight}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-slate-400 text-xs">
                              No encontramos productos para "<span className="font-bold">{searchQuery}</span>"
                            </div>
                          )}
                        </div>

                        {suggestions.length > 0 && (
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full mt-3 text-center text-xs font-bold text-brand-green-dark hover:underline flex items-center justify-center gap-1 border-t border-slate-100 pt-3 cursor-pointer"
                          >
                            Ver todos los resultados ({products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length}) <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search toggler */}
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategorySlug(null); }} 
              className="lg:hidden p-2 text-slate-600 hover:text-brand-green-dark transition-colors focus:outline-none"
              aria-label="Buscar en la tienda"
              id="mobile-search-trigger"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon Badge */}
            <button
              onClick={() => setCurrentView('favorites')}
              className={`p-2 rounded-full hover:bg-slate-50 relative transition-colors focus:outline-none cursor-pointer ${currentView === 'favorites' ? 'text-brand-green-dark bg-brand-green/5' : 'text-slate-600 hover:text-brand-green-dark'}`}
              aria-label="Ver favoritos"
              id="nav-favorite-trigger"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] rounded-full bg-red-500 text-white font-sans text-[9px] font-bold flex items-center justify-center px-1"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>

            {/* My Account Dashboard Button */}
            <button
              onClick={() => setCurrentView('my-account')}
              className={`p-2 rounded-full hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer ${currentView === 'my-account' ? 'text-brand-green-dark bg-brand-green/5' : 'text-slate-600 hover:text-brand-green-dark'}`}
              aria-label="Mi Cuenta"
              id="nav-account-trigger"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setCurrentView('cart')}
              className={`p-2 lg:px-4 lg:py-2 rounded-full hover:bg-slate-50 relative transition-all focus:outline-none cursor-pointer border ${currentView === 'cart' ? 'border-brand-green text-brand-green-dark bg-brand-green/5' : 'border-slate-200 text-slate-600 hover:text-brand-green-dark hover:border-slate-300'} flex items-center gap-1.5`}
              aria-label="Ver carrito"
              id="nav-cart-trigger"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute lg:relative top-1.5 right-1.5 lg:top-0 lg:right-0 w-5 h-5 rounded-full bg-brand-green text-white font-sans text-[10px] font-black flex items-center justify-center shadow-sm"
                >
                  {totalCartItems}
                </motion.span>
              )}
              <span className="hidden lg:inline text-xs font-bold text-brand-charcoal">
                {totalCartItems > 0 ? formatPrice(getCartSubtotal()) : 'Vacío'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white shadow-2xl z-50 md:hidden p-6 flex flex-col justify-between"
              id="mobile-navigation-drawer"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-green-dark flex items-center justify-center">
                      <span className="font-display font-bold text-white text-sm">A</span>
                    </div>
                    <span className="font-display font-extrabold text-brand-charcoal text-sm tracking-tight leading-none">ALMENDRA</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4 font-sans font-bold text-base text-slate-700">
                  <button 
                    onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); setSelectedCategorySlug(null); }}
                    className={`text-left py-2 hover:text-brand-green dark:hover:text-brand-beige transition-colors ${currentView === 'home' ? 'text-brand-green-dark pl-2 border-l-2 border-brand-green-dark' : ''}`}
                  >
                    Inicio
                  </button>
                  <button 
                    onClick={() => { setCurrentView('shop'); setMobileMenuOpen(false); setSelectedCategorySlug(null); }}
                    className={`text-left py-2 hover:text-brand-green dark:hover:text-brand-beige transition-colors ${currentView === 'shop' ? 'text-brand-green-dark pl-2 border-l-2 border-brand-green-dark' : ''}`}
                  >
                    Tienda Online
                  </button>
                  <button 
                    onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
                    className={`text-left py-2 hover:text-brand-green dark:hover:text-brand-beige transition-colors ${currentView === 'about' ? 'text-brand-green-dark pl-2 border-l-2 border-brand-green-dark' : ''}`}
                  >
                    Nosotros
                  </button>
                  <button 
                    onClick={() => { setCurrentView('blog'); setMobileMenuOpen(false); }}
                    className={`text-left py-2 hover:text-brand-green dark:hover:text-brand-beige transition-colors ${currentView === 'blog' ? 'text-brand-green-dark pl-2 border-l-2 border-brand-green-dark' : ''}`}
                  >
                    Blog & Recetas
                  </button>
                  <button 
                    onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }}
                    className={`text-left py-2 hover:text-brand-green dark:hover:text-brand-beige transition-colors ${currentView === 'contact' ? 'text-brand-green-dark pl-2 border-l-2 border-brand-green-dark' : ''}`}
                  >
                    Contacto
                  </button>
                </nav>
              </div>

              {/* Mobile details (location preference) */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex flex-col gap-1.5 font-sans">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tu Preferencia de Envío</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase">
                    <MapPin className="w-4 h-4 text-brand-green" />
                    <span>Envíos a: {locationProvince}</span>
                  </div>
                </div>
                <div className="text-[11px] font-medium text-slate-400 text-center">
                  © 2026 Almendra — Almacén Natural
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
