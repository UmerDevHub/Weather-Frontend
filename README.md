# 🌤️ Weather App

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white)

An upgraded, real-time weather dashboard featuring a modern glassmorphism UI. It securely connects to the OpenWeatherMap API using a serverless backend proxy to keep API keys hidden from the client browser.

🔗 **Live Demo:** [weather-frontend-psi-fawn.vercel.app](https://weather-frontend-psi-fawn.vercel.app/)

---

## ✨ Features

* 📍 **Auto-Geolocation:** Detects your current location instantly to show local weather conditions.
* 🔍 **Global City Search:** Look up real-time weather conditions for any city globally.
* 📊 **Detailed Weather Metrics:** View live temperature (°C), humidity levels, wind speed, and dynamic weather condition icons.
* 📅 **Multi-Day Forecasts:** Built-in extended forecasts to plan your days ahead.
* 💎 **Glassmorphism UI:** Clean, responsive, modern interface optimized for mobile and desktop screens.
* 🔒 **Secure API Proxy:** Configured with serverless functions to keep the `OPENWEATHER_KEY` safely hidden in environment variables.

---

## 📂 Project Structure

```text
Weather-Frontend/
├── api/            ← Serverless function files for Vercel backend proxy
├── Images/         ← Weather condition asset icons
├── index.html      ← Main frontend view
├── script.js       ← DOM logic, geolocation, and API communication
├── style.css       ← Glassmorphism styling and layouts
└── vercel.json     ← Routing configuration for serverless deployment
