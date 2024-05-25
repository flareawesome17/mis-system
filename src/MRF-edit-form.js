import React, { useState, useEffect } from 'react';
import './styles/MRF-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import { FaPrint } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa6';

const MRFEditForm = ({ showForm, onClose, id }) => {
    const [formData, setFormData] = useState({
        mrfNo: '',
        name: '',
        department: '',
        position: '',
        releasedBy: '',
        date: '',
        dateReleased: '',
        address: ''
    });

    const [parts, setParts] = useState([{ part: '', brandName: '', remarks: '' }]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormData = async () => {
            if (!id) return;
            try {
                const db = firebase.firestore();
                const doc = await db.collection('mrfForms').doc(id).get();
                if (doc.exists) {
                    const data = doc.data();
                    setFormData(data);
                    setParts(data.parts || []);
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handlePartChange = (e, index) => {
        const { name, value } = e.target;
        const updatedParts = [...parts];
        updatedParts[index][name] = value;
        setParts(updatedParts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const db = firebase.firestore();
            await db.collection('mrfForms').doc(id).update({
                ...formData,
                parts: parts
            });
            onClose();
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };

    if (!showForm) return null;

    if (loading) {
        return (
            <div className="modal show">
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }


    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Release Form Edit</h2>
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
                            value={formData.address || ''}
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
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Department:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                    </div>
                    <table className="parts-table">
                        <thead>
                            <tr>
                                <th>Unit</th>
                                <th>Brand Name</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map((part, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            className="add-form-text"
                                            type="text"
                                            name="part"
                                            value={part.part}
                                            onChange={(e) => handlePartChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="add-form-text"
                                            type="text"
                                            name="brandName"
                                            value={part.brandName}
                                            onChange={(e) => handlePartChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="add-form-text"
                                            type="text"
                                            name="remarks"
                                            value={part.remarks}
                                            onChange={(e) => handlePartChange(e, index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <label>Released by:</label>
                        <input
                            className="add-form-text"
                            type="text"
                            name="releasedBy"
                            value={formData.releasedBy}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date Released:</label>
                        <input
                            type="date"
                            name="dateReleased"
                            value={formData.dateReleased}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit"><FaUpload /> Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MRFEditForm;
