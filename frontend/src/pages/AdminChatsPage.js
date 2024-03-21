import Footer from "../components/Footer"
import Header from "../components/Header"
import AdminChatsPageComponent from "../components/AdminChatsPageComponent"
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import './AdminChatsPage.css'
function AdminChatsPage () {
  const {chatRooms,socket} = useSelector((state) => state.chat);
  console.log(chatRooms);


    return (
        <div >
            <Header ></Header>
            <div style={{height:"900px",backgroundColor:"white"}}>
            <Row className="m-0" style={{paddingTop:"100px"}}>
   
      <Col md={12}>
        <Row>
        {Object.entries(chatRooms).map((chatRoom, index) => (
            <AdminChatsPageComponent key={index} chatRoom={chatRoom} roomIndex={index + 1} socket={socket} socketUser={chatRoom[0]}  />
          ))}
        </Row>
      </Col>
    </Row>
    </div>
            <Footer ></Footer>
        </div>
    )

} 

export default AdminChatsPage
