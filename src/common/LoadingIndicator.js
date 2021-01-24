import React from 'react';
import './AppHeader.css';

export default function LoadingIndicator(props) {
    return (
        <img className="loading" src="/loading.gif" style = {{display: 'block', textAlign: 'center', marginTop: 30}} />
    );
}