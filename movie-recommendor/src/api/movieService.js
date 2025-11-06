import axios from "axios";

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const TMDB_HEADERS = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  Accept: "application/json",
};

export const fetchRecommendedMovies = async (title = "The Avengers") => {
  try {
    const endpoint = `${ML_API_BASE_URL}/recommend/${encodeURIComponent(title)}`;
    console.log(" Calling ML API at:", endpoint);

    const res = await axios.get(endpoint, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });

    console.log(" ML API Response:", res.data);

    const data = res.data?.recommendations || [];
    if (!data.length) {
      console.warn(` No recommendations found for "${title}".`);
    }

    return data.slice(0, 5);
  } catch (err) {
    console.error(" Error fetching from ML API:", err.response?.data || err.message);
    return [];
  }
};

export const fetchPosterByTitle = async (title) => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      headers: TMDB_HEADERS,
      params: { query: title, language: "en-US" },
    });

    const movie = res.data.results?.[0];
    return movie?.poster_path || null;
  } catch (err) {
    console.error(` Error fetching poster for "${title}":`, err.message);
    return null;
  }
};

export const fetchMoviesWithPosters = async (title) => {
  console.log(" Fetching movies with posters for:", title);

  const mlMovies = await fetchRecommendedMovies(title);
  if (!mlMovies.length) {
    console.warn(" ML returned no data, loading TMDB popular fallback...");
    const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      headers: TMDB_HEADERS,
      params: { language: "en-US", page: 1 },
    });
    return res.data.results;
  }

  const moviesWithPosters = await Promise.all(
    mlMovies.map(async (movie) => {
      const posterPath = await fetchPosterByTitle(movie.title);
      return {
        ...movie,
        poster_path: posterPath,
      };
    })
  );

  console.log(" Combined ML + TMDB Data:", moviesWithPosters);
  return moviesWithPosters;
};

export const fetchTopRatedMovies = async () => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      headers: TMDB_HEADERS,
      params: { language: "en-US", page: 1 },
    });
    return res.data.results;
  } catch (err) {
    console.error("❌ Error fetching top-rated movies:", err.message);
    return [];
  }
};
