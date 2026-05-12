import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(null);

  const stars = Array.from({ length: 10 }, (_, i) => (i + 1) / 1);

  return (
    <div className="flex gap-0.5" role="group" aria-label="Puntuación">
      {stars.map((starValue) => {
        const active = (hover || rating) >= starValue;
        return (
          <button
            key={starValue}
            onClick={() => onRate(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            className={`
              relative w-5 h-5 sm:w-6 sm:h-6 transition-all duration-150 cursor-pointer
              ${active ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-500 hover:scale-105'}
            `}
            aria-label={`Puntuar ${starValue} de 10`}
          >
            <Star className={`w-full h-full fill-current`} />
          </button>
        );
      })}
    </div>
  );
}
