import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import MainContainer from './MainContainer';
import SignInPage from './SignInPage';

import './styles/App.css'; // Import CSS for styling
import './styles/SignInPage.css';


import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMzNSoPzmayJFTJNuwWpXzqVr3IL9oZXk",
  authDomain: "mis-system-9f8ea.firebaseapp.com",
  databaseURL: "https://mis-system-9f8ea-default-rtdb.firebaseio.com",
  projectId: "mis-system-9f8ea",
  storageBucket: "mis-system-9f8ea.appspot.com",
  messagingSenderId: "947131635653",
  appId: "1:947131635653:web:06d761abfe5de127329dac",
  measurementId: "G-59ZEYBCMZM"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('Logged out');
      setUser(null);
    }).catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
          <Route path="/" element={user ? (
            <div className="layout">
              <SideNav onOptionClick={() => {}} />
              <MainContainer />
            </div>
          ) : (
            <Navigate to="/signin" />
          )} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
