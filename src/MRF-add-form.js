import React, { useState, useEffect } from 'react';
import './styles/MRF-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

const MRFAddForm = ({ showForm, onClose }) => {
    const [formData, setFormData] = useState({
        mrfNo: null,
        name: '',
        department: '',
        position: '',
        releasedBy: '',
        date: '',
        dateReleased: '',
    });

    const [parts, setParts] = useState([{ part: '', brandName: '', remarks: '' }]);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const fetchLastMrfNo = async () => {
            try {
                const db = firebase.firestore();
                const dataRef = await db.collection('mrfForms').orderBy('mrfNo', 'desc').limit(1).get();
                const lastMrfNo = dataRef.docs.length > 0 ? dataRef.docs[0].data().mrfNo : 0;
                setFormData(prevData => ({ ...prevData, mrfNo: lastMrfNo + 1 }));
            } catch (error) {
                console.error('Error fetching last MRF number:', error);
            }
        };

        fetchLastMrfNo();
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

    const handlePartChange = (index, e) => {
        const { name, value } = e.target;
        const newParts = [...parts];
        newParts[index][name] = value;
        setParts(newParts);
    };

    const handleAddPart = () => {
        setParts([...parts, { part: '', brandName: '', remarks: '' }]);
    };

    const handleRemovePart = (index) => {
        const newParts = parts.filter((_, partIndex) => partIndex !== index);
        setParts(newParts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const db = firebase.firestore();
        const newData = {
            ...formData,
            address: userAddress.toUpperCase(),
            parts: parts.filter(part => part.part && part.brandName) // Include parts in form data, filtering out empty ones
        };

        try {
            await db.collection('mrfForms').doc(String(formData.mrfNo)).set(newData);
            console.log('Form data stored successfully');

            // Clear form fields after submission
            setFormData(prevData => ({
                mrfNo: prevData.mrfNo + 1,
                name: '',
                department: '',
                position: '',
                releasedBy: '',
                date: '',
                dateReleased: '',
            }));
            setParts([{ part: '', brandName: '', remarks: '' }]);
            onClose();
        } catch (error) {
            console.error('Error storing form data:', error);
        }
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Release Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="add-form-text"
                            type="text"
                            name="mrfNo"
                            value={formData.mrfNo}
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
                        <label>Position:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="name"
                            value={formData.name}
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
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Released by:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="releasedBy"
                            value={formData.releasedBy}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date Released:</label>
                        <input
                            type="date"
                            name="dateReleased"
                            value={formData.dateReleased}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <h3>Parts</h3>
                    {parts.map((part, index) => (
                        <div key={index} className="form-group parts-group">
                            <input
                                className="add-form-text"
                                type="text"
                                name="part"
                                placeholder="Part"
                                value={part.part}
                                onChange={(e) => handlePartChange(index, e)}
                            />
                            <input
                                className="add-form-text"
                                type="text"
                                name="brandName"
                                placeholder="Brand name"
                                value={part.brandName}
                                onChange={(e) => handlePartChange(index, e)}
                            />
                            <input
                                className="add-form-text"
                                type="text"
                                name="remarks"
                                placeholder="Remarks"
                                value={part.remarks}
                                onChange={(e) => handlePartChange(index, e)}
                            />
                            <button type="button" onClick={() => handleRemovePart(index)}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPart}>Add Part</button>

                    <div className="button-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MRFAddForm;
