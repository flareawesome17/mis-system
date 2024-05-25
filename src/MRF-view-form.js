import React, { useState, useEffect } from 'react';
import './styles/MRF-add-form.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import { FaClosedCaptioning, FaPrint, FaXmark } from 'react-icons/fa6';

const MRFViewForm = ({ showForm, onClose, id }) => {
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Release Form Report</h2>
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
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        className="add-form-text"
                        type="text"
                        name="name"
                        value={formData.name}
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
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        readOnly
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
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <input
                                        className="add-form-text"
                                        type="text"
                                        name="brandName"
                                        value={part.brandName}
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <input
                                        className="add-form-text"
                                        type="text"
                                        name="remarks"
                                        value={part.remarks}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                        &nbsp;
                <div className="form-group">
                    <label>Released by:</label>
                    <input
                        className="add-form-text"
                        type="text"
                        name="releasedBy"
                        value={formData.releasedBy}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>Date Released:</label>
                    <input
                        type="date"
                        name="dateReleased"
                        value={formData.dateReleased}
                        readOnly
                    />
                </div>

                <div className="button-group no-print">
                    <button type="button-print" onClick={handlePrint}><FaPrint /> Print</button>
                </div>
            </div>
        </div>
    );
};

export default MRFViewForm;
