import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set a new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            if (searchTerm.trim()) {
                onSearch(searchTerm.trim());
            } else if (searchTerm === '') { // If input is cleared, notify parent
                onSearch(''); // Allows App.js to clear results
            }
        }, 500); // 500ms debounce delay

        // Cleanup function to clear timeout if component unmounts or searchTerm changes again
        return () => {
            clearTimeout(debounceTimeoutRef.current);
        };
    }, [searchTerm, onSearch]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (debounceTimeoutRef.current) { // Clear pending debounce on explicit submit
            clearTimeout(debounceTimeoutRef.current);
        }
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on every change
                className="search-input"
                disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading || !searchTerm.trim()}>
                {loading ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
};

export default SearchBar;