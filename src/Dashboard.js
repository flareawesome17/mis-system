import React, { useState, useEffect, useCallback } from 'react';
import { FaCheck, FaThumbsUp, FaThumbsDown } from 'react-icons/fa6';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './styles/ConfirmationDialog.css';

const Dashboard = ({ user }) => {
    const [acceptedData, setAcceptedData] = useState([]);
    const [strForms, setStrForms] = useState([]);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [mjrNotificationSent, setMjrNotificationSent] = useState(false);
    const [strNotificationSent, setStrNotificationSent] = useState(false);

    const fetchUserData = useCallback((userId) => {
        const userDocRef = firebase.firestore().collection('users').doc(userId);
        const unsubscribe = userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                setUserInfo(userData);
                setAddress(userData.address || '');
                setPosition(userData.position || '');
            } else {
                console.log('No such document!');
            }
        }, (error) => {
            console.error('Error fetching user data:', error);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            return fetchUserData(user.uid);
        }
    }, [user, fetchUserData]);

    useEffect(() => {
        if (!address) return;

        const db = firebase.firestore();
        const mjrDataRef = db.collection('mjrForms')
            .where('accepted', '==', false)
            .where('address', '==', address.toUpperCase());
        const strDataRef = db.collection('strForms')
            .where('status', '==', 'Pending')
            .where('address', '==', address.toUpperCase());

        const unsubscribeMjrData = mjrDataRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => a.mjrNo - b.mjrNo);
            setAcceptedData(data);
            setLoading(false);
            if (data.length > 0 && !mjrNotificationSent) {
                sendPushNotification('MJR Forms Fetched', `Fetched ${data.length} MJR forms`);
                setMjrNotificationSent(true);
            }
        }, (error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });

        const unsubscribeStrData = strDataRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStrForms(data);
            setLoading(false);
            if (data.length > 0 && !strNotificationSent) {
                sendPushNotification('STR Forms Fetched', `Fetched ${data.length} STR forms`);
                setStrNotificationSent(true);
            }
        }, (error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });

        return () => {
            unsubscribeMjrData();
            unsubscribeStrData();
        };
    }, [address, mjrNotificationSent, strNotificationSent]);

    const sendPushNotification = (title, body) => {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body,
                icon: 'icon.png'
            });
        });
    };

    const formatDisplayName = (displayName) => {
        if (!displayName) return '';
        const names = displayName.split(' ');
        if (names.length === 1) return names[0];
        return `${names[0]} ${names[1].charAt(0)}.`;
    };

    const getUserDisplayName = () => {
        if (user.providerData[0].providerId === 'google.com') {
            return formatDisplayName(user.displayName);
        } else {
            return formatDisplayName(userInfo ? userInfo.name : '');
        }
    };

    const handleAcceptButtonClick = async (id) => {
        try {
            const db = firebase.firestore();
            await db.collection('mjrForms').doc(id).update({
                accepted: true,
                acceptedBy: getUserDisplayName()
            });
            console.log('Document successfully updated!');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    const handleStrStatusUpdate = async (id, status) => {
        try {
            const db = firebase.firestore();
            await db.collection('strForms').doc(id).update({ status });
            console.log(`Form ${id} updated to ${status}`);
        } catch (error) {
            console.error(`Error updating form ${id}:`, error);
        }
    };

    const allowedPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS'];

    return (
        <div className="content">
            <div className="content-header-title">Dashboard</div>

            <div className="content-section">
                <div className="content-header">MIS Job Request</div>
                <div className="table-container">
                    {loading ? (
                        <div className="loading-animation">
                            <span>Loading...</span>
                        </div>
                    ) : (
                        acceptedData.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>MJR No.</th>
                                        <th>Requested by</th>
                                        <th>Noted by</th>
                                        <th>Department</th>
                                        <th>Location</th>
                                        <th>Address</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        {allowedPositions.includes(position) && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {acceptedData.map((data) => (
                                        <tr key={data.id}>
                                            <td>{data.mjrNo}</td>
                                            <td>{data.requestedBy}</td>
                                            <td>{data.notedBy}</td>
                                            <td>{data.department}</td>
                                            <td>{data.location}</td>
                                            <td>{data.address}</td>
                                            <td>{data.description}</td>
                                            <td>{data.date}</td>
                                            {allowedPositions.includes(position) && (
                                                <td>
                                                    <button className="action-button-accept" onClick={() => handleAcceptButtonClick(data.id)}><FaCheck /> Accept</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No data to show</div>
                        )
                    )}
                </div>
            </div>

            <div className="content-section">
                <div className="content-header">Store Room Requests</div>
                <div className="table-container">
                    {loading ? (
                        <div className="loading-animation">
                            <span>Loading...</span>
                        </div>
                    ) : (
                        strForms.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>STR No.</th>
                                        <th>Name</th>
                                        <th>Item Requested</th>
                                        <th>Remaining Items</th>
                                        <th>Department</th>
                                        <th>Requestor's Name</th>
                                        <th>Date Requested</th>
                                        <th>Status</th>
                                        {allowedPositions.includes(position) && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {strForms.map((form) => (
                                        <tr key={form.id}>
                                            <td>{form.strNo}</td>
                                            <td>{form.name}</td>
                                            <td>{form.itemRequested}</td>
                                            <td>{form.itemsRemaining}</td>
                                            <td>{form.department}</td>
                                            <td>{form.requestor}</td>
                                            <td>{form.dateRequested}</td>
                                            <td>{form.status}</td>
                                            {allowedPositions.includes(position) && (
                                                <td>
                                                    <button className="action-button-edit" onClick={() => handleStrStatusUpdate(form.id, 'Approved')}><FaThumbsUp /> Approve</button>
                                                    <button className="action-button-deny" onClick={() => handleStrStatusUpdate(form.id, 'Denied')}><FaThumbsDown /> Deny</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No data to show</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
