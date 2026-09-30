import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Sparkles, Tv } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      <Navbar />

      <main className="flex-1">

        <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-purple-50 to-white px-5 py-20 text-gray-900 transition-colors duration-300 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 dark:text-white sm:px-6 lg:px-8">

          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl dark:bg-purple-600/20" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl dark:bg-pink-600/20" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

          <div className="relative z-10 w-full max-w-4xl text-center">

            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">

              <Sparkles className="h-4 w-4 cursor-alias text-pink-500 dark:text-pink-400" />

              <span>Explore the world of movies</span>

            </div>

            <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Movies
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 dark:text-gray-400">
              Explore amazing movies and TV shows from around the world.
              Search, discover, and find your next favorite story.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <Link
                to="/movies"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 sm:w-auto sm:px-8 sm:text-base"
              >
                <Tv className="h-5 w-5" />
                Explore Movies
              </Link>

              <Link
                to="/movies"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-7 py-3.5 text-sm font-semibold text-gray-800 backdrop-blur-sm transition duration-300 hover:bg-gray-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto sm:px-8 sm:text-base"
              >
                <Search className="h-5 w-5" />
                Search Movies
              </Link>

            </div>

            <div className="mx-auto mt-14 flex max-w-lg items-center justify-center divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white/70 px-4 py-5 backdrop-blur-sm transition-colors duration-300 dark:divide-white/10 dark:border-white/10 dark:bg-white/5">

              <div className="flex-1 px-4">
                <p className="text-2xl font-bold">10K+</p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Movies & Shows
                </p>
              </div>

              <div className="flex-1 px-4">
                <p className="text-2xl font-bold">24/7</p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Explore Anytime
                </p>
              </div>

              <div className="flex-1 px-4">
                <p className="text-2xl font-bold">Free</p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  To Explore
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}
