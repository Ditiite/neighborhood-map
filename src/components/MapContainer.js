import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';
import { styles } from './MapContainer.styles';

const stylesL= {
    content: "",
    position: 'absolute',
    top: 0,
    left: 0,
    /* Center the tip horizontally. */
    transform: 'translate(-50 %, 0)',
    /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
    width: 0,
    height: 0,
    /* The tip is 8px high, and 12px wide. */
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: /* TIP_HEIGHT= */ '8px solid white'
}

export class MapContainer extends Component {
    state = {
        showingInfoWindow: true,
        activeMarker: {},
        selectedPlace: {},
        initialCenter: {
            lat: 56.345706,
            lng: 26.195000
        },
        markers: [...defaultMarkers],
        filteredmarkers: [...defaultMarkers]
    };

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            initialCenter: marker.position
        });

        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        setTimeout(() => { 
            marker.setAnimation(null); 
        }, 550);
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
     * set new markers to our state
     * refresh the filter list with mainone
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
        return (
            <React.Fragment>
                <Sidebar
                    markers={this.state.markers}
                    filteredmarkers={this.state.filteredmarkers}
                    updateMarkers={this.updateMarkers}
                    updateFilteredMarkers={this.updateFilteredMarkers}
                />
                <div className="map">
                    <Map
                        styles={styles}
                        google={this.props.google}
                        initialCenter={this.state.initialCenter}
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
                            style={stylesL}
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}>
                            <div className="info-window">
                                <h1>{this.state.selectedPlace.name}</h1>
                                <p>{this.state.selectedPlace.title}</p>
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