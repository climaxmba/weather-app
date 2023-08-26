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
    if (e.target.value.length >= 3)
      _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].publish(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataInputed, e.target.value);
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
      return Promise.reject("FAILED TO GET USER IP COORDINATES");
    }
  }

  async function _getCurrentData(location) {
    const key = "c52eaecafe624ab6908202749232108";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBLFdBQVc7QUFDWCxDQUFDO0FBQ0Q7QUFDQSxpRUFBZSxPQUFPLEVBQUM7Ozs7Ozs7VUMxR3ZCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05rRDtBQUNHO0FBQ3JEO0FBQ0Esa0VBQU87QUFDUCwyREFBaUIsUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Zvcm1hdC10aW1lL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9wdWJTdWJFdmVudHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy93ZWF0aGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vVE9ETzogYWRkIGFiaWxpdHkgdG8gZGV0ZWN0IGg6bSAoc2luZ2xlIGRpZ2l0IGZvciBtaW51dGUpXG4gIHZhciByZSA9IC9eXFxzKihbMC05XXxbMC0xXVswLTldP3wyWzAtNF0/KSg/PVxccypcXDo/XFxzKihbMC01XVswLTldKT9cXHMqW14wLTksYSxwXSooW2EscF0pP1teMC05LGEscF0qJCkvaTtcblxuICB2YXIgZ2V0Rm9ybWF0dGVkVGltZSA9IGZ1bmN0aW9uKHRpbWVTdHIsIGFtcG1Td2l0Y2gpIHtcblxuICAgIGFtcG1Td2l0Y2ggPSBhbXBtU3dpdGNoID8gYW1wbVN3aXRjaCA6ICc2OjU5JzsgXG5cbiAgICB2YXIgciA9IHJlLmV4ZWModGltZVN0cik7IFxuICAgIHZhciBob3VyID0gciAmJiByWzFdID8gTnVtYmVyKHJbMV0pIDogdW5kZWZpbmVkOyBcbiAgICB2YXIgbWludXRlcyA9IHIgJiYgclsyXSA/IHJbMl0gOiAwO1xuICAgIG1pbnV0ZXMgPSAobWludXRlcyArICcwJykuc2xpY2UoMCwyKTsgXG4gICAgbWludXRlcyA9IE51bWJlcihtaW51dGVzKTsgIFxuICAgIG1pbnV0ZXMgPSBpc05hTihtaW51dGVzKSA/IDAgOiBtaW51dGVzOyBcbiAgICB2YXIgYW1wbSA9IHIgJiYgclszXSA/IHJbM10gOiB1bmRlZmluZWQ7IFxuXG4gICAgdmFyIG5ld1RpbWU7IFxuXG5cbiAgICAvLyBpZiBubyBob3VyLCB0aGVuIGNhbm5vdCBkZXRlcm1pbmUgdGltZS4gcmV0dXJuIHRpbWVTdHIgYXMgcGFzc2VkIGluXG4gICAgaWYoaG91ciA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKGhvdXIpIHx8IGhvdXIgPiAyNCB8fCBtaW51dGVzID4gNTkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IFxuICAgIH1cblxuICAgIC8vIGlmIGhvdXIgaXM6IFxuICAgIC8vIDAgb3IgMjQ6IGhvdXI9MTIsIGFtcG09QU0gaWYgdW5kZWZpbmVkXG4gICAgLy8gMS0xMSA6ICBhbXBtIGJhc2VkIG9uIGFtcG1Td2l0Y2hcbiAgICAvLyAxMiA6ICAgIGFtcG0gPSBwbSBpZiB1bmRlZmluZWQgXG4gICAgLy8gMTMtMjMgOiBhbXBtID0gcG0gYWx3YXlzIGV2ZW4gaWYgYW1wbSA9IGFtXG5cbiAgICBpZihob3VyID09PSAwIHx8IGhvdXIgPT09IDI0KSB7XG4gICAgICBob3VyID0gMTI7IFxuICAgICAgaWYoIWFtcG0pIHtcbiAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAwICYmIGhvdXIgPCAxMikge1xuICAgICAgaWYgKCFhbXBtKSB7XG4gICAgICAgIHZhciBzdyA9IHJlLmV4ZWMoYW1wbVN3aXRjaCk7XG4gICAgICAgIHZhciBhbXBtU3dpdGNoSG91ciA9IHN3ICYmIHN3WzFdID8gc3dbMV0gOiB1bmRlZmluZWQ7IFxuICAgICAgICB2YXIgYW1wbVN3aXRjaE1pbnV0ZSA9IHN3ICYmIHN3WzJdID8gc3dbMl0gOiB1bmRlZmluZWQ7IFxuXG4gICAgICAgIGlmKGhvdXIgPiBhbXBtU3dpdGNoSG91ciB8fCBcbiAgICAgICAgICAoaG91ciA9PT0gYW1wbVN3aXRjaEhvdXIgJiYgbWludXRlID4gYW1wbVN3aXRjaE1pbnV0ZSkpIHtcbiAgICAgICAgICBhbXBtID0gJ0FNJzsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaG91ciA9PT0xMikge1xuICAgICAgYW1wbSA9ICFhbXBtID8gJ1BNJyA6IGFtcG07IFxuICAgIH1cblxuICAgIGlmKGhvdXIgPiAxMikge1xuICAgICAgYW1wbSA9ICdQTSc7IFxuICAgICAgaG91ciA9IGhvdXIgLSAxMiA7IFxuICAgIH0gZWxzZSB7IFxuICAgICAgYW1wbSA9IGFtcG0gPT09ICdBJyB8fCBhbXBtID09PSAnYScgPyAnQU0nIDogYW1wbTtcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnUCcgfHwgYW1wbSA9PT0gJ3AnID8gJ1BNJyA6IGFtcG07XG4gICAgfVxuXG4gICAgbWludXRlcyA9ICgnMCcgKyBtaW51dGVzKS5zbGljZSgtMik7IFxuXG4gICAgbmV3VGltZSA9IGhvdXIgKyAnOicgKyBtaW51dGVzICsgJyAnICsgYW1wbTtcblxuICAgIHJldHVybiBuZXdUaW1lOyAgXG5cbiAgfTtcblxuXG4gIHZhciBmb3JtYXRUaW1lID0ge1xuICAgIHJlOiByZSwgXG4gICAgZ2V0Rm9ybWF0dGVkVGltZTogZ2V0Rm9ybWF0dGVkVGltZVxuICB9OyBcbiAgdmFyIHJvb3QgPSB0aGlzOyBcbiAgLy8gdGhhbmtzIGFzeW5jOiBcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZm9ybWF0VGltZTtcbiAgICB9XG4gICAgZXhwb3J0cy5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfSBlbHNlIHtcbiAgICByb290LmZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lO1xuICB9XG5cbn0pKCk7XG5cbiIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcblxyXG5jb25zdCBkaXNwbGF5Q29udHJvbGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVJlY2lldmVkLCBfcmVuZGVyRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuc2VhcmNoRmFpbGVkLCBfcmVtb3ZlbG9hZGluZ1NjcmVlbik7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIF91cGRhdGVBcmVhc0xpc3QpO1xyXG5cclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoLWJveCddXCIpLFxyXG4gICAgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaCddXCIpLFxyXG4gICAgYXJlYXNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2FyZWFzLWxpc3QnXVwiKSxcclxuICAgIGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY2l0eSddXCIpLFxyXG4gICAgY291bnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjb3VudHJ5J11cIiksXHJcbiAgICB0aW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RpbWUnXVwiKSxcclxuICAgIGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF0ZSddXCIpLFxyXG4gICAgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0ZW1wJ11cIiksXHJcbiAgICBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItaWNvbiddXCIpLFxyXG4gICAgY29uZGl0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItY29uZGl0aW9uJ11cIiksXHJcbiAgICB1bml0c1N3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1bml0cy1zd2l0Y2gnXVwiKSxcclxuICAgIHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2luZCddXCIpLFxyXG4gICAgcHJlc3N1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ncHJlc3N1cmUnXVwiKSxcclxuICAgIGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2h1bWlkaXR5J11cIiksXHJcbiAgICB2aXNpYmlsaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3Zpc2liaWxpdHknXVwiKSxcclxuICAgIHV2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3V2J11cIiksXHJcbiAgICBndXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2d1c3QnXVwiKSxcclxuICAgIGxvYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbG9hZGluZyddXCIpLFxyXG4gICAgbXNnQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J21zZy1ib3gnXVwiKSxcclxuICAgIG1zZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbXNnLXRleHQnXVwiKSxcclxuICAgIGNhbmNlbE1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjYW5jZWwtbXNnJ11cIik7XHJcblxyXG4gIGxldCB1c2VyQ2hvaWNlSW1wZXJpYWwgPSBmYWxzZSwgY2FjaGVkRGF0YTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9hZGRFdmVudHMoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hZGRFdmVudHMoKSB7XHJcbiAgICBzZWFyY2hCb3guYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9jaGVja0lucHV0KTtcclxuICAgIHNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QWRkcmVzcyk7XHJcbiAgICB1bml0c1N3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3N3aXRjaFVuaXRzKTtcclxuICAgIGNhbmNlbE1zZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3JlbW92ZU1zZyk7XHJcbiAgICBhcmVhc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFyZWFDb29yZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2hlY2tJbnB1dChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID49IDMpXHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhSW5wdXRlZCwgZS50YXJnZXQudmFsdWUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdXBkYXRlQXJlYXNMaXN0KGxpc3QpIHtcclxuICAgIGFyZWFzTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcImRhdGEtY29vcmRcIiwgYCR7bGlzdFtpXS5sYXR9LCAke2xpc3RbaV0ubG9ufWApO1xyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk05LjUsM0E2LjUsNi41IDAgMCwxIDE2LDkuNUMxNiwxMS4xMSAxNS40MSwxMi41OSAxNC40NCwxMy43M0wxNC43MSwxNEgxNS41TDIwLjUsMTlMMTksMjAuNUwxNCwxNS41VjE0LjcxTDEzLjczLDE0LjQ0QzEyLjU5LDE1LjQxIDExLjExLDE2IDkuNSwxNkE2LjUsNi41IDAgMCwxIDMsOS41QTYuNSw2LjUgMCAwLDEgOS41LDNNOS41LDVDNyw1IDUsNyA1LDkuNUM1LDEyIDcsMTQgOS41LDE0QzEyLDE0IDE0LDEyIDE0LDkuNUMxNCw3IDEyLDUgOS41LDVaXCIgLz48L3N2Zz5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImFyZWEtbmFtZVwiPiR7bGlzdFtpXS5kaXNwbGF5X25hbWV9PC9zcGFuPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXRlZ29yeVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke2xpc3RbaV0uY2xhc3N9PC9zcGFuPjxzcGFuPi88L3NwYW4+PHNwYW4+JHtsaXN0W2ldLnR5cGV9PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICAgIGFyZWFzTGlzdC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGlzcGxheUFyZWFzTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QWRkcmVzcyhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IGUudGFyZ2V0LmZvcm07XHJcbiAgICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyhuZXcgRm9ybURhdGEoZm9ybSkpO1xyXG5cclxuICAgIGlmIChkYXRhLnEpIF9zZWFyY2hEYXRhKGRhdGEucSk7XHJcbiAgICBpbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICBpbnB1dC5ibHVyKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFyZWFDb29yZChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xyXG4gICAgICBsZXQgZWxlbSA9IGUudGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoIWVsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKSkgZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudDtcclxuICAgICAgX3NlYXJjaERhdGEoZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIpKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3NlYXJjaERhdGEoYWRkcikge1xyXG4gICAgX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCk7XHJcbiAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVNlYXJjaGVkLCBhZGRyKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N3aXRjaFVuaXRzKCkge1xyXG4gICAgaWYgKGNhY2hlZERhdGEpIHtcclxuICAgICAgdXNlckNob2ljZUltcGVyaWFsID0gIXVzZXJDaG9pY2VJbXBlcmlhbDtcclxuICAgICAgX3JlbmRlckRhdGEoY2FjaGVkRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVuZGVyRGF0YShkYXRhLCBpc0ltcGVyaWFsID0gdXNlckNob2ljZUltcGVyaWFsKSB7XHJcbiAgICBjYWNoZWREYXRhID0gZGF0YTtcclxuXHJcbiAgICBjaXR5LnRleHRDb250ZW50ID0gZGF0YS5jaXR5O1xyXG4gICAgY291bnRyeS50ZXh0Q29udGVudCA9IGRhdGEuY291bnRyeTtcclxuICAgIHRpbWUudGV4dENvbnRlbnQgPSBkYXRhLnRpbWU7XHJcbiAgICBkYXRlLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgaWNvbi5zcmMgPSBkYXRhLmljb247XHJcbiAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmNvbmRpdGlvblRleHQ7XHJcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XHJcbiAgICB1di50ZXh0Q29udGVudCA9IGRhdGEudXY7XHJcblxyXG4gICAgLy8gSW1wZXJpYWwgZmllbGRzXHJcbiAgICBpZiAoaXNJbXBlcmlhbCkge1xyXG4gICAgICB0ZW1wLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFRlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsUHJlc3N1cmU7XHJcbiAgICAgIHZpc2liaWxpdHkudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxHdXN0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVGVtcDtcclxuICAgICAgd2luZC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljV2luZDtcclxuICAgICAgcHJlc3N1cmUudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1ByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNWaXNpYmlsaXR5O1xyXG4gICAgICBndXN0LnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNHdXN0O1xyXG4gICAgfVxyXG5cclxuICAgIF9yZW1vdmVsb2FkaW5nU2NyZWVuKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZGlzcGxheUxvYWRpbmdTY3JlZW4oKSB7XHJcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVsb2FkaW5nU2NyZWVuKG1zZykge1xyXG4gICAgaWYgKG1zZykgX2Rpc3BsYXlNc2cobXNnKTtcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgIF9yZW1vdmVBcmVhc0xpc3QoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlNc2cobXNnKSB7XHJcbiAgICBtc2dUZXh0LnRleHRDb250ZW50ID0gbXNnO1xyXG4gICAgbXNnQm94LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICBzZXRUaW1lb3V0KF9yZW1vdmVNc2csIDgwMDApO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfcmVtb3ZlTXNnKCkge1xyXG4gICAgbXNnQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5QXJlYXNMaXN0KCkge1xyXG4gICAgYXJlYXNMaXN0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVBcmVhc0xpc3QoKSB7XHJcbiAgICBhcmVhc0xpc3QuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyO1xyXG4iLCJjb25zdCBwdWJTdWIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGV2ZW50cyA9IHt9O1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBldmVudHNbZXZlbnRdID8gZXZlbnRzW2V2ZW50XS5wdXNoKGZuKSA6IChldmVudHNbZXZlbnRdID0gW2ZuXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1blN1YnNjcmliZShldmVudCwgZm4pIHtcclxuICAgICAgaWYgKGV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICBldmVudHNbZXZlbnRdID0gZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGZ1bmMpID0+IGZ1bmMgIT09IGZuKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgZGF0YSkge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkgZXZlbnRzW2V2ZW50XS5mb3JFYWNoKChmbikgPT4gZm4oZGF0YSkpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1blN1YnNjcmliZSwgcHVibGlzaCB9O1xyXG4gIH0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwdWJTdWI7IiwiY29uc3QgZXZlbnRzID0ge1xyXG4gICAgZGF0YVJlY2lldmVkOiBcImRhdGFSZWNpZXZlZFwiLFxyXG4gICAgZGF0YVNlYXJjaGVkOiBcImRhdGFTZWFyY2hlZFwiLFxyXG4gICAgc2VhcmNoRmFpbGVkOiBcInNlYXJjaEZhaWxlZFwiLFxyXG4gICAgZGF0YUlucHV0ZWQ6IFwiZGF0YUlucHV0ZWRcIixcclxuICAgIGFyZWFzTGlzdFJlY2lldmVkOiBcImFyZWFzTGlzdFJlY2lldmVkXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50czsiLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCB3ZWF0aGVyID0gKCgpID0+IHtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhU2VhcmNoZWQsIF9zZWFyY2hEYXRhKTtcclxuICBwdWJTdWIuc3Vic2NyaWJlKGV2ZW50cy5kYXRhSW5wdXRlZCwgX2dldEFyZWFzTGlzdCk7XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfZ2V0VXNlckNvb3JkKClcclxuICAgICAgLnRoZW4oKGlwRGF0YSkgPT4gX3NlYXJjaERhdGEoYCR7aXBEYXRhLmxhdH0sJHtpcERhdGEubG9ufWApKVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgX3NlYXJjaERhdGEoXCJUZXhhc1wiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2VhcmNoRGF0YShxdWVyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9nZXRQYXJzZWREYXRhKHF1ZXJ5KTtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFSZWNpZXZlZCwgZGF0YSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coYHdlYXRoZXJIYW5kbGVyOiAke2Vycn1gKTtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLnNlYXJjaEZhaWxlZCwgZXJyKTtcclxuICAgIH1cclxuICB9XHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEFyZWFzTGlzdChpbnB1dCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9nZW9jb2RlLm1hcHMuY28vc2VhcmNoP3E9JHtpbnB1dH1gLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5hcmVhc0xpc3RSZWNpZXZlZCwgZGF0YSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0QXJlYXNMaXN0OiBGYWlsZWQhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0VXNlckNvb3JkKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9pcC1hcGkuY29tL2pzb24vXCIsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIkZBSUxFRCBUTyBHRVQgVVNFUiBJUCBDT09SRElOQVRFU1wiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRDdXJyZW50RGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3Qga2V5ID0gXCJjNTJlYWVjYWZlNjI0YWI2OTA4MjAyNzQ5MjMyMTA4XCI7XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT0ke2tleX0mcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSByZXN1bHQuY3VycmVudCxcclxuICAgICAgICBsb2NhdGlvbkRhdGEgPSByZXN1bHQubG9jYXRpb24sXHJcbiAgICAgICAgZW1wdHlDb250ZW50ID0gXCJfIF8gXyBcIjtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2l0eTogbG9jYXRpb25EYXRhLm5hbWUgfHwgZW1wdHlDb250ZW50LFxyXG4gICAgICAgIGNvdW50cnk6IGAke2xvY2F0aW9uRGF0YS5yZWdpb24gfHwgZW1wdHlDb250ZW50fSwgJHtcclxuICAgICAgICAgIGxvY2F0aW9uRGF0YS5jb3VudHJ5IHx8IGVtcHR5Q29udGVudFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHRpbWU6IGZ0LmdldEZvcm1hdHRlZFRpbWUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMV0pLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKFxyXG4gICAgICAgICAgbG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF1cclxuICAgICAgICApLnRvTG9jYWxlRGF0ZVN0cmluZygpLFxyXG4gICAgICAgIG1ldHJpY1RlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfY30g4oSDYCxcclxuICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfZn0g4oSJYCxcclxuICAgICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICBjb25kaXRpb25UZXh0OiBjdXJyZW50RGF0YS5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0ga3BoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgaW1wZXJpYWxXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX21waH0gbXBoLCAke2N1cnJlbnREYXRhLndpbmRfZGlyfWAsXHJcbiAgICAgICAgbWV0cmljUHJlc3N1cmU6IGAke2N1cnJlbnREYXRhLnByZXNzdXJlX21ifSBtYmAsXHJcbiAgICAgICAgaW1wZXJpYWxQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfaW59IGluYCxcclxuICAgICAgICBodW1pZGl0eTogY3VycmVudERhdGEuaHVtaWRpdHksXHJcbiAgICAgICAgbWV0cmljVmlzaWJpbGl0eTogYCR7Y3VycmVudERhdGEudmlzX2ttfSBrbWAsXHJcbiAgICAgICAgaW1wZXJpYWxWaXNpYmlsaXR5OiBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVzYCxcclxuICAgICAgICB1djogY3VycmVudERhdGEudXYsXHJcbiAgICAgICAgbWV0cmljR3VzdDogYCR7Y3VycmVudERhdGEuZ3VzdF9rcGh9IGtwaGAsXHJcbiAgICAgICAgaW1wZXJpYWxHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X21waH0gbXBoYCxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJDb3VsZCBub3QgbG9hZCBkYXRhIVwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IGluaXQgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdlYXRoZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgd2VhdGhlciBmcm9tIFwiLi9tb2R1bGVzL3dlYXRoZXJIYW5kbGVyLmpzXCI7XHJcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL2Rpc3BsYXkuanNcIjtcclxuXHJcbndlYXRoZXIuaW5pdCgpO1xyXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9