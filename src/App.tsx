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
          className="w-14 h-14 rounded-full bg-emerald-505 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-108 transition-all shrink-0 group relative cursor-pointer"
          id="btn-whatsapp-floating-bubble"
          aria-label="Chatear por WhatsApp"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          
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
