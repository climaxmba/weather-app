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
    cancelMsg = document.querySelector("[data-js-name='cancel-msg']");

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

    _removeloadingScreen();
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
    const url = `https://api.weatherapi.com/v1/current.json?key=c52eaecafe624ab6908202749232108&q=${location}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQy9DO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7QUFDRDtBQUNBLGlFQUFlLE9BQU8sRUFBQzs7Ozs7OztVQzNHdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ0c7QUFDckQ7QUFDQSxrRUFBTztBQUNQLDJEQUFpQixRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvZm9ybWF0LXRpbWUvbGliL2luZGV4LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1YkV2ZW50cy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy9UT0RPOiBhZGQgYWJpbGl0eSB0byBkZXRlY3QgaDptIChzaW5nbGUgZGlnaXQgZm9yIG1pbnV0ZSlcbiAgdmFyIHJlID0gL15cXHMqKFswLTldfFswLTFdWzAtOV0/fDJbMC00XT8pKD89XFxzKlxcOj9cXHMqKFswLTVdWzAtOV0pP1xccypbXjAtOSxhLHBdKihbYSxwXSk/W14wLTksYSxwXSokKS9pO1xuXG4gIHZhciBnZXRGb3JtYXR0ZWRUaW1lID0gZnVuY3Rpb24odGltZVN0ciwgYW1wbVN3aXRjaCkge1xuXG4gICAgYW1wbVN3aXRjaCA9IGFtcG1Td2l0Y2ggPyBhbXBtU3dpdGNoIDogJzY6NTknOyBcblxuICAgIHZhciByID0gcmUuZXhlYyh0aW1lU3RyKTsgXG4gICAgdmFyIGhvdXIgPSByICYmIHJbMV0gPyBOdW1iZXIoclsxXSkgOiB1bmRlZmluZWQ7IFxuICAgIHZhciBtaW51dGVzID0gciAmJiByWzJdID8gclsyXSA6IDA7XG4gICAgbWludXRlcyA9IChtaW51dGVzICsgJzAnKS5zbGljZSgwLDIpOyBcbiAgICBtaW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpOyAgXG4gICAgbWludXRlcyA9IGlzTmFOKG1pbnV0ZXMpID8gMCA6IG1pbnV0ZXM7IFxuICAgIHZhciBhbXBtID0gciAmJiByWzNdID8gclszXSA6IHVuZGVmaW5lZDsgXG5cbiAgICB2YXIgbmV3VGltZTsgXG5cblxuICAgIC8vIGlmIG5vIGhvdXIsIHRoZW4gY2Fubm90IGRldGVybWluZSB0aW1lLiByZXR1cm4gdGltZVN0ciBhcyBwYXNzZWQgaW5cbiAgICBpZihob3VyID09PSB1bmRlZmluZWQgfHwgaXNOYU4oaG91cikgfHwgaG91ciA+IDI0IHx8IG1pbnV0ZXMgPiA1OSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXG4gICAgfVxuXG4gICAgLy8gaWYgaG91ciBpczogXG4gICAgLy8gMCBvciAyNDogaG91cj0xMiwgYW1wbT1BTSBpZiB1bmRlZmluZWRcbiAgICAvLyAxLTExIDogIGFtcG0gYmFzZWQgb24gYW1wbVN3aXRjaFxuICAgIC8vIDEyIDogICAgYW1wbSA9IHBtIGlmIHVuZGVmaW5lZCBcbiAgICAvLyAxMy0yMyA6IGFtcG0gPSBwbSBhbHdheXMgZXZlbiBpZiBhbXBtID0gYW1cblxuICAgIGlmKGhvdXIgPT09IDAgfHwgaG91ciA9PT0gMjQpIHtcbiAgICAgIGhvdXIgPSAxMjsgXG4gICAgICBpZighYW1wbSkge1xuICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDAgJiYgaG91ciA8IDEyKSB7XG4gICAgICBpZiAoIWFtcG0pIHtcbiAgICAgICAgdmFyIHN3ID0gcmUuZXhlYyhhbXBtU3dpdGNoKTtcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hIb3VyID0gc3cgJiYgc3dbMV0gPyBzd1sxXSA6IHVuZGVmaW5lZDsgXG4gICAgICAgIHZhciBhbXBtU3dpdGNoTWludXRlID0gc3cgJiYgc3dbMl0gPyBzd1syXSA6IHVuZGVmaW5lZDsgXG5cbiAgICAgICAgaWYoaG91ciA+IGFtcG1Td2l0Y2hIb3VyIHx8IFxuICAgICAgICAgIChob3VyID09PSBhbXBtU3dpdGNoSG91ciAmJiBtaW51dGUgPiBhbXBtU3dpdGNoTWludXRlKSkge1xuICAgICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID09PTEyKSB7XG4gICAgICBhbXBtID0gIWFtcG0gPyAnUE0nIDogYW1wbTsgXG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDEyKSB7XG4gICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICBob3VyID0gaG91ciAtIDEyIDsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ0EnIHx8IGFtcG0gPT09ICdhJyA/ICdBTScgOiBhbXBtO1xuICAgICAgYW1wbSA9IGFtcG0gPT09ICdQJyB8fCBhbXBtID09PSAncCcgPyAnUE0nIDogYW1wbTtcbiAgICB9XG5cbiAgICBtaW51dGVzID0gKCcwJyArIG1pbnV0ZXMpLnNsaWNlKC0yKTsgXG5cbiAgICBuZXdUaW1lID0gaG91ciArICc6JyArIG1pbnV0ZXMgKyAnICcgKyBhbXBtO1xuXG4gICAgcmV0dXJuIG5ld1RpbWU7ICBcblxuICB9O1xuXG5cbiAgdmFyIGZvcm1hdFRpbWUgPSB7XG4gICAgcmU6IHJlLCBcbiAgICBnZXRGb3JtYXR0ZWRUaW1lOiBnZXRGb3JtYXR0ZWRUaW1lXG4gIH07IFxuICB2YXIgcm9vdCA9IHRoaXM7IFxuICAvLyB0aGFua3MgYXN5bmM6IFxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRUaW1lO1xuICAgIH1cbiAgICBleHBvcnRzLmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH1cblxufSkoKTtcblxuIiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuXHJcbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIF9yZW5kZXJEYXRhKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5zZWFyY2hGYWlsZWQsIF9yZW1vdmVsb2FkaW5nU2NyZWVuKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5hcmVhc0xpc3RSZWNpZXZlZCwgX3VwZGF0ZUFyZWFzTGlzdCk7XHJcblxyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gtYm94J11cIiksXHJcbiAgICBzZWFyY2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoJ11cIiksXHJcbiAgICBhcmVhc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nYXJlYXMtbGlzdCddXCIpLFxyXG4gICAgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5J11cIiksXHJcbiAgICBjb3VudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NvdW50cnknXVwiKSxcclxuICAgIHRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGltZSddXCIpLFxyXG4gICAgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdkYXRlJ11cIiksXHJcbiAgICB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RlbXAnXVwiKSxcclxuICAgIGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1pY29uJ11cIiksXHJcbiAgICBjb25kaXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1jb25kaXRpb24nXVwiKSxcclxuICAgIHVuaXRzU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3VuaXRzLXN3aXRjaCddXCIpLFxyXG4gICAgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3aW5kJ11cIiksXHJcbiAgICBwcmVzc3VyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdwcmVzc3VyZSddXCIpLFxyXG4gICAgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0naHVtaWRpdHknXVwiKSxcclxuICAgIHZpc2liaWxpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndmlzaWJpbGl0eSddXCIpLFxyXG4gICAgdXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndXYnXVwiKSxcclxuICAgIGd1c3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZ3VzdCddXCIpLFxyXG4gICAgbG9hZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdsb2FkaW5nJ11cIiksXHJcbiAgICBtc2dCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbXNnLWJveCddXCIpLFxyXG4gICAgbXNnVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdtc2ctdGV4dCddXCIpLFxyXG4gICAgY2FuY2VsTXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NhbmNlbC1tc2cnXVwiKTtcclxuXHJcbiAgbGV0IHVzZXJDaG9pY2VJbXBlcmlhbCA9IGZhbHNlLCBjYWNoZWREYXRhO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2FkZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZEV2ZW50cygpIHtcclxuICAgIHNlYXJjaEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX2NoZWNrSW5wdXQpO1xyXG4gICAgc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfcXVlcnlBZGRyZXNzKTtcclxuICAgIHVuaXRzU3dpdGNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfc3dpdGNoVW5pdHMpO1xyXG4gICAgY2FuY2VsTXNnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfcmVtb3ZlTXNnKTtcclxuICAgIGFyZWFzTGlzdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QXJlYUNvb3JkKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jaGVja0lucHV0KGUpIHtcclxuICAgIGlmIChlLnRhcmdldC52YWx1ZS5sZW5ndGggPj0gMykge1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YUlucHV0ZWQsIGUudGFyZ2V0LnZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9yZW1vdmVBcmVhc0xpc3QoKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3VwZGF0ZUFyZWFzTGlzdChsaXN0KSB7XHJcbiAgICBhcmVhc0xpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIsIGAke2xpc3RbaV0ubGF0fSwgJHtsaXN0W2ldLmxvbn1gKTtcclxuICAgICAgbm9kZS5pbm5lckhUTUwgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNOS41LDNBNi41LDYuNSAwIDAsMSAxNiw5LjVDMTYsMTEuMTEgMTUuNDEsMTIuNTkgMTQuNDQsMTMuNzNMMTQuNzEsMTRIMTUuNUwyMC41LDE5TDE5LDIwLjVMMTQsMTUuNVYxNC43MUwxMy43MywxNC40NEMxMi41OSwxNS40MSAxMS4xMSwxNiA5LjUsMTZBNi41LDYuNSAwIDAsMSAzLDkuNUE2LjUsNi41IDAgMCwxIDkuNSwzTTkuNSw1QzcsNSA1LDcgNSw5LjVDNSwxMiA3LDE0IDkuNSwxNEMxMiwxNCAxNCwxMiAxNCw5LjVDMTQsNyAxMiw1IDkuNSw1WlwiIC8+PC9zdmc+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhcmVhLW5hbWVcIj4ke2xpc3RbaV0uZGlzcGxheV9uYW1lfTwvc3Bhbj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtsaXN0W2ldLmNsYXNzfTwvc3Bhbj48c3Bhbj4vPC9zcGFuPjxzcGFuPiR7bGlzdFtpXS50eXBlfTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICBhcmVhc0xpc3QuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2Rpc3BsYXlBcmVhc0xpc3QoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFkZHJlc3MoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGZvcm0gPSBlLnRhcmdldC5mb3JtO1xyXG4gICAgY29uc3QgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXMobmV3IEZvcm1EYXRhKGZvcm0pKTtcclxuXHJcbiAgICBpZiAoZGF0YS5xKSBfc2VhcmNoRGF0YShkYXRhLnEpO1xyXG4gICAgaW5wdXQudmFsdWUgPSBudWxsO1xyXG4gICAgaW5wdXQuYmx1cigpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcXVlcnlBcmVhQ29vcmQoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgbGV0IGVsZW0gPSBlLnRhcmdldDtcclxuICAgICAgd2hpbGUgKCFlbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtY29vcmRcIikpIGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIF9zZWFyY2hEYXRhKGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hEYXRhKGFkZHIpIHtcclxuICAgIF9kaXNwbGF5TG9hZGluZ1NjcmVlbigpO1xyXG4gICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFTZWFyY2hlZCwgYWRkcilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zd2l0Y2hVbml0cygpIHtcclxuICAgIGlmIChjYWNoZWREYXRhKSB7XHJcbiAgICAgIHVzZXJDaG9pY2VJbXBlcmlhbCA9ICF1c2VyQ2hvaWNlSW1wZXJpYWw7XHJcbiAgICAgIF9yZW5kZXJEYXRhKGNhY2hlZERhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlbmRlckRhdGEoZGF0YSwgaXNJbXBlcmlhbCA9IHVzZXJDaG9pY2VJbXBlcmlhbCkge1xyXG4gICAgY2FjaGVkRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgY2l0eS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcclxuICAgIGNvdW50cnkudGV4dENvbnRlbnQgPSBkYXRhLmNvdW50cnk7XHJcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xyXG4gICAgZGF0ZS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgIGljb24uc3JjID0gZGF0YS5pY29uO1xyXG4gICAgY29uZGl0aW9uLnRleHRDb250ZW50ID0gZGF0YS5jb25kaXRpb25UZXh0O1xyXG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xyXG4gICAgdXYudGV4dENvbnRlbnQgPSBkYXRhLnV2O1xyXG5cclxuICAgIC8vIEltcGVyaWFsIGZpZWxkc1xyXG4gICAgaWYgKGlzSW1wZXJpYWwpIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFdpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFZpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsR3VzdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljR3VzdDtcclxuICAgIH1cclxuXHJcbiAgICBfcmVtb3ZlbG9hZGluZ1NjcmVlbigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCkge1xyXG4gICAgbG9hZGluZy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlbG9hZGluZ1NjcmVlbihtc2cpIHtcclxuICAgIGlmIChtc2cpIF9kaXNwbGF5TXNnKG1zZyk7XHJcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICBfcmVtb3ZlQXJlYXNMaXN0KCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5TXNnKG1zZykge1xyXG4gICAgbXNnVGV4dC50ZXh0Q29udGVudCA9IG1zZztcclxuICAgIG1zZ0JveC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgc2V0VGltZW91dChfcmVtb3ZlTXNnLCA4MDAwKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZU1zZygpIHtcclxuICAgIG1zZ0JveC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZGlzcGxheUFyZWFzTGlzdCgpIHtcclxuICAgIGFyZWFzTGlzdC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlQXJlYXNMaXN0KCkge1xyXG4gICAgYXJlYXNMaXN0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBpbml0IH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5Q29udHJvbGxlcjtcclxuIiwiY29uc3QgcHViU3ViID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBldmVudHMgPSB7fTtcclxuICBcclxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgZXZlbnRzW2V2ZW50XSA/IGV2ZW50c1tldmVudF0ucHVzaChmbikgOiAoZXZlbnRzW2V2ZW50XSA9IFtmbl0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdW5TdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2V2ZW50XSA9IGV2ZW50c1tldmVudF0uZmlsdGVyKChmdW5jKSA9PiBmdW5jICE9PSBmbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQsIGRhdGEpIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIGV2ZW50c1tldmVudF0uZm9yRWFjaCgoZm4pID0+IGZuKGRhdGEpKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiB7IHN1YnNjcmliZSwgdW5TdWJzY3JpYmUsIHB1Ymxpc2ggfTtcclxuICB9KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsImNvbnN0IGV2ZW50cyA9IHtcclxuICAgIGRhdGFSZWNpZXZlZDogXCJkYXRhUmVjaWV2ZWRcIixcclxuICAgIGRhdGFTZWFyY2hlZDogXCJkYXRhU2VhcmNoZWRcIixcclxuICAgIHNlYXJjaEZhaWxlZDogXCJzZWFyY2hGYWlsZWRcIixcclxuICAgIGRhdGFJbnB1dGVkOiBcImRhdGFJbnB1dGVkXCIsXHJcbiAgICBhcmVhc0xpc3RSZWNpZXZlZDogXCJhcmVhc0xpc3RSZWNpZXZlZFwiLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBldmVudHM7IiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuaW1wb3J0IGZ0IGZyb20gXCJmb3JtYXQtdGltZVwiO1xyXG5cclxuY29uc3Qgd2VhdGhlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVNlYXJjaGVkLCBfc2VhcmNoRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YUlucHV0ZWQsIF9nZXRBcmVhc0xpc3QpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2dldFVzZXJDb29yZCgpXHJcbiAgICAgIC50aGVuKChpcERhdGEpID0+IF9zZWFyY2hEYXRhKGAke2lwRGF0YS5sYXR9LCR7aXBEYXRhLmxvbn1gKSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIF9zZWFyY2hEYXRhKFwiVGV4YXNcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NlYXJjaERhdGEocXVlcnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfZ2V0UGFyc2VkRGF0YShxdWVyeSk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGB3ZWF0aGVySGFuZGxlcjogJHtlcnJ9YCk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5zZWFyY2hGYWlsZWQsIGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRBcmVhc0xpc3QoaW5wdXQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPSR7aW5wdXR9YCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBwdWJTdWIucHVibGlzaChldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldEFyZWFzTGlzdDogRmFpbGVkIVwiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFVzZXJDb29yZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vaXAtYXBpLmNvbS9qc29uL1wiLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGYWlsZWQgdG8gZ2V0IHVzZXIgSVAgY29vcmRpbmF0ZXNcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0Q3VycmVudERhdGEobG9jYXRpb24pIHtcclxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9jdXJyZW50Lmpzb24/a2V5PWM1MmVhZWNhZmU2MjRhYjY5MDgyMDI3NDkyMzIxMDgmcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSByZXN1bHQuY3VycmVudCxcclxuICAgICAgICBsb2NhdGlvbkRhdGEgPSByZXN1bHQubG9jYXRpb24sXHJcbiAgICAgICAgZW1wdHlDb250ZW50ID0gXCJfIF8gXyBcIjtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2l0eTogbG9jYXRpb25EYXRhLm5hbWUgfHwgZW1wdHlDb250ZW50LFxyXG4gICAgICAgIGNvdW50cnk6IGAke2xvY2F0aW9uRGF0YS5yZWdpb24gfHwgZW1wdHlDb250ZW50fSwgJHtcclxuICAgICAgICAgIGxvY2F0aW9uRGF0YS5jb3VudHJ5IHx8IGVtcHR5Q29udGVudFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHRpbWU6IGZ0LmdldEZvcm1hdHRlZFRpbWUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMV0pLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzBdKS50b0RhdGVTdHJpbmcoKSxcclxuICAgICAgICBtZXRyaWNUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2N9IMKwQ2AsXHJcbiAgICAgICAgaW1wZXJpYWxUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgaWNvbjogY3VycmVudERhdGEuY29uZGl0aW9uLmljb24sXHJcbiAgICAgICAgY29uZGl0aW9uVGV4dDogY3VycmVudERhdGEuY29uZGl0aW9uLnRleHQsXHJcbiAgICAgICAgbWV0cmljV2luZDogYCR7Y3VycmVudERhdGEud2luZF9rcGh9IGttL2gsICR7Y3VycmVudERhdGEud2luZF9kaXJ9YCxcclxuICAgICAgICBpbXBlcmlhbFdpbmQ6IGAke2N1cnJlbnREYXRhLndpbmRfbXBofSBtaWxlcy9oLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgbWV0cmljUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX21ifSBtYmAsXHJcbiAgICAgICAgaW1wZXJpYWxQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfaW59IGluYCxcclxuICAgICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgICAgbWV0cmljVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX2ttfSBrbWAsXHJcbiAgICAgICAgaW1wZXJpYWxWaXNpYmlsaXR5OiBgJHtcclxuICAgICAgICAgIHBhcnNlSW50KGN1cnJlbnREYXRhLnZpc19taWxlcykgPT09IDFcclxuICAgICAgICAgICAgPyBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVgXHJcbiAgICAgICAgICAgIDogYCR7Y3VycmVudERhdGEudmlzX21pbGVzfSBtaWxlc2BcclxuICAgICAgICB9YCxcclxuICAgICAgICB1djogY3VycmVudERhdGEudXYsXHJcbiAgICAgICAgbWV0cmljR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9rcGh9IGttL2hgLFxyXG4gICAgICAgIGltcGVyaWFsR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9tcGh9IG1pbGVzL2hgLFxyXG4gICAgICB9O1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkNvdWxkIG5vdCBsb2FkIGRhdGEhXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanNcIjtcclxuaW1wb3J0IGRpc3BsYXlDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS5qc1wiO1xyXG5cclxud2VhdGhlci5pbml0KCk7XHJcbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=