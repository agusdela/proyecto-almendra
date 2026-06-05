/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { BlogPost } from '../types';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  Search, 
  X, 
  Sparkles, 
  Heart,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type BlogCategory = 'Todos' | 'Alimentación saludable' | 'Recetas' | 'Nutrición' | 'Bienestar' | 'Vida sana';

export default function BlogView() {
  const { blogPosts } = useShop();

  const [activeCategory, setActiveCategory] = useState<BlogCategory>('Todos');
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Filter Blog Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchCat = activeCategory === 'Todos' || post.category === activeCategory;
      const matchSearch = blogSearch.trim() === '' || 
        post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
        post.summary.toLowerCase().includes(blogSearch.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(blogSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [blogPosts, activeCategory, blogSearch]);

  const categoriesList: BlogCategory[] = [
    'Todos', 'Alimentación saludable', 'Recetas', 'Nutrición', 'Bienestar', 'Vida sana'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in" id="blog-view-container">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1543883492-98440ebc25d8?q=80&w=400" 
            alt="Organic leaf background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-brand-green/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>APRENDIZAJE CONSCIENTE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight tracking-tight">
            Nutrición, Bienestar y Recetas de Cultivo Real
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            Explorá consejos científicos avalados por nutricionistas del Almacén y deliciosas preparaciones caseras saludables paso a paso para cuidar tu metabolismo familiar.
          </p>
        </div>
      </div>

      {/* 2. Sorters & Category Selector triggers */}
      <div className="space-y-4">
        {/* Responsive categories horizontal slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer focus:outline-none border ${
                activeCategory === cat
                  ? 'bg-brand-green-dark border-brand-green-dark text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              id={`blog-category-trigger-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interior blog search */}
        <div className="relative max-w-md font-sans">
          <input
            type="text"
            placeholder="Buscar recetas, consejos de chía, gluten..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            className="w-full bg-white font-sans text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:outline-none transition-all placeholder:text-slate-400 text-brand-charcoal"
            id="blog-internal-search"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          {blogSearch && (
            <button
              onClick={() => setBlogSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-450 hover:text-slate-650"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Blog lists grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              id={`blog-post-card-${post.id}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Category Floater Badge */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-brand-green-dark border border-brand-green/10 text-[9px] font-extrabold uppercase py-1 px-3 rounded-lg shadow-xs select-none">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between font-sans space-y-4">
                <div className="space-y-2">
                  {/* Author and Date indicators */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-green" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xs sm:text-sm text-brand-charcoal group-hover:text-brand-green-dark transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-3 leading-relaxed font-light">
                    {post.summary}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-[11px] font-bold text-brand-green-dark">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  <span className="hover:underline flex items-center gap-0.5">Leer Artículo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto space-y-4">
          <BookOpen className="w-10 h-10 text-slate-350 mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No se encontraron artículos</p>
          <button 
            onClick={() => { setActiveCategory('Todos'); setBlogSearch(''); }}
            className="text-xs font-bold text-brand-green-dark underline"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      )}

      {/* 4. Immersive Full-Screen overlay Reader popup dialogue */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="blog-reader-backdrop">
            {/* Dark glassmorphic backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-xs"
            />

            {/* Reading document frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
              id="blog-reader-panel"
            >
              {/* Image banner on popup */}
              <div className="relative aspect-[21/9] sm:aspect-[24/9] bg-slate-150 shrink-0">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Back / Close absolute icon button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-brand-charcoal hover:bg-white flex items-center justify-center shadow focus:outline-none cursor-pointer"
                  aria-label="Cerrar artículo"
                  id="blog-reader-close"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white font-sans space-y-1">
                  <span className="text-[9px] font-extrabold uppercase bg-brand-green py-0.5 px-2.5 rounded-lg border border-brand-green/20 tracking-wider">
                    {selectedPost.category}
                  </span>
                  <h2 className="font-display font-extrabold text-sm sm:text-base md:text-lg leading-tight line-clamp-2 md:line-clamp-none">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>

              {/* Reader body scrolls */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans text-xs sm:text-sm">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4 text-[10px] text-slate-450 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-brand-green" /> Redacción: {selectedPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Publicado: {selectedPost.date}
                    </span>
                  </div>
                  <span className="text-[10px] bg-brand-green/10 text-brand-green-dark py-1 px-3 rounded-full font-bold">
                    ⏱ {selectedPost.readTime}
                  </span>
                </div>

                <p className="text-slate-500 italic border-l-4 border-brand-green/50 pl-4 py-1 leading-relaxed bg-brand-cream/50 rounded-r-xl">
                  {selectedPost.summary}
                </p>

                <div className="text-slate-650 leading-relaxed font-light space-y-4">
                  {/* Article core split paragraph representations */}
                  <p>{selectedPost.content}</p>
                  <p>
                    Además, desde nuestra división técnica en el Almacén Natural Gourmet fomentamos fervientemente la revisión concienzuda de las rotulaciones nutricionales. Reducir la presencia de jarabes glucosados altamente industrializados y sodio refinado asiste a desintoxicar las membranas hepáticas, restableciendo los balances inmunológicos primarios de manera 100% natural.
                  </p>
                  <p>
                    Recordá que podés encontrar todos los insumos necesarios descriptos en esta nota navegando por nuestra Tienda Online, con faja de garantía sellada libres de trazas.
                  </p>
                </div>

                {/* Tags lists */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Temas vinculados:</span>
                  {selectedPost.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[9px] font-bold bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-full text-slate-500 uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Popup Footer details */}
              <div className="bg-brand-gray-light py-4 px-6 border-t border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase">ALMACÉN NATURAL • DIVULGACIÓN COMUNITARIA</span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-brand-green text-white font-bold text-[10px] py-1.5 px-4 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Cerrar Lectura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
