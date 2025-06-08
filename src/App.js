import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import MovieDetailPage from './components/MovieDetailPage';
import SearchResults from './components/SearchResults'; // Import the new component
import Pagination from './components/Pagination';
import { searchMovies, getTrendingMovies, getUpcomingMovies } from './services/movieService';
import Footer from './components/Footer';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false); // Will be true during initial load and search
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingError, setTrendingError] = useState(null);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingError, setUpcomingError] = useState(null);

  // Fetch trending and upcoming movies on initial load
  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true); // Set loading true for initial fetch
      setTrendingError(null);
      setUpcomingError(null);
      try {
        const trending = await getTrendingMovies('day');
        setTrendingMovies(trending);

        const upcoming = await getUpcomingMovies();
        setUpcomingMovies(upcoming);
      } catch (err) {
        console.error("Failed to fetch initial movies (trending/upcoming):", err);
        setTrendingError("Could not load trending movies.");
        setUpcomingError("Could not load upcoming movies.");
      } finally {
        setLoading(false); // Set loading false after all initial fetches complete
      }
    };
    fetchInitialMovies();
  }, []);

  const fetchMoviesData = useCallback(async (query, page) => {
    console.log("App fetchMoviesData, received query:", query, "page:", page); // DEBUG
    const searchTerm = query;
    if (!searchTerm) {
      setMovies([]);
      setError(null);
      setCurrentQuery('');
      setTotalPages(0);
      setCurrentPage(1);
      // When search is cleared, we don't want to show search loading skeletons,
      // but initial load skeletons might still be relevant if trending/upcoming are also loading.
      // The `loading` state for initial load is handled by the useEffect.
      return;
    }

    console.log("App fetchMoviesData, setting currentQuery to:", searchTerm); // DEBUG
    setCurrentQuery(searchTerm);
    setLoading(true);
    setError(null);
    if (page === 1) { // Reset movies only if it's the first page of a new search
      setMovies([]);
    }

    try {
      const data = await searchMovies(searchTerm, page);
      console.log("App fetchMoviesData, data from searchMovies:", data); // DEBUG: Log the raw data
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
      console.log("App fetchMoviesData, movies state should be updated. Current movies length:", (data.results || []).length); // DEBUG
    } catch (e) {
      console.error("Error in App during search:", e);
      setError(e.message);
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []); // State setters (like setMovies, setCurrentQuery) are stable and don't need to be in useCallback deps if the callback doesn't depend on other changing values from scope.

  const handleSearch = (query) => {
    console.log("App handleSearch, received query:", query); // DEBUG
    fetchMoviesData(query, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchMoviesData(currentQuery, newPage);
    }
  };

  // Determine if we are in the initial loading phase for trending/upcoming
  const initialContentLoading = loading && !currentQuery && (trendingMovies.length === 0 || upcomingMovies.length === 0);

  console.log("App render, currentQuery:", currentQuery, "loading:", loading, "initialContentLoading:", initialContentLoading); // DEBUG
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="App-main">
          <Routes>
            <Route path="/" element={
              <>
                <SearchForm onSearch={handleSearch} loading={loading && !!currentQuery} /> {/* Search button loading only for active search */}
                {!process.env.REACT_APP_TMDB_API_KEY && <p className="warning-message">TMDB API key is not configured. Please set REACT_APP_TMDB_API_KEY in a .env file in the project root and restart your development server to enable movie searching.</p>}

                {/* Search specific error */}
                {error && <p className="error-message">Search Error: {error}</p>}

                {/* Trending Movies Section - Show skeletons if initialContentLoading OR actual movies */}
                <div className="trending-section">
                  <h2>Trending Today</h2>
                  <MovieList
                    movies={trendingMovies}
                    loading={initialContentLoading}
                    skeletonCount={5}
                  />
                  {/* Show trending error only if not loading and no search query */}
                  {trendingError && !initialContentLoading && !currentQuery && <p className="error-message">{trendingError}</p>}
                </div>

                {/* Upcoming Movies Section - Show skeletons if initialContentLoading OR actual movies */}
                <div className="upcoming-section">
                  <h2>Coming Soon</h2>
                  <MovieList
                    movies={upcomingMovies}
                    loading={initialContentLoading}
                    skeletonCount={5}
                  />
                  {/* Show upcoming error only if not loading and no search query */}
                  {upcomingError && !initialContentLoading && !currentQuery && <p className="error-message">{upcomingError}</p>}
                </div>

                {/* Search Results Section */}
                {currentQuery && (
                  <SearchResults
                    movies={movies}
                    loading={loading}
                    error={error}
                    currentQuery={currentQuery}
                  />
                )}

                {/* Initial placeholder message if no search and not loading initial content, and no results from initial fetches */}
                {!loading && !currentQuery && movies.length === 0 && trendingMovies.length === 0 && upcomingMovies.length === 0 && !trendingError && !upcomingError && (
                  <p className="status-message">Search for movies to see results, or check out what's trending and upcoming!</p>
                )}

                {movies.length > 0 && totalPages > 1 && !loading && !error && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            } />
            <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
