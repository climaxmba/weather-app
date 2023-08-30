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

/***/ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js":
/*!***************************************************************!*\
  !*** ./node_modules/isomorphic-fetch/fetch-npm-browserify.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
module.exports = self.fetch.bind(self);


/***/ }),

/***/ "./node_modules/pexels/dist/main.module.js":
/*!*************************************************!*\
  !*** ./node_modules/pexels/dist/main.module.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createClient: () => (/* binding */ c)
/* harmony export */ });
var t={photo:"https://api.pexels.com/v1/",video:"https://api.pexels.com/videos/",collections:"https://api.pexels.com/v1/collections/"};function r(r,e){var n={method:"GET",headers:{Accept:"application/json","Content-Type":"application/json","User-Agent":"Pexels/JavaScript",Authorization:r}},o=t[e];return function(t,r){return fetch(""+o+t+"?"+function(t){return Object.keys(t).map(function(r){return r+"="+t[r]}).join("&")}(r||{}),n).then(function(t){if(!t.ok)throw new Error(t.statusText);return t.json()})}}function e(t){var e=r(t,"collections");return{all:function(t){return void 0===t&&(t={}),e("",t)},media:function(t){var r=t.id,n=function(t,r){if(null==t)return{};var e,n,o={},i=Object.keys(t);for(n=0;n<i.length;n++)r.indexOf(e=i[n])>=0||(o[e]=t[e]);return o}(t,["id"]);return e(""+r,n)},featured:function(t){return void 0===t&&(t={}),e("featured",t)}}}function n(t){return!(!t||!t.photos)}var o={__proto__:null,isPhotos:n,isVideos:function(t){return!(!t||!t.videos)},isError:function(t){return!!t.error}};function i(t){var e=r(t,"photo");return{search:function(t){return e("/search",t)},curated:function(t){return void 0===t&&(t={}),e("/curated",t)},show:function(t){return e("/photos/"+t.id)},random:function(){try{var t=Math.floor(1e3*Math.random());return Promise.resolve(this.curated({page:t,per_page:1})).then(function(t){return n(t)?t.photos[0]:t})}catch(t){return Promise.reject(t)}}}}function u(t){var e=r(t,"video");return{search:function(t){return e("/search",t)},popular:function(t){return void 0===t&&(t={}),e("/popular",t)},show:function(t){return e("/videos/"+t.id)}}}function c(t){if(!t||"string"!=typeof t)throw new TypeError("An ApiKey must be provided when initiating the Pexel's client.");return{typeCheckers:o,photos:i(t),videos:u(t),collections:e(t)}}__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js");
//# sourceMappingURL=main.module.js.map


/***/ }),

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-fetch/fetch.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMException: () => (/* binding */ DOMException),
/* harmony export */   Headers: () => (/* binding */ Headers),
/* harmony export */   Request: () => (/* binding */ Request),
/* harmony export */   Response: () => (/* binding */ Response),
/* harmony export */   fetch: () => (/* binding */ fetch)
/* harmony export */ });
/* eslint-disable no-prototype-builtins */
var g =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  // eslint-disable-next-line no-undef
  (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g) ||
  {}

var support = {
  searchParams: 'URLSearchParams' in g,
  iterable: 'Symbol' in g && 'iterator' in Symbol,
  blob:
    'FileReader' in g &&
    'Blob' in g &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in g,
  arrayBuffer: 'ArrayBuffer' in g
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      if (header.length != 2) {
        throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
      }
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body._noBody) return
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type)
  var encoding = match ? match[1] : 'utf-8'
  reader.readAsText(blob, encoding)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    // eslint-disable-next-line no-self-assign
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._noBody = true;
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }
  }

  this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var isConsumed = consumed(this)
      if (isConsumed) {
        return isConsumed
      } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
        return Promise.resolve(
          this._bodyArrayBuffer.buffer.slice(
            this._bodyArrayBuffer.byteOffset,
            this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
          )
        )
      } else {
        return Promise.resolve(this._bodyArrayBuffer)
      }
    } else if (support.blob) {
      return this.blob().then(readBlobAsArrayBuffer)
    } else {
      throw new Error('could not read as ArrayBuffer')
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal || (function () {
    if ('AbortController' in g) {
      var ctrl = new AbortController();
      return ctrl.signal;
    }
  }());
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        try {
          headers.append(key, value)
        } catch (error) {
          console.warn('Response ' + error.message)
        }
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  if (this.status < 200 || this.status > 599) {
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
  }
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 200, statusText: ''})
  response.status = 0
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = g.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      // This check if specifically for when a user fetches a file locally from the file system
      // Only if the status is out of a normal range
      if (request.url.startsWith('file://') && (xhr.status < 200 || xhr.status > 599)) {
        options.status = 200;
      } else {
        options.status = xhr.status;
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && g.location.href ? g.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
      var names = [];
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        names.push(normalizeName(name))
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
      request.headers.forEach(function(value, name) {
        if (names.indexOf(name) === -1) {
          xhr.setRequestHeader(name, value)
        }
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!g.fetch) {
  g.fetch = fetch
  g.Headers = Headers
  g.Request = Request
  g.Response = Response
}

/***/ }),

/***/ "./src/modules/apiHandler.js":
/*!***********************************!*\
  !*** ./src/modules/apiHandler.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubSubEvents.js */ "./src/modules/pubSubEvents.js");
/* harmony import */ var pexels__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pexels */ "./node_modules/pexels/dist/main.module.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! format-time */ "./node_modules/format-time/lib/index.js");
/* harmony import */ var format_time__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(format_time__WEBPACK_IMPORTED_MODULE_3__);





const apiHandler = (() => {
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataSearched, _searchData);
  _pubSub_js__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(_pubSubEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"].dataInputed, _getAreasList);
  let client;
  
  async function init() {
    client = (0,pexels__WEBPACK_IMPORTED_MODULE_2__.createClient)('OGih2ChlxcaKZTW87ixSFht3bZTbbnhHR7QNN688roF9crgxY8cKtNVr');
    _getUserCoord()
      .then((ipData) => _searchData(`${ipData.latitude},${ipData.longitude}`))
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
      const response = await fetch("https://freeipapi.com/api/json", { mode: "cors" });
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
      const imageData = await _getWeatherImage(`${result.current.condition.text} sky`);
      const currentData = result.current,
        locationData = result.location,
        forecast = result.forecast.forecastday,
        emptyContent = "_ _ _";

      return {
        imageData: {
          photographer: imageData.photographer,
          photographerURL: imageData.photographer_url,
          url: imageData.src.medium,
          pageURL: imageData.url,
        },
        city: locationData.name || emptyContent,
        country: `${locationData.region || emptyContent}, ${
          locationData.country || emptyContent
        }`,
        time: format_time__WEBPACK_IMPORTED_MODULE_3___default().getFormattedTime(locationData.localtime.split(" ")[1]),
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

  async function _getWeatherImage(query) {
    try {
      const data = await client.photos
        .search({ query, per_page: 1 })
        .then((photos) => photos.photos[0]);
      return data;
    } catch (error) {
      console.error(error);
      return Promise.reject("Failed to get background image");
    }
  }

  return { init };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiHandler);


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
    hoursContr = document.querySelector("[data-js-name='hours-contr']"),
    bg = document.querySelector("[data-js-name='bg']"),
    imgCredit = document.querySelector("[data-js-name='img-credit']");

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
      node.setAttribute("data-addr", `${list[i].display_name}`);
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
      _removeAreasList();
      let elem = e.target;
      while (!elem.hasAttribute("data-addr")) elem = elem.parentElement;
      _searchData(elem.getAttribute("data-addr"));
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
    bg.style.backgroundImage = `url(${data.imageData.url})`;
    imgCredit.innerHTML = `Image by <a href="${data.imageData.photographerURL}" target="_blank"></a> on <a href="${data.imageData.pageURL}" target="_blank">Pexels</a>`;
    imgCredit.querySelector("a").textContent = data.imageData.photographer;

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/* harmony import */ var _modules_apiHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/apiHandler.js */ "./src/modules/apiHandler.js");
/* harmony import */ var _modules_display_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/display.js */ "./src/modules/display.js");



_modules_apiHandler_js__WEBPACK_IMPORTED_MODULE_0__["default"].init();
_modules_display_js__WEBPACK_IMPORTED_MODULE_1__["default"].init();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLHFCQUFxQjtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7QUFDRDtBQUNBLGlFQUFlLGlCQUFpQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDOU1qQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRztBQUNIO0FBQ0EsaUVBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7O0FDbEJyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsTUFBTTs7Ozs7O1VDUnJCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05pRDtBQUNJO0FBQ3JEO0FBQ0EsOERBQVU7QUFDViwyREFBaUIsUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Zvcm1hdC10aW1lL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3BleGVscy9kaXN0L21haW4ubW9kdWxlLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2FwaUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kaXNwbGF5LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvcHViU3ViRXZlbnRzLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbigpIHtcblxuICAvL1RPRE86IGFkZCBhYmlsaXR5IHRvIGRldGVjdCBoOm0gKHNpbmdsZSBkaWdpdCBmb3IgbWludXRlKVxuICB2YXIgcmUgPSAvXlxccyooWzAtOV18WzAtMV1bMC05XT98MlswLTRdPykoPz1cXHMqXFw6P1xccyooWzAtNV1bMC05XSk/XFxzKlteMC05LGEscF0qKFthLHBdKT9bXjAtOSxhLHBdKiQpL2k7XG5cbiAgdmFyIGdldEZvcm1hdHRlZFRpbWUgPSBmdW5jdGlvbih0aW1lU3RyLCBhbXBtU3dpdGNoKSB7XG5cbiAgICBhbXBtU3dpdGNoID0gYW1wbVN3aXRjaCA/IGFtcG1Td2l0Y2ggOiAnNjo1OSc7IFxuXG4gICAgdmFyIHIgPSByZS5leGVjKHRpbWVTdHIpOyBcbiAgICB2YXIgaG91ciA9IHIgJiYgclsxXSA/IE51bWJlcihyWzFdKSA6IHVuZGVmaW5lZDsgXG4gICAgdmFyIG1pbnV0ZXMgPSByICYmIHJbMl0gPyByWzJdIDogMDtcbiAgICBtaW51dGVzID0gKG1pbnV0ZXMgKyAnMCcpLnNsaWNlKDAsMik7IFxuICAgIG1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7ICBcbiAgICBtaW51dGVzID0gaXNOYU4obWludXRlcykgPyAwIDogbWludXRlczsgXG4gICAgdmFyIGFtcG0gPSByICYmIHJbM10gPyByWzNdIDogdW5kZWZpbmVkOyBcblxuICAgIHZhciBuZXdUaW1lOyBcblxuXG4gICAgLy8gaWYgbm8gaG91ciwgdGhlbiBjYW5ub3QgZGV0ZXJtaW5lIHRpbWUuIHJldHVybiB0aW1lU3RyIGFzIHBhc3NlZCBpblxuICAgIGlmKGhvdXIgPT09IHVuZGVmaW5lZCB8fCBpc05hTihob3VyKSB8fCBob3VyID4gMjQgfHwgbWludXRlcyA+IDU5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyBcbiAgICB9XG5cbiAgICAvLyBpZiBob3VyIGlzOiBcbiAgICAvLyAwIG9yIDI0OiBob3VyPTEyLCBhbXBtPUFNIGlmIHVuZGVmaW5lZFxuICAgIC8vIDEtMTEgOiAgYW1wbSBiYXNlZCBvbiBhbXBtU3dpdGNoXG4gICAgLy8gMTIgOiAgICBhbXBtID0gcG0gaWYgdW5kZWZpbmVkIFxuICAgIC8vIDEzLTIzIDogYW1wbSA9IHBtIGFsd2F5cyBldmVuIGlmIGFtcG0gPSBhbVxuXG4gICAgaWYoaG91ciA9PT0gMCB8fCBob3VyID09PSAyNCkge1xuICAgICAgaG91ciA9IDEyOyBcbiAgICAgIGlmKCFhbXBtKSB7XG4gICAgICAgIGFtcG0gPSAnQU0nOyBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihob3VyID4gMCAmJiBob3VyIDwgMTIpIHtcbiAgICAgIGlmICghYW1wbSkge1xuICAgICAgICB2YXIgc3cgPSByZS5leGVjKGFtcG1Td2l0Y2gpO1xuICAgICAgICB2YXIgYW1wbVN3aXRjaEhvdXIgPSBzdyAmJiBzd1sxXSA/IHN3WzFdIDogdW5kZWZpbmVkOyBcbiAgICAgICAgdmFyIGFtcG1Td2l0Y2hNaW51dGUgPSBzdyAmJiBzd1syXSA/IHN3WzJdIDogdW5kZWZpbmVkOyBcblxuICAgICAgICBpZihob3VyID4gYW1wbVN3aXRjaEhvdXIgfHwgXG4gICAgICAgICAgKGhvdXIgPT09IGFtcG1Td2l0Y2hIb3VyICYmIG1pbnV0ZSA+IGFtcG1Td2l0Y2hNaW51dGUpKSB7XG4gICAgICAgICAgYW1wbSA9ICdBTSc7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGhvdXIgPT09MTIpIHtcbiAgICAgIGFtcG0gPSAhYW1wbSA/ICdQTScgOiBhbXBtOyBcbiAgICB9XG5cbiAgICBpZihob3VyID4gMTIpIHtcbiAgICAgIGFtcG0gPSAnUE0nOyBcbiAgICAgIGhvdXIgPSBob3VyIC0gMTIgOyBcbiAgICB9IGVsc2UgeyBcbiAgICAgIGFtcG0gPSBhbXBtID09PSAnQScgfHwgYW1wbSA9PT0gJ2EnID8gJ0FNJyA6IGFtcG07XG4gICAgICBhbXBtID0gYW1wbSA9PT0gJ1AnIHx8IGFtcG0gPT09ICdwJyA/ICdQTScgOiBhbXBtO1xuICAgIH1cblxuICAgIG1pbnV0ZXMgPSAoJzAnICsgbWludXRlcykuc2xpY2UoLTIpOyBcblxuICAgIG5ld1RpbWUgPSBob3VyICsgJzonICsgbWludXRlcyArICcgJyArIGFtcG07XG5cbiAgICByZXR1cm4gbmV3VGltZTsgIFxuXG4gIH07XG5cblxuICB2YXIgZm9ybWF0VGltZSA9IHtcbiAgICByZTogcmUsIFxuICAgIGdldEZvcm1hdHRlZFRpbWU6IGdldEZvcm1hdHRlZFRpbWVcbiAgfTsgXG4gIHZhciByb290ID0gdGhpczsgXG4gIC8vIHRoYW5rcyBhc3luYzogXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFRpbWU7XG4gICAgfVxuICAgIGV4cG9ydHMuZm9ybWF0VGltZSA9IGZvcm1hdFRpbWU7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5mb3JtYXRUaW1lID0gZm9ybWF0VGltZTtcbiAgfVxuXG59KSgpO1xuXG4iLCIvLyB0aGUgd2hhdHdnLWZldGNoIHBvbHlmaWxsIGluc3RhbGxzIHRoZSBmZXRjaCgpIGZ1bmN0aW9uXG4vLyBvbiB0aGUgZ2xvYmFsIG9iamVjdCAod2luZG93IG9yIHNlbGYpXG4vL1xuLy8gUmV0dXJuIHRoYXQgYXMgdGhlIGV4cG9ydCBmb3IgdXNlIGluIFdlYnBhY2ssIEJyb3dzZXJpZnkgZXRjLlxucmVxdWlyZSgnd2hhdHdnLWZldGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHNlbGYuZmV0Y2guYmluZChzZWxmKTtcbiIsInZhciB0PXtwaG90bzpcImh0dHBzOi8vYXBpLnBleGVscy5jb20vdjEvXCIsdmlkZW86XCJodHRwczovL2FwaS5wZXhlbHMuY29tL3ZpZGVvcy9cIixjb2xsZWN0aW9uczpcImh0dHBzOi8vYXBpLnBleGVscy5jb20vdjEvY29sbGVjdGlvbnMvXCJ9O2Z1bmN0aW9uIHIocixlKXt2YXIgbj17bWV0aG9kOlwiR0VUXCIsaGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwiLFwiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCIsXCJVc2VyLUFnZW50XCI6XCJQZXhlbHMvSmF2YVNjcmlwdFwiLEF1dGhvcml6YXRpb246cn19LG89dFtlXTtyZXR1cm4gZnVuY3Rpb24odCxyKXtyZXR1cm4gZmV0Y2goXCJcIitvK3QrXCI/XCIrZnVuY3Rpb24odCl7cmV0dXJuIE9iamVjdC5rZXlzKHQpLm1hcChmdW5jdGlvbihyKXtyZXR1cm4gcitcIj1cIit0W3JdfSkuam9pbihcIiZcIil9KHJ8fHt9KSxuKS50aGVuKGZ1bmN0aW9uKHQpe2lmKCF0Lm9rKXRocm93IG5ldyBFcnJvcih0LnN0YXR1c1RleHQpO3JldHVybiB0Lmpzb24oKX0pfX1mdW5jdGlvbiBlKHQpe3ZhciBlPXIodCxcImNvbGxlY3Rpb25zXCIpO3JldHVybnthbGw6ZnVuY3Rpb24odCl7cmV0dXJuIHZvaWQgMD09PXQmJih0PXt9KSxlKFwiXCIsdCl9LG1lZGlhOmZ1bmN0aW9uKHQpe3ZhciByPXQuaWQsbj1mdW5jdGlvbih0LHIpe2lmKG51bGw9PXQpcmV0dXJue307dmFyIGUsbixvPXt9LGk9T2JqZWN0LmtleXModCk7Zm9yKG49MDtuPGkubGVuZ3RoO24rKylyLmluZGV4T2YoZT1pW25dKT49MHx8KG9bZV09dFtlXSk7cmV0dXJuIG99KHQsW1wiaWRcIl0pO3JldHVybiBlKFwiXCIrcixuKX0sZmVhdHVyZWQ6ZnVuY3Rpb24odCl7cmV0dXJuIHZvaWQgMD09PXQmJih0PXt9KSxlKFwiZmVhdHVyZWRcIix0KX19fWZ1bmN0aW9uIG4odCl7cmV0dXJuISghdHx8IXQucGhvdG9zKX12YXIgbz17X19wcm90b19fOm51bGwsaXNQaG90b3M6bixpc1ZpZGVvczpmdW5jdGlvbih0KXtyZXR1cm4hKCF0fHwhdC52aWRlb3MpfSxpc0Vycm9yOmZ1bmN0aW9uKHQpe3JldHVybiEhdC5lcnJvcn19O2Z1bmN0aW9uIGkodCl7dmFyIGU9cih0LFwicGhvdG9cIik7cmV0dXJue3NlYXJjaDpmdW5jdGlvbih0KXtyZXR1cm4gZShcIi9zZWFyY2hcIix0KX0sY3VyYXRlZDpmdW5jdGlvbih0KXtyZXR1cm4gdm9pZCAwPT09dCYmKHQ9e30pLGUoXCIvY3VyYXRlZFwiLHQpfSxzaG93OmZ1bmN0aW9uKHQpe3JldHVybiBlKFwiL3Bob3Rvcy9cIit0LmlkKX0scmFuZG9tOmZ1bmN0aW9uKCl7dHJ5e3ZhciB0PU1hdGguZmxvb3IoMWUzKk1hdGgucmFuZG9tKCkpO3JldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5jdXJhdGVkKHtwYWdlOnQscGVyX3BhZ2U6MX0pKS50aGVuKGZ1bmN0aW9uKHQpe3JldHVybiBuKHQpP3QucGhvdG9zWzBdOnR9KX1jYXRjaCh0KXtyZXR1cm4gUHJvbWlzZS5yZWplY3QodCl9fX19ZnVuY3Rpb24gdSh0KXt2YXIgZT1yKHQsXCJ2aWRlb1wiKTtyZXR1cm57c2VhcmNoOmZ1bmN0aW9uKHQpe3JldHVybiBlKFwiL3NlYXJjaFwiLHQpfSxwb3B1bGFyOmZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDA9PT10JiYodD17fSksZShcIi9wb3B1bGFyXCIsdCl9LHNob3c6ZnVuY3Rpb24odCl7cmV0dXJuIGUoXCIvdmlkZW9zL1wiK3QuaWQpfX19ZnVuY3Rpb24gYyh0KXtpZighdHx8XCJzdHJpbmdcIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFuIEFwaUtleSBtdXN0IGJlIHByb3ZpZGVkIHdoZW4gaW5pdGlhdGluZyB0aGUgUGV4ZWwncyBjbGllbnQuXCIpO3JldHVybnt0eXBlQ2hlY2tlcnM6byxwaG90b3M6aSh0KSx2aWRlb3M6dSh0KSxjb2xsZWN0aW9uczplKHQpfX1yZXF1aXJlKFwiaXNvbW9ycGhpYy1mZXRjaFwiKTtleHBvcnR7YyBhcyBjcmVhdGVDbGllbnR9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5tb2R1bGUuanMubWFwXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgKi9cbnZhciBnID1cbiAgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzKSB8fFxuICAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsKSB8fFxuICB7fVxuXG52YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBnLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gZyAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gZyAmJlxuICAgICdCbG9iJyBpbiBnICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBnLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBnXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+IV0vaS50ZXN0KG5hbWUpIHx8IG5hbWUgPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWU6IFwiJyArIG5hbWUgKyAnXCInKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgaWYgKGhlYWRlci5sZW5ndGggIT0gMikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIZWFkZXJzIGNvbnN0cnVjdG9yOiBleHBlY3RlZCBuYW1lL3ZhbHVlIHBhaXIgdG8gYmUgbGVuZ3RoIDIsIGZvdW5kJyArIGhlYWRlci5sZW5ndGgpXG4gICAgICB9XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5fbm9Cb2R5KSByZXR1cm5cbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICB2YXIgbWF0Y2ggPSAvY2hhcnNldD0oW0EtWmEtejAtOV8tXSspLy5leGVjKGJsb2IudHlwZSlcbiAgdmFyIGVuY29kaW5nID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICd1dGYtOCdcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYiwgZW5jb2RpbmcpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIC8qXG4gICAgICBmZXRjaC1tb2NrIHdyYXBzIHRoZSBSZXNwb25zZSBvYmplY3QgaW4gYW4gRVM2IFByb3h5IHRvXG4gICAgICBwcm92aWRlIHVzZWZ1bCB0ZXN0IGhhcm5lc3MgZmVhdHVyZXMgc3VjaCBhcyBmbHVzaC4gSG93ZXZlciwgb25cbiAgICAgIEVTNSBicm93c2VycyB3aXRob3V0IGZldGNoIG9yIFByb3h5IHN1cHBvcnQgcG9sbHlmaWxscyBtdXN0IGJlIHVzZWQ7XG4gICAgICB0aGUgcHJveHktcG9sbHlmaWxsIGlzIHVuYWJsZSB0byBwcm94eSBhbiBhdHRyaWJ1dGUgdW5sZXNzIGl0IGV4aXN0c1xuICAgICAgb24gdGhlIG9iamVjdCBiZWZvcmUgdGhlIFByb3h5IGlzIGNyZWF0ZWQuIFRoaXMgY2hhbmdlIGVuc3VyZXNcbiAgICAgIFJlc3BvbnNlLmJvZHlVc2VkIGV4aXN0cyBvbiB0aGUgaW5zdGFuY2UsIHdoaWxlIG1haW50YWluaW5nIHRoZVxuICAgICAgc2VtYW50aWMgb2Ygc2V0dGluZyBSZXF1ZXN0LmJvZHlVc2VkIGluIHRoZSBjb25zdHJ1Y3RvciBiZWZvcmVcbiAgICAgIF9pbml0Qm9keSBpcyBjYWxsZWQuXG4gICAgKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1hc3NpZ25cbiAgICB0aGlzLmJvZHlVc2VkID0gdGhpcy5ib2R5VXNlZFxuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fbm9Cb2R5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICB2YXIgaXNDb25zdW1lZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAoaXNDb25zdW1lZCkge1xuICAgICAgICByZXR1cm4gaXNDb25zdW1lZFxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodGhpcy5fYm9keUFycmF5QnVmZmVyKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5idWZmZXIuc2xpY2UoXG4gICAgICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIuYnl0ZU9mZnNldCxcbiAgICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5ieXRlT2Zmc2V0ICsgdGhpcy5fYm9keUFycmF5QnVmZmVyLmJ5dGVMZW5ndGhcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgYXMgQXJyYXlCdWZmZXInKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydDT05ORUNUJywgJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BBVENIJywgJ1BPU1QnLCAnUFVUJywgJ1RSQUNFJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlcXVlc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHVzZSB0aGUgXCJuZXdcIiBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi4nKVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWwgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJ0Fib3J0Q29udHJvbGxlcicgaW4gZykge1xuICAgICAgdmFyIGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICByZXR1cm4gY3RybC5zaWduYWw7XG4gICAgfVxuICB9KCkpO1xuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcblxuICBpZiAodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICBpZiAob3B0aW9ucy5jYWNoZSA9PT0gJ25vLXN0b3JlJyB8fCBvcHRpb25zLmNhY2hlID09PSAnbm8tY2FjaGUnKSB7XG4gICAgICAvLyBTZWFyY2ggZm9yIGEgJ18nIHBhcmFtZXRlciBpbiB0aGUgcXVlcnkgc3RyaW5nXG4gICAgICB2YXIgcmVQYXJhbVNlYXJjaCA9IC8oWz8mXSlfPVteJl0qL1xuICAgICAgaWYgKHJlUGFyYW1TZWFyY2gudGVzdCh0aGlzLnVybCkpIHtcbiAgICAgICAgLy8gSWYgaXQgYWxyZWFkeSBleGlzdHMgdGhlbiBzZXQgdGhlIHZhbHVlIHdpdGggdGhlIGN1cnJlbnQgdGltZVxuICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLnJlcGxhY2UocmVQYXJhbVNlYXJjaCwgJyQxXz0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGEgbmV3ICdfJyBwYXJhbWV0ZXIgdG8gdGhlIGVuZCB3aXRoIHRoZSBjdXJyZW50IHRpbWVcbiAgICAgICAgdmFyIHJlUXVlcnlTdHJpbmcgPSAvXFw/L1xuICAgICAgICB0aGlzLnVybCArPSAocmVRdWVyeVN0cmluZy50ZXN0KHRoaXMudXJsKSA/ICcmJyA6ICc/JykgKyAnXz0nICsgbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICAvLyBBdm9pZGluZyBzcGxpdCB2aWEgcmVnZXggdG8gd29yayBhcm91bmQgYSBjb21tb24gSUUxMSBidWcgd2l0aCB0aGUgY29yZS1qcyAzLjYuMCByZWdleCBwb2x5ZmlsbFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoL2lzc3Vlcy83NDhcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzc1MVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzXG4gICAgLnNwbGl0KCdcXHInKVxuICAgIC5tYXAoZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICByZXR1cm4gaGVhZGVyLmluZGV4T2YoJ1xcbicpID09PSAwID8gaGVhZGVyLnN1YnN0cigxLCBoZWFkZXIubGVuZ3RoKSA6IGhlYWRlclxuICAgIH0pXG4gICAgLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdSZXNwb25zZSAnICsgZXJyb3IubWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZXNwb25zZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQbGVhc2UgdXNlIHRoZSBcIm5ld1wiIG9wZXJhdG9yLCB0aGlzIERPTSBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLicpXG4gIH1cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgaWYgKHRoaXMuc3RhdHVzIDwgMjAwIHx8IHRoaXMuc3RhdHVzID4gNTk5KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdSZXNwb25zZSc6IFRoZSBzdGF0dXMgcHJvdmlkZWQgKDApIGlzIG91dHNpZGUgdGhlIHJhbmdlIFsyMDAsIDU5OV0uXCIpXG4gIH1cbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSBvcHRpb25zLnN0YXR1c1RleHQgPT09IHVuZGVmaW5lZCA/ICcnIDogJycgKyBvcHRpb25zLnN0YXR1c1RleHRcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMjAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnN0YXR1cyA9IDBcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBnLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgLy8gVGhpcyBjaGVjayBpZiBzcGVjaWZpY2FsbHkgZm9yIHdoZW4gYSB1c2VyIGZldGNoZXMgYSBmaWxlIGxvY2FsbHkgZnJvbSB0aGUgZmlsZSBzeXN0ZW1cbiAgICAgIC8vIE9ubHkgaWYgdGhlIHN0YXR1cyBpcyBvdXQgb2YgYSBub3JtYWwgcmFuZ2VcbiAgICAgIGlmIChyZXF1ZXN0LnVybC5zdGFydHNXaXRoKCdmaWxlOi8vJykgJiYgKHhoci5zdGF0dXMgPCAyMDAgfHwgeGhyLnN0YXR1cyA+IDU5OSkpIHtcbiAgICAgICAgb3B0aW9ucy5zdGF0dXMgPSAyMDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLnN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9LCAwKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXhVcmwodXJsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdXJsID09PSAnJyAmJiBnLmxvY2F0aW9uLmhyZWYgPyBnLmxvY2F0aW9uLmhyZWYgOiB1cmxcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHVybFxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCBmaXhVcmwocmVxdWVzdC51cmwpLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhocikge1xuICAgICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzdXBwb3J0LmFycmF5QnVmZmVyXG4gICAgICApIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcidcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW5pdCAmJiB0eXBlb2YgaW5pdC5oZWFkZXJzID09PSAnb2JqZWN0JyAmJiAhKGluaXQuaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMgfHwgKGcuSGVhZGVycyAmJiBpbml0LmhlYWRlcnMgaW5zdGFuY2VvZiBnLkhlYWRlcnMpKSkge1xuICAgICAgdmFyIG5hbWVzID0gW107XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhpbml0LmhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBuYW1lcy5wdXNoKG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIG5vcm1hbGl6ZVZhbHVlKGluaXQuaGVhZGVyc1tuYW1lXSkpXG4gICAgICB9KVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghZy5mZXRjaCkge1xuICBnLmZldGNoID0gZmV0Y2hcbiAgZy5IZWFkZXJzID0gSGVhZGVyc1xuICBnLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIGcuUmVzcG9uc2UgPSBSZXNwb25zZVxufSIsImltcG9ydCBwdWJTdWIgZnJvbSBcIi4vcHViU3ViLmpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vcHViU3ViRXZlbnRzLmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJwZXhlbHNcIjtcclxuaW1wb3J0IGZ0IGZyb20gXCJmb3JtYXQtdGltZVwiO1xyXG5cclxuY29uc3QgYXBpSGFuZGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVNlYXJjaGVkLCBfc2VhcmNoRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YUlucHV0ZWQsIF9nZXRBcmVhc0xpc3QpO1xyXG4gIGxldCBjbGllbnQ7XHJcbiAgXHJcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNsaWVudCA9IGNyZWF0ZUNsaWVudCgnT0dpaDJDaGx4Y2FLWlRXODdpeFNGaHQzYlpUYmJuaEhSN1FOTjY4OHJvRjljcmd4WThjS3ROVnInKTtcclxuICAgIF9nZXRVc2VyQ29vcmQoKVxyXG4gICAgICAudGhlbigoaXBEYXRhKSA9PiBfc2VhcmNoRGF0YShgJHtpcERhdGEubGF0aXR1ZGV9LCR7aXBEYXRhLmxvbmdpdHVkZX1gKSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIF9zZWFyY2hEYXRhKFwiVGV4YXNcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NlYXJjaERhdGEocXVlcnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfZ2V0UGFyc2VkRGF0YShxdWVyeSk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5kYXRhUmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGB3ZWF0aGVySGFuZGxlcjogJHtlcnJ9YCk7XHJcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKGV2ZW50cy5zZWFyY2hGYWlsZWQsIGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRBcmVhc0xpc3QoaW5wdXQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPSR7aW5wdXR9YCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBwdWJTdWIucHVibGlzaChldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIGRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldEFyZWFzTGlzdDogRmFpbGVkIVwiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldFVzZXJDb29yZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2ZyZWVpcGFwaS5jb20vYXBpL2pzb25cIiwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRmFpbGVkIHRvIGdldCB1c2VyIElQIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9YzUyZWFlY2FmZTYyNGFiNjkwODIwMjc0OTIzMjEwOCZkYXlzPTMmcT0ke2xvY2F0aW9ufWA7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZ2V0UGFyc2VkRGF0YShsb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEN1cnJlbnREYXRhKGxvY2F0aW9uKTtcclxuICAgICAgY29uc3QgaW1hZ2VEYXRhID0gYXdhaXQgX2dldFdlYXRoZXJJbWFnZShgJHtyZXN1bHQuY3VycmVudC5jb25kaXRpb24udGV4dH0gc2t5YCk7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRhID0gcmVzdWx0LmN1cnJlbnQsXHJcbiAgICAgICAgbG9jYXRpb25EYXRhID0gcmVzdWx0LmxvY2F0aW9uLFxyXG4gICAgICAgIGZvcmVjYXN0ID0gcmVzdWx0LmZvcmVjYXN0LmZvcmVjYXN0ZGF5LFxyXG4gICAgICAgIGVtcHR5Q29udGVudCA9IFwiXyBfIF9cIjtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VEYXRhOiB7XHJcbiAgICAgICAgICBwaG90b2dyYXBoZXI6IGltYWdlRGF0YS5waG90b2dyYXBoZXIsXHJcbiAgICAgICAgICBwaG90b2dyYXBoZXJVUkw6IGltYWdlRGF0YS5waG90b2dyYXBoZXJfdXJsLFxyXG4gICAgICAgICAgdXJsOiBpbWFnZURhdGEuc3JjLm1lZGl1bSxcclxuICAgICAgICAgIHBhZ2VVUkw6IGltYWdlRGF0YS51cmwsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaXR5OiBsb2NhdGlvbkRhdGEubmFtZSB8fCBlbXB0eUNvbnRlbnQsXHJcbiAgICAgICAgY291bnRyeTogYCR7bG9jYXRpb25EYXRhLnJlZ2lvbiB8fCBlbXB0eUNvbnRlbnR9LCAke1xyXG4gICAgICAgICAgbG9jYXRpb25EYXRhLmNvdW50cnkgfHwgZW1wdHlDb250ZW50XHJcbiAgICAgICAgfWAsXHJcbiAgICAgICAgdGltZTogZnQuZ2V0Rm9ybWF0dGVkVGltZShsb2NhdGlvbkRhdGEubG9jYWx0aW1lLnNwbGl0KFwiIFwiKVsxXSksXHJcbiAgICAgICAgZGF0ZTogbmV3IERhdGUobG9jYXRpb25EYXRhLmxvY2FsdGltZS5zcGxpdChcIiBcIilbMF0pLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgIG1ldHJpY1RlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfY30gwrBDYCxcclxuICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2N1cnJlbnREYXRhLnRlbXBfZn0gwrBGYCxcclxuICAgICAgICBpY29uOiBjdXJyZW50RGF0YS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICBjb25kaXRpb25UZXh0OiBjdXJyZW50RGF0YS5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBtZXRyaWNXaW5kOiBgJHtjdXJyZW50RGF0YS53aW5kX2twaH0ga20vaCwgJHtjdXJyZW50RGF0YS53aW5kX2Rpcn1gLFxyXG4gICAgICAgIGltcGVyaWFsV2luZDogYCR7Y3VycmVudERhdGEud2luZF9tcGh9IG1pbGVzL2gsICR7Y3VycmVudERhdGEud2luZF9kaXJ9YCxcclxuICAgICAgICBtZXRyaWNQcmVzc3VyZTogYCR7Y3VycmVudERhdGEucHJlc3N1cmVfbWJ9IG1iYCxcclxuICAgICAgICBpbXBlcmlhbFByZXNzdXJlOiBgJHtjdXJyZW50RGF0YS5wcmVzc3VyZV9pbn0gaW5gLFxyXG4gICAgICAgIGh1bWlkaXR5OiBjdXJyZW50RGF0YS5odW1pZGl0eSxcclxuICAgICAgICBtZXRyaWNWaXNpYmlsaXR5OiBgJHtjdXJyZW50RGF0YS52aXNfa219IGttYCxcclxuICAgICAgICBpbXBlcmlhbFZpc2liaWxpdHk6IGAke1xyXG4gICAgICAgICAgcGFyc2VJbnQoY3VycmVudERhdGEudmlzX21pbGVzKSA9PT0gMVxyXG4gICAgICAgICAgICA/IGAke2N1cnJlbnREYXRhLnZpc19taWxlc30gbWlsZWBcclxuICAgICAgICAgICAgOiBgJHtjdXJyZW50RGF0YS52aXNfbWlsZXN9IG1pbGVzYFxyXG4gICAgICAgIH1gLFxyXG4gICAgICAgIHV2OiBjdXJyZW50RGF0YS51dixcclxuICAgICAgICBtZXRyaWNHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X2twaH0ga20vaGAsXHJcbiAgICAgICAgaW1wZXJpYWxHdXN0OiBgJHtjdXJyZW50RGF0YS5ndXN0X21waH0gbWlsZXMvaGAsXHJcbiAgICAgICAgZGF5c0ZvcmVjYXN0OiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzBdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFswXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzBdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzBdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzFdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFsxXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzFdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzFdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZvcmVjYXN0WzJdLmRhdGUpLnRvRGF0ZVN0cmluZygpLFxyXG4gICAgICAgICAgICBtZXRyaWNUZW1wOiBgJHtmb3JlY2FzdFsyXS5kYXkuYXZndGVtcF9jfSDCsENgLFxyXG4gICAgICAgICAgICBpbXBlcmlhbFRlbXA6IGAke2ZvcmVjYXN0WzJdLmRheS5hdmd0ZW1wX2Z9IMKwRmAsXHJcbiAgICAgICAgICAgIGljb246IGZvcmVjYXN0WzJdLmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBob3Vyc0ZvcmVjYXN0OiBbXHJcbiAgICAgICAgICAuLi5mb3JlY2FzdFswXS5ob3VyLFxyXG4gICAgICAgICAgLi4uZm9yZWNhc3RbMV0uaG91cixcclxuICAgICAgICAgIC4uLmZvcmVjYXN0WzJdLmhvdXIsXHJcbiAgICAgICAgXSxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJDb3VsZCBub3QgbG9hZCBkYXRhIVwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9nZXRXZWF0aGVySW1hZ2UocXVlcnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBjbGllbnQucGhvdG9zXHJcbiAgICAgICAgLnNlYXJjaCh7IHF1ZXJ5LCBwZXJfcGFnZTogMSB9KVxyXG4gICAgICAgIC50aGVuKChwaG90b3MpID0+IHBob3Rvcy5waG90b3NbMF0pO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGYWlsZWQgdG8gZ2V0IGJhY2tncm91bmQgaW1hZ2VcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBpbml0IH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcGlIYW5kbGVyO1xyXG4iLCJpbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YlN1Yi5qc1wiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL3B1YlN1YkV2ZW50cy5qc1wiO1xyXG5pbXBvcnQgZnQgZnJvbSBcImZvcm1hdC10aW1lXCI7XHJcblxyXG5jb25zdCBkaXNwbGF5Q29udHJvbGxlciA9ICgoKSA9PiB7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuZGF0YVJlY2lldmVkLCBfcmVuZGVyRGF0YSk7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuc2VhcmNoRmFpbGVkLCBfcmVtb3ZlbG9hZGluZ1NjcmVlbik7XHJcbiAgcHViU3ViLnN1YnNjcmliZShldmVudHMuYXJlYXNMaXN0UmVjaWV2ZWQsIF91cGRhdGVBcmVhc0xpc3QpO1xyXG5cclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nc2VhcmNoLWJveCddXCIpLFxyXG4gICAgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3NlYXJjaCddXCIpLFxyXG4gICAgYXJlYXNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2FyZWFzLWxpc3QnXVwiKSxcclxuICAgIGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nY2l0eSddXCIpLFxyXG4gICAgY2l0eTIgPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjaXR5MiddXCIpLFxyXG4gICAgY291bnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjb3VudHJ5J11cIiksXHJcbiAgICB0aW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3RpbWUnXVwiKSxcclxuICAgIGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF0ZSddXCIpLFxyXG4gICAgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd0ZW1wJ11cIiksXHJcbiAgICBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItaWNvbiddXCIpLFxyXG4gICAgY29uZGl0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3dlYXRoZXItY29uZGl0aW9uJ11cIiksXHJcbiAgICB1bml0c1N3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSd1bml0cy1zd2l0Y2gnXVwiKSxcclxuICAgIHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nd2luZCddXCIpLFxyXG4gICAgcHJlc3N1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0ncHJlc3N1cmUnXVwiKSxcclxuICAgIGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2h1bWlkaXR5J11cIiksXHJcbiAgICB2aXNpYmlsaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3Zpc2liaWxpdHknXVwiKSxcclxuICAgIHV2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J3V2J11cIiksXHJcbiAgICBndXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J2d1c3QnXVwiKSxcclxuICAgIGxvYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbG9hZGluZyddXCIpLFxyXG4gICAgbXNnQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWpzLW5hbWU9J21zZy1ib3gnXVwiKSxcclxuICAgIG1zZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nbXNnLXRleHQnXVwiKSxcclxuICAgIGNhbmNlbE1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdjYW5jZWwtbXNnJ11cIiksXHJcbiAgICBkYXlzQ29udHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nZGF5cy1jb250ciddXCIpLFxyXG4gICAgaG91cnNDb250ciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdob3Vycy1jb250ciddXCIpLFxyXG4gICAgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtanMtbmFtZT0nYmcnXVwiKSxcclxuICAgIGltZ0NyZWRpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1qcy1uYW1lPSdpbWctY3JlZGl0J11cIik7XHJcblxyXG4gIGxldCB1c2VyQ2hvaWNlSW1wZXJpYWwgPSBmYWxzZSwgY2FjaGVkRGF0YTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9hZGRFdmVudHMoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hZGRFdmVudHMoKSB7XHJcbiAgICBzZWFyY2hCb3guYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9jaGVja0lucHV0KTtcclxuICAgIHNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3F1ZXJ5QWRkcmVzcyk7XHJcbiAgICB1bml0c1N3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3N3aXRjaFVuaXRzKTtcclxuICAgIGNhbmNlbE1zZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3JlbW92ZU1zZyk7XHJcbiAgICBhcmVhc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9xdWVyeUFyZWFDb29yZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2hlY2tJbnB1dChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID49IDMpIHtcclxuICAgICAgcHViU3ViLnB1Ymxpc2goZXZlbnRzLmRhdGFJbnB1dGVkLCBlLnRhcmdldC52YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfcmVtb3ZlQXJlYXNMaXN0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF91cGRhdGVBcmVhc0xpc3QobGlzdCkge1xyXG4gICAgYXJlYXNMaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiZGF0YS1hZGRyXCIsIGAke2xpc3RbaV0uZGlzcGxheV9uYW1lfWApO1xyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk05LjUsM0E2LjUsNi41IDAgMCwxIDE2LDkuNUMxNiwxMS4xMSAxNS40MSwxMi41OSAxNC40NCwxMy43M0wxNC43MSwxNEgxNS41TDIwLjUsMTlMMTksMjAuNUwxNCwxNS41VjE0LjcxTDEzLjczLDE0LjQ0QzEyLjU5LDE1LjQxIDExLjExLDE2IDkuNSwxNkE2LjUsNi41IDAgMCwxIDMsOS41QTYuNSw2LjUgMCAwLDEgOS41LDNNOS41LDVDNyw1IDUsNyA1LDkuNUM1LDEyIDcsMTQgOS41LDE0QzEyLDE0IDE0LDEyIDE0LDkuNUMxNCw3IDEyLDUgOS41LDVaXCIgLz48L3N2Zz5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImFyZWEtbmFtZVwiPiR7bGlzdFtpXS5kaXNwbGF5X25hbWV9PC9zcGFuPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXRlZ29yeVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke2xpc3RbaV0uY2xhc3N9PC9zcGFuPjxzcGFuPi88L3NwYW4+PHNwYW4+JHtsaXN0W2ldLnR5cGV9PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICAgIGFyZWFzTGlzdC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGlzcGxheUFyZWFzTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3F1ZXJ5QWRkcmVzcyhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IGUudGFyZ2V0LmZvcm07XHJcbiAgICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyhuZXcgRm9ybURhdGEoZm9ybSkpO1xyXG5cclxuICAgIGlmIChkYXRhLnEpIF9zZWFyY2hEYXRhKGRhdGEucSk7XHJcbiAgICBpbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICBpbnB1dC5ibHVyKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9xdWVyeUFyZWFDb29yZChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xyXG4gICAgICBfcmVtb3ZlQXJlYXNMaXN0KCk7XHJcbiAgICAgIGxldCBlbGVtID0gZS50YXJnZXQ7XHJcbiAgICAgIHdoaWxlICghZWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWFkZHJcIikpIGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIF9zZWFyY2hEYXRhKGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1hZGRyXCIpKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3NlYXJjaERhdGEoYWRkcikge1xyXG4gICAgX2Rpc3BsYXlMb2FkaW5nU2NyZWVuKCk7XHJcbiAgICBwdWJTdWIucHVibGlzaChldmVudHMuZGF0YVNlYXJjaGVkLCBhZGRyKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N3aXRjaFVuaXRzKCkge1xyXG4gICAgaWYgKGNhY2hlZERhdGEpIHtcclxuICAgICAgdXNlckNob2ljZUltcGVyaWFsID0gIXVzZXJDaG9pY2VJbXBlcmlhbDtcclxuICAgICAgX3JlbmRlckRhdGEoY2FjaGVkRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVuZGVyRGF0YShkYXRhLCBpc0ltcGVyaWFsID0gdXNlckNob2ljZUltcGVyaWFsKSB7XHJcbiAgICBfcmVuZGVyQ3VycmVudERhdGEoZGF0YSwgaXNJbXBlcmlhbCk7XHJcbiAgICBfcmVuZGVyRm9yZWNhc3REYXRhKGRhdGEuZGF5c0ZvcmVjYXN0LCBpc0ltcGVyaWFsKTtcclxuICAgIF9yZW5kZXJIb3Vyc0RhdGEoZGF0YS5ob3Vyc0ZvcmVjYXN0LCBpc0ltcGVyaWFsKTtcclxuICAgIF9yZW1vdmVsb2FkaW5nU2NyZWVuKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW5kZXJDdXJyZW50RGF0YShkYXRhLCBpc0ltcGVyaWFsKSB7XHJcbiAgICBjYWNoZWREYXRhID0gZGF0YTtcclxuXHJcbiAgICBjaXR5LnRleHRDb250ZW50ID0gZGF0YS5jaXR5O1xyXG4gICAgY2l0eTIudGV4dENvbnRlbnQgPSBgJHtkYXRhLmNpdHl9IHwgRm9yZWNhc3RgO1xyXG4gICAgY291bnRyeS50ZXh0Q29udGVudCA9IGRhdGEuY291bnRyeTtcclxuICAgIHRpbWUudGV4dENvbnRlbnQgPSBkYXRhLnRpbWU7XHJcbiAgICBkYXRlLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgaWNvbi5zcmMgPSBkYXRhLmljb247XHJcbiAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmNvbmRpdGlvblRleHQ7XHJcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XHJcbiAgICB1di50ZXh0Q29udGVudCA9IGRhdGEudXY7XHJcbiAgICBiZy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7ZGF0YS5pbWFnZURhdGEudXJsfSlgO1xyXG4gICAgaW1nQ3JlZGl0LmlubmVySFRNTCA9IGBJbWFnZSBieSA8YSBocmVmPVwiJHtkYXRhLmltYWdlRGF0YS5waG90b2dyYXBoZXJVUkx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPiBvbiA8YSBocmVmPVwiJHtkYXRhLmltYWdlRGF0YS5wYWdlVVJMfVwiIHRhcmdldD1cIl9ibGFua1wiPlBleGVsczwvYT5gO1xyXG4gICAgaW1nQ3JlZGl0LnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnRleHRDb250ZW50ID0gZGF0YS5pbWFnZURhdGEucGhvdG9ncmFwaGVyO1xyXG5cclxuICAgIC8vIEltcGVyaWFsIGZpZWxkc1xyXG4gICAgaWYgKGlzSW1wZXJpYWwpIHtcclxuICAgICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEuaW1wZXJpYWxUZW1wO1xyXG4gICAgICB3aW5kLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFdpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFByZXNzdXJlO1xyXG4gICAgICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gZGF0YS5pbXBlcmlhbFZpc2liaWxpdHk7XHJcbiAgICAgIGd1c3QudGV4dENvbnRlbnQgPSBkYXRhLmltcGVyaWFsR3VzdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1RlbXA7XHJcbiAgICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLm1ldHJpY1dpbmQ7XHJcbiAgICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gZGF0YS5tZXRyaWNQcmVzc3VyZTtcclxuICAgICAgdmlzaWJpbGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljVmlzaWJpbGl0eTtcclxuICAgICAgZ3VzdC50ZXh0Q29udGVudCA9IGRhdGEubWV0cmljR3VzdDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckZvcmVjYXN0RGF0YShmb3JlY2FzdCwgaXNJbXBlcmlhbCkge1xyXG4gICAgZGF5c0NvbnRyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBmb3JlY2FzdC5mb3JFYWNoKGRhdGEgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgbm9kZS5jbGFzc05hbWUgPSBcImRheXMgcm91bmRlZC1ib3JkZXJcIjtcclxuXHJcbiAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDxpbWcgc3JjPVwiJHtkYXRhLmljb259XCIgYWx0PVwid2VhdGhlci1pY29uXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRheS1kYXRlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRheS10ZW1wXCI+PC9kaXY+YDtcclxuICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiLmRheS1kYXRlXCIpLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xyXG4gICAgICBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZGF5LXRlbXBcIikudGV4dENvbnRlbnQgPSBpc0ltcGVyaWFsXHJcbiAgICAgICAgPyBkYXRhLmltcGVyaWFsVGVtcFxyXG4gICAgICAgIDogZGF0YS5tZXRyaWNUZW1wO1xyXG5cclxuICAgICAgZGF5c0NvbnRyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbmRlckhvdXJzRGF0YShob3VycywgaXNJbXBlcmlhbCkge1xyXG4gICAgaG91cnNDb250ci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgaG91cnMuZm9yRWFjaChvYmogPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgbm9kZS5jbGFzc05hbWUgPSBcImhvdXJzXCI7XHJcblxyXG4gICAgICBub2RlLmlubmVySFRNTCA9IGA8ZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPiR7ZnQuZ2V0Rm9ybWF0dGVkVGltZShvYmoudGltZS5zcGxpdChcIiBcIilbMV0pLnRvTG93ZXJDYXNlKCl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtvYmouY29uZGl0aW9uLmljb259XCIgYWx0PVwid2VhdGhlci1pY29uXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGVzXCI+JHtuZXcgRGF0ZShvYmoudGltZS5zcGxpdChcIiBcIilbMF0pLnRvRGF0ZVN0cmluZygpfTwvZGl2PmA7XHJcbiAgICAgIG5vZGUucXVlcnlTZWxlY3RvcihcIi50ZW1wXCIpLnRleHRDb250ZW50ID0gaXNJbXBlcmlhbFxyXG4gICAgICAgID8gYCR7b2JqLnRlbXBfZn3CsEZgXHJcbiAgICAgICAgOiBgJHtvYmoudGVtcF9jfcKwQ2A7XHJcbiAgICAgIFxyXG4gICAgICBob3Vyc0NvbnRyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5TG9hZGluZ1NjcmVlbigpIHtcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZWxvYWRpbmdTY3JlZW4obXNnKSB7XHJcbiAgICBpZiAobXNnKSBfZGlzcGxheU1zZyhtc2cpO1xyXG4gICAgbG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgX3JlbW92ZUFyZWFzTGlzdCgpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZGlzcGxheU1zZyhtc2cpIHtcclxuICAgIG1zZ1RleHQudGV4dENvbnRlbnQgPSBtc2c7XHJcbiAgICBtc2dCb3guY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgIHNldFRpbWVvdXQoX3JlbW92ZU1zZywgMzAwMCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9yZW1vdmVNc2coKSB7XHJcbiAgICBtc2dCb3guY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2Rpc3BsYXlBcmVhc0xpc3QoKSB7XHJcbiAgICBhcmVhc0xpc3QuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JlbW92ZUFyZWFzTGlzdCgpIHtcclxuICAgIGFyZWFzTGlzdC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgaW5pdCB9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUNvbnRyb2xsZXI7XHJcbiIsImNvbnN0IHB1YlN1YiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZXZlbnRzID0ge307XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XHJcbiAgICAgIGV2ZW50c1tldmVudF0gPyBldmVudHNbZXZlbnRdLnB1c2goZm4pIDogKGV2ZW50c1tldmVudF0gPSBbZm5dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHVuU3Vic2NyaWJlKGV2ZW50LCBmbikge1xyXG4gICAgICBpZiAoZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tldmVudF0gPSBldmVudHNbZXZlbnRdLmZpbHRlcigoZnVuYykgPT4gZnVuYyAhPT0gZm4pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwdWJsaXNoKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgIGlmIChldmVudHNbZXZlbnRdKSBldmVudHNbZXZlbnRdLmZvckVhY2goKGZuKSA9PiBmbihkYXRhKSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHVuU3Vic2NyaWJlLCBwdWJsaXNoIH07XHJcbiAgfSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiLCJjb25zdCBldmVudHMgPSB7XHJcbiAgICBkYXRhUmVjaWV2ZWQ6IFwiZGF0YVJlY2lldmVkXCIsXHJcbiAgICBkYXRhU2VhcmNoZWQ6IFwiZGF0YVNlYXJjaGVkXCIsXHJcbiAgICBzZWFyY2hGYWlsZWQ6IFwic2VhcmNoRmFpbGVkXCIsXHJcbiAgICBkYXRhSW5wdXRlZDogXCJkYXRhSW5wdXRlZFwiLFxyXG4gICAgYXJlYXNMaXN0UmVjaWV2ZWQ6IFwiYXJlYXNMaXN0UmVjaWV2ZWRcIixcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBhcGlIYW5kbGVyIGZyb20gXCIuL21vZHVsZXMvYXBpSGFuZGxlci5qc1wiO1xyXG5pbXBvcnQgZGlzcGxheUNvbnRyb2xsZXIgZnJvbSBcIi4vbW9kdWxlcy9kaXNwbGF5LmpzXCI7XHJcblxyXG5hcGlIYW5kbGVyLmluaXQoKTtcclxuZGlzcGxheUNvbnRyb2xsZXIuaW5pdCgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==