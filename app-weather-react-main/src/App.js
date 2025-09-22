import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./component/search/search";
import CurrentWeather from "./component/current-weather/current-weather";
import ForeCast from "./component/forecast/forecast";
import Login from "./component/Login";
import Register from "./component/Register";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async ([weatherRes, forecastRes]) => {
        const weatherResponse = await weatherRes.json();
        const forecastResponse = await forecastRes.json();
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Router>
      <nav>
        <Link to="/">Weather</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="container">
                <Search onSearchChange={handleOnSearchChange} />
                {currentWeather && <CurrentWeather data={currentWeather} />}
                {forecast && <ForeCast data={forecast} />}
              </div>
            ) : (
              <h2>Please login to view weather</h2>
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => setIsLoggedIn(true)} // Callback to update login state
            />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
