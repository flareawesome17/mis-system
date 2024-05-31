import React, { useState, useEffect } from 'react';
import './styles/MJR-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

const MJREditForm = ({ showForm, onClose, id }) => {
    const [formData, setFormData] = useState({
        mjrNo: '', 
        requestedBy: '',
        notedBy: '',
        department: '',
        location: '',
        description: '',
        date: '',
        dateFinished: '',
        status: 'Pending',
        accepted: false
    });

    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const docRef = db.collection('mjrForms').doc(id);
                const doc = await docRef.get();

                if (doc.exists) {
                    const data = doc.data();
                    setFormData(data);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchData();
    }, [id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Get current date in mm/dd/yyyy format
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        // Update formData with dateFinished
        const updatedFormData = {
            ...formData,
            dateFinished: formattedDate
        };

        try {
            const db = firebase.firestore();
            await db.collection('mjrForms').doc(id).update(updatedFormData);
            console.log('Form data updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating form data:', error);
        }
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Edit Job Request</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            readOnly
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
                            readOnly
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Noted by(Department Supervisor/Manager):</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="notedBy"
                            value={formData.notedBy}
                            onChange={handleChange}
                            required
                            readOnly
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
                            readOnly
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
                            readOnly
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
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MJREditForm;
