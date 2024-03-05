import React from "react";
import Form from 'react-bootstrap/Form';
import './Sell_RentHomeCenter.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

function Sell_RentHomeCenter(){
    
    return(
        <div className="sell-rent-home-center-container">
          <div className="overlay"></div>
          <div style={{height:'70%',width:'50%',backgroundColor:'white',zIndex:'2',position:'absolute',marginRight:'40%',top:'10%',left:'20%'}}>
      <Form.Group controlId="formFile" className="mb-3" style={{marginLeft:'10%',marginTop:'10%',marginRight:'10%'}}>
        <Form.Label>Main pic of house</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <Form.Group controlId="formFileMultiple" className="mb-3"  style={{marginLeft:'10%',marginRight:'10%'}}>
        <Form.Label>Inner pic 1</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <Form.Group controlId="formFileMultipleSecond" className="mb-3"  style={{marginLeft:'10%',marginRight:'10%'}}>
        <Form.Label>Inner pic 2</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <div style={{display:"flex",marginTop:'6%'}}>
      <Form.Select aria-label="Select city" style={{marginLeft:'10%',marginRight:'5%',marginBottom:'2%',flex:1}}>
        <option>Select city</option>
        <option value="Miami">Miami</option>
        <option value="Florida">Florida</option>
        <option value="Chicago">Chicago</option>
      </Form.Select>
      <Form.Select aria-label="Select type of house" style={{marginRight:'10%',marginBottom:'2%',flex:1}}>
        <option>Select type of house</option>
        <option value="1">Bungalow</option>
        <option value="2">Flat</option>
        <option value="3"></option>
      </Form.Select>
      
      </div>
      <div style={{display:"flex",marginTop:'4%'}}>
      <Form.Select aria-label="Select number of bedrooms" style={{marginLeft:'10%',marginRight:'5%',marginBottom:'2%',flex:1}}>
        <option>Select number of bedrooms</option>
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
      </Form.Select>
      <Form.Select aria-label="Select number of bathrooms" style={{marginRight:'10%',marginBottom:'2%',flex:1}}>
        <option>Select number of bathrooms</option>
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
      </Form.Select>
      </div>

      <Form.Group className="mb-3" controlId="formBasicEmail" style={{marginLeft:'10%',marginRight:'10%',marginTop:'1%'}}>
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="Enter address" />
      </Form.Group>
        <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}}>Enter Rent Price</div>
      <InputGroup className="mb-3" style={{marginLeft:'8%',paddingRight:'18%'}}>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}}>Enter Selling Price</div>
      <InputGroup className="mb-3" style={{marginLeft:'8%',paddingRight:'18%'}}>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <div style={{width:'100%',height:'20px',marginLeft:'10%',marginBottom:'2%'}}>Enter area</div>
      <InputGroup className="mb-3" style={{marginLeft:'10%',paddingRight:'20%'}}>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>sqmt</InputGroup.Text>
      </InputGroup>
      <Button variant="dark" style={{marginLeft:'60%',marginTop:'5%'}}>Clear Form</Button>
      <Button variant="dark" style={{marginLeft:'2%',marginTop:'5%'}}>Submit Form</Button>
        
          </div>
        </div>
    )   
}

export default Sell_RentHomeCenter;
