import React from 'react';
import './styles/Header.css';

const Header = () => {
    return (
        <header>
            <h1>MIS SYSTEM <span className="muted-text">Peter Paul Corp.</span></h1>
            <span className="username">MIS CCC/Plaridel</span>
            <button onClick={() => window.location.href = 'login.html'}>Logout</button>
        </header>
    );
}

export default Header;
