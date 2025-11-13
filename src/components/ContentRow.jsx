import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

function ContentRow({ title, items, onToggleList }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    updateArrows();
  }, [items]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    setTimeout(() => updateArrows(), 400);
  };

  const updateArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="mb-14 group animate-fadeIn">
      {/* Título con línea */}
      <div className="flex items-center gap-3 mb-3 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
          {title}
        </h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600/80 via-red-500/40 to-transparent" />
      </div>

      {/* Contenedor del carrusel */}
      <div className="relative">
        {/* Flecha izquierda */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       w-12 h-24 rounded-r-xl
                       bg-gradient-to-r from-gray-900/90 via-gray-800/70 to-transparent
                       backdrop-blur-sm hover:scale-105 hover:brightness-110
                       opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-start pl-2 shadow-lg"
          >
            <ChevronLeft className="w-8 h-8 text-white drop-shadow" />
          </button>
        )}

        {/* Lista scrollable */}
        <div
          ref={scrollContainerRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-8 py-8 scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-56 transform transition-transform duration-300 hover:scale-104 hover:z-10"
            >
              <MovieCard item={item} onToggleList={onToggleList} />
            </div>
          ))}
        </div>

        {/* Flecha derecha */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       w-12 h-24 rounded-l-xl
                       bg-gradient-to-l from-gray-900/90 via-gray-800/70 to-transparent
                       backdrop-blur-sm hover:scale-105 hover:brightness-110
                       opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-end pr-2 shadow-lg"
          >
            <ChevronRight className="w-8 h-8 text-white drop-shadow" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ContentRow;
