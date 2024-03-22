// Header.js

import React from 'react';
import './Header.css';
import { useSelector ,useDispatch} from "react-redux";
import {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { SetChatRooms ,SetSocket, SetMessageReceived , RemoveChatRoom} from "../redux/chatSlice";

import SidebarDropdown from './SidebarDropdown'; // Import the SidebarDropdown component




const Header = () => {
  const {chatRooms} = useSelector((state) => state.chat);
  const { messageReceived } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  const [socket, setSocket] = useState(null);

//!socket
useEffect(() => {
  console.log("useEffect triggered");
  if (user?.role === 'admin') {
    
    const newSocket = socketIOClient();
    
    newSocket.emit("admin connected with server", user?.name + Math.floor(Math.random() * 1000000000000));
    newSocket.on('server sends message from client to admin', ({user, message }) => {
      dispatch(SetSocket({ socket: newSocket }));
      dispatch(SetChatRooms({ user: user, message: message, isAdmin: false }));
      dispatch(SetMessageReceived({ message: true }));
    });
    newSocket.on("disconnected",({reason,socketId}) =>{
      dispatch(RemoveChatRoom({socketId:socketId}));
    })
    return () => newSocket.disconnect();
  }
}, [user]);



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
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/admin/chats">Admin</a>
          {messageReceived && <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
          </li>

        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="login-button">Login</button>
        <button className="register-button">Register</button>
      </div>
    </header>
  );
};

export default Header;
