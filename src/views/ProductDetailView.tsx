/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Leaf, 
  ShieldAlert, 
  MessageSquare, 
  HelpCircle, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetailView() {
  const {
    selectedProduct,
    setSelectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    wishlist,
    currency,
    reviews,
    addReview,
    products
  } = useShop();

  // Redirect if no product is active
  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500 text-sm">No se seleccionó ningún producto para detallar.</p>
        <button 
          onClick={() => setCurrentView('shop')}
          className="bg-brand-green text-white font-sans font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
        >
          Volver a la Tienda
        </button>
      </div>
    );
  }

  // Active state selectors
  const [selectedVariant, setSelectedVariant] = useState(selectedProduct.variants[0]);
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'facts' | 'ingredients'>('info');

  // FAQ accordion states
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // Review Form States
  const [revAuthor, setRevAuthor] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revSuccess, setRevSuccess] = useState(false);

  // Multi-Currency Converter
  const formatPrice = (priceInArs: number) => {
    if (currency === 'USD') {
      return `u$s ${(priceInArs / 1000).toFixed(2)}`;
    }
    return `$${priceInArs.toLocaleString('es-AR')}`;
  };

  const isFavorite = wishlist.some(item => item.id === selectedProduct.id);

  // Filter reviews matching current product ID
  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === selectedProduct.id);
  }, [reviews, selectedProduct]);

  // Compute average rating from actual reviews (including custom user reviews)
  const calculatedRating = useMemo(() => {
    if (productReviews.length === 0) return selectedProduct.rating;
    const sum = productReviews.reduce((s, r) => s + r.rate, 0);
    return Number((sum / productReviews.length).toFixed(1));
  }, [productReviews, selectedProduct]);

  // Related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
      .slice(0, 4);
  }, [products, selectedProduct]);

  // FAQ mock list
  const faqs = [
    { id: 1, q: '¿Tienen stock permanente?', a: 'Sí, trabajamos directamente con cooperativas agrícolas ecológicas de alta rotación para garantizar un stock fresco semanal permanente.' },
    { id: 2, q: '¿Cómo conservo adecuadamente este producto natural?', a: 'Se recomienda almacenarlo en un frasco hermético de vidrio bien tapado, colocado en un lugar fresco, oscuro y seco, apartado de la humedad ambiente y del calor directo de cocinas.' },
    { id: 3, q: '¿Qué significa que sea certificado Sin TACC?', a: 'Significa que está completamente libre de trigo, avena, cebada y centeno (TACC). El envasado de lotes cuenta con estrictas fajas mecánicas de inocuidad para anular cualquier traza o contaminación cruzada perjudicial para celíacos.' }
  ];

  const handleAddToCart = () => {
    addToCart(selectedProduct, qty, selectedVariant);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;

    addReview({
      author: revAuthor,
      rate: revRating,
      comment: revComment,
      productId: selectedProduct.id
    });

    setRevAuthor('');
    setRevComment('');
    setRevRating(5);
    setRevSuccess(true);
    setTimeout(() => setRevSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="product-detail-view-container">
      
      {/* Back to Shop Nav link */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-green-dark cursor-pointer transition-colors focus:outline-none"
        id="btn-back-to-shop"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo de la tienda
      </button>

      {/* 1. Core Visual Product block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Gallery column with Zooming capabilities */}
        <div className="lg:col-span-6 space-y-4">
          <div 
            className="aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-brand-gray-light relative cursor-zoom-in"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            id="detail-main-image-gallery"
          >
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${zoomActive ? 'scale-125' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />

            {/* Static allergen seals overlapping */}
            <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
              {selectedProduct.isVegan && (
                <span className="bg-emerald-600/90 text-white text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1 select-none">
                  Apto Vegano
                </span>
              )}
              {selectedProduct.isGlutenFree && (
                <span className="bg-[#FAF9F6] border border-orange-200 text-orange-600 text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1 select-none">
                  Sin TACC
                </span>
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
            ✓ Colocá el cursor encima de la foto para activar la lupa de zoom mecánico.
          </p>
        </div>

        {/* Purchase Action & Information Metadata Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between font-sans">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-brand-green-dark font-extrabold uppercase tracking-widest block">{selectedProduct.brand}</span>
              
              {/* Add to Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500 hover:text-red-500 shadow-xs transition-colors cursor-pointer"
                aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
                id="detail-toggle-fav-btn"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
              </button>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal leading-tight tracking-tight">
              {selectedProduct.name}
            </h1>

            {/* Dynamic average stars metrics detailing current reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(calculatedRating) ? 'fill-amber-500' : 'text-slate-300'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-1.5">{calculatedRating} estrellas</span>
              </div>
              <span className="text-xs text-slate-400">• ({productReviews.length} opiniones certificadas)</span>
            </div>

            {/* Pricing block with discounts */}
            <div className="bg-brand-gray-light p-4 rounded-2xl flex items-baseline gap-3 border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedProduct.previousPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(Math.round(selectedProduct.previousPrice * (selectedVariant.price / selectedProduct.price)))}
                </span>
              )}
              {selectedProduct.discount && (
                <span className="bg-red-500 text-white font-bold text-[10px] py-1 px-2.5 rounded-full uppercase tracking-wider">
                  -{selectedProduct.discount}% OFF
                </span>
              )}
            </div>

            {/* General Description */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
              {selectedProduct.description}
            </p>

            {/* 2. Variants Selector Variantes */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Seleccionar Variante de Peso:</span>
              <div className="flex flex-wrap gap-2.5">
                {selectedProduct.variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQty(1); // reset quantity to prevent overspending on variant updates
                    }}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer border ${
                      selectedVariant.label === v.label
                        ? 'bg-brand-green-dark border-brand-green-dark text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    id={`detail-variant-btn-${v.label}`}
                  >
                    {v.label} — {formatPrice(v.price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock gauge indicator */}
            <div className="flex items-center gap-2 pt-1 font-sans text-xs">
              <span className="text-slate-400">Stock disponible:</span>
              {selectedProduct.stock > 0 ? (
                <span className="font-extrabold text-brand-green-dark flex items-center gap-1">
                  ✓ ¡Hay Stock! ({selectedProduct.stock} unidades en almacén)
                </span>
              ) : (
                <span className="font-extrabold text-red-500 flex items-center gap-1">
                  ⚠ Sin Stock Permanente
                </span>
              )}
            </div>
          </div>

          {/* 3. Selector of Quantities and Core Cart Buttons */}
          <div className="flex gap-4 border-t border-slate-100 pt-5 mt-6" id="detail-purchase-controls">
            
            {/* Quantity Incrementor */}
            <div className="flex items-center bg-brand-gray-light border border-slate-200 rounded-xl px-2">
              <button
                onClick={() => setQty(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 focus:outline-none cursor-pointer"
                aria-label="Disminuir cantidad"
                id="btn-detail-qty-decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-bold text-slate-800 w-10 text-center select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty(prev => Math.min(selectedProduct.stock, prev + 1))}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 focus:outline-none cursor-pointer"
                aria-label="Aumentar cantidad"
                id="btn-detail-qty-increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core buy action */}
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock <= 0}
              className={`flex-grow py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 leading-none transition-all focus:outline-none cursor-pointer ${
                selectedProduct.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : addedSuccess
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-brand-green hover:bg-brand-green-dark text-white shadow-md hover:shadow-xl'
              }`}
              id="detail-add-to-cart-btn"
            >
              {selectedProduct.stock <= 0 ? (
                <span>Sin Stock</span>
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agregado Correctamente</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>AGREGAR AL CARRITO de compras</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 2. Secondary Info: Tabbed description, Ingredients & Nutritional tables */}
      <div className="border border-slate-150 rounded-3xl overflow-hidden bg-white shadow-sm" id="detail-specs-tabs-row">
        
        {/* Tab triggers */}
        <div className="flex border-b border-slate-100 bg-brand-gray-light text-xs font-bold text-slate-400 uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-6 border-r border-slate-120 hover:text-slate-850 cursor-pointer ${activeTab === 'info' ? 'bg-white text-slate-800 border-t-2 border-brand-green' : ''}`}
            id="specs-tab-trigger-info"
          >
            Descripción Ampliada
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-3 px-6 border-r border-slate-120 hover:text-slate-850 cursor-pointer ${activeTab === 'ingredients' ? 'bg-white text-slate-800 border-t-2 border-brand-green' : ''}`}
            id="specs-tab-trigger-ingredients"
          >
            Ingredientes Completos
          </button>
          <button
            onClick={() => setActiveTab('facts')}
            className={`py-3 px-6 hover:text-slate-850 cursor-pointer ${activeTab === 'facts' ? 'bg-white text-slate-800 border-t-2 border-brand-green' : ''}`}
            id="specs-tab-trigger-facts"
          >
            Información Nutricional
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6 sm:p-8 font-sans">
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
              <p>
                Este producto ha sido sometido a cuidadosas inspecciones de color, grosor y limpieza manual de impurezas. No contiene aceites adicionados artificiales, grasas hidrogenadas ni sulfitos. Ideal para integrar a tus mezclas rústicas de yogur natural, compotas, barritas de cereal de elaboración propia o colaciones para la escuela y oficina.
              </p>
              <p>
                La marca <span className="font-bold text-slate-700">{selectedProduct.brand}</span> destaca en el mercado nacional por certificar cadenas de comercio justo que colaboran directamente con pequeños labradores locales de la economía familiar regional.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lista detallada de ingredientes:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-500 space-y-1 font-light">
                {selectedProduct.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <div className="text-[11px] text-orange-500 bg-orange-50/50 border border-orange-100 p-3 rounded-xl flex items-center gap-2 max-w-lg">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span><span className="font-bold">Alergias:</span> El envasado se procesa en maquinaria dedicada libre de trazas Sin TACC. Libre de gluten.</span>
              </div>
            </div>
          )}

          {activeTab === 'facts' && (
            <div className="space-y-4 max-w-md">
              <h4 className="text-xs font-bold text-slate-750 uppercase tracking-wider">Tabla de Valores (Por porción de {selectedProduct.nutritionalFacts.servingSize}):</h4>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden font-sans text-xs">
                <div className="grid grid-cols-2 bg-brand-gray-light py-2 px-4 border-b border-slate-100 font-bold">
                  <span>Nutriente</span>
                  <span>Cantidad por Porción</span>
                </div>
                <div className="grid grid-cols-2 py-2 px-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-650">Valor Energético (Calorías)</span>
                  <span className="font-bold text-slate-800">{selectedProduct.nutritionalFacts.calories}</span>
                </div>
                <div className="grid grid-cols-2 py-2 px-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-650">Grasas Totales</span>
                  <span className="font-bold text-slate-800">{selectedProduct.nutritionalFacts.totalFat}</span>
                </div>
                <div className="grid grid-cols-2 py-2 px-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-650">Carbohidratos Netos</span>
                  <span className="font-bold text-slate-800">{selectedProduct.nutritionalFacts.carbohydrates}</span>
                </div>
                <div className="grid grid-cols-2 py-2 px-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-650">Proteínas Vegetales</span>
                  <span className="font-bold text-slate-800">{selectedProduct.nutritionalFacts.protein}</span>
                </div>
                <div className="grid grid-cols-2 py-2 px-4">
                  <span className="font-semibold text-slate-650">Sodio</span>
                  <span className="font-bold text-slate-800">{selectedProduct.nutritionalFacts.sodium}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Product FAQs Accordion Preguntas frecuentes */}
      <div className="space-y-4" id="detail-faq-section">
        <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-400">Preguntas Frecuentes</h3>
        
        <div className="space-y-3 font-sans">
          {faqs.map(item => (
            <div key={item.id} className="bg-white border border-slate-150 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedFaqId(expandedFaqId === item.id ? null : item.id)}
                className="w-full text-left py-4 px-5 font-bold text-xs sm:text-sm text-brand-charcoal hover:bg-slate-50 flex items-center justify-between focus:outline-none cursor-pointer"
                id={`btn-faq-trigger-${item.id}`}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-green" />
                  <span>{item.q}</span>
                </div>
                {expandedFaqId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {expandedFaqId === item.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 border-t border-slate-100 text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Complete dynamic product review submission and listing Opiniones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-150 pt-8" id="detail-reviews-area">
        
        {/* Left Reviews form Column */}
        <div className="lg:col-span-5 bg-brand-gray-light p-6 rounded-3xl border border-slate-100 space-y-4 h-fit">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-base text-brand-charcoal">Escribir una Opinión</h3>
            <p className="text-[11px] text-slate-500">¿Probaste este producto? Compartí tu opinión certificada con otros compradores del Almacén.</p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-3 font-sans">
            <div>
              <label htmlFor="review-author" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tu Nombre Completo</label>
              <input
                id="review-author"
                type="text"
                placeholder="Ej. Martín Pérez"
                value={revAuthor}
                onChange={(e) => setRevAuthor(e.target.value)}
                className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2 px-3 focus:outline-none focus:border-brand-green text-xs font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Calificación de Estrellas</label>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRevRating(starVal)}
                    className="hover:scale-115 transition-transform focus:outline-none cursor-pointer"
                    aria-label={`Calificar con ${starVal} estrellas`}
                  >
                    <Star className={`w-5 h-5 ${starVal <= revRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-comment" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tu Comentario / Reseña del Producto</label>
              <textarea
                id="review-comment"
                rows={3}
                placeholder="Contanos tu experiencia (sabor, frescura, envasado)..."
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                className="w-full bg-white border border-slate-200 mt-1 rounded-xl py-2 px-3 focus:outline-none focus:border-brand-green text-xs font-medium text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs py-3 rounded-xl shadow uppercase tracking-wider cursor-pointer font-sans"
              id="btn-submit-opinion"
            >
              Publicar Opinión
            </button>
          </form>

          <AnimatePresence>
            {revSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-600 text-white text-center rounded-xl p-3 text-xs font-bold font-sans"
              >
                ✓ ¡Muchas gracias! Tu opinión ha sido publicada con éxito y recalculó el promedio general del producto.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Reviews display Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-extrabold text-base text-brand-charcoal uppercase tracking-tight">Comentarios de Compradores ({productReviews.length})</h3>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {productReviews.length > 0 ? (
              productReviews.map(r => (
                <div key={r.id} className="bg-white border border-slate-150 p-4 rounded-2xl space-y-1.5 font-sans">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-extrabold text-brand-charcoal">{r.author}</span>
                    <span className="text-[10px] text-slate-450 font-bold">{r.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, sId) => (
                        <Star key={sId} className={`w-3 h-3 ${sId < r.rate ? 'fill-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="text-[10px] text-brand-green-dark font-extrabold uppercase flex items-center gap-0.5 select-none tracking-widest text-[9px]">
                        ✓ Comprador verificado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-light">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-medium italic py-6">Todavía no hay opiniones para este producto. Sé el primero en compartir tu experiencia.</p>
            )}
          </div>
        </div>

      </div>

      {/* 5. Related Products Grid Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-150 pt-8 space-y-6" id="detail-related-products-row">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-brand-charcoal uppercase tracking-widest">También te puede interesar...</h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Productos de la misma categoría</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
