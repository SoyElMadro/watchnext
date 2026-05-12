import { Link } from 'react-router-dom';
import { Star, Plus, Check, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { tmdb } from '../utils/tmdb';
import { useState, useCallback } from 'react';

function MovieCard({ item, index = 0, onToggleList }) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const isMovie = item.media_type === 'movie' || item.title;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
  const type = isMovie ? 'movie' : 'tv';

  const isInList = useCallback(() => {
    try {
      const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
      return lists.some(listItem => listItem.id === item.id);
    } catch {
      return false;
    }
  }, [item.id]);

  const inList = isInList();
  const voteAvg = item.vote_average || 0;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleList(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const ratingColor = 'text-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden bg-card transition-all duration-400 cursor-pointer
          ${isHovered ? 'bg-card-hover shadow-card-hover scale-[1.03] z-10' : 'shadow-card'}
        `}
      >
        <Link to={`/${type}/${item.id}`}>
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={tmdb.getImageUrl(item.poster_path)}
              alt={title}
              className={`
                w-full h-full object-cover transition-transform duration-500
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              loading="lazy"
            />

            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
              transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mx-auto">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
                <p className="text-white/80 text-xs text-center mt-2 font-medium">Ver detalles</p>
              </div>
            </div>

            {voteAvg > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  absolute top-3 right-3 px-2.5 py-1.5 rounded-xl backdrop-blur-md
                  flex items-center gap-1.5 shadow-lg
                  ${voteAvg >= 7.5 ? 'bg-emerald-500/80 border border-emerald-400/30' : 'bg-black/60 border border-white/10'}
                `}
              >
                <Star className={`w-3.5 h-3.5 ${ratingColor} fill-current`} />
                <span className="text-xs font-bold text-white">
                  {voteAvg.toFixed(1)}
                </span>
              </motion.div>
            )}

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-3 left-3"
                >
                  <span className={`
                    inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                    ${isMovie ? 'bg-accent/80 text-white' : 'bg-rose-500/80 text-white'}
                    backdrop-blur-sm border border-white/10
                  `}>
                    {isMovie ? 'Película' : 'Serie'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <div className="p-3 sm:p-4">
          <Link to={`/${type}/${item.id}`}>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-accent-hover transition-colors duration-200">
              {title}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">{year}</span>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-500 capitalize">{isMovie ? 'Película' : 'Serie'}</span>
            </div>

            <motion.button
              onClick={handleToggle}
              whileTap={{ scale: 0.85 }}
              className={`
                relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden
                ${inList
                  ? 'bg-accent text-white shadow-glow'
                  : added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-accent/20 hover:border-accent/30 hover:text-accent'
                }
              `}
              title={inList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, type: 'spring', stiffness: 400 }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : inList ? (
                  <motion.div
                    key="inlist"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
