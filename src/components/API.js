import React, { Component } from 'react';

class API extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            loading: false
        }
    }
    //Fetching data from API
    componentDidMount() {
        this.setState({ loading: true }, () => {
            fetch('https://maps.googleapis.com/maps/api/js?key=AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE&libraries=geometry,drawing&v=3&callback=initMap')
                .then(results => {
                    return results.json();
                }).then(data => {
                    this.setState({
                        loading: false,
                        data: data
                    });
                });
        })
    }
    render() {
        return(
            <h1>Hello Google maps</h1>
        );
    }
}

export default API;