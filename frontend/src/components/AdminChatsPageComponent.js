import React, { useEffect } from "react"
import './AdminChatsPageComponent.css';
import { Toast, Button, Form } from "react-bootstrap";
import { Fragment, useState } from "react";
import {SetChatRooms} from '../redux/chatSlice.js'
import { useDispatch } from "react-redux"; // Import useDispatch
import { SetMessageReceived }  from "../redux/chatSlice";

const AdminChatsPageComponent = ({chatRoom, roomIndex, socketUser, socket}) =>{
  const dispatch = useDispatch();

   [window["toast" + roomIndex], window["closeToast" + roomIndex]] =
  useState(true);
 const [show,setShow] = useState(true);

const close = (socketId) => {
  window["closeToast" + roomIndex](false);
  socket.emit("admin closes chat", socketId);

};


const adminSubmitChatMsg = (e, elem) => {
    e.preventDefault();
    
    if (e.keyCode && e.keyCode !== 13) {
        return;
    }
    
    const msg = document.getElementById(elem);
    let v = msg.value.trim();
    if (v === "" || v === null || v === false || !v) {
       return; 
    }
  
    const updatedChatRoom = [...chatRoom]; // Create a shallow copy of chatRoom

    socket.emit("admin sends message", {
      user: socketUser,
      message: v,
  })
    updatedChatRoom[1] = [...updatedChatRoom[1], { admin: msg.value }]; // Push new message into the copied array
    console.log(updatedChatRoom);
    dispatch(SetChatRooms({user:chatRoom[0],message:msg.value,isAdmin:true})); // Dispatch the action to update the state
    console.log(chatRoom);
    dispatch(SetMessageReceived({message:false}));

    msg.focus();
    setTimeout(() => {
        msg.value = "";
        const chatMessages = document.querySelector(`.cht-msg${socketUser}`);
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 200)

}

useEffect(() => {
  setShow(true);
  const chatMessages = document.querySelector(`.cht-msg${socketUser}`); 
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  window["closeToast" + roomIndex](true);
},[chatRoom])



return (
  <>
    <Toast
      // show={window["toast" + roomIndex]}
      show={"toast" + roomIndex}
      // show={show}
      onClose={() => close(chatRoom[0])}
      className="ms-4 mb-5"
    >
      <Toast.Header>
        <strong className="me-auto">Chat with User</strong>
      </Toast.Header>
      <Toast.Body>
        <div className={`cht-msg${socketUser}`} style={{ maxHeight: "500px", overflow: "auto" }}>
          {chatRoom[1].map((msg, idx) => (
            <Fragment key={idx}>
              {msg.client && (
                <p
                  key={idx}
                  className="sert p-3 ms-4 text-light rounded-pill"
                >
                  <b>User wrote:</b> {msg.client}
                </p>
              )}
              {msg.admin && (
                <p key={idx}>
                  <b>Admin wrote:</b> {msg.admin}
                </p>
              )}
            </Fragment>
          ))}
        </div>

        <Form>
          <Form.Group
            className="mb-3"
            controlId={`adminChatMsg${roomIndex}`}
          >
            <Form.Label>Write a message</Form.Label>
            <Form.Control onKeyUp={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} as="textarea" rows={2} />
          </Form.Group>
          <Button onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} variant="success" type="submit">
            Submit
          </Button>
        </Form>
      </Toast.Body>
    </Toast>
  </>
);
}

export default AdminChatsPageComponent;