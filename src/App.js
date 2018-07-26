import React, { Component } from 'react';
//import { Map, InfoWindow, Marker } from 'google-maps-react';
import './App.css';
import GoogleApiWrapper from './components/MapContainer';


class App extends Component {
	render() {
		return (
			<div className="App">
				<h1>Welcome to my neighborhood!</h1>
				<div className="sidebar">

				</div>
				<div id="map">
					<GoogleApiWrapper />
				</div>
			</div>
		);
	}
}

export default App;
