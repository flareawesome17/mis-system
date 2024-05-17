import React, { useState } from 'react';
import './styles/LoginForm.css';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(username, password);
    };

    const handleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <div className={`login-form ${isSignUp ? 'sign-up' : ''}`}>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <input
                            className="login-form-input"
                            type="text"
                            placeholder="Name"
                        />
                        <input
                            className="login-form-input"
                            type="text"
                            placeholder="Department"
                        />
                        <select className="login-form-input">
                            <option value="">Location</option>
                            <option value="Candelaria">Candelaria</option>
                            <option value="Sorsogon">Sorsogon</option>
                            <option value="Plaridel">Plaridel</option>
                        </select>
                        <input
                            className="login-form-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </>
                )}
                <input
                    className="login-form-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <button className="login-form-button" type="submit">
                    {isSignUp ? 'Sign Up' : 'Login'}
                </button>
            </form>
            <button className="toggle-button" onClick={handleSignUp}>
                {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
        </div>
    );
};

export default LoginForm;
