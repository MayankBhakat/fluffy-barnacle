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
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import socketIOClient from "socket.io-client";



const SingleRentHomeComponent =()=>{
    const [current_home, setCurrent_home] = useState({});
    const [isPresent, setIsPresent] = useState(false);
    const { user } = useSelector(state => state.users);
    const [sam,setSam] = useState(0);
    const dispatch = useDispatch();
    const [socket,setSocket] =useState(false);


    // let chat = [
    //     {"client":"msg"},
    //     {"client":"msg"},
    //     {"admin":"msg"}
    // ]

    const [chat,setChat] = useState([]);
    const [messageReceived, setMessageReceived] = useState(false);
    const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
    const [reconnect, setReconnect] = useState(false);

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

    

    return (
        <div style={{width:"100%",height:"1600px",backgroundColor:"white"}}>
          
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
                        class="fw-bold">Rent Price/month</div>
                         <div style={{width:"100%",
                        color:"#7065F0",
                        marginLeft:"30px",
                        fontSize: '30px',
                        }} 
                        class="fw-bold">${current_home.fees}</div>
                        
                        <div style={{height:"40px",width:"80%",backgroundColor:"#7065F0",marginLeft:"30px",marginTop:"20px",borderRadius:"5px",color:"white",fontSize:"19px",textAlign:"center", paddingTop:"5px",cursor:"pointer"}}>
                            <HomeOutlinedIcon style={{margin:"5px",left:"300px"}}></HomeOutlinedIcon>
                            Apply Now</div>
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
            onKetUp={(e) => clientSubmitChatMsg(e)}
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