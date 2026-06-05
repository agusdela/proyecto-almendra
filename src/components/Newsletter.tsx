/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, CheckCircle2, TicketPercent, BookOpen, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Por favor, ingresá una dirección de correo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Por favor, ingresá un correo electrónico válido.');
      return;
    }

    // Success state
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-br from-brand-green/10 via-brand-beige/5 to-white py-16 px-4" id="newsletter-section">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-slate-50 overflow-hidden transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Info Column */}
          <div className="p-8 md:p-12 md:col-span-7 bg-white flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-brand-green-dark font-bold uppercase tracking-wider mb-2">
              <Star className="w-4.5 h-4.5 fill-brand-green text-brand-green animate-spin" style={{ animationDuration: '6s' }} />
              <span>Suscripción de Beneficios</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-charcoal leading-tight tracking-tight mb-4">
              Unite a nuestra comunidad saludable y recibí un <span className="text-brand-green-dark underline decoration-brand-beige decoration-4">15% de descuento</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Recibí semanalmente las mejores recetas naturales elaboradas por nuestros chefs, consejos de nutrición científica avalados y códigos de descuento flash exclusivos en tu correo.
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-brand-green" />
                <span>Cupón de Bienvenida</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-green" strokeWidth={2} />
                <span>Libro Recetario PDF</span>
              </div>
            </div>
          </div>

          {/* Right Core Action Section */}
          <div className="bg-brand-green-dark p-8 md:p-12 md:col-span-5 flex flex-col justify-center text-white relative">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="subscribe-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-display font-bold text-lg leading-tight">Queremos cuidarte.</h3>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Ingresá tu email y te enviaremos directamente tu recetario digital y el cupón de descuento en segundos.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                      <div className="relative">
                        <input
                          id="newsletter-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                          }}
                          className="w-full bg-white/15 border border-white/25 rounded-xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:text-brand-charcoal focus:outline-none transition-all placeholder:text-white/60"
                        />
                        <Mail className="w-4 h-4 absolute left-4 top-4 text-white/70 focus-within:text-brand-green" />
                      </div>
                      {error && (
                        <p className="text-[10px] text-red-100 font-bold mt-1.5 flex items-center gap-1">
                          ⚠ {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-beige hover:bg-white text-brand-green-dark font-sans font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-colors cursor-pointer text-center"
                      id="newsletter-submit-button"
                    >
                      SUSCRIBIRME AHORA
                    </button>
                    <p className="text-[9px] text-white/50 text-center leading-none">
                      Desuscripción simple en un click en cualquier momento. Sin spam.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-6 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-extrabold text-xl leading-tight mb-2">¡Suscripción Exitosa!</h3>
                  <p className="text-xs text-white/95 leading-relaxed max-w-[240px] mx-auto">
                    Tu correo ha sido registrado. En instantes recibirás tu <span className="font-bold underline text-brand-beige">cupón del 15%</span> y tu libro recetario PDF de bienvenida.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
