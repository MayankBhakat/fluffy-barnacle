import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { SetUser } from "../redux/usersSlice";
import axios from 'axios';
import toast from "react-hot-toast";


const ProtectedRoutes=({children})=>{

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const navigate = useNavigate();


  const validateToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/users/get_user_by_id",
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        localStorage.removeItem("access_token");
        toast.error(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoading());
      localStorage.removeItem("access_token");

      toast.error(error.response.data.message);
      navigate("/login");
    }
  };


  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);


    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedRoutes