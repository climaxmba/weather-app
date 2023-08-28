/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/format-time/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/format-time/lib/index.js ***!
  \***********************************************/
/***/ ((module, exports) => {


(function() {

  //TODO: add ability to detect h:m (single digit for minute)
  var re = /^\s*([0-9]|[0-1][0-9]?|2[0-4]?)(?=\s*\:?\s*([0-5][0-9])?\s*[^0-9,a,p]*([a,p])?[^0-9,a,p]*$)/i;

  var getFormattedTime = function(timeStr, ampmSwitch) {

    ampmSwitch = ampmSwitch ? ampmSwitch : '6:59'; 

    var r = re.exec(timeStr); 
    var hour = r && r[1] ? Number(r[1]) : undefined; 
    var minutes = r && r[2] ? r[2] : 0;
    minutes = (minutes + '0').slice(0,2); 
    minutes = Number(minutes);  
    minutes = isNaN(minutes) ? 0 : minutes; 
    var ampm = r && r[3] ? r[3] : undefined; 

    var newTime; 


    // if no hour, then cannot determine time. return timeStr as passed in
    if(hour === undefined || isNaN(hour) || hour > 24 || minutes > 59) {
      return undefined; 
    }

    // if hour is: 
    // 0 or 24: hour=12, ampm=AM if undefined
    // 1-11 :  ampm based on ampmSwitch
    // 12 :    ampm = pm if undefined 
    // 13-23 : ampm = pm always even if ampm = am

    if(hour === 0 || hour === 24) {
      hour = 12; 
      if(!ampm) {
        ampm = 'AM'; 
      }
    }

    if(hour > 0 && hour < 12) {
      if (!ampm) {
        var sw = re.exec(ampmSwitch);
        var ampmSwitchHour = sw && sw[1] ? sw[1] : undefined; 
        var ampmSwitchMinute = sw && sw[2] ? sw[2] : undefined; 

        if(hour > ampmSwitchHour || 
          (hour === ampmSwitchHour && minute > ampmSwitchMinute)) {
          ampm = 'AM'; 
        } else {
          ampm = 'PM'; 
        }
      }
    }

    if(hour ===12) {
      ampm = !ampm ? 'PM' : ampm; 
    }

    if(hour > 12) {
      ampm = 'PM'; 
      hour = hour - 12 ; 
    } else { 
      ampm = ampm === 'A' || ampm === 'a' ? 'AM' : ampm;
      ampm = ampm === 'P' || ampm === 'p' ? 'PM' : ampm;
    }

    minutes = ('0' + minutes).slice(-2); 

    newTime = hour + ':' + minutes + ' ' + ampm;

    return newTime;  

  };


  var formatTime = {
    re: re, 
    getFormattedTime: getFormattedTime
  }; 
  var root = this; 
  // thanks async: 
  if (true) {
    if ( true && module.exports) {
      exports = module.exports = formatTime;
    }
    exports.formatTime = formatTime;
  } else {}

})();



/***/ }),

/***/ "./src/modules/display.js":
/*!********************************!*\
  !*** ./src/modules/display.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubSubEvents.js */ "./src/modules/pubSubEvents.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! format-time */ "./node_modules/format-time/lib/index.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(format_time__WEBPACK_IMPORTED_MODULE_2__);




const displayController = (() => {
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataRecieved, _renderData);
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].searchFailed, _removeloadingScreen);
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].areasListRecieved, _updateAreasList);

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
    hoursContr = document.querySelector("[data-js-name='hours-contr']");

  let userChoiceImperial = false, cachedData;

  function init() {
    _addEvents();
  }

  function _addEvents() {
    searchBox.addEventListener("input", _checkInput);
    searchBtn.addEventListener("click", _queryAddress);
    unitsSwitch.addEventListener("click", _switchUnits);
    cancelMsg.addEventListener("click", _removeMsg);
    areasList.addEventListener("click", _queryAreaCoord);
  }

  function _checkInput(e) {
    if (e.target.value.length >= 3) {
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataInputed, e.target.value);
    } else {
      _removeAreasList();
    }
  }
  function _updateAreasList(list) {
    areasList.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
      const node = document.createElement("li");
      node.setAttribute("data-coord", `${list[i].lat}, ${list[i].lon}`);
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

    const form = e.target.form;
    const input = form.querySelector("input");
    const data = Object.fromEntries(new FormData(form));

    if (data.q) _searchData(data.q);
    input.value = null;
    input.blur();
  }
  function _queryAreaCoord(e) {
    if (e.target !== e.currentTarget) {
      let elem = e.target;
      while (!elem.hasAttribute("data-coord")) elem = elem.parentElement;
      _searchData(elem.getAttribute("data-coord"));
    }
  }
  function _searchData(addr) {
    _displayLoadingScreen();
    _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, addr)
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
            <div class="time">${format_time__WEBPACK_IMPORTED_MODULE_2___default().getFormattedTime(obj.time.split(" ")[1]).toLowerCase()}</div>
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (displayController);


/***/ }),

/***/ "./src/modules/pubSub.js":
/*!*******************************!*\
  !*** ./src/modules/pubSub.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const pubSub = (function () {
    let events = {};
  
    function subscribe(event, fn) {
      events[event] ? events[event].push(fn) : (events[event] = [fn]);
    }
    function unSubscribe(event, fn) {
      if (events[event]) {
        events[event] = events[event].filter((func) => func !== fn);
      }
    }
    function publish(event, data) {
      if (events[event]) events[event].forEach((fn) => fn(data));
    }
  
    return { subscribe, unSubscribe, publish };
  })();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pubSub);

/***/ }),

/***/ "./src/modules/pubSubEvents.js":
/*!*************************************!*\
  !*** ./src/modules/pubSubEvents.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const events = {
    dataRecieved: "dataRecieved",
    dataSearched: "dataSearched",
    searchFailed: "searchFailed",
    dataInputed: "dataInputed",
    areasListRecieved: "areasListRecieved",
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (events);

/***/ }),

/***/ "./src/modules/weatherHandler.js":
/*!***************************************!*\
  !*** ./src/modules/weatherHandler.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubSubEvents.js */ "./src/modules/pubSubEvents.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! format-time */ "./node_modules/format-time/lib/index.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(format_time__WEBPACK_IMPORTED_MODULE_2__);




const weather = (() => {
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, _searchData);
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataInputed, _getAreasList);

  async function init() {
    _getUserCoord()
      .then((ipData) => _searchData(`${ipData.lat},${ipData.lon}`))
      .catch((err) => {
        console.log(err);
        _searchData("Texas");
      });
  }

  async function _searchData(query) {
    try {
      const data = await _getParsedData(query);
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataRecieved, data);
    } catch (err) {
      console.log(`weatherHandler: ${err}`);
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].searchFailed, err);
    }
  }
  async function _getAreasList(input) {
    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${input}`, { mode: "cors" });
      if (response.ok) {
        const data = await response.json();
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].areasListRecieved, data);
      } else {
        throw new Error("getAreasList: Failed!");
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async function _getUserCoord() {
    try {
      const response = await fetch("http://ip-api.com/json/", { mode: "cors" });
      const data = await response.json();
      return data;
    } catch {
      return Promise.reject("Failed to get user IP coordinates");
    }
  }

  async function _getCurrentData(location) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=c52eaecafe624ab6908202749232108&days=3&q=${location}`;
    let result, data;
    try {
      result = await fetch(url, { mode: "cors" });
      if (result.ok) {
        data = await result.json();
        return data;
      } else {
        throw new Error(result.status);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async function _getParsedData(location) {
    try {
      const result = await _getCurrentData(location);
      const currentData = result.current,
        locationData = result.location,
        forecast = result.forecast.forecastday,
        emptyContent = "_ _ _";

      return {
        city: locationData.name || emptyContent,
        country: `${locationData.region || emptyContent}, ${
          locationData.country || emptyContent
        }`,
        time: format_time__WEBPACK_IMPORTED_MODULE_2___default().getFormattedTime(locationData.localtime.split(" ")[1]),
        date: new Date(locationData.localtime.split(" ")[0]).toDateString(),
        metricTemp: `${currentData.temp_c} °C`,
        imperialTemp: `${currentData.temp_f} °F`,
        icon: currentData.condition.icon,
        conditionText: currentData.condition.text,
        metricWind: `${currentData.wind_kph} km/h, ${currentData.wind_dir}`,
        imperialWind: `${currentData.wind_mph} miles/h, ${currentData.wind_dir}`,
        metricPressure: `${currentData.pressure_mb} mb`,
        imperialPressure: `${currentData.pressure_in} in`,
        humidity: currentData.humidity,
        metricVisibility: `${currentData.vis_km} km`,
        imperialVisibility: `${
          parseInt(currentData.vis_miles) === 1
            ? `${currentData.vis_miles} mile`
            : `${currentData.vis_miles} miles`
        }`,
        uv: currentData.uv,
        metricGust: `${currentData.gust_kph} km/h`,
        imperialGust: `${currentData.gust_mph} miles/h`,
        daysForecast: [
          {
            date: new Date(forecast[0].date).toDateString(),
            metricTemp: `${forecast[0].day.avgtemp_c} °C`,
            imperialTemp: `${forecast[0].day.avgtemp_f} °F`,
            icon: forecast[0].day.condition.icon,
          },
          {
            date: new Date(forecast[1].date).toDateString(),
            metricTemp: `${forecast[1].day.avgtemp_c} °C`,
            imperialTemp: `${forecast[1].day.avgtemp_f} °F`,
            icon: forecast[1].day.condition.icon,
          },
          {
            date: new Date(forecast[2].date).toDateString(),
            metricTemp: `${forecast[2].day.avgtemp_c} °C`,
            imperialTemp: `${forecast[2].day.avgtemp_f} °F`,
            icon: forecast[2].day.condition.icon,
          },
        ],
        hoursForecast: [
          ...forecast[0].hour,
          ...forecast[1].hour,
          ...forecast[2].hour,
        ],
      };
    } catch {
      return Promise.reject("Could not load data!");
    }
  }

  return { init };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (weather);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_weatherHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/weatherHandler.js */ "./src/modules/weatherHandler.js");
/* harmony import */ var _modules_display_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/display.js */ "./src/modules/display.js");



_modules_weatherHandler_js__WEBPACK_IMPORTED_MODULE_0__["default"].init();
_modules_display_js__WEBPACK_IMPORTED_MODULE_1__["default"].init();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOa0Q7QUFDRztBQUNyRDtBQUNBLGtFQUFPO0FBQ1AsMkRBQWlCLFEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9mb3JtYXQtdGltZS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kaXNwbGF5LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViRXZlbnRzLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbigpIHtcblxuICAvL1RPRE86IGFkZCBhYmlsaXR5IHRvIGRldGVjdCBoOm0gKHNpbmdsZSBkaWdpdCBmb3IgbWludXRlKVxuICB2YXIgcmUgPSAvXlxccyooWzAtOV18WzAtMV1bMC05XT98MlswLTRdPykoPz1cXHMqXFw6P1xccyooWzAtNV1bMC05XSk/XFxzKlteMC05LGEscF0qKFthLHBdKT9bXjAtOSxhLHBdKiQpL2k7XG5cbiAgdmFyIGdldEZvcm1hdHRlZFRpbWUgPSBmdW5jdGlvbih0aW1lU3RyLCBhbXBtU3dpdGNoKSB7XG5cbiAgICBhbXBtU3dpdGNoID0gYW1wbVN3aXRjaCA/IGFtcG1Td2l0Y2ggOiAnNjo1OSc7IFxuXG4gICAgdmFyIHIgPSByZS5leGVjKHRpbWVTdHIpOyBcbiAgICB2YXIgaG91ciA9IHIgJiYgclsxXSA/IE51bWJlcihyWzFdKSA6IHVuZGVmaW5lZDsgXG4gICAgdmFyIG1pbnV0ZXMgPSByICYmIHJbMl0gPyByWzJdIDogMDtcbiAgICBtaW51dGVzID0gKG1pbnV0ZXMgKyAnMCcpLnNsaWNlKDAsMik7IFxuICAgIG1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7ICBcbiAgICBtaW51dGVzID0gaXNOYU4obWludXRlcykgPyAwIDogbWludXRlczsgXG4gICAgdmFyIGFtcG0gPSByICYmIHJbM10gPyByWzNdIDogdW5kZWZpbmVkOyBcblxuICAgIHZhciBuZXdUaW1lOyBcblxuXG4gICAgLy8gaWYgbm8gaG91ciwgdGhlbiBjYW5ub3QgZGV0ZXJtaW5lIHRpbWUuIHJldHVybiB0aW1lU3RyIGFzIHBhc3NlZCBpblxuICAgIGlmKGhvdXIgPT09IHVuZGVmaW5lZCB8fCBpc05hTihob3VyKSB8fCBob3VyID4gMjQgfHwgbWludXRlcyA+IDU5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyBcbiAgICB9XG5cbiAgICAvLyBpZiBob3VyIGlzOiBcbiAgICAvLyAwIG9yIDI0OiBob3VyPTEyLCBhbXBtPUFNIGlmIHVuZGVmaW5lZFxuICAgIC8vIDEtMTEgOiAgYW1wbSBiYXNlZCBvbiBhbXBtU3dpdGNoXG4gICAgLy8gMTIgOiAgICBhbXBtID0gcG0gaWYgdW5kZWZpbmVkIFxuICAgIC8vIDEzLTIzIDogYW1wbSA9IHBtIGFsd2F5cyBldmVuIGlmIGFtcG0gPSBhbVxuXG4gICAgaWYoaG91ciA9PT0gMCB8fCBob3VyID09PSAyNCkge1xuICAgICAgaG91ciA9IDEyOyBcbiAgICAgIGlmKCFhbXBtKSB7XG4gICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID4gMCAmJiBob3VyIDwgMTIpIHtcbiAgICAgIGlmICghYW1wbSkge1xuICAgICAgICB2YXIgc3cgPSByZS5leGVjKGFtcG1Td2l0Y2gpO1xuICAgICAgICB2YXIgYW1wbVN3aXRjaEhvdXIgPSBzdyAmJiBzd1sxXSA/IHN3WzFdIDogdW5kZWZpbmVkOyBcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hNaW51dGUgPSBzdyAmJiBzd1syXSA/IHN3WzJdIDogdW5kZWZpbmVkOyBcblxuICAgICAgICBpZihob3VyID4gYW1wbVN3aXRjaEhvdXIgfHwgXG4gICAgICAgICAgKGhvdXIgPT09IGFtcG1Td2l0Y2hIb3VyICYmIG1pbnV0ZSA+IGFtcG1Td2l0Y2hNaW51dGUpKSB7XG4gICAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPT09MTIpIHtcbiAgICAgIGFtcG0gPSAhYW1wbSA/ICdQTScgOiBhbXBtOyBcbiAgICB9XG5cbiAgICBpZihob3VyID4gMTIpIHtcbiAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgIGhvdXIgPSBob3VyIC0gMTIgOyBcbiAgICB9IGVsc2UgeyBcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnQScgfHwgYW1wbSA9PT0gJ2EnID8gJ0FNJyA6IGFtcG07XG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ1AnIHx8IGFtcG0gPT09ICdwJyA/ICdQTScgOiBhbXBtO1xuICAgIH1cblxuICAgIG1pbnV0ZXMgPSAoJzAnICsgbWludXRlcykuc2xpY2UoLTIpOyBcblxuICAgIG5ld1RpbWUgPSBob3VyICsgJzonICsgbWludXRlcyArICcgJyArIGFtcG07XG5cbiAgICByZXR1cm4gbmV3VGltZTsgIFxuXG4gIH07XG5cblxuICB2YXIgZm9ybWF0VGltZSA9IHtcbiAgICByZTogcmUsIFxuICAgIGdldEZvcm1hdHRlZFRpbWU6IGdldEZvcm1hdHRlZFRpbWVcbiAgfTsgXG4gIHZhciByb290ID0gdGhpczsgXG4gIC8vIHRoYW5rcyBhc3luYzogXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFRpbWU7XG4gICAgfVxuICAgIGV4cG9ydHMuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfVxuXG59KSgpO1xuXG4iLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCBkaXNwbGF5Q29udHJvbGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVJlY2lldmVkLCBfcmVuZGVyRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuc2VhcmNoRmFpbGVkLCBfcmVtb3ZlbG9hZGluZ1NjcmVlbik7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIF91cGRhdGVBcmVhc0xpc3QpO1xyXG5cclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoLWJveCddXCIpLFxyXG4gICAgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaCddXCIpLFxyXG4gICAgYXJlYXNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2FyZWFzLWxpc3QnXVwiKSxcclxuICAgIGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY2l0eSddXCIpLFxyXG4gICAgY2l0eTIgPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5MiddXCIpLFxyXG4gICAgY291bnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjb3VudHJ5J11cIiksXHJcbiAgICB0aW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RpbWUnXVwiKSxcclxuICAgIGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF0ZSddXCIpLFxyXG4gICAgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0ZW1wJ11cIiksXHJcbiAgICBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItaWNvbiddXCIpLFxyXG4gICAgY29uZGl0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItY29uZGl0aW9uJ11cIiksXHJcbiAgICB1bml0c1N3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1bml0cy1zd2l0Y2gnXVwiKSxcclxuICAgIHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2luZCddXCIpLFxyXG4gICAgcHJlc3N1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ncHJlc3N1cmUnXVwiKSxcclxuICAgIGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2h1bWlkaXR5J11cIiksXHJcbiAgICB2aXNpYmlsaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3Zpc2liaWxpdHknXVwiKSxcclxuICAgIHV2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3V2J11cIiksXHJcbiAgICBndXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2d1c3QnXVwiKSxcclxuICAgIGxvYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbG9hZGluZyddXCIpLFxyXG4gICAgbXNnQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J21zZy1ib3gnXVwiKSxcclxuICAgIG1zZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbXNnLXRleHQnXVwiKSxcclxuICAgIGNhbmNlbE1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjYW5jZWwtbXNnJ11cIiksXHJcbiAgICBkYXlzQ29udHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF5cy1jb250ciddXCIpLFxyXG4gICAgaG91cnNDb250ciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdob3Vycy1jb250ciddXCIpO1xyXG5cclxuICBsZXQgdXNlckNob2ljZUltcGVyaWFsID0gZmFsc2UsIGNhY2hlZERhdGE7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfYWRkRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYWRkRXZlbnRzKCkge1xyXG4gICAgc2VhcmNoQm94LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfY2hlY2tJbnB1dCk7XHJcbiAgICBzZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFkZHJlc3MpO1xyXG4gICAgdW5pdHNTd2l0Y2guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zd2l0Y2hVbml0cyk7XHJcbiAgICBjYW5jZWxNc2cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9yZW1vdmVNc2cpO1xyXG4gICAgYXJlYXNMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfcXVlcnlBcmVhQ29vcmQpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2NoZWNrSW5wdXQoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhSW5wdXRlZCwgZS50YXJnZXQudmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgX3JlbW92ZUFyZWFzTGlzdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBfdXBkYXRlQXJlYXNMaXN0KGxpc3QpIHtcclxuICAgIGFyZWFzTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcImRhdGEtY29vcmRcIiwgYCR7bGlzdFtpXS5sYXR9LCAke2xpc3RbaV0ubG9ufWApO1xyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk05LjUsM0E2LjUsNi41IDAgMCwxIDE2LDkuNUMxNiwxMS4xMSAxNS40MSwxMi41OSAxNC40NCwxMy43M0wxNC43MSwxNEgxNS41TDIwLjUsMTlMMTksMjAuNUwxNCwxNS41VjE0LjcxTDEzLjczLDE0LjQ0QzEyLjU5LDE1LjQxIDExLjExLDE2IDkuNSwxNkE2LjUsNi41IDAgMCwxIDMsOS41QTYuNSw2LjUgMCAwLDEgOS41LDNNOS41LDVDNyw1IDUsNyA1LDkuNUM1LDEyIDcsMTQgOS41LDE0QzEyLDE0IDE0LDEyIDE0LDkuNUMxNCw3IDEyLDUgOS41LDVaXCIgLz48L3N2Zz5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImFyZWEtbmFtZVwiPiR7bGlzdFtpXS5kaXNwbGF5X25hbWV9PC9zcGFuPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXRlZ29yeVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke2xpc3RbaV0uY2xhc3N9PC9zcGFuPjxzcGFuPi88L3NwYW4+PHNwYW4+JHtsaXN0W2ldLnR5cGV9PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICAgIGFyZWFzTGlzdC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGlzcGxheUFyZWFzTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QWRkcmVzcyhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IGUudGFyZ2V0LmZvcm07XHJcbiAgICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyhuZXcgRm9ybURhdGEoZm9ybSkpO1xyXG5cclxuICAgIGlmIChkYXRhLnEpIF9zZWFyY2hEYXRhKGRhdGEucSk7XHJcbiAgICBpbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICBpbnB1dC5ibHVyKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFyZWFDb29yZChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xyXG4gICAgICBsZXQgZWxlbSA9IGUudGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoIWVsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKSkgZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudDtcclxuICAgICAgX3NlYXJjaERhdGEoZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIpKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3NlYXJjaERhdGEoYWRkcikge1xyXG4gICAgX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCk7XHJcbiAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVNlYXJjaGVkLCBhZGRyKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N3aXRjaFVuaXRzKCkge1xyXG4gICAgaWYgKGNhY2hlZERhdGEpIHtcclxuICAgICAgdXNlckNob2ljZUltcGVyaWFsID0gIXVzZXJDaG9pY2VJbXBlcmlhbDtcclxuICAgICAgX3JlbmRlckRhdGEoY2FjaGVkRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVuZGVyRGF0YShkYXRhLCBpc0ltcGVyaWFsID0gdXNlckNob2ljZUltcGVyaWFsKSB7XHJcbiAgICBfcmVuZGVyQ3VycmVudERhdGEoZGF0YSwgaXNJbXBlcmlhbCk7XHJcbiAgICBfcmVuZGVyRm9yZWNhc3REYXRhKGRhdGEuZGF5c0ZvcmVjYXN0LCBpc0ltcGVyaWFsKTtcclxuICAgIF9yZW5kZXJIb3Vyc0RhdGEoZGF0YS5ob3Vyc0ZvcmVjYXN0LCBpc0ltcGVyaWFsKTtcclxuICAgIF9yZW1vdmVsb2FkaW5nU2NyZWVuKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW5kZXJDdXJyZW50RGF0YShkYXRhLCBpc0ltcGVyaWFsKSB7XHJcbiAgICBjYWNoZWREYXRhID0gZGF0YTtcclxuXHJcbiAgICBjaXR5LnRleHRDb250ZW50ID0gZGF0YS5jaXR5O1xyXG4gICAgY2l0eTIudGV4dENvbnRlbnQgPSBgJHtkYXRhLmNpdHl9IHwgRm9yZWNhc3RgO1xyXG4gICAgY291bnRyeS50ZXh0Q29udGVudCA9IGRhdGEuY291bnRyeTtcclxuICAgIHRpbWUudGV4dENvbnRlbnQgPSBkYXRhLnRpbWU7XHJcbiAgICBkYXRlLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgaWNvbi5zcmMgPSBkYXRhLmljb247XHJcbiAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmNvbmRpdGlvblRleHQ7XHJcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XHJcbiAgICB1di50ZXh0Q29udGVudCA9IGRhdGEudXY7XHJcblxyXG4gICAgLy8gSW1wZXJpYWwgZmllbGRzXHJcbiAgICBpZiAoaXNJbXBlcmlhbCkge1xyXG4gICAgICB0ZW1wLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFRlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsUHJlc3N1cmU7XHJcbiAgICAgIHZpc2liaWxpdHkudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxHdXN0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVGVtcDtcclxuICAgICAgd2luZC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1ByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNWaXNpYmlsaXR5O1xyXG4gICAgICBndXN0LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNHdXN0O1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVuZGVyRm9yZWNhc3REYXRhKGZvcmVjYXN0LCBpc0ltcGVyaWFsKSB7XHJcbiAgICBkYXlzQ29udHIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGZvcmVjYXN0LmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBub2RlLmNsYXNzTmFtZSA9IFwiZGF5cyByb3VuZGVkLWJvcmRlclwiO1xyXG5cclxuICAgICAgbm9kZS5pbm5lckhUTUwgPSBgPGltZyBzcmM9XCIke2RhdGEuaWNvbn1cIiBhbHQ9XCJ3ZWF0aGVyLWljb25cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF5LWRhdGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF5LXRlbXBcIj48L2Rpdj5gO1xyXG4gICAgICBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZGF5LWRhdGVcIikudGV4dENvbnRlbnQgPSBkYXRhLmRhdGU7XHJcbiAgICAgIG5vZGUucXVlcnlTZWxlY3RvcihcIi5kYXktdGVtcFwiKS50ZXh0Q29udGVudCA9IGlzSW1wZXJpYWxcclxuICAgICAgICA/IGRhdGEuaW1wZXJpYWxUZW1wXHJcbiAgICAgICAgOiBkYXRhLm1ldHJpY1RlbXA7XHJcblxyXG4gICAgICBkYXlzQ29udHIuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVuZGVySG91cnNEYXRhKGhvdXJzLCBpc0ltcGVyaWFsKSB7XHJcbiAgICBob3Vyc0NvbnRyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBob3Vycy5mb3JFYWNoKG9iaiA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBub2RlLmNsYXNzTmFtZSA9IFwiaG91cnNcIjtcclxuXHJcbiAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDxkaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+JHtmdC5nZXRGb3JtYXR0ZWRUaW1lKG9iai50aW1lLnNwbGl0KFwiIFwiKVsxXSkudG9Mb3dlckNhc2UoKX08L2Rpdj5cclxuICAgICAgICAgICAgPGltZyBzcmM9XCIke29iai5jb25kaXRpb24uaWNvbn1cIiBhbHQ9XCJ3ZWF0aGVyLWljb25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZXNcIj4ke25ldyBEYXRlKG9iai50aW1lLnNwbGl0KFwiIFwiKVswXSkudG9EYXRlU3RyaW5nKCl9PC9kaXY+YDtcclxuICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiLnRlbXBcIikudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsXHJcbiAgICAgICAgPyBgJHtvYmoudGVtcF9mfcKwRmBcclxuICAgICAgICA6IGAke29iai50ZW1wX2N9wrBDYDtcclxuICAgICAgXHJcbiAgICAgIGhvdXJzQ29udHIuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCkge1xyXG4gICAgbG9hZGluZy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlbG9hZGluZ1NjcmVlbihtc2cpIHtcclxuICAgIGlmIChtc2cpIF9kaXNwbGF5TXNnKG1zZyk7XHJcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICBfcmVtb3ZlQXJlYXNMaXN0KCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5TXNnKG1zZykge1xyXG4gICAgbXNnVGV4dC50ZXh0Q29udGVudCA9IG1zZztcclxuICAgIG1zZ0JveC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgc2V0VGltZW91dChfcmVtb3ZlTXNnLCAzMDAwKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZU1zZygpIHtcclxuICAgIG1zZ0JveC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZGlzcGxheUFyZWFzTGlzdCgpIHtcclxuICAgIGFyZWFzTGlzdC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlQXJlYXNMaXN0KCkge1xyXG4gICAgYXJlYXNMaXN0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBpbml0IH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5Q29udHJvbGxlcjtcclxuIiwiY29uc3QgcHViU3ViID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBldmVudHMgPSB7fTtcclxuICBcclxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgZXZlbnRzW2V2ZW50XSA/IGV2ZW50c1tldmVudF0ucHVzaChmbikgOiAoZXZlbnRzW2V2ZW50XSA9IFtmbl0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdW5TdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2V2ZW50XSA9IGV2ZW50c1tldmVudF0uZmlsdGVyKChmdW5jKSA9PiBmdW5jICE9PSBmbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQsIGRhdGEpIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIGV2ZW50c1tldmVudF0uZm9yRWFjaCgoZm4pID0+IGZuKGRhdGEpKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiB7IHN1YnNjcmliZSwgdW5TdWJzY3JpYmUsIHB1Ymxpc2ggfTtcclxuICB9KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsImNvbnN0IGV2ZW50cyA9IHtcclxuICAgIGRhdGFSZWNpZXZlZDogXCJkYXRhUmVjaWV2ZWRcIixcclxuICAgIGRhdGFTZWFyY2hlZDogXCJkYXRhU2VhcmNoZWRcIixcclxuICAgIHNlYXJjaEZhaWxlZDogXCJzZWFyY2hGYWlsZWRcIixcclxuICAgIGRhdGFJbnB1dGVkOiBcImRhdGFJbnB1dGVkXCIsXHJcbiAgICBhcmVhc0xpc3RSZWNpZXZlZDogXCJhcmVhc0xpc3RSZWNpZXZlZFwiLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBldmVudHM7IiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuaW1wb3J0IGZ0IGZyb20gXCJmb3JtYXQtdGltZVwiO1xyXG5cclxuY29uc3Qgd2VhdGhlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVNlYXJjaGVkLCBfc2VhcmNoRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YUlucHV0ZWQsIF9nZXRBcmVhc0xpc3QpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2dldFVzZXJDb29yZCgpXHJcbiAgICAgIC50aGVuKChpcERhdGEpID0+IF9zZWFyY2hEYXRhKGAke2lwRGF0YS5sYXR9LCR7aXBEYXRhLmxvbn1gKSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIF9zZWFyY2hEYXRhKFwiVGV4YXNcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NlYXJjaERhdGEocXVlcnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfZ2V0UGFyc2VkRGF0YShxdWVyeSk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGB3ZWF0aGVySGFuZGxlcjogJHtlcnJ9YCk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5zZWFyY2hGYWlsZWQsIGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRBcmVhc0xpc3QoaW5wdXQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPSR7aW5wdXR9YCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBwdWJTdWIucHVibGlzaChldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldEFyZWFzTGlzdDogRmFpbGVkIVwiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFVzZXJDb29yZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vaXAtYXBpLmNvbS9qc29uL1wiLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGYWlsZWQgdG8gZ2V0IHVzZXIgSVAgY29vcmRpbmF0ZXNcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0Q3VycmVudERhdGEobG9jYXRpb24pIHtcclxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT1jNTJlYWVjYWZlNjI0YWI2OTA4MjAyNzQ5MjMyMTA4JmRheXM9MyZxPSR7bG9jYXRpb259YDtcclxuICAgIGxldCByZXN1bHQsIGRhdGE7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXN1bHQgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgIGlmIChyZXN1bHQub2spIHtcclxuICAgICAgICBkYXRhID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnN0YXR1cyk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRQYXJzZWREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBfZ2V0Q3VycmVudERhdGEobG9jYXRpb24pO1xyXG4gICAgICBjb25zdCBjdXJyZW50RGF0YSA9IHJlc3VsdC5jdXJyZW50LFxyXG4gICAgICAgIGxvY2F0aW9uRGF0YSA9IHJlc3VsdC5sb2NhdGlvbixcclxuICAgICAgICBmb3JlY2FzdCA9IHJlc3VsdC5mb3JlY2FzdC5mb3JlY2FzdGRheSxcclxuICAgICAgICBlbXB0eUNvbnRlbnQgPSBcIl8gXyBfXCI7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNpdHk6IGxvY2F0aW9uRGF0YS5uYW1lIHx8IGVtcHR5Q29udGVudCxcclxuICAgICAgICBjb3VudHJ5OiBgJHtsb2NhdGlvbkRhdGEucmVnaW9uIHx8IGVtcHR5Q29udGVudH0sICR7XHJcbiAgICAgICAgICBsb2NhdGlvbkRhdGEuY291bnRyeSB8fCBlbXB0eUNvbnRlbnRcclxuICAgICAgICB9YCxcclxuICAgICAgICB0aW1lOiBmdC5nZXRGb3JtYXR0ZWRUaW1lKGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzFdKSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShsb2NhdGlvbkRhdGEubG9jYWx0aW1lLnNwbGl0KFwiIFwiKVswXSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgbWV0cmljVGVtcDogYCR7Y3VycmVudERhdGEudGVtcF9jfSDCsENgLFxyXG4gICAgICAgIGltcGVyaWFsVGVtcDogYCR7Y3VycmVudERhdGEudGVtcF9mfSDCsEZgLFxyXG4gICAgICAgIGljb246IGN1cnJlbnREYXRhLmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgIGNvbmRpdGlvblRleHQ6IGN1cnJlbnREYXRhLmNvbmRpdGlvbi50ZXh0LFxyXG4gICAgICAgIG1ldHJpY1dpbmQ6IGAke2N1cnJlbnREYXRhLndpbmRfa3BofSBrbS9oLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbWlsZXMvaCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIG1ldHJpY1ByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9tYn0gbWJgLFxyXG4gICAgICAgIGltcGVyaWFsUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX2lufSBpbmAsXHJcbiAgICAgICAgaHVtaWRpdHk6IGN1cnJlbnREYXRhLmh1bWlkaXR5LFxyXG4gICAgICAgIG1ldHJpY1Zpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19rbX0ga21gLFxyXG4gICAgICAgIGltcGVyaWFsVmlzaWJpbGl0eTogYCR7XHJcbiAgICAgICAgICBwYXJzZUludChjdXJyZW50RGF0YS52aXNfbWlsZXMpID09PSAxXHJcbiAgICAgICAgICAgID8gYCR7Y3VycmVudERhdGEudmlzX21pbGVzfSBtaWxlYFxyXG4gICAgICAgICAgICA6IGAke2N1cnJlbnREYXRhLnZpc19taWxlc30gbWlsZXNgXHJcbiAgICAgICAgfWAsXHJcbiAgICAgICAgdXY6IGN1cnJlbnREYXRhLnV2LFxyXG4gICAgICAgIG1ldHJpY0d1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3Rfa3BofSBrbS9oYCxcclxuICAgICAgICBpbXBlcmlhbEd1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3RfbXBofSBtaWxlcy9oYCxcclxuICAgICAgICBkYXlzRm9yZWNhc3Q6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMF0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzBdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMF0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMF0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMV0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzFdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMV0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMV0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMl0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzJdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMl0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMl0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGhvdXJzRm9yZWNhc3Q6IFtcclxuICAgICAgICAgIC4uLmZvcmVjYXN0WzBdLmhvdXIsXHJcbiAgICAgICAgICAuLi5mb3JlY2FzdFsxXS5ob3VyLFxyXG4gICAgICAgICAgLi4uZm9yZWNhc3RbMl0uaG91cixcclxuICAgICAgICBdLFxyXG4gICAgICB9O1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkNvdWxkIG5vdCBsb2FkIGRhdGEhXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanNcIjtcclxuaW1wb3J0IGRpc3BsYXlDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS5qc1wiO1xyXG5cclxud2VhdGhlci5pbml0KCk7XHJcbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=