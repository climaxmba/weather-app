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
    gust = document.querySelector("[data-js-name='gust']"),
    loading = document.querySelector("[data-js-name='loading']");

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

    if (data.q) {
      _displayLoadingScreen();
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, data.q);
    }
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

    _removeloadingScreen();
  }

  function _displayLoadingScreen() {
    loading.classList.add("active");
  }
  function _removeloadingScreen() {
    loading.classList.remove("active");
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
    searchFailed: "searchFailed"
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
      const response = await fetch("https://freeipapi.com/api/json", { mode: "cors" });
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
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].searchFailed, err);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QW9CO0FBQzNDLHlCQUF5QixvQkFBb0I7QUFDN0M7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0IsT0FBTyxxQkFBcUI7QUFDekUseUJBQXlCLHNCQUFzQixPQUFPLHFCQUFxQjtBQUMzRSwyQkFBMkIseUJBQXlCO0FBQ3BELDZCQUE2Qix5QkFBeUI7QUFDdEQ7QUFDQSw2QkFBNkIsb0JBQW9CO0FBQ2pELCtCQUErQix1QkFBdUI7QUFDdEQ7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDLHlCQUF5QixzQkFBc0I7QUFDL0M7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGtEQUFNLFNBQVMsd0RBQU07QUFDM0IsTUFBTTtBQUNOO0FBQ0EsTUFBTSxrREFBTSxTQUFTLHdEQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxDQUFDO0FBQ0Q7QUFDQSxpRUFBZSxPQUFPLEVBQUM7Ozs7Ozs7VUM3RnZCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05rRDtBQUNHO0FBQ3JEO0FBQ0Esa0VBQU87QUFDUCwyREFBaUIsUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Zvcm1hdC10aW1lL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWJFdmVudHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy93ZWF0aGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vVE9ETzogYWRkIGFiaWxpdHkgdG8gZGV0ZWN0IGg6bSAoc2luZ2xlIGRpZ2l0IGZvciBtaW51dGUpXG4gIHZhciByZSA9IC9eXFxzKihbMC05XXxbMC0xXVswLTldP3wyWzAtNF0/KSg/PVxccypcXDo/XFxzKihbMC01XVswLTldKT9cXHMqW14wLTksYSxwXSooW2EscF0pP1teMC05LGEscF0qJCkvaTtcblxuICB2YXIgZ2V0Rm9ybWF0dGVkVGltZSA9IGZ1bmN0aW9uKHRpbWVTdHIsIGFtcG1Td2l0Y2gpIHtcblxuICAgIGFtcG1Td2l0Y2ggPSBhbXBtU3dpdGNoID8gYW1wbVN3aXRjaCA6ICc2OjU5JzsgXG5cbiAgICB2YXIgciA9IHJlLmV4ZWModGltZVN0cik7IFxuICAgIHZhciBob3VyID0gciAmJiByWzFdID8gTnVtYmVyKHJbMV0pIDogdW5kZWZpbmVkOyBcbiAgICB2YXIgbWludXRlcyA9IHIgJiYgclsyXSA/IHJbMl0gOiAwO1xuICAgIG1pbnV0ZXMgPSAobWludXRlcyArICcwJykuc2xpY2UoMCwyKTsgXG4gICAgbWludXRlcyA9IE51bWJlcihtaW51dGVzKTsgIFxuICAgIG1pbnV0ZXMgPSBpc05hTihtaW51dGVzKSA/IDAgOiBtaW51dGVzOyBcbiAgICB2YXIgYW1wbSA9IHIgJiYgclszXSA/IHJbM10gOiB1bmRlZmluZWQ7IFxuXG4gICAgdmFyIG5ld1RpbWU7IFxuXG5cbiAgICAvLyBpZiBubyBob3VyLCB0aGVuIGNhbm5vdCBkZXRlcm1pbmUgdGltZS4gcmV0dXJuIHRpbWVTdHIgYXMgcGFzc2VkIGluXG4gICAgaWYoaG91ciA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKGhvdXIpIHx8IGhvdXIgPiAyNCB8fCBtaW51dGVzID4gNTkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IFxuICAgIH1cblxuICAgIC8vIGlmIGhvdXIgaXM6IFxuICAgIC8vIDAgb3IgMjQ6IGhvdXI9MTIsIGFtcG09QU0gaWYgdW5kZWZpbmVkXG4gICAgLy8gMS0xMSA6ICBhbXBtIGJhc2VkIG9uIGFtcG1Td2l0Y2hcbiAgICAvLyAxMiA6ICAgIGFtcG0gPSBwbSBpZiB1bmRlZmluZWQgXG4gICAgLy8gMTMtMjMgOiBhbXBtID0gcG0gYWx3YXlzIGV2ZW4gaWYgYW1wbSA9IGFtXG5cbiAgICBpZihob3VyID09PSAwIHx8IGhvdXIgPT09IDI0KSB7XG4gICAgICBob3VyID0gMTI7IFxuICAgICAgaWYoIWFtcG0pIHtcbiAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAwICYmIGhvdXIgPCAxMikge1xuICAgICAgaWYgKCFhbXBtKSB7XG4gICAgICAgIHZhciBzdyA9IHJlLmV4ZWMoYW1wbVN3aXRjaCk7XG4gICAgICAgIHZhciBhbXBtU3dpdGNoSG91ciA9IHN3ICYmIHN3WzFdID8gc3dbMV0gOiB1bmRlZmluZWQ7IFxuICAgICAgICB2YXIgYW1wbVN3aXRjaE1pbnV0ZSA9IHN3ICYmIHN3WzJdID8gc3dbMl0gOiB1bmRlZmluZWQ7IFxuXG4gICAgICAgIGlmKGhvdXIgPiBhbXBtU3dpdGNoSG91ciB8fCBcbiAgICAgICAgICAoaG91ciA9PT0gYW1wbVN3aXRjaEhvdXIgJiYgbWludXRlID4gYW1wbVN3aXRjaE1pbnV0ZSkpIHtcbiAgICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA9PT0xMikge1xuICAgICAgYW1wbSA9ICFhbXBtID8gJ1BNJyA6IGFtcG07IFxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAxMikge1xuICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgaG91ciA9IGhvdXIgLSAxMiA7IFxuICAgIH0gZWxzZSB7IFxuICAgICAgYW1wbSA9IGFtcG0gPT09ICdBJyB8fCBhbXBtID09PSAnYScgPyAnQU0nIDogYW1wbTtcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnUCcgfHwgYW1wbSA9PT0gJ3AnID8gJ1BNJyA6IGFtcG07XG4gICAgfVxuXG4gICAgbWludXRlcyA9ICgnMCcgKyBtaW51dGVzKS5zbGljZSgtMik7IFxuXG4gICAgbmV3VGltZSA9IGhvdXIgKyAnOicgKyBtaW51dGVzICsgJyAnICsgYW1wbTtcblxuICAgIHJldHVybiBuZXdUaW1lOyAgXG5cbiAgfTtcblxuXG4gIHZhciBmb3JtYXRUaW1lID0ge1xuICAgIHJlOiByZSwgXG4gICAgZ2V0Rm9ybWF0dGVkVGltZTogZ2V0Rm9ybWF0dGVkVGltZVxuICB9OyBcbiAgdmFyIHJvb3QgPSB0aGlzOyBcbiAgLy8gdGhhbmtzIGFzeW5jOiBcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZm9ybWF0VGltZTtcbiAgICB9XG4gICAgZXhwb3J0cy5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfSBlbHNlIHtcbiAgICByb290LmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9XG5cbn0pKCk7XG5cbiIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcblxyXG5jb25zdCBkaXNwbGF5Q29udHJvbGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVJlY2lldmVkLCBfcmVuZGVyRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuc2VhcmNoRmFpbGVkLCBfcmVtb3ZlbG9hZGluZ1NjcmVlbik7XHJcblxyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gtYm94J11cIiksXHJcbiAgICBzZWFyY2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoJ11cIiksXHJcbiAgICBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NpdHknXVwiKSxcclxuICAgIGNvdW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY291bnRyeSddXCIpLFxyXG4gICAgdGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0aW1lJ11cIiksXHJcbiAgICBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2RhdGUnXVwiKSxcclxuICAgIHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGVtcCddXCIpLFxyXG4gICAgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWljb24nXVwiKSxcclxuICAgIGNvbmRpdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWNvbmRpdGlvbiddXCIpLFxyXG4gICAgdW5pdHNTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndW5pdHMtc3dpdGNoJ11cIiksXHJcbiAgICB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dpbmQnXVwiKSxcclxuICAgIHByZXNzdXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3ByZXNzdXJlJ11cIiksXHJcbiAgICBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdodW1pZGl0eSddXCIpLFxyXG4gICAgdmlzaWJpbGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd2aXNpYmlsaXR5J11cIiksXHJcbiAgICB1diA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1diddXCIpLFxyXG4gICAgZ3VzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdndXN0J11cIiksXHJcbiAgICBsb2FkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2xvYWRpbmcnXVwiKTtcclxuXHJcbiAgbGV0IHVzZXJDaG9pY2VJbXBlcmlhbCA9IGZhbHNlLCBjYWNoZWREYXRhO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX2FkZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZEV2ZW50cygpIHtcclxuICAgIHNlYXJjaEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX3VwRGF0ZUFyZWFzTGlzdCk7XHJcbiAgICBzZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFkZHJlc3MpO1xyXG4gICAgdW5pdHNTd2l0Y2guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zd2l0Y2hVbml0cyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdXBEYXRlQXJlYXNMaXN0KCkge1xyXG4gICAgLy8gVXBkYXRlIGFyZWFzIGxpc3RcclxuICB9XHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QWRkcmVzcyhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IGUudGFyZ2V0LmZvcm07XHJcbiAgICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyhuZXcgRm9ybURhdGEoZm9ybSkpO1xyXG5cclxuICAgIGlmIChkYXRhLnEpIHtcclxuICAgICAgX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhU2VhcmNoZWQsIGRhdGEucSk7XHJcbiAgICB9XHJcbiAgICBpbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICBpbnB1dC5ibHVyKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zd2l0Y2hVbml0cygpIHtcclxuICAgIGlmIChjYWNoZWREYXRhKSB7XHJcbiAgICAgIHVzZXJDaG9pY2VJbXBlcmlhbCA9ICF1c2VyQ2hvaWNlSW1wZXJpYWw7XHJcbiAgICAgIF9yZW5kZXJEYXRhKGNhY2hlZERhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlbmRlckRhdGEoZGF0YSwgaXNJbXBlcmlhbCA9IHVzZXJDaG9pY2VJbXBlcmlhbCkge1xyXG4gICAgY2FjaGVkRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgY2l0eS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcclxuICAgIGNvdW50cnkudGV4dENvbnRlbnQgPSBkYXRhLmNvdW50cnk7XHJcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xyXG4gICAgZGF0ZS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgIGljb24uc3JjID0gZGF0YS5pY29uO1xyXG4gICAgY29uZGl0aW9uLnRleHRDb250ZW50ID0gZGF0YS5jb25kaXRpb25UZXh0O1xyXG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xyXG4gICAgdXYudGV4dENvbnRlbnQgPSBkYXRhLnV2O1xyXG5cclxuICAgIC8vIEltcGVyaWFsIGZpZWxkc1xyXG4gICAgaWYgKGlzSW1wZXJpYWwpIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFdpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFZpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsR3VzdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljR3VzdDtcclxuICAgIH1cclxuXHJcbiAgICBfcmVtb3ZlbG9hZGluZ1NjcmVlbigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCkge1xyXG4gICAgbG9hZGluZy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlbG9hZGluZ1NjcmVlbigpIHtcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyO1xyXG4iLCJjb25zdCBwdWJTdWIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGV2ZW50cyA9IHt9O1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBldmVudHNbZXZlbnRdID8gZXZlbnRzW2V2ZW50XS5wdXNoKGZuKSA6IChldmVudHNbZXZlbnRdID0gW2ZuXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1blN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICBldmVudHNbZXZlbnRdID0gZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGZ1bmMpID0+IGZ1bmMgIT09IGZuKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgZGF0YSkge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkgZXZlbnRzW2V2ZW50XS5mb3JFYWNoKChmbikgPT4gZm4oZGF0YSkpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1blN1YnNjcmliZSwgcHVibGlzaCB9O1xyXG4gIH0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwdWJTdWI7IiwiY29uc3QgZXZlbnRzID0ge1xyXG4gICAgZGF0YVJlY2lldmVkOiBcImRhdGFSZWNpZXZlZFwiLFxyXG4gICAgZGF0YVNlYXJjaGVkOiBcImRhdGFTZWFyY2hlZFwiLFxyXG4gICAgc2VhcmNoRmFpbGVkOiBcInNlYXJjaEZhaWxlZFwiXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50czsiLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCB3ZWF0aGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhU2VhcmNoZWQsIF9zZWFyY2hEYXRhKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9nZXRVc2VyQ29vcmQoKVxyXG4gICAgICAudGhlbigoaXBEYXRhKSA9PiBfc2VhcmNoRGF0YShgJHtpcERhdGEubGF0aXR1ZGV9LCR7aXBEYXRhLmxvbmdpdHVkZX1gKSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIF9zZWFyY2hEYXRhKFwiVGV4YXNcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFVzZXJDb29yZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2ZyZWVpcGFwaS5jb20vYXBpL2pzb25cIiwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRkFJTEVEIFRPIEdFVCBVU0VSIElQIENPT1JESU5BVEVTXFxuXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBrZXkgPSBcImM1MmVhZWNhZmU2MjRhYjY5MDgyMDI3NDkyMzIxMDhcIjtcclxuICAgIC8vIEdlb2NvZGUgaHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vc2VhcmNoP3E9XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT0ke2tleX0mcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSByZXN1bHQuY3VycmVudCxcclxuICAgICAgICBsb2NhdGlvbkRhdGEgPSByZXN1bHQubG9jYXRpb24sXHJcbiAgICAgICAgZW1wdHlDb250ZW50ID0gXCJfIF8gXyBcIjtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2l0eTogbG9jYXRpb25EYXRhLm5hbWUgfHwgZW1wdHlDb250ZW50LFxyXG4gICAgICAgIGNvdW50cnk6IGAke2xvY2F0aW9uRGF0YS5yZWdpb24gfHwgZW1wdHlDb250ZW50fSwgJHtcclxuICAgICAgICAgIGxvY2F0aW9uRGF0YS5jb3VudHJ5IHx8IGVtcHR5Q29udGVudFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHRpbWU6IGZ0LmdldEZvcm1hdHRlZFRpbWUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMV0pLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKFxyXG4gICAgICAgICAgbG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF1cclxuICAgICAgICApLnRvTG9jYWxlRGF0ZVN0cmluZygpLFxyXG4gICAgICAgIG1ldHJpY1RlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfY30g4oSDYCxcclxuICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfZn0g4oSJYCxcclxuICAgICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICBjb25kaXRpb25UZXh0OiBjdXJyZW50RGF0YS5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0ga3BoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbXBoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgbWV0cmljUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX21ifSBtYmAsXHJcbiAgICAgICAgaW1wZXJpYWxQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfaW59IGluYCxcclxuICAgICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgICAgbWV0cmljVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX2ttfSBrbWAsXHJcbiAgICAgICAgaW1wZXJpYWxWaXNpYmlsaXR5OiBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVzYCxcclxuICAgICAgICB1djogY3VycmVudERhdGEudXYsXHJcbiAgICAgICAgbWV0cmljR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9rcGh9IGtwaGAsXHJcbiAgICAgICAgaW1wZXJpYWxHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X21waH0gbXBoYCxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGQUlMRUQgVE8gUEFSU0UgREFUQVxcblwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZWFyY2hEYXRhKHF1ZXJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgX2dldFBhcnNlZERhdGEocXVlcnkpO1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVJlY2lldmVkLCBkYXRhKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICBwdWJTdWIucHVibGlzaChldmVudHMuc2VhcmNoRmFpbGVkLCBlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL21vZHVsZXMvd2VhdGhlckhhbmRsZXIuanNcIjtcclxuaW1wb3J0IGRpc3BsYXlDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS5qc1wiO1xyXG5cclxud2VhdGhlci5pbml0KCk7XHJcbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=