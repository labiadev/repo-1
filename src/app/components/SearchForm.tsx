'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { StarWarsCharacter } from '../utils/markdownTemplate';
import BB8Loader from './BB8Loader';

interface SearchFormProps {
  onCharacterSelect: (character: StarWarsCharacter) => void;
}

export default function SearchForm({ onCharacterSelect }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [allCharacters, setAllCharacters] = useState<StarWarsCharacter[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<StarWarsCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all characters on mount
  useEffect(() => {
    async function fetchCharacters() {
      try {
        setInitialLoading(true);
        const res = await fetch('https://swapi.info/api/people');
        if (!res.ok) throw new Error('Error al cargar la base de datos de la Holonet');
        const data = await res.json();
        setAllCharacters(data);
      } catch (err: any) {
        setError(err.message || 'No se pudo conectar con los servidores de la Nueva República.');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter characters as query changes
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredCharacters([]);
      return;
    }
    const sanitizedQuery = query.toLowerCase();
    const matches = allCharacters.filter((char) =>
      char.name.toLowerCase().includes(sanitizedQuery)
    );
    setFilteredCharacters(matches.slice(0, 8)); // limit to 8 suggestions
  }, [query, allCharacters]);

  const trackSearch = async (name: string) => {
    try {
      await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
    } catch (e) {
      console.error('Error reporting search history to KV:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialLoading) return;
    setError(null);
    setLoading(true);

    const sanitizedQuery = query.trim().toLowerCase();
    const character = allCharacters.find(
      (char) => char.name.toLowerCase() === sanitizedQuery
    );

    setTimeout(() => {
      if (character) {
        onCharacterSelect(character);
        trackSearch(character.name);
        setIsDropdownOpen(false);
      } else {
        // Try partial match if exact match fails
        const partialMatches = allCharacters.filter((char) =>
          char.name.toLowerCase().includes(sanitizedQuery)
        );
        if (partialMatches.length > 0) {
          onCharacterSelect(partialMatches[0]);
          trackSearch(partialMatches[0].name);
          setQuery(partialMatches[0].name);
          setIsDropdownOpen(false);
        } else {
          setError(`El personaje "${query}" no fue encontrado en los archivos de la Holonet.`);
        }
      }
      setLoading(false);
    }, 1200); // Dynamic delay to appreciate the BB-8 animation
  };

  const handleSelectSuggestion = (char: StarWarsCharacter) => {
    setQuery(char.name);
    onCharacterSelect(char);
    trackSearch(char.name);
    setIsDropdownOpen(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-20 space-y-6">
      {/* BB-8 Loading State for submission */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <BB8Loader message="Buscando coordenadas del personaje en la Holonet..." />
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div className="relative" ref={dropdownRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setError(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Buscar personaje (ej: Luke Skywalker, Darth Vader...)"
                disabled={initialLoading}
                className="w-full px-5 py-4 pl-12 bg-white/90 backdrop-blur-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 shadow-md"
              />
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              
              <button
                type="submit"
                disabled={initialLoading || loading || !query.trim()}
                className="absolute right-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && filteredCharacters.length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30 transition-all max-h-60 overflow-y-auto">
                {filteredCharacters.map((char, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSuggestion(char)}
                    className="w-full text-left px-5 py-3 hover:bg-slate-50 text-slate-800 border-b border-slate-100 last:border-b-0 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium">{char.name}</span>
                    <span className="text-xs text-indigo-500/60 font-semibold uppercase tracking-wider">{char.gender}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Initial database load */}
          {initialLoading && (
            <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-md">
              <BB8Loader message="Inicializando base de datos galáctica..." />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 mt-2 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-900">Coordenadas Inválidas</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
