import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";
import ft from "format-time";

const displayController = (() => {
  pubSub.subscribe(events.dataRecieved, _renderData);
  pubSub.subscribe(events.searchFailed, _removeloadingScreen);
  pubSub.subscribe(events.areasListRecieved, _updateAreasList);

  // Cache DOM
  const searchBox = document.querySelector("[data-js-name='search-box']"),
    searchBtn = document.querySelector("[data-js-name='search']"),
    areasList = document.querySelector("[data-js-name='areas-list']"),
    city = document.querySelector("[data-js-name='city']"),
    city2 =document.querySelector("[data-js-name='city2']"),
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
    gust = document.querySelector("[data-js-name='gust']"),
    loading = document.querySelector("[data-js-name='loading']"),
    msgBox = document.querySelector("[data-js-name='msg-box']"),
    msgText = document.querySelector("[data-js-name='msg-text']"),
    cancelMsg = document.querySelector("[data-js-name='cancel-msg']"),
    daysContr = document.querySelector("[data-js-name='days-contr']"),
    hoursContr = document.querySelector("[data-js-name='hours-contr']"),
    bg = document.querySelector("[data-js-name='bg']"),
    imgCredit = document.querySelector("[data-js-name='img-credit']");

  let userChoiceImperial = false, cachedData;

  function init() {
    _addEvents();
  }

  function _addEvents() {
    searchBox.addEventListener("input", _checkInput);
    searchBtn.addEventListener("click", _queryAddress);
    unitsSwitch.addEventListener("click", _switchUnits);
    cancelMsg.addEventListener("click", _removeMsg);
    areasList.addEventListener("click", _queryArea);
  }

  function _checkInput(e) {
    if (e.target.value.length >= 3) {
      pubSub.publish(events.dataInputed, e.target.value);
    } else {
      _removeAreasList();
    }
  }
  function _updateAreasList(list) {
    areasList.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
      const node = document.createElement("li");
      node.setAttribute("data-addr", `${list[i].display_name}`);
      node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
        <span class="area-name">${list[i].display_name}</span>
        <div class="category">
            <span>${list[i].class}</span><span>/</span><span>${list[i].type}</span>
        </div>`;
      areasList.appendChild(node);
    }

    _displayAreasList();
  }

  function _queryAddress(e) {
    e.preventDefault();
    _removeAreasList();

    const form = e.target.form;
    const input = form.querySelector("input");
    const data = Object.fromEntries(new FormData(form));

    if (data.q) _searchData(data.q);
    input.value = null;
    input.blur();
  }
  function _queryArea(e) {
    if (e.target !== e.currentTarget) {
      _removeAreasList();
      let elem = e.target;
      while (!elem.hasAttribute("data-addr")) elem = elem.parentElement;
      _searchData(elem.getAttribute("data-addr"));
    }
  }
  function _searchData(addr) {
    _displayLoadingScreen();
    pubSub.publish(events.dataSearched, addr)
  }

  function _switchUnits() {
    if (cachedData) {
      userChoiceImperial = !userChoiceImperial;
      _renderData(cachedData);
    }
  }

  function _renderData(data, isImperial = userChoiceImperial) {
    _renderCurrentData(data, isImperial);
    _renderForecastData(data.daysForecast, isImperial);
    _renderHoursData(data.hoursForecast, isImperial);
    _removeloadingScreen();
  }
  function _renderCurrentData(data, isImperial) {
    cachedData = data;

    city.textContent = data.city;
    city2.textContent = `${data.city} | Forecast`;
    country.textContent = data.country;
    time.textContent = data.time;
    date.textContent = data.date;
    icon.src = data.icon;
    condition.textContent = data.conditionText;
    humidity.textContent = data.humidity;
    uv.textContent = data.uv;
    bg.style.backgroundImage = `url(${data.imageData.url})`;
    imgCredit.innerHTML = `Image by <a href="${data.imageData.photographerURL}" target="_blank"></a> on <a href="${data.imageData.pageURL}" target="_blank">Pexels</a>`;
    imgCredit.querySelector("a").textContent = data.imageData.photographer;

    // Imperial fields
    if (isImperial) {
      temp.textContent = data.imperialTemp;
      wind.textContent = data.imperialWind;
      pressure.textContent = data.imperialPressure;
      visibility.textContent = data.imperialVisibility;
      gust.textContent = data.imperialGust;
    } else {
      temp.textContent = data.metricTemp;
      wind.textContent = data.metricWind;
      pressure.textContent = data.metricPressure;
      visibility.textContent = data.metricVisibility;
      gust.textContent = data.metricGust;
    }
  }
  function _renderForecastData(forecast, isImperial) {
    daysContr.innerHTML = "";
    forecast.forEach(data => {
      const node = document.createElement("div");
      node.className = "days rounded-border";

      node.innerHTML = `<img src="${data.icon}" alt="weather-icon">
        <div class="day-date"></div>
        <div class="day-temp"></div>`;
      node.querySelector(".day-date").textContent = data.date;
      node.querySelector(".day-temp").textContent = isImperial
        ? data.imperialTemp
        : data.metricTemp;

      daysContr.appendChild(node);
    })
  }
  function _renderHoursData(hours, isImperial) {
    hoursContr.innerHTML = "";
    hours.forEach(obj => {
      const node = document.createElement("div");
      node.className = "hours";

      node.innerHTML = `<div>
            <div class="time">${ft.getFormattedTime(obj.time.split(" ")[1]).toLowerCase()}</div>
            <img src="${obj.condition.icon}" alt="weather-icon">
            <div class="temp"></div>
        </div>
        <div class="dates">${new Date(obj.time.split(" ")[0]).toDateString()}</div>`;
      node.querySelector(".temp").textContent = isImperial
        ? `${obj.temp_f}°F`
        : `${obj.temp_c}°C`;
      
      hoursContr.appendChild(node);
    })
  }

  function _displayLoadingScreen() {
    loading.classList.add("active");
  }
  function _removeloadingScreen(msg) {
    if (msg) _displayMsg(msg);
    loading.classList.remove("active");
    _removeAreasList();
  }
  function _displayMsg(msg) {
    msgText.textContent = msg;
    msgBox.classList.add("active");
    setTimeout(_removeMsg, 3000);
  }
  function _removeMsg() {
    msgBox.classList.remove("active");
  }
  function _displayAreasList() {
    areasList.classList.add("active");
  }
  function _removeAreasList() {
    areasList.classList.remove("active");
  }

  return { init };
})();

export default displayController;
