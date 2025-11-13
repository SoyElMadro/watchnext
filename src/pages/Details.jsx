import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdb } from '../utils/tmdb';
import TrailerModal from '../components/TrailerModal';
import { Star, Calendar, Clock, Play, Plus, Check, ArrowLeft } from 'lucide-react';

function Details() {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    loadDetails();
    checkIfInList();
  }, [id, type]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = type === 'movie'
        ? await tmdb.getMovieDetails(id)
        : await tmdb.getSeriesDetails(id);
      setDetails(data);
    } catch (error) {
      console.error('Error loading details:', error);
    }
    setLoading(false);
  };

  const checkIfInList = () => {
    const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
    const exists = lists.some(item => item.id === parseInt(id));
    setInList(exists);
  };

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-xl">No se encontró el contenido</p>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime = details.runtime || details.episode_run_time?.[0];
  const trailerKey = getTrailerKey();

  document.title = `${title} | WatchNext 🎬`;

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Backdrop */}
      <div
        className="relative h-[500px] bg-cover bg-[position:center_15%]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.3), rgb(17, 24, 39)), url(${tmdb.getImageUrl(details.backdrop_path, 'original')})`
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-end pb-8">
          <Link
            to="/"
            className="absolute top-8 left-8 flex items-center space-x-2 text-white hover:text-red-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={tmdb.getImageUrl(details.poster_path, 'w500')}
              alt={title}
              className="w-64 rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
              {releaseDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(`${releaseDate}T00:00:00`).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>

                </div>
              )}

              {runtime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{runtime} min</span>
                </div>
              )}

              {details.vote_average > 0 && (
                <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{details.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {details.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {details.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {details.overview && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
                <p className="text-gray-300 leading-relaxed">{details.overview}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                  <Play className="w-5 h-5" />
                  <span>Ver Trailer</span>
                </button>
              )}

              <button
                onClick={handleToggleList}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${inList
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
              >
                {inList ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>En mi lista</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Agregar a mi lista</span>
                  </>
                )}
              </button>
            </div>

            {/* Cast */}
            {details.credits?.cast && details.credits.cast.length > 0 && (
              <div className="mt-8 pb-12">
                <h2 className="text-2xl font-semibold mb-4">Reparto</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {details.credits.cast.slice(0, 6).map(person => (
                    <div key={person.id} className="text-center">
                      <img
                        src={tmdb.getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2"
                      />
                      <p className="font-semibold text-sm">{person.name}</p>
                      <p className="text-gray-400 text-xs">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
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