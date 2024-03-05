
import './register.css'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";

function RegisterPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user,setUser] = useState({
    name:"",
    email:"",
    password:"",
  })
  const [err_msg, setErr_msg] = useState("");
  const register= async()=>{
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/register", user);
      setErr_msg("");
     
      try{
        const response2 = await axios.post("/api/users/verify", user);
        dispatch(HideLoading())
        if(response.data.success){
        toast.success(response.data.message);
        }
        
        const myTimeout = setTimeout(() => {
          navigate("/login");
        }, 5000);
      }catch(error){
        dispatch(HideLoading());
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.response.data.message);
  
    } 



  }
    return (
      <div  style={{
        backgroundImage: "url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1702831313/register2_koidwj.png)" ,
  
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '700px',
        color: 'white',
      }}>
    <div className="register-box">
      <h2 style={{
        color:"#03e9f4",
        fontSize:"30px"
      }}>WELCOME</h2>
      {/* <div className="alert">{err_msg}</div> */}
        <form>
          <div className="user-box">
            <input type="text"
                   value={user.username}
                   onChange={(e)=>setUser({...user,name: e.target.value})}/>
            <label>Username</label>
          </div>
          <div className="user-box">

            {/* input-type email does not exist */}
            <input type="text"  
             value={user.email}
             onChange={(e) => setUser({ ...user, email: e.target.value })} />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input type="password" 
                   value={user.password}             
                   onChange={(e)=>setUser({...user,password: e.target.value})}   />
            <label>Password</label>
          </div>

        
          <a onClick={register}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Register
          </a>
        </form>
      </div>
      </div> 
    );
  }

  export default RegisterPage;