import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import{ markers} from '../markers/markers';

const style = {
    width: '100%',
    height: '100%'
}

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    render() {

        let bounds = new this.props.google.maps.LatLngBounds();

        /*
        for (let i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }
        */

        markers.forEach((marker) =>{
            bounds.extend(marker.position);
        });

        return (
            <Map
                style={ style }
                google={this.props.google}
                initialCenter ={{
                    lat: 56.345706,
                    lng: 26.195000
                }}
                zoom={7}
                onClick={this.onMapClicked}
                bounds={bounds}
            >

               { markers.map((mark, i) => {
                    return <Marker onClick={this.onMarkerClick}
                        key={i}
                        name={mark.name}
                        title={mark.title}
                        position={mark.position} />

               })}
               
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE'
})(MapContainer)