// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Home from "./pages/Home";
import TopRated from "./pages/TopRated";
import Hero from "./components/Hero/Hero";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import { fetchMoviesWithPosters } from "./api/movieService";
import "./App.css";

const AppRoutes = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [heroMovie, setHeroMovie] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isAuthenticated")
  );

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth) setIsAuthenticated(true);
  }, []);

  // ✅ login success
  const handleLoginSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  // ✅ logout success
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  // ✅ handle search
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setSearchTitle(query);
    setHeroMovie(null);
    setRecommendedMovies([]);
    setLoading(true);
    try {
      const results = await fetchMoviesWithPosters(query);
      setRecommendedMovies(results);
      if (results.length > 0) setHeroMovie(results[0]);
    } catch (err) {
      console.error("❌ Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar visible always but changes buttons dynamically */}
      <Navbar
        onSearch={handleSearch}
        onProfileClick={() => setShowProfile(true)}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />

      <div className="main-content">
        {heroMovie && <Hero movie={heroMovie} />}

        <Routes>
          {/* ---------- Public routes ---------- */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Signup />
            }
          />

          {/* ---------- Protected routes ---------- */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home
                  recommendedMovies={recommendedMovies}
                  loading={loading}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/top-rated"
            element={
              isAuthenticated ? (
                <TopRated />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/recommended"
            element={
              isAuthenticated ? (
                <div className="recommended-page">
                  {loading ? (
                    <p className="loading">Fetching recommendations...</p>
                  ) : recommendedMovies.length > 0 ? (
                    <>
                      <h2 className="search-heading">
                        Showing recommendations for <span>"{searchTitle}"</span>
                      </h2>
                      <MovieGrid title="🎯 Recommended" movies={recommendedMovies} />
                    </>
                  ) : (
                    <p className="no-results">
                      No recommendations found for "{searchTitle}"
                    </p>
                  )}
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* ✅ Profile modal */}
      {isAuthenticated && showProfile && (
        <Profile onClose={() => setShowProfile(false)} onLogout={handleLogout} />
      )}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
