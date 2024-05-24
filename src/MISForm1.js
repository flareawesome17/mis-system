import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaPrint } from 'react-icons/fa';
import MJRAddForm from './MJR-add-form';
import MJREditForm from './MJR-edit-form';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './styles/MISForm1.css';
import { FaAngleLeft, FaAngleRight, FaTrash } from 'react-icons/fa6';

const MISForm1 = ({ user, handleLogoutClick }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [acceptedData, setAcceptedData] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState('');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editItemId, setEditItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState(''); // New state for status filter
    const [pendingCount, setPendingCount] = useState(0); // New state for notification count

    useEffect(() => {
        if (user) {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            const unsubscribe = userDocRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    setAddress(userData.address.toUpperCase() || '');
                    setPosition(userData.position || '');
                } else {
                    console.log('No such document!');
                }
            }, (error) => {
                console.error('Error fetching user data:', error);
            });

            return () => unsubscribe();
        } else {
            console.log('No user is logged in.');
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const db = firebase.firestore();
                const dataRef = db.collection('mjrForms');
                dataRef.onSnapshot((snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setAcceptedData(data);
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (address) {
            const db = firebase.firestore();
            const unsubscribe = db.collection('mjrForms')
                .where('status', '==', 'Pending')
                .where('address', '==', address.toUpperCase())
                .onSnapshot(snapshot => {
                    const count = snapshot.docs.length;
                    setPendingCount(count);
                });

            return () => unsubscribe();
        }
    }, [address]);

    const handleAddButtonClick = () => {
        setShowAddForm(true);
    };

    const handleEditButtonClick = (id) => {
        setEditItemId(id);
        setShowEditForm(true);
    };

    const addFormDataToTable = (formData) => {
        const db = firebase.firestore();
        db.collection('mjrForms').add(formData)
            .then(() => {
                console.log('Form data stored successfully');
            })
            .catch((error) => {
                console.error('Error storing form data:', error);
            });
    };

    const handleDeleteButtonClick = (id) => {
        setDeleteConfirmation(id);
    };

    const handleConfirmation = async (confirmed, id) => {
        if (confirmed) {
            try {
                const db = firebase.firestore();
                await db.collection('mjrForms').doc(id).delete();
                setAcceptedData(acceptedData.filter(item => item.id !== id));
                alert('Document successfully deleted!');
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
        setDeleteConfirmation(null);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const filterDataByDateRangeAndStatus = () => {
        let filtered = acceptedData;

        if (startDate && endDate) {
            filtered = filtered.filter(data => {
                const dataDate = new Date(data.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                return dataDate >= start && dataDate <= end;
            });
        }

        if (statusFilter) {
            filtered = filtered.filter(data => data.status === statusFilter);
        }

        return filtered.filter(data => data.address === address).sort((a, b) => b.mjrNo - a.mjrNo);
    };

    const filteredData = filterDataByDateRangeAndStatus();

    const handlePrint = () => {
        window.print();
    };

    const allowedPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS'];

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    return (
        <div className="content">
            <div className="content-header no-print">
                <div className="content-header-title">MIS Job Request</div>
                {user && (
                    <div className="user-info-container">
                        <span className="user-info">({address})</span>
                    </div>
                )}
            </div>
            <div className="search-bar-container no-print">
                <div className="search-actions">
                    <button className="add-button" onClick={handleAddButtonClick}>
                        <FaPlus />
                    </button>
                    {allowedPositions.includes(position) &&
                        <button className="print-button" onClick={handlePrint}>
                            <FaPrint />
                        </button>
                    }
                </div>
                {allowedPositions.includes(position) && (
                    <div className="date-filter-container">
                        <div className="date-filter">
                            <label htmlFor="startDate">Date Start:</label>
                            <input
                                type="date"
                                id="startDate"
                                placeholder="Start Date"
                                onChange={handleStartDateChange}
                                value={startDate}
                            />
                        </div>
                        <div className="date-filter">
                            <label htmlFor="endDate">Date End:</label>
                            <input
                                type="date"
                                id="endDate"
                                placeholder="End Date"
                                onChange={handleEndDateChange}
                                value={endDate}
                            />
                        </div>
                    </div>
                )}
                <div className="status-filter-container no-print">
                    <label htmlFor="statusFilter">Status:</label>
                    <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        
                        {/* Add other status options as needed */}
                    </select>
                </div>
                <div className="items-per-page-container">
                    <label htmlFor="itemsPerPage">Items per page:</label>
                    <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
            {pendingCount > 0 && (
                <div className="pending-notification no-print">
                {allowedPositions.includes(position) &&<span>You have {pendingCount} pending requests.</span>}
                </div>
            )}
            <MJRAddForm showForm={showAddForm} onClose={() => setShowAddForm(false)} onSubmit={addFormDataToTable} />
            <MJREditForm showForm={showEditForm} onClose={() => setShowEditForm(false)} id={editItemId} />

            <div className="table-container">
                {loading ? (
                    <div className="loading-animation">
                        <div className="loading-circle"></div>
                        <span>Loading...</span>
                    </div>
                ) : (
                    <>
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
                                    <th>Accepted By (MIS)</th>
                                    <th>Date Finished</th>
                                    {allowedPositions.includes(position) && <th>Status</th>}
                                    {allowedPositions.includes(position) && <th className="no-print">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.mjrNo}</td>
                                        <td>{data.requestedBy}</td>
                                        <td>{data.notedBy}</td>
                                        <td>{data.department}</td>
                                        <td>{data.location}</td>
                                        <td>{data.description}</td>
                                        <td>{data.date}</td>
                                        <td>{data.acceptedBy}</td>
                                        <td>{data.dateFinished}</td>
                                        {allowedPositions.includes(position) && (<td>{data.status}</td>)}
                                        {allowedPositions.includes(position) && (
                                            <td className="no-print">
                                                <button className="action-button-edit" onClick={() => handleEditButtonClick(data.id)}><FaEdit /> Edit</button>
                                                <button className="action-button-delete" onClick={() => handleDeleteButtonClick(data.id)}><FaTrash /> Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination-container no-print">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}><FaAngleLeft /></button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}><FaAngleRight /></button>
                        </div>
                    </>
                )}
            </div>
            {deleteConfirmation && (
                <div className="confirmation-dialog">
                    <p>Do you want to delete this row?</p>
                    <button className="confirmation-button yes-button" onClick={() => handleConfirmation(true, deleteConfirmation)}>Yes</button>
                    <button className="confirmation-button no-button" onClick={() => handleConfirmation(false, deleteConfirmation)}>No</button>
                </div>
            )}
        </div>
    );
};

export default MISForm1;
