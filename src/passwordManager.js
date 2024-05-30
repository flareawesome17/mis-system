import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaPrint, FaTrash, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import PswdAdd from './passwordManager-add';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './styles/MISForm1.css';

const PswdManager = ({ user }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState('');
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pswrdManager, setPswrdManager] = useState([]);

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
        const fetchPswdData = () => {
            const db = firebase.firestore();
            const unsubscribe = db.collection('pswrdManager').onSnapshot(snapshot => {
                const pswdData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPswrdManager(pswdData);
                setLoading(false); // Set loading to false after data is fetched
            }, error => {
                console.error('Error fetching password data:', error);
                setLoading(false); // Set loading to false in case of error
            });
            return unsubscribe; // Unsubscribe from snapshot listener when component unmounts
        };
    
        const unsubscribe = fetchPswdData();
        return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
    }, []);

    const handleAddButtonClick = () => {
        setShowAddForm(true);
    };

    const handleStatusUpdate = async (id, status) => {
        const db = firebase.firestore();
        try {
            await db.collection('pswrdManager').doc(id).update({ status });
            console.log(`Password ${id} updated to ${status}`);
        } catch (error) {
            console.error(`Error updating password ${id}:`, error);
        }
    };

    const handleDeleteButtonClick = (id) => {
        setDeleteConfirmation(id);
    };

    const handleConfirmation = async (confirmed, id) => {
        if (confirmed) {
            try {
                const db = firebase.firestore();
                await db.collection('pswrdManager').doc(id).delete();
                console.log(`Password ${id} deleted successfully`);
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

    const filterDataByDateRangeAndAddress = () => {
        let filtered = pswrdManager;

        if (startDate && endDate) {
            filtered = filtered.filter(data => {
                const dataDate = new Date(data.dateRequested);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                return dataDate >= start && dataDate <= end;
            });
        }

        return filtered
            .filter(data => data.address === address)
            .sort((a, b) => b.pswrdNo - a.pswrdNo);
    };

    const filteredData = filterDataByDateRangeAndAddress();

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
                <div className="content-header-title">MIS Password Manager</div>
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
            <PswdAdd showForm={showAddForm} onClose={() => setShowAddForm(false)} />
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
                                <th>Password No.</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Account Type</th>
                                <th>Status</th>
                                {allowedPositions.includes(position) && (<th>Actions</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(data => (
                                <tr key={data.id} className={`table-row-${data.status.toLowerCase()}`}>
                                    <td>{data.pswrdNo}</td>
                                    <td>{data.email}</td>
                                    <td>{data.password}</td>
                                    <td>{data.accountType}</td>
                                    <td>{data.status}</td>
                                    {allowedPositions.includes(position) && (
                                        <td className="no-print">
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

export default PswdManager;
