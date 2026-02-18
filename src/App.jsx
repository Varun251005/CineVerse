import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import Watchlist from './components/Watchlist';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  
  const OMDB_API_KEY = '9e7dcbbb';
  const AWS_API_URL = 'https://api-fulfill.dataexchange.us-east-1.amazonaws.com/v1';

  useEffect(() => {
    if (activeTab === 'home') {
      fetchHomeMovies();
    }
  }, [activeTab]);

  const fetchHomeMovies = async () => {
    setLoading(true);
    try {
      const trendingRes = await fetch(`https://www.omdbapi.com/?s=avengers&apikey=${OMDB_API_KEY}`);
      const trendingData = await trendingRes.json();
      if (trendingData.Response === 'True') setTrending(trendingData.Search.slice(0, 6));

      const popularRes = await fetch(`https://www.omdbapi.com/?s=batman&apikey=${OMDB_API_KEY}`);
      const popularData = await popularRes.json();
      if (popularData.Response === 'True') setPopular(popularData.Search.slice(0, 6));

      const topRes = await fetch(`https://www.omdbapi.com/?s=godfather&apikey=${OMDB_API_KEY}`);
      const topData = await topRes.json();
      if (topData.Response === 'True') setTopRated(topData.Search.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const searchMovies = async ({ searchTerm, year, type, country }) => {
    setLoading(true);
    setError('');
    
    try {
      // Primary: OMDB API
      let url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${OMDB_API_KEY}`;
      if (year) url += `&y=${year}`;
      if (type) url += `&type=${type}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'True') {
        let results = data.Search;
        
        // Filter by country if specified
        if (country) {
          const detailedResults = await Promise.all(
            results.map(async (movie) => {
              const detailRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
              return await detailRes.json();
            })
          );
          results = detailedResults
            .filter(movie => movie.Country && movie.Country.includes(country))
            .map(movie => ({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster
            }));
        }
        
        setMovies(results);
        if (results.length === 0) {
          setError('No movies found for selected filters');
        }
      } else {
        // Fallback: Try AWS API if OMDB fails
        try {
          const awsResponse = await fetch(`${AWS_API_URL}/movies?search=${searchTerm}`);
          const awsData = await awsResponse.json();
          // Process AWS data (adjust based on actual API response structure)
          setMovies(awsData.results || []);
        } catch (awsError) {
          setError(data.Error || 'No movies found');
          setMovies([]);
        }
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 CineVerse</h1>
        <p>Made for True Movie Lovers</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'home' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button 
          className={activeTab === 'search' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
        <button 
          className={activeTab === 'watchlist' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('watchlist')}
        >
          📌 Watchlist
        </button>
      </nav>

      {activeTab === 'search' && (
        <>
          <div className="stats-bar">
            <div className="stat-card">
              <h3>{movies.length}</h3>
              <p>Results Found</p>
            </div>
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Movies Available</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Countries</p>
            </div>
          </div>

          <SearchBar onSearch={searchMovies} />

          {error && <div className="error-message">{error}</div>}
          
          {loading && <div className="loading">Searching movies...</div>}

          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
                onSelectMovie={setSelectedMovie}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'home' && (
        <>
          {loading ? (
            <div className="loading">Loading movies...</div>
          ) : (
            <>
              <section className="movie-section">
                <h2 className="section-title">🔥 Trending Now</h2>
                <div className="movies-grid">
                  {trending.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} onSelectMovie={setSelectedMovie} />
                  ))}
                </div>
              </section>

              <section className="movie-section">
                <h2 className="section-title">⭐ Popular Movies</h2>
                <div className="movies-grid">
                  {popular.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} onSelectMovie={setSelectedMovie} />
                  ))}
                </div>
              </section>

              <section className="movie-section">
                <h2 className="section-title">🏆 Top Rated</h2>
                <div className="movies-grid">
                  {topRated.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} onSelectMovie={setSelectedMovie} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {activeTab === 'watchlist' && (
        <Watchlist onSelectMovie={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieDetails 
          movieId={selectedMovie} 
          apiKey={OMDB_API_KEY}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
