import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Clapperboard,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/90">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Clapperboard className="h-6 w-6 text-red-500" />

          <span>
            Movie <span className="text-red-500">Explorer</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">

          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 transition hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
          >
            Home
          </Link>

          <Link
            to="/movies"
            className="text-sm font-semibold text-gray-700 transition hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
          >
            Movies
          </Link>

          {/* Desktop Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">

          <div className="space-y-1 px-4 py-4">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-red-500 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-red-400"
            >
              Home
            </Link>

            <Link
              to="/movies"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-red-500 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-red-400"
            >
              Movies
            </Link>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              {theme === "light" ? (
                <>
                  <Moon size={18} />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun size={18} />
                  Light Mode
                </>
              )}
            </button>

          </div>

        </div>
      )}

    </nav>
  );
}

