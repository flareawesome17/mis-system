import React, { useState, useEffect } from 'react';
import './styles/MRF-add-form.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const PswdAdd = ({ showForm, onClose }) => {
    const [formData, setFormData] = useState({
        pswrdNo: null,
        email: '',
        password: '',
        accountType: '',
        status: '',
    });

    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const fetchLastpswrd = async () => {
            try {
                const db = firebase.firestore();
                const dataRef = await db.collection('pswrdManager').orderBy('pswrdNo', 'desc').limit(1).get();
                const lastpswrd = dataRef.docs.length > 0 ? dataRef.docs[0].data().pswrdNo : 0;
                setFormData(prevData => ({ ...prevData, pswrdNo: lastpswrd + 1 }));
            } catch (error) {
                console.error('Error fetching last password number:', error);
            }
        };

        fetchLastpswrd();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const db = firebase.firestore();
        const newData = {
            ...formData,
            address: userAddress.toUpperCase()
        };

        try {
            await db.collection('pswrdManager').doc(String(formData.pswrdNo)).set(newData);
            console.log('Form data stored successfully');

            // Clear form fields after submission
            setFormData({
                pswrdNo: formData.pswrdNo + 1,
                email: '',
                password: '',
                accountType: '',
                status: '',
            });
            onClose();
        } catch (error) {
            console.error('Error storing form data:', error);
        }
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Password Manager</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="add-form-text"
                            type="text"
                            name="pswrdNo"
                            value={formData.pswrdNo}
                            readOnly
                            hidden
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="add-form-text"
                            type="text"
                            name="address"
                            value={userAddress}
                            readOnly
                            hidden
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Type:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="accountType"
                            value={formData.accountType}
                            placeholder="Enter account type"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="status"
                            value={formData.status}
                            placeholder="Enter status"
                            onChange={handleChange}
                            required
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

export default PswdAdd;
