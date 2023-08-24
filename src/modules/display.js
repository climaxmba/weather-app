import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";

const displayController = (() => {
  pubSub.subscribe(events.dataRecieved, _renderData);

  // Cache DOM
  const searchBox = document.querySelector("[data-js-name='search-box']"),
    searchBtn = document.querySelector("[data-js-name='search']"),
    city = document.querySelector("[data-js-name='city']"),
    country = document.querySelector("[data-js-name='country']"),
    time = document.querySelector("[data-js-name='time']"),
    date = document.querySelector("[data-js-name='date']"),
    temp = document.querySelector("[data-js-name='temp']"),
    icon = document.querySelector("[data-js-name='weather-icon']"),
    condition = document.querySelector("[data-js-name='weather-condition']"),
    unitsSwitch = document.querySelector("[data-js-name='units-switch']"),
    wind = document.querySelector("[data-js-name='wind']"),
    pressure = document.querySelector("[data-js-name='pressure']"),
    humidity = document.querySelector("[data-js-name='humidity']"),
    visibility = document.querySelector("[data-js-name='visibility']"),
    uv = document.querySelector("[data-js-name='uv']"),
    gust = document.querySelector("[data-js-name='gust']");

  function init() {
    _addEvents();
  }

  function _addEvents() {
    searchBox.addEventListener("input", _upDateAreasList);
    searchBtn.addEventListener("click", _queryAddress);
    unitsSwitch.addEventListener("click", _swithUnits);
  }

  function _upDateAreasList() {
    // Update areas list
  }
  function _queryAddress() {
    // Query address
  }
  function _swithUnits() {
    // Switch units
  }
  function _renderData(data, isImperial = false) {
    city.textContent = data.city;
    country.textContent = data.country;
    time.textContent = data.time;
    date.textContent = data.date;
    temp.textContent = isImperial ? data.imperialTemp : data.metricTemp;
    icon.src = data.icon;
    condition.textContent = data.conditionText;
    wind.textContent = isImperial ? data.imperialWind : data.metricWind;
    pressure.textContent = isImperial ? data.imperialPressure : data.metricPressure;
    humidity.textContent = data.humidity;
    visibility.textContent = isImperial ? data.imperialVisibility : data.metricVisibility;
    uv.textContent = data.uv;
    gust.textContent = isImperial ? data.imperialGust : data.metricGust;
  }

  return { init };
})();

export default displayController;
