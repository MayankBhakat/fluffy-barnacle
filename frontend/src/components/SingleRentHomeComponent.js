import React from 'react';
import "./SingleRentHomeComponent.css";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import {useState,useEffect} from 'react';
import { useSelector ,useDispatch} from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from 'axios';
import { BiXCircle,BiChat } from 'react-icons/bi';
import socketIOClient from "socket.io-client";
import Filter1OutlinedIcon from '@mui/icons-material/Filter1Outlined';
import Filter2OutlinedIcon from '@mui/icons-material/Filter2Outlined';
import Filter3OutlinedIcon from '@mui/icons-material/Filter3Outlined';
import Filter4OutlinedIcon from '@mui/icons-material/Filter4Outlined';
import toast from "react-hot-toast";
import Modal_2 from "./Modal_2.js";


const SingleRentHomeComponent =()=>{
    const [current_home, setCurrent_home] = useState({});
    const [isPresent, setIsPresent] = useState(false);
    const { user } = useSelector(state => state.users);
    const [sam,setSam] = useState(0);
    const dispatch = useDispatch();
    const [socket,setSocket] =useState(false);
    const [chat,setChat] = useState([]);
    const [messageReceived, setMessageReceived] = useState(false);
    const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
    const [reconnect, setReconnect] = useState(false);
    const [install,setInstall] = useState(-1);
    const [install2,setInstall2] = useState(-1);
    const [month,setMonth] = useState(null);

    const clientSubmitChatMsg = (e) =>{
        if(e.keyCode && e.keyCode !== 13){
            return;
        }
        setChatConnectionInfo("");
        setMessageReceived(false);
        const msg = document.getElementById("clientChatMsg");
        let v = msg.value.trim();
        if (v === "" || v === null || v === false || !v) {
          return;
        }
        socket.emit("client sends message",v);
        setChat((chat)=>{
            return [...chat,{client: v}];
        })
       
        msg.focus();
        setTimeout(() => {
             msg.value = "";
             const chatMessages = document.querySelector(".cht-msg");
             chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200)
    };

    useEffect (()=>{
        console.log(user?.role);
        if(user?.role!="admin"){
            setReconnect(false);
            const socket = socketIOClient();
            socket.on("no admin", (msg) => {
                setChat((chat) => {
                    return [...chat, { admin: "no admin here now" }];
                })
            })
            
            socket.on("server sends message from admin to client", (message) => {
                
                setChat((chat) => {
                    return [...chat, { admin: message}];
                })
                setMessageReceived(true);
                const chatMessages = document.querySelector(".cht-msg");
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            setSocket(socket);
            socket.on("admin closed chat", () => {
                setChat([]); 
                setChatConnectionInfo("Admin closed chat. Type something and submit to reconnect");
                setReconnect(true);
             })
        return () => socket.disconnect();
        }
    },[user,reconnect]);



    const Remove_from_wishlist=async()=>{
        dispatch(ShowLoading());
        try{
            
            const success = await(axios.post("/api/houses/remove_house_from_wishlist",{user_id:`${user._id}`,house_id:`${current_home._id}`}));
            dispatch(HideLoading());
            if(success){
                console.log("Home removed from wishlist");
    
                setIsPresent(false);
                console.log(sam);
            }
        }catch(err){
            console.log(err);
            dispatch(HideLoading());
               
        }
    }

    const Add_to_wishlist=async()=>{
        dispatch(ShowLoading());
        try{
            const success = await(axios.post("/api/houses/add_house_to_wishlist",{user_id:`${user._id}`,house_id:`${current_home._id}`}));
            if(success){
                dispatch(HideLoading());
                console.log("Home added to wishlist")
                setIsPresent(true);
  
                console.log(sam);
            }
        }catch(err){
            console.log(err);
            dispatch(HideLoading());

        }      
    }
    useEffect(()=>{

    },[isPresent])
    const get_the_home = async (home_id) => {
        dispatch(ShowLoading());
        try {
            const homie = await axios.get('/api/houses/get_single_home', { params: { home_id: home_id } });
            setCurrent_home(homie.data.home);
            dispatch(HideLoading());
        }
        catch (err) {
            console.error("Error fetching homes", err);
            dispatch(HideLoading());
        }
    }
  
    useEffect(() => {
        const url = window.location.href;
        const parts = url.split('/');
        const home_id = parts[parts.length - 1]; // Assuming home_id is at the end of the URL
        get_the_home(home_id);
        if (user && user.wishlist && user.wishlist.includes(home_id)) {
            setIsPresent(true);
        } else {
            setIsPresent(false);
        }
    }, [user]);



    const handlePayment = async (e,installment_number,feeo) => {
        dispatch(ShowLoading());
        let ser = 100;
        if(feeo==-1){
            // console.log("3rf4f4g4g4t");
            // ser = (parseInt(current_home.fees, 10)/4)*100;
            ser = 200;
        }
        const payment = {
            amount: ser,
            currency: "USD",
            receipt: "qwsaq1"
        };

        if(installment_number!=(install2+1)){
            dispatch(HideLoading());
            toast.error("PLEASE COMPLETE PREVIOUS INSTALLMENTS");
            
            return;
        }
        try {
            const success = await axios.post("/api/payments/order", payment);
           
            dispatch(HideLoading());
            
            console.log("Payment successful", success.data.id);
            var options = {
                key: "rzp_test_ViGqZKgSbS4BQG", // Enter the Key ID generated from the Dashboard
                amount: payment.amount,
                currency: payment.currency,
                name: "Acme Corp", //your business name
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: success.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {
                    const body = {
                      ...response,
                      house_id:current_home._id,
                      user_id:user._id,
                      email:user.email,
                      price:payment.amount,
                      installment_number:installment_number,
                      sell_rent:"sell",
                    };
                    try{
                        console.log("I ama a girl");
                    const validateRes = await axios.post("/api/payments/validate",body);
                    console.log(validateRes);

                    setInstall2(installment_number);
                    toast.success("PAYMENT SUCCESSFUL");
                    }
                    catch(err){
                        console.log(err);
                    }

                   
                  },
                prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": "Gnjknuihjnkni", //your customer's name
                    "email": "gaurav.kumar@example.com", 
                    "contact": "9000000000"  //Provide the customer's phone number for better conversion rates 
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#3399cc"
                },
                
                
            };
            
            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                toast.error("PAYMENT FAILED");
            });
            rzp1.open();
            e.preventDefault();

        } catch (error) {
            toast.error("PAYMENT FAILED");
            console.log(error);
            dispatch(HideLoading());

        }
    };


    const handlePayment2 = async (e,installment_number,feeo) => {
        dispatch(ShowLoading());
        let ser = 100;
        if(feeo==-1){
            // console.log("3rf4f4g4g4t");
            // ser = (parseInt(current_home.fees, 10)/4)*100;
            ser = 200;
        }
        const payment = {
            amount: ser,
            currency: "USD",
            receipt: "qwsaq1"
        };

        try {
            const success = await axios.post("/api/payments/order", payment);
           
            dispatch(HideLoading());
            
            console.log("Payment successful", success.data.id);
            var options = {
                key: "rzp_test_ViGqZKgSbS4BQG", // Enter the Key ID generated from the Dashboard
                amount: payment.amount,
                currency: payment.currency,
                name: "Acme Corp", //your business name
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: success.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {
                    const body = {
                      ...response,
                      house_id:current_home._id,
                      user_id:user._id,
                      email:user.email,
                      price:payment.amount,
                      sell_rent:"rent",
                      installment_number:installment_number,
                    };
                    try{
                        console.log("I am a boy",body);
                    const validateRes = await axios.post("/api/payments/validate2",body);
                    console.log(validateRes);
                    setInstall(installment_number);
                    toast.success("PAYMENT SUCCESSFUL");
                    }
                    catch(err){
                        console.log(err);
                    }

                   
                  },
                prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": "Gnjknuihjnkni", //your customer's name
                    "email": "gaurav.kumar@example.com", 
                    "contact": "9000000000"  //Provide the customer's phone number for better conversion rates 
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#3399cc"
                },
                
                
            };
            
            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                toast.error("PAYMENT FAILED");
            });
            rzp1.open();
            e.preventDefault();

        } catch (error) {
            toast.error("PAYMENT FAILED");
            console.log(error);
            dispatch(HideLoading());

        }
    };

useEffect(()=>{
    
    const order = user?.orderlist?.find(order => order?.house_id == current_home?._id);
    let pokemon = -1;
    if(order && order.installment_0?.status==true){
        pokemon = 0;
    }
    if(order && order.installment_1?.status==true){
        pokemon = 1;
    }
    if(order && order.installment_2?.status==true){
        pokemon = 2;
    }
    if(order && order.installment_3?.status==true){
        pokemon = 3;
    }
    if(order && order.installment_4?.status==true){
        pokemon = 4;
    }

    setInstall2(pokemon);
    
},[current_home]) 

useEffect(()=>{
    let pokemon = -1;
    if(user?.rent_home_id ==null){
        pokemon=-1;
    }
    else if(user?.rent_home_id!=null && user?.rent_order==false && user?.rent_home_id==current_home._id){
        pokemon=0;
    }
    else if(user?.rent_home_id!=null && user?.rent_order==true && user?.rent_home_id==current_home._id){
        pokemon=1;
    }
    setInstall(pokemon);
},[current_home]) 

const [showPopup, setShowPopup] = useState(false);

const handleShowPopup = () => {
  setShowPopup(true);
};

console.log(user);

useEffect(() => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthIndex = new Date().getMonth();
    setMonth(monthNames[currentMonthIndex]);
  }, []);


    
    return (
        <div style={{ width: '100%', height: '2100px', backgroundColor: 'white' }}>
          
            <div style={{display:"flex",flexDirection:"row"}}>
                <div style={{flex:2}}>
                    <div style={{ height:"600px",
                    width:"maxwidth",
                    backgroundImage:`url(${current_home.image1})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    margin:"80px",
                    borderRadius:'20px',
                    border: '4px solid #fff', // Extra border
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
            }}></div>
                </div>
                <div style={{flex:1}}>   
                    <div style={{display:"flex",flexDirection:"column",height:"680px"}}>
                    <div style={{flex:1,
                     width:"maxwidth",
                     height:"200px",
                     backgroundImage:`url(${current_home.image2})`,
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center',
                     marginTop:"80px",
                     marginRight:"80px",
                    
                     borderRadius:'20px',
                     border: '4px solid #fff', // Extra border
                 boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
                }}></div>
                     <div style={{flex:1,
                     
                     height:"200px",
                     backgroundImage:`url(${current_home.image3})`,
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center',
                     marginTop:"40px",
                     marginRight:"80px",
                    
                     borderRadius:'20px',
                     border: '4px solid #fff', // Extra border
                 boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Shadow 
                }}></div>
                </div>
                </div>
                </div>
                <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
                    <div style={{marginLeft:"80px",
                    marginRight:"80px",
                    flex:2,
                    backgroundColor:"white",
                    height:"450px",
                    border:"2px solid #EFF0F2",
                    borderRadius:"10px",
                    }}>
                        <div style={{width:"100%",
                        height:"100px",
                        marginLeft:"50px",
                        marginTop:"30px",
                        fontSize: '30px',
                        color:"black"}} 
                        class="fw-bold">Rental Features</div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Date Available</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">Available Now</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">City</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.city}</div>
                        </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Bedrooms</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.bedrooms}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Bathrooms</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.bathrooms}</div>
                        </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Type</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.type}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Type</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.type}</div>
                        </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Laundry</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">In unit</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Parking Area</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">Yes</div>
                        </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Year Built</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.year}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Size</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">{current_home.size} sqft</div>
                        </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",marginBottom:"40px"}}>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"50px",marginRight:"20px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Lot Size</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">9,060 sqft</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flex:1,marginLeft:"20px",marginRight:"50px",marginTop:"-20px"}}>
                            <div style={{flex:1,textAlign:"left",color:"#9C9FAB",fontSize: '20px'}}  class="fw-bolder">Fees/month</div>
                            <div style={{flex:1,textAlign:"right",fontSize: '20px'}} class="fw-bolder">${current_home.fees}</div>
                        </div>
                        </div>
                        
                    </div>
                    <div style={{margin:"80px",flex:1,backgroundColor:"white",height:"250px", border:"2px solid #EFF0F2",borderRadius:"10px"}}>
                    <div style={{width:"100%",
                        
                        marginLeft:"30px",
                        marginTop:"13px",
                        fontSize: '15px',
                        color:"black"}} 
                        className="fw-bold">Rent Price/month</div>
                         <div style={{width:"100%",
                        color:"#7065F0",
                        marginLeft:"30px",
                        fontSize: '30px',
                        }} 
                        className="fw-bold">${current_home.fees}</div>



                        {current_home.sell_rent=="sell" && install2<0 &&
                        (
                        <div style={{ height: "40px", width: "80%", backgroundColor: "#7065F0", marginLeft: "30px", marginTop: "20px", borderRadius: "5px", color: "white", fontSize: "19px", textAlign: "center", paddingTop: "5px", cursor: "pointer" }} onClick={(e) => handlePayment(e, 0, 1)}>
                            <HomeOutlinedIcon style={{ margin: "5px", left: "300px" }}></HomeOutlinedIcon>
                            Apply for sell 
                        </div>
                        )}

                        {current_home.sell_rent=="rent" && install<0 && 
                        (
                        <div style={{ height: "40px", width: "80%", backgroundColor: "#7065F0", marginLeft: "30px", marginTop: "20px", borderRadius: "5px", color: "white", fontSize: "19px", textAlign: "center", paddingTop: "5px", cursor: "pointer" }} onClick={(e) => handlePayment2(e, 0, 1)}>
                            <HomeOutlinedIcon style={{ margin: "5px", left: "300px" }}></HomeOutlinedIcon>
                            Apply for rent 
                        </div>
                        )}

                        {current_home.sell_rent=="sell" && install2>=0 &&(
                        <div style={{height:"40px",width:"80%",backgroundColor:"#3a037c",marginLeft:"30px",marginTop:"20px",borderRadius:"5px",color:"white",fontSize:"19px",textAlign:"center", paddingTop:"5px"}} >
                            <HomeOutlinedIcon style={{margin:"5px",left:"300px"}}></HomeOutlinedIcon>
                            Already applied
                        </div>
                        )}

                        {current_home.sell_rent=="rent" && install>=0 &&(
                        <div style={{height:"40px",width:"80%",backgroundColor:"#3a037c",marginLeft:"30px",marginTop:"20px",borderRadius:"5px",color:"white",fontSize:"19px",textAlign:"center", paddingTop:"5px"}} >
                            <HomeOutlinedIcon style={{margin:"5px",left:"300px"}}></HomeOutlinedIcon>
                            Already applied
                        </div>
                        )}  

                        



                            {(isPresent)?
                            <div style={{height:"40px",width:"80%",backgroundColor:"#7065F0",marginLeft:"30px",marginTop:"20px",borderRadius:"5px",color:"white",fontSize:"19px",textAlign:"center", paddingTop:"5px",cursor:"pointer"}}  onClick={(Remove_from_wishlist)}>
                            
                            <HeartBrokenIcon style={{margin:"5px",left:"300px"}}></HeartBrokenIcon>
                            Remove from WishList</div>
                            :
                            <div style={{height:"40px",width:"80%",backgroundColor:"#7065F0",marginLeft:"30px",marginTop:"20px",borderRadius:"5px",color:"white",fontSize:"19px",textAlign:"center", paddingTop:"5px",cursor:"pointer"}} onClick={(Add_to_wishlist)}>
                                
                            <FavoriteOutlinedIcon style={{margin:"5px",left:"300px"}}></FavoriteOutlinedIcon>
                            Add To WishList</div>}
                    </div>
                </div>
                {install>=0 && current_home.sell_rent=="rent" &&
                <div style={{display:"flex"}}>

                    {install<=0 && current_home.sell_rent=="rent" &&
                    (<div className="hoverEffect2" onClick={(e) => handlePayment2(e, 1, 1)}>
                    Payment for {month}</div>)}
                    {install>0 && current_home.sell_rent=="rent" &&
                    (<div className="nohoverEffect2" onClick={(e) => handlePayment2(e, 1, 1)}>
                    Payment Done</div>)}
                    <div className="hoverEffect2" onClick={handleShowPopup}>
                    Cancel Rent</div>
                <div>
                    {showPopup && <Modal_2 setShowPopup={setShowPopup}  install={install} email={user.email} house={current_home._id} rent_or_sell={"rent"}/>}
                </div>
                </div>
                }

                {current_home.sell_rent=="sell" &&
                install2>=0 && (
                    <div>
                <div style={{width:"85%",
                            height:"200px",
                            backgroundColor:"white",
                            margin:"90px",
                            borderRadius:"10px",
                            border:"2px solid #EFF0F2",
                            display:"flex"
                    }}>
                            {install2 >= 1 ? (
                                <div className="nohoverEffect" style={{ color: 'gray' }}>
                                    Installment completed
                                </div>
                            ) : (
                                <div className="hoverEffect" onClick={(e) => handlePayment(e, 1,-1)}>
                                    <Filter1OutlinedIcon style={{ marginRight: "5px" }} />
                                    Installment
                                </div>
                            )} 
                            {install2 >= 2 ? (
                                <div className="nohoverEffect" style={{ color: 'gray' }}>
                                    Installment completed
                                </div>
                            ) : (
                                <div className="hoverEffect" onClick={(e) => handlePayment(e, 2,-1)}>
                                    <Filter2OutlinedIcon style={{ marginRight: "5px" }} />
                                    Installment
                                </div>
                            )} 
                            {install2 >= 3 ? (
                                <div className="nohoverEffect" style={{ color: 'gray' }}>
                                    Installment completed
                                </div>
                            ) : (
                                <div className="hoverEffect" onClick={(e) => handlePayment(e, 3,-1)}>
                                    <Filter3OutlinedIcon style={{ marginRight: "5px" }} />
                                    Installment
                                </div>
                            )} 
                            {install2 >= 4 ? (
                                <div className="nohoverEffect" style={{ color: 'gray' }}>
                                    Installment completed
                                </div>
                            ) : (
                                <div className="hoverEffect" onClick={(e) => handlePayment(e, 4,-1)}>
                                    <Filter4OutlinedIcon style={{ marginRight: "5px" }} />
                                    Installment
                                </div>
                            )} 
                    </div>
                                    <div
                                    className="piouy"
                                    style={{
                                        width: "20%",
                                        height: "50px",
                                        backgroundColor: "white",
                                        margin: "90px",
                                        marginTop: "-50px",
                                        borderRadius: "10px",
                                        border: "2px solid #EFF0F2",
                                        backgroundColor: "#7065F0",
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: "22px",
                                        paddingTop: "5px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "pointer",
                                    }}
                                    onClick={handleShowPopup}
                                >
                                    Cancel Order
                                </div>
                                {showPopup && <Modal_2 setShowPopup={setShowPopup}  install={install2} email={user.email} house={current_home._id} rent_or_sell={"sell"}/>}
                </div>
                
                )
                    }

                <div style={{width:"70%",
                            height:"200px",
                            backgroundColor:"white",
                            margin:"90px",
                            borderRadius:"10px",
                            border:"2px solid #EFF0F2",
                    }}>
                        <div style={{height:"40px",
                                    width:"100%",
                                    marginTop:"30px",
                                    marginLeft:"20px",
                                    fontSize:"20px",
                                    color:"#9C9FAB" }} class="fw-bold">Listed by property owner</div>

                        <div style={{width:"100%",display:"flex"}}>
                              <div style={{height:"50px",
                              width:"50px",
                              marginLeft:"20px",
                              borderRadius:"25px",
                                backgroundImage:"url(https://res.cloudinary.com/dyrpr7kkh/image/upload/v1704378130/mayankkk_xrpnlh.png)",
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                marginTop:"30px"}}></div>
                                <div style={{display:"flex"}}>
                                <div style={{height:"60px",marginTop:"30px"}}>
                                    <div style={{marginLeft:"20px",}} class="fw-bold">Shane Watson</div>
                                    <div style={{marginLeft:"20px",color:"#9C9FAB"}}>Rich Capital LLC</div>
                                </div>
                                <div style={{marginTop:"30px",height:"60px",marginLeft:"100px"}}>
                                    <div style={{marginLeft:"20px",}} class="fw-bold">Telephone</div>
                                    <div style={{marginLeft:"20px",color:"#9C9FAB"}}>+91 7008030235</div>
                                </div>
                                <div style={{marginTop:"30px",height:"60px",marginLeft:"100px"}}>
                                    <div style={{marginLeft:"20px",}} class="fw-bold">Email</div>
                                    <div style={{marginLeft:"20px",color:"#9C9FAB"}}>subham.bhakat01@gmail.com</div>
                                </div>
                                <div style={{marginTop:"30px",
                                            height:"60px",
                                            marginLeft:"50px",
                                            width:"200px",
                                            backgroundColor:"#7065F0",
                                            color:"white",
                                            textAlign:"center",
                                            borderRadius:"10px",
                                            fontSize:"19px",
                                            paddingTop:"15px",
                                            }}>
                                            <MessageOutlinedIcon style={{marginRight:"5px"}}></MessageOutlinedIcon>
                                    Message Him
                                </div>
                                </div>
                               
                               
                        </div>
                       
  
                        
                    </div>


                    {user?.role !="admin" && (
                    <div className='qwwq'>
                    <input type='checkbox' id='check'/>
                    <label className="chat-btn" htmlFor="check">

                    <BiChat className='bi bi-circle comment str' />
                    {messageReceived && <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
                    <BiXCircle className='close str' />
                    </label>
                   <div className = "chat-wrapper">
                    <div className = "chat-header">
                        <h6>Lets Chat - Online</h6>
                    </div>
                    <div className="chat-form">
                    <div className="cht-msg">
                    <p>{chatConnectionInfo}</p>
                    {chat.map((item, id) => (
              <div key={id}>
                {item.client && (
                  <p>
                    <b>You wrote:</b> {item.client}
                  </p>
                )}
                {item.admin && (
                  <p className="sert p-3 ms-4 text-light rounded-pill">
                    <b>Support wrote:</b> {item.admin}
                  </p>
                )}
              </div>
            ))}
          </div>
          <textarea
            onKeyUp={(e) => clientSubmitChatMsg(e)}
            id="clientChatMsg"
            className="form-control"
            placeholder="Your Text Message"
          ></textarea>

          <button onClick={(e) => clientSubmitChatMsg(e)} className="btn btn-success btn-block">Submit</button>
            </div>
         </div>
        </div>
        )}


        </div>
    );
};

export default SingleRentHomeComponent