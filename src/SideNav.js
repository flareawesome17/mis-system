import React, { useState, useEffect } from 'react';
import { FaPlus, FaPrint, FaChartBar, FaCog, FaChevronLeft, FaChevronRight, FaRegQuestionCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './styles/SideNav.css';
import { FaBattleNet, FaCheckDouble, FaDungeon, FaFolder, FaFolderPlus, FaHashnode, FaItunesNote, FaMessage, FaPersonDotsFromLine, FaStar } from 'react-icons/fa6';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { MdAssignmentAdd } from 'react-icons/md';

const SideNav = ({ user }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [strNotificationCount, setStrNotificationCount] = useState(0);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState('');
    const allowedPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS'];
    const allowedStrPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS', 'Store Room Clerk', 'STORE ROOM CLERK'];

    useEffect(() => {
        if (user) {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            const unsubscribeUser = userDocRef.onSnapshot((doc) => {
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

            return () => unsubscribeUser();
        } else {
            console.log('No user is logged in.');
        }
    }, [user]);

    useEffect(() => {
        if (address) {
            const db = firebase.firestore();
            const unsubscribeMJR = db.collection('mjrForms')
                .where('accepted', '==', false)
                .where('address', '==', address.toUpperCase())
                .onSnapshot(snapshot => {
                    const count = snapshot.docs.length;
                    setNotificationCount(count);
                });

            const unsubscribeSTR = db.collection('strForms')
                .where('status', '==', 'Pending')
                .where('address', '==', address.toUpperCase())
                .onSnapshot(snapshot => {
                    const count = snapshot.docs.length;
                    setStrNotificationCount(count);
                });

            return () => {
                unsubscribeMJR();
                unsubscribeSTR();
            };
        }
    }, [address]);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const options = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="link-icon" /> },
        { name: 'MIS Form 1', path: '/form1', icon: <MdAssignmentAdd className="link-icon" /> },
        { name: 'MIS Form 10', path: '/form10', icon: <FaFolderPlus className="link-icon" /> },
        { name: 'STR', path: '/storeroom', icon: <FaDungeon className="link-icon" /> },
        { name: 'PSWD Manager', path: '/pswdmanager', icon: <FaStar className="link-icon" /> },
        { name: 'Settings', path: '/settings', icon: <FaCog className="link-icon" /> }
    ];

    const filteredOptions = options.filter(option => {
        if (option.name === 'MIS Form 10') {
            return allowedPositions.includes(position);
        }
        if (option.name === 'PSWD Manager') {
            return allowedPositions.includes(position);
        }
        if (option.name === 'STR') {
            return allowedStrPositions.includes(position);
        }
        return true;
    });

    return (
        <nav className={`side-nav no-print ${collapsed ? 'collapsed' : ''}`}>
            <ul>
                {filteredOptions.map(option => (
                    <li key={option.name}>
                        <NavLink
                            to={option.path}
                            activeClassName="active"
                        >
                            {option.icon}
                            {!collapsed && <span className="link-text">{option.name}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <footer className="footer">
                {(notificationCount > 0 || strNotificationCount > 0) && (
                    <div className="notification-count">
                        {notificationCount > 0 && <div>MJR: {notificationCount}</div>}
                        {strNotificationCount > 0 && <div>STR: {strNotificationCount}</div>}
                    </div>
                )}
                <button onClick={toggleCollapse}>
                    {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            </footer>
        </nav>
    );
};

export default SideNav;
