import { getWeather } from "./weather.js";
import { ICON_MAP } from "./iconMap.js";

// Obtener localización del usuario
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// Si todo sale bien...
function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e) => {
      console.error(e);
      alert("Error getting weather :(");
    });
}

// Si hay error...
function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
}

// Renderizar todas las secciones
function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blur");
}

// Función de ayuda -> Setear valores en el DOM
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

// Función de ayuda -> Setear íconos
function getIconURL(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

// Renderizar Header -> Current Weather
const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current) {
  currentIcon.src = getIconURL(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-precip", current.precip);
}

// Renderizar sección Daily
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconURL(day.iconCode);
    dailySection.append(element);
  });
}

// Renderizar sección Hourly
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("date", DAY_FORMATTER.format(hour.timestamp), {
      parent: element,
    });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp) + ":00", {
      parent: element,
    });
    element.querySelector("[data-icon]").src = getIconURL(hour.iconCode);
    hourlySection.append(element);
  });
}
