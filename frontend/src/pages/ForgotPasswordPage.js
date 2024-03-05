import './login.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    randomCode: '',
  });
  const [err_msg, setErr_msg] = useState('');


  const generateRandomCode = () => {
    const randCode = Math.floor(1000 + Math.random() * 9000);
    setUser((user) => ({ ...user, randomCode: randCode }));
  };

  
  //Use useEffect to set the OTP.useState is not working bacause it is a async function
  //so when u run a code after that they dont stop on the useState function
  useEffect(() => {
    // Ensure that generateRandomCode completes before making API calls
    generateRandomCode();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  const forgot_pass = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/reset_Password_Mail', user);
      setErr_msg('');
      const user_id = response.data.userId;
      
      const unique_string = response.data.uniqueString;
      
      
      navigate(`/OTP/${user_id}/${unique_string}`);
      dispatch(HideLoading());
      toast.success(response.data.message);
      console.log(user_id, unique_string);
    } catch (error) {
      dispatch(HideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const resend_pass = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/resend_reset_Password_Mail', user);
      setErr_msg('');
      const user_id = response.data.userId;
      
      const unique_string = response.data.uniqueString;
      
      navigate(`/OTP/${user_id}/${unique_string}`);
      dispatch(HideLoading());
     
    } catch (error) {
      dispatch(HideLoading());
      setErr_msg(error.response.data.error.toUpperCase());
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1702827226/Real_login_xov0y4.png)",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '700px',
        color: 'white',
      }}
    >
      <div className="login-box">
        <h2>WELCOME BACK</h2>
        <div className="alert">{err_msg}</div>
        <form>
          <div className="user-box">
            <input
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <label>Username</label>
          </div>

          <a onClick={forgot_pass}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
          <a style={{ marginLeft: '53px' }} onClick={resend_pass}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Resend mail
          </a>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
