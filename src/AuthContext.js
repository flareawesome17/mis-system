// AuthContext.js
import React, { createContext, useState } from 'react';

// Create a context for managing authentication
export const AuthContext = createContext();

// Create a provider component to wrap your app and provide the context
export const AuthProvider = ({ children }) => {
    // State to track whether the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to handle logout
    const logout = () => {
        // Perform logout actions (e.g., clear session, etc.)
        setIsLoggedIn(false);
    };

    // Value object containing state and functions to be provided to consuming components
    const authContextValue = {
        isLoggedIn,
        logout
    };

    // Return the provider with the authContextValue
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
