/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  MapPin, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Award,
  Leaf,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-fade-in" id="about-view-container">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-brand-cream rounded-3xl p-8 sm:p-14 border border-brand-beige/25 shadow-sm space-y-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green-dark text-[10px] font-extrabold uppercase px-3.5 py-1.5 rounded-full select-none tracking-widest border border-brand-green/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FOCALIZADOS EN TU BIENESTAR</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-brand-charcoal tracking-tight leading-tight">
          Nuestra Razón de Ser: Alimentos Reales de Origen Orgánico
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed font-light max-w-2xl mx-auto">
          Proveemos insumos de molienda fresca y cosechas nobles directas de la tierra sin manipular artificialmente. Creemos en una alimentación inteligente, transparente y libre de agregados químicos nocivos.
        </p>
      </div>

      {/* 2. Core Pillars (Mission, Vision, Values) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto font-sans text-brand-charcoal" id="about-pillars">
        
        {/* Mission card */}
        <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-3 flex flex-col items-start">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green-dark flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider">Misión</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Facilitar el acceso federal a granos y alimentos nobles de primera calidad orgánica en todo el territorio argentino, democratizando la alimentación consciente con precios directos de cooperativa.
          </p>
        </div>

        {/* Vision card */}
        <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-3 flex flex-col items-start">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green-dark flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider">Visión</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Sostenernos como la plataforma líder en e-commerce de provisión orgánica, extendiendo nuestra red para cooperar activamente con más de 120 familias de agricultores independientes para 2028.
          </p>
        </div>

        {/* Values card */}
        <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-3 flex flex-col items-start">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green-dark flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider">Valores</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Inocuidad garantizada, trazabilidad ecológica total, fomento activo al desarrollo familiar rural y total transparencia en la rotulación de alérgenos bajo faja sellada libre de gluten.
          </p>
        </div>

      </section>

      {/* 3. Narrative Professional History Timeline */}
      <section className="space-y-8 max-w-4xl mx-auto" id="about-timeline">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <History className="w-4 h-4 text-brand-green" />
            <span>NUESTRO RECORRIDO</span>
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-charcoal">Cómo sembramos nuestro camino</h2>
        </div>

        {/* Vertical Timeline nodes */}
        <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-10 font-sans">
          
          {/* Milestone 1 */}
          <div className="relative">
            {/* Ticker bullet */}
            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-brand-green-dark border-4 border-white shadow flex items-center justify-center" />
            
            <div className="space-y-1">
              <span className="text-brand-green-dark font-extrabold text-xs sm:text-sm">2018 — El Semillero Inicial</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Comenzamos como un pequeño puesto familiar en Almagro, CABA.</p>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Seleccionando de forma manual lotes de nueces y chía de pequeños minifundios andinos. La frescura y la limpieza de desechos corrieron el boca en boca velozmente.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-brand-green-dark border-4 border-white shadow flex items-center justify-center" />
            
            <div className="space-y-1">
              <span className="text-brand-green-dark font-extrabold text-xs sm:text-sm">2021 — Certificación e Inocuidad</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Inauguramos nuestra propia molienda integrada libre de trazas.</p>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Para garantizar la seguridad alimentaria en trazas cruzadas de gluten. Obtuvimos las primeras homologaciones oficiales Sin TACC provinciales y convenios de comercio justo con cooperativas de Misiones y Salta.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-brand-green-dark border-4 border-white shadow flex items-center justify-center" />
            
            <div className="space-y-1">
              <span className="text-brand-green-dark font-extrabold text-xs sm:text-sm">2026 — Despensa Digital Federal</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Lideramos el e-commerce saludable premium con cobertura nacional.</p>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Facilitando entregas express en el día en CABA y GBA, y encomiendas sanitizadas de bajo costo al interior de las provincias argentinas. Cuidamos tu cuerpo, amamos lo real.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Certifications grid with icons Certificaciones */}
      <section className="bg-brand-gray-light py-12 px-6 rounded-3xl border border-slate-100 max-w-6xl mx-auto space-y-8" id="about-certifications">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-green-dark font-extrabold uppercase tracking-widest block">STANDARDS DE SEGURIDAD</span>
          <h2 className="font-display font-extrabold text-xl text-brand-charcoal">Sellos y Certificaciones Homologadas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans text-brand-charcoal text-center">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-150 flex flex-col items-center space-y-2.5">
            <div className="w-11 h-11 bg-orange-100/10 text-orange-600 border border-orange-200 rounded-full flex items-center justify-center font-black">
              Sin TACC
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider leading-none">Apto Celíacos</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">Envasado libre de alérgenos de trigo, avena, cebada y centeno.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 flex flex-col items-center space-y-2.5">
            <div className="w-11 h-11 bg-emerald-100/10 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center text-xs font-black">
              USDA
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider leading-none">USDA Organic</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">Lotes agrícolas exentos de fertilizantes de síntesis química.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 flex flex-col items-center space-y-2.5">
            <div className="w-11 h-11 bg-sky-100/10 text-sky-600 border border-sky-200 rounded-full flex items-center justify-center font-bold">
              Vegano
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider leading-none">Certificado Vegano</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">Exento de materias primas o subproductos de procedencia animal.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 flex flex-col items-center space-y-2.5">
            <div className="w-11 h-11 bg-indigo-100/10 text-indigo-600 border border-indigo-200 rounded-full flex items-center justify-center font-bold">
              Justo
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider leading-none">Comercio Justo</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">Coordinamos retribuciones éticas estables con minifundios rurales.</p>
          </div>

        </div>
      </section>

    </div>
  );
}
