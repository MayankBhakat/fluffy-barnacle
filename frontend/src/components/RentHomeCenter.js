
import React, { useState ,useEffect } from 'react';
import CardComponent from "./CardComponent";
import Pagination from 'react-bootstrap/Pagination';
import { useLocation ,useNavigate } from 'react-router-dom';
import "./RentHomeCenter.css";
import axios from "axios";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useSelector ,useDispatch} from "react-redux";



function RentHomeCenter(){
  const dispatch = useDispatch();
  const [curr_page,setCurr_page] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [page_now,setPage_now] = useState(0);
  const [tot_page,setTot_page] = useState(0);
  const [array_of_houses,setArray_of_houses]  = useState([]);
  
  const display_all_homes = async ( search_Key) =>{
    
    dispatch(ShowLoading());
    try {
        const response = await axios.get("/api/houses/get_all_homes",{ params: search_Key });

        let a = (response.data.tot)%9==0 ? (response.data.tot/9) : (response.data.tot/9) +1;
        setTot_page(a);
        // console.log(response);
        setArray_of_houses(response.data.home);
        
        dispatch(HideLoading());
    } catch (error) {
        console.error("Error fetching homes", error);
        dispatch(HideLoading());
        // Handle error appropriately
    }
  }

  const changePage = (page_num) =>{
    const searchParams = new URLSearchParams(location.search);
   
    const type2 = searchParams.get('type');
    const bathrooms2 = searchParams.get('bathrooms');
    const bedrooms2 = searchParams.get('bedrooms');
    const city2 = searchParams.get('city');
    const fees_beg2 = parseInt(searchParams.get('fees_beg'));
    const fees_end2 = parseInt(searchParams.get('fees_end'));
    const size_beg2 = parseInt(searchParams.get('size_beg'));
    const size_end2 = parseInt(searchParams.get('size_end'));
    const page2 = searchParams.get('page');
    const sell_rent2 = searchParams.get('sell_rent')


    const search_Key = {
      size_beg: size_beg2 ,
      size_end: size_end2 ,
      page: page2-1 ,
      fees_beg: fees_beg2 ,
      fees_end: fees_end2 ,
      city: city2 ,
      bedrooms: bedrooms2 ,
      bathrooms: bathrooms2 ,
      type: type2,
      sell_rent:sell_rent2,
    }
    setPage_now(page_num-1);

    const url = `/sell_renthome?type=${search_Key.type}&bathrooms=${search_Key.bathrooms}&bedrooms=${search_Key.bedrooms}&city=${search_Key.city}&fees_beg=${search_Key.fees_beg}&fees_end=${search_Key.fees_end}&size_beg=${search_Key.size_beg}&size_end=${search_Key.size_end}&page=${page_num}&sell_rent=${search_Key.sell_rent}`;

    console.log(url);
    
    setCurr_page(page_num);
    navigate(url);


  }
  useEffect(() => {
   console.log(array_of_houses); 
}, [array_of_houses]);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
   
    const type2 = searchParams.get('type');
    const bathrooms2 = searchParams.get('bathrooms');
    const bedrooms2 = searchParams.get('bedrooms');
    const city2 = searchParams.get('city');
    const fees_beg2 = parseInt(searchParams.get('fees_beg'));
    const fees_end2 = parseInt(searchParams.get('fees_end'));
    const size_beg2 = parseInt(searchParams.get('size_beg'));
    const size_end2 = parseInt(searchParams.get('size_end'));
    const page2 = searchParams.get('page');
    const sell_rent2 = searchParams.get('sell_rent')


    const search_Key = {
      size_beg: size_beg2 ,
      size_end: size_end2 ,
      page: page2-1 ,
      fees_beg: fees_beg2 ,
      fees_end: fees_end2 ,
      city: city2 ,
      bedrooms: bedrooms2 ,
      bathrooms: bathrooms2 ,
      type: type2,
      sell_rent:sell_rent2,
    }

    display_all_homes( search_Key);
   console.log("Mayank");

    },[location.search]);
  
   return(
    <div style={{width:"100%",padding:"80px",backgroundColor:"gray"}}>
    <div >
    
      {
        Array.from({length:array_of_houses.length},(_,i) => (
          <CardComponent house ={array_of_houses[i]}></CardComponent>
        ))
      }
        
    </div>
    <Pagination style={{marginTop:"130px",marginLeft:"60%",transform: 'translate(-50%, -50%)',columnFill:"pink"}}>
    
      
        <Pagination.Prev />
        {Array.from({ length: tot_page }, (_, i) => (
  (i === page_now) 
    ? <Pagination.Item active key={i}>{i + 1}</Pagination.Item> 
    : <Pagination.Item key={i} onClick={() => changePage(i+1)}>{i + 1}</Pagination.Item>
))}


     
      <Pagination.Next />
      
    </Pagination>
    </div>
   )
}

export default RentHomeCenter;