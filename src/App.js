import React from 'react';
import Header from './Header';
import SideNav from './SideNav';
import MainContainer from './MainContainer';
import './styles/App.css'; // Import CSS for styling

function App() {
  return (
    <div className="App">
      <Header />
      <div className="layout">
        <SideNav />
        <MainContainer />
      </div>
    </div>
  );
}

export default App;
