import React, { Component } from 'react';
//import { Map, InfoWindow, Marker } from 'google-maps-react';
import './App.css';
import GoogleApiWrapper from './components/MapContainer';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			marker: []
		}
	}

	render() {
		return (
			<React.Fragment>
				<GoogleApiWrapper />
			</React.Fragment>
		);
	}
}

export default App;
