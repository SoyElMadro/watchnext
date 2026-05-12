import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tmdb } from "../utils/tmdb";
import { Trash2, Star, Film, Tv, Clock, ListX, BookmarkCheck, Sparkles, ArrowUpDown } from "lucide-react";
import StarRating from "../components/StarRating";
import { motion, AnimatePresence } from "framer-motion";

export default function MyLists() {
  const [lists, setLists] = useState([]);
  const [filter, setFilter] = useState("recent");

  useEffect(() => {
    loadLists();
    document.title = "Mis Listas | WatchNext";
  }, []);

  const loadLists = () => {
    const savedLists = JSON.parse(localStorage.getItem("myLists") || "[]");
    const sorted = savedLists.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    setLists(sorted);
  };

  const updateListItem = (id, newData) => {
    const updatedLists = lists.map((item) =>
      item.id === id ? { ...item, ...newData } : item
    );
    setLists(updatedLists);
    localStorage.setItem("myLists", JSON.stringify(updatedLists));
  };

  const handleRemove = (id) => {
    const updatedLists = lists.filter((item) => item.id !== id);
    setLists(updatedLists);
    localStorage.setItem("myLists", JSON.stringify(updatedLists));
  };

  const handleClearAll = () => {
    if (window.confirm("¿Seguro que querés eliminar toda tu lista?")) {
      setLists([]);
      localStorage.setItem("myLists", "[]");
    }
  };

  const handleRating = (id, rating) => {
    updateListItem(id, { userRating: rating });
  };

  const handleCommentChange = (id, value) => {
    updateListItem(id, { userComment: value });
  };

  const filteredLists = [...lists].sort((a, b) => {
    if (filter === "recent") return new Date(b.addedAt) - new Date(a.addedAt);
    if (filter === "oldest") return new Date(a.addedAt) - new Date(b.addedAt);
    if (filter === "ratingHigh") return (b.userRating || 0) - (a.userRating || 0);
    if (filter === "ratingLow") return (a.userRating || 0) - (b.userRating || 0);
    return 0;
  });

  const today = new Date();
  const upcoming = filteredLists.filter(
    (item) => new Date(item.release_date || item.first_air_date) > today
  );
  const released = filteredLists.filter(
    (item) => new Date(item.release_date || item.first_air_date) <= today
  );

  const ratedItems = lists.filter(l => l.userRating);
  const avgRating = ratedItems.length > 0
    ? ratedItems.reduce((acc, l) => acc + l.userRating, 0) / ratedItems.length
    : 0;

  if (lists.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl bg-card border border-white/5 flex items-center justify-center mx-auto mb-6"
          >
            <BookmarkCheck className="w-10 h-10 text-slate-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Tu lista está vacía</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Guardá películas y series para no perderlas de vista. Tu próxima binge-session te espera.
          </p>
          <Link
            to="/"
            className="btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Explorar contenido
          </Link>
        </motion.div>
      </div>
    );
  }

  const renderItemCard = (item, isUpcoming = false) => {
    const isMovie = item.media_type === "movie" || item.title;
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? releaseDate.split("-")[0] : "N/A";
    const type = isMovie ? "movie" : "tv";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, height: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-card rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-200"
      >
        <div className="flex flex-col sm:flex-row">
          <Link
            to={`/${type}/${item.id}`}
            className="flex-shrink-0 w-full sm:w-36 lg:w-40"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={tmdb.getImageUrl(item.poster_path, "w342")}
                alt={title}
                className="w-full h-full object-cover"
              />
              {item.vote_average > 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-white">{item.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div>
                <Link to={`/${type}/${item.id}`}>
                  <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2 hover:text-accent-hover transition-colors">
                    {title}
                  </h3>
                </Link>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    {isMovie ? (
                      <Film className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Tv className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      {isMovie ? 'Película' : 'Serie'}
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-xs text-slate-500 font-medium">{year}</span>
                </div>
              </div>

              {releaseDate && (
                <p className="text-xs text-slate-600">
                  Estreno: {new Date(releaseDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}

              {!isUpcoming ? (
                <>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-2">Tu puntuación</label>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={item.userRating || 0}
                        onRate={(r) => handleRating(item.id, r)}
                      />
                      <span className="text-xs text-slate-600">
                        {item.userRating ? `${item.userRating}/10` : 'Sin puntuar'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-2">Tu comentario</label>
                    <textarea
                      placeholder="Escribí qué te pareció..."
                      value={item.userComment || ""}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      className="w-full bg-surface text-slate-300 text-sm rounded-xl p-3 resize-none border border-white/5 focus:border-accent/30 focus:outline-none transition-colors placeholder:text-slate-600"
                      rows="2"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Aún no estrenada</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors duration-200 text-sm font-medium self-start"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-bg pt-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <BookmarkCheck className="w-5 h-5 text-accent" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Mi Lista</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{lists.length} {lists.length === 1 ? 'elemento' : 'elementos'}</span>
                {avgRating > 0 && (
                  <>
                    <span className="text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Promedio: {avgRating.toFixed(1)}/10
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-card text-slate-300 text-sm px-4 py-2.5 pr-10 rounded-xl border border-white/5 focus:border-accent/30 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="recent">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="ratingHigh">Mayor puntuación</option>
                  <option value="ratingLow">Menor puntuación</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl transition-colors duration-200 text-sm font-medium border border-red-500/10 hover:border-red-500/30"
              >
                <ListX className="w-4 h-4" />
                <span className="hidden sm:inline">Limpiar todo</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {released.length > 0 && (
            <motion.div
              key="released"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-white">Ya disponibles</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-hover text-xs font-medium">
                  {released.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {released.map((item) => renderItemCard(item))}
              </div>
            </motion.div>
          )}

          {upcoming.length > 0 && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-amber-400">Próximos estrenos</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                  {upcoming.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {upcoming.map((item) => renderItemCard(item, true))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
