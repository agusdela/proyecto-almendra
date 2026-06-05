/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  PhoneCall, 
  MapPin, 
  Clock, 
  Send, 
  CheckSquare,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactView() {
  // Contact Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('consulta');
  const [formMessage, setFormMessage] = useState('');
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      setErrorMsg('Por favor completá todos los campos obligatorios del formulario.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setErrorMsg('Por favor ingresá un correo electrónico válido.');
      return;
    }

    // Success response triggers
    setFormSuccess(true);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSubject('consulta');
    setFormMessage('');

    setTimeout(() => setFormSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in" id="contact-view-container">
      
      {/* 1. Header Banner */}
      <div className="bg-brand-cream rounded-3xl p-8 border border-brand-beige/25 shadow-sm text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">SOPORTE AL CLIENTE</span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-charcoal tracking-tight leading-none">
          Estamos para ayudarte en tu camino
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
          ¿Tenés consultas acerca de los envíos Sin TACC, compras mayoristas corporativas o querés revender nuestros productos en tu provincia? Dejanos tu mensaje y te responderemos en menos de 2 horas hábiles.
        </p>
      </div>

      {/* 2. Form & Channels Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-base text-brand-charcoal">Formulario de Contacto</h3>
            <p className="text-[11px] text-slate-450 font-sans">Escribinos y un especialista técnico de soporte atenderá tu consulta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 font-bold">
                ⚠ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre Completo *</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Ej. Carolina Speranza"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correo Electrónico *</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-phone" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teléfono de Contacto (Opcional)</label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+54 9 11 ..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asunto de Consulta</label>
                <select
                  id="contact-subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="consulta">Consulta General / Recetas</option>
                  <option value="envio">Inquietud sobre mi Envío / Pedidos</option>
                  <option value="mayorista">Consulta Comercial / Distribuidores</option>
                  <option value="reclamo">Reclamos / Servicio Técnico</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Detalle de tu Mensaje *</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Escribí acá tu inquietud de forma detallada..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-medium text-slate-750"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider shadow hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-contact-submit"
            >
              <Send className="w-4 h-4" /> Enviar Mensaje de Soporte
            </button>
          </form>

          <AnimatePresence>
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-brand-green-dark text-white rounded-2xl p-4 font-sans text-xs text-center font-bold flex items-center justify-center gap-2.5"
              >
                <CheckSquare className="w-5 h-5 text-brand-beige shrink-0 animate-bounce" />
                <span>¡Excelente! Tu consulta ha sido despachada. Nos comunicaremos con vos al correo indicado a la brevedad.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Visual contact channels and maps coordinates */}
        <div className="lg:col-span-5 space-y-6 font-sans text-brand-charcoal">
          
          {/* Support Channels shortcuts */}
          <div className="bg-brand-gray-light rounded-3xl p-6 border border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Canales Directos</h4>
            
            <div className="space-y-3 font-sans text-xs font-semibold">
              <a 
                href="https://wa.me/5493544635404" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150 hover:border-brand-green hover:shadow-sm transition-all"
                id="btn-contact-whatsapp-chat"
              >
                <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">WhatsApp</p>
                  <p className="text-brand-charcoal text-xs font-bold flex items-center gap-1">+54 9 3544 63-5404 <ExternalLink className="w-3 h-3 text-slate-450" /></p>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/almendra_almacennatural_?igsh=MWEwa2t4dWxwdWZnZw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150 hover:border-brand-green hover:shadow-sm transition-all"
                id="btn-contact-instagram"
              >
                <div className="w-9 h-9 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <Instagram className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Instagram</p>
                  <p className="text-brand-charcoal text-xs font-bold flex items-center gap-1">@almendra_almacennatural_ <ExternalLink className="w-3 h-3 text-slate-450" /></p>
                </div>
              </a>

              <a 
                href="https://www.facebook.com/share/18c8EitSfW/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150 hover:border-brand-green hover:shadow-sm transition-all"
                id="btn-contact-facebook"
              >
                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Facebook className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Facebook</p>
                  <p className="text-brand-charcoal text-xs font-bold flex items-center gap-1">Almendra Almacén Natural <ExternalLink className="w-3 h-3 text-slate-450" /></p>
                </div>
              </a>

              <a 
                href="mailto:hola@almendra.almacennatural.com" 
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150 hover:border-brand-green hover:shadow-sm transition-all"
                id="btn-contact-email-direct"
              >
                <div className="w-9 h-9 bg-brand-green/10 text-brand-green-dark rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Correo Electrónico</p>
                  <p className="text-xs text-slate-700 font-bold">hola@almendra.almacennatural.com</p>
                </div>
              </a>

              <a 
                href="https://www.google.com/maps/search/?api=1&query=-31.706861,-65.020361" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150 hover:border-brand-green hover:shadow-sm transition-all"
                id="btn-contact-address-map"
              >
                <div className="w-9 h-9 bg-brand-green/10 text-brand-green-dark rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Dirección de Sucursal</p>
                  <p className="text-brand-charcoal text-xs font-bold flex items-center gap-1">31°42'24.7"S 65°01'13.3"W <ExternalLink className="w-3 h-3 text-slate-450" /></p>
                </div>
              </a>

              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150">
                <div className="w-9 h-9 bg-brand-green/10 text-brand-green-dark rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="flex-grow leading-tight">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Horas de Operación</p>
                  <p className="text-xs text-slate-700 font-medium">Lunes a Sábados: 09:00 a 19:30hs</p>
                </div>
              </div>
            </div>
          </div>

          {/* High Fidelity Google Maps mockup */}
          <div className="bg-white rounded-3xl border border-slate-150 p-5 space-y-4" id="google-maps-mockup-frame">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ubicación de Sucursal</span>
              <span className="text-[9.5px] text-brand-green bg-brand-green/10 px-2 py-0.5 font-bold rounded-lg uppercase">Palermo HQ</span>
            </div>

            {/* Simulated Canvas Map */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-emerald-50 border border-slate-100 flex items-center justify-center relative p-4 shadow-inner">
              {/* Absolutes styling grid to mimic cartography layouts */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              <div className="relative text-center space-y-3 z-10 font-sans">
                <div className="w-10 h-10 rounded-full bg-brand-green-dark text-white flex items-center justify-center shadow-md animate-bounce mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-brand-charcoal">Av. Santa Fe 3422, Palermo</p>
                  <p className="text-[10px] text-slate-400 max-w-[210px] mx-auto leading-normal">Frente a Jardín Botánico, Ciudad Autónoma de Buenos Aires.</p>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] py-1.5 px-3 rounded-full hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <span>Cómo llegar con GPS</span> <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
