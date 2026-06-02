# 🌤️ Weather App

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-2ea44f?style=flat-square)

> Real-time weather app — search any city and get live temperature, humidity, wind speed, and weather icons instantly.

🔗 **[Live Demo → umerdevhub.github.io/Weather-Frontend](https://umerdevhub.github.io/Weather-Frontend)**

---

## ✨ Features

- Search weather by city name
- Displays temperature (°C), humidity, wind speed, and weather condition
- Dynamic weather icons based on current conditions
- Responsive design — works on mobile and desktop
- Live data from OpenWeatherMap API

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/UmerDevHub/Weather-Frontend.git
cd Weather-Frontend
npm install
```

1. Copy `.env.example` to `.env`
2. Open `.env` and set your key:
   ```env
   OPENWEATHER_KEY=YOUR_API_KEY_HERE
   ```
3. Run the server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:3000`

The app now uses `server.js` as a proxy so the OpenWeatherMap key stays in `.env` and is not committed to GitHub.

Get a free API key at [openweathermap.org](https://openweathermap.org/api)

---

## 🌐 Deployment

Since this app uses an Express backend server (`server.js`) to securely proxy API requests (keeping your `OPENWEATHER_KEY` hidden from the client browser), it cannot be hosted on purely static platforms like GitHub Pages. Instead, host the entire project as a Node.js web service on **Railway** or **Render**.

### Deploying on Railway / Render:
1. Connect your GitHub repository to [Railway](https://railway.app) or [Render](https://render.com).
2. Set the build command to `npm install` and the start command to `npm start`.
3. Add the following environment variable in the dashboard settings:
   - `OPENWEATHER_KEY` = *your OpenWeatherMap API key*
4. Generate a public domain link in your service's networking/settings tab.

---

## 📂 Structure

```
Weather-Frontend/
├── index.html    ← Main HTML file
├── style.css     ← Styling
├── script.js     ← API calls and DOM logic
└── Images/       ← Weather condition icons
```

---

## 🔧 Planned Improvements

- [ ] 5-day forecast view
- [ ] Geolocation — auto-detect user's city
- [ ] Toggle °C / °F
- [ ] Search history
