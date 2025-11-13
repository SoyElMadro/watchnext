import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import { tmdb } from '../utils/tmdb';
import { useState } from 'react';

function MovieCard({ item, onToggleList }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isMovie = item.media_type === 'movie' || item.title;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
  const type = isMovie ? 'movie' : 'tv';
  
  const isInList = () => {
    const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
    return lists.some(listItem => listItem.id === item.id);
  };

  const inList = isInList();

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 hover:ring-2 hover:ring-red-500 transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/${type}/${item.id}`}>
        <div className="relative">
          <img
            src={tmdb.getImageUrl(item.poster_path)}
            alt={title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
          
          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-white">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}

          {/* Overlay on hover - Usando estado local */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300">
              <span className="text-white font-semibold text-sm text-center px-2">
                Ver detalles
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link to={`/${type}/${item.id}`}>
          <h3 className="font-semibold text-white text-sm truncate hover:text-red-500 transition">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">{year}</p>
          
          <button
            onClick={() => onToggleList(item)}
            className={`p-1.5 rounded-lg transition ${
              inList 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={inList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
          >
            {inList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;