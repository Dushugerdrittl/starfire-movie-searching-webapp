import React from 'react';
import './MovieCardSkeleton.css'; // We'll create this CSS file

const MovieCardSkeleton = () => {
    return (
        <div className="movie-card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
        </div>
    );
};

export default MovieCardSkeleton;
