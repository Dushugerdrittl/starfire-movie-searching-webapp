import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const MovieCard = ({ movie }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : null;
    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
    const overviewSnippet = movie.overview ? `${movie.overview.substring(0, 100)}...` : 'No overview available.';

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card-link"> {/* Wrap card content in Link */}
            <div className="movie-card">
                {imageUrl ? (
                    <img src={imageUrl} alt={movie.title} />
                ) : (
                    <div className="no-poster">No Poster</div>
                )}
                <h3>{movie.title} ({releaseYear})</h3>
                <p className="movie-overview">{overviewSnippet}</p>
            </div>
        </Link>
    );
};

export default MovieCard;