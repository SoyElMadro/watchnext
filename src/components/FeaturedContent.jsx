import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { tmdb } from '../utils/tmdb';

export default function FeaturedContent({ item }) {
  const [isInList, setIsInList] = useState(false);

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
  }, [getStoredLists, item]);

  useEffect(() => {
    if (item?.id) checkIfInList();
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

  return (
    <motion.div
       className="relative h-[70vh] min-h-[500px] w-full bg-cover bg-top"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{
        backgroundImage: `url(${tmdb.getImageUrl(item.backdrop_path, 'original')})`,
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-8 h-full flex items-center">
        <div className="max-w-2xl animate-fadeIn">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            {mediaTitle}
          </h1>

          {/* Overview */}
          {item.overview && (
            <p className="text-lg text-gray-200 mb-6 line-clamp-3 leading-relaxed drop-shadow-md">
              {item.overview}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/${mediaType}/${item.id}`}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-transform duration-200 hover:scale-[1.03]"
              aria-label="Reproducir"
            >
              <Play className="w-5 h-5" />
              <span>Reproducir</span>
            </Link>

            <Link
              to={`/${mediaType}/${item.id}`}
              className="flex items-center gap-2 bg-gray-700/70 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600/90 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03]"
              aria-label="Más información"
            >
              <Info className="w-5 h-5" />
              <span>Más información</span>
            </Link>

            <button
              onClick={handleToggleList}
              className="flex items-center gap-2 bg-gray-700/70 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600/90 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03]"
              title={isInList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
              aria-label={isInList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
            >
              {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
