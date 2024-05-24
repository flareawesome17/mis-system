import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import Firestore
import './styles/Settings.css';

const Settings = () => {
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [address, setAddress] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const user = firebase.auth().currentUser;
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userDocRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    setDepartment(userData.department || '');
                    setPosition(userData.position || '');
                    setAddress(userData.address || '');
                }
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        fetchUserSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;

        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            await userDocRef.set({
                department,
                position,
                address
            }, { merge: true });
            setNotification('User profile updated successfully');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            alert("Successfully saved");
        } catch (error) {
            setNotification('Error updating user profile');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            console.error('Error updating user profile:', error);
            alert("Error");
        }
    };

    return (
        <div className="settings-content">
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="department">Department:</label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="position">Position:</label>
                    <input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default Settings;
