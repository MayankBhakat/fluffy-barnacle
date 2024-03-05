
import './register.css'
import axios from "axios";
import { Link, useNavigate ,useParams} from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function ResetPassword () {
  const dispatch = useDispatch();
  
  const { user_id, unique_string } = useParams();
  
    const navigate = useNavigate();
        const [user,setUser] = useState({
          password:"",
          verifypassword:"",
        })
        const [err_msg, setErr_msg] = useState("");
        
        const savepassword = async() =>{
          try{
            dispatch(ShowLoading());
            const response = await axios.post(`/api/users/reset_password/${user_id}/${unique_string}`,user);
            dispatch(HideLoading());
            toast.success(response.data.message);
            
            navigate("/login");
          }catch(error){
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
      <h2>WELCOME</h2>
      <div className="alert"></div>
        <form>
          
          <div className="user-box">

            {/* input-type email does not exist */}
            <input type="password"  
             value={user.password}
             onChange={(e) => setUser({ ...user, password: e.target.value })} />
            <label>Password</label>
          </div>
          <div className="user-box">
            <input type="password" 
                   value={user.verifypassword}             
                   onChange={(e)=>setUser({...user,verifypassword: e.target.value})}   />
            <label>Confirm-Password</label>
          </div>

        
          <a onClick = {savepassword}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </form>
      </div>
      </div> 
    );
  }

  export default ResetPassword ;