import React, { useState } from 'react';
import './styles/SideNav.css';

const SideNav = ({ onOptionClick, onLogout }) => {
  const options = [
    'Dashboard',
    'MIS Form 1',
    'MIS Form 2',
    'MIS Form 3',
    'MIS Form 4',
    'MIS Form 5',
    'MIS Form 6',
    'MIS Form 7',
    'MIS Form 8',
    'MIS Form 9',
    'MIS Form 10',
    'Settings'
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionClick(option);
  };

  return (
    <nav className="side-nav">
      <ul>
        {options.map(option => (
          <li key={option}>
            <a href="#" onClick={() => handleOptionClick(option)} className={selectedOption === option ? 'active' : ''}>
              {option}
            </a>
          </li>
        ))}
      </ul>
      <footer className="footer">
        
      </footer>
    </nav>
  );
};

export default SideNav;
