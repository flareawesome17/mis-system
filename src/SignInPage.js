import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles/SignInPage.css';

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      console.log('User signed in:', result.user);
    }).catch(error => {
      console.error('Login error:', error);
    });
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Welcome to MIS System</h2>
        <p>Please sign in to continue</p>
        <button className="google-signin-button" onClick={handleGoogleSignIn}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
