import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles/SignInPage.css';

const SignInPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      console.log('User signed in:', result.user);
    }).catch(error => {
      console.error('Login error:', error);
    });
  };

  // Render sign-in form only if user is not authenticated
  return (
    <div className="signin-page">
      { !isAuthenticated && (
        <div className="signin-card">
          <h2>Welcome to MIS System</h2>
          <p>Please sign in to continue</p>
          <button className="google-signin-button" onClick={handleGoogleSignIn}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" />
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
