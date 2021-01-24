import React from 'react';
import './Login.css';
import LoginForm from './LoginForm';

function Login (props) {
        return (
            <div className="login-container">
                <h1 className="page-title" style={{color: "black"}}>Login</h1>
                <div className="login-content">
                    <LoginForm onLogin={props.onLogin} />
                </div>
            </div>
        );    
}

export default Login;