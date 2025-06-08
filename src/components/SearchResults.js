import React from 'react';
import MovieList from './MovieList';
import './SearchResults.css'; // Make sure this CSS file exists and is imported

const SearchResults = ({ movies, loading, error, currentQuery }) => {
    console.log("SearchResults Component Render. Query:", currentQuery, "Movies:", movies ? movies.length : 0, "Loading:", loading, "Error:", error); // DEBUG

    if (loading) {
        // Show skeletons via MovieList when loading search results
        return (
            <div className="search-results-wrapper">
                <h2>Searching for "{currentQuery}"...</h2>
                <MovieList movies={[]} loading={true} skeletonCount={10} />
            </div>
        );
    }

    // Error specific to search results, not the initial load error handled in App.js
    if (error && currentQuery) { // Check currentQuery to ensure this error is for an active search
        return (
            <div className="search-results-wrapper">
                <p className="error-message">Error fetching search results for "{currentQuery}": {typeof error === 'string' ? error : 'An unexpected error occurred.'}</p>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        // This message is shown only if there was an active search query
        // and it completed without errors but returned no movies.
        // The loading state should be false here.
        return (
            <div className="search-results-wrapper">
                <p className="status-message">No movies found for "{currentQuery}". Try another search!</p>
            </div>
        );
    }

    return (
        <div className="search-results-wrapper">
            <h2>Results for "{currentQuery}"</h2>
            <MovieList movies={movies} loading={false} />
        </div>
    );
};

export default SearchResults;
