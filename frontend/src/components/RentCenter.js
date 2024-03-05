import React from 'react';
import './RentCenter.css'; // Import a CSS file for styling


function RentCenter() {
  return (
    <div style={{height: '450px', backgroundColor: 'white', paddingTop: '50px', paddingLeft: '7%' ,paddingBottom:'20px'}}>
    <div style={{  display: 'flex', flexDirection: 'row'}}>
      <div style={{
        backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703870528/pokeee_opqkyx.png)",
        flex: '0 0 35%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '350px',
        width: '500px',
        borderRadius: '20px',
        border: '4px solid #fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: '23',
      }}></div>

      <div style={{
        flex: '0 0 60%',
        position: 'relative',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '30px',
        lineHeight: '1.5',
        width: '400px',
        paddingTop: '30px',
        fontFamily: 'cursive, Calligraffitti, sans-serif',
        zIndex: '21',
        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
      }}>
        We make it easy for Tenants and Landlords
        <div className="button-container">
          <div className="button">For Tenants</div>
          <div className="button">For Landlords</div>
        </div>
      </div>
    </div>
   
    </div>
  );
}

export default RentCenter;
