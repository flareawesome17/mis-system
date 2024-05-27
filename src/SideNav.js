import React, { useState, useEffect } from 'react';
import { FaPlus, FaPrint, FaChartBar, FaCog, FaChevronLeft, FaChevronRight, FaRegQuestionCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './styles/SideNav.css';
import { FaBattleNet, FaCheckDouble, FaItunesNote, FaMessage, FaPersonDotsFromLine } from 'react-icons/fa6';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const SideNav = ({ user }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState('');

    const allowedPositions = ['MIS STAFF', 'Mis Staff', 'mis staff', 'MIS'];

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
            const unsubscribe = db.collection('mjrForms')
                .where('accepted', '==', false)
                .where('address', '==', address.toUpperCase())
                .onSnapshot(snapshot => {
                    const count = snapshot.docs.length;
                    setNotificationCount(count);
                });

            return () => unsubscribe();
        }
    }, [address]);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const options = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="link-icon" /> },
        { name: 'MIS Form 1', path: '/form1', icon: <FaPersonDotsFromLine className="link-icon" /> },
        { name: 'MIS Form 10', path: '/form10', icon: <FaBattleNet className="link-icon" /> },
        { name: 'STR', path: '/str', icon: <FaCheckDouble className="link-icon" /> },
        { name: 'Settings', path: '/settings', icon: <FaCog className="link-icon" /> }
    ];

    const filteredOptions = options.filter(option => {
        if (option.name === 'MIS Form 10') {
            return allowedPositions.includes(position);
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
                {notificationCount > 0 && (
                    <div className="notification-count">{notificationCount}</div>
                )}
                <button onClick={toggleCollapse}>
                    {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            </footer>
        </nav>
    );
};

export default SideNav;
