import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './styles/MainContainer.css';
import './styles/Settings.css';
import Dashboard from './Dashboard';
import MISForm1 from './MISForm1';
import MISForm10 from './MISForm10';
import Settings from './Settings';
import PswdManager from './passwordManager-add';


const MainContainer = ({ user, onLogout }) => {
    const [selectedOption, setSelectedOption] = useState('Dashboard'); // Default to 'Dashboard'
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showViewForm, setShowViewForm] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [acceptedData, setAcceptedData] = useState([]);
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [address, setAddress] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const user = firebase.auth().currentUser;
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userDocRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    setDepartment(userData.department || '');
                    setPosition(userData.position || '');
                    setAddress(userData.address || '');
                }
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        fetchUserSettings();
    }, []);

    const onOptionClick = (option) => {
        setSelectedOption(option);
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;

        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            await userDocRef.set({
                department,
                position,
                address
            }, { merge: true });
            setNotification('User profile updated successfully');
            setTimeout(() => {
                setNotification('');
            }, 3000);
        } catch (error) {
            setNotification('Error updating user profile');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            console.error('Error updating user profile:', error);
        }
    };

    const handleAddButtonClick = () => {
        setShowAddForm(true);
    };

    const handleEditButtonClick = (index) => {
        setShowEditForm(true);
    };
    const handleViewButtonClick = (index) => {
        setShowViewForm(true);
    };

    const handleCloseModal = () => {
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const addFormDataToTable = (formData) => {
        setTableData([...tableData, formData]);
    };

    const handleAcceptButtonClick = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].accepted = true;
        setTableData(updatedTableData);

        const acceptedFormData = updatedTableData[index];
        setAcceptedData([...acceptedData, acceptedFormData]);
    };

    return (
        <div className="main-container">
            <SideNav onOptionClick={onOptionClick} onLogout={onLogout} />
            {selectedOption === 'Dashboard' && <Dashboard tableData={tableData} showAddForm={showAddForm} handleCloseModal={handleCloseModal} addFormDataToTable={addFormDataToTable} handleAcceptButtonClick={handleAcceptButtonClick} />}
            {selectedOption === 'MIS Form 1' && <MISForm1 acceptedData={acceptedData} showAddForm={showAddForm} handleCloseModal={handleCloseModal} addFormDataToTable={addFormDataToTable} handleEditButtonClick={handleEditButtonClick} />}
            {selectedOption === 'MIS Form 10' && <MISForm10 showAddForm={showAddForm} handleCloseModal={handleCloseModal} addFormDataToTable={addFormDataToTable} handleViewButtonClick={handleViewButtonClick} />}
            {selectedOption === 'PSWD Manager' && <PswdManager showAddForm={showAddForm} handleCloseModal={handleCloseModal} addFormDataToTable={addFormDataToTable} handleViewButtonClick={handleViewButtonClick} />}
            {selectedOption === 'Settings' && <Settings department={department} position={position} address={address} handleSubmit={handleSubmit} setDepartment={setDepartment} setPosition={setPosition} setAddress={setAddress} />}
        </div>
    );
};

export default MainContainer;
