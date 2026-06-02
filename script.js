// Select Elements
const appCard = document.querySelector("#app-card");
const weatherContent = document.querySelector("#weather-content");
const loader = document.querySelector("#loader");
const errorMsg = document.querySelector("#error-msg");

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const geoBtn = document.querySelector("#geo-btn");
const unitCheckbox = document.querySelector("#unit-checkbox");
const unitCLabel = document.querySelector("#unit-c");
const unitFLabel = document.querySelector("#unit-f");

const mainImg = document.querySelector("#main-img");
const tempEl = document.querySelector("#temp");
const descriptionEl = document.querySelector("#description");
const cityEl = document.querySelector("#city");

const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const feelsLikeEl = document.querySelector("#feels-like");
const pressureEl = document.querySelector("#pressure");

const forecastContainer = document.querySelector("#forecast-container");
const recentContainer = document.querySelector("#recent-container");
const recentChips = document.querySelector("#recent-chips");

// Global State
let weatherCache = null;
let recentSearches = JSON.parse(localStorage.getItem("recent_searches")) || [];

// Constants
const API_URL = "/weather";

// On Init
document.addEventListener("DOMContentLoaded", () => {
    renderRecentChips();
    
    // Default search on load (default to New York or last searched city)
    const lastCity = recentSearches[0] || "New York";
    fetchWeatherData({ city: lastCity });
});

// Event Listeners
searchBtn.addEventListener("click", () => {
    triggerSearch();
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        triggerSearch();
    }
});

geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await fetchWeatherData({ lat, lon });
            },
            (error) => {
                hideLoader();
                console.error("Geolocation error:", error);
                showError("Location access denied or unavailable.");
            }
        );
    } else {
        showError("Geolocation not supported by browser.");
    }
});

unitCheckbox.addEventListener("change", () => {
    updateUnitUI();
    if (weatherCache) {
        renderWeather(weatherCache);
    }
});

// Click label toggles
unitCLabel.addEventListener("click", () => {
    if (unitCheckbox.checked) {
        unitCheckbox.checked = false;
        unitCheckbox.dispatchEvent(new Event("change"));
    }
});

unitFLabel.addEventListener("click", () => {
    if (!unitCheckbox.checked) {
        unitCheckbox.checked = true;
        unitCheckbox.dispatchEvent(new Event("change"));
    }
});

// Search Trigger Helper
function triggerSearch() {
    const query = cityInput.value.trim();
    if (query) {
        fetchWeatherData({ city: query });
        cityInput.value = "";
    }
}

// Fetch Weather Data from Node proxy
async function fetchWeatherData(params) {
    showLoader();
    let url = "";
    
    if (params.lat && params.lon) {
        url = `${API_URL}?lat=${params.lat}&lon=${params.lon}`;
    } else if (params.city) {
        url = `${API_URL}?city=${encodeURIComponent(params.city)}`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok || data.cod === "404" || data.cod === 404) {
            showError(data.message || "City not found. Try again.");
            return;
        }
        
        weatherCache = data;
        renderWeather(data);
        
        // Add to history if searched by city name
        if (params.city) {
            addToRecentSearches(data.current.name);
        }
        
    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to fetch weather data. Please try again.");
    }
}

// Render Weather to UI
function renderWeather(data) {
    hideLoader();
    const current = data.current;
    const forecastList = data.forecast.list;
    const isCelsius = !unitCheckbox.checked;

    // 1. Update Card Background Theme
    updateBackgroundTheme(current.weather[0].main);

    // 2. Set Hero Temperature & Condition Icon
    const condition = current.weather[0].main;
    setWeatherImg(condition);
    
    const convertedTemp = convertTemp(current.main.temp, isCelsius);
    tempEl.innerText = `${convertedTemp}°${isCelsius ? "C" : "F"}`;
    descriptionEl.innerText = current.weather[0].description;
    cityEl.innerText = current.name;

    // 3. Set Metrics Grid Values
    humidityEl.innerText = `${current.main.humidity} %`;
    
    const windSpeedStr = convertWindSpeed(current.wind.speed, isCelsius);
    windEl.innerText = windSpeedStr;

    const feelsLikeConverted = convertTemp(current.main.feels_like, isCelsius);
    feelsLikeEl.innerText = `${feelsLikeConverted}°${isCelsius ? "C" : "F"}`;
    
    pressureEl.innerText = `${current.main.pressure} hPa`;

    // 4. Render 5-Day Forecast
    renderForecast(forecastList, isCelsius);
}

// Helper: Convert Temp (Kelvin to C/F)
function convertTemp(kelvin, isCelsius) {
    if (isCelsius) {
        return Math.round(kelvin - 273.15);
    } else {
        return Math.round((kelvin - 273.15) * 9/5 + 32);
    }
}

// Helper: Convert Wind Speed (m/s to km/h or mph)
function convertWindSpeed(metersPerSec, isCelsius) {
    if (isCelsius) {
        return `${Math.round(metersPerSec * 3.6)} km/h`;
    } else {
        return `${Math.round(metersPerSec * 2.237)} mph`;
    }
}

// Helper: Set Image based on Weather Condition
function setWeatherImg(condition) {
    const condLower = condition.toLowerCase();
    if (condLower.includes("cloud")) {
        mainImg.src = "Images/clouds.png";
    } else if (condLower.includes("snow")) {
        mainImg.src = "Images/snow.png";
    } else if (condLower.includes("rain") || condLower.includes("storm") || condLower.includes("thunderstorm")) {
        mainImg.src = "Images/rain.png";
    } else if (condLower.includes("drizzle")) {
        mainImg.src = "Images/drizzle.png";
    } else if (condLower.includes("clear")) {
        mainImg.src = "Images/clear.png";
    } else {
        mainImg.src = "Images/mist.png"; // Mist, Fog, Haze, etc.
    }
}

// Helper: Get FontAwesome Icon for Forecast Condition
function getForecastIconClass(condition) {
    const condLower = condition.toLowerCase();
    if (condLower.includes("cloud")) {
        return "fa-solid fa-cloud text-blue";
    } else if (condLower.includes("snow")) {
        return "fa-solid fa-snowflake text-blue";
    } else if (condLower.includes("rain") || condLower.includes("storm") || condLower.includes("thunderstorm")) {
        return "fa-solid fa-cloud-showers-heavy text-teal";
    } else if (condLower.includes("drizzle")) {
        return "fa-solid fa-cloud-rain text-teal";
    } else if (condLower.includes("clear")) {
        return "fa-solid fa-sun text-orange";
    } else {
        return "fa-solid fa-smog text-purple";
    }
}

// Helper: Update Background Theme Class
function updateBackgroundTheme(condition) {
    const classList = ["weather-clear", "weather-clouds", "weather-rain", "weather-snow", "weather-mist"];
    classList.forEach(cls => appCard.classList.remove(cls));

    const condLower = condition.toLowerCase();
    if (condLower.includes("cloud")) {
        appCard.classList.add("weather-clouds");
    } else if (condLower.includes("snow")) {
        appCard.classList.add("weather-snow");
    } else if (condLower.includes("rain") || condLower.includes("storm") || condLower.includes("thunderstorm") || condLower.includes("drizzle")) {
        appCard.classList.add("weather-rain");
    } else if (condLower.includes("clear")) {
        appCard.classList.add("weather-clear");
    } else {
        appCard.classList.add("weather-mist");
    }
}

// Parse 5-day forecast and render
function renderForecast(forecastList, isCelsius) {
    forecastContainer.innerHTML = "";
    
    // Group forecastList (3-hour intervals) by Day
    const groups = {};
    const todayStr = new Date().toDateString();
    
    forecastList.forEach(item => {
        const dateStr = new Date(item.dt * 1000).toDateString();
        if (dateStr === todayStr) return; // skip remaining parts of today
        
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(item);
    });

    // Pick reading closest to 12:00 PM for each day
    const dailyForecasts = Object.values(groups).map(dayGroup => {
        return dayGroup.reduce((closest, current) => {
            const currentHour = new Date(current.dt * 1000).getHours();
            const closestHour = new Date(closest.dt * 1000).getHours();
            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        });
    }).slice(0, 5); // limit to 5 days

    // Generate HTML for each row
    dailyForecasts.forEach(dayData => {
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        // Find high/low temperatures in that day group to show standard weather forecast high/low range
        const dayStr = date.toDateString();
        const tempsInDay = groups[dayStr].map(item => item.main.temp);
        const maxTemp = Math.max(...tempsInDay);
        const minTemp = Math.min(...tempsInDay);

        const convertedMax = convertTemp(maxTemp, isCelsius);
        const convertedMin = convertTemp(minTemp, isCelsius);

        const iconClass = getForecastIconClass(dayData.weather[0].main);

        const row = document.createElement("div");
        row.className = "forecast-row";
        row.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <div class="forecast-icon-wrapper">
                <i class="${iconClass} forecast-icon"></i>
            </div>
            <div class="forecast-temp">
                <span class="forecast-temp-max">${convertedMax}°</span>
                <span class="forecast-temp-min">${convertedMin}°</span>
            </div>
        `;
        forecastContainer.appendChild(row);
    });
}

// Unit UI Label highlights
function updateUnitUI() {
    if (unitCheckbox.checked) {
        unitCLabel.classList.remove("active");
        unitFLabel.classList.add("active");
    } else {
        unitCLabel.classList.add("active");
        unitFLabel.classList.remove("active");
    }
}

// Handle Local Storage for Recent Searches
function addToRecentSearches(cityName) {
    // Remove if already exists to push it to the top
    recentSearches = recentSearches.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    
    // Add to front
    recentSearches.unshift(cityName);
    
    // Keep max 3 items
    recentSearches = recentSearches.slice(0, 3);
    
    localStorage.setItem("recent_searches", JSON.stringify(recentSearches));
    renderRecentChips();
}

function renderRecentChips() {
    if (recentSearches.length === 0) {
        recentContainer.classList.add("remove");
        return;
    }
    
    recentContainer.classList.remove("remove");
    recentChips.innerHTML = "";
    
    recentSearches.forEach(city => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerText = city;
        chip.addEventListener("click", () => {
            fetchWeatherData({ city });
        });
        recentChips.appendChild(chip);
    });
}

// UI State Toggles
function showLoader() {
    loader.classList.remove("remove");
    weatherContent.classList.add("remove");
    errorMsg.classList.add("remove");
}

function hideLoader() {
    loader.classList.add("remove");
    weatherContent.classList.remove("remove");
    errorMsg.classList.add("remove");
}

function showError(message) {
    loader.classList.add("remove");
    weatherContent.classList.add("remove");
    errorMsg.innerText = message;
    errorMsg.classList.remove("remove");
}
