import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import MainContainer from './MainContainer';
import SignInPage from './SignInPage';
import Dashboard from './Dashboard';
import MISForm1 from './MISForm1';
import Settings from './Settings';
import './styles/App.css';
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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('Logged out');
      setUser(null);
      localStorage.removeItem('user');
    }).catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <HashRouter>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        {user && (
          <div className="layout">
            <SideNav user={user} onOptionClick={() => {}} />
            <Routes>
              <Route path="/" element={<MainContainer />} />
              <Route path="/dashboard" element={<Dashboard user={user}/>} />
              <Route path="/form1" element={<MISForm1 user={user} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        )}
        {!user && (
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
}

export default App;
