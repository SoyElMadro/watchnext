import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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

    const scrollAmount = container.clientWidth * 0.85;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    setTimeout(() => updateArrows(), 450);
  };

  const updateArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  return (
    <div className="group/row relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-5">
          <h2 className="section-title whitespace-nowrap">{title}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-20 flex items-center
                       bg-gradient-to-r from-bg to-transparent
                       hover:from-bg/90 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10
                          flex items-center justify-center ml-2
                          hover:bg-white/10 hover:border-white/20 hover:scale-110
                          transition-all duration-200 shadow-lg shadow-black/30">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
          </motion.button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={updateArrows}
          className="flex gap-4 sm:gap-5 overflow-x-auto hide-scrollbar px-4 sm:px-6 py-2 scroll-smooth"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
            >
              <MovieCard item={item} index={i} onToggleList={onToggleList} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-20 flex items-center justify-end
                       bg-gradient-to-l from-bg to-transparent
                       hover:from-bg/90 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10
                          flex items-center justify-center mr-2
                          hover:bg-white/10 hover:border-white/20 hover:scale-110
                          transition-all duration-200 shadow-lg shadow-black/30">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default ContentRow;
