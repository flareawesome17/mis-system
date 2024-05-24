import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './styles/ConfirmationDialog.css';

const Dashboard = ({ user }) => {
    const [acceptedData, setAcceptedData] = useState([]);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState('');

    useEffect(() => {
        if (user) {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            const unsubscribeUser = userDocRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    setAddress(userData.address || '');
                    setPosition(userData.position || '');
                } else {
                    console.log('No such document!');
                }
            }, (error) => {
                console.error('Error fetching user data:', error);
            });

            return () => unsubscribeUser();
        } else {
            console.log('No user is logged in.');
        }
    }, [user]);

    useEffect(() => {
        const fetchData = () => {
            const db = firebase.firestore();
            const dataRef = db.collection('mjrForms')
                .where('accepted', '==', false)
                .where('address', '==', address.toUpperCase());
            const unsubscribeData = dataRef.onSnapshot((snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort data by mjrNo in descending order
                data.sort((a, b) => a.mjrNo - b.mjrNo);
                setAcceptedData(data);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });

            return () => unsubscribeData();
        };

        fetchData();

    }, [address]);

    const handleAcceptButtonClick = async (id) => {
        try {
            const db = firebase.firestore();
            await db.collection('mjrForms').doc(id).update({ 
                accepted: true,
                acceptedBy: user.displayName // Use user.displayName directly
            });
            console.log('Document successfully updated!');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    const allowedPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS'];

    return (
        <div className="content">
            <div className="content-header-title">MIS Job Request</div>
            
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
                                                <button className="action-button-accept" onClick={() => handleAcceptButtonClick(data.id)}><FaCheck />  Accept</button>
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
    );
};

export default Dashboard;
