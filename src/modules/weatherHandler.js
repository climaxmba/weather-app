import pubSub from "./pubSub.js";
import events from "./pubSubEvents.js";

const weather = (() => {
    pubSub.subscribe(events.dataSearched, _getParsedData);
    
  async function init() {
    const data = await _getParsedData("Abuja");
    pubSub.publish(events.dataRecieved, data);
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
      time: locationData.localtime.split(" ")[1],
      date: locationData.localtime.split(" ")[0],
      metricTemp: `${currentData.temp_c}℃`,
      imperialTemp: `${currentData.temp_f}℉`,
      icon: currentData.condition.icon,
      conditionText: currentData.condition.text,
      metricWind: `${currentData.wind_kph}kph ${currentData.wind_dir}`,
      imperialWind: `${currentData.wind_mph}mph ${currentData.wind_dir}`,
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

export default weather;
