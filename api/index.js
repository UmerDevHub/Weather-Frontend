const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const API_KEY = process.env.OPENWEATHER_KEY;

if (!API_KEY) {
  console.error("Error: OPENWEATHER_KEY is missing. Create a .env file with your OpenWeatherMap key.");
  process.exit(1);
}

app.use(cors());
app.use(express.static(path.join(__dirname, "..")));

app.get("/weather", async (req, res) => {
  const { city, lat, lon } = req.query;

  let weatherUrl = "";
  let forecastUrl = "";

  if (lat && lon) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  } else if (city) {
    const encodedCity = encodeURIComponent(city);
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${API_KEY}`;
  } else {
    return res.status(400).json({ error: "Missing query parameter. Provide 'city' or 'lat' and 'lon'." });
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    // Check if OpenWeatherMap returned any errors
    if (weatherRes.status !== 200) {
      return res.status(weatherRes.status).json(weatherData);
    }
    if (forecastRes.status !== 200) {
      return res.status(forecastRes.status).json(forecastData);
    }

    return res.json({
      current: weatherData,
      forecast: forecastData
    });
  } catch (error) {
    console.error("Error fetching from OpenWeatherMap:", error);
    return res.status(500).json({ error: "Unable to fetch weather data from API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
