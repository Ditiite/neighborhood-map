import React, { Component } from 'react';
import './App.css';

import API from './components/API';

class App extends Component {
	render() {
		return (
			<div className="App">
				<h1>Welcome to my neighborhood!</h1>
				<API />
			</div>
		);
	}
}

export default App;
