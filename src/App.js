import React, { Component } from 'react';
import './App.css';
import GoogleApiWrapper from './components/MapContainer';

class App extends Component {

	render() {
		return (
			<React.Fragment>
				<GoogleApiWrapper />
			</React.Fragment>
		);
	}
}

export default App;
