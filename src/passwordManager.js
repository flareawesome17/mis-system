import React, { useState, useEffect } from 'react';
import './styles/MRF-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

const PswdManager = ({ showForm, onClose }) => {
    const [formData, setFormData] = useState({
        strNo: null,
        name: '',
        itemRequested: '',
        itemsRemaining: '',
        department: '',
        requestor: '',
        dateRequested: '',
        reason: '',
        status: 'Pending',
    });

    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const fetchLastStrNo = async () => {
            try {
                const db = firebase.firestore();
                const dataRef = await db.collection('strForms').orderBy('strNo', 'desc').limit(1).get();
                const lastStrNo = dataRef.docs.length > 0 ? dataRef.docs[0].data().strNo : 0;
                setFormData(prevData => ({ ...prevData, strNo: lastStrNo + 1 }));
            } catch (error) {
                console.error('Error fetching last STR number:', error);
            }
        };

        fetchLastStrNo();
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
            await db.collection('strForms').doc(String(formData.strNo)).set(newData);
            console.log('Form data stored successfully');

            // Clear form fields after submission
            setFormData(prevData => ({
                strNo: prevData.strNo + 1,
                name: '',
                itemRequested: '',
                itemsRemaining: '',
                department: '',
                requestor: '',
                dateRequested: '',
                status: 'Pending'
            }));
            onClose();
        } catch (error) {
            console.error('Error storing form data:', error);
        }
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Store Room MIS Approval</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="add-form-text"
                            type="text"
                            name="strNo"
                            value={formData.strNo}
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
                        <label>Name:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Storeroom officer/clerk"
                            onChange={handleChange}
                            required
                        />
                    </div>
                                        
                    <div className="form-group">
                        <label>Item Requested:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="itemRequested"
                            value={formData.itemRequested}
                            placeholder="Item Requested"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Remaining Item/s:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="itemsRemaining"
                            value={formData.itemsRemaining}
                            placeholder="Specify the unit, pcs or set"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Requestor's Department:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="department"
                            value={formData.department}
                            placeholder="Department"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Requestor's Name:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="requestor"
                            value={formData.requestor}
                            placeholder="Requestor's Name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Date Requested:</label>
                        <input
                            type="date"
                            name="dateRequested"
                            value={formData.dateRequested}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Reson for Request:</label>
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            placeholder='Please state the reason'
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

export default PswdManager;
