import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OTP from "./pages/OTP";
import WishList from "./pages/Wishlist";
import ResetPassword from "./pages/resetpassword";
import HomePage from "./pages/Home";
import RentPage from "./pages/Rent";
import Renthome from "./pages/Renthomes";
import SingleRentHomePage from "./pages/SingleRentHomePage";
import AgentsPage from "./pages/AgentsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "./components/Loader";
import { useSelector ,useDispatch} from "react-redux";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./authRoutes/protectedRoutes";
import PublicRoutes from "./authRoutes/publicRoutes";
import Sell_rentproperty from "./pages/Sell_rentproperty";
import SellPage from "./pages/Sell";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import Current_orderPage from "./pages/Current_orderPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import AdminChatsPage from "./pages/AdminChatsPage";



import {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { SetChatRooms ,SetSocket, SetMessageReceived , RemoveChatRoom} from "./redux/chatSlice";



function App() {


  const {chatRooms} = useSelector((state) => state.chat);
  const {messageReceived} = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  const [socket, setSocket] = useState(null);



  const { loading } = useSelector((state) => state.alerts);


  useEffect(() => {

    if (user?.role === 'admin') {
      
      
      const newSocket = socketIOClient();
    
  
      newSocket.emit("admin connected with server", user?.name + Math.floor(Math.random() * 1000000000000));
      //Socket emits that admin has logged in and has connected to the server
     
     
      // console.log(firstTime);
      //Here the server is sending measge to the admin from client
      newSocket.on('server sends message from client to admin', ({user, message }) => {
  
        //Redux slicers are used here
        dispatch(SetSocket({ socket: newSocket }));
        dispatch(SetChatRooms({ user: user, message: message, isAdmin: false }));
        dispatch(SetMessageReceived({ message: true }));
      });
  
      //If the client refreshed or swirches pages chatroom disconnected
      newSocket.on("disconnected",({reason,socketId}) =>{
        dispatch(RemoveChatRoom({socketId:socketId}));
      })
      return () => newSocket.disconnect();
    }
  }, [user]);



  return (
    <div className="App">
    {loading && <Loader />}
    <Toaster position="top-center" reverseOrder={false} />
    <BrowserRouter>
     <Routes>
     <Route path="/login" element={<PublicRoutes><LoginPage /></PublicRoutes>} />
     <Route path="/register" element={<PublicRoutes><RegisterPage /></PublicRoutes>} />
     <Route path="/forgot_password" element={<PublicRoutes><ForgotPasswordPage /></PublicRoutes>} />
     <Route path="/OTP/:user_id/:unique_string" element={<PublicRoutes><OTP /></PublicRoutes>} />
     <Route path="/reset_password/:user_id/:unique_string" element={<PublicRoutes><ResetPassword /></PublicRoutes>} />
     <Route path="/" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
     <Route path="/rent" element={<ProtectedRoutes><RentPage /></ProtectedRoutes>} />
     <Route path="/sell" element={<ProtectedRoutes><SellPage /></ProtectedRoutes>} />
     <Route path="/my_transaction" element={<ProtectedRoutes><TransactionHistoryPage /></ProtectedRoutes>} />
     <Route path="/sell_renthome" element={<ProtectedRoutes><Renthome /></ProtectedRoutes>} />
     <Route path="/singlerenthome/:home_id" element={<ProtectedRoutes>< SingleRentHomePage/></ProtectedRoutes>} />
     <Route path="/agentspage" element={<ProtectedRoutes><AgentsPage/></ProtectedRoutes>}/>
     <Route path="/wishlist" element={<ProtectedRoutes><WishList/></ProtectedRoutes>}/>
     <Route path="/orders" element={<ProtectedRoutes><Current_orderPage/></ProtectedRoutes>}/>
     <Route path="/admin/addproperty" element={<ProtectedRoutes><Sell_rentproperty/></ProtectedRoutes>}/>
     <Route path="/admin/chats" element={<ProtectedRoutes><AdminChatsPage/></ProtectedRoutes>}/>
     </Routes>
    </BrowserRouter>
    </div>
);
}

export default App;
