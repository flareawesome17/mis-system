import React, { useState, useEffect } from 'react';
import './styles/MJR-add-form.css';

const MJRAddForm = ({ showForm, onClose, onSubmit }) => {
    // State to hold form data
    const [formData, setFormData] = useState({
        mjrNo: 1, // Initial value of mjrNo
        requestedBy: '',
        notedBy: '',
        department: '',
        location: '',
        description: '',
        date: '',
        status: 'Pending', // Default value of status
    });

    // Load mjrNo from localStorage on component mount
    useEffect(() => {
        const storedMjrNo = localStorage.getItem('mjrNo');
        if (storedMjrNo) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                mjrNo: parseInt(storedMjrNo),
            }));
        }
    }, []);

    // Update mjrNo in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mjrNo', formData.mjrNo);
    }, [formData.mjrNo]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Increment mjrNo for the next form
        setFormData((prevFormData) => ({
            ...prevFormData,
            mjrNo: prevFormData.mjrNo + 1,
        }));
        // Perform form submission logic here
        console.log(formData);
        // Close the form after submission
        onClose();
    };

    return (
        <div className={`modal ${showForm ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Job Request Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>MJR No:</label>
                        <input
                        // MJR No is a read-only field
                            className="add-form-text"
                            type="text"
                            name="mjrNo"
                            value={formData.mjrNo}
                            onChange={handleChange}
                            hidden // Disable editing of mjrNo
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
                        <label>Noted by:</label>
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
                    <div className="button-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MJRAddForm;
