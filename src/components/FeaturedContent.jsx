import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { tmdb } from '../utils/tmdb';

export default function FeaturedContent({ item }) {
  const [isInList, setIsInList] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  const getStoredLists = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('myLists') || '[]');
    } catch {
      return [];
    }
  }, []);

  const checkIfInList = useCallback(() => {
    const lists = getStoredLists();
    const exists = lists.some((listItem) => listItem.id === item.id);
    setIsInList(exists);
  }, [getStoredLists, item.id]);

  useEffect(() => {
    if (item?.id) {
      checkIfInList();
    }
  }, [item, checkIfInList]);

  const handleToggleList = () => {
    const lists = getStoredLists();
    const index = lists.findIndex((listItem) => listItem.id === item.id);

    if (index !== -1) {
      lists.splice(index, 1);
      setIsInList(false);
    } else {
      lists.push({
        ...item,
        addedAt: new Date().toISOString(),
      });
      setIsInList(true);
    }

    localStorage.setItem('myLists', JSON.stringify(lists));
  };

  const isMovie = item.media_type === 'movie' || item.title;
  const mediaTitle = isMovie ? item.title : item.name;
  const mediaType = isMovie ? 'movie' : 'tv';
  const voteAvg = item.vote_average || 0;

  const ratingLabel = voteAvg >= 7.5 ? 'Excelente' : voteAvg >= 5.5 ? 'Buena' : voteAvg > 0 ? 'Regular' : '';
  const ratingColor = 'text-amber-400';

  return (
    <div className="relative h-[85vh] min-h-[550px] sm:min-h-[620px] w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={item.id}
          className="absolute inset-0 bg-cover bg-top"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundImage: `url(${tmdb.getImageUrl(item.backdrop_path, 'original')})`,
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#09090e] via-[#09090e]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-[#09090e]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090e]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#09090e_100%)]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl space-y-5"
        >
          <div className="flex items-center gap-3">
            <span className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${isMovie ? 'bg-accent/20 text-accent-hover border border-accent/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}
              backdrop-blur-md
            `}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {isMovie ? 'Película' : 'Serie'}
            </span>

            {voteAvg > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <span className={`text-sm font-bold ${ratingColor}`}>
                  {voteAvg.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">/ 10</span>
                <span className={`text-xs font-medium ${ratingColor}`}>
                  {ratingLabel}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            {mediaTitle}
          </h1>

          {item.overview && (
            <div className="relative">
              <p className={`text-base sm:text-lg text-slate-300 leading-relaxed ${!showFullOverview ? 'line-clamp-3' : ''}`}>
                {item.overview}
              </p>
              {item.overview.length > 200 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="text-accent-hover text-sm font-medium mt-2 hover:text-accent transition-colors flex items-center gap-1"
                >
                  {showFullOverview ? 'Ver menos' : 'Ver más'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFullOverview ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={`/${mediaType}/${item.id}`}
              className="btn-accent group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
              <span>Reproducir</span>
            </Link>

            <Link
              to={`/${mediaType}/${item.id}`}
              className="btn-secondary flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm"
            >
              <Info className="w-4 h-4" />
              <span>Más información</span>
            </Link>

            <motion.button
              onClick={handleToggleList}
              whileTap={{ scale: 0.95 }}
              className={`
                btn-secondary flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-semibold text-sm
                ${isInList ? 'text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40' : ''}
              `}
              title={isInList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
            >
              {isInList ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isInList ? 'En mi lista' : 'Mi lista'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090e] to-transparent pointer-events-none" />
    </div>
  );
}
