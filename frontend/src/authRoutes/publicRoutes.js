import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const PublicRoutes=({children})=>{
    const navigate = useNavigate();
    useEffect(() => {
       if(localStorage.getItem('token')){
         navigate('/')
       }
    }, [])
    
    return (
      <div>
          {children}
      </div>
    );
};

export default PublicRoutes