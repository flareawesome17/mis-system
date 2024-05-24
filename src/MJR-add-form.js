import React, { useState, useEffect } from 'react';
import './styles/MJR-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

const MJRAddForm = ({ showForm, onClose }) => {
    const [formData, setFormData] = useState({
        mjrNo: null, // Set initially to null
        requestedBy: '',
        notedBy: '',
        department: '',
        location: '',
        description: '',
        date: '',
        status: 'Pending',
        accepted: false
    });

    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const fetchLastMjrNo = async () => {
            try {
                const db = firebase.firestore();
                const dataRef = await db.collection('mjrForms').orderBy('mjrNo', 'desc').limit(1).get();
                const lastMjrNo = dataRef.docs.length > 0 ? dataRef.docs[0].data().mjrNo : 0;
                // Increment the last MJR number by 1 for the next entry
                setFormData(prevData => ({ ...prevData, mjrNo: lastMjrNo + 1 }));
            } catch (error) {
                console.error('Error fetching last MJR number:', error);
            }
        };

        fetchLastMjrNo();
    }, []);

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            const unsubscribe = userDocRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    setUserAddress(userData.address || '');
                } else {
                    console.log('No such document!');
                }
            }, (error) => {
                console.error('Error fetching user address:', error);
            });

            return () => unsubscribe();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const db = firebase.firestore();
        const newData = {
            ...formData,
            address: userAddress.toUpperCase() // Include user's address in form data
        };

        db.collection('mjrForms').add(newData)
            .then(() => {
                console.log('Form data stored successfully');
            })
            .catch((error) => {
                console.error('Error storing form data:', error);
            });
        
        // Clear form fields after submission
        setFormData(prevData => ({
            ...prevData,
            requestedBy: '',
            notedBy: '',
            department: '',
            location: '',
            description: '',
            date: '',
            accepted: false
        }));
        
        onClose();
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Job Request Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="add-form-text"
                            type="text"
                            name="mjrNo"
                            value={formData.mjrNo}
                            onChange={handleChange}
                            readOnly
                            hidden
                        />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="address"
                            value={userAddress}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Requested by:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="requestedBy"
                            value={formData.requestedBy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Noted by(Departmen Supervisor/Manager):</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="notedBy"
                            value={formData.notedBy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Department:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="hidden"
                            name="status"
                            value={formData.status}
                        />
                        <input
                            type="hidden"
                            name="accepted"
                            value={formData.accepted}
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MJRAddForm;
