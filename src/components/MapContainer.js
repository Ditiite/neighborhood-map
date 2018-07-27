import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';
import { styles } from './MapContainer.styles';

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
     * set new markers to our state
     * @param {Object} marker 
     */
    updateMarkers = (markers) => {
        this.setState({
            markers
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
                    markers={this.state.markers}
                    handleChange={this.handleChange} updateMarkers={this.updateMarkers}/>
                <div className="map">
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
                </div>
            </React.Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE'
})(MapContainer)