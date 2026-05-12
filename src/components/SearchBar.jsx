import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length > 2) {
      debounceRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, 500);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (query) {
        handleClear();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative flex items-center rounded-2xl bg-card border transition-all duration-300
          ${focused
            ? 'border-accent/40 shadow-glow shadow-accent/10 scale-[1.02]'
            : 'border-white/5 hover:border-white/10'
          }
        `}
      >
        <div className="pl-5 pr-3 py-3.5">
          <Search className={`w-5 h-5 transition-colors duration-200 ${focused ? 'text-accent' : 'text-slate-400'}`} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar películas, series..."
          className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 py-3.5 pr-4 outline-none"
          aria-label="Buscar contenido"
        />

        <AnimatePresence>
          {query && (
            <button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
              className="mr-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
