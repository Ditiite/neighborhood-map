import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';
import { styles } from './MapContainer.styles';
import { Header } from './Header';
import { getWeather } from '../services/weatherApi';
import weaterLogo from '../images/openweathermap.png'

export class MapContainer extends Component {
    state = {
        showingInfoWindow: true,
        activeMarker: null,
        selectedPlace: {},
        initialCenter: {
            lat: 56.949649,
            lng: 24.105186
        },
        show: true,
        btnText: 'Hide',
        markers: [...defaultMarkers],
        filteredmarkers: [...defaultMarkers],
        activeMarkerWeather: null
    };

    selectMarkerByTitle = (title) => {
        const markerEl = document.querySelector(`[title='${title}']`);
        markerEl.focus();
        markerEl.click();
    }

    onMarkerClick = async (props, marker, e) => {
        let activeMarkerWeather = null;
        try {
            activeMarkerWeather = await getWeather(marker.position.lat(), marker.position.lng())
        } catch (err) {
            console.error("Failed to fetch weather");
        }
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            initialCenter: marker.position,
            activeMarkerWeather
        });

        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 2000);
    }

    /**
     * Reset activeMarker, infoWindow when outside the marker is clicked
     */
    onMapClicked = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    /**
     * set new markers to our state
     * refresh the filter list with main one
     * @param {Object} marker 
     */
    updateMarkers = (markers) => {
        this.setState({
            markers: [...markers],
            filteredmarkers: [...markers]
        });
    }

    updateFilteredMarkers = (filteredmarkers) => {
        //console.log("Updated filtered list", filteredmarkers);
        this.setState({
            filteredmarkers: [...filteredmarkers]
        });
    }

    /* TOOGLE THE BUTTON TO SHOW OR HIDE SIDEBAR */
    handleShow = () => {
        this.setState({
            show: !this.state.show
        });
        if (this.state.btnText === 'Hide') {
            this.setState({
                btnText: 'Show more'
            })
        } else if (this.state.btnText === 'Show more') {
            this.setState({
                btnText: 'Hide'
            })
        }
    }

    render() {
        let animation = this.props.google.maps.Animation.DROP;

        const filteredmarkers = this.state.filteredmarkers;

        let bounds = new this.props.google.maps.LatLngBounds();
        this.state.markers.forEach((marker) => {
            bounds.extend(marker.position);
        });

        //customize icon
        const markerColor = 'cbabce';
        const icons = 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|30|_|%E2%80%A2';
        console.log
        return (
            <React.Fragment>
                <Header
                    btnText={this.state.btnText}
                    handleShow={this.handleShow}
                />
                {this.state.show
                    &&
                    <Sidebar
                        selectMarkerByTitle={this.selectMarkerByTitle}
                        showInfoWindow={this.showInfoWindow}
                        markers={this.state.markers}
                        filteredmarkers={this.state.filteredmarkers}
                        updateMarkers={this.updateMarkers}
                        updateFilteredMarkers={this.updateFilteredMarkers}
                    />
                }
                <div className="map">
                    <Map
                        styles={styles}
                        google={this.props.google}
                        initialCenter={this.state.initialCenter}
                        center={this.state.activeMarker ? this.state.activeMarker.position : {}}
                        zoom={7}
                        onClick={this.onMapClicked}
                        bounds={bounds}>

                        {
                            filteredmarkers.map((mark, i) => {
                                return <Marker
                                    onClick={this.onMarkerClick}
                                    key={i}
                                    name={mark.name}
                                    title={mark.title}
                                    position={mark.position}
                                    animation={animation}
                                    icon={icons}
                                />
                            })
                        }

                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}>
                            <div className="info-window" tabIndex="-1">
                                <h1 tabIndex="0">{this.state.selectedPlace.name}</h1>
                                <p tabIndex="0" className="address">{this.state.selectedPlace.title}</p>
                                {
                                    this.state.activeMarkerWeather
                                    &&
                                    <div className="weather">
                                        <img className="info-img" src={this.state.activeMarkerWeather.weatherIcon} alt="Weather icon" />
                                        <p className="info-desc">{this.state.activeMarkerWeather.description}</p>
                                        <p className="info-temp">{this.state.activeMarkerWeather.temp} °C</p>
                                        <img className="weather-logo" src={weaterLogo} alt="Open map weather logo" />
                                        <div className="weather-title">
                                            <p>Weather provided by:</p><br />
                                            <p>OpenWeatherMap</p>
                                        </div>
                                    </div>
                                }

                            </div>
                        </InfoWindow>
                    </Map>
                </div>
            </React.Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE'
})(MapContainer)