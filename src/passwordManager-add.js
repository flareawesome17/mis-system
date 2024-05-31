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
        const fetchUserAddress = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                    const doc = await userDocRef.get();
                    if (doc.exists) {
                        const userData = doc.data();
                        setUserAddress(userData.address || '');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user address:', error);
                }
            }
        };

        fetchUserAddress();
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
                        <select
                            className="add-form-text"
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Account Type</option>
                            <option value="Outlook">Outlook</option>
                            <option value="Nav">Nav</option>
                            <option value="PC">PC</option>
                            <option value="Teams">Teams</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            className="add-form-text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
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
