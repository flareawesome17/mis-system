import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import MainContainer from './MainContainer';
import SignInPage from './SignInPage';
import Dashboard from './Dashboard';
import MISForm1 from './MISForm1';
import MISForm10 from './MISForm10';
import Settings from './Settings';
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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user)); // Save user to local storage
      } else {
        setUser(null);
        localStorage.removeItem('user'); // Remove user from local storage
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('Logged out');
      setUser(null);
      localStorage.removeItem('user'); // Remove user from local storage
    }).catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <Router basename="/mis-system">
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        {user && (
          <div className="layout">
            <SideNav user={user} onOptionClick={() => {}} />
            <Routes>
              <Route path="/" element={<MainContainer />} />
              <Route path="/dashboard" element={<Dashboard user={user}/>} />
              <Route path="/form1" element={<MISForm1 user={user} />} /> {/* Pass user here */}
              <Route path="/form10" element={<MISForm10 user={user} />} /> {/* Pass user here */}
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
    </Router>
  );
}

export default App;
