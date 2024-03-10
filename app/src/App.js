import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [userLat, setUserLat] = useState("");
  const [userLong, setUserLong] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");

  function fetchWeather() {
    setError("");

    if (!userLat || !userLong) {
      setError("Error: Please enter latitude and longitude values.");
      return;
    } else if (Math.abs(userLat) > 90 || Math.abs(userLong) > 180) {
      setError("Error: Latitude must be between -90 and 90, longitude must be between -180 and 180.");
      return;
    }

    if (userLat && userLong) {
      console.log("Fetching weather...");
      const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLong}&hourly=temperature_2m`;
      
      fetch(WEATHER_URL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data);
        if (data.error) {
          setError("Error: Invalid latitude and longitude input.");
          setWeatherData([]);
        } else {
          setWeatherData(data.hourly);
        }
      })
    }
  }

  function formatTime(timeString) {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    return formattedTime;
}

  return (
    <div className='container'>
      <div className="row mt-4" style={{ marginTop: '50px' }}>
        <div className='col-4'>
          <button className="btn btn-primary" onClick={() => {setUserLat("30.27"); setUserLong("-97.73");}}>Austin</button>
        </div>
        <div className='col-4'>
          <button className="btn btn-primary" onClick={() => {setUserLat("32.78"); setUserLong("-96.80");}}>Dallas</button>
        </div>
        <div className='col-4'>
          <button className="btn btn-primary" onClick={() => {setUserLat("29.76"); setUserLong("-95.36");}}>Houston</button>
        </div>
      </div>
      <div className="row mt-4 mb-4">
        <div className='col-4'>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Latitude"
            value={userLat}
            onChange={(e) => setUserLat(e.target.value)}
          />
        </div>
        <div className='col-4'>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Longitude"
            value={userLong}
            onChange={(e) => setUserLong(e.target.value)}
          />
        </div>
        <div className="col-3">
          <button className="btn btn-primary" onClick={fetchWeather}>+</button>
        </div>
      </div>
      {(weatherData.time && weatherData.temperature_2m) && !error && (
        <div>
          <div className="row">
            <div className="col-5">
              <h5>Time</h5>
            </div>
            <div className="col-5">
              <h5>Temperature</h5>
            </div>
          </div>

          <div className="row">
            {weatherData.time.slice(0,10).map((time, index) => (  
              <div className="row" key={index}>     
                <div className="col-5">
                  <div className="time">{formatTime(weatherData.time[index])}</div>
                </div>
                <div className="col-6">
                  <div>{weatherData.temperature_2m[index]} °C</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div>
          {error}
        </div>
      )}

    </div>
  );
}

export default App;
