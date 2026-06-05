/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  User, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag,
  Info,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export default function CheckoutView() {
  const {
    cart,
    clearCart,
    locationProvince,
    currency,
    appliedCoupon,
    getCartSubtotal,
    getCartDiscountAmount,
    getShippingPrice,
    getCartTotal,
    addOrder,
    setCurrentView
  } = useShop();

  const [activeStep, setActiveStep] = useState<CheckoutStep>(1);

  // --- Multi-Step Form Fields states ---
  // Step 1: Personal Data
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custDni, setCustDni] = useState('');
  const [custPhone, setCustPhone] = useState('');

  // Step 2: Shipping address
  const [shipStreet, setShipStreet] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipCode, setShipCode] = useState('');

  // Step 3: Logistics method
  const [shippingMethod, setShippingMethod] = useState<'regular' | 'express' | 'sucursal'>('regular');

  // Step 4: Billing method
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'transfer' | 'cash'>('credit');
  // Credit card details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Step 5: Finished order receipt details cached upon submission
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedOrderSummary, setConfirmedOrderSummary] = useState<any>(null);

  const [errorMsg, setErrorMsg] = useState('');

  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  // Live calculations including potential extra payment wire modifications
  const rawSubtotal = getCartSubtotal();
  const rawDiscount = getCartDiscountAmount();
  const rawShipping = shippingMethod === 'sucursal' ? 0 : getShippingPrice();
  
  // Apply a extra 10% Off if paying by wire transfer (CRO conversion incentive)
  const paymentAdditionDiscount = paymentMethod === 'transfer' ? Math.round((rawSubtotal - rawDiscount) * 0.1) : 0;
  
  const calculatedGrandTotal = Math.max(0, rawSubtotal - rawDiscount - paymentAdditionDiscount + rawShipping);

  // Validator helpers
  const handleNextStep = () => {
    setErrorMsg('');

    if (activeStep === 1) {
      if (!custName.trim() || !custEmail.trim() || !custDni.trim() || !custPhone.trim()) {
        setErrorMsg('Por favor completá todos los campos identificatorios obligatorios.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(custEmail)) {
        setErrorMsg('Por favor ingresá un Correo Electrónico válido.');
        return;
      }
      setActiveStep(2);
    } 
    
    else if (activeStep === 2) {
      if (!shipStreet.trim() || !shipCity.trim() || !shipCode.trim()) {
        setErrorMsg('Por favor completá todos los campos de dirección postal de entrega.');
        return;
      }
      setActiveStep(3);
    } 
    
    else if (activeStep === 3) {
      setActiveStep(4);
    }
  };

  // Final confirmation builder
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (paymentMethod === 'credit') {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setErrorMsg('Por favor completá todos los campos correspondientes a la tarjeta de crédito.');
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        setErrorMsg('El número de tarjeta de crédito debe contener al menos 16 dígitos hábiles.');
        return;
      }
    }

    // Initialize custom Order parameters
    const randomId = `AN-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const finalizedOrder = {
      id: randomId,
      date: dateStr,
      items: [...cart],
      subtotal: rawSubtotal,
      discountAmount: rawDiscount + paymentAdditionDiscount,
      shippingPrice: rawShipping,
      total: calculatedGrandTotal,
      status: 'Procesando Pago' as const
    };

    // Global persistence injection
    addOrder(finalizedOrder);

    // Cache local states for finalized reading ticket
    setConfirmedOrderId(randomId);
    setConfirmedOrderSummary(finalizedOrder);

    // Advance to Step 5 (Order Receipt) & clear shopping cart
    setActiveStep(5);
    clearCart();
  };

  // Step titles headers
  const stepsMeta = [
    { num: 1, label: 'Personales', icon: User },
    { num: 2, label: 'Dirección', icon: MapPin },
    { num: 3, label: 'Envío', icon: Truck },
    { num: 4, label: 'Pago', icon: CreditCard },
    { num: 5, label: 'Confirmación', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in" id="checkout-view-container">
      
      {/* 1. Header flow steps indicator indicators */}
      <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-xs shrink-0">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {stepsMeta.map((s) => {
            const IconComponent = s.icon;
            const isCompleted = activeStep > s.num;
            const isActive = activeStep === s.num;
            return (
              <div key={s.num} className="flex items-center gap-2 font-sans text-xs">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  isCompleted 
                    ? 'bg-brand-green border-brand-green text-white font-black' 
                    : isActive
                      ? 'bg-brand-green-dark border-brand-green-dark text-white font-extrabold shadow-md'
                      : 'bg-slate-50 border-slate-205 text-slate-400 font-medium'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className={`hidden sm:inline font-bold uppercase tracking-wider text-[10px] ${isActive ? 'text-brand-green-dark' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {s.num < 5 && <ChevronRight className="hidden sm:block w-4 h-4 text-slate-250 ml-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {activeStep < 5 && cart.length === 0 ? (
        /* Graceful cart overflow safeguard */
        <div className="max-w-md mx-auto text-center py-12 space-y-4">
          <p className="font-sans text-xs text-slate-500">No encontramos productos en el carrito para procesar el checkout.</p>
          <button onClick={() => setCurrentView('shop')} className="bg-brand-green text-white font-bold py-2.5 px-6 rounded-xl text-xs">
            Volver a la Tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Dynamic input subviews based on activeStep */}
          <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 shadow-sm">
            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 p-3 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Personal Coordinates */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Datos de Facturación e Identificación</h3>
                  <p className="text-[11px] text-slate-500 font-sans">El DNI es obligatorio por normativas de facturación fiscal AFIP argentina.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label htmlFor="chk-custname" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre Completo *</label>
                    <input
                      id="chk-custname"
                      type="text"
                      placeholder="Ej. Martín Pérez"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-custemail" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correo Electrónico de Confirmación *</label>
                    <input
                      id="chk-custemail"
                      type="email"
                      placeholder="tu@email.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-custdni" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">D.N.I / C.U.I.T / Pasaporte *</label>
                    <input
                      id="chk-custdni"
                      type="text"
                      placeholder="Ej. 34.555.222"
                      value={custDni}
                      onChange={(e) => setCustDni(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-custphone" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teléfono de Confirmación WhatsApp *</label>
                    <input
                      id="chk-custphone"
                      type="tel"
                      placeholder="Ej. +54 9 11 ..."
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNextStep}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider cursor-pointer shadow flex items-center gap-1.5"
                    id="btn-chk-step1-next"
                  >
                    <span>Siguiente Paso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Address Coordinates */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Dirección Física de Entrega del Pedido</h3>
                  <p className="text-[11px] text-slate-500 font-sans">Enviamos encomiendas sanitizadas de bajo costo a cualquier sucursal del país.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="sm:col-span-2">
                    <label htmlFor="chk-shipstreet" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Calle, Altura, Piso y Departamento *</label>
                    <input
                      id="chk-shipstreet"
                      type="text"
                      placeholder="Ej. Av. Santa Fe 3432, Piso 4 Dep B"
                      value={shipStreet}
                      onChange={(e) => setShipStreet(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-shipcode" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Código Postal (C.P.) *</label>
                    <input
                      id="chk-shipcode"
                      type="text"
                      placeholder="Ej. C1425"
                      value={shipCode}
                      onChange={(e) => setShipCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-shipcity" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Localidad / Partido / Ciudad *</label>
                    <input
                      id="chk-shipcity"
                      type="text"
                      placeholder="Ej. Palermo"
                      value={shipCity}
                      onChange={(e) => setShipCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Provincia Registrada *</label>
                    <input
                      type="text"
                      value={locationProvince}
                      className="w-full bg-slate-100 border border-slate-150 mt-1 rounded-xl py-2.5 px-3 text-slate-400 focus:outline-none font-bold"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold text-xs py-3 px-6 rounded-xl uppercase flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Volver
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider cursor-pointer shadow flex items-center gap-1.5"
                    id="btn-chk-step2-next"
                  >
                    <span>Siguiente Paso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Shipping Method selections Logistics */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Seleccionar Método de Envío</h3>
                  <p className="text-[11px] text-slate-500 font-sans">El total final ajustará el costo de acarreo de forma automática.</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  
                  {/* Option 1: Mail delivery */}
                  <div 
                    onClick={() => setShippingMethod('regular')}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                      shippingMethod === 'regular' 
                        ? 'border-brand-green bg-brand-green/5' 
                        : 'border-slate-150 bg-white hover:border-slate-350'
                    }`}
                    id="chk-logistic-regular"
                  >
                    <input 
                      type="radio" 
                      name="shipping-logistics-group" 
                      checked={shippingMethod === 'regular'} 
                      onChange={() => {}} // react sync
                      className="accent-brand-green"
                    />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800">Correo Argentino / Andreani Oficial</p>
                      <p className="text-slate-500 font-light mt-0.5">Llega de 3 a 5 días hábiles a tu domicilio. Envasado seguro.</p>
                    </div>
                    <span className="font-bold text-slate-700 text-xs text-right">
                      {rawShipping === 0 ? 'BONIFICADO FREE' : formatPrice(rawShipping)}
                    </span>
                  </div>

                  {/* Option 2: Express Delivery */}
                  <div 
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                      shippingMethod === 'express' 
                        ? 'border-brand-green bg-brand-green/5' 
                        : 'border-slate-150 bg-white hover:border-slate-350'
                    }`}
                    id="chk-logistic-express"
                  >
                    <input 
                      type="radio" 
                      name="shipping-logistics-group" 
                      checked={shippingMethod === 'express'} 
                      onChange={() => {}}
                      className="accent-brand-green"
                    />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800">Moto Express En El Día (Solo CABA y GBA)</p>
                      <p className="text-slate-500 font-light mt-0.5">Comprando antes de las 13:00hs, se entrega de 15:00 a 20:00hs.</p>
                    </div>
                    <span className="font-bold text-slate-700 text-xs text-right">
                      {locationProvince === 'Interior' ? 'No disponible en Interior' : formatPrice(rawShipping + 300)}
                    </span>
                  </div>

                  {/* Option 3: Local Pickup */}
                  <div 
                    onClick={() => setShippingMethod('sucursal')}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                      shippingMethod === 'sucursal' 
                        ? 'border-brand-green bg-brand-green/5' 
                        : 'border-slate-150 bg-white hover:border-slate-350'
                    }`}
                    id="chk-logistic-sucursal"
                  >
                    <input 
                      type="radio" 
                      name="shipping-logistics-group" 
                      checked={shippingMethod === 'sucursal'} 
                      onChange={() => {}}
                      className="accent-brand-green"
                    />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800">Retiro Personalmente en Sucursal Palermo HQ</p>
                      <p className="text-slate-500 font-light mt-0.5">Avenida Santa Fe 3422, Palermo, CABA. Retirás de inmediato ya envasado.</p>
                    </div>
                    <span className="font-bold text-brand-green text-xs text-right uppercase tracking-wider">¡Sin Cargo!</span>
                  </div>

                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold text-xs py-3 px-6 rounded-xl uppercase flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Volver
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider cursor-pointer shadow flex items-center gap-1.5"
                    id="btn-chk-step3-next"
                  >
                    <span>Siguiente Paso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Paying details Payment Gateway */}
            {activeStep === 4 && (
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-brand-charcoal">Seleccionar Método de Pago</h3>
                  <p className="text-[11px] text-slate-500 font-sans">Utilizamos fajas de pasarelas de pago cifradas seguras SSL.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                  
                  {/* Credit card selector */}
                  <div 
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-4 border-2 rounded-2xl cursor-pointer text-center space-y-2 font-bold ${
                      paymentMethod === 'credit' ? 'border-brand-green bg-brand-green/5' : 'border-slate-150 hover:border-slate-350'
                    }`}
                  >
                    <span>💳 Tarjeta de Crédito</span>
                    <p className="text-[10px] text-slate-400 font-normal">Hasta 3 Cuotas sin interés</p>
                  </div>

                  {/* Wire transfer selector */}
                  <div 
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 border-2 rounded-2xl cursor-pointer text-center space-y-2 font-bold ${
                      paymentMethod === 'transfer' ? 'border-brand-green bg-brand-green/5' : 'border-slate-150 hover:border-slate-350'
                    }`}
                  >
                    <span>🏦 Transferencia CBU/CVU</span>
                    <p className="text-[10px] text-brand-green font-bold flex items-center justify-center gap-0.5">⭐ ¡10% EXTRA de Descuento!</p>
                  </div>

                  {/* Cash selector */}
                  <div 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 border-2 rounded-2xl cursor-pointer text-center space-y-2 font-bold ${
                      paymentMethod === 'cash' ? 'border-brand-green bg-brand-green/5' : 'border-slate-150 hover:border-slate-350'
                    }`}
                  >
                    <span>💵 RapiPago / PagoFácil</span>
                    <p className="text-[10px] text-slate-400 font-normal">Efectivo en Redes locales</p>
                  </div>

                </div>

                {/* Conditional Paying form controls */}
                {paymentMethod === 'credit' && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="sm:col-span-2">
                      <label htmlFor="chk-cardnum" className="text-[10px] uppercase font-bold text-slate-405 tracking-wider">Número de Tarjeta de Crédito (16 dígitos) *</label>
                      <input
                        id="chk-cardnum"
                        type="text"
                        placeholder="4517 7822 5541 3326"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label htmlFor="chk-cardname" className="text-[10px] uppercase font-bold text-slate-405 tracking-wider">Nombre del Titular (Como figura en plástico) *</label>
                      <input
                        id="chk-cardname"
                        type="text"
                        placeholder="Ej. Martin Pérez"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="chk-expiry" className="text-[10px] uppercase font-bold text-slate-405 tracking-wider">Vencimiento *</label>
                        <input
                          id="chk-expiry"
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-center font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label htmlFor="chk-cvv" className="text-[10px] uppercase font-bold text-slate-405 tracking-wider">C.V.V (En Dorso) *</label>
                        <input
                          id="chk-cvv"
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand-green text-center font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 font-sans text-xs space-y-3 leading-relaxed">
                    <p className="font-bold text-emerald-800 flex items-center gap-1">⭐ ¡Felicitaciones! Tenés bonificado un 10% Extra por transferencia:</p>
                    <p className="text-slate-550 font-light">Para completar el despacho, deberás transferir el monto final al CBU coordinado del Almacén rústico:</p>
                    
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-120 font-mono text-[11px] text-slate-700 space-y-1">
                      <p><span className="font-bold text-slate-450 uppercase text-[9.5px]">Banco:</span> Banco Santander Río</p>
                      <p><span className="font-bold text-slate-450 uppercase text-[9.5px]">CBU Oficial:</span> 0720123420000001234567</p>
                      <p><span className="font-bold text-slate-450 uppercase text-[9.5px]">Alias del Almacén:</span> <span className="font-bold underline">semilla.real.almacen</span></p>
                      <p><span className="font-bold text-slate-450 uppercase text-[9.5px]">Titular:</span> Almacén Natural S.R.L.</p>
                    </div>

                    <p className="text-[10px] text-slate-400 font-light">• Una vez confirmada tu orden, envianos el comprobante bancario por WhatsApp para activar el empaque de inmediato.</p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 font-sans text-xs space-y-2 leading-relaxed">
                    <p className="font-bold text-brand-charcoal">🧾 Generación Automática de Cupón en Efectivo</p>
                    <p className="text-slate-500 font-light">Al finalizar, obtendrás un código numérico verificable para pagar presencialmente en Rapipago o PagoFácil en un plazo máximo de 48hs naturales.</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold text-xs py-3 px-6 rounded-xl uppercase flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Volver
                  </button>

                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider cursor-pointer shadow flex items-center gap-1.5"
                    id="btn-chk-step4-submit"
                  >
                    <span>Finalizar e Imprimir Orden</span>
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-beige" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: Success confirmed ticket layout print */}
            {activeStep === 5 && confirmedOrderSummary && (
              <div className="space-y-6 text-center font-sans text-xs text-slate-500">
                <div className="w-16 h-16 bg-emerald-600/10 text-emerald-600 border border-emerald-250 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-brand-green font-extrabold uppercase tracking-widest block">¡COMPRA DESPACHADA CON ÉXITO!</span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-brand-charcoal leading-none">
                    Gracias por apoyar una alimentación real y local
                  </h2>
                  <p className="text-xs text-slate-450 leading-relaxed font-light max-w-md mx-auto">
                    Tu pedido ha sido procesado de forma correcta con el identificador de orden <span className="font-bold text-brand-green-dark bg-emerald-50 border border-emerald-100 py-1 px-2.5 rounded-lg text-xs leading-none inline-block">{confirmedOrderId}</span>.
                  </p>
                </div>

                {/* PDF styled ticket layout */}
                <div className="border border-dashed border-slate-300 rounded-3xl p-5 bg-[#FAF9F6] text-left max-w-sm mx-auto space-y-4 shadow-inner" id="printable-order-ticket-frame">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[10.5px]">
                    <span className="font-bold text-slate-400">ALMACÉN NATURAL NATURAL</span>
                    <span className="font-bold text-slate-705">{confirmedOrderSummary.date}</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <p className="text-brand-charcoal"><span className="text-slate-400 font-medium">Cliente:</span> {custName}</p>
                    <p className="text-brand-charcoal"><span className="text-slate-400 font-medium">DNI Facturación:</span> {custDni}</p>
                    <p className="text-brand-charcoal"><span className="text-slate-400 font-medium">Dirección:</span> {shipStreet}, {shipCity} ({locationProvince})</p>
                    <p className="text-brand-charcoal"><span className="text-slate-400 font-medium font-bold uppercase tracking-wider block text-[9.5px] mt-2 mb-1">Items De Compra:</span></p>
                    
                    {confirmedOrderSummary.items.map((it: any, iId: number) => (
                      <div key={iId} className="flex justify-between font-medium text-slate-650 pl-2">
                        <span>• {it.product.name} ({it.selectedVariant.label}) x{it.quantity}</span>
                        <span>{formatPrice(it.selectedVariant.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-normal">Subtotal:</span>
                      <span className="font-bold text-slate-650">{formatPrice(confirmedOrderSummary.subtotal)}</span>
                    </div>

                    {confirmedOrderSummary.discountAmount > 0 && (
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>Descuentos Aplicados:</span>
                        <span>-{formatPrice(confirmedOrderSummary.discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-455 font-normal">Envío:</span>
                      <span className="font-bold text-slate-650">
                        {confirmedOrderSummary.shippingPrice === 0 ? 'BONIFICADO FREE' : formatPrice(confirmedOrderSummary.shippingPrice)}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-sm">
                      <span className="text-slate-800 font-display">Monto Total Cifrado</span>
                      <span className="text-brand-green-dark">{formatPrice(confirmedOrderSummary.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <p className="text-[10px] text-slate-450 block max-w-sm mx-auto leading-normal">
                    ✓ Hemos enviado un enlace de seguimiento de correo encriptado y la factura tipo B a tu mail {custEmail}.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 font-sans text-xs">
                    <button
                      onClick={() => { setCurrentView('shop'); }}
                      className="bg-brand-green text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer text-center"
                    >
                      Continuar Comprando
                    </button>
                    <button
                      onClick={() => setCurrentView('account')}
                      className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer text-center"
                    >
                      Ver mis Pedidos
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Block: Sticky order items basket tracking summary (Step 1-4 only) */}
          {activeStep < 5 && (
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-xs font-sans text-xs text-brand-charcoal space-y-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Cesta del Checkout</span>
                
                <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.selectedVariant.label}`} className="flex justify-between items-start gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border border-slate-50 shrink-0" referrerPolicy="no-referrer" />
                      <div className="leading-tight flex-grow">
                        <p className="font-bold text-slate-700 line-clamp-1">{item.product.name}</p>
                        <span className="text-[10px] text-slate-450 block mt-0.5">{item.selectedVariant.label} • cant: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-600 text-right">{formatPrice(item.selectedVariant.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-50 pt-4 space-y-2.5 font-sans leading-none">
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="font-bold text-slate-650">{formatPrice(rawSubtotal)}</span>
                  </div>

                  {rawDiscount > 0 && (
                    <div className="flex justify-between text-red-500 font-bold">
                      <span className="flex items-center gap-0.5">Cupón {appliedCoupon?.code}:</span>
                      <span>-{formatPrice(rawDiscount)}</span>
                    </div>
                  )}

                  {paymentAdditionDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento Transferencia (10%):</span>
                      <span>-{formatPrice(paymentAdditionDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Envío ({shippingMethod === 'sucursal' ? 'Retiro' : 'A domicilio'}):</span>
                    <span className="font-bold text-slate-650">
                      {rawShipping === 0 ? 'Sin Cargo' : formatPrice(rawShipping)}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between font-display text-sm">
                    <span className="font-black text-slate-800 uppercase">Monto Total Compra</span>
                    <span className="text-base font-black text-brand-green-dark">{formatPrice(calculatedGrandTotal)}</span>
                  </div>

                </div>
              </div>

              {/* Secure transaction advice boxes */}
              <div className="bg-brand-cream/60 border border-brand-beige/25 p-4 rounded-3xl flex gap-2 font-sans text-[11px] text-brand-green-dark leading-relaxed">
                <Info className="w-4.5 h-4.5 shrink-0 text-brand-green mt-0.5" />
                <span>Tu compra se calcula en Pesos Argentinos (ARS) de forma predeterminada para evitar la devaluación local de divisas. Inocuidad sellada de fajas.</span>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
