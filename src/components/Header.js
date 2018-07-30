import React from 'react';

export const Header = (props) => {
    return (
        <header className="header">
            <h1>Visit Latvias beautiful castles</h1>
            <button className="display-btn" onClick={props.handleShow}>
                <i className="fab fa-fort-awesome"></i>{props.btnText}</button>
        </header>
    );
}