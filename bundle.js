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

  let userChoiceImperial = false, cachedData;

  function init() {
    _addEvents();
  }

  function _addEvents() {
    searchBox.addEventListener("input", _upDateAreasList);
    searchBtn.addEventListener("click", _queryAddress);
    unitsSwitch.addEventListener("click", _switchUnits);
  }

  function _upDateAreasList() {
    // Update areas list
  }
  function _queryAddress(e) {
    e.preventDefault();

    const form = e.target.form;
    const input = form.querySelector("input");
    const data = Object.fromEntries(new FormData(form));

    if (data.q) _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, data.q);
    input.value = null;
    input.blur();
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
    dataSearched: "dataSearched"
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

  async function init() {
    _getUserCoord()
      .then((ipData) => _searchData(`${ipData.latitude},${ipData.longitude}`))
      .catch((err) => {
        console.log(err);
        _searchData("Texas");
      });
  }

  async function _getUserCoord() {
    try {
      const response = await fetch("https://freeipapi.com/api/json");
      const data = await response.json();
      return data;
    } catch (err) {
      return Promise.reject("FAILED TO GET USER IP COORDINATES\n");
    }
  }

  async function _getCurrentData(location) {
    const key = "c52eaecafe624ab6908202749232108";
    // Geocode https://geocode.maps.co/search?q=
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`;
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
        date: new Date(
          locationData.localtime.split(" ")[0]
        ).toLocaleDateString(),
        metricTemp: `${currentData.temp_c} ℃`,
        imperialTemp: `${currentData.temp_f} ℉`,
        icon: currentData.condition.icon,
        conditionText: currentData.condition.text,
        metricWind: `${currentData.wind_kph} kph, ${currentData.wind_dir}`,
        imperialWind: `${currentData.wind_mph} mph, ${currentData.wind_dir}`,
        metricPressure: `${currentData.pressure_mb} mb`,
        imperialPressure: `${currentData.pressure_in} in`,
        humidity: currentData.humidity,
        metricVisibility: `${currentData.vis_km} km`,
        imperialVisibility: `${currentData.vis_miles} miles`,
        uv: currentData.uv,
        metricGust: `${currentData.gust_kph} kph`,
        imperialGust: `${currentData.gust_mph} mph`,
      };
    } catch {
      return Promise.reject("FAILED TO PARSE DATA\n");
    }
  }

  async function _searchData(query) {
    try {
      const data = await _getParsedData(query);
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataRecieved, data);
    } catch (err) {
      console.log(err);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXlCO0FBQ3BELDZCQUE2Qix5QkFBeUI7QUFDdEQ7QUFDQSw2QkFBNkIsb0JBQW9CO0FBQ2pELCtCQUErQix1QkFBdUI7QUFDdEQ7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDLHlCQUF5QixzQkFBc0I7QUFDL0M7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGtEQUFNLFNBQVMsd0RBQU07QUFDM0IsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7QUFDRDtBQUNBLGlFQUFlLE9BQU8sRUFBQzs7Ozs7OztVQzVGdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ0c7QUFDckQ7QUFDQSxrRUFBTztBQUNQLDJEQUFpQixRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvZm9ybWF0LXRpbWUvbGliL2luZGV4LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1YkV2ZW50cy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy9UT0RPOiBhZGQgYWJpbGl0eSB0byBkZXRlY3QgaDptIChzaW5nbGUgZGlnaXQgZm9yIG1pbnV0ZSlcbiAgdmFyIHJlID0gL15cXHMqKFswLTldfFswLTFdWzAtOV0/fDJbMC00XT8pKD89XFxzKlxcOj9cXHMqKFswLTVdWzAtOV0pP1xccypbXjAtOSxhLHBdKihbYSxwXSk/W14wLTksYSxwXSokKS9pO1xuXG4gIHZhciBnZXRGb3JtYXR0ZWRUaW1lID0gZnVuY3Rpb24odGltZVN0ciwgYW1wbVN3aXRjaCkge1xuXG4gICAgYW1wbVN3aXRjaCA9IGFtcG1Td2l0Y2ggPyBhbXBtU3dpdGNoIDogJzY6NTknOyBcblxuICAgIHZhciByID0gcmUuZXhlYyh0aW1lU3RyKTsgXG4gICAgdmFyIGhvdXIgPSByICYmIHJbMV0gPyBOdW1iZXIoclsxXSkgOiB1bmRlZmluZWQ7IFxuICAgIHZhciBtaW51dGVzID0gciAmJiByWzJdID8gclsyXSA6IDA7XG4gICAgbWludXRlcyA9IChtaW51dGVzICsgJzAnKS5zbGljZSgwLDIpOyBcbiAgICBtaW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpOyAgXG4gICAgbWludXRlcyA9IGlzTmFOKG1pbnV0ZXMpID8gMCA6IG1pbnV0ZXM7IFxuICAgIHZhciBhbXBtID0gciAmJiByWzNdID8gclszXSA6IHVuZGVmaW5lZDsgXG5cbiAgICB2YXIgbmV3VGltZTsgXG5cblxuICAgIC8vIGlmIG5vIGhvdXIsIHRoZW4gY2Fubm90IGRldGVybWluZSB0aW1lLiByZXR1cm4gdGltZVN0ciBhcyBwYXNzZWQgaW5cbiAgICBpZihob3VyID09PSB1bmRlZmluZWQgfHwgaXNOYU4oaG91cikgfHwgaG91ciA+IDI0IHx8IG1pbnV0ZXMgPiA1OSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXG4gICAgfVxuXG4gICAgLy8gaWYgaG91ciBpczogXG4gICAgLy8gMCBvciAyNDogaG91cj0xMiwgYW1wbT1BTSBpZiB1bmRlZmluZWRcbiAgICAvLyAxLTExIDogIGFtcG0gYmFzZWQgb24gYW1wbVN3aXRjaFxuICAgIC8vIDEyIDogICAgYW1wbSA9IHBtIGlmIHVuZGVmaW5lZCBcbiAgICAvLyAxMy0yMyA6IGFtcG0gPSBwbSBhbHdheXMgZXZlbiBpZiBhbXBtID0gYW1cblxuICAgIGlmKGhvdXIgPT09IDAgfHwgaG91ciA9PT0gMjQpIHtcbiAgICAgIGhvdXIgPSAxMjsgXG4gICAgICBpZighYW1wbSkge1xuICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDAgJiYgaG91ciA8IDEyKSB7XG4gICAgICBpZiAoIWFtcG0pIHtcbiAgICAgICAgdmFyIHN3ID0gcmUuZXhlYyhhbXBtU3dpdGNoKTtcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hIb3VyID0gc3cgJiYgc3dbMV0gPyBzd1sxXSA6IHVuZGVmaW5lZDsgXG4gICAgICAgIHZhciBhbXBtU3dpdGNoTWludXRlID0gc3cgJiYgc3dbMl0gPyBzd1syXSA6IHVuZGVmaW5lZDsgXG5cbiAgICAgICAgaWYoaG91ciA+IGFtcG1Td2l0Y2hIb3VyIHx8IFxuICAgICAgICAgIChob3VyID09PSBhbXBtU3dpdGNoSG91ciAmJiBtaW51dGUgPiBhbXBtU3dpdGNoTWludXRlKSkge1xuICAgICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID09PTEyKSB7XG4gICAgICBhbXBtID0gIWFtcG0gPyAnUE0nIDogYW1wbTsgXG4gICAgfVxuXG4gICAgaWYoaG91ciA+IDEyKSB7XG4gICAgICBhbXBtID0gJ1BNJzsgXG4gICAgICBob3VyID0gaG91ciAtIDEyIDsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ0EnIHx8IGFtcG0gPT09ICdhJyA/ICdBTScgOiBhbXBtO1xuICAgICAgYW1wbSA9IGFtcG0gPT09ICdQJyB8fCBhbXBtID09PSAncCcgPyAnUE0nIDogYW1wbTtcbiAgICB9XG5cbiAgICBtaW51dGVzID0gKCcwJyArIG1pbnV0ZXMpLnNsaWNlKC0yKTsgXG5cbiAgICBuZXdUaW1lID0gaG91ciArICc6JyArIG1pbnV0ZXMgKyAnICcgKyBhbXBtO1xuXG4gICAgcmV0dXJuIG5ld1RpbWU7ICBcblxuICB9O1xuXG5cbiAgdmFyIGZvcm1hdFRpbWUgPSB7XG4gICAgcmU6IHJlLCBcbiAgICBnZXRGb3JtYXR0ZWRUaW1lOiBnZXRGb3JtYXR0ZWRUaW1lXG4gIH07IFxuICB2YXIgcm9vdCA9IHRoaXM7IFxuICAvLyB0aGFua3MgYXN5bmM6IFxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRUaW1lO1xuICAgIH1cbiAgICBleHBvcnRzLmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH1cblxufSkoKTtcblxuIiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuXHJcbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIF9yZW5kZXJEYXRhKTtcclxuXHJcbiAgLy8gQ2FjaGUgRE9NXHJcbiAgY29uc3Qgc2VhcmNoQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaC1ib3gnXVwiKSxcclxuICAgIHNlYXJjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gnXVwiKSxcclxuICAgIGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY2l0eSddXCIpLFxyXG4gICAgY291bnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjb3VudHJ5J11cIiksXHJcbiAgICB0aW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RpbWUnXVwiKSxcclxuICAgIGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF0ZSddXCIpLFxyXG4gICAgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0ZW1wJ11cIiksXHJcbiAgICBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItaWNvbiddXCIpLFxyXG4gICAgY29uZGl0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItY29uZGl0aW9uJ11cIiksXHJcbiAgICB1bml0c1N3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1bml0cy1zd2l0Y2gnXVwiKSxcclxuICAgIHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2luZCddXCIpLFxyXG4gICAgcHJlc3N1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ncHJlc3N1cmUnXVwiKSxcclxuICAgIGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2h1bWlkaXR5J11cIiksXHJcbiAgICB2aXNpYmlsaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3Zpc2liaWxpdHknXVwiKSxcclxuICAgIHV2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3V2J11cIiksXHJcbiAgICBndXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2d1c3QnXVwiKTtcclxuXHJcbiAgbGV0IHVzZXJDaG9pY2VJbXBlcmlhbCA9IGZhbHNlLCBjYWNoZWREYXRhO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2FkZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZEV2ZW50cygpIHtcclxuICAgIHNlYXJjaEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX3VwRGF0ZUFyZWFzTGlzdCk7XHJcbiAgICBzZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFkZHJlc3MpO1xyXG4gICAgdW5pdHNTd2l0Y2guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zd2l0Y2hVbml0cyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdXBEYXRlQXJlYXNMaXN0KCkge1xyXG4gICAgLy8gVXBkYXRlIGFyZWFzIGxpc3RcclxuICB9XHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QWRkcmVzcyhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IGUudGFyZ2V0LmZvcm07XHJcbiAgICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyhuZXcgRm9ybURhdGEoZm9ybSkpO1xyXG5cclxuICAgIGlmIChkYXRhLnEpIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhU2VhcmNoZWQsIGRhdGEucSk7XHJcbiAgICBpbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICBpbnB1dC5ibHVyKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zd2l0Y2hVbml0cygpIHtcclxuICAgIGlmIChjYWNoZWREYXRhKSB7XHJcbiAgICAgIHVzZXJDaG9pY2VJbXBlcmlhbCA9ICF1c2VyQ2hvaWNlSW1wZXJpYWw7XHJcbiAgICAgIF9yZW5kZXJEYXRhKGNhY2hlZERhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVuZGVyRGF0YShkYXRhLCBpc0ltcGVyaWFsID0gdXNlckNob2ljZUltcGVyaWFsKSB7XHJcbiAgICBjYWNoZWREYXRhID0gZGF0YTtcclxuXHJcbiAgICBjaXR5LnRleHRDb250ZW50ID0gZGF0YS5jaXR5O1xyXG4gICAgY291bnRyeS50ZXh0Q29udGVudCA9IGRhdGEuY291bnRyeTtcclxuICAgIHRpbWUudGV4dENvbnRlbnQgPSBkYXRhLnRpbWU7XHJcbiAgICBkYXRlLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgaWNvbi5zcmMgPSBkYXRhLmljb247XHJcbiAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmNvbmRpdGlvblRleHQ7XHJcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XHJcbiAgICB1di50ZXh0Q29udGVudCA9IGRhdGEudXY7XHJcblxyXG4gICAgLy8gSW1wZXJpYWwgZmllbGRzXHJcbiAgICBpZiAoaXNJbXBlcmlhbCkge1xyXG4gICAgICB0ZW1wLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFRlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsUHJlc3N1cmU7XHJcbiAgICAgIHZpc2liaWxpdHkudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxHdXN0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVGVtcDtcclxuICAgICAgd2luZC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1ByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNWaXNpYmlsaXR5O1xyXG4gICAgICBndXN0LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNHdXN0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUNvbnRyb2xsZXI7XHJcbiIsImNvbnN0IHB1YlN1YiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZXZlbnRzID0ge307XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGV2ZW50c1tldmVudF0gPyBldmVudHNbZXZlbnRdLnB1c2goZm4pIDogKGV2ZW50c1tldmVudF0gPSBbZm5dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHVuU3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tldmVudF0gPSBldmVudHNbZXZlbnRdLmZpbHRlcigoZnVuYykgPT4gZnVuYyAhPT0gZm4pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwdWJsaXNoKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSBldmVudHNbZXZlbnRdLmZvckVhY2goKGZuKSA9PiBmbihkYXRhKSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHVuU3Vic2NyaWJlLCBwdWJsaXNoIH07XHJcbiAgfSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiLCJjb25zdCBldmVudHMgPSB7XHJcbiAgICBkYXRhUmVjaWV2ZWQ6IFwiZGF0YVJlY2lldmVkXCIsXHJcbiAgICBkYXRhU2VhcmNoZWQ6IFwiZGF0YVNlYXJjaGVkXCJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzOyIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcbmltcG9ydCBmdCBmcm9tIFwiZm9ybWF0LXRpbWVcIjtcclxuXHJcbmNvbnN0IHdlYXRoZXIgPSAoKCkgPT4ge1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmRhdGFTZWFyY2hlZCwgX3NlYXJjaERhdGEpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2dldFVzZXJDb29yZCgpXHJcbiAgICAgIC50aGVuKChpcERhdGEpID0+IF9zZWFyY2hEYXRhKGAke2lwRGF0YS5sYXRpdHVkZX0sJHtpcERhdGEubG9uZ2l0dWRlfWApKVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgX3NlYXJjaERhdGEoXCJUZXhhc1wiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0VXNlckNvb3JkKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vZnJlZWlwYXBpLmNvbS9hcGkvanNvblwiKTtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRkFJTEVEIFRPIEdFVCBVU0VSIElQIENPT1JESU5BVEVTXFxuXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBrZXkgPSBcImM1MmVhZWNhZmU2MjRhYjY5MDgyMDI3NDkyMzIxMDhcIjtcclxuICAgIC8vIEdlb2NvZGUgaHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vc2VhcmNoP3E9XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT0ke2tleX0mcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSByZXN1bHQuY3VycmVudCxcclxuICAgICAgICBsb2NhdGlvbkRhdGEgPSByZXN1bHQubG9jYXRpb24sXHJcbiAgICAgICAgZW1wdHlDb250ZW50ID0gXCJfIF8gXyBcIjtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2l0eTogbG9jYXRpb25EYXRhLm5hbWUgfHwgZW1wdHlDb250ZW50LFxyXG4gICAgICAgIGNvdW50cnk6IGAke2xvY2F0aW9uRGF0YS5yZWdpb24gfHwgZW1wdHlDb250ZW50fSwgJHtcclxuICAgICAgICAgIGxvY2F0aW9uRGF0YS5jb3VudHJ5IHx8IGVtcHR5Q29udGVudFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHRpbWU6IGZ0LmdldEZvcm1hdHRlZFRpbWUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMV0pLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKFxyXG4gICAgICAgICAgbG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF1cclxuICAgICAgICApLnRvTG9jYWxlRGF0ZVN0cmluZygpLFxyXG4gICAgICAgIG1ldHJpY1RlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfY30g4oSDYCxcclxuICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfZn0g4oSJYCxcclxuICAgICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICBjb25kaXRpb25UZXh0OiBjdXJyZW50RGF0YS5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0ga3BoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbXBoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgbWV0cmljUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX21ifSBtYmAsXHJcbiAgICAgICAgaW1wZXJpYWxQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfaW59IGluYCxcclxuICAgICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgICAgbWV0cmljVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX2ttfSBrbWAsXHJcbiAgICAgICAgaW1wZXJpYWxWaXNpYmlsaXR5OiBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVzYCxcclxuICAgICAgICB1djogY3VycmVudERhdGEudXYsXHJcbiAgICAgICAgbWV0cmljR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9rcGh9IGtwaGAsXHJcbiAgICAgICAgaW1wZXJpYWxHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X21waH0gbXBoYCxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGQUlMRUQgVE8gUEFSU0UgREFUQVxcblwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZWFyY2hEYXRhKHF1ZXJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgX2dldFBhcnNlZERhdGEocXVlcnkpO1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVJlY2lldmVkLCBkYXRhKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanNcIjtcclxuaW1wb3J0IGRpc3BsYXlDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS5qc1wiO1xyXG5cclxud2VhdGhlci5pbml0KCk7XHJcbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=