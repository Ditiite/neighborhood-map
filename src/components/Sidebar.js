import React, { Component } from 'react';
//import { markers } from '../markers/markers';
import { GoogleApiWrapper } from 'google-maps-react';

class Sidebar extends Component {
    placeSearchService = null;
    geocoder = null;

    componentDidMount() {
        const status = this.props.google.maps.places.PlacesServiceStatus.OK;
        if (!status) {
            alert("Google not ready!");
            return;
        }

        this.placeSearchService = new this.props.google.maps.places.AutocompleteService();
        this.geocoder = new this.props.google.maps.Geocoder();
    }

    search = () => {
        const searchInputEl = document.querySelector("input[name=search]");
        const searchBy = searchInputEl.value;

        this.getPlaces(searchBy, (places) => {
            this.createMarkers(places, (receivedMarkers) => {
                this.props.updateMarkers(receivedMarkers);
                document.querySelector("input[name=filter]").value = "";
            });
        });

    }

    /**
     * Query details like coordinates from google api. 
     * Create marker combining the details
     * @param {Array} places Places retrieved form google api
     */
    createMarkers(places, cb) {
        const _markers = [];
        const waitingResults = places.length;
        let receivedResults = 0;

        places.forEach((place) => {
            // Google has query limit.
            this.geocoder.geocode({
                'placeId': place.place_id
            }, (results, status) => {
                if (status === "OK") {
                    const placeDetails = results[0];
                    const marker = {
                        id: place.place_id,
                        position: {
                            lat: placeDetails.geometry.location.lat(),
                            lng: placeDetails.geometry.location.lng(),
                        },
                        name: place.description,
                        title: placeDetails.formatted_address,
                        types: placeDetails.types
                    }
                    _markers.push(marker);
                } else {
                    console.error("Invalid status", status, results);
                }

                // Increment received
                receivedResults++;
                // Check if we got all results
                if (receivedResults === waitingResults) {
                    cb(_markers);
                }
            });
        });
    }

    getPlaces(searchBy, cb) {
        this.placeSearchService.getPlacePredictions({ input: searchBy }, (data, status) => {
            if (status !== "OK") {
                console.log("Not found!");
                return;
            }

            cb(data);
        });
    }


    filterList = (event, places) => {
        const filterInputEl = document.querySelector("input[name=filter]");
        const filterBy = filterInputEl.value.toLowerCase();

        let updatedList = this.props.markers.filter(place => {
            const targetText = place.title.toLowerCase();
            return targetText.search(filterBy) !== -1;
        });
        this.props.updateFilteredMarkers(updatedList);
    }

    onClickPlaceListItem = (event) => {
        const placeTitle = event.target.dataset.placeTitle;
        this.props.selectMarkerByTitle(placeTitle);
    }

    render() {
        return (
            <aside className="sidebar">
                <input
                    className="input"
                    type="text"
                    name="search"
                    placeholder="Search For ..."
                />
                <button className="btn" onClick={this.search}>Search</button>
                <input
                    className="input"
                    type="text"
                    name="filter"
                    placeholder="Filter By Name ..."
                />
                <button className="btn" onClick={this.filterList}>Filter</button>
                <ul className="place-names">
                    {
                        this.props.filteredmarkers.map((place) => {
                            return <li key={place.id} data-place-title={place.title} onClick={this.onClickPlaceListItem}>
                                {place.name}<hr /></li>
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