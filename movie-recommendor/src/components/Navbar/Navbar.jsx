import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const Navbar = ({ onProfileClick, onSearch, onLogout, isAuthenticated }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const TMDB_HEADERS = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    Accept: "application/json",
  };

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          headers: TMDB_HEADERS,
          params: { query, language: "en-US", page: 1 },
        });
        setSuggestions(res.data.results.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err.message);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (movieTitle = query) => {
    if (!movieTitle.trim()) return;
    onSearch(movieTitle);
    navigate("/recommended");
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <nav className={`navbar ${showDropdown ? "search-active" : ""}`}>
      <div
        className="logo gradient-text"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        ROOVIE
      </div>

      <div className="search-wrapper" ref={searchRef}>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 1 && setShowDropdown(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            🔍
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                className="suggestion-item"
                onClick={() => handleSearch(movie.title)}
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
                    alt={movie.title}
                  />
                )}
                <span>{movie.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`nav-links-container ${showMobileMenu ? "hide" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/top-rated">Top Rated</Link>
          </li>
          <li>
            <Link to="/recommended">Recommended</Link>
          </li>
        </ul>

        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <button className="profile-btn" onClick={onProfileClick}>
                Profile
              </button>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="signup-btn"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {!showDropdown && (
        <div
          className={`hamburger ${showMobileMenu ? "active" : ""}`}
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        <ul className="mobile-links">
          <li>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/top-rated" onClick={() => setShowMobileMenu(false)}>
              Top Rated
            </Link>
          </li>
          <li>
            <Link to="/recommended" onClick={() => setShowMobileMenu(false)}>
              Recommended
            </Link>
          </li>
        </ul>

        <div className="mobile-buttons">
          {isAuthenticated ? (
            <>
              <button
                className="profile-btn"
                onClick={() => {
                  onProfileClick();
                  setShowMobileMenu(false);
                }}
              >
                Profile
              </button>
              <button
                className="logout-btn"
                onClick={() => {
                  onLogout();
                  setShowMobileMenu(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() => {
                  navigate("/login");
                  setShowMobileMenu(false);
                }}
              >
                Login
              </button>
              <button
                className="signup-btn"
                onClick={() => {
                  navigate("/signup");
                  setShowMobileMenu(false);
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
