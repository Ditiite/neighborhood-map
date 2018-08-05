import React from 'react';

export const Weather = (props) => {
    return(
        <div className="weather">
            <img className="info-img" src={props.src} alt="Weather icon" />
            <p className="info-desc">{props.description}</p>
            <p className="info-temp">{props.temp} °C</p>
            <img className="weather-logo" src={props.imgSrc} alt="Open map weather logo" />
            <div className="weather-title">
                <p>Weather provided by:</p><br />
                <p>OpenWeatherMap</p>
            </div>
        </div>
    );
}