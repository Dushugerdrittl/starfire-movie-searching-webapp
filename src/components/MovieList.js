import React from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton'; // Import the skeleton

const MovieList = ({ movies, loading, skeletonCount = 10 }) => { // Added loading and skeletonCount props
    if (loading) {
        return (
            <div className="movie-list">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <MovieCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        // This case is now handled more specifically in App.js or by showing skeletons
        return null;
    }

    return (
        <div className="movie-list">
            {movies.map(movie => (
                // Ensure movie object and movie.id are valid before rendering MovieCard
                movie && movie.id ? <MovieCard key={movie.id} movie={movie} /> : null
            ))}
        </div>
    );
};

export default MovieList;
