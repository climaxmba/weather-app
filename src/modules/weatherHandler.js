import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";
import { createClient } from "pexels";
import ft from "format-time";

const weather = (() => {
  pubSub.subscribe(events.dataSearched, _searchData);
  pubSub.subscribe(events.dataInputed, _getAreasList);
  let client;
  
  async function init() {
    client = createClient('OGih2ChlxcaKZTW87ixSFht3bZTbbnhHR7QNN688roF9crgxY8cKtNVr');
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
        time: ft.getFormattedTime(locationData.localtime.split(" ")[1]),
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

export default weather;
