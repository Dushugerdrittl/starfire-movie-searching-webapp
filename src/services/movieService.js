const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, page = 1) => {
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }

    if (!query) {
        return { results: [], total_pages: 0, total_results: 0 }; // Return a consistent structure
    }

    try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { results: data.results || [], total_pages: data.total_pages || 0, total_results: data.total_results || 0 };
    } catch (error) {
        console.error("Failed to fetch movies from service:", error);
        // Re-throw the error to be caught by the component
        throw error;
    }
};

export const getMovieDetails = async (movieId) => {
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }
    const url = `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching movie details from service:", error);
        throw error;
    }
};

export const getTrendingMovies = async (timeWindow = 'day') => { // timeWindow can be 'day' or 'week'
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }
    const url = `${API_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || []; // Return only the results array
    } catch (error) {
        console.error("Error fetching trending movies from service:", error);
        throw error;
    }
};

export const getUpcomingMovies = async (page = 1) => {
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }
    const url = `${API_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || []; // Return only the results array, TMDB upcoming also has pages but for a simple display, first page is often enough.
    } catch (error) {
        console.error("Error fetching upcoming movies from service:", error);
        throw error;
    }
};

export const getSimilarMovies = async (movieId, page = 1) => {
    if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file and restart the server.');
    }
    const url = `${API_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || []; // Return only the results array
    } catch (error) {
        console.error("Error fetching similar movies from service:", error);
        throw error;
    }
};