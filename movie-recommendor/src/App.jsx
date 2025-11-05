import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [heroMovie, setHeroMovie] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    console.log("🔍 Searching for:", query);
    setSearchTitle(query);
    setHeroMovie(null);
    setRecommendedMovies([]);
    setLoading(true);

    try {
      const results = await fetchMoviesWithPosters(query);
      setRecommendedMovies(results);
      if (results.length > 0) {
        setHeroMovie(results[0]);
      }
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onProfileClick={() => setShowProfile(true)}
          onSearch={handleSearch}
        />

        <div className="main-content">
          {heroMovie && <Hero movie={heroMovie} />}

          <Routes>
            <Route path="/" element={<Home recommendedMovies={recommendedMovies} loading={loading} />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route
              path="/recommended"
              element={
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
                    <p className="no-results">No recommendations found for "{searchTitle}"</p>
                  )}
                </div>
              }
            />
          </Routes>
        </div>

        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        )}

        {showSignup && (
          <Signup
            onClose={() => setShowSignup(false)}
            onLoginClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}

        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </div>
    </Router>
  );
};

export default App;
