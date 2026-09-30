export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-900 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          <div className="text-center md:text-left">
            <h2 className="font-mono text-2xl font-bold tracking-tight">
              Movie{" "}
              <span className="text-red-500">
                Explorer
              </span>
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Discover movies, explore and find your favorite film.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 pr-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <a
              href="/"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </a>

            <a
              href="/movies"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              Movies
            </a>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500">
            © 2026 MovieExplorer. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

