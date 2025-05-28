import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies }) => {
    if (!movies) {  // Handle initial undefined state or prop not being passed
        return null;
    }
    if (movies.length === 0) return null;  // For empty results, return null

    return (
        <div className="movie-list">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;