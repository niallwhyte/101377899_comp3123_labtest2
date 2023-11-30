import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [currentWeather, setCurrentWeather] = useState({});
    const [predictedWeather, setPredictedWeather] = useState({});
    const [location, setLocation] = useState('Toronto');

    const currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=7161c16e6439a3cbbef70a871eb6776b&units=metric`;
    const predictedUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=7161c16e6439a3cbbef70a871eb6776b&units=metric`;

    const fetchCurrentWeather = async () => {
        try {
            const response = await axios.get(currentUrl);
            setCurrentWeather(response.data);
            console.log('Current Weather:', response.data);
        } catch (error) {
            console.error('Error fetching current weather:', error);
        }
    };

    const fetchPredictedWeather = async () => {
        try {
            const response = await axios.get(predictedUrl);
            const filteredData = response.data.list.filter((forecast, index, arr) => {
                const currentDate = new Date(forecast.dt_txt).toLocaleDateString();
                const nextDate = index === arr.length - 1 ? null : new Date(arr[index + 1].dt_txt).toLocaleDateString();
                return currentDate !== nextDate;
            });
            setPredictedWeather({ ...response.data, list: filteredData });
            console.log('Predicted Weather:', filteredData);
        } catch (error) {
            console.error('Error fetching predicted weather:', error);
        }
    };

    useEffect(() => {
        fetchCurrentWeather();
        fetchPredictedWeather();
    }, []);

    const convertToKmph = (speed) => {
        return (speed * 3.6).toFixed(2);
    };

    const handleSearch = () => {
        fetchCurrentWeather();
        fetchPredictedWeather();
    };

    return (
        <div className="app">
            <div className="search">
                <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Enter Location"
                    type="text"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="container">
                {currentWeather.name && (
                    <div>
                        <h2>Current Weather in {currentWeather.name}</h2>
                        <div style={{ display: 'inline-block', margin: '10px', border: '1px solid #ccc', padding: '10px' }}>                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>Temperature: {Math.round(currentWeather.main.temp)}°C</p>
                                <p>Feels Like: {Math.round(currentWeather.main.feels_like)}°C</p>
                                <p>Min Temp: {Math.round(currentWeather.main.temp_min)}°C</p>
                                <p>Max Temp: {Math.round(currentWeather.main.temp_max)}°C</p>
                                <p>Humidity: {currentWeather.main.humidity}%</p>
                                <p>Wind Speed: {convertToKmph(currentWeather.wind.speed)} km/h</p>
                                <p>Weather: {currentWeather.weather[0].description}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
                                    alt={currentWeather.weather[0].description}
                                />
                            </div>

                    </div>
                )}

                {Object.keys(predictedWeather).length > 0 && (
                    <div>
                        <h2>Predicted Weather</h2>
                        {predictedWeather.list.map((forecast, index) => (
                            <div key={index} style={{ display: 'inline-block', margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
                                <p>Date: {new Date(forecast.dt_txt).toLocaleDateString()}</p>
                                <p>Temperature: {Math.round(forecast.main.temp)}°C</p>
                                <p>Min Temp: {Math.round(forecast.main.temp_min)}°C</p>
                                <p>Max Temp: {Math.round(forecast.main.temp_max)}°C</p>
                                <p>Humidity: {forecast.main.humidity}%</p>
                                <p>Wind Speed: {convertToKmph(forecast.wind.speed)} km/h</p>
                                <p>Weather: {forecast.weather[0].description}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                    alt={forecast.weather[0].description}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
