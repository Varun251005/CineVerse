import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch({ searchTerm, year, type, country });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Year (optional)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="year-input"
      />
      <select value={type} onChange={(e) => setType(e.target.value)} className="type-select">
        <option value="">All Types</option>
        <option value="movie">Movie</option>
        <option value="series">Series</option>
        <option value="episode">Episode</option>
      </select>
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="country-select">
        <option value="">All Countries</option>
        <option value="US">United States</option>
        <option value="GB">United Kingdom</option>
        <option value="IN">India</option>
        <option value="JP">Japan</option>
        <option value="KR">South Korea</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
        <option value="IT">Italy</option>
        <option value="ES">Spain</option>
        <option value="CN">China</option>
        <option value="CA">Canada</option>
        <option value="AU">Australia</option>
        <option value="MX">Mexico</option>
        <option value="BR">Brazil</option>
      </select>
      <button type="submit" className="search-btn">Search</button>
    </form>
  );
}

export default SearchBar;
