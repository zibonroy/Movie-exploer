import { useEffect, useState } from "react";
import TrailerPlayer from "./TrailerPlayer";
import { getWatchProviders } from "../services/movieApi";
import {
  CalendarDays,
  Star,
  X,
  Play,
  Globe,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export default function MovieModal({ show, onClose }) {
  const [region, setRegion] = useState("BD");
  const [watchData, setWatchData] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  // Reset when movie/show changes
  useEffect(() => {
    setRegion("BD");
    setWatchData(null);
    setIsTrailerPlaying(false);
  }, [show?.id]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!show) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  // Fetch watch providers whenever movie/show or country changes
  useEffect(() => {
    if (!show?.id) {
      return;
    }

    const fetchWatchProviders = async () => {
      try {
        setWatchData(null);

        const type =
          show.media_type ||
          (show.first_air_date ? "tv" : "movie");

        const providers = await getWatchProviders(
          show.id,
          type
        );

        setWatchData(providers[region] || null);
      } catch (error) {
        console.error("Watch provider error:", error);
        setWatchData(null);
      }
    };

    fetchWatchProviders();
  }, [show?.id, show?.media_type, show?.first_air_date, region]);

  if (!show) {
    return null;
  }

  const title = show.title || show.name || "Untitled";

  const releaseDate =
    show.release_date || show.first_air_date;

  const backdrop = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : show.poster_path
      ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
      : "https://via.placeholder.com/1280x720?text=No+Image";

  const cast = show.credits?.cast?.slice(0, 8) || [];

  const youtubeVideos =
    show.videos?.results?.filter(
      (video) => video.site === "YouTube"
    ) || [];

  const trailer =
    youtubeVideos.find(
      (video) => video.type === "Trailer"
    ) ||
    youtubeVideos.find((video) =>
      ["Teaser", "Clip", "Featurette"].includes(
        video.type
      )
    );

  const trailerKey = trailer?.key;

  const youtubeWatchUrl = trailerKey
    ? `https://www.youtube.com/watch?v=${trailerKey}`
    : "";

  const streamingProviders = watchData?.flatrate || [];
  const rentProviders = watchData?.rent || [];
  const buyProviders = watchData?.buy || [];

  const countries = [
    {
      code: "BD",
      name: "Bangladesh",
      flag: "🇧🇩",
    },
    {
      code: "US",
      name: "United States",
      flag: "🇺🇸",
    },
    {
      code: "GB",
      name: "United Kingdom",
      flag: "🇬🇧",
    },
    {
      code: "IN",
      name: "India",
      flag: "🇮🇳",
    },
    {
      code: "CA",
      name: "Canada",
      flag: "🇨🇦",
    },
    {
      code: "AU",
      name: "Australia",
      flag: "🇦🇺",
    },
  ];

  const selectedCountry = countries.find(
    (country) => country.code === region
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[100dvh] w-full min-w-0 max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white text-gray-900 shadow-2xl transition-colors duration-300 dark:bg-gray-950 dark:text-white sm:max-h-[94vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <div className="relative">
          <img
            src={backdrop}
            alt={title}
            className="h-52 w-full object-cover sm:h-64 md:h-72"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-3 top-3 cursor-pointer rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition hover:rotate-90 hover:bg-black/80 sm:right-5 sm:top-5"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-5 [-webkit-overflow-scrolling:touch] sm:p-6 md:p-7">

          {/* Rating & Release */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-gray-700 dark:bg-yellow-500/10 dark:text-gray-300">
              <Star
                size={17}
                className="fill-yellow-500 text-yellow-500"
              />

              <span>
                <b>Rating:</b>{" "}
                {show.vote_average
                  ? show.vote_average.toFixed(1)
                  : "No rating"}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <CalendarDays
                size={17}
                className="text-blue-700 dark:text-blue-400"
              />

              <span>
                <b>Release:</b>{" "}
                {releaseDate || "No release date"}
              </span>
            </div>
          </div>

          {/* Genres */}
          {show.genres?.length > 0 && (
            <section className="mb-7">
              <h3 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
                Genres
              </h3>

              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Overview */}
          <section className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Overview
            </h3>

            <p className="text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              {show.overview || "No overview available."}
            </p>
          </section>

          {/* Cast */}
          {cast.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Cast
                </h3>

                <span className="text-xs text-gray-400">
                  Top {cast.length}
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0">
                {cast.map((actor) => {
                  const profileImage = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://via.placeholder.com/185x278?text=No+Image";

                  return (
                    <div
                      key={actor.id}
                      className="group w-[9.5rem] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:w-auto"
                    >
                      <img
                        src={profileImage}
                        alt={actor.name}
                        className="h-36 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40"
                      />

                      <div className="p-3">
                        <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {actor.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                          {actor.character ||
                            "Unknown character"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Trailer */}
          {trailer && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
                  <Play
                    size={16}
                    className="fill-red-500 text-red-500"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Official Trailer
                </h3>
              </div>

              {!isTrailerPlaying ? (
                <button
                  type="button"
                  onClick={() =>
                    setIsTrailerPlaying(true)
                  }
                  className="group relative block w-full touch-manipulation cursor-pointer overflow-hidden rounded-xl bg-black"
                >
                  <div className="relative w-full pb-[56.25%]">
                    <img
                      src={`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`}
                      alt={`${title} Official Trailer`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/35 transition group-active:bg-black/45 group-hover:bg-black/45" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl transition group-active:scale-105 group-hover:scale-110 sm:h-20 sm:w-20">
                        <Play
                          size={28}
                          className="ml-1 fill-red-600 text-red-600 sm:h-9 sm:w-9"
                        />
                      </div>
                    </div>

                    <span className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:bottom-4 sm:left-4">
                      Watch Trailer
                    </span>
                  </div>
                </button>
              ) : (
                <TrailerPlayer
                  videoId={trailerKey}
                  title={`${title} Official Trailer`}
                  watchUrl={youtubeWatchUrl}
                />
              )}
            </section>
          )}

          {/* Where to Watch */}
          <section className="min-w-0">
            <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Where to Watch
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Find legal streaming, rent, and
                  purchase options.
                </p>
              </div>

              {/* Country Selector */}
              <div className="w-full min-w-0 shrink-0 sm:w-52">
                <label
                  htmlFor="watch-region"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:sr-only"
                >
                  Country
                </label>

                <div className="relative box-border w-full max-w-full min-w-0">
                  <Globe
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />

                  <select
                    id="watch-region"
                    value={region}
                    onChange={(e) =>
                      setRegion(e.target.value)
                    }
                    className="box-border w-full max-w-full min-w-0 cursor-pointer appearance-none truncate rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-gray-500 dark:focus:bg-gray-800"
                  >
                    {countries.map((country) => (
                      <option
                        key={country.code}
                        value={country.code}
                      >
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            {/* Selected Country */}
            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
              <p className="break-words text-sm text-gray-600 dark:text-gray-400">
                Showing watch options for{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {selectedCountry?.flag}{" "}
                  {selectedCountry?.name}
                </span>
              </p>
            </div>

            {/* Loading */}
            {!watchData && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Loading watch options...
                </p>
              </div>
            )}

            {/* Providers */}
            {watchData &&
              (streamingProviders.length > 0 ||
                rentProviders.length > 0 ||
                buyProviders.length > 0) ? (
              <>
                {/* Stream */}
                {streamingProviders.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Stream
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {streamingProviders.map(
                        (provider) => (
                          <a
                            key={provider.provider_id}
                            href={
                              watchData.link || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />

                            <span className="min-w-0 truncate text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {provider.provider_name}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Rent */}
                {rentProviders.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Rent
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {rentProviders.map(
                        (provider) => (
                          <a
                            key={provider.provider_id}
                            href={
                              watchData.link || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />

                            <span className="min-w-0 truncate text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {provider.provider_name}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Buy */}
                {buyProviders.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Buy
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {buyProviders.map(
                        (provider) => (
                          <a
                            key={provider.provider_id}
                            href={
                              watchData.link || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />

                            <span className="min-w-0 truncate text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {provider.provider_name}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Watch Options */}
                {watchData.link && (
                  <a
                    href={watchData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    <ExternalLink size={17} />
                    View All Watch Options
                  </a>
                )}
              </>
            ) : (
              watchData && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-gray-900">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    No Watch Options
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    No streaming, rent, or purchase
                    options were found for{" "}
                    {selectedCountry?.name}.
                  </p>
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
