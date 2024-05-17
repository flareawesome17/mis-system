import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import Firestore
import './styles/MainContainer.css';
import MJRAddForm from './MJR-add-form';
import MJREditForm from './MJR-edit-form';
import './styles/Settings.css';


const MainContainer = ({ user, onLogout }) => {
    
    const [selectedOption, setSelectedOption] = useState('Dashboard');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [acceptedData, setAcceptedData] = useState([]);
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [address, setAddress] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Fetch user settings from Firestore on component mount
        const fetchUserSettings = async () => {
            try {
                const user = firebase.auth().currentUser;
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userDocRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    setDepartment(userData.department || ''); // Set department from Firestore or default value
                    setPosition(userData.position || ''); // Set position from Firestore or default value
                    setAddress(userData.address || ''); // Set address from Firestore or default value
                }
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        fetchUserSettings();
    }, []); // Run only once on component mount

    const handleOptionClick = (option) => {
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
            }, { merge: true }); // Merge with existing data in Firestore
            setNotification('User profile updated successfully');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            alert("Successfully saved");
        } catch (error) {
            setNotification('Error updating user profile');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            console.error('Error updating user profile:', error);
            alert("Error");
        }
    
    };

    const handleAddButtonClick = () => {
        setShowAddForm(true);
    };

    const handleEditButtonClick = (index) => {
        setShowEditForm(true);
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

    const renderContent = () => {
        switch (selectedOption) {
            case 'Dashboard':
            return (
                <div className="content">
                    <div className="content-header-title">Dashboard</div>
                    <div className="table-container">
                        <MJRAddForm showForm={showAddForm} onClose={handleCloseModal} onSubmit={addFormDataToTable} />
                        <table>
                            <thead>
                                <tr>
                                    <th>MJR No.</th>
                                    <th>Requested by</th>
                                    <th>Noted by</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Accepted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.filter(data => data.accepted === false || data.accepted === null).map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.mjrNo}</td>
                                        <td>{data.requestedBy}</td>
                                        <td>{data.notedBy}</td>
                                        <td>{data.department}</td>
                                        <td>{data.location}</td>
                                        <td>{data.description}</td>
                                        <td>{data.date}</td>
                                        <td>{data.accepted ? 'True' : 'False'}</td>
                                        <td>
                                            <button className="action-button-accept" onClick={() => handleAcceptButtonClick(index)}>Accept</button>
                                            <button className="action-button-deny">Deny</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'MIS Form 1':
            return (
                <div className="content">
                    <div className="content-header-title">MIS Job Request</div>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search..."
                        />
                        <button className="search-button">Search</button>
                        <button className="add-button" onClick={handleAddButtonClick}>Add</button>
                        <MJRAddForm showForm={showAddForm} onClose={handleCloseModal} onSubmit={addFormDataToTable} />
                        <button className="print-button">Print</button>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>MJR No.</th>
                                    <th>Requested by</th>
                                    <th>Noted by</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Accepted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acceptedData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.mjrNo}</td>
                                        <td>{data.requestedBy}</td>
                                        <td>{data.notedBy}</td>
                                        <td>{data.department}</td>
                                        <td>{data.location}</td>
                                        <td>{data.description}</td>
                                        <td>{data.date}</td>
                                        <td>{data.status}</td>
                                        <td>{data.accepted}</td>
                                        <td>
                                            <button className="action-button-edit" onClick={handleEditButtonClick(index)}>Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
                
            case 'MIS Form 2':
                return (
                    <div className="content">
                        <div className="content-header-title">Preventive Maintenance Checklist and Servicing Report</div>
                        {/* Content specific to MIS Form 2 */}
                    </div>
                );
            case 'MIS Form 3':
                return (
                    <div className="content">
                        <div className="content-header-title">Computer Inventory</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>PC no.</th>
                                        <th>Position</th>
                                        <th>User</th>
                                        <th>Department</th>
                                        <th>Unit Location</th>                                        
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>PC 001</td>
                                        <td>MIS</td>
                                        <td>Ernie</td>
                                        <td>Accounting</td>
                                        <td>Admin Office</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 4':
                return (
                    <div className="content">
                        <div className="content-header-title">Request Slip</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Computer Unit User</th>                                        
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>Factory Manager</td>                                        
                                        <td>Froilan Villanueva</td>
                                        <td>04-20-2024</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 5':
                return (
                    <div className="content">
                        <div className="content-header-title">Cleaning Materials Inventory</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Technical Description</th>                                        
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>Vacume</td>                                        
                                        <td>2</td>
                                        <td>Pcs</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 6':
                return (
                    <div className="content">
                        <div className="content-header-title">Server Back-up Checklist and Receiving Receipt of Cashier</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Server Name</th>
                                        
                                        <th>File size</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>WIMS Server 192.168.1.10</td>                                        
                                        <td>25MB</td>
                                        <td>04-20-2024</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 7':
                return (
                    <div className="content">
                        <div className="content-header-title">Back-up Checklist and Receiving Receipt of Cashier</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Position</th>
                                        <th>Name</th>
                                        <th>File size</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>Factory Manager</td>
                                        <td>Froilan Villanueva</td>
                                        <td>25MB</td>
                                        <td>04-20-2024</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 8':
                return (
                    <div className="content">
                        <div className="content-header-title">Endorsment Form</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Endorsed by</th>
                                        <th>Noted by</th>
                                        <th>Recieved and inspected by</th>
                                        <th>Date Recieved</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>Accounting</td>
                                        <td>04-20-2024</td>
                                        <td>Ernie</td>
                                        <td>Lyndolyn</td>
                                        <td>Ernie</td>
                                        <td>04-20-2024</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 9':
                return (
                    <div className="content">
                        <div className="content-header-title">MIS Endorsment</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item no.</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Item Description</th>
                                        <th>Reason for Endorsment</th>      
                                        <th>Department</th>
                                        <th>Endorsed by</th>
                                        <th>Date Endorsed</th>
                                        <th>Recieved by</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>001</td>
                                        <td>1</td>
                                        <td>pcs.</td>
                                        <td>Router Mikrotek</td>
                                        <td>Upgrade of network</td>
                                        <td>IT</td>
                                        <td>Ernie</td>
                                        <td>2024-04-20</td>
                                        <td>Ernie</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'MIS Form 10':
                return (
                    <div className="content">
                        <div className="content-header-title">MIS Release Form</div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search..."
                            />
                            <button className="search-button">Search</button>
                            <button className="add-button">Add</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>PC Number</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table rows will go here */}
                                    <tr>
                                        <td>Ernie Saavedra Jr</td>
                                        <td>MIS</td>
                                        <td>Accounting</td>
                                        <td>2024-04-20</td>
                                        <td>PC001</td>
                                        <td>
                                            <button className="action-button-view">View</button>
                                            <button className="action-button-edit">Edit</button>
                                            <button className="action-button-delete">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Settings':
                return (
                    <div className="settings-content">
                        <h2>Settings</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="department">Department:</label>
                                <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="position">Position:</label>
                                <input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                );
                
            default:
                return (
                    <div className="content">
                        <div className="content-header-title">Please select an option from the side navigation.</div>
                    </div>
                );
        }
    };

    return (
        <div className="main-container">
            <SideNav onOptionClick={handleOptionClick} />
            <div className="main-content">
                {renderContent()}
                {showEditForm && <MJREditForm showForm={showEditForm} onClose={handleCloseModal} />}
            </div>
        </div>
    );
    
};

export default MainContainer;
