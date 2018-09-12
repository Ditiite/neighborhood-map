import React from 'react';
import PropTypes from 'prop-types';

export const Header = (props) => {
    return (
        <header className="header">
            <h1>Visit Latvia's beautiful castles</h1>
            <button className="display-btn" onClick={props.handleShow}>
                <i className="fab fa-fort-awesome"></i>{props.btnText}</button>
        </header>
    );
}

Header.propTypes = {
    handleShow: PropTypes.func,
    btnText: PropTypes.string
}