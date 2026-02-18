import React, { useState, useEffect } from 'react';

function Watchlist({ onSelectMovie }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const removeFromWatchlist = (imdbID) => {
    const updated = watchlist.filter(movie => movie.imdbID !== imdbID);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-empty">
        <h2>📌 Your Watchlist is Empty</h2>
        <p>Add movies to watch later!</p>
      </div>
    );
  }

  return (
    <div className="watchlist-section">
      <h2>📌 My Watchlist ({watchlist.length})</h2>
      <div className="movies-grid">
        {watchlist.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={movie.Title}
              className="movie-poster"
              onClick={() => onSelectMovie(movie.imdbID)}
            />
            <div className="movie-info">
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <span className="movie-type">{movie.Type}</span>
              <button 
                className="remove-btn"
                onClick={() => removeFromWatchlist(movie.imdbID)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
