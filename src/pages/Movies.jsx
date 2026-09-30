import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import {
  getAllShows,
  searchShows,
  getShowDetails,
} from "../services/movieApi";
import { Film, CircleAlert, Search } from "lucide-react";

export default function Movies() {
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchShows() {
      try {
        const data = await getAllShows();
        setShows(data);
      } catch (error) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    }

    fetchShows();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) {
      try {
        setLoading(true);
        setError("");

        const data = await getAllShows();
        setShows(data);
      } catch (error) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }

      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchShows(search);
      setShows(data);
    } catch (error) {
      setError("Failed to search movies.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDetails(show) {
    try {
      setDetailsLoading(true);
      setError("");

      const type = show.media_type || (show.title ? "movie" : "tv");

      const data = await getShowDetails(show.id, type);

      setSelectedShow(data);
    } catch (error) {
      setError("Failed to load movie details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      <main className="flex-1">
        <section className="bg-white transition-colors dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-500">
                Explore Movies
              </p>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                Search and explore thousands of movies and TV shows.
                Find something amazing to watch today.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 max-w-2xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full rounded-xl border border-gray-400 bg-gray-50 px-4 py-3.5 pl-9 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {!loading && !error && (
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="font-poppins text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {search.trim() ? "Search Results" : "All Movies"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {shows.length}{" "}
                  {shows.length === 1 ? "result" : "results"} found
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-500"></div>

                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loading movies...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="rounded-2xl border border-red-100 bg-white px-8 py-7 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
                  <CircleAlert className="h-6 w-6 text-red-500" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                  Something went wrong
                </h3>

                <p className="mt-1 text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {shows.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {shows.map((show) => (
                    <MovieCard
                      key={show.id}
                      show={show}
                      onDetails={handleDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                      <Film className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      No movies found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try searching with a different movie name.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {detailsLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[1px] dark:bg-black/60">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl dark:bg-gray-900">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-500" />

            <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
              Loading details...
            </p>
          </div>
        </div>
      )}

      <MovieModal
        show={selectedShow}
        onClose={() => setSelectedShow(null)}
      />

      <Footer />
    </div>
  );
}
