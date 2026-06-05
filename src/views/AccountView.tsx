/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AccountView() {
  const { 
    orders, 
    locationProvince, 
    setLocationProvince, 
    currency,
    setCurrentView 
  } = useShop();

  // Mock User profile sync states
  const [firstName, setFirstName] = useState('Agusto');
  const [lastName, setLastName] = useState('Fede');
  const [phone, setPhone] = useState('+54 9 11 1234-5678');
  const [email, setEmail] = useState('agusfede123@gmail.com');
  const [profileSaved, setProfileSaved] = useState(false);

  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in" id="account-view-container">
      
      {/* 1. Header Banner welcoming the user */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30 flex items-center justify-center font-display font-extrabold text-xl font-bold uppercase shadow">
            {firstName[0]}{lastName[0]}
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
              ¡Hola de nuevo, {firstName}!
            </h1>
            <p className="text-xs text-slate-450 font-sans">Panel de Mi Cuenta de Almacén • Miembro Consecutivo desde 2024</p>
          </div>
        </div>

        {/* Dynamic status widgets */}
        <div className="flex items-center gap-4 text-xs font-sans">
          <div className="bg-slate-800 border border-slate-705 p-3 rounded-2xl text-center min-w-[110px]">
            <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Pedidos Realizados</span>
            <span className="text-lg font-black text-brand-green">{orders.length}</span>
          </div>
          <div className="bg-slate-800 border border-slate-705 p-3 rounded-2xl text-center min-w-[110px]">
            <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Nivel Comunidad</span>
            <span className="text-lg font-black text-brand-beige">VIP Semilla</span>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Body grids splitting Logs vs Profile settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left column: Orders history logs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShoppingBag className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Historial de Pedidos Realizados</h3>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div 
                  key={ord.id} 
                  className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-xs font-sans"
                  id={`account-order-log-${ord.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-3 text-xs font-extrabold text-brand-charcoal">
                    <div className="space-y-1">
                      <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Número de Pedido</span>
                      <span className="text-brand-green-dark">{ord.id}</span>
                    </div>
                    
                    <div className="space-y-1 text-right">
                      <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fecha de Compra</span>
                      <span>{ord.date}</span>
                    </div>

                    <div className="space-y-1 text-right">
                      <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estado</span>
                      <span className="bg-emerald-50 text-emerald-700 py-1 px-3.5 rounded-full border border-emerald-100 font-sans tracking-wide text-[10.5px]">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Bought items listed under order */}
                  <div className="space-y-2">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2.5">
                          <img src={item.product.image} alt={item.product.name} className="w-9 h-9 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-700">{item.product.name}</span>
                            <span className="text-[10px] text-slate-450 block mt-0.5">{item.selectedVariant.label} • cant: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-650">{formatPrice(item.selectedVariant.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing details mapping */}
                  <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 text-slate-500 font-light">
                      <p>Subtotal: {formatPrice(Number(ord.subtotal))}</p>
                      <p>Envío: {Number(ord.shippingPrice) === 0 ? 'BONIFICADO FREE' : formatPrice(Number(ord.shippingPrice))}</p>
                      {Number(ord.discountAmount) > 0 && <p className="text-red-500 font-medium">Descuento aplicado: -{formatPrice(Number(ord.discountAmount))}</p>}
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">Total pagado</span>
                      <span className="text-base font-black text-brand-green-dark">{formatPrice(Number(ord.total))}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-150 py-12 px-4 text-center max-w-sm mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">Todavía no realizaste ningún pedido</p>
                <p className="text-[11px] text-slate-450 leading-relaxed font-light">Tu lista de compras está vacía. ¡Visitá nuestra tienda y armá tu primer carrito natural!</p>
              </div>
              <button
                onClick={() => setCurrentView('shop')}
                className="bg-brand-green text-white py-2 px-5 rounded-xl font-sans font-bold text-xs shadow cursor-pointer text-center"
              >
                Ir a la Tienda Online
              </button>
            </div>
          )}
        </div>

        {/* Right column: User profile / shipping settings */}
        <div className="lg:col-span-5 bg-white border border-slate-150 p-6 sm:p-8 rounded-3xl shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Mi Perfil y Ubicación</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
            <div>
              <label htmlFor="prof-name" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre</label>
              <input
                id="prof-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label htmlFor="prof-lastname" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Apellido</label>
              <input
                id="prof-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teléfono Celular de Confirmación</label>
              <input
                id="prof-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correo Registrado *</label>
              <input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 mt-1 rounded-xl py-2.5 px-3 text-slate-400 focus:outline-none"
                disabled
              />
            </div>

            {/* Selector de ubicacion sync */}
            <div className="border-t border-slate-100 pt-4 space-y-1">
              <label htmlFor="prof-province-select" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Zona Predeterminada de Envío *</label>
              <div className="relative">
                <select
                  id="prof-province-select"
                  value={locationProvince}
                  onChange={(e) => setLocationProvince(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="CABA">Ciudad de Buenos Aires (CABA)</option>
                  <option value="GBA">Gran Buenos Aires (GBA)</option>
                  <option value="Interior">Resto de Provincias (Interior del País)</option>
                </select>
              </div>
              <p className="text-[9.5px] text-slate-400 leading-normal font-light">Este selector altera directamente los umbrales de bonificaciones y plazos aproximados de correo.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-green-dark hover:bg-brand-green text-white font-sans font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              id="btn-account-profile-save"
            >
              Guardar Cambios de Perfil
            </button>
          </form>

          {profileSaved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-sans text-xs font-bold py-2.5 px-4 rounded-xl">
              ✓ Cambios de perfil y zona de entrega actualizados con éxito.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
