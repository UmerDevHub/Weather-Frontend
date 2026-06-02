const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const API_KEY = process.env.OPENWEATHER_KEY;

if (!API_KEY) {
  console.error("Error: OPENWEATHER_KEY is missing. Create a .env file with your OpenWeatherMap key.");
  process.exit(1);
}

app.use(cors());
app.use(express.static("."));

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "Missing city query parameter." });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch weather data." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
