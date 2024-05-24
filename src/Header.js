import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Header.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Header = ({ user, onLogout }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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

  const fetchUserData = useCallback((userId) => {
    const userDocRef = firebase.firestore().collection('users').doc(userId);
    const unsubscribe = userDocRef.onSnapshot((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      return fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  return (
    <header className="header no-print">
      <div className="header-title">
        <h1>MIS SYSTEM <span className="muted-text">Peter Paul Corp.</span></h1>
      </div>
      {user && userInfo && (
        <div className="header-content">
          <img src={user.photoURL} alt="Profile" className="profile-pic" />
          <div className="user-details">
            <span className="username">{user.displayName}</span>
            <span className="user-info">({userInfo.position || ''})</span>
            <span className="user-info">{userInfo.department || ''}</span>
            <span className="user-info">{userInfo.address || ''}</span>
          </div>
          <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
        </div>
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
