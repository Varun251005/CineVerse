import React from 'react';

function MovieCard({ movie, onSelectMovie }) {
  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie.imdbID)}>
      <img 
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
        alt={movie.Title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        <span className="movie-type">{movie.Type}</span>
      </div>
    </div>
  );
}

export default MovieCard;
