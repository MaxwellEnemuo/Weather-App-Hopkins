import React, { useState, useEffect } from "react";
import calCelsius from "../util/celsiusChange";
import { usePosition } from "use-position";

const API_KEY = "429736441cf3572838aa10530929f7cd";

const Weather = () => {

  const { latitude, longitude } = usePosition(true, {enableHighAccuracy: true});
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [celsius, setCelsius] = useState(0);
  const [description, setDescription] = useState("");
  const [weatherIcon] = useState({Thunderstorm: "wi-thunderstorm", Drizzle: "wi-sleet", Rain: "wi-storm-showers", Snow: "wi-snow", Atmosphere: "wi-fog", Clear: "wi-day-sunny", Clouds: "wi-day-fog"});

  function getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        setIcon(icons.Thunderstorm);
        break;
      case rangeId >= 300 && rangeId <= 321:
        setIcon(icons.Drizzle );
        break;
      case rangeId >= 500 && rangeId <= 521:
        setIcon( icons.Rain );
        break;
      case rangeId >= 600 && rangeId <= 622:
        setIcon( icons.Snow );
        break;
      case rangeId >= 701 && rangeId <= 781:
        setIcon( icons.Atmosphere );
        break;
      case rangeId === 800:
        setIcon( icons.Clear );
        break;
      case rangeId >= 801 && rangeId <= 804:
        setIcon( icons.Clouds );
        break;
      default:
        setIcon( icons.Clouds );
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const response = await data.json();
  
        console.log(response);
        setCity(`${response.name}, ${response.sys.country}`);
        setCelsius(calCelsius(response.main.temp));
        setWindSpeed(`wind: ${response.wind.speed}`);
        setDescription(response.weather[0].description);
      
        getWeatherIcon(weatherIcon, response.weather[0].id);

      } catch (error) {
          console.log(error);
      }
    }

    fetchData();

  }, [latitude, longitude, weatherIcon]);

  return (
    <div className="container">
      <div className="card col-6">
        <h1 className="py-3" style={{color: 'grey'}}>{city}</h1>
          <h5 className="py-4"><i className={`wi ${icon} display-1`} /></h5>

          {/* Get Celsius */}
          {celsius ? ( <h1 className="py-2">{celsius}&deg;C</h1>) : null}

          <small className="py-8">{windSpeed}</small>

          {/* Description */}
          <h4 className="py-3"> {description.charAt(0).toUpperCase() + description.slice(1)}
        </h4>
      </div>
    </div>
  );

}


export default Weather;