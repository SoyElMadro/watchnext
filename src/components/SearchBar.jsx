import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && query) handleClear();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [query]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto mb-8 px-2"
      role="search"
      aria-label="Buscar contenido"
    >
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas o series..."
          aria-label="Buscar películas o series"
          className="w-full px-4 py-3 pl-12 pr-12 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 backdrop-blur-md"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-opacity duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}
