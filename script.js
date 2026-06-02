
const url = "/weather?city=";

const wholediv = document.querySelector(".main-div");
const h3 = document.querySelector("h3");
const button = document.querySelector("button");
const input = document.querySelector("input");
const img = document.querySelector("#main-img");
const temperature = document.querySelector("#temp");
const city = document.querySelector("#city");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");

h3.classList.add("remove");
wholediv.style.height = "120px";
img.classList.add("remove");

button.addEventListener("click", async () => {
  const country = input.value.trim();
  if (!country) return;

  const data = await getData(country);

  if (!data || data.cod === "404" || data.cod === 404) {
    h3.textContent = "No Country Found";
    h3.classList.remove("remove");
    wholediv.style.height = "180px";
    img.classList.add("remove");
  } else if (data.cod && data.cod !== 200) {
    h3.textContent = data.message || "Unable to fetch weather";
    h3.classList.remove("remove");
    wholediv.style.height = "180px";
    img.classList.add("remove");
  } else {
    const condition = data.weather[0].main;
    if (condition === "Clouds") img.src = "Images/clouds.png";
    else if (condition === "Snow") img.src = "Images/snow.png";
    else if (condition === "Rain") img.src = "Images/rain.png";
    else if (condition === "Mist") img.src = "Images/mist.png";
    else if (condition === "Drizzle") img.src = "Images/drizzle.png";
    else img.src = "Images/clear.png";

    h3.classList.add("remove");
    wholediv.style.height = "620px";
    img.classList.remove("remove");

    const temp = data.main.temp;
    const tempinC = Math.round(temp - 273.15);
    wind.innerText = data.wind.speed + " Km/h";
    temperature.innerText = tempinC + "°C";
    humidity.innerText = data.main.humidity + " %";
    city.innerText = data.name;
  }

  input.value = "";
});

async function getData(country) {
  try {
    const res = await fetch(url + encodeURIComponent(country));
    return await res.json();
  } catch (e) {
    return null;
  }
}
