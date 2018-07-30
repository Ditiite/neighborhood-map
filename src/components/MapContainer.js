import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';
import { styles } from './MapContainer.styles';
import { Header } from './Header';    


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
        activeMarkerWeather: {
            description: null,
            weatherIcon: null,
            temp: null
        }
    };

    selectMarkerByTitle = (title) => {
        const markerEl = document.querySelector(`[title='${title}']`);
        markerEl.click();
    }

    onMarkerClick = async (props, marker, e) => {
        const lat = marker.position.lat();
        const lng = marker.position.lng();
        const resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=4081a6920c100a1824eff93069bb26e0`);
        const activeMarkerWeather = await resp.json().then((data) => {
            return {
                description: data.weather[0].description,
                weatherIcon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
                temp: (data.main.temp - 273.15).toFixed(1)
            }
        });
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
    onMapClicked = (props, b) => {
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
        if(this.state.btnText === 'Hide') {
            this.setState({
                btnText: 'Show more'
            })
        } else if (this.state.btnText === 'Show more') {
            this.setState({
                btnText: 'Hide'
            })
        } console.log(this.state.activeMarker);
    }

    render() {
        let bounds = new this.props.google.maps.LatLngBounds();
        let animation = this.props.google.maps.Animation.DROP;

        const filteredmarkers = this.state.filteredmarkers;

        filteredmarkers.forEach((marker) => {
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
                {   this.state.show 
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
                        center={this.state.activeMarker? this.state.activeMarker.position: {}}
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
                            <div className="info-window">
                                <h1>{this.state.selectedPlace.name}</h1>
                                <p>{this.state.selectedPlace.title}</p>
                                <img style={{width:"50px",height: "50px"}} className="info-img" src={this.state.activeMarkerWeather.weatherIcon} alt="Weather icon" /> 
                                <p>{this.state.activeMarkerWeather.description}</p>
                                <p>{this.state.activeMarkerWeather.temp} °C</p>
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