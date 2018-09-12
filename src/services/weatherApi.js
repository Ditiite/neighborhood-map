
/**
 * Get weather information from openWeather map
 * @param {string} lat 
 * @param {string} lng 
 * @retuns {WeatherInfo}
 */
export async function getWeather(lat, lng) {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=4081a6920c100a1824eff93069bb26e0`);
    const data = await resp.json();
    return {
        description: data.weather[0].description,
        weatherIcon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temp: (data.main.temp - 273.15).toFixed(1)
    };
}
