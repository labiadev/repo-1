'use client';

import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import CertificatePreview from './components/CertificatePreview';
import { StarWarsCharacter } from './utils/markdownTemplate';
import { Sparkles, Orbit } from 'lucide-react';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<StarWarsCharacter | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col relative overflow-hidden font-sans">
      {/* Sci-fi light background grid & subtle glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-stone-50 to-stone-100 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-start relative z-10 space-y-12">
        
        {/* Header branding */}
        <div className="text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 tracking-wider shadow-sm">
            <Orbit className="w-4 h-4 animate-spin-slow text-indigo-600" />
            <span>SISTEMA DE ARCHIVOS HOLONET</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-indigo-750 via-indigo-900 to-slate-900 uppercase">
            Registro Galáctico
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Busca cualquier espécimen u héroe legendario registrado en los anales de la galaxia y genera de inmediato su certificado oficial en PDF con firma digital y validación QR.
          </p>
        </div>

        {/* Search component */}
        <SearchForm onCharacterSelect={setSelectedCharacter} />

        {/* Certificate preview wrapper */}
        {selectedCharacter ? (
          <CertificatePreview character={selectedCharacter} />
        ) : (
          <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl border border-dashed border-slate-200 bg-white/60 backdrop-blur-sm text-center space-y-4 mt-8 animate-in fade-in duration-300 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
              <Sparkles className="w-6 h-6 text-indigo-500/60" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-800">Esperando Selección</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Introduce el nombre de un personaje en el buscador superior para comenzar la autenticación galáctica.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-6 text-center border-t border-slate-200 text-xs text-slate-400 font-mono tracking-wider relative z-10 bg-white/40 backdrop-blur-sm">
        © {new Date().getFullYear()} ARCHIVOS OFICIALES DEL SENADO GALÁCTICO. TODOS LOS DERECHOS RESERVADOS.
      </footer>
    </div>
  );
}
