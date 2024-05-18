import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal_2.css';
import axios from "axios";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useDispatch} from "react-redux";
import toast from "react-hot-toast";

function Modal_2({ setShowPopup ,install,email,house,rent_or_sell}) {
  const dispatch = useDispatch();
  const handleClose = () => {
    setShowPopup(false);
  }

  const paymet_cancel = async () => {
    dispatch(ShowLoading());
    const body ={
      email : email,
      house_id:house
    }
    try{
   
      if(rent_or_sell=="sell"){
      const response = await axios.post("/api/users/cancel_payment",body);
      }
      else{
        const response = await axios.post("/api/users/cancel_payment2",body);
      }
      toast.success("YOUR ORDER HAS BEEN SUCCESSFULLY CANCELLED.PLEASE REFRESH THE PAGE TO SEE CANCELLATION.");
      dispatch(HideLoading());
    }catch(err){
      console.log(err);
      toast.success("CANCELLATION FAILED");
      dispatch(HideLoading());
    }

    setShowPopup(false);
  }


  const [show, setShow] = useState(false);

  return (
    <div >

      <Modal show={true} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:"red"}}>WARNING</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure, you want to cancel your order.After you click on cancel,you can't undo.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={paymet_cancel}>
            Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Modal_2;