'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { StarWarsCharacter } from '../utils/markdownTemplate';

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
        setError(err.message || 'No se pudo conectar con los servidores imperiales.');
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
        setIsDropdownOpen(false);
      } else {
        // Try partial match if exact match fails
        const partialMatches = allCharacters.filter((char) =>
          char.name.toLowerCase().includes(sanitizedQuery)
        );
        if (partialMatches.length > 0) {
          onCharacterSelect(partialMatches[0]);
          setQuery(partialMatches[0].name);
          setIsDropdownOpen(false);
        } else {
          setError(`El personaje "${query}" no fue encontrado en los archivos de la Holonet.`);
        }
      }
      setLoading(false);
    }, 600); // Small delay for premium feel and visual loading state
  };

  const handleSelectSuggestion = (char: StarWarsCharacter) => {
    setQuery(char.name);
    onCharacterSelect(char);
    setIsDropdownOpen(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-20">
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
              className="w-full px-5 py-4 pl-12 bg-gray-900/80 backdrop-blur-md text-amber-100 placeholder-gray-500 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 shadow-lg"
            />
            <Search className="absolute left-4 w-5 h-5 text-amber-500/60" />
            
            <button
              type="submit"
              disabled={initialLoading || loading || !query.trim()}
              className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Generar</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredCharacters.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-950/95 border border-amber-500/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-30 transition-all max-h-60 overflow-y-auto">
              {filteredCharacters.map((char, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(char)}
                  className="w-full text-left px-5 py-3 hover:bg-amber-500/10 text-amber-200 border-b border-amber-500/5 last:border-b-0 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">{char.name}</span>
                  <span className="text-xs text-amber-500/50 uppercase tracking-widest">{char.gender}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading Database Overlay */}
        {initialLoading && (
          <div className="flex items-center gap-3 text-amber-500/70 justify-center text-sm mt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sincronizando con los archivos de la Holonet...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 mt-2 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error de Conexión o Archivo No Encontrado</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
