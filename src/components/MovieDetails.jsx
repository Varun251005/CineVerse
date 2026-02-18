import React, { useState, useEffect } from 'react';

function MovieDetails({ movieId, apiKey, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    loadReviews();
    checkWatchlist();
  }, [movieId]);

  const checkWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(m => m.imdbID === movieId));
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isInWatchlist) {
      const updated = watchlist.filter(m => m.imdbID !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      watchlist.push({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}&plot=full`);
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const loadReviews = () => {
    const savedReviews = localStorage.getItem(`reviews_${movieId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (userReview.trim()) {
      const newReview = {
        id: Date.now(),
        text: userReview,
        rating: userRating,
        date: new Date().toLocaleDateString()
      };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updatedReviews));
      setUserReview('');
      setUserRating(5);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="details-content">
          <img 
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.Title}
            className="details-poster"
          />
          
          <div className="details-info">
            <h1>{movie.Title} ({movie.Year})</h1>
            
            <div className="action-buttons">
              <button className="watchlist-btn" onClick={toggleWatchlist}>
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                ▶ Watch Trailer
              </button>
            </div>
            
            <div className="meta-info">
              <span>⭐ {movie.imdbRating}/10</span>
              <span>🕐 {movie.Runtime}</span>
              <span>{movie.Rated}</span>
            </div>
            
            <p className="plot">{movie.Plot}</p>
            
            <div className="info-grid">
              <div><strong>Genre:</strong> {movie.Genre}</div>
              <div><strong>Director:</strong> {movie.Director}</div>
              <div><strong>Cast:</strong> {movie.Actors}</div>
              <div><strong>Language:</strong> {movie.Language}</div>
              <div><strong>Country:</strong> {movie.Country}</div>
              <div><strong>Awards:</strong> {movie.Awards}</div>
            </div>

            <div className="ratings-section">
              <h3>Ratings</h3>
              {movie.Ratings && movie.Ratings.map((rating, index) => (
                <div key={index} className="rating-item">
                  <span>{rating.Source}:</span> <strong>{rating.Value}</strong>
                </div>
              ))}
            </div>

            <div className="user-reviews-section">
              <h3>User Reviews</h3>
              
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="rating-input">
                  <label>Your Rating: </label>
                  <select value={userRating} onChange={(e) => setUserRating(Number(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}/10</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Write your review..."
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows="4"
                />
                <button type="submit">Submit Review</button>
              </form>

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <span className="review-rating">⭐ {review.rating}/10</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowTrailer(false)}>×</button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${movie.imdbID}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
