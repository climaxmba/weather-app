import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";
import ft from "format-time";

const weather = (() => {
  pubSub.subscribe(events.dataSearched, _searchData);
  pubSub.subscribe(events.dataInputed, _getAreasList);

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
      pubSub.publish(events.dataRecieved, data);
    } catch (err) {
      console.log(`weatherHandler: ${err}`);
      pubSub.publish(events.searchFailed, err);
    }
  }
  async function _getAreasList(input) {
    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${input}`, { mode: "cors" });
      if (response.ok) {
        const data = await response.json();
        pubSub.publish(events.areasListRecieved, data);
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
        time: ft.getFormattedTime(locationData.localtime.split(" ")[1]),
        date: new Date(
          locationData.localtime.split(" ")[0]
        ).toLocaleDateString(),
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
        imperialVisibility: `${currentData.vis_miles} miles`,
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

export default weather;
