import React, { Component } from 'react';
import { markers } from '../markers/markers';
import { GoogleApiWrapper } from 'google-maps-react';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            places: [],
            markers: []
        };

        this.placeSearchService = null;
        this.geocoder = null;
    }

    componentDidMount() {
        const status = this.props.google.maps.places.PlacesServiceStatus.OK;
        if (!status) {
            alert("Google not ready!");
            return;
        }

        this.placeSearchService = new this.props.google.maps.places.AutocompleteService();
        this.geocoder = new this.props.google.maps.Geocoder;
    }

    handleChange = (event) => {
        this.setState({
            query: event.target.value
        })
    }

    search = () => {
        this.placeSearchService.getPlacePredictions({ input: this.state.query }, (data) => {
            if (!data.length) {
                console.log("Not found!");
                return;
            }
            this.setState({
                places: data
            });

            data.forEach((place) => {
                this.geocoder.geocode({
                    'placeId': place.place_id
                }, (results, status) => {
                    if (status === "OK" && results.length > 0) {
                        const placeDetails = results[0];
                        const marker = {
                            position: {
                                lat: placeDetails.geometry.location.lat(),
                                lng: placeDetails.geometry.location.lng(),
                            },
                            name: place.description,
                            title: placeDetails.formatted_address
                        }
                        this.props.pushMarker(marker);
                    }
                });
            });
        });
    }
    
    render() {
        return (
            <aside className="sidebar">
                <input
                    type="text"
                    name="search"
                    placeholder="Please insert place name"
                    onChange={this.handleChange}
                />
                <button onClick={this.search}>Filter</button>
                <ul>
                    { 
                        this.state.places.map((place) => {
                            return <li key={place.id}>{place.description}</li>
                        })
                    }
                </ul>
            </aside>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE'
})(Sidebar)