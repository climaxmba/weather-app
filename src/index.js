async function getForecastData(location) {
    const key = "c52eaecafe624ab6908202749232108";
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

getSpecificData("forecast", "Abuja");