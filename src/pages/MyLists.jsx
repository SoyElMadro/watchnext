import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tmdb } from "../utils/tmdb";
import { Trash2, Star, Film, Tv, Clock } from "lucide-react";
import StarRating from "../components/StarRating";

export default function MyLists() {
  const [lists, setLists] = useState([]);
  const [filter, setFilter] = useState("recent");

  useEffect(() => {
    loadLists();
    document.title = "Mi Lista | WatchNext 🎬";
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

  // 🔹 Separa las películas ya estrenadas de las que aún no se estrenaron
  const today = new Date();
  const upcoming = filteredLists.filter(
    (item) => new Date(item.release_date || item.first_air_date) > today
  );
  const released = filteredLists.filter(
    (item) => new Date(item.release_date || item.first_air_date) <= today
  );

  if (lists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Film className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tu lista está vacía</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Agregá películas o series para ver más tarde
          </p>
          <Link
            to="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Explorar contenido
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 Función auxiliar para renderizar una tarjeta
  const renderItemCard = (item, upcoming = false) => {
    const isMovie = item.media_type === "movie" || item.title;
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? releaseDate.split("-")[0] : "N/A";
    const type = isMovie ? "movie" : "tv";

    return (
      <div
        key={item.id}
        className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition"
      >
        <div className="flex flex-col sm:flex-row">
          <Link to={`/${type}/${item.id}`} className="flex-shrink-0 w-full sm:w-32">
            <img
              src={tmdb.getImageUrl(item.poster_path, "w342")}
              alt={title}
              className="w-full h-56 sm:h-48 object-cover"
            />
          </Link>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <Link to={`/${type}/${item.id}`}>
                <h3 className="font-bold text-white text-lg sm:text-base mb-2 hover:text-red-500 transition line-clamp-2">
                  {title}
                </h3>
              </Link>

              <div className="flex items-center space-x-2 mb-2">
                {isMovie ? (
                  <Film className="w-4 h-4 text-gray-400" />
                ) : (
                  <Tv className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs sm:text-sm text-gray-400">
                  {isMovie ? "Película" : "Serie"} • {year}
                </span>
              </div>

              {item.vote_average > 0 && (
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-white font-semibold">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-3">
                Estreno: {new Date(releaseDate).toLocaleDateString("es-ES")}
              </p>

              {!upcoming ? (
                <>
                  {/* ⭐ Puntuación personal */}
                  <label className="text-sm text-gray-300 block mb-1">
                    Tu puntuación:
                  </label>
                  <div className="mb-3 flex flex-wrap items-center">
                    <StarRating
                      rating={item.userRating || 0}
                      onRate={(r) => handleRating(item.id, r)}
                    />
                    <span className="text-xs sm:text-sm text-gray-400 ml-2 mt-1 sm:mt-0">
                      {item.userRating
                        ? `(${item.userRating} de 10)`
                        : "(Sin puntuar)"}
                    </span>
                  </div>

                  {/* 💬 Comentario */}
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      Tu comentario:
                    </label>
                    <textarea
                      placeholder="Escribí qué te pareció..."
                      value={item.userComment || ""}
                      onChange={(e) =>
                        handleCommentChange(item.id, e.target.value)
                      }
                      className="w-full bg-gray-700 text-gray-200 text-sm rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      rows="2"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-yellow-400 font-medium mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Aún no estrenada</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition mt-4 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-semibold">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Mi Lista
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {lists.length} {lists.length === 1 ? "elemento" : "elementos"} guardados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:ring-1 focus:ring-red-500 w-full sm:w-auto"
            >
              <option value="recent">🕒 Más recientes</option>
              <option value="oldest">📅 Más antiguos</option>
              <option value="ratingHigh">⭐ Mayor puntuación</option>
              <option value="ratingLow">⭐ Menor puntuación</option>
            </select>

            <button
              onClick={handleClearAll}
              className="flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition text-sm"
            >
              <Trash2 className="w-5 h-5" />
              <span>Limpiar lista</span>
            </button>
          </div>
        </div>

        {/* 🟢 Ya estrenadas */}
        {released.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              🎬 Ya disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {released.map((item) => renderItemCard(item))}
            </div>
          </>
        )}

        {/* 🟡 Próximos estrenos */}
        {upcoming.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              🔜 Próximos estrenos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((item) => renderItemCard(item, true))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
