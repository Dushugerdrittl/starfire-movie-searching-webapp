import React, { useState } from 'react';

const SearchForm = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("SearchForm handleSubmit, query:", query); // DEBUG
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                className="search-input"
                placeholder="Search for a movie..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search for a movie"
            />
            <button type="submit" className="search-button" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
};

export default SearchForm;