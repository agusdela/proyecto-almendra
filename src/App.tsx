/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Views
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import BlogView from './views/BlogView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import AccountView from './views/AccountView';
import FavoritesView from './views/FavoritesView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';

import { MessageSquare, ArrowUp, HelpCircle } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView } = useShop();

  // Switch wrapper mapping active views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'detail':
        return <ProductDetailView />;
      case 'blog':
        return <BlogView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'account':
        return <AccountView />;
      case 'favorites':
        return <FavoritesView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      default:
        return <HomeView />;
    }
  };

  // Scroll to head easily
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-brand-charcoal flex flex-col justify-between selection:bg-brand-green/20 selection:text-brand-green-dark" id="app-root-context">
      
      {/* 1. Header with announcement tickers */}
      <Header />

      {/* 2. Primary dynamic viewport based on e-commerce navigation */}
      <main className="flex-grow">
        {renderCurrentView()}
      </main>

      {/* 4. Complete multi-column footer */}
      <Footer />

      {/* 5. Direct WhatsApp Floating Dispatcher Button (Aesthetic Premium CRO Helper) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 select-none font-sans">
        
        {/* Back to top bullet */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white text-slate-500 border border-slate-205 flex items-center justify-center shadow-lg hover:shadow-xl hover:text-brand-green active:scale-95 transition-all cursor-pointer"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* WhatsApp Chat Bubble */}
        <a
          href="https://wa.me/5493544635404"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all shrink-0 group relative cursor-pointer"
          id="btn-whatsapp-floating-bubble"
          aria-label="Chatear por WhatsApp"
        >
          <svg className="w-7 h-7 fill-current text-white animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.022-.015-.022-.015-.502-.255-.09-.045-.255-.12-.39-.18-.135-.06-.21-.09-.315-.09a.57.57 0 0 0-.42.18c-.135.135-.495.615-.6 1-.105.385-.21.72-.21.72s-.015.015-.03.015c-.135.045-.42.06-.825-.135-.3-.15-.81-.36-1.395-.87-.45-.405-.765-.885-.885-1.095-.12-.21-.015-.315.09-.42.09-.09.21-.24.315-.36.105-.12.135-.195.21-.33.075-.135.038-.255-.015-.36-.06-.12-.502-1.215-.688-1.666-.182-.442-.363-.382-.5-.382-.135-.008-.285-.008-.435-.008a.84.84 0 0 0-.615.285c-.21.21-.81.795-.81 1.935 0 1.14.825 2.235.94 2.385.12.15 1.62 2.475 3.93 3.48.555.24 1.01.375 1.35.48.555.18 1.06.155 1.455.09.435-.06 1.343-.541 1.53-.1.18-.38.075-.72.075-1.065 0-.105-.06-.18-.18-.24zm-5.46-9.563A8.91 8.91 0 0 0 3.1 13.725c0 1.71.45 3.375 1.305 4.86l-1.395 5.1 5.22-1.365a8.88 8.88 0 0 0 4.14 1.02h.008c4.92 0 8.925-4.005 8.93-8.915a8.88 8.88 0 0 0-2.67-6.315 8.88 8.88 0 0 0-6.325-2.607zm0 1.5c1.983 0 3.847.772 5.25 2.175a7.35 7.35 0 0 1 2.167 5.238c-.005 4.095-3.33 7.42-7.417 7.42a7.37 7.37 0 0 1-3.765-1.025l-.27-.16-3.1.81.825-3.015-.177-.282a7.36 7.36 0 0 1-1.127-3.923c0-3.332 1.3-6.46 3.655-8.814a7.37 7.37 0 0 1 3.963-1.724z" />
          </svg>
          
          {/* Tooltip on hover */}
          <span className="absolute right-16 top-3 bg-slate-900 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            ¿Consultas? Chateá con nosotros
          </span>
        </a>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
