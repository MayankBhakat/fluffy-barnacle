import './login.css'
import axios from "axios";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";




function LoginPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const login = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/login", user);
      dispatch(HideLoading());
      toast.success(response.data.message);
      localStorage.setItem("access_token", response.data.data);
      localStorage.setItem("firstTime", 0);
      navigate("/");
      
    } catch (error) {
      
      //Always use .value to get theactual text
      dispatch(HideLoading());
      toast.error(error.response.data.message);
    }
  };

  const register = () =>{
    dispatch(ShowLoading());
    navigate("/register");
    dispatch(HideLoading());
  }

  const forgot_password = () =>{
    dispatch(ShowLoading());
    navigate("/forgot_password");
    dispatch(HideLoading());
  }

 

    return (
      <div  style={{
        backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1702827226/Real_login_xov0y4.png)" ,
  
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '700px',
        color: 'white',
      }}>
    <div className="login-box">
      <h2>WELCOME BACK</h2>
        <form>
          <div className="user-box">
            <input type="text"  
             value={user.email}
             onChange={(e) => setUser({ ...user, email: e.target.value })} />
            <label>User Email</label>
          </div>
          <div className="user-box">
            <input type="password" 
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}/>
            <label>Password</label>
          </div>
          <div className="checkbox-container">
    
      
      </div>
      
          <a onClick={login} style={{color:"#00bcd4"}}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
          <a className="register" style={{color:"#00bcd4"}} onClick={register}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Register
          </a>
          <a onClick={forgot_password} style={{color:"#00bcd4"}}>
          <span></span>
            <span></span>
            <span></span>
            <span></span>
            Forgot Password
          </a>
        </form>
      </div>
      </div> 
    );
  }

  export default LoginPage;