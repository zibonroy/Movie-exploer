// API to handle all movies & TV shows data
const apiUrl = "https://api.themoviedb.org/3";

const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// Get popular movies & TV shows
export async function getAllShows() {
  const response = await fetch(`${apiUrl}/trending/all/day`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies and TV shows");
  }

  const data = await response.json();

  return data.results.filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );
}

// Search movies & TV shows
export async function searchShows(query) {
  const response = await fetch(
    `${apiUrl}/search/multi?query=${encodeURIComponent(query)}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search movies and TV shows");
  }

  const data = await response.json();

  return data.results.filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );
}

// Get details of a specific movie or TV show
export async function getShowDetails(id, type) {
  const response = await fetch(
    `${apiUrl}/${type}/${id}?append_to_response=credits,videos,watch/providers`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch show details");
  }

  return response.json();
}

// Get watch providers for a specific movie or TV show
export async function getWatchProviders(id, type) {
  const response = await fetch(
    `${apiUrl}/${type}/${id}/watch/providers`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  const data = await response.json();

  return data.results || {};
}

