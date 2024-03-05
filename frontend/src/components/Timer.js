import './Timer.css'
import React, { useState , useEffect }  from "react";

function Timer(props){
    const [timer,setTimer] = useState(120);
    
  useEffect(()=>{
    if(timer<=0) return;
    const timeout = setTimeout(()=>{
      setTimer(timer-1);

      //The timer here is an object.NOT INTEGER.The first atgument of useSTate is always an object
      props.give_data_to_parent(timer);
     
    },1000);

    return()=>clearTimeout(timeout);
  },[timer]);
    return(
        <div >
        <div className="bx ">You have 60 sec to enter otp</div>
        <div className="timer" style={{textAlign:'center'}}>{timer}</div>
      </div>
    )   
}

export default Timer;