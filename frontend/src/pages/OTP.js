import './OTP.css';
import axios from "axios";
import Timer from '../components/Timer.js'
import {OTPcode , number} from '../components/OTPcode.js'
import { Link, useNavigate ,useParams} from "react-router-dom";
import React, { useState , useEffect }  from "react";


function OTP() {

  const { user_id, unique_string } = useParams();
  const [time,setTime] = useState(0);
 
  const get_data_from_child = (data) =>{
    setTime(data);
   
  }
  return (
    <div className="container pokemon"  style={{
      backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1702827226/Real_login_xov0y4.png)",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '700px',
      color: 'white',
    }}>
     
     <Timer give_data_to_parent={get_data_from_child}  />
     <OTPcode user_id={user_id} unique_string={unique_string} time={time} />

      
    </div>
  )
}

export default OTP;