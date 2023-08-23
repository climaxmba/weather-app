/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
async function getForecastData(location) {
    const key = "c52eaecafe624ab6908202749232108";
    // Geocode https://geocode.maps.co/search?q=
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3`;
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

async function getSpecificData(selection, location) {
    const result = await getForecastData(location);
    selection ? console.log(result[selection]) : console.log(result);
}

getSpecificData(null, "9.008361,7.477578");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLElBQUksS0FBSyxTQUFTO0FBQ3JGO0FBQ0E7QUFDQSxvQ0FBb0MsY0FBYztBQUNsRDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIGdldEZvcmVjYXN0RGF0YShsb2NhdGlvbikge1xyXG4gICAgY29uc3Qga2V5ID0gXCJjNTJlYWVjYWZlNjI0YWI2OTA4MjAyNzQ5MjMyMTA4XCI7XHJcbiAgICAvLyBHZW9jb2RlIGh0dHBzOi8vZ2VvY29kZS5tYXBzLmNvL3NlYXJjaD9xPVxyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PSR7a2V5fSZxPSR7bG9jYXRpb259JmRheXM9M2A7XHJcbiAgICBsZXQgcmVzdWx0LCBkYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNwZWNpZmljRGF0YShzZWxlY3Rpb24sIGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRGb3JlY2FzdERhdGEobG9jYXRpb24pO1xyXG4gICAgc2VsZWN0aW9uID8gY29uc29sZS5sb2cocmVzdWx0W3NlbGVjdGlvbl0pIDogY29uc29sZS5sb2cocmVzdWx0KTtcclxufVxyXG5cclxuZ2V0U3BlY2lmaWNEYXRhKG51bGwsIFwiOS4wMDgzNjEsNy40Nzc1NzhcIik7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9