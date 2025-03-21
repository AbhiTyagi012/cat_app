import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cat breeds on component mount
  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/breeds')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch breeds');
        }
        return response.json();
      })
      .then(data => {
        setBreeds(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch cat images
  const fetchCats = (breed = '') => {
    setLoading(true);
    let url = 'https://api.thecatapi.com/v1/images/search?limit=12';
    
    if (breed) {
      url += `&breed_ids=${breed}`;
    }
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cats');
        }
        return response.json();
      })
      .then(data => {
        setCats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Load initial cats on component mount
  useEffect(() => {
    fetchCats();
  }, []);

  // Handle breed selection
  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);
    fetchCats(breedId);
  };

  // Handle refresh button
  const handleRefresh = () => {
    fetchCats(selectedBreed);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Cat Gallery</h1>
        <div className="controls">
          <select 
            value={selectedBreed} 
            onChange={handleBreedChange}
            className="breed-select"
          >
            <option value="">All Breeds</option>
            {breeds.map(breed => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh Cats
          </button>
        </div>
      </header>

      <main>
        {loading && <div className="loading">Loading cats...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        <div className="cat-grid">
          {cats.map(cat => (
            <div key={cat.id} className="cat-card">
              <img 
                src={cat.url} 
                alt="Cat" 
                loading="lazy"
              />
              {cat.breeds && cat.breeds.length > 0 && (
                <div className="cat-info">
                  <p>{cat.breeds[0].name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;