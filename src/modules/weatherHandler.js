import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";
import ft from "format-time";

const weather = (() => {
  pubSub.subscribe(events.dataSearched, _searchData);

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
        time: ft.getFormattedTime(locationData.localtime.split(" ")[1]),
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
      pubSub.publish(events.dataRecieved, data);
    } catch (err) {
      console.log(err);
    }
  }

  return { init };
})();

export default weather;