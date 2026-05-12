import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdb } from '../utils/tmdb';
import TrailerModal from '../components/TrailerModal';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import {
  Star, Calendar, Clock, Play, Plus, Check, ArrowLeft,
  Film, Tv, Globe, Vote, TrendingUp
} from 'lucide-react';

function Details() {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inList, setInList] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const loadDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = type === 'movie'
        ? await tmdb.getMovieDetails(id)
        : await tmdb.getSeriesDetails(id);
      setDetails(data);

      if (data.recommendations?.results?.length > 0) {
        setRecommendations(data.recommendations.results.slice(0, 6));
      }
    } catch (error) {
      console.error('Error loading details:', error);
    }
    setLoading(false);
  }, [id, type]);

  const checkIfInList = useCallback(() => {
    const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
    const exists = lists.some(item => item.id === parseInt(id));
    setInList(exists);
  }, [id]);

  useEffect(() => {
    loadDetails();
    checkIfInList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, loadDetails, checkIfInList]);

  const handleToggleList = () => {
    const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
    const index = lists.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      lists.splice(index, 1);
      setInList(false);
    } else {
      lists.push({
        id: details.id,
        title: details.title || details.name,
        poster_path: details.poster_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date,
        media_type: type,
        addedAt: new Date().toISOString()
      });
      setInList(true);
    }

    localStorage.setItem('myLists', JSON.stringify(lists));
  };

  const getTrailerKey = () => {
    const trailer = details?.videos?.results?.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer?.key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-violet-600 shadow-glow"
        />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4">
            <Film className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg">No se encontró el contenido</p>
          <Link to="/" className="text-accent-hover hover:text-accent text-sm mt-2 inline-block transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime = details.runtime || details.episode_run_time?.[0];
  const trailerKey = getTrailerKey();
  const isMovie = type === 'movie';
  const voteAvg = details.vote_average || 0;

  document.title = `${title} | WatchNext`;

  const ratingColor = 'text-amber-400';
  const ratingBg = voteAvg >= 7.5 ? 'bg-emerald-500/20 border-emerald-500/30' : voteAvg >= 5 ? 'bg-amber-500/20 border-amber-500/30' : 'bg-white/5 border-white/10';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[55vh] sm:h-[65vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(9,9,14,0.15) 0%, rgba(9,9,14,0.7) 60%, rgba(9,9,14,1) 100%), url(${tmdb.getImageUrl(details.backdrop_path, 'original')})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

        <div className="absolute top-20 left-4 sm:left-8">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-36 relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-52 sm:w-60 lg:w-64"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
                <img
                  src={tmdb.getImageUrl(details.poster_path, 'w500')}
                  alt={title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-card border border-white/10 shadow-lg flex items-center justify-center">
                <span className={`text-xs font-bold ${ratingColor}`}>
                  {voteAvg > 0 ? voteAvg.toFixed(1) : 'N/A'}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
                  ${isMovie ? 'bg-accent/20 text-accent-hover border border-accent/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}
                `}>
                  {isMovie ? 'Película' : 'Serie'}
                </span>
                {details.status && (
                  <span className="px-2.5 py-1 rounded-lg text-xs text-slate-400 bg-white/5 border border-white/10">
                    {details.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400 mb-6">
                {releaseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>
                      {new Date(`${releaseDate}T00:00:00`).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{runtime} min</span>
                  </div>
                )}

                {details.original_language && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="uppercase">{details.original_language}</span>
                  </div>
                )}

                {voteAvg > 0 && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${ratingBg}`}>
                    <Star className={`w-4 h-4 ${ratingColor} fill-current`} />
                    <span className={`font-bold ${ratingColor}`}>{voteAvg.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs">/ 10</span>
                  </div>
                )}

                {details.vote_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-slate-500" />
                    <span>{details.vote_count.toLocaleString()} votos</span>
                  </div>
                )}
              </div>

              {details.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-card border border-white/5 text-slate-300 hover:border-accent/30 hover:text-accent-hover transition-colors duration-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {details.tagline && (
                <p className="text-sm italic text-slate-500 mb-5 max-w-xl">"{details.tagline}"</p>
              )}

              {details.overview && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Film className="w-4 h-4 text-accent" />
                    Sinopsis
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base max-w-2xl">
                    {details.overview}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {trailerKey && (
                  <motion.button
                    onClick={() => setShowTrailer(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-accent flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                    <span>Ver Trailer</span>
                  </motion.button>
                )}

                <motion.button
                  onClick={handleToggleList}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    btn-secondary flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm
                    ${inList ? 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50' : ''}
                  `}
                >
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{inList ? 'En mi lista' : 'Agregar a mi lista'}</span>
                </motion.button>
              </div>
            </motion.div>

            {details.credits?.cast && details.credits.cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-10"
              >
                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Reparto principal
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {details.credits.cast.slice(0, 6).map(person => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="text-center group"
                    >
                      <div className="relative rounded-2xl overflow-hidden mb-2 aspect-square bg-card">
                        {person.profile_path ? (
                          <img
                            src={tmdb.getImageUrl(person.profile_path, 'w185')}
                            alt={person.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-card-hover">
                            <Film className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{person.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{person.character}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-10"
              >
                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-accent" />
                  Recomendaciones
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.map((item, i) => (
                    <MovieCard key={item.id} item={item} index={i} onToggleList={() => {}} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {showTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}

export default Details;
