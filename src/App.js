import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MoviePage from './MoviePage';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  // These are like variables that React watches for changes
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  // This function runs when the user clicks Search
  async function handleSearch() {
    if (!searchTerm.trim()) return; // do nothing if box is empty

    setLoading(true);   // show the "Searching..." message
    setSearched(true);  // remember that a search happened

    // Ask Supabase for movies whose title contains the search term
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .ilike('title', `%${searchTerm}%`);

    if (error) {
      console.error('Error fetching movies:', error);
    } else {
      setMovies(data); // save the results
    }

    setLoading(false); // hide the "Searching..." message
  }

  // This lets the user press Enter instead of clicking the button
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <h1 className="logo">🎬 CleanPlay</h1>
        <p className="tagline">Find out what's in a movie before you watch it</p>
      </header>

      {/* ── Search bar ── */}
      <main className="main">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {/* ── Results area ── */}
        <div className="results">

          {/* Loading state */}
          {loading && (
            <p className="status-message">Searching...</p>
          )}

          {/* No results found */}
          {!loading && searched && movies.length === 0 && (
            <p className="status-message">
              No movies found for "<strong>{searchTerm}</strong>".
              <br />
              <span className="hint">Try a different title, or add this movie later!</span>
            </p>
          )}

          {/* Movie cards */}
          {!loading && movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  ) : (
                    <div className="movie-poster-placeholder">🎬</div>
                  )}
                  <div className="movie-info">
                    <h2 className="movie-title">{movie.title}</h2>
                    <p className="movie-year">{movie.release_year}</p>
                    <button
  className="view-button"
  onClick={() => navigate(`/movie/${movie.id}`)}
>
  View Content Warnings
</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* First-visit placeholder — shown before any search */}
          {!searched && (
            <div className="placeholder">
              <div className="placeholder-icon">🔍</div>
              <p>Search results will appear here</p>
              <p className="hint">Try searching for "Inception" or "The Dark Knight"</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;