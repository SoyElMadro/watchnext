import { useState, useEffect } from 'react';
import { tmdb, GENRES } from '../utils/tmdb';
import SearchBar from '../components/SearchBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import MovieCard from '../components/MovieCard';

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
    document.title = 'WatchNext 🎬 - Descubre tu próxima película o serie';
  }, []);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      // 🔁 Carga paralela optimizada
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

      // 🏆 Destacado inicial
      if (trendingData?.results?.length > 0) {
        setFeatured(trendingData.results[0]);
      }

      // 🔹 Seteo de estados
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

    // 🔄 Forzar re-render en filas relevantes
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

  if (loading && !isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="inline-block w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl tracking-wide">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-850 text-white font-sans transition-all duration-500">
      {!isSearching && featured && (
        <div className="relative z-10">
          <FeaturedContent item={featured} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      <div className={`${!isSearching ? '-mt-16' : 'pt-8'} relative z-20 px-4 md:px-10`}>
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {isSearching ? (
        <div className="px-4 md:px-10 py-12 animate-fadeIn">
          <h2 className="text-4xl font-extrabold tracking-wide mb-8">Resultados de búsqueda</h2>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {searchResults.map((item) => (
                <div
                  className="transform hover:scale-102 transition-transform duration-300"
                  key={item.id}
                >
                  <MovieCard item={item} onToggleList={handleToggleList} />
                </div>
              ))}
            </div>
          )}

          {!loading && searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No se encontraron resultados</p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 space-y-16 px-2 md:px-8 animate-fadeIn">
          {trending.length > 0 && (
            <ContentRow title="🔥 TOP 10 Más Populares Esta Semana" items={trending} onToggleList={handleToggleList} />
          )}

          {nowPlayingMovies.length > 0 && (
            <ContentRow title="🎬 En Cines Ahora (Argentina)" items={nowPlayingMovies} onToggleList={handleToggleList} />
          )}

          {upcomingMovies.length > 0 && (
            <ContentRow title="🎯 Próximos Estrenos en Argentina" items={upcomingMovies} onToggleList={handleToggleList} />
          )}

          {topRatedMovies.length > 0 && (
            <ContentRow title="⭐ Películas Mejor Calificadas" items={topRatedMovies} onToggleList={handleToggleList} />
          )}

          {topRatedSeries.length > 0 && (
            <ContentRow title="📺 Series Mejor Calificadas" items={topRatedSeries} onToggleList={handleToggleList} />
          )}

          {horrorMovies.length > 0 && (
            <ContentRow title="👻 Terror" items={horrorMovies} onToggleList={handleToggleList} />
          )}

          {comedyMovies.length > 0 && (
            <ContentRow title="😂 Comedia" items={comedyMovies} onToggleList={handleToggleList} />
          )}

          {actionMovies.length > 0 && (
            <ContentRow title="💥 Acción" items={actionMovies} onToggleList={handleToggleList} />
          )}

          {sciFiMovies.length > 0 && (
            <ContentRow title="🚀 Ciencia Ficción" items={sciFiMovies} onToggleList={handleToggleList} />
          )}

          {dramaMovies.length > 0 && (
            <ContentRow title="🎭 Drama" items={dramaMovies} onToggleList={handleToggleList} />
          )}

          {animationMovies.length > 0 && (
            <ContentRow title="🎨 Animación" items={animationMovies} onToggleList={handleToggleList} />
          )}
        </div>
      )}
    </div>
  );
}
