// Header.js

import React from 'react';
import './Header.css';

import SidebarDropdown from './SidebarDropdown'; // Import the SidebarDropdown component




const Header = () => {
  return (
    <header className="header">
      <SidebarDropdown/>
      <div ></div>
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <img
            src="https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703765118/Home2_vfcdpb.png"
            alt="Logo"
            width="100"
            height="40"
            style={{ marginRight: '5px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' ,flexDirection: 'column'}}>
          <div style={{ fontSize: '1.3em',marginBottom: "-6px",marginTop:"-10px" ,color:"black",fontWeight: 'bold'}}>RealMod</div>
          <div style={{ fontSize: '0.5em',marginLeft: "-20px" ,color:"#3498db"}}>Real Estate Agency</div>
        </div>
      </div>
      
      <nav className="nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="login-button">Login</button>
        <button className="register-button">Register</button>
      </div>
    </header>
  );
};

export default Header;
