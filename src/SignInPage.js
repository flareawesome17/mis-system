import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles/SignInPage.css';
import { FaArrowLeft } from 'react-icons/fa';

const SignInPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Password
  const [isLogin, setIsLogin] = useState(true); // Default to login
  const [error, setError] = useState(null); // For error messages
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log('User signed in:', result.user);
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  };

  const handleEmailContinue = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setStep(2); // Move to password step
  };

  const handlePasswordContinue = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    if (isLogin) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          if (user.emailVerified) {
            console.log('User logged in:', user);
            navigate('/dashboard');
          } else {
            setError('Please verify your email before signing in.');
          }
        })
        .catch(error => {
          setError('Login error: ' + error.message);
        });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          userCredential.user.sendEmailVerification()
            .then(() => {
              console.log('Verification email sent.');
              alert('Verification email sent. Please verify your email.');
              setIsLogin(true);
              setStep(1); // Reset to email step for login
            })
            .catch(error => {
              setError('Error sending verification email: ' + error.message);
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setError('The email address is already in use by another account.');
          } else {
            setError('Error creating user: ' + error.message);
          }
        });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null); // Clear any previous errors
  };

  return (
    <div className="signin-page">
      { !isAuthenticated && (
        <div className="signin-card">
          <div className="back-button-container">
            {step === 2 && (
              <button className="back-button" onClick={handleBack}><FaArrowLeft/></button>
            )}
          </div>
          <h2>Welcome to MIS System</h2>
          <p>Please sign in to continue</p>
          {error && <p className="error">{error}</p>}
          {step === 1 && (
            <form onSubmit={handleEmailContinue}>
              <label>{isLogin ? "Sign In" : "Create an Account"}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
              />
              <button type="submit">Continue</button>
              {isLogin ? (
                <p className="toggle-text">
                  Don't have an account?
                  <span onClick={() => { setIsLogin(false); setStep(1); setError(null); }}>Register</span>
                </p>
              ) : (
                <p className="toggle-text">
                  Already have an account?
                  <span onClick={() => { setIsLogin(true); setStep(1); setError(null); }}>Login</span>
                </p>
              )}
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handlePasswordContinue}>
              <label>{isLogin ? "Sign In" : "Create an Account"}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder={isLogin ? "Enter your password" : "Create a password"} 
                required 
              />
              <button type="submit">Continue</button>
            </form>
          )}
          <div className="separator">
            <span>Or</span>
          </div>
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
