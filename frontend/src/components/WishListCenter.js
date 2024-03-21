import React, { useState, useEffect } from 'react';
import CardComponent from "./CardComponent";
import Pagination from 'react-bootstrap/Pagination';
import "./WishListCenter.css";
import { useSelector ,useDispatch} from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function WishListCenter() {
  const dispatch = useDispatch();
    const [array_of_houses, setArray_of_houses] = useState([]);
    const { user } = useSelector(state => state.users);
    const [sell_rent ,setSell_rent] = useState("rent");
    const [class1,setClass1] = useState("weret2");
    const [class2,setClass2] = useState("weret");
    useEffect(() => {
        if (user) {
   
            get_the_houses(user._id);

        }
    }, [user,sell_rent]);

    const get_the_houses = async (id) => {
        try {
          dispatch(ShowLoading());
            const data = await axios.get('/api/houses/get_all_houses_in_wishlist', { params: { user_id: id ,sell_rent:sell_rent} });
            dispatch(HideLoading());
            const new_array = data.data.data;
            setArray_of_houses(new_array);
        } catch (err) {
            console.log(err);
            dispatch(HideLoading());
        }
    }

    const rent_home = () =>{
        setSell_rent("rent");
        setClass1("weret2");
        setClass2("weret");
    }

    const sell_home = () =>{
        setSell_rent("sell");
        setClass1("weret");
        setClass2("weret2");
    }



    return (
        
        <div style={{ width: "100%", padding: "80px", backgroundColor: "gray" }} >
             <ButtonGroup aria-label="Basic example" style={{marginLeft:"25%",borderRadius:"10px"}}  >
                <Button variant="secondary"  style={{ width: "600px", textAlign: "center" }} className={class1} onClick={rent_home}>Rent</Button>
                <Button variant="secondary"  style={{ width: "100%", textAlign: "center" }} className={class2} onClick={sell_home}>Buy</Button>
                
                 </ButtonGroup>
            <div>
                {array_of_houses.map((house, index) => (
                    <CardComponent key={index} house={house}></CardComponent>
                ))}
            </div>
            {user ? (
                <Pagination style={{ marginTop: "130px", marginLeft: "60%", transform: 'translate(-50%, -50%)', columnFill: "pink" }}>
                    <Pagination.Prev />
                        <Pagination.Item active key={0}>{ 1}</Pagination.Item>
                    <Pagination.Next />
                </Pagination>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default WishListCenter;
