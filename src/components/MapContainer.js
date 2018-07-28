import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { markers as defaultMarkers } from '../markers/markers';
import Sidebar from './Sidebar';
import { styles } from './MapContainer.styles';
import { Header } from './Header';    

const helsinki = {
    "lat": 60.16985569999999,
    "lng": 24.93837910000002
};
export class MapContainer extends Component {
    state = {
        showingInfoWindow: true,
        activeMarker: null,
        selectedPlace: {},
        initialCenter: {
            lat: 56.345706,
            lng: 26.195000
        },
        show: true,
        btnText: 'Hide',
        markers: [...defaultMarkers],
        filteredmarkers: [...defaultMarkers]
    };


    selectMarkerByTitle = (title) => {
        const markerEl = document.querySelector(`[title='${title}']`);
        markerEl.click();
    }

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
        }, 2000);
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
        }
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

        const markerComponents = filteredmarkers.map((mark, i) => {
            return <Marker
                onClick={this.onMarkerClick}
                key={i}
                name={mark.name}
                title={mark.title}
                position={mark.position}
                animation={animation}
                icon={icons}
            />
        });

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