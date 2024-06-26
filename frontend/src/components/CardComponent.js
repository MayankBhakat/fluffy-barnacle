
import React from "react"
import {useNavigate} from 'react-router-dom'
import BedIcon from '@mui/icons-material/SingleBed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import "./CardComponent.css"
import { useDispatch } from "react-redux";
import { ShowLoading,HideLoading } from "../redux/alertsSlice";

function CardComponent(props){
   console.log(props);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const selectHome = () =>{
      const home_id = props.house._id;
      dispatch(ShowLoading());
      navigate(`/singlerenthome/${home_id}`);
      dispatch(HideLoading());
   }
   return(
    <div style={{width:"27.5%",height:"420px",backgroundColor:"white",marginBottom:"70px",display:"inline-block",margin:"40px",borderRadius:"20px"}}  className="sammuwq"
    onClick={selectHome}>
       <div >
        <div style={{
                    height:"190px",
                    width:"maxwidth",
                    backgroundImage: `url(${props.house.image1})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderTopRightRadius:"20px",
                    borderTopLeftRadius:"20px"
                    }}>
                    </div>
        <div style={{marginTop:"20px",marginLeft:"30px",fontSize:"30px",
        // fontWeight:"bold",
        color:"#7065F0",
       
        paddingBottom:"0px"
        }}>
         
                {props.house.sell_rent=="sell" 
         ?
         <>
         <span style={{ fontWeight:"bold" ,marginLeft:"0px"}}> ${props.house.fees}</span> 
         </>
         :
         <>
         <span style={{ fontWeight:"bold" ,marginLeft:"0px"}}> ${props.house.fees}</span> <span style={{fontSize:"15px",margin:"-10px",color:"gray"}} className="font-weight-light">/month</span>
         </>}

        </div>
        <div style={{marginLeft:"31px",fontSize:"35px",fontWeight:"Bold"}}>Palm Harbor</div>
        <div style={{marginLeft:"31px",fontSize:"15px",color:"#8C8F9E",marginTop:"-10px"}} className="fw-bolder">2699 Green Valley Highland,ytraet</div>
       </div>
       <div style={{marginLeft:"31px",fontSize:"15px",color:"#8C8F9E",marginTop:"20px",height:"1px",backgroundColor:"#E3E2EE",width:"330px"}}></div>
       <div style={{display:"flex"}}>
       <div style={{flex:0.8,fontSize:"15px",paddingTop:"10px"}}><BedIcon  style={{ verticalAlign: 'middle', marginRight: '5px' ,color:"#7065F0",marginLeft:"31px",fontSize:"30px"}} /><span style={{marginLeft:"-5px"}}>{props.house.bedrooms} Beds</span></div>
       <div style={{flex:1,fontSize:"15px",paddingTop:"10px"}}><BathtubIcon  style={{ verticalAlign: 'middle', marginRight: '5px' ,color:"#7065F0",marginLeft:"25px",fontSize:"25px"}} /><span style={{marginLeft:"-5px"}}>{props.house.bathrooms} Bathrooms</span></div>
       <div style={{flex:1,fontSize:"15px",paddingTop:"10px"}}><WarehouseOutlinedIcon  style={{ verticalAlign: 'middle', marginRight: '5px' ,color:"#7065F0",marginLeft:"20px",fontSize:"30px"}} /><span style={{marginLeft:"-5px"}}>1 Garage</span></div>
       </div>
    </div>
   )
}

export default CardComponent;