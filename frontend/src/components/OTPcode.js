import './OTPcode.css'
import React, { useState , useEffect }  from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

let number = "";
function OTPcode (props){
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [color,setColor] = useState("a1");
    const [text,setText] = useState("Verify OTP");
    const [valid,setValid]=useState(true);

    useEffect(() => {
     if(!valid){
      setColor("a2");
      setText("OTP expired")
     }
    }, [valid]);
    const [count,setCount] = useState({
        a:"",
        b:"",
        c:"",
        d:"",
      });
      const find_last_digit = (num,index)=>{
        const sam=(num%10);
        const number=String(sam);
        setCount({...count,[index]: number});
      }
      const send_number = async()=>{
        let s = "";
        s+=count.a;
        s+=count.b;
        s+=count.c;
        s+=count.d;
       number=s;
       
       try {
        const userId = props.user_id; // Replace with your actual user ID
        const uniqueString = props.unique_string; // Replace with your first parameter
        const OTP=number;
        if(props.time<=2){
          setValid(false);
        }
        //Make sure there is leading slash before api
        //all the params are passed in form of string even if they are number
        dispatch(ShowLoading());
        const response = await axios.get(`/api/users/reset_Password_Mail/${userId}/${uniqueString}/${OTP}/${props.time}`);
        if(response){
          navigate(`/reset_password/${userId}/${uniqueString}`);
        }
        
        dispatch(HideLoading());
        toast.success(response.data.message);
       
      } catch (error) {
        
        dispatch(HideLoading());
        toast.error(error.response.data.message);
      }
      }
      
    return (
        <div className="sam2">
      <h4 className="sam">Enter OTP Code</h4>
      <form >
        <div className="input-field">
          <input type="number"  value={count.a}    
                         
                  //  onChange={(e)=>setCount({...count,a: e.target.value})} />
                  onChange={(e)=>find_last_digit(e.target.value,"a")}/>

          <input type="number"  value={count.b}  
                   onChange={(e)=>find_last_digit(e.target.value,"b")}/>

          <input type="number"  value={count.c}   
                     onChange={(e)=>find_last_digit(e.target.value,"c")}/>

          <input type="number"  value={count.d}   
                    onChange={(e)=>find_last_digit(e.target.value,"d")}/>
        </div>
        <a className={color} onClick={send_number}>
          <span></span>
            <span></span>
            <span></span>
            <span></span>
           {text}
          </a>
      </form>

      </div>
    )
}

export { OTPcode, number };