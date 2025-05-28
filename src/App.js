import React, { useState, useCallback } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import { searchMovies } from './services/movieService';
import Footer from './components/Footer';

// Check if API_KEY is available at the start.
// This is more for a one-time check rather than per-search.
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(''); // To store the last searched query

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setMovies([]); // Clear movies if query is empty
      setError(null);
      setCurrentQuery('');
      return;
    }

    setCurrentQuery(query); // Store the query
    setLoading(true);
    setError(null);
    setMovies([]); // Clear previous results immediately

    try {
      const results = await searchMovies(query);
      setMovies(results);
      if (results.length === 0) {
        setError(`No movies found for "${query}".`);
      }
    } catch (e) {
      console.error("Error in App during search:", e);
      setError(e.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Search</h1>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>
      <main className="App-main">
        {error && <p className="error-message">{error}</p>}
        {!API_KEY && <p className="warning-message">TMDB API key is not configured. Please set the REACT_APP_TMDB_API_KEY in a .env file in the project root and restart your development server to enable movie searching.</p>}

        {/* Display loading message */}
        {loading && <p className="status-message">Loading movies...</p>}

        {/* Display MovieList or "No movies found" message when not loading */}
        {!loading && movies.length > 0 && !error && <MovieList movies={movies} />}
        {!loading && movies.length === 0 && currentQuery && !error && <p className="status-message">No movies found for "{currentQuery}".</p>}
      </main>
      <Footer />
    </div>
  );
}

export default App;
