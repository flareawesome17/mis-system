import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Header.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import Firestore

const Header = ({ user, onLogout }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [position, setPosition] = useState('');
  const [address, setAddress] = useState(''); // State to store user's address
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.uid);
        const userData = await userDocRef.get();
        if (userData.exists) {
          const userDataObj = userData.data();
          setPosition(userDataObj.position || '');
          setAddress(userDataObj.address || ''); // Set address state from Firestore
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = (confirm) => {
    if (confirm) {
      onLogout();
      navigate('/signin');
    }
    setShowConfirmation(false);
  };

  return (
    <header>
      <h1>MIS SYSTEM <span className="muted-text">Peter Paul Corp.</span></h1>
      {user ? (
        <div className="header-content">
          <img src={user.photoURL} alt="Profile" className="profile-pic" />
          <div>
            <span className="username">{user.displayName}</span>
            <span className="user-info">({position}</span>
            <span className="user-info">{address})</span> {/* Display address */}
          </div>
          <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
        </div>
      ) : (
        <div className="no-user"></div> // No login button displayed
      )}

      {showConfirmation && (
        <div className="confirmation-message">
          <p>Are you sure you want to logout?</p>
          <div className="confirmation-message-buttons">
            <button className="yes-button" onClick={() => handleConfirmLogout(true)}>Yes</button>
            <button className="no-button" onClick={() => handleConfirmLogout(false)}>No</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
