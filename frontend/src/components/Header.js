// Header.js

import React from 'react';
import './Header.css';
import { useSelector ,useDispatch} from "react-redux";
import {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { SetChatRooms ,SetSocket, SetMessageReceived , RemoveChatRoom} from "../redux/chatSlice";
import { useNavigate } from 'react-router-dom';
import SidebarDropdown from './SidebarDropdown'; // Import the SidebarDropdown component




const Header = () => {
  const navigate = useNavigate()
  // const {chatRooms} = useSelector((state) => state.chat);
  const {messageReceived} = useSelector((state) => state.chat);
  // const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  // const [socket, setSocket] = useState(null);

//!socket
// useEffect(() => {
//   console.log("useEffect triggered");
//   if (user?.role === 'admin') {
    
    
//     const newSocket = socketIOClient();
  

//     newSocket.emit("admin connected with server", user?.name + Math.floor(Math.random() * 1000000000000));
//     //Socket emits that admin has logged in and has connected to the server
   
   
//     // console.log(firstTime);
//     //Here the server is sending measge to the admin from client
//     newSocket.on('server sends message from client to admin', ({user, message }) => {

//       //Redux slicers are used here
//       dispatch(SetSocket({ socket: newSocket }));
//       dispatch(SetChatRooms({ user: user, message: message, isAdmin: false }));
//       dispatch(SetMessageReceived({ message: true }));
//     });

//     //If the client refreshed or swirches pages chatroom disconnected
//     newSocket.on("disconnected",({reason,socketId}) =>{
//       dispatch(RemoveChatRoom({socketId:socketId}));
//     })
//     return () => newSocket.disconnect();
//   }
// }, [user]);



  return (
    <header className="header">
      <SidebarDropdown/>
      <div ></div>
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <img
            src="https://res.cloudinary.com/dyrpr7kkh/image/upload/v1703765118/Home2_vfcdpb.png"
            alt="Logo"
            width="100"
            height="40"
            style={{ marginRight: '5px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' ,flexDirection: 'column'}}>
          <div style={{ fontSize: '1.3em',marginBottom: "-6px",marginTop:"-10px" ,color:"black",fontWeight: 'bold'}}>RealMod</div>
          <div style={{ fontSize: '0.5em',marginLeft: "-20px" ,color:"#3498db"}}>Real Estate Agency</div>
        </div>
      </div>
      
      <nav className="nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/sell">Sell</a></li>
          <li><a href="/rent">Rent</a></li>
          {user?.role=="admin" && 
          <li><a href="/admin/chats">Chats</a>
          {messageReceived && <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
          </li>
          }
          {user?.role=="admin" && 
          <li><a href="/admin/addproperty">Add Property</a></li>
          }
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="login-button" onClick={()=>{localStorage.removeItem("access_token");localStorage.removeItem("firstTime");
        navigate("/login")}}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
