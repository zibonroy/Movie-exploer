import { CalendarDays, Star } from "lucide-react";

export default function MovieCard({ show, onDetails }) {
  const title = show.title || show.name || "Untitled";

  const releaseDate = show.release_date || show.first_air_date;

  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      
      <button
        type="button"
        onClick={() => onDetails(show)}
        className="block w-full cursor-pointer"
        aria-label={`View details for ${title}`}
      >
        <img
          src={poster}
          alt={title}
          className="h-80 w-full object-cover transition duration-300 hover:scale-[1.02]"
        />
      </button>

      <div className="p-4">
        <h2 className="mb-2 truncate text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

        <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />

            {show.vote_average
              ? show.vote_average.toFixed(1)
              : "Not rated"}
          </span>

          <span className="flex items-center gap-1">
            <CalendarDays
              size={16}
              className="text-gray-600 dark:text-gray-400"
            />

            {releaseDate
              ? releaseDate.slice(0, 4)
              : "Not available"}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
          {show.overview || "No summary available."}
        </p>

        <button
          type="button"
          onClick={() => onDetails(show)}
          className="w-full cursor-pointer rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          See Details
        </button>
      </div>
    </div>
  );
}

