import React, { Component } from 'react';
import MapContainer from './MapContainer';

export default class ApiWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            google: null,
            loading: true,
            error: false
        }

        // Add google api callbacks
        window.googleSuccess = () => {
            console.log("Google loaded");
            this.setState({
                google: window.google,
                loading: false,
            })
        }

        window.gm_authFailure = () => {
            console.log("Authentication error");
            this.setState({
                error: true
            });
        }
    }

    componentDidMount() {
        // Load google api 
        const scriptEl = document.createElement('script');
        scriptEl.async = true;
        scriptEl.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAi8HndyCibVRx205QFrZ2MVORDaGABPjE&callback=googleSuccess&libraries=places&v=3&language=en"
        scriptEl.onerror = () => {
            console.log("Error loading script");
            this.setState({
                error: true
            });
        }

        document.body.appendChild(scriptEl);
    }

    render() {
        return (
            <React.Fragment>
                {
                    (this.state.loading || this.state.error) ?

                        <div className="overlay">

                        </div> : ''
                }
                <div className="error-msg-field"
                    style={{
                        display: (this.state.loading || this.state.error) ? 'block' : 'none'
                    }}>

                    {this.state.loading &&
                        <div className="loader">
                            <div className="loader-abs"></div>
                            <div className="loader-abs"></div>
                        </div>}
                    {this.state.error && <div className="error-msg">Something went wrong! Service not available<br /> Please try later!</div>}
                </div>
                {
                    !this.state.loading &&
                    <MapContainer google={this.state.google} />
                }
            </React.Fragment>
        );
    }
}