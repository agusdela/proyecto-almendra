/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import { Timer, Sparkles, Flame, Percent } from 'lucide-react';

export default function Offers() {
  const { products } = useShop();

  // Ticking countdown until end of current day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 10 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter products having discount tags Offer
  const offerProducts = products.filter(p => p.isOffer).slice(0, 4);

  return (
    <section className="bg-gradient-to-tr from-orange-50/50 via-white to-brand-green/5 py-16 px-4" id="ofertas-hot-section">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner with Ticking Countdown */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-brand-green font-black tracking-widest uppercase">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
              <span>OFERTAS RELÁMPAGO DE LA SEMANA</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
              Ahorrá hasta un <span className="text-brand-green">25% extra</span> en Alimentos Reales
            </h2>
            <p className="text-xs text-slate-400 max-w-xl font-light">
              Productos frescos de molienda propia y cosechas cooperativas seleccionadas con rebaja de precio por tiempo limitado.
            </p>
          </div>

          {/* Countdown Clock Container */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 p-4 sm:p-6 rounded-2xl flex items-center gap-4 shadow-inner min-w-[280px]">
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl">
              <Timer className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1 block">Finaliza en:</span>
              <div className="flex items-center gap-1.5 font-mono text-xl sm:text-2xl font-black text-white">
                <div className="flex flex-col items-center">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-brand-green min-w-[36px] text-center">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-sans font-bold text-slate-400 mt-1 uppercase">hs</span>
                </div>
                <span className="text-brand-green">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-brand-green min-w-[36px] text-center">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-sans font-bold text-slate-400 mt-1 uppercase">min</span>
                </div>
                <span className="text-brand-green">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-orange-400 min-w-[36px] text-center">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-sans font-bold text-slate-400 mt-1 uppercase">seg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Products Slider/Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {offerProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}
