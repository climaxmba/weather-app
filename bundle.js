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
    _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, _getParsedData);
    
  async function init() {
    const data = await _getParsedData("Miami");
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
    const currentData = result.current,
      locationData = result.location;

      console.log(result)
    return {
      city: locationData.name,
      country: `${locationData.region}, ${locationData.country}`,
      time: format_time__WEBPACK_IMPORTED_MODULE_2___default().getFormattedTime(locationData.localtime.split(" ")[1]),
      date: new Date(locationData.localtime.split(" ")[0]).toLocaleDateString(),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05rRDtBQUNHO0FBQ3JEO0FBQ0Esa0VBQU87QUFDUCwyREFBaUIsUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Zvcm1hdC10aW1lL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWJFdmVudHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy93ZWF0aGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vVE9ETzogYWRkIGFiaWxpdHkgdG8gZGV0ZWN0IGg6bSAoc2luZ2xlIGRpZ2l0IGZvciBtaW51dGUpXG4gIHZhciByZSA9IC9eXFxzKihbMC05XXxbMC0xXVswLTldP3wyWzAtNF0/KSg/PVxccypcXDo/XFxzKihbMC01XVswLTldKT9cXHMqW14wLTksYSxwXSooW2EscF0pP1teMC05LGEscF0qJCkvaTtcblxuICB2YXIgZ2V0Rm9ybWF0dGVkVGltZSA9IGZ1bmN0aW9uKHRpbWVTdHIsIGFtcG1Td2l0Y2gpIHtcblxuICAgIGFtcG1Td2l0Y2ggPSBhbXBtU3dpdGNoID8gYW1wbVN3aXRjaCA6ICc2OjU5JzsgXG5cbiAgICB2YXIgciA9IHJlLmV4ZWModGltZVN0cik7IFxuICAgIHZhciBob3VyID0gciAmJiByWzFdID8gTnVtYmVyKHJbMV0pIDogdW5kZWZpbmVkOyBcbiAgICB2YXIgbWludXRlcyA9IHIgJiYgclsyXSA/IHJbMl0gOiAwO1xuICAgIG1pbnV0ZXMgPSAobWludXRlcyArICcwJykuc2xpY2UoMCwyKTsgXG4gICAgbWludXRlcyA9IE51bWJlcihtaW51dGVzKTsgIFxuICAgIG1pbnV0ZXMgPSBpc05hTihtaW51dGVzKSA/IDAgOiBtaW51dGVzOyBcbiAgICB2YXIgYW1wbSA9IHIgJiYgclszXSA/IHJbM10gOiB1bmRlZmluZWQ7IFxuXG4gICAgdmFyIG5ld1RpbWU7IFxuXG5cbiAgICAvLyBpZiBubyBob3VyLCB0aGVuIGNhbm5vdCBkZXRlcm1pbmUgdGltZS4gcmV0dXJuIHRpbWVTdHIgYXMgcGFzc2VkIGluXG4gICAgaWYoaG91ciA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKGhvdXIpIHx8IGhvdXIgPiAyNCB8fCBtaW51dGVzID4gNTkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IFxuICAgIH1cblxuICAgIC8vIGlmIGhvdXIgaXM6IFxuICAgIC8vIDAgb3IgMjQ6IGhvdXI9MTIsIGFtcG09QU0gaWYgdW5kZWZpbmVkXG4gICAgLy8gMS0xMSA6ICBhbXBtIGJhc2VkIG9uIGFtcG1Td2l0Y2hcbiAgICAvLyAxMiA6ICAgIGFtcG0gPSBwbSBpZiB1bmRlZmluZWQgXG4gICAgLy8gMTMtMjMgOiBhbXBtID0gcG0gYWx3YXlzIGV2ZW4gaWYgYW1wbSA9IGFtXG5cbiAgICBpZihob3VyID09PSAwIHx8IGhvdXIgPT09IDI0KSB7XG4gICAgICBob3VyID0gMTI7IFxuICAgICAgaWYoIWFtcG0pIHtcbiAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAwICYmIGhvdXIgPCAxMikge1xuICAgICAgaWYgKCFhbXBtKSB7XG4gICAgICAgIHZhciBzdyA9IHJlLmV4ZWMoYW1wbVN3aXRjaCk7XG4gICAgICAgIHZhciBhbXBtU3dpdGNoSG91ciA9IHN3ICYmIHN3WzFdID8gc3dbMV0gOiB1bmRlZmluZWQ7IFxuICAgICAgICB2YXIgYW1wbVN3aXRjaE1pbnV0ZSA9IHN3ICYmIHN3WzJdID8gc3dbMl0gOiB1bmRlZmluZWQ7IFxuXG4gICAgICAgIGlmKGhvdXIgPiBhbXBtU3dpdGNoSG91ciB8fCBcbiAgICAgICAgICAoaG91ciA9PT0gYW1wbVN3aXRjaEhvdXIgJiYgbWludXRlID4gYW1wbVN3aXRjaE1pbnV0ZSkpIHtcbiAgICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA9PT0xMikge1xuICAgICAgYW1wbSA9ICFhbXBtID8gJ1BNJyA6IGFtcG07IFxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAxMikge1xuICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgaG91ciA9IGhvdXIgLSAxMiA7IFxuICAgIH0gZWxzZSB7IFxuICAgICAgYW1wbSA9IGFtcG0gPT09ICdBJyB8fCBhbXBtID09PSAnYScgPyAnQU0nIDogYW1wbTtcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnUCcgfHwgYW1wbSA9PT0gJ3AnID8gJ1BNJyA6IGFtcG07XG4gICAgfVxuXG4gICAgbWludXRlcyA9ICgnMCcgKyBtaW51dGVzKS5zbGljZSgtMik7IFxuXG4gICAgbmV3VGltZSA9IGhvdXIgKyAnOicgKyBtaW51dGVzICsgJyAnICsgYW1wbTtcblxuICAgIHJldHVybiBuZXdUaW1lOyAgXG5cbiAgfTtcblxuXG4gIHZhciBmb3JtYXRUaW1lID0ge1xuICAgIHJlOiByZSwgXG4gICAgZ2V0Rm9ybWF0dGVkVGltZTogZ2V0Rm9ybWF0dGVkVGltZVxuICB9OyBcbiAgdmFyIHJvb3QgPSB0aGlzOyBcbiAgLy8gdGhhbmtzIGFzeW5jOiBcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZm9ybWF0VGltZTtcbiAgICB9XG4gICAgZXhwb3J0cy5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfSBlbHNlIHtcbiAgICByb290LmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9XG5cbn0pKCk7XG5cbiIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcblxyXG5jb25zdCBkaXNwbGF5Q29udHJvbGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVJlY2lldmVkLCBfcmVuZGVyRGF0YSk7XHJcblxyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdzZWFyY2gtYm94J11cIiksXHJcbiAgICBzZWFyY2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoJ11cIiksXHJcbiAgICBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2NpdHknXVwiKSxcclxuICAgIGNvdW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY291bnRyeSddXCIpLFxyXG4gICAgdGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0aW1lJ11cIiksXHJcbiAgICBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2RhdGUnXVwiKSxcclxuICAgIHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndGVtcCddXCIpLFxyXG4gICAgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWljb24nXVwiKSxcclxuICAgIGNvbmRpdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd3ZWF0aGVyLWNvbmRpdGlvbiddXCIpLFxyXG4gICAgdW5pdHNTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ndW5pdHMtc3dpdGNoJ11cIiksXHJcbiAgICB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dpbmQnXVwiKSxcclxuICAgIHByZXNzdXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3ByZXNzdXJlJ11cIiksXHJcbiAgICBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdodW1pZGl0eSddXCIpLFxyXG4gICAgdmlzaWJpbGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd2aXNpYmlsaXR5J11cIiksXHJcbiAgICB1diA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1diddXCIpLFxyXG4gICAgZ3VzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdndXN0J11cIik7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfYWRkRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYWRkRXZlbnRzKCkge1xyXG4gICAgc2VhcmNoQm94LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfdXBEYXRlQXJlYXNMaXN0KTtcclxuICAgIHNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QWRkcmVzcyk7XHJcbiAgICB1bml0c1N3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3N3aXRoVW5pdHMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3VwRGF0ZUFyZWFzTGlzdCgpIHtcclxuICAgIC8vIFVwZGF0ZSBhcmVhcyBsaXN0XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFkZHJlc3MoKSB7XHJcbiAgICAvLyBRdWVyeSBhZGRyZXNzXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zd2l0aFVuaXRzKCkge1xyXG4gICAgLy8gU3dpdGNoIHVuaXRzXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW5kZXJEYXRhKGRhdGEsIGlzSW1wZXJpYWwgPSBmYWxzZSkge1xyXG4gICAgY2l0eS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcclxuICAgIGNvdW50cnkudGV4dENvbnRlbnQgPSBkYXRhLmNvdW50cnk7XHJcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xyXG4gICAgZGF0ZS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcclxuICAgIHRlbXAudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsID8gZGF0YS5pbXBlcmlhbFRlbXAgOiBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICBpY29uLnNyYyA9IGRhdGEuaWNvbjtcclxuICAgIGNvbmRpdGlvbi50ZXh0Q29udGVudCA9IGRhdGEuY29uZGl0aW9uVGV4dDtcclxuICAgIHdpbmQudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsID8gZGF0YS5pbXBlcmlhbFdpbmQgOiBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICBwcmVzc3VyZS50ZXh0Q29udGVudCA9IGlzSW1wZXJpYWwgPyBkYXRhLmltcGVyaWFsUHJlc3N1cmUgOiBkYXRhLm1ldHJpY1ByZXNzdXJlO1xyXG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xyXG4gICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGlzSW1wZXJpYWwgPyBkYXRhLmltcGVyaWFsVmlzaWJpbGl0eSA6IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgIHV2LnRleHRDb250ZW50ID0gZGF0YS51djtcclxuICAgIGd1c3QudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsID8gZGF0YS5pbXBlcmlhbEd1c3QgOiBkYXRhLm1ldHJpY0d1c3Q7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBpbml0IH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5Q29udHJvbGxlcjtcclxuIiwiY29uc3QgcHViU3ViID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBldmVudHMgPSB7fTtcclxuICBcclxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgZXZlbnRzW2V2ZW50XSA/IGV2ZW50c1tldmVudF0ucHVzaChmbikgOiAoZXZlbnRzW2V2ZW50XSA9IFtmbl0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdW5TdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2V2ZW50XSA9IGV2ZW50c1tldmVudF0uZmlsdGVyKChmdW5jKSA9PiBmdW5jICE9PSBmbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQsIGRhdGEpIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIGV2ZW50c1tldmVudF0uZm9yRWFjaCgoZm4pID0+IGZuKGRhdGEpKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiB7IHN1YnNjcmliZSwgdW5TdWJzY3JpYmUsIHB1Ymxpc2ggfTtcclxuICB9KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsImNvbnN0IGV2ZW50cyA9IHtcclxuICAgIGRhdGFSZWNpZXZlZDogXCJkYXRhUmVjaWV2ZWRcIixcclxuICAgIGRhdGFTZWFyY2hlZDogXCJkYXRhU2VhcmNoZWRcIlxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBldmVudHM7IiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJTdWIuanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9wdWJTdWJFdmVudHMuanNcIjtcclxuaW1wb3J0IGZ0IGZyb20gXCJmb3JtYXQtdGltZVwiO1xyXG5cclxuY29uc3Qgd2VhdGhlciA9ICgoKSA9PiB7XHJcbiAgICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhU2VhcmNoZWQsIF9nZXRQYXJzZWREYXRhKTtcclxuICAgIFxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgX2dldFBhcnNlZERhdGEoXCJNaWFtaVwiKTtcclxuICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBrZXkgPSBcImM1MmVhZWNhZmU2MjRhYjY5MDgyMDI3NDkyMzIxMDhcIjtcclxuICAgIC8vIEdlb2NvZGUgaHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vc2VhcmNoP3E9XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT0ke2tleX0mcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRhID0gcmVzdWx0LmN1cnJlbnQsXHJcbiAgICAgIGxvY2F0aW9uRGF0YSA9IHJlc3VsdC5sb2NhdGlvbjtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNpdHk6IGxvY2F0aW9uRGF0YS5uYW1lLFxyXG4gICAgICBjb3VudHJ5OiBgJHtsb2NhdGlvbkRhdGEucmVnaW9ufSwgJHtsb2NhdGlvbkRhdGEuY291bnRyeX1gLFxyXG4gICAgICB0aW1lOiBmdC5nZXRGb3JtYXR0ZWRUaW1lKGxvY2F0aW9uRGF0YS5sb2NhbHRpbWUuc3BsaXQoXCIgXCIpWzFdKSxcclxuICAgICAgZGF0ZTogbmV3IERhdGUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF0pLnRvTG9jYWxlRGF0ZVN0cmluZygpLFxyXG4gICAgICBtZXRyaWNUZW1wOiBgJHtjdXJyZW50RGF0YS50ZW1wX2N9IOKEg2AsXHJcbiAgICAgIGltcGVyaWFsVGVtcDogYCR7Y3VycmVudERhdGEudGVtcF9mfSDihIlgLFxyXG4gICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgY29uZGl0aW9uVGV4dDogY3VycmVudERhdGEuY29uZGl0aW9uLnRleHQsXHJcbiAgICAgIG1ldHJpY1dpbmQ6IGAke2N1cnJlbnREYXRhLndpbmRfa3BofSBrcGgsICR7Y3VycmVudERhdGEud2luZF9kaXJ9YCxcclxuICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbXBoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgIG1ldHJpY1ByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9tYn0gbWJgLFxyXG4gICAgICBpbXBlcmlhbFByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9pbn0gaW5gLFxyXG4gICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgIG1ldHJpY1Zpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19rbX0ga21gLFxyXG4gICAgICBpbXBlcmlhbFZpc2liaWxpdHk6IGAke2N1cnJlbnREYXRhLnZpc19taWxlc30gbWlsZXNgLFxyXG4gICAgICB1djogY3VycmVudERhdGEudXYsXHJcbiAgICAgIG1ldHJpY0d1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3Rfa3BofSBrcGhgLFxyXG4gICAgICBpbXBlcmlhbEd1c3Q6IGAke2N1cnJlbnREYXRhLmd1c3RfbXBofSBtcGhgLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdlYXRoZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgd2VhdGhlciBmcm9tIFwiLi9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzXCI7XHJcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL2Rpc3BsYXkuanNcIjtcclxuXHJcbndlYXRoZXIuaW5pdCgpO1xyXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9