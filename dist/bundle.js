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
    const data = Object.fromEntries(new FormData(form));

    if (data.q) _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, data.q);
    form.querySelector("input").value = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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NkJBQTZCLHlCQUF5QjtBQUN0RDtBQUNBLDZCQUE2QixvQkFBb0I7QUFDakQsK0JBQStCLHVCQUF1QjtBQUN0RDtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0MseUJBQXlCLHNCQUFzQjtBQUMvQztBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sa0RBQU0sU0FBUyx3REFBTTtBQUMzQixNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsT0FBTyxFQUFDOzs7Ozs7O1VDNUZ2QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOa0Q7QUFDRztBQUNyRDtBQUNBLGtFQUFPO0FBQ1AsMkRBQWlCLFEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9mb3JtYXQtdGltZS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kaXNwbGF5LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViRXZlbnRzLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbigpIHtcblxuICAvL1RPRE86IGFkZCBhYmlsaXR5IHRvIGRldGVjdCBoOm0gKHNpbmdsZSBkaWdpdCBmb3IgbWludXRlKVxuICB2YXIgcmUgPSAvXlxccyooWzAtOV18WzAtMV1bMC05XT98MlswLTRdPykoPz1cXHMqXFw6P1xccyooWzAtNV1bMC05XSk/XFxzKlteMC05LGEscF0qKFthLHBdKT9bXjAtOSxhLHBdKiQpL2k7XG5cbiAgdmFyIGdldEZvcm1hdHRlZFRpbWUgPSBmdW5jdGlvbih0aW1lU3RyLCBhbXBtU3dpdGNoKSB7XG5cbiAgICBhbXBtU3dpdGNoID0gYW1wbVN3aXRjaCA/IGFtcG1Td2l0Y2ggOiAnNjo1OSc7IFxuXG4gICAgdmFyIHIgPSByZS5leGVjKHRpbWVTdHIpOyBcbiAgICB2YXIgaG91ciA9IHIgJiYgclsxXSA/IE51bWJlcihyWzFdKSA6IHVuZGVmaW5lZDsgXG4gICAgdmFyIG1pbnV0ZXMgPSByICYmIHJbMl0gPyByWzJdIDogMDtcbiAgICBtaW51dGVzID0gKG1pbnV0ZXMgKyAnMCcpLnNsaWNlKDAsMik7IFxuICAgIG1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7ICBcbiAgICBtaW51dGVzID0gaXNOYU4obWludXRlcykgPyAwIDogbWludXRlczsgXG4gICAgdmFyIGFtcG0gPSByICYmIHJbM10gPyByWzNdIDogdW5kZWZpbmVkOyBcblxuICAgIHZhciBuZXdUaW1lOyBcblxuXG4gICAgLy8gaWYgbm8gaG91ciwgdGhlbiBjYW5ub3QgZGV0ZXJtaW5lIHRpbWUuIHJldHVybiB0aW1lU3RyIGFzIHBhc3NlZCBpblxuICAgIGlmKGhvdXIgPT09IHVuZGVmaW5lZCB8fCBpc05hTihob3VyKSB8fCBob3VyID4gMjQgfHwgbWludXRlcyA+IDU5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyBcbiAgICB9XG5cbiAgICAvLyBpZiBob3VyIGlzOiBcbiAgICAvLyAwIG9yIDI0OiBob3VyPTEyLCBhbXBtPUFNIGlmIHVuZGVmaW5lZFxuICAgIC8vIDEtMTEgOiAgYW1wbSBiYXNlZCBvbiBhbXBtU3dpdGNoXG4gICAgLy8gMTIgOiAgICBhbXBtID0gcG0gaWYgdW5kZWZpbmVkIFxuICAgIC8vIDEzLTIzIDogYW1wbSA9IHBtIGFsd2F5cyBldmVuIGlmIGFtcG0gPSBhbVxuXG4gICAgaWYoaG91ciA9PT0gMCB8fCBob3VyID09PSAyNCkge1xuICAgICAgaG91ciA9IDEyOyBcbiAgICAgIGlmKCFhbXBtKSB7XG4gICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID4gMCAmJiBob3VyIDwgMTIpIHtcbiAgICAgIGlmICghYW1wbSkge1xuICAgICAgICB2YXIgc3cgPSByZS5leGVjKGFtcG1Td2l0Y2gpO1xuICAgICAgICB2YXIgYW1wbVN3aXRjaEhvdXIgPSBzdyAmJiBzd1sxXSA/IHN3WzFdIDogdW5kZWZpbmVkOyBcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hNaW51dGUgPSBzdyAmJiBzd1syXSA/IHN3WzJdIDogdW5kZWZpbmVkOyBcblxuICAgICAgICBpZihob3VyID4gYW1wbVN3aXRjaEhvdXIgfHwgXG4gICAgICAgICAgKGhvdXIgPT09IGFtcG1Td2l0Y2hIb3VyICYmIG1pbnV0ZSA+IGFtcG1Td2l0Y2hNaW51dGUpKSB7XG4gICAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPT09MTIpIHtcbiAgICAgIGFtcG0gPSAhYW1wbSA/ICdQTScgOiBhbXBtOyBcbiAgICB9XG5cbiAgICBpZihob3VyID4gMTIpIHtcbiAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgIGhvdXIgPSBob3VyIC0gMTIgOyBcbiAgICB9IGVsc2UgeyBcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnQScgfHwgYW1wbSA9PT0gJ2EnID8gJ0FNJyA6IGFtcG07XG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ1AnIHx8IGFtcG0gPT09ICdwJyA/ICdQTScgOiBhbXBtO1xuICAgIH1cblxuICAgIG1pbnV0ZXMgPSAoJzAnICsgbWludXRlcykuc2xpY2UoLTIpOyBcblxuICAgIG5ld1RpbWUgPSBob3VyICsgJzonICsgbWludXRlcyArICcgJyArIGFtcG07XG5cbiAgICByZXR1cm4gbmV3VGltZTsgIFxuXG4gIH07XG5cblxuICB2YXIgZm9ybWF0VGltZSA9IHtcbiAgICByZTogcmUsIFxuICAgIGdldEZvcm1hdHRlZFRpbWU6IGdldEZvcm1hdHRlZFRpbWVcbiAgfTsgXG4gIHZhciByb290ID0gdGhpczsgXG4gIC8vIHRoYW5rcyBhc3luYzogXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFRpbWU7XG4gICAgfVxuICAgIGV4cG9ydHMuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfVxuXG59KSgpO1xuXG4iLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5cclxuY29uc3QgZGlzcGxheUNvbnRyb2xsZXIgPSAoKCkgPT4ge1xyXG4gIHB1YlN1Yi5zdWJzY3JpYmUoZXZlbnRzLmRhdGFSZWNpZXZlZCwgX3JlbmRlckRhdGEpO1xyXG5cclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoLWJveCddXCIpLFxyXG4gICAgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaCddXCIpLFxyXG4gICAgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5J11cIiksXHJcbiAgICBjb3VudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NvdW50cnknXVwiKSxcclxuICAgIHRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGltZSddXCIpLFxyXG4gICAgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdkYXRlJ11cIiksXHJcbiAgICB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RlbXAnXVwiKSxcclxuICAgIGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1pY29uJ11cIiksXHJcbiAgICBjb25kaXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1jb25kaXRpb24nXVwiKSxcclxuICAgIHVuaXRzU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3VuaXRzLXN3aXRjaCddXCIpLFxyXG4gICAgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3aW5kJ11cIiksXHJcbiAgICBwcmVzc3VyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdwcmVzc3VyZSddXCIpLFxyXG4gICAgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0naHVtaWRpdHknXVwiKSxcclxuICAgIHZpc2liaWxpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndmlzaWJpbGl0eSddXCIpLFxyXG4gICAgdXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndXYnXVwiKSxcclxuICAgIGd1c3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZ3VzdCddXCIpO1xyXG5cclxuICBsZXQgdXNlckNob2ljZUltcGVyaWFsID0gZmFsc2UsIGNhY2hlZERhdGE7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfYWRkRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYWRkRXZlbnRzKCkge1xyXG4gICAgc2VhcmNoQm94LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfdXBEYXRlQXJlYXNMaXN0KTtcclxuICAgIHNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QWRkcmVzcyk7XHJcbiAgICB1bml0c1N3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3N3aXRjaFVuaXRzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF91cERhdGVBcmVhc0xpc3QoKSB7XHJcbiAgICAvLyBVcGRhdGUgYXJlYXMgbGlzdFxyXG4gIH1cclxuICBmdW5jdGlvbiBfcXVlcnlBZGRyZXNzKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gZS50YXJnZXQuZm9ybTtcclxuICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXMobmV3IEZvcm1EYXRhKGZvcm0pKTtcclxuXHJcbiAgICBpZiAoZGF0YS5xKSBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVNlYXJjaGVkLCBkYXRhLnEpO1xyXG4gICAgZm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBudWxsO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfc3dpdGNoVW5pdHMoKSB7XHJcbiAgICBpZiAoY2FjaGVkRGF0YSkge1xyXG4gICAgICB1c2VyQ2hvaWNlSW1wZXJpYWwgPSAhdXNlckNob2ljZUltcGVyaWFsO1xyXG4gICAgICBfcmVuZGVyRGF0YShjYWNoZWREYXRhKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckRhdGEoZGF0YSwgaXNJbXBlcmlhbCA9IHVzZXJDaG9pY2VJbXBlcmlhbCkge1xyXG4gICAgY2FjaGVkRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgY2l0eS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcclxuICAgIGNvdW50cnkudGV4dENvbnRlbnQgPSBkYXRhLmNvdW50cnk7XHJcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xyXG4gICAgZGF0ZS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgIGljb24uc3JjID0gZGF0YS5pY29uO1xyXG4gICAgY29uZGl0aW9uLnRleHRDb250ZW50ID0gZGF0YS5jb25kaXRpb25UZXh0O1xyXG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xyXG4gICAgdXYudGV4dENvbnRlbnQgPSBkYXRhLnV2O1xyXG5cclxuICAgIC8vIEltcGVyaWFsIGZpZWxkc1xyXG4gICAgaWYgKGlzSW1wZXJpYWwpIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFdpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFZpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsR3VzdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljR3VzdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyO1xyXG4iLCJjb25zdCBwdWJTdWIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGV2ZW50cyA9IHt9O1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBldmVudHNbZXZlbnRdID8gZXZlbnRzW2V2ZW50XS5wdXNoKGZuKSA6IChldmVudHNbZXZlbnRdID0gW2ZuXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1blN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICBldmVudHNbZXZlbnRdID0gZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGZ1bmMpID0+IGZ1bmMgIT09IGZuKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgZGF0YSkge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkgZXZlbnRzW2V2ZW50XS5mb3JFYWNoKChmbikgPT4gZm4oZGF0YSkpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1blN1YnNjcmliZSwgcHVibGlzaCB9O1xyXG4gIH0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwdWJTdWI7IiwiY29uc3QgZXZlbnRzID0ge1xyXG4gICAgZGF0YVJlY2lldmVkOiBcImRhdGFSZWNpZXZlZFwiLFxyXG4gICAgZGF0YVNlYXJjaGVkOiBcImRhdGFTZWFyY2hlZFwiXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50czsiLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCB3ZWF0aGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhU2VhcmNoZWQsIF9zZWFyY2hEYXRhKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9nZXRVc2VyQ29vcmQoKVxyXG4gICAgICAudGhlbigoaXBEYXRhKSA9PiBfc2VhcmNoRGF0YShgJHtpcERhdGEubGF0aXR1ZGV9LCR7aXBEYXRhLmxvbmdpdHVkZX1gKSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIF9zZWFyY2hEYXRhKFwiVGV4YXNcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFVzZXJDb29yZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2ZyZWVpcGFwaS5jb20vYXBpL2pzb25cIik7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkZBSUxFRCBUTyBHRVQgVVNFUiBJUCBDT09SRElOQVRFU1xcblwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3Qga2V5ID0gXCJjNTJlYWVjYWZlNjI0YWI2OTA4MjAyNzQ5MjMyMTA4XCI7XHJcbiAgICAvLyBHZW9jb2RlIGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPVxyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2N1cnJlbnQuanNvbj9rZXk9JHtrZXl9JnE9JHtsb2NhdGlvbn1gO1xyXG4gICAgbGV0IHJlc3VsdCwgZGF0YTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuc3RhdHVzKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFBhcnNlZERhdGEobG9jYXRpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbik7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRhID0gcmVzdWx0LmN1cnJlbnQsXHJcbiAgICAgICAgbG9jYXRpb25EYXRhID0gcmVzdWx0LmxvY2F0aW9uLFxyXG4gICAgICAgIGVtcHR5Q29udGVudCA9IFwiXyBfIF8gXCI7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNpdHk6IGxvY2F0aW9uRGF0YS5uYW1lIHx8IGVtcHR5Q29udGVudCxcclxuICAgICAgICBjb3VudHJ5OiBgJHtsb2NhdGlvbkRhdGEucmVnaW9uIHx8IGVtcHR5Q29udGVudH0sICR7XHJcbiAgICAgICAgICBsb2NhdGlvbkRhdGEuY291bnRyeSB8fCBlbXB0eUNvbnRlbnRcclxuICAgICAgICB9YCxcclxuICAgICAgICB0aW1lOiBmdC5nZXRGb3JtYXR0ZWRUaW1lKGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzFdKSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShcclxuICAgICAgICAgIGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzBdXHJcbiAgICAgICAgKS50b0xvY2FsZURhdGVTdHJpbmcoKSxcclxuICAgICAgICBtZXRyaWNUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2N9IOKEg2AsXHJcbiAgICAgICAgaW1wZXJpYWxUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2Z9IOKEiWAsXHJcbiAgICAgICAgaWNvbjogY3VycmVudERhdGEuY29uZGl0aW9uLmljb24sXHJcbiAgICAgICAgY29uZGl0aW9uVGV4dDogY3VycmVudERhdGEuY29uZGl0aW9uLnRleHQsXHJcbiAgICAgICAgbWV0cmljV2luZDogYCR7Y3VycmVudERhdGEud2luZF9rcGh9IGtwaCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIGltcGVyaWFsV2luZDogYCR7Y3VycmVudERhdGEud2luZF9tcGh9IG1waCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIG1ldHJpY1ByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9tYn0gbWJgLFxyXG4gICAgICAgIGltcGVyaWFsUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX2lufSBpbmAsXHJcbiAgICAgICAgaHVtaWRpdHk6IGN1cnJlbnREYXRhLmh1bWlkaXR5LFxyXG4gICAgICAgIG1ldHJpY1Zpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19rbX0ga21gLFxyXG4gICAgICAgIGltcGVyaWFsVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX21pbGVzfSBtaWxlc2AsXHJcbiAgICAgICAgdXY6IGN1cnJlbnREYXRhLnV2LFxyXG4gICAgICAgIG1ldHJpY0d1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3Rfa3BofSBrcGhgLFxyXG4gICAgICAgIGltcGVyaWFsR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9tcGh9IG1waGAsXHJcbiAgICAgIH07XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRkFJTEVEIFRPIFBBUlNFIERBVEFcXG5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2VhcmNoRGF0YShxdWVyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9nZXRQYXJzZWREYXRhKHF1ZXJ5KTtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFSZWNpZXZlZCwgZGF0YSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdlYXRoZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgd2VhdGhlciBmcm9tIFwiLi9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzXCI7XHJcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL2Rpc3BsYXkuanNcIjtcclxuXHJcbndlYXRoZXIuaW5pdCgpO1xyXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9