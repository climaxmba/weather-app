/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/display.js":
/*!********************************!*\
  !*** ./src/modules/display.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubSubEvents.js */ "./src/modules/pubSubEvents.js");



const displayController = (() => {
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

  return { init };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (displayController);


/***/ }),

/***/ "./src/modules/pubSub.js":
/*!*******************************!*\
  !*** ./src/modules/pubSub.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubSubEvents.js */ "./src/modules/pubSubEvents.js");



const weather = (() => {
  async function init() {
    _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, _getParsedData);
    const data = await _getParsedData("London");
    _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataRecieved, data);
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
    const result = await _getCurrentData(location);
    const currentData = result.currentData,
      locationData = result.location;

    return {
      city: locationData.name,
      country: locationData.country,
      time: locationData.localtime.split(" ")[1],
      date: locationData.localtime.split(" ")[0],
      metricTemp: `${currentData.temp_c}℃`,
      imperialTemp: `${currentData.temp_f}℉`,
      icon: currentData.condition.icon,
      conditionText: currentData.condition.text,
      metricWind: `${currentData.wind_kph} ${currentData.wind_dir}`,
      imperialWind: `${currentData.wind_mph} ${currentData.wind_dir}`,
      metricPressure: `${currentData.pressure_mb} mb`,
      imperialPressure: `${currentData.pressure_in} in`,
      humidity: currentData.humidity,
      metricVisibility: `${currentData.vis_km}km`,
      imperialVisibility: `${currentData.vis_miles}miles`,
      uv: currentData.uv,
      metricGust: `${currentData.gust_kph}kph`,
      imperialGust: `${currentData.gust_mph}mph`,
    };
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7QUFDTTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxDQUFDO0FBQ0Q7QUFDQSxpRUFBZSxpQkFBaUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN0NqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRztBQUNIO0FBQ0EsaUVBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7QUNsQnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7O0FDTFk7QUFDTTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxJQUFJLGtEQUFNLFdBQVcsd0RBQU07QUFDM0I7QUFDQSxJQUFJLGtEQUFNLFNBQVMsd0RBQU07QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxJQUFJLEtBQUssU0FBUztBQUNwRjtBQUNBO0FBQ0Esa0NBQWtDLGNBQWM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBbUI7QUFDeEMsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLHFCQUFxQjtBQUNsRSx1QkFBdUIsc0JBQXNCLEVBQUUscUJBQXFCO0FBQ3BFLHlCQUF5Qix5QkFBeUI7QUFDbEQsMkJBQTJCLHlCQUF5QjtBQUNwRDtBQUNBLDJCQUEyQixtQkFBbUI7QUFDOUMsNkJBQTZCLHNCQUFzQjtBQUNuRDtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUMsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsT0FBTyxFQUFDOzs7Ozs7O1VDMUR2QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05rRDtBQUNHO0FBQ3JEO0FBQ0Esa0VBQU87QUFDUCwyREFBaUIsUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3B1YlN1YkV2ZW50cy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuXHJcbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0gKCgpID0+IHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoLWJveCddXCIpLFxyXG4gICAgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaCddXCIpLFxyXG4gICAgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5J11cIiksXHJcbiAgICBjb3VudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NvdW50cnknXVwiKSxcclxuICAgIHRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGltZSddXCIpLFxyXG4gICAgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdkYXRlJ11cIiksXHJcbiAgICB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RlbXAnXVwiKSxcclxuICAgIGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1pY29uJ11cIiksXHJcbiAgICBjb25kaXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2VhdGhlci1jb25kaXRpb24nXVwiKSxcclxuICAgIHVuaXRzU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3VuaXRzLXN3aXRjaCddXCIpLFxyXG4gICAgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3aW5kJ11cIiksXHJcbiAgICBwcmVzc3VyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdwcmVzc3VyZSddXCIpLFxyXG4gICAgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0naHVtaWRpdHknXVwiKSxcclxuICAgIHZpc2liaWxpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndmlzaWJpbGl0eSddXCIpLFxyXG4gICAgdXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndXYnXVwiKSxcclxuICAgIGd1c3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZ3VzdCddXCIpO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2FkZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZEV2ZW50cygpIHtcclxuICAgIHNlYXJjaEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX3VwRGF0ZUFyZWFzTGlzdCk7XHJcbiAgICBzZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFkZHJlc3MpO1xyXG4gICAgdW5pdHNTd2l0Y2guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zd2l0aFVuaXRzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF91cERhdGVBcmVhc0xpc3QoKSB7XHJcbiAgICAvLyBVcGRhdGUgYXJlYXMgbGlzdFxyXG4gIH1cclxuICBmdW5jdGlvbiBfcXVlcnlBZGRyZXNzKCkge1xyXG4gICAgLy8gUXVlcnkgYWRkcmVzc1xyXG4gIH1cclxuICBmdW5jdGlvbiBfc3dpdGhVbml0cygpIHtcclxuICAgIC8vIFN3aXRjaCB1bml0c1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUNvbnRyb2xsZXI7XHJcbiIsImNvbnN0IHB1YlN1YiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZXZlbnRzID0ge307XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGV2ZW50c1tldmVudF0gPyBldmVudHNbZXZlbnRdLnB1c2goZm4pIDogKGV2ZW50c1tldmVudF0gPSBbZm5dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHVuU3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tldmVudF0gPSBldmVudHNbZXZlbnRdLmZpbHRlcigoZnVuYykgPT4gZnVuYyAhPT0gZm4pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwdWJsaXNoKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSBldmVudHNbZXZlbnRdLmZvckVhY2goKGZuKSA9PiBmbihkYXRhKSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHVuU3Vic2NyaWJlLCBwdWJsaXNoIH07XHJcbiAgfSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiLCJjb25zdCBldmVudHMgPSB7XHJcbiAgICBkYXRhUmVjaWV2ZWQ6IFwiZGF0YVJlY2lldmVkXCIsXHJcbiAgICBkYXRhU2VhcmNoZWQ6IFwiZGF0YVNlYXJjaGVkXCJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzOyIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcblxyXG5jb25zdCB3ZWF0aGVyID0gKCgpID0+IHtcclxuICBhc3luYyBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVNlYXJjaGVkLCBfZ2V0UGFyc2VkRGF0YSk7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgX2dldFBhcnNlZERhdGEoXCJMb25kb25cIik7XHJcbiAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVJlY2lldmVkLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3Qga2V5ID0gXCJjNTJlYWVjYWZlNjI0YWI2OTA4MjAyNzQ5MjMyMTA4XCI7XHJcbiAgICAvLyBHZW9jb2RlIGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPVxyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2N1cnJlbnQuanNvbj9rZXk9JHtrZXl9JnE9JHtsb2NhdGlvbn1gO1xyXG4gICAgbGV0IHJlc3VsdCwgZGF0YTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuc3RhdHVzKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFBhcnNlZERhdGEobG9jYXRpb24pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbik7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0YSA9IHJlc3VsdC5jdXJyZW50RGF0YSxcclxuICAgICAgbG9jYXRpb25EYXRhID0gcmVzdWx0LmxvY2F0aW9uO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNpdHk6IGxvY2F0aW9uRGF0YS5uYW1lLFxyXG4gICAgICBjb3VudHJ5OiBsb2NhdGlvbkRhdGEuY291bnRyeSxcclxuICAgICAgdGltZTogbG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMV0sXHJcbiAgICAgIGRhdGU6IGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzBdLFxyXG4gICAgICBtZXRyaWNUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2N94oSDYCxcclxuICAgICAgaW1wZXJpYWxUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2Z94oSJYCxcclxuICAgICAgaWNvbjogY3VycmVudERhdGEuY29uZGl0aW9uLmljb24sXHJcbiAgICAgIGNvbmRpdGlvblRleHQ6IGN1cnJlbnREYXRhLmNvbmRpdGlvbi50ZXh0LFxyXG4gICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0gJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICBpbXBlcmlhbFdpbmQ6IGAke2N1cnJlbnREYXRhLndpbmRfbXBofSAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgIG1ldHJpY1ByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9tYn0gbWJgLFxyXG4gICAgICBpbXBlcmlhbFByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9pbn0gaW5gLFxyXG4gICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgIG1ldHJpY1Zpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19rbX1rbWAsXHJcbiAgICAgIGltcGVyaWFsVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX21pbGVzfW1pbGVzYCxcclxuICAgICAgdXY6IGN1cnJlbnREYXRhLnV2LFxyXG4gICAgICBtZXRyaWNHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X2twaH1rcGhgLFxyXG4gICAgICBpbXBlcmlhbEd1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3RfbXBofW1waGAsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgd2VhdGhlciBmcm9tIFwiLi9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzXCI7XHJcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL2Rpc3BsYXkuanNcIjtcclxuXHJcbndlYXRoZXIuaW5pdCgpO1xyXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9