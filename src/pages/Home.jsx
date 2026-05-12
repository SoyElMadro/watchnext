import { useState, useEffect } from 'react';
import { tmdb, GENRES } from '../utils/tmdb';
import SearchBar from '../components/SearchBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import MovieCard from '../components/MovieCard';
import { Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllContent();
    document.title = 'WatchNext - Tu próxima película o serie te espera';
  }, []);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [
        trendingData,
        topMoviesData,
        topSeriesData,
        horrorData,
        comedyData,
        actionData,
        dramaData,
        sciFiData,
        animationData,
        upcomingData,
        nowPlayingData,
      ] = await Promise.all([
        tmdb.getTrending('all', 'week'),
        tmdb.getTopRatedMovies(),
        tmdb.getTopRatedSeries(),
        tmdb.getMoviesByGenre(GENRES.HORROR),
        tmdb.getMoviesByGenre(GENRES.COMEDY),
        tmdb.getMoviesByGenre(GENRES.ACTION),
        tmdb.getMoviesByGenre(GENRES.DRAMA),
        tmdb.getMoviesByGenre(GENRES.SCIENCE_FICTION),
        tmdb.getMoviesByGenre(GENRES.ANIMATION),
        tmdb.getUpcomingMovies(),
        tmdb.getNowPlayingMovies(),
      ]);

      if (trendingData?.results?.length > 0) {
        setFeatured(trendingData.results[0]);
      }

      setTrending(trendingData.results?.slice(0, 10) || []);
      setTopRatedMovies(topMoviesData.results || []);
      setTopRatedSeries(topSeriesData.results || []);
      setHorrorMovies(horrorData.results || []);
      setComedyMovies(comedyData.results || []);
      setActionMovies(actionData.results || []);
      setDramaMovies(dramaData.results || []);
      setSciFiMovies(sciFiData.results || []);
      setAnimationMovies(animationData.results || []);
      setUpcomingMovies(upcomingData.results || []);
      setNowPlayingMovies(nowPlayingData.results || []);
    } catch (error) {
      console.error('Error al cargar contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    setLoading(true);
    try {
      const data = await tmdb.search(query);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleToggleList = (item) => {
    const lists = JSON.parse(localStorage.getItem('myLists') || '[]');
    const exists = lists.findIndex((listItem) => listItem.id === item.id);

    if (exists !== -1) {
      lists.splice(exists, 1);
    } else {
      lists.push({
        ...item,
        addedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem('myLists', JSON.stringify(lists));
    setTrending([...trending]);
    setTopRatedMovies([...topRatedMovies]);
    setTopRatedSeries([...topRatedSeries]);
    setHorrorMovies([...horrorMovies]);
    setComedyMovies([...comedyMovies]);
    setActionMovies([...actionMovies]);
    setDramaMovies([...dramaMovies]);
    setSciFiMovies([...sciFiMovies]);
    setAnimationMovies([...animationMovies]);
    setUpcomingMovies([...upcomingMovies]);
    setNowPlayingMovies([...nowPlayingMovies]);
    setSearchResults([...searchResults]);
  };

  const contentRows = [
    { key: 'trending', data: trending, title: 'Tendencias de la semana' },
    { key: 'nowPlaying', data: nowPlayingMovies, title: 'En cines ahora' },
    { key: 'upcoming', data: upcomingMovies, title: 'Próximos estrenos' },
    { key: 'topRated', data: topRatedMovies, title: 'Películas mejor calificadas' },
    { key: 'topSeries', data: topRatedSeries, title: 'Series mejor calificadas' },
    { key: 'horror', data: horrorMovies, title: 'Terror' },
    { key: 'comedy', data: comedyMovies, title: 'Comedia' },
    { key: 'action', data: actionMovies, title: 'Acción' },
    { key: 'sciFi', data: sciFiMovies, title: 'Ciencia ficción' },
    { key: 'drama', data: dramaMovies, title: 'Drama' },
    { key: 'animation', data: animationMovies, title: 'Animación' },
  ];

  if (loading && !isSearching) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-accent to-violet-600 flex items-center justify-center shadow-glow"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Cargando contenido...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {!isSearching && featured && <FeaturedContent item={featured} />}

      <div className="pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {isSearching ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Resultados</h2>
              {searchResults.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent-hover text-sm font-medium border border-accent/20">
                  {searchResults.length}
                </span>
              )}
            </div>

            {loading && (
              <div className="flex justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {searchResults.map((item, i) => (
                  <MovieCard key={item.id} item={item} index={i} onToggleList={handleToggleList} />
                ))}
              </div>
            )}

            {!loading && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg">No se encontraron resultados</p>
                <p className="text-slate-600 text-sm mt-1">Probá con otras palabras</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-10 sm:py-14 space-y-12 sm:space-y-16"
        >
          {contentRows.map(({ key, data, title }) =>
            data.length > 0 && (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ContentRow title={title} items={data} onToggleList={handleToggleList} />
              </motion.div>
            )
          )}
        </motion.div>
      )}
    </div>
  );
}
