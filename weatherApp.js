import React, { useState } from 'react';
import './styles.css';
import './weatherApp.css';

class SelectedAreas {
  constructor() {
    this.selectedAreas = [];
  }

  addArea(area) {
    if (!this.selectedAreas.includes(area)) {
      this.selectedAreas.push(area);
    }
  }

  removeArea(area) {
    this.selectedAreas = this.selectedAreas.filter((item) => item !== area);
  }

  getAreas() {
    return this.selectedAreas;
  }
}

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState(new SelectedAreas());
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null);

      const apiKey = '4f687960aac453f859c90cdb61eb395b';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error(`Weather data request failed with status ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);

      setSelectedAreas((prevSelectedAreas) => {
        const newSelectedAreas = new SelectedAreas();
        newSelectedAreas.selectedAreas = [...prevSelectedAreas.getAreas()];
        newSelectedAreas.addArea(`${city} (${new Date().toLocaleTimeString()})`);
        return newSelectedAreas;
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching weather data:', error);
    }
  };

  const handleRefresh = async (area) => {
    try {
      setError(null);

      const apiKey = '4f687960aac453f859c90cdb61eb395b';
      const city = area.split('(')[0].trim();
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error(`Weather data request failed no data available ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);

      const cityTime = new Date(data.dt * 1000).toLocaleTimeString();
      setSelectedAreas((prevSelectedAreas) => {
        const newSelectedAreas = new SelectedAreas();
        newSelectedAreas.selectedAreas = [...prevSelectedAreas.getAreas()];
        const index = newSelectedAreas.selectedAreas.indexOf(area);
        if (index !== -1) {
          newSelectedAreas.selectedAreas[index] = `${city} (${cityTime})`;
        }
        return newSelectedAreas;
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="weather-app">
      <h1>Today's Weather</h1>
      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error ? (
  <p className="error-message">{error}</p>
) : (
  weatherData && (
    <div className="weather-data">
      <h2>{weatherData.name}</h2>
      <p>Weather: {weatherData.weather[0].description}</p>
      <p>Temperature: {weatherData.main.temp}°F</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  )
)}

      <div className="selected-areas">
        <h3>Saved Locations</h3>
        {selectedAreas.getAreas().map((area) => (
          <div key={area} className="area-item">
            <span>{area}</span>
            <button onClick={() => handleRefresh(area)}>Refresh</button>
            <button
              onClick={() => {

                const newSelectedAreas = new SelectedAreas();
                newSelectedAreas.selectedAreas = [...selectedAreas.getAreas()];
                newSelectedAreas.removeArea(area);
                setSelectedAreas(newSelectedAreas);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WeatherApp;

