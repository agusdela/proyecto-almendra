/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  TicketPercent, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  X,
  CreditCard,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartView() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    currency,
    locationProvince,
    setLocationProvince,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getCartDiscountAmount,
    getShippingPrice,
    getCartTotal,
    setCurrentView
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    setCouponFeedback({ success: res.success, msg: res.message });
    setCouponCodeInput('');

    setTimeout(() => {
      setCouponFeedback(null);
    }, 4000);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setCurrentView('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="cart-view-container">
      
      {/* Page Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 shrink-0">
        <div className="p-2.5 bg-brand-green/10 text-brand-green-dark rounded-xl">
          <ShoppingBag className="w-5.5 h-5.5" />
        </div>
        <div className="space-y-0.5">
          <h1 className="font-display font-extrabold text-2xl text-brand-charcoal tracking-tight">Mi Carrito de Compras</h1>
          <p className="text-xs text-slate-450 font-sans">Revisá tu pedido, aplicá cupones de descuento y calculá tu envío nacional.</p>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: List of items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const rowId = `cart-row-${item.product.id}-${item.selectedVariant.label}`;
              return (
                <div 
                  key={rowId}
                  className="bg-white rounded-2xl border border-slate-150 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-shadow hover:shadow-xs font-sans"
                  id={rowId}
                >
                  {/* Thumbnail & generic names details */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="leading-tight space-y-1">
                      <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">{item.product.brand}</span>
                      <h3 className="text-xs sm:text-sm font-bold text-brand-charcoal leading-snug line-clamp-1">
                        {item.product.name}
                      </h3>
                      <span className="inline-block text-[10.5px] font-sans font-bold bg-[#FAF9F6] text-brand-green-dark border border-slate-150 rounded-lg py-0.5 px-2">
                        Variante: {item.selectedVariant.label} • {formatPrice(item.selectedVariant.price)} c/u
                      </span>
                    </div>
                  </div>

                  {/* Quantity Actions & total inline row */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                    
                    {/* Numeric Changer tool */}
                    <div className="flex items-center bg-slate-50 border border-slate-150 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.label, item.quantity - 1)}
                        className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 focus:outline-none cursor-pointer"
                        aria-label="Restar una unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="font-mono text-xs font-bold text-slate-800 w-8 text-center select-none">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.label, item.quantity + 1)}
                        className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 focus:outline-none cursor-pointer"
                        aria-label="Agregar una unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total math display */}
                    <div className="text-right shrink-0 min-w-[80px]">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block text-[9.5px]">Subtotal</span>
                      <span className="text-sm sm:text-base font-extrabold text-brand-charcoal">
                        {formatPrice(item.selectedVariant.price * item.quantity)}
                      </span>
                    </div>

                    {/* Delete trigger */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant.label)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-full transition-colors focus:outline-none cursor-pointer"
                      aria-label="Quitar de mi carrito"
                      id={`btn-cart-delete-${item.product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}

            {/* Back shop actions buttons */}
            <button
              onClick={() => setCurrentView('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green-dark hover:underline py-1.5 cursor-pointer focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" /> sigo explorando productos del almacén
            </button>
          </div>

          {/* Right Column: Pricing Resumen de Compra & calculations */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery localization calculator panel */}
            <div className="bg-white border border-slate-150 rounded-3xl p-5 space-y-3 shadow-xs font-sans text-xs text-brand-charcoal">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Cálculo de Envío Nacional</span>
              
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold mb-2 text-[11px]">
                <MapPin className="w-4.5 h-4.5 text-brand-green shrink-0 animate-pulse" />
                <span>Zona seleccionada: <span className="font-bold underline">{locationProvince}</span></span>
              </div>

              <div className="space-y-1 block">
                <label htmlFor="cart-province-selector" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Modificar Zona de Entrega:</label>
                <select
                  id="cart-province-selector"
                  value={locationProvince}
                  onChange={(e) => setLocationProvince(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2 px-3 focus:outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="CABA">Ciudad Autónoma de Buenos Aires (CABA)</option>
                  <option value="GBA">Gran Buenos Aires (GBA)</option>
                  <option value="Interior">Resto del País (Interior de Provincias)</option>
                </select>
              </div>

              <div className="text-[10.5px] leading-relaxed text-slate-500 font-light border-t border-slate-50 pt-2.5">
                {locationProvince === 'CABA' && <p>• Envíos a CABA tardan 24 a 48hs. ¡Envío <span className="font-bold text-brand-green">GRATIS</span> superando el monto de $20.000!</p>}
                {locationProvince === 'GBA' && <p>• Entregas a GBA Norte, Sur y Oeste en 48hs. ¡Envío <span className="font-bold text-brand-green">GRATIS</span> superando el monto de $25.000!</p>}
                {locationProvince === 'Interior' && <p>• Correo Argentino a sucursal nacional. ¡Envío <span className="font-bold text-brand-green">GRATIS</span> superando el monto de $35.000!</p>}
              </div>
            </div>

            {/* Coupons Promo Input Cupones */}
            <div className="bg-white border border-slate-150 rounded-3xl p-5 space-y-3.5 shadow-xs font-sans text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Cupones de Descuento</span>
              
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Ingresá tu cupón (Ej: NATURAL10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-2 focus:outline-none focus:border-brand-green text-xs font-semibold placeholder:text-slate-400"
                    />
                    <TicketPercent className="w-4.5 h-4.5 absolute left-2.5 top-2 text-slate-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-green text-white font-bold text-xs py-2 px-4 rounded-xl shadow hover:bg-brand-green-dark transition-colors cursor-pointer shrink-0"
                    id="btn-cart-apply-coupon"
                  >
                    Aplicar
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-emerald-600 animate-pulse shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-emerald-800">Cupón: {appliedCoupon.code}</p>
                      <p className="text-[9.5px] text-emerald-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 hover:bg-emerald-100 text-emerald-700 rounded-full focus:outline-none cursor-pointer"
                    title="Remover cupón"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Dynamic coupon validations alerts feedback */}
              <AnimatePresence>
                {couponFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-2 rounded-xl text-[10px] font-bold text-center border ${
                      couponFeedback.success 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {couponFeedback.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips showing coupons */}
              <div className="text-[9.5px] font-medium text-slate-400 bg-slate-50 p-2.5 rounded-xl text-center leading-normal">
                💡 <span className="font-bold">Cupones activos de prueba:</span> Probá ingresando <span className="font-bold border-b border-dotted border-slate-400 text-slate-600">NATURAL10</span> (10% Off), <span className="font-bold border-b border-dotted border-slate-400 text-slate-600">GOURMET20</span> (20% Off), o <span className="font-bold border-b border-dotted border-slate-400 text-slate-600">ENVIOFREE</span> (Envío gratis).
              </div>
            </div>

            {/* Standard Checkout Totals Sheet */}
            <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-md font-sans text-xs text-brand-charcoal space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Resumen de Compra</span>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-700">{formatPrice(getCartSubtotal())}</span>
                </div>

                {getCartDiscountAmount() > 0 && (
                  <div className="flex justify-between items-center text-red-500 font-bold">
                    <span>Cupón de Descuento:</span>
                    <span>-{formatPrice(getCartDiscountAmount())}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Costo de Envío:</span>
                  <span className="font-bold text-slate-750">
                    {getShippingPrice() === 0 ? (
                      <span className="text-brand-green uppercase tracking-wide text-[10.5px]">¡BONIFICADO GRATIS!</span>
                    ) : (
                      formatPrice(getShippingPrice())
                    )}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center font-display">
                  <span className="text-sm font-black text-slate-800 uppercase">Total Estimado</span>
                  <span className="text-xl font-black text-brand-green-dark">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              {/* Core proceed checkout call */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-4 rounded-xl uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                id="btn-cart-checkout-proceed"
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>INICIAR PROCESO DE PAGO</span>
              </button>

              <p className="text-[9.5px] text-slate-400 font-medium text-center leading-none mt-2">
                Transacción cifrada segura • Fajas de inocuidad selladas
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Empty shopping cart visual feedback */
        <div className="max-w-md mx-auto bg-white border border-slate-150 py-16 px-6 text-center space-y-6 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-sm text-brand-charcoal uppercase text-center">Tu carrito de compras está vacío</h3>
            <p className="font-sans text-xs text-slate-450 leading-relaxed font-light">
              Todavía no agregaste productos a tu carrito. ¡Explorá las mejores almendras, tés ceremoniales, semillas puras y granolas frescas de la molienda!
            </p>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-brand-green text-white py-2.5 px-6 rounded-xl font-sans font-bold text-xs shadow cursor-pointer text-center"
            id="btn-cart-empty-shop-now"
          >
            Surtir Alacena Ahora
          </button>
        </div>
      )}

    </div>
  );
}
