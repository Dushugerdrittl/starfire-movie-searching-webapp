import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for "Back to search"
import { getMovieDetails, getSimilarMovies, getMovieVideos } from '../services/movieService'; // Import getMovieVideos
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
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [videosError, setVideosError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true); // For main movie details
                setSimilarLoading(true); // For similar movies
                setVideosLoading(true); // For videos
                setError(null);
                setSimilarError(null);
                setVideosError(null);
                setMovie(null); // Clear previous movie data
                setSimilarMovies([]); // Clear previous similar movies
                setVideos([]); // Clear previous videos

                const details = await getMovieDetails(movieId);
                setMovie(details);
                setLoading(false); // Main details loaded

                // Fetch similar movies after main details are fetched
                const similar = await getSimilarMovies(movieId);
                setSimilarMovies(similar.slice(0, 10)); // Take top 10 similar movies for example
                setSimilarLoading(false); // Similar movies fetch attempt complete

                // Fetch videos
                const videoData = await getMovieVideos(movieId);
                setVideos(videoData.filter(video => video.site === "YouTube" && video.type === "Trailer"));
                setVideosLoading(false);

            } catch (err) {
                console.error("Failed to fetch movie details or related data:", err);
                setError(err.message); // This error is for the main movie
                // Ensure all loading states are false on error
                setLoading(false);
                setSimilarLoading(false);
                setVideosLoading(false);
            }
            // No finally block needed here as loading states are handled in try/catch
        };

        if (movieId) {
            fetchDetails();
        }
        // Scroll to top when movieId changes
        window.scrollTo(0, 0);

    }, [movieId]); // Re-run effect if movieId changes

    if (loading) { // Only main movie loading check for initial skeleton
        return (
            <>
                <MovieDetailSkeleton />
                {/* Show skeleton for similar movies list during initial page skeleton display */}
                <div className="similar-movies-section">
                    <h3>Similar Movies</h3>
                    <MovieList movies={[]} loading={true} skeletonCount={5} />
                </div>
            </>
        );
    }

    if (error) {
        return <p className="error-message detail-error">Error loading movie details: {error}</p>;
    }

    if (!movie) {
        // This case should ideally be covered by the loading state or error state
        return <p className="status-message detail-status">Movie details not found.</p>;
    }

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

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
                </div>
            </div>

            {/* Embedded Trailer Section */}
            {!videosLoading && videos.length > 0 && (
                <div className="embedded-trailer-section">
                    <h3>Trailer</h3>
                    <div className="video-responsive">
                        <iframe
                            src={`https://www.youtube.com/embed/${videos[0].key}`}
                            title={videos[0].name || 'Movie Trailer'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Additional Trailers List (Optional) */}
            {!videosLoading && videos.length > 1 && (
                <div className="trailers-section">
                    <h4>Other Videos</h4>
                    <ul>
                        {videos.slice(1).map(video => ( // Display other videos if more than one exists
                            <li key={video.id}>
                                <a href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank" rel="noopener noreferrer">
                                    {video.name} (YouTube)
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Video loading/error messages */}
            {videosLoading && !loading && <p className="status-message detail-status">Loading trailers...</p>}
            {videosError && !videosLoading && <p className="error-message detail-error">Could not load trailers: {videosError}</p>}
            {!videosLoading && videos.length === 0 && !videosError && !loading && <p className="status-message detail-status">No official trailers found.</p>}

            {/* Similar Movies Section */}
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
