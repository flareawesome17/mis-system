import React, { useState } from 'react';
import './styles/MJR-edit-form.css';

const MJREditForm = ({ showForm, onClose }) => {
    // State to hold form data
    const [formData, setFormData] = useState({
        mjrNo: '',
        requestedBy: '',
        notedBy: '',
        department: '',
        location: '',
        description: '',
        date: '',
        status: '',
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
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
                        <label>Requested by:</label>
                        <input
                            type="text-edit-form"
                            name="requestedBy"
                            value={formData.requestedBy}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Noted by:</label>
                        <input
                            type="text-edit-form"
                            name="notedBy"
                            value={formData.notedBy}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Department:</label>
                        <input
                            type="text-edit-form"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text-edit-form"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text-edit-form"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
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
                        <label>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Finished">Finished</option>
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

export default MJREditForm;
