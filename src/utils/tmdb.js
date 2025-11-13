const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Configuración regional (Argentina)
const LANGUAGE = 'es-AR';
const REGION = 'AR';

export const tmdb = {
  // 🎬 Películas populares
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=${page}`
    );
    return response.json();
  },

  // 📺 Series populares
  getPopularSeries: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`
    );
    return response.json();
  },

  // 🔥 Trending semanal (películas + series)
  getTrending: async (mediaType = 'all', timeWindow = 'week') => {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    return response.json();
  },

  // ⭐ Películas mejor calificadas
  getTopRatedMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=${page}`
    );
    return response.json();
  },

  // 🌟 Series mejor calificadas
  getTopRatedSeries: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`
    );
    return response.json();
  },

  // 🎭 Películas por género
  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`
    );
    return response.json();
  },

  // 📺 Series por género
  getSeriesByGenre: async (genreId, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`
    );
    return response.json();
  },

  // 🚀 Próximos estrenos
  getUpcomingMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=${page}`
    );
    return response.json();
  },

  // 🎟️ Películas en cartelera (Now Playing)
  getNowPlayingMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=${page}`
    );
    return response.json();
  },

  // 📅 Series al aire hoy
  getAiringTodaySeries: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`
    );
    return response.json();
  },

  // 🔎 Búsqueda
  search: async (query, type = 'multi') => {
    const response = await fetch(
      `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&region=${REGION}`
    );
    return response.json();
  },

  // 🎞️ Detalles de película
  getMovieDetails: async (id) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos,credits`
    );
    return response.json();
  },

  // 📺 Detalles de serie
  getSeriesDetails: async (id) => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos,credits`
    );
    return response.json();
  },

  // 🖼️ Helper para imágenes
  getImageUrl: (path, size = 'w500') => {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder.jpg';
  },

  // ▶️ Helper para trailers
  getTrailerUrl: (videos) => {
    const trailer = videos?.results?.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }
};

// 🎭 IDs de géneros de TMDB
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};
