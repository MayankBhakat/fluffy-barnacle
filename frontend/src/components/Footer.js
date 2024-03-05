// Footer.js

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" >
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>

       

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            IIT Guwahati,Assam <br />
            Odisha
          </p>
          <p>Email: subham.bhakat01@gmail.com</p>
          <p>Phone: +91 7008030235</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
