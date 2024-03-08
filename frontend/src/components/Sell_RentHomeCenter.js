import React,{ useRef } from "react";
import Form from 'react-bootstrap/Form';
import './Sell_RentHomeCenter.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import {useState,useEffect} from 'react';
import axios from 'axios'
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function Sell_RentHomeCenter(){
  const dispatch = useDispatch();
  const formRef = useRef(null);
    const [formData,setFormData] = useState({
            image:[1,1,1],
            city:"",
            type:"",
            bedrooms:"",
            bathrooms:"",
            address:"",
            rent_price:"",
            area:""
    })

    
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
    
      const { city, type, bedrooms, bathrooms, address, rent_price, area, image } = formData;
      const formDataToSend = new FormData(); // Create a new FormData object
    
      // Append all form data fields to the FormData object
      formDataToSend.append("city", city);
      formDataToSend.append("type", type);
      formDataToSend.append("bedrooms", bedrooms);
      formDataToSend.append("bathrooms", bathrooms);
      formDataToSend.append("address", address);
      formDataToSend.append("rent_price", rent_price);
      formDataToSend.append("area", area);
    
      // Append each image file to the FormData object with the same field name
      image.forEach((file, index) => {
        formDataToSend.append("image", file); // Use the same field name "image" for each file
      });
      dispatch(ShowLoading())
      try {
        const response = await axios.post("/api/houses/add_home", formDataToSend);
        dispatch(HideLoading())
       toast.success(response.data.message);


      } catch (err) {
       
        dispatch(HideLoading())
        toast.error(err.response.data.message);

  
      }

      //This is used to clear the form
      formRef.current.reset();
    }
    
    
    const handleCityChange = (e) =>{
      setFormData({ ...formData, city: e.target.value });
    }

    const handleTypeChange = (e) =>{
      setFormData({ ...formData, type: e.target.value });
    }

    const handleBedroomsChange = (e) =>{
      setFormData({ ...formData, bedrooms: e.target.value });
    }

    const handleBathroomsChange = (e) =>{
      setFormData({ ...formData, bathrooms: e.target.value });
    }

    const handleAddressChange = (e) =>{
      setFormData({ ...formData, address: e.target.value });
    }

    const handleRentChange = (e) =>{
      setFormData({ ...formData, rent_price: e.target.value });
    }

    const handleAreaChange = (e) =>{
      setFormData({ ...formData, area: e.target.value });
    }


    const handleImage1Change = (e) => {
      setFormData({ ...formData, image: [e.target.files[0], ...formData.image.slice(1)] });
    }
    
    const handleImage2Change = (e) => {
      setFormData({ ...formData, image: [...formData.image.slice(0, 1), e.target.files[0], ...formData.image.slice(2)] });
    }
    
    const handleImage3Change = (e) => {
      setFormData({ ...formData, image: [...formData.image.slice(0, 2), e.target.files[0]] });
    }
    
    

    return(
        <div className="sell-rent-home-center-container">
          <div className="overlay"></div>
          <form ref={formRef} style={{height:'70%',width:'50%',backgroundColor:'white',zIndex:'2',position:'absolute',marginRight:'40%',top:'10%',left:'20%'}}>
          <Form.Group controlId="formFile" className="mb-3 " style={{marginLeft:'10%',marginTop:'10%',marginRight:'10%'}} onChange={handleImage1Change}>
          <Form.Label>Main pic of house (JPEG/PNG)</Form.Label>
          <Form.Control type="file" />
          </Form.Group>
          <Form.Group controlId="formFileMultiple" className="mb-3"  style={{marginLeft:'10%',marginRight:'10%'}} onChange={handleImage2Change}>
          <Form.Label>Inner pic 1 (JPEG/PNG)</Form.Label>
          <Form.Control type="file" />
          </Form.Group>
          <Form.Group controlId="formFileMultipleSecond" className="mb-3 "  style={{marginLeft:'10%',marginRight:'10%'}} onChange={handleImage3Change}>
          <Form.Label>Inner pic 2 (JPEG/PNG)</Form.Label>
          <Form.Control type="file" />
          </Form.Group>

      <div style={{display:"flex",marginTop:'6%'}}>
      <Form.Select aria-label="Select city" style={{marginLeft:'10%',marginRight:'5%',marginBottom:'2%',flex:1}} onChange={handleCityChange} className="pokemon">
      <option >Select city</option>
        <option value="Miami">Miami</option>
        <option value="Florida">Florida</option>
        <option value="Chicago">Chicago</option>
      </Form.Select>
      <Form.Select aria-label="Select type of house" style={{marginRight:'10%',marginBottom:'2%',flex:1}} onChange={handleTypeChange} >
      <option >Select type of house</option>
        <option value="Bungalow">Bungalow</option>
        <option value="Flat">Flat</option>
        <option value="Duplex">Duplex</option>
      </Form.Select>
      
      </div>
      <div style={{display:"flex",marginTop:'4%'}}>
      <Form.Select aria-label="Select number of bedrooms" style={{marginLeft:'10%',marginRight:'5%',marginBottom:'2%',flex:1}} onChange={handleBedroomsChange} className="pokemon">
      <option >Select number of bedrooms</option>
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
      </Form.Select>
      <Form.Select aria-label="Select number of bathrooms" style={{marginRight:'10%',marginBottom:'2%',flex:1}} onChange={handleBathroomsChange} >
      <option >Select number of bathrooms</option>
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
      </Form.Select>
      </div>

      <Form.Group className="mb-3 " controlId="formBasicEmail" style={{marginLeft:'10%',marginRight:'10%',marginTop:'1%'}}  onChange={handleAddressChange} >
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="Enter address" />
      </Form.Group>
        <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}} >Enter Rent Price</div>
      <InputGroup className="mb-3 pokmon" style={{marginLeft:'8%',paddingRight:'18%'}} onChange={handleRentChange}>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}}>Enter Selling Price</div>
      <InputGroup className="mb-3 " style={{marginLeft:'8%',paddingRight:'18%'}} >
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}} >Enter area</div>
      <InputGroup className="mb-3" style={{marginLeft:'10%',paddingRight:'20%'}}  onChange={handleAreaChange}>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>sqmt</InputGroup.Text>
      </InputGroup>
      <Button variant="dark" style={{marginLeft:'60%',marginTop:'5%'}}>Clear Form</Button>
      <Button variant="dark" style={{marginLeft:'2%',marginTop:'5%'}} type="submit" onClick={handleSubmit}>Submit Form</Button>

        
          </form >
        </div>
    )   
}

export default Sell_RentHomeCenter;
