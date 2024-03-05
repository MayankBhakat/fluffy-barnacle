import React from 'react';
import './Center.css';


const Center=() => {
    return (
        <div>
            <div style={{height:'500px',backgroundColor:'white',position:'relative'}}>
                <div style={{backgroundImage:"url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703839681/homie_wlb1t9.png)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height:'200px',
                width:'500px',
                zIndex:'20',
                position:'absolute',
                 transform: 'translate(-50%, -50%)',
                left:'50%',
                top:'61.8%',
                borderRadius:'20px',
                border: '4px solid #fff', // Extra border
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
            }}></div>

            <div style={{backgroundImage:"url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703844928/homi24_cwc0if.png)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height:'300px',
                width:'300px',
                zIndex:'20',
                position:'absolute',
                transform: 'translate(-50%, -50%)',
                left:'80%',
                top:'72%',
                borderRadius:'20px',
                border: '4px solid #fff', // Extra border
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
            }}></div>

        <h1
          style={{
            position: 'absolute',
            color: '#333', // Darker text color
            fontWeight: 'bold',
            fontSize: '30px', // Adjust font size
            lineHeight: '1.5', // Adjust line height for better readability
            width: '400px',
            left: '200px',
            top: '80px',
            
            fontFamily: 'cursive, Calligraffitti, sans-serif',// Apply a custom font
            zIndex: '21', // Set higher zIndex to be above other elements
            textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)', // Add a subtle text shadow
            textAlign: 'center', // Center the text
          }}
        >
          Discover Your Dream Home
        </h1>

            <div style={{backgroundImage:"url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703844939/homie23_ygtzbz.png)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height:'200px',
                width:'500px',
                zIndex:'19',
                position:'absolute',
                transform: 'translate(-50%, -50%)',
                left:'67%',
                top:'30%',
                borderRadius:'20px',
                border: '4px solid #fff', // Extra border
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
            }}></div>
            
            </div>
        <div  style={{
            backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703835915/Homee3_suxzuq.png)" ,
      
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '300px',
            color: 'white',
          }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-around',
                         paddingTop: '35px' ,
                         height:'300px',
                         paddingBottom: '35px',
                         paddingLeft: '100px',
                         paddingRight: '100px',
                         background: 'linear-gradient(to bottom, rgb(62,62,62), #f6f3f3)',
                        }} >
            <div style={{
            backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703848445/fss_t4gynm.png)" ,
      
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '300px',
            width:'300px',
            borderRadius:'20px',
                border: '4px solid #fff', // Extra border
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
            color: 'white',
            position:'relative',
          }}>
            <div   style={{
    position: 'absolute',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '110px',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer', // Set cursor to pointer
    transition: 'background-color 0.3s', // Add transition for smoother color change
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#297fb8'} // Change color on hover
  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'} // Restore color on hover out
>
            Find a home
            </div>
          </div>
            <div
            style={{
                backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703848677/fss4_dzqjzw.png)" ,
          
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '300px',
                width:'300px',
                color: 'white',
                borderRadius:'20px',
                border: '4px solid #fff', // Extra border
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
                position:'relative',
              }}>
                 <div   style={{
    position: 'absolute',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '110px',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer', // Set cursor to pointer
    transition: 'background-color 0.3s', // Add transition for smoother color change
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#297fb8'} // Change color on hover
  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'} // Restore color on hover out
>
            Rent a home
            </div>
              </div>
            <div
            style={{
                backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703848445/fss2_kqfypw.png)" ,
          
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '300px',
                width:'300px',
                color: 'white',
                borderRadius:'20px',
                border: '4px solid #fff', // Extra border
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
                position:'relative',
              }}>
                 <div  style={{
    position: 'absolute',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '110px',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer', // Set cursor to pointer
    transition: 'background-color 0.3s', // Add transition for smoother color change
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#297fb8'} // Change color on hover
  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'} // Restore color on hover out
>
            Place an ad
            </div>
              </div>

          </div>
          </div>
          
    );
};

export default Center
