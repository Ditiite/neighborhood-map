import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';

const styles = [
    { height: '100%' },
    {
        featureType: 'water',
        stylers: [
            { color: '#19a0d8' }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#dddddd' },
            { weight: 6 }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#00495b' }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            { color: '#040063' },
            { lightness: -40 }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [
            { weight: 9 },
            { hue: '#f709e7' }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'on' }
        ]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
            { lightness: 100 }
        ]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            { lightness: -100 }
        ]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            { visibility: 'on' },
            { color: '#dbd9db' }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
        ]
    }, {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#02e234' }
        ]
    }, {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
            { color: '#a4d89e' }
        ]
    }
];

export class MapContainer extends Component {
    state = {
        showingInfoWindow: true,
        activeMarker: {},
        selectedPlace: {},
        initialCenter: {
            lat: 56.345706,
            lng: 26.195000
        },
        markers: [...defaultMarkers]
    };

    onMarkerClick = (props, marker, e) =>{
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
        //When click on marker will have bounce animation
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        }
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: true,
                activeMarker: null
            })
        }
    };

    /**
     * Push new marker to our state
     * @param {Object} marker 
     */
    pushMarker = (marker) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                markers: [
                    ...prevState.markers,
                    marker
                ]
            };
        });
    }

    render() {

        let bounds = new this.props.google.maps.LatLngBounds();
        let animation = this.props.google.maps.Animation.DROP;
       
        const markers = this.state.markers;

        markers.forEach((marker) =>{
            bounds.extend(marker.position);
        });

        return (
            <React.Fragment>
                <Sidebar
                    handleChange={this.handleChange} pushMarker={this.pushMarker}/>
                <Map
                    styles={styles}
                    google={this.props.google}
                    initialCenter ={this.state.initialCenter}
                    zoom={7}
                    onClick={this.onMapClicked}
                    bounds={bounds} >

                { markers.map((mark, i) => {
                        return <Marker onClick={this.onMarkerClick}
                            key={i}
                            name={mark.name}
                            title={mark.title}
                            position={mark.position}
                            animation={animation} />
                })}
                
                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                            <p>{this.state.selectedPlace.title}</p>
                        </div>
                    </InfoWindow>
                </Map>
            </React.Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE'
})(MapContainer)