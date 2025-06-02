import React from 'react';
import './MovieDetailSkeleton.css'; // We'll create this CSS file

const MovieDetailSkeleton = () => {
    return (
        <div className="movie-detail-page-skeleton">
            <div className="skeleton-back-link"></div>
            <div className="movie-detail-content-skeleton">
                <div className="skeleton-poster-detail"></div>
                <div className="movie-detail-info-skeleton">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line heading"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line long"></div>
                </div>
            </div>
            {/* Optional: Skeleton for similar movies section title */}
            <div className="similar-movies-section-skeleton">
                <div className="skeleton-line heading"></div>
            </div>
        </div>
    );
};

export default MovieDetailSkeleton;
