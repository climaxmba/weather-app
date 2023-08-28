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
    setTimeout(_removeMsg, 8000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ0c7QUFDckQ7QUFDQSxrRUFBTztBQUNQLDJEQUFpQixRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvZm9ybWF0LXRpbWUvbGliL2luZGV4LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1YkV2ZW50cy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy9UT0RPOiBhZGQgYWJpbGl0eSB0byBkZXRlY3QgaDptIChzaW5nbGUgZGlnaXQgZm9yIG1pbnV0ZSlcbiAgdmFyIHJlID0gL15cXHMqKFswLTldfFswLTFdWzAtOV0/fDJbMC00XT8pKD89XFxzKlxcOj9cXHMqKFswLTVdWzAtOV0pP1xccypbXjAtOSxhLHBdKihbYSxwXSk/W14wLTksYSxwXSokKS9pO1xuXG4gIHZhciBnZXRGb3JtYXR0ZWRUaW1lID0gZnVuY3Rpb24odGltZVN0ciwgYW1wbVN3aXRjaCkge1xuXG4gICAgYW1wbVN3aXRjaCA9IGFtcG1Td2l0Y2ggPyBhbXBtU3dpdGNoIDogJzY6NTknOyBcblxuICAgIHZhciByID0gcmUuZXhlYyh0aW1lU3RyKTsgXG4gICAgdmFyIGhvdXIgPSByICYmIHJbMV0gPyBOdW1iZXIoclsxXSkgOiB1bmRlZmluZWQ7IFxuICAgIHZhciBtaW51dGVzID0gciAmJiByWzJdID8gclsyXSA6IDA7XG4gICAgbWludXRlcyA9IChtaW51dGVzICsgJzAnKS5zbGljZSgwLDIpOyBcbiAgICBtaW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpOyAgXG4gICAgbWludXRlcyA9IGlzTmFOKG1pbnV0ZXMpID8gMCA6IG1pbnV0ZXM7IFxuICAgIHZhciBhbXBtID0gciAmJiByWzNdID8gclszXSA6IHVuZGVmaW5lZDsgXG5cbiAgICB2YXIgbmV3VGltZTsgXG5cblxuICAgIC8vIGlmIG5vIGhvdXIsIHRoZW4gY2Fubm90IGRldGVybWluZSB0aW1lLiByZXR1cm4gdGltZVN0ciBhcyBwYXNzZWQgaW5cbiAgICBpZihob3VyID09PSB1bmRlZmluZWQgfHwgaXNOYU4oaG91cikgfHwgaG91ciA+IDI0IHx8IG1pbnV0ZXMgPiA1OSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXG4gICAgfVxuXG4gICAgLy8gaWYgaG91ciBpczogXG4gICAgLy8gMCBvciAyNDogaG91cj0xMiwgYW1wbT1BTSBpZiB1bmRlZmluZWRcbiAgICAvLyAxLTExIDogIGFtcG0gYmFzZWQgb24gYW1wbVN3aXRjaFxuICAgIC8vIDEyIDogICAgYW1wbSA9IHBtIGlmIHVuZGVmaW5lZCBcbiAgICAvLyAxMy0yMyA6IGFtcG0gPSBwbSBhbHdheXMgZXZlbiBpZiBhbXBtID0gYW1cblxuICAgIGlmKGhvdXIgPT09IDAgfHwgaG91ciA9PT0gMjQpIHtcbiAgICAgIGhvdXIgPSAxMjsgXG4gICAgICBpZighYW1wbSkge1xuICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDAgJiYgaG91ciA8IDEyKSB7XG4gICAgICBpZiAoIWFtcG0pIHtcbiAgICAgICAgdmFyIHN3ID0gcmUuZXhlYyhhbXBtU3dpdGNoKTtcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hIb3VyID0gc3cgJiYgc3dbMV0gPyBzd1sxXSA6IHVuZGVmaW5lZDsgXG4gICAgICAgIHZhciBhbXBtU3dpdGNoTWludXRlID0gc3cgJiYgc3dbMl0gPyBzd1syXSA6IHVuZGVmaW5lZDsgXG5cbiAgICAgICAgaWYoaG91ciA+IGFtcG1Td2l0Y2hIb3VyIHx8IFxuICAgICAgICAgIChob3VyID09PSBhbXBtU3dpdGNoSG91ciAmJiBtaW51dGUgPiBhbXBtU3dpdGNoTWludXRlKSkge1xuICAgICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID09PTEyKSB7XG4gICAgICBhbXBtID0gIWFtcG0gPyAnUE0nIDogYW1wbTsgXG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDEyKSB7XG4gICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICBob3VyID0gaG91ciAtIDEyIDsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ0EnIHx8IGFtcG0gPT09ICdhJyA/ICdBTScgOiBhbXBtO1xuICAgICAgYW1wbSA9IGFtcG0gPT09ICdQJyB8fCBhbXBtID09PSAncCcgPyAnUE0nIDogYW1wbTtcbiAgICB9XG5cbiAgICBtaW51dGVzID0gKCcwJyArIG1pbnV0ZXMpLnNsaWNlKC0yKTsgXG5cbiAgICBuZXdUaW1lID0gaG91ciArICc6JyArIG1pbnV0ZXMgKyAnICcgKyBhbXBtO1xuXG4gICAgcmV0dXJuIG5ld1RpbWU7ICBcblxuICB9O1xuXG5cbiAgdmFyIGZvcm1hdFRpbWUgPSB7XG4gICAgcmU6IHJlLCBcbiAgICBnZXRGb3JtYXR0ZWRUaW1lOiBnZXRGb3JtYXR0ZWRUaW1lXG4gIH07IFxuICB2YXIgcm9vdCA9IHRoaXM7IFxuICAvLyB0aGFua3MgYXN5bmM6IFxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRUaW1lO1xuICAgIH1cbiAgICBleHBvcnRzLmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH1cblxufSkoKTtcblxuIiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuaW1wb3J0IGZ0IGZyb20gXCJmb3JtYXQtdGltZVwiO1xyXG5cclxuY29uc3QgZGlzcGxheUNvbnRyb2xsZXIgPSAoKCkgPT4ge1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmRhdGFSZWNpZXZlZCwgX3JlbmRlckRhdGEpO1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLnNlYXJjaEZhaWxlZCwgX3JlbW92ZWxvYWRpbmdTY3JlZW4pO1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmFyZWFzTGlzdFJlY2lldmVkLCBfdXBkYXRlQXJlYXNMaXN0KTtcclxuXHJcbiAgLy8gQ2FjaGUgRE9NXHJcbiAgY29uc3Qgc2VhcmNoQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaC1ib3gnXVwiKSxcclxuICAgIHNlYXJjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gnXVwiKSxcclxuICAgIGFyZWFzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdhcmVhcy1saXN0J11cIiksXHJcbiAgICBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NpdHknXVwiKSxcclxuICAgIGNvdW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY291bnRyeSddXCIpLFxyXG4gICAgdGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0aW1lJ11cIiksXHJcbiAgICBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2RhdGUnXVwiKSxcclxuICAgIHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGVtcCddXCIpLFxyXG4gICAgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWljb24nXVwiKSxcclxuICAgIGNvbmRpdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWNvbmRpdGlvbiddXCIpLFxyXG4gICAgdW5pdHNTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndW5pdHMtc3dpdGNoJ11cIiksXHJcbiAgICB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dpbmQnXVwiKSxcclxuICAgIHByZXNzdXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3ByZXNzdXJlJ11cIiksXHJcbiAgICBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdodW1pZGl0eSddXCIpLFxyXG4gICAgdmlzaWJpbGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd2aXNpYmlsaXR5J11cIiksXHJcbiAgICB1diA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1diddXCIpLFxyXG4gICAgZ3VzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdndXN0J11cIiksXHJcbiAgICBsb2FkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2xvYWRpbmcnXVwiKSxcclxuICAgIG1zZ0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdtc2ctYm94J11cIiksXHJcbiAgICBtc2dUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J21zZy10ZXh0J11cIiksXHJcbiAgICBjYW5jZWxNc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY2FuY2VsLW1zZyddXCIpLFxyXG4gICAgZGF5c0NvbnRyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2RheXMtY29udHInXVwiKSxcclxuICAgIGhvdXJzQ29udHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0naG91cnMtY29udHInXVwiKTtcclxuXHJcbiAgbGV0IHVzZXJDaG9pY2VJbXBlcmlhbCA9IGZhbHNlLCBjYWNoZWREYXRhO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2FkZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZEV2ZW50cygpIHtcclxuICAgIHNlYXJjaEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX2NoZWNrSW5wdXQpO1xyXG4gICAgc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfcXVlcnlBZGRyZXNzKTtcclxuICAgIHVuaXRzU3dpdGNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfc3dpdGNoVW5pdHMpO1xyXG4gICAgY2FuY2VsTXNnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfcmVtb3ZlTXNnKTtcclxuICAgIGFyZWFzTGlzdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QXJlYUNvb3JkKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jaGVja0lucHV0KGUpIHtcclxuICAgIGlmIChlLnRhcmdldC52YWx1ZS5sZW5ndGggPj0gMykge1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YUlucHV0ZWQsIGUudGFyZ2V0LnZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9yZW1vdmVBcmVhc0xpc3QoKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3VwZGF0ZUFyZWFzTGlzdChsaXN0KSB7XHJcbiAgICBhcmVhc0xpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIsIGAke2xpc3RbaV0ubGF0fSwgJHtsaXN0W2ldLmxvbn1gKTtcclxuICAgICAgbm9kZS5pbm5lckhUTUwgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNOS41LDNBNi41LDYuNSAwIDAsMSAxNiw5LjVDMTYsMTEuMTEgMTUuNDEsMTIuNTkgMTQuNDQsMTMuNzNMMTQuNzEsMTRIMTUuNUwyMC41LDE5TDE5LDIwLjVMMTQsMTUuNVYxNC43MUwxMy43MywxNC40NEMxMi41OSwxNS40MSAxMS4xMSwxNiA5LjUsMTZBNi41LDYuNSAwIDAsMSAzLDkuNUE2LjUsNi41IDAgMCwxIDkuNSwzTTkuNSw1QzcsNSA1LDcgNSw5LjVDNSwxMiA3LDE0IDkuNSwxNEMxMiwxNCAxNCwxMiAxNCw5LjVDMTQsNyAxMiw1IDkuNSw1WlwiIC8+PC9zdmc+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhcmVhLW5hbWVcIj4ke2xpc3RbaV0uZGlzcGxheV9uYW1lfTwvc3Bhbj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtsaXN0W2ldLmNsYXNzfTwvc3Bhbj48c3Bhbj4vPC9zcGFuPjxzcGFuPiR7bGlzdFtpXS50eXBlfTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICBhcmVhc0xpc3QuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2Rpc3BsYXlBcmVhc0xpc3QoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFkZHJlc3MoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGZvcm0gPSBlLnRhcmdldC5mb3JtO1xyXG4gICAgY29uc3QgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXMobmV3IEZvcm1EYXRhKGZvcm0pKTtcclxuXHJcbiAgICBpZiAoZGF0YS5xKSBfc2VhcmNoRGF0YShkYXRhLnEpO1xyXG4gICAgaW5wdXQudmFsdWUgPSBudWxsO1xyXG4gICAgaW5wdXQuYmx1cigpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcXVlcnlBcmVhQ29vcmQoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgbGV0IGVsZW0gPSBlLnRhcmdldDtcclxuICAgICAgd2hpbGUgKCFlbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtY29vcmRcIikpIGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIF9zZWFyY2hEYXRhKGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hEYXRhKGFkZHIpIHtcclxuICAgIF9kaXNwbGF5TG9hZGluZ1NjcmVlbigpO1xyXG4gICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFTZWFyY2hlZCwgYWRkcilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zd2l0Y2hVbml0cygpIHtcclxuICAgIGlmIChjYWNoZWREYXRhKSB7XHJcbiAgICAgIHVzZXJDaG9pY2VJbXBlcmlhbCA9ICF1c2VyQ2hvaWNlSW1wZXJpYWw7XHJcbiAgICAgIF9yZW5kZXJEYXRhKGNhY2hlZERhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlbmRlckRhdGEoZGF0YSwgaXNJbXBlcmlhbCA9IHVzZXJDaG9pY2VJbXBlcmlhbCkge1xyXG4gICAgX3JlbmRlckN1cnJlbnREYXRhKGRhdGEsIGlzSW1wZXJpYWwpO1xyXG4gICAgX3JlbmRlckZvcmVjYXN0RGF0YShkYXRhLmRheXNGb3JlY2FzdCwgaXNJbXBlcmlhbCk7XHJcbiAgICBfcmVuZGVySG91cnNEYXRhKGRhdGEuaG91cnNGb3JlY2FzdCwgaXNJbXBlcmlhbCk7XHJcbiAgICBfcmVtb3ZlbG9hZGluZ1NjcmVlbigpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVuZGVyQ3VycmVudERhdGEoZGF0YSwgaXNJbXBlcmlhbCkge1xyXG4gICAgY2FjaGVkRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgY2l0eS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcclxuICAgIGNvdW50cnkudGV4dENvbnRlbnQgPSBkYXRhLmNvdW50cnk7XHJcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xyXG4gICAgZGF0ZS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgIGljb24uc3JjID0gZGF0YS5pY29uO1xyXG4gICAgY29uZGl0aW9uLnRleHRDb250ZW50ID0gZGF0YS5jb25kaXRpb25UZXh0O1xyXG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xyXG4gICAgdXYudGV4dENvbnRlbnQgPSBkYXRhLnV2O1xyXG5cclxuICAgIC8vIEltcGVyaWFsIGZpZWxkc1xyXG4gICAgaWYgKGlzSW1wZXJpYWwpIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFdpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFZpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsR3VzdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljR3VzdDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckZvcmVjYXN0RGF0YShmb3JlY2FzdCwgaXNJbXBlcmlhbCkge1xyXG4gICAgZGF5c0NvbnRyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBmb3JlY2FzdC5mb3JFYWNoKGRhdGEgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgbm9kZS5jbGFzc05hbWUgPSBcImRheXMgcm91bmRlZC1ib3JkZXJcIjtcclxuXHJcbiAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDxpbWcgc3JjPVwiJHtkYXRhLmljb259XCIgYWx0PVwid2VhdGhlci1pY29uXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRheS1kYXRlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRheS10ZW1wXCI+PC9kaXY+YDtcclxuICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiLmRheS1kYXRlXCIpLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgICBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZGF5LXRlbXBcIikudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsXHJcbiAgICAgICAgPyBkYXRhLmltcGVyaWFsVGVtcFxyXG4gICAgICAgIDogZGF0YS5tZXRyaWNUZW1wO1xyXG5cclxuICAgICAgZGF5c0NvbnRyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckhvdXJzRGF0YShob3VycywgaXNJbXBlcmlhbCkge1xyXG4gICAgaG91cnNDb250ci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgaG91cnMuZm9yRWFjaChvYmogPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgbm9kZS5jbGFzc05hbWUgPSBcImhvdXJzXCI7XHJcblxyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8ZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPiR7ZnQuZ2V0Rm9ybWF0dGVkVGltZShvYmoudGltZS5zcGxpdChcIiBcIilbMV0pLnRvTG93ZXJDYXNlKCl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtvYmouY29uZGl0aW9uLmljb259XCIgYWx0PVwid2VhdGhlci1pY29uXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGVzXCI+JHtuZXcgRGF0ZShvYmoudGltZS5zcGxpdChcIiBcIilbMF0pLnRvRGF0ZVN0cmluZygpfTwvZGl2PmA7XHJcbiAgICAgIG5vZGUucXVlcnlTZWxlY3RvcihcIi50ZW1wXCIpLnRleHRDb250ZW50ID0gaXNJbXBlcmlhbFxyXG4gICAgICAgID8gYCR7b2JqLnRlbXBfZn3CsEZgXHJcbiAgICAgICAgOiBgJHtvYmoudGVtcF9jfcKwQ2A7XHJcbiAgICAgIFxyXG4gICAgICBob3Vyc0NvbnRyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5TG9hZGluZ1NjcmVlbigpIHtcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZWxvYWRpbmdTY3JlZW4obXNnKSB7XHJcbiAgICBpZiAobXNnKSBfZGlzcGxheU1zZyhtc2cpO1xyXG4gICAgbG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgX3JlbW92ZUFyZWFzTGlzdCgpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZGlzcGxheU1zZyhtc2cpIHtcclxuICAgIG1zZ1RleHQudGV4dENvbnRlbnQgPSBtc2c7XHJcbiAgICBtc2dCb3guY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgIHNldFRpbWVvdXQoX3JlbW92ZU1zZywgODAwMCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVNc2coKSB7XHJcbiAgICBtc2dCb3guY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlBcmVhc0xpc3QoKSB7XHJcbiAgICBhcmVhc0xpc3QuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZUFyZWFzTGlzdCgpIHtcclxuICAgIGFyZWFzTGlzdC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUNvbnRyb2xsZXI7XHJcbiIsImNvbnN0IHB1YlN1YiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZXZlbnRzID0ge307XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGV2ZW50c1tldmVudF0gPyBldmVudHNbZXZlbnRdLnB1c2goZm4pIDogKGV2ZW50c1tldmVudF0gPSBbZm5dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHVuU3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tldmVudF0gPSBldmVudHNbZXZlbnRdLmZpbHRlcigoZnVuYykgPT4gZnVuYyAhPT0gZm4pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwdWJsaXNoKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSBldmVudHNbZXZlbnRdLmZvckVhY2goKGZuKSA9PiBmbihkYXRhKSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHVuU3Vic2NyaWJlLCBwdWJsaXNoIH07XHJcbiAgfSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiLCJjb25zdCBldmVudHMgPSB7XHJcbiAgICBkYXRhUmVjaWV2ZWQ6IFwiZGF0YVJlY2lldmVkXCIsXHJcbiAgICBkYXRhU2VhcmNoZWQ6IFwiZGF0YVNlYXJjaGVkXCIsXHJcbiAgICBzZWFyY2hGYWlsZWQ6IFwic2VhcmNoRmFpbGVkXCIsXHJcbiAgICBkYXRhSW5wdXRlZDogXCJkYXRhSW5wdXRlZFwiLFxyXG4gICAgYXJlYXNMaXN0UmVjaWV2ZWQ6IFwiYXJlYXNMaXN0UmVjaWV2ZWRcIixcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzOyIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcbmltcG9ydCBmdCBmcm9tIFwiZm9ybWF0LXRpbWVcIjtcclxuXHJcbmNvbnN0IHdlYXRoZXIgPSAoKCkgPT4ge1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmRhdGFTZWFyY2hlZCwgX3NlYXJjaERhdGEpO1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmRhdGFJbnB1dGVkLCBfZ2V0QXJlYXNMaXN0KTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9nZXRVc2VyQ29vcmQoKVxyXG4gICAgICAudGhlbigoaXBEYXRhKSA9PiBfc2VhcmNoRGF0YShgJHtpcERhdGEubGF0fSwke2lwRGF0YS5sb259YCkpXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICBfc2VhcmNoRGF0YShcIlRleGFzXCIpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZWFyY2hEYXRhKHF1ZXJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgX2dldFBhcnNlZERhdGEocXVlcnkpO1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVJlY2lldmVkLCBkYXRhKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhgd2VhdGhlckhhbmRsZXI6ICR7ZXJyfWApO1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuc2VhcmNoRmFpbGVkLCBlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0QXJlYXNMaXN0KGlucHV0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2dlb2NvZGUubWFwcy5jby9zZWFyY2g/cT0ke2lucHV0fWAsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmFyZWFzTGlzdFJlY2lldmVkLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnZXRBcmVhc0xpc3Q6IEZhaWxlZCFcIik7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRVc2VyQ29vcmQoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2lwLWFwaS5jb20vanNvbi9cIiwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRmFpbGVkIHRvIGdldCB1c2VyIElQIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9YzUyZWFlY2FmZTYyNGFiNjkwODIwMjc0OTIzMjEwOCZkYXlzPTMmcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSByZXN1bHQuY3VycmVudCxcclxuICAgICAgICBsb2NhdGlvbkRhdGEgPSByZXN1bHQubG9jYXRpb24sXHJcbiAgICAgICAgZm9yZWNhc3QgPSByZXN1bHQuZm9yZWNhc3QuZm9yZWNhc3RkYXksXHJcbiAgICAgICAgZW1wdHlDb250ZW50ID0gXCJfIF8gX1wiO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjaXR5OiBsb2NhdGlvbkRhdGEubmFtZSB8fCBlbXB0eUNvbnRlbnQsXHJcbiAgICAgICAgY291bnRyeTogYCR7bG9jYXRpb25EYXRhLnJlZ2lvbiB8fCBlbXB0eUNvbnRlbnR9LCAke1xyXG4gICAgICAgICAgbG9jYXRpb25EYXRhLmNvdW50cnkgfHwgZW1wdHlDb250ZW50XHJcbiAgICAgICAgfWAsXHJcbiAgICAgICAgdGltZTogZnQuZ2V0Rm9ybWF0dGVkVGltZShsb2NhdGlvbkRhdGEubG9jYWx0aW1lLnNwbGl0KFwiIFwiKVsxXSksXHJcbiAgICAgICAgZGF0ZTogbmV3IERhdGUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF0pLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgIG1ldHJpY1RlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfY30gwrBDYCxcclxuICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfZn0gwrBGYCxcclxuICAgICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICBjb25kaXRpb25UZXh0OiBjdXJyZW50RGF0YS5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0ga20vaCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIGltcGVyaWFsV2luZDogYCR7Y3VycmVudERhdGEud2luZF9tcGh9IG1pbGVzL2gsICR7Y3VycmVudERhdGEud2luZF9kaXJ9YCxcclxuICAgICAgICBtZXRyaWNQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfbWJ9IG1iYCxcclxuICAgICAgICBpbXBlcmlhbFByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9pbn0gaW5gLFxyXG4gICAgICAgIGh1bWlkaXR5OiBjdXJyZW50RGF0YS5odW1pZGl0eSxcclxuICAgICAgICBtZXRyaWNWaXNpYmlsaXR5OiBgJHtjdXJyZW50RGF0YS52aXNfa219IGttYCxcclxuICAgICAgICBpbXBlcmlhbFZpc2liaWxpdHk6IGAke1xyXG4gICAgICAgICAgcGFyc2VJbnQoY3VycmVudERhdGEudmlzX21pbGVzKSA9PT0gMVxyXG4gICAgICAgICAgICA/IGAke2N1cnJlbnREYXRhLnZpc19taWxlc30gbWlsZWBcclxuICAgICAgICAgICAgOiBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVzYFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHV2OiBjdXJyZW50RGF0YS51dixcclxuICAgICAgICBtZXRyaWNHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X2twaH0ga20vaGAsXHJcbiAgICAgICAgaW1wZXJpYWxHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X21waH0gbWlsZXMvaGAsXHJcbiAgICAgICAgZGF5c0ZvcmVjYXN0OiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzBdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFswXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzBdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzBdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzFdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFsxXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzFdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzFdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzJdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFsyXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzJdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzJdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBob3Vyc0ZvcmVjYXN0OiBbXHJcbiAgICAgICAgICAuLi5mb3JlY2FzdFswXS5ob3VyLFxyXG4gICAgICAgICAgLi4uZm9yZWNhc3RbMV0uaG91cixcclxuICAgICAgICAgIC4uLmZvcmVjYXN0WzJdLmhvdXIsXHJcbiAgICAgICAgXSxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJDb3VsZCBub3QgbG9hZCBkYXRhIVwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdlYXRoZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgd2VhdGhlciBmcm9tIFwiLi9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzXCI7XHJcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL2Rpc3BsYXkuanNcIjtcclxuXHJcbndlYXRoZXIuaW5pdCgpO1xyXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9