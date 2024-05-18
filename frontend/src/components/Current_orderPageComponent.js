import React, { useState, useEffect } from 'react';
import CardComponent from "./CardComponent";
import Pagination from 'react-bootstrap/Pagination';
import "./Current_orderPageComponent.css";
import { useSelector ,useDispatch} from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from "axios";


function Current_orderPageComponent() {
    const dispatch = useDispatch();
    const [array_of_houses,setArray_of_houses]= useState([])
    const { user } = useSelector(state => state.users);
const get_ordered_houses = async()=>{
    if(user){
    try{
        dispatch(ShowLoading());
        const response = await axios.get("/api/houses/orders",{params:{user_id:user._id}});
        dispatch(HideLoading())
        setArray_of_houses(response.data.data)
    }catch(err){
        dispatch(HideLoading())
        console.log(err);
    }
}
}
useEffect(()=>{
    get_ordered_houses();
},[user])
    return (
        
        <div style={{ width: "100%", padding: "80px", backgroundColor: "gray" }} >
            <div>
                {array_of_houses.map((house, index) => (
                    <CardComponent key={index} house={house}></CardComponent>
                ))}
            </div>

        </div>
    );
}

export default Current_orderPageComponent;
