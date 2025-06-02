import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for "Back to search"
import { getMovieDetails, getSimilarMovies } from '../services/movieService'; // Import getSimilarMovies
import MovieList from './MovieList'; // We can reuse MovieList to display similar movies
import MovieDetailSkeleton from './MovieDetailSkeleton'; // Import the skeleton component
import '../MovieDetailPage.css';

const MovieDetailPage = () => {
    const { movieId } = useParams(); // Get movieId from URL parameters
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(true); // New loading state for similar movies
    const [similarError, setSimilarError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true); // For main movie details
                setSimilarLoading(true); // For similar movies
                setError(null);
                setSimilarError(null);
                setMovie(null); // Clear previous movie data
                setSimilarMovies([]); // Clear previous similar movies

                const details = await getMovieDetails(movieId);
                setMovie(details);
                setLoading(false); // Main details loaded

                // Fetch similar movies after main details are fetched
                const similar = await getSimilarMovies(movieId);
                setSimilarMovies(similar.slice(0, 10)); // Take top 10 similar movies for example

            } catch (err) {
                console.error("Failed to fetch movie details:", err);
                setError(err.message); // This error is for the main movie
                // Potentially set similarError as well if the failure might affect both
            } finally {
                // setLoading(false); // Moved up after main details are set
                setSimilarLoading(false); // Similar movies fetch attempt complete
            }
        };

        if (movieId) {
            fetchDetails();
        }
        // Scroll to top when movieId changes
        window.scrollTo(0, 0);

    }, [movieId]); // Re-run effect if movieId changes (e.g., navigating from one similar movie to another)


    if (loading) {
        // Show skeleton for the main detail page and the similar movies list
        return <><MovieDetailSkeleton /><div className="similar-movies-section"><MovieList movies={[]} loading={true} skeletonCount={5} /></div></>;
    }

    if (error) {
        return <p className="error-message detail-error">Error: {error}</p>;
    }

    if (!movie) {
        return <p className="status-message detail-status">Movie details not found.</p>;
    }

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null; // Or a placeholder image URL

    return (
        <div className="movie-detail-page">
            <Link to="/" className="back-link">&larr; Back to Search</Link>
            <div className="movie-detail-content">
                {posterUrl ? (
                    <img src={posterUrl} alt={`${movie.title} Poster`} className="movie-detail-poster" />
                ) : (
                    <div className="no-poster-detail">No Poster Available</div>
                )}
                <div className="movie-detail-info">
                    <h1>{movie.title}</h1>
                    {movie.tagline && <p className="tagline"><em>"{movie.tagline}"</em></p>}
                    <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
                    <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10 (${movie.vote_count} votes)` : 'N/A'}</p>
                    <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
                    <p><strong>Genres:</strong> {(movie.genres && movie.genres.map(g => g.name).join(', ')) || 'N/A'}</p>
                    <h3>Overview</h3>
                    <p>{movie.overview || 'No overview available.'}</p>
                    {/* You can add more details here: cast, crew, trailers, etc. */}
                </div>
            </div>

            <div className="similar-movies-section">
                <h3>Similar Movies</h3>
                <MovieList movies={similarMovies} loading={similarLoading} skeletonCount={5} />
                {similarError && !similarLoading && <p className="error-message detail-error">Could not load similar movies: {similarError}</p>}
                {!similarLoading && similarMovies.length === 0 && !similarError && <p className="status-message detail-status">No similar movies found.</p>}
            </div>
        </div>
    );
};

export default MovieDetailPage;
