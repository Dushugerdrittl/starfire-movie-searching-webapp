const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }

    if (!query) {
        return []; // Or throw an error, depending on desired behavior for empty query
    }

    try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch movies from service:", error);
        // Re-throw the error to be caught by the component
        throw error;
    }
};