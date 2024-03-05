import React, { useState, useEffect } from 'react';
import CardComponent from "./CardComponent";
import Pagination from 'react-bootstrap/Pagination';
import "./WishListCenter.css";
import { useSelector ,useDispatch} from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from "axios";

function WishListCenter() {
  const dispatch = useDispatch();
    const [array_of_houses, setArray_of_houses] = useState([]);
    const { user } = useSelector(state => state.users);
    useEffect(() => {
        if (user) {
   
            get_the_houses(user._id);

        }
    }, [user]);

    const get_the_houses = async (id) => {
        try {
          dispatch(ShowLoading());
            const data = await axios.get('/api/houses/get_all_houses_in_wishlist', { params: { user_id: id } });
            dispatch(HideLoading());
            const new_array = data.data.data;
            setArray_of_houses(new_array);
        } catch (err) {
            console.log(err);
            dispatch(HideLoading());
        }
    }

    return (
        <div style={{ width: "100%", padding: "80px", backgroundColor: "gray" }}>
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
