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
    daysContr = document.querySelector("[data-js-name='days-contr']");

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
        emptyContent = "_ _ _ ";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN0RDtBQUNBLDZCQUE2QixvQkFBb0I7QUFDakQ7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEMsaUJBQWlCLHVCQUF1QjtBQUN4QyxTQUFTO0FBQ1Q7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDLHlCQUF5QixzQkFBc0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDJCQUEyQjtBQUN0RCw2QkFBNkIsMkJBQTJCO0FBQ3hEO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3RELDZCQUE2QiwyQkFBMkI7QUFDeEQ7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQsNkJBQTZCLDJCQUEyQjtBQUN4RDtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7QUFDRDtBQUNBLGlFQUFlLE9BQU8sRUFBQzs7Ozs7OztVQ2hJdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ0c7QUFDckQ7QUFDQSxrRUFBTztBQUNQLDJEQUFpQixRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvZm9ybWF0LXRpbWUvbGliL2luZGV4LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1YkV2ZW50cy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy9UT0RPOiBhZGQgYWJpbGl0eSB0byBkZXRlY3QgaDptIChzaW5nbGUgZGlnaXQgZm9yIG1pbnV0ZSlcbiAgdmFyIHJlID0gL15cXHMqKFswLTldfFswLTFdWzAtOV0/fDJbMC00XT8pKD89XFxzKlxcOj9cXHMqKFswLTVdWzAtOV0pP1xccypbXjAtOSxhLHBdKihbYSxwXSk/W14wLTksYSxwXSokKS9pO1xuXG4gIHZhciBnZXRGb3JtYXR0ZWRUaW1lID0gZnVuY3Rpb24odGltZVN0ciwgYW1wbVN3aXRjaCkge1xuXG4gICAgYW1wbVN3aXRjaCA9IGFtcG1Td2l0Y2ggPyBhbXBtU3dpdGNoIDogJzY6NTknOyBcblxuICAgIHZhciByID0gcmUuZXhlYyh0aW1lU3RyKTsgXG4gICAgdmFyIGhvdXIgPSByICYmIHJbMV0gPyBOdW1iZXIoclsxXSkgOiB1bmRlZmluZWQ7IFxuICAgIHZhciBtaW51dGVzID0gciAmJiByWzJdID8gclsyXSA6IDA7XG4gICAgbWludXRlcyA9IChtaW51dGVzICsgJzAnKS5zbGljZSgwLDIpOyBcbiAgICBtaW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpOyAgXG4gICAgbWludXRlcyA9IGlzTmFOKG1pbnV0ZXMpID8gMCA6IG1pbnV0ZXM7IFxuICAgIHZhciBhbXBtID0gciAmJiByWzNdID8gclszXSA6IHVuZGVmaW5lZDsgXG5cbiAgICB2YXIgbmV3VGltZTsgXG5cblxuICAgIC8vIGlmIG5vIGhvdXIsIHRoZW4gY2Fubm90IGRldGVybWluZSB0aW1lLiByZXR1cm4gdGltZVN0ciBhcyBwYXNzZWQgaW5cbiAgICBpZihob3VyID09PSB1bmRlZmluZWQgfHwgaXNOYU4oaG91cikgfHwgaG91ciA+IDI0IHx8IG1pbnV0ZXMgPiA1OSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXG4gICAgfVxuXG4gICAgLy8gaWYgaG91ciBpczogXG4gICAgLy8gMCBvciAyNDogaG91cj0xMiwgYW1wbT1BTSBpZiB1bmRlZmluZWRcbiAgICAvLyAxLTExIDogIGFtcG0gYmFzZWQgb24gYW1wbVN3aXRjaFxuICAgIC8vIDEyIDogICAgYW1wbSA9IHBtIGlmIHVuZGVmaW5lZCBcbiAgICAvLyAxMy0yMyA6IGFtcG0gPSBwbSBhbHdheXMgZXZlbiBpZiBhbXBtID0gYW1cblxuICAgIGlmKGhvdXIgPT09IDAgfHwgaG91ciA9PT0gMjQpIHtcbiAgICAgIGhvdXIgPSAxMjsgXG4gICAgICBpZighYW1wbSkge1xuICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDAgJiYgaG91ciA8IDEyKSB7XG4gICAgICBpZiAoIWFtcG0pIHtcbiAgICAgICAgdmFyIHN3ID0gcmUuZXhlYyhhbXBtU3dpdGNoKTtcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hIb3VyID0gc3cgJiYgc3dbMV0gPyBzd1sxXSA6IHVuZGVmaW5lZDsgXG4gICAgICAgIHZhciBhbXBtU3dpdGNoTWludXRlID0gc3cgJiYgc3dbMl0gPyBzd1syXSA6IHVuZGVmaW5lZDsgXG5cbiAgICAgICAgaWYoaG91ciA+IGFtcG1Td2l0Y2hIb3VyIHx8IFxuICAgICAgICAgIChob3VyID09PSBhbXBtU3dpdGNoSG91ciAmJiBtaW51dGUgPiBhbXBtU3dpdGNoTWludXRlKSkge1xuICAgICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID09PTEyKSB7XG4gICAgICBhbXBtID0gIWFtcG0gPyAnUE0nIDogYW1wbTsgXG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDEyKSB7XG4gICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICBob3VyID0gaG91ciAtIDEyIDsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ0EnIHx8IGFtcG0gPT09ICdhJyA/ICdBTScgOiBhbXBtO1xuICAgICAgYW1wbSA9IGFtcG0gPT09ICdQJyB8fCBhbXBtID09PSAncCcgPyAnUE0nIDogYW1wbTtcbiAgICB9XG5cbiAgICBtaW51dGVzID0gKCcwJyArIG1pbnV0ZXMpLnNsaWNlKC0yKTsgXG5cbiAgICBuZXdUaW1lID0gaG91ciArICc6JyArIG1pbnV0ZXMgKyAnICcgKyBhbXBtO1xuXG4gICAgcmV0dXJuIG5ld1RpbWU7ICBcblxuICB9O1xuXG5cbiAgdmFyIGZvcm1hdFRpbWUgPSB7XG4gICAgcmU6IHJlLCBcbiAgICBnZXRGb3JtYXR0ZWRUaW1lOiBnZXRGb3JtYXR0ZWRUaW1lXG4gIH07IFxuICB2YXIgcm9vdCA9IHRoaXM7IFxuICAvLyB0aGFua3MgYXN5bmM6IFxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRUaW1lO1xuICAgIH1cbiAgICBleHBvcnRzLmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH1cblxufSkoKTtcblxuIiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuXHJcbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIF9yZW5kZXJEYXRhKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5zZWFyY2hGYWlsZWQsIF9yZW1vdmVsb2FkaW5nU2NyZWVuKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5hcmVhc0xpc3RSZWNpZXZlZCwgX3VwZGF0ZUFyZWFzTGlzdCk7XHJcblxyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gtYm94J11cIiksXHJcbiAgICBzZWFyY2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoJ11cIiksXHJcbiAgICBhcmVhc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nYXJlYXMtbGlzdCddXCIpLFxyXG4gICAgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5J11cIiksXHJcbiAgICBjb3VudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NvdW50cnknXVwiKSxcclxuICAgIHRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGltZSddXCIpLFxyXG4gICAgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdkYXRlJ11cIiksXHJcbiAgICB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RlbXAnXVwiKSxcclxuICAgIGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1pY29uJ11cIiksXHJcbiAgICBjb25kaXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1jb25kaXRpb24nXVwiKSxcclxuICAgIHVuaXRzU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3VuaXRzLXN3aXRjaCddXCIpLFxyXG4gICAgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3aW5kJ11cIiksXHJcbiAgICBwcmVzc3VyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdwcmVzc3VyZSddXCIpLFxyXG4gICAgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0naHVtaWRpdHknXVwiKSxcclxuICAgIHZpc2liaWxpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndmlzaWJpbGl0eSddXCIpLFxyXG4gICAgdXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndXYnXVwiKSxcclxuICAgIGd1c3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZ3VzdCddXCIpLFxyXG4gICAgbG9hZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdsb2FkaW5nJ11cIiksXHJcbiAgICBtc2dCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbXNnLWJveCddXCIpLFxyXG4gICAgbXNnVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdtc2ctdGV4dCddXCIpLFxyXG4gICAgY2FuY2VsTXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NhbmNlbC1tc2cnXVwiKSxcclxuICAgIGRheXNDb250ciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdkYXlzLWNvbnRyJ11cIik7XHJcblxyXG4gIGxldCB1c2VyQ2hvaWNlSW1wZXJpYWwgPSBmYWxzZSwgY2FjaGVkRGF0YTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9hZGRFdmVudHMoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hZGRFdmVudHMoKSB7XHJcbiAgICBzZWFyY2hCb3guYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9jaGVja0lucHV0KTtcclxuICAgIHNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QWRkcmVzcyk7XHJcbiAgICB1bml0c1N3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3N3aXRjaFVuaXRzKTtcclxuICAgIGNhbmNlbE1zZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3JlbW92ZU1zZyk7XHJcbiAgICBhcmVhc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFyZWFDb29yZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2hlY2tJbnB1dChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID49IDMpIHtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFJbnB1dGVkLCBlLnRhcmdldC52YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfcmVtb3ZlQXJlYXNMaXN0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF91cGRhdGVBcmVhc0xpc3QobGlzdCkge1xyXG4gICAgYXJlYXNMaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiLCBgJHtsaXN0W2ldLmxhdH0sICR7bGlzdFtpXS5sb259YCk7XHJcbiAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTkuNSwzQTYuNSw2LjUgMCAwLDEgMTYsOS41QzE2LDExLjExIDE1LjQxLDEyLjU5IDE0LjQ0LDEzLjczTDE0LjcxLDE0SDE1LjVMMjAuNSwxOUwxOSwyMC41TDE0LDE1LjVWMTQuNzFMMTMuNzMsMTQuNDRDMTIuNTksMTUuNDEgMTEuMTEsMTYgOS41LDE2QTYuNSw2LjUgMCAwLDEgMyw5LjVBNi41LDYuNSAwIDAsMSA5LjUsM005LjUsNUM3LDUgNSw3IDUsOS41QzUsMTIgNywxNCA5LjUsMTRDMTIsMTQgMTQsMTIgMTQsOS41QzE0LDcgMTIsNSA5LjUsNVpcIiAvPjwvc3ZnPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYXJlYS1uYW1lXCI+JHtsaXN0W2ldLmRpc3BsYXlfbmFtZX08L3NwYW4+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7bGlzdFtpXS5jbGFzc308L3NwYW4+PHNwYW4+Lzwvc3Bhbj48c3Bhbj4ke2xpc3RbaV0udHlwZX08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgICAgYXJlYXNMaXN0LmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kaXNwbGF5QXJlYXNMaXN0KCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcXVlcnlBZGRyZXNzKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gZS50YXJnZXQuZm9ybTtcclxuICAgIGNvbnN0IGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKG5ldyBGb3JtRGF0YShmb3JtKSk7XHJcblxyXG4gICAgaWYgKGRhdGEucSkgX3NlYXJjaERhdGEoZGF0YS5xKTtcclxuICAgIGlucHV0LnZhbHVlID0gbnVsbDtcclxuICAgIGlucHV0LmJsdXIoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QXJlYUNvb3JkKGUpIHtcclxuICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSB7XHJcbiAgICAgIGxldCBlbGVtID0gZS50YXJnZXQ7XHJcbiAgICAgIHdoaWxlICghZWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIpKSBlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICBfc2VhcmNoRGF0YShlbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtY29vcmRcIikpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBfc2VhcmNoRGF0YShhZGRyKSB7XHJcbiAgICBfZGlzcGxheUxvYWRpbmdTY3JlZW4oKTtcclxuICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhU2VhcmNoZWQsIGFkZHIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3dpdGNoVW5pdHMoKSB7XHJcbiAgICBpZiAoY2FjaGVkRGF0YSkge1xyXG4gICAgICB1c2VyQ2hvaWNlSW1wZXJpYWwgPSAhdXNlckNob2ljZUltcGVyaWFsO1xyXG4gICAgICBfcmVuZGVyRGF0YShjYWNoZWREYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZW5kZXJEYXRhKGRhdGEsIGlzSW1wZXJpYWwgPSB1c2VyQ2hvaWNlSW1wZXJpYWwpIHtcclxuICAgIF9yZW5kZXJDdXJyZW50RGF0YShkYXRhLCBpc0ltcGVyaWFsKTtcclxuICAgIF9yZW5kZXJGb3JlY2FzdERhdGEoZGF0YS5kYXlzRm9yZWNhc3QsIGlzSW1wZXJpYWwpO1xyXG4gICAgX3JlbW92ZWxvYWRpbmdTY3JlZW4oKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckN1cnJlbnREYXRhKGRhdGEsIGlzSW1wZXJpYWwpIHtcclxuICAgIGNhY2hlZERhdGEgPSBkYXRhO1xyXG5cclxuICAgIGNpdHkudGV4dENvbnRlbnQgPSBkYXRhLmNpdHk7XHJcbiAgICBjb3VudHJ5LnRleHRDb250ZW50ID0gZGF0YS5jb3VudHJ5O1xyXG4gICAgdGltZS50ZXh0Q29udGVudCA9IGRhdGEudGltZTtcclxuICAgIGRhdGUudGV4dENvbnRlbnQgPSBkYXRhLmRhdGU7XHJcbiAgICBpY29uLnNyYyA9IGRhdGEuaWNvbjtcclxuICAgIGNvbmRpdGlvbi50ZXh0Q29udGVudCA9IGRhdGEuY29uZGl0aW9uVGV4dDtcclxuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gZGF0YS5odW1pZGl0eTtcclxuICAgIHV2LnRleHRDb250ZW50ID0gZGF0YS51djtcclxuXHJcbiAgICAvLyBJbXBlcmlhbCBmaWVsZHNcclxuICAgIGlmIChpc0ltcGVyaWFsKSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsVGVtcDtcclxuICAgICAgd2luZC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxXaW5kO1xyXG4gICAgICBwcmVzc3VyZS50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxWaXNpYmlsaXR5O1xyXG4gICAgICBndXN0LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbEd1c3Q7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZW1wLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNXaW5kO1xyXG4gICAgICBwcmVzc3VyZS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljUHJlc3N1cmU7XHJcbiAgICAgIHZpc2liaWxpdHkudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1Zpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY0d1c3Q7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW5kZXJGb3JlY2FzdERhdGEoZm9yZWNhc3QsIGlzSW1wZXJpYWwpIHtcclxuICAgIGRheXNDb250ci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgZm9yZWNhc3QuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIG5vZGUuY2xhc3NOYW1lID0gXCJkYXlzIHJvdW5kZWQtYm9yZGVyXCI7XHJcblxyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8aW1nIHNyYz1cIiR7ZGF0YS5pY29ufVwiIGFsdD1cIndlYXRoZXItaWNvblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXktZGF0ZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXktdGVtcFwiPjwvZGl2PmA7XHJcbiAgICAgIG5vZGUucXVlcnlTZWxlY3RvcihcIi5kYXktZGF0ZVwiKS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiLmRheS10ZW1wXCIpLnRleHRDb250ZW50ID0gaXNJbXBlcmlhbFxyXG4gICAgICAgID8gZGF0YS5pbXBlcmlhbFRlbXBcclxuICAgICAgICA6IGRhdGEubWV0cmljVGVtcDtcclxuXHJcbiAgICAgIGRheXNDb250ci5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZGlzcGxheUxvYWRpbmdTY3JlZW4oKSB7XHJcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVsb2FkaW5nU2NyZWVuKG1zZykge1xyXG4gICAgaWYgKG1zZykgX2Rpc3BsYXlNc2cobXNnKTtcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgIF9yZW1vdmVBcmVhc0xpc3QoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlNc2cobXNnKSB7XHJcbiAgICBtc2dUZXh0LnRleHRDb250ZW50ID0gbXNnO1xyXG4gICAgbXNnQm94LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICBzZXRUaW1lb3V0KF9yZW1vdmVNc2csIDgwMDApO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlTXNnKCkge1xyXG4gICAgbXNnQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5QXJlYXNMaXN0KCkge1xyXG4gICAgYXJlYXNMaXN0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVBcmVhc0xpc3QoKSB7XHJcbiAgICBhcmVhc0xpc3QuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyO1xyXG4iLCJjb25zdCBwdWJTdWIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGV2ZW50cyA9IHt9O1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBldmVudHNbZXZlbnRdID8gZXZlbnRzW2V2ZW50XS5wdXNoKGZuKSA6IChldmVudHNbZXZlbnRdID0gW2ZuXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1blN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICBldmVudHNbZXZlbnRdID0gZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGZ1bmMpID0+IGZ1bmMgIT09IGZuKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgZGF0YSkge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkgZXZlbnRzW2V2ZW50XS5mb3JFYWNoKChmbikgPT4gZm4oZGF0YSkpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1blN1YnNjcmliZSwgcHVibGlzaCB9O1xyXG4gIH0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwdWJTdWI7IiwiY29uc3QgZXZlbnRzID0ge1xyXG4gICAgZGF0YVJlY2lldmVkOiBcImRhdGFSZWNpZXZlZFwiLFxyXG4gICAgZGF0YVNlYXJjaGVkOiBcImRhdGFTZWFyY2hlZFwiLFxyXG4gICAgc2VhcmNoRmFpbGVkOiBcInNlYXJjaEZhaWxlZFwiLFxyXG4gICAgZGF0YUlucHV0ZWQ6IFwiZGF0YUlucHV0ZWRcIixcclxuICAgIGFyZWFzTGlzdFJlY2lldmVkOiBcImFyZWFzTGlzdFJlY2lldmVkXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50czsiLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCB3ZWF0aGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhU2VhcmNoZWQsIF9zZWFyY2hEYXRhKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhSW5wdXRlZCwgX2dldEFyZWFzTGlzdCk7XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfZ2V0VXNlckNvb3JkKClcclxuICAgICAgLnRoZW4oKGlwRGF0YSkgPT4gX3NlYXJjaERhdGEoYCR7aXBEYXRhLmxhdH0sJHtpcERhdGEubG9ufWApKVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgX3NlYXJjaERhdGEoXCJUZXhhc1wiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2VhcmNoRGF0YShxdWVyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9nZXRQYXJzZWREYXRhKHF1ZXJ5KTtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFSZWNpZXZlZCwgZGF0YSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coYHdlYXRoZXJIYW5kbGVyOiAke2Vycn1gKTtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLnNlYXJjaEZhaWxlZCwgZXJyKTtcclxuICAgIH1cclxuICB9XHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEFyZWFzTGlzdChpbnB1dCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vc2VhcmNoP3E9JHtpbnB1dH1gLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5hcmVhc0xpc3RSZWNpZXZlZCwgZGF0YSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0QXJlYXNMaXN0OiBGYWlsZWQhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0VXNlckNvb3JkKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9pcC1hcGkuY29tL2pzb24vXCIsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkZhaWxlZCB0byBnZXQgdXNlciBJUCBjb29yZGluYXRlc1wiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PWM1MmVhZWNhZmU2MjRhYjY5MDgyMDI3NDkyMzIxMDgmZGF5cz0zJnE9JHtsb2NhdGlvbn1gO1xyXG4gICAgbGV0IHJlc3VsdCwgZGF0YTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuc3RhdHVzKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFBhcnNlZERhdGEobG9jYXRpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbik7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRhID0gcmVzdWx0LmN1cnJlbnQsXHJcbiAgICAgICAgbG9jYXRpb25EYXRhID0gcmVzdWx0LmxvY2F0aW9uLFxyXG4gICAgICAgIGZvcmVjYXN0ID0gcmVzdWx0LmZvcmVjYXN0LmZvcmVjYXN0ZGF5LFxyXG4gICAgICAgIGVtcHR5Q29udGVudCA9IFwiXyBfIF8gXCI7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNpdHk6IGxvY2F0aW9uRGF0YS5uYW1lIHx8IGVtcHR5Q29udGVudCxcclxuICAgICAgICBjb3VudHJ5OiBgJHtsb2NhdGlvbkRhdGEucmVnaW9uIHx8IGVtcHR5Q29udGVudH0sICR7XHJcbiAgICAgICAgICBsb2NhdGlvbkRhdGEuY291bnRyeSB8fCBlbXB0eUNvbnRlbnRcclxuICAgICAgICB9YCxcclxuICAgICAgICB0aW1lOiBmdC5nZXRGb3JtYXR0ZWRUaW1lKGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzFdKSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShsb2NhdGlvbkRhdGEubG9jYWx0aW1lLnNwbGl0KFwiIFwiKVswXSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgbWV0cmljVGVtcDogYCR7Y3VycmVudERhdGEudGVtcF9jfSDCsENgLFxyXG4gICAgICAgIGltcGVyaWFsVGVtcDogYCR7Y3VycmVudERhdGEudGVtcF9mfSDCsEZgLFxyXG4gICAgICAgIGljb246IGN1cnJlbnREYXRhLmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgIGNvbmRpdGlvblRleHQ6IGN1cnJlbnREYXRhLmNvbmRpdGlvbi50ZXh0LFxyXG4gICAgICAgIG1ldHJpY1dpbmQ6IGAke2N1cnJlbnREYXRhLndpbmRfa3BofSBrbS9oLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbWlsZXMvaCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIG1ldHJpY1ByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9tYn0gbWJgLFxyXG4gICAgICAgIGltcGVyaWFsUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX2lufSBpbmAsXHJcbiAgICAgICAgaHVtaWRpdHk6IGN1cnJlbnREYXRhLmh1bWlkaXR5LFxyXG4gICAgICAgIG1ldHJpY1Zpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19rbX0ga21gLFxyXG4gICAgICAgIGltcGVyaWFsVmlzaWJpbGl0eTogYCR7XHJcbiAgICAgICAgICBwYXJzZUludChjdXJyZW50RGF0YS52aXNfbWlsZXMpID09PSAxXHJcbiAgICAgICAgICAgID8gYCR7Y3VycmVudERhdGEudmlzX21pbGVzfSBtaWxlYFxyXG4gICAgICAgICAgICA6IGAke2N1cnJlbnREYXRhLnZpc19taWxlc30gbWlsZXNgXHJcbiAgICAgICAgfWAsXHJcbiAgICAgICAgdXY6IGN1cnJlbnREYXRhLnV2LFxyXG4gICAgICAgIG1ldHJpY0d1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3Rfa3BofSBrbS9oYCxcclxuICAgICAgICBpbXBlcmlhbEd1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3RfbXBofSBtaWxlcy9oYCxcclxuICAgICAgICBkYXlzRm9yZWNhc3Q6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMF0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzBdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMF0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMF0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMV0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzFdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMV0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMV0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZm9yZWNhc3RbMl0uZGF0ZSkudG9EYXRlU3RyaW5nKCksXHJcbiAgICAgICAgICAgIG1ldHJpY1RlbXA6IGAke2ZvcmVjYXN0WzJdLmRheS5hdmd0ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgICAgIGltcGVyaWFsVGVtcDogYCR7Zm9yZWNhc3RbMl0uZGF5LmF2Z3RlbXBfZn0gwrBGYCxcclxuICAgICAgICAgICAgaWNvbjogZm9yZWNhc3RbMl0uZGF5LmNvbmRpdGlvbi5pY29uLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9O1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkNvdWxkIG5vdCBsb2FkIGRhdGEhXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanNcIjtcclxuaW1wb3J0IGRpc3BsYXlDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS5qc1wiO1xyXG5cclxud2VhdGhlci5pbml0KCk7XHJcbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=