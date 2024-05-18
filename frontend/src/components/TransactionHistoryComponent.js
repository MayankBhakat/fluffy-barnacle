import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import './TransactionHistoryComponent.css';
import axios from "axios";
import { useSelector } from "react-redux";

function TransactionHistoryComponent() {
  const [my_transaction, setMy_transaction] = useState([]);
  const { user } = useSelector(state => state.users);

  useEffect(() => {
    if (user) {
      get_transaction();
    }
  }, [user]);

  const get_transaction = async () => {
    try {
      const response = await axios.get("/api/users/transaction", { params: { user_id: user._id } });
      setMy_transaction(response.data.data);
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <div style={{ height: "1000px", backgroundColor: "white" }}>
      <div style={{ height: "100px", backgroundColor: "white" }}></div>
      <Table striped="columns" style={{ width: "90%", marginLeft: "5%"}}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>House NO</th>
            <th>HouseID_Number</th>
            <th>Order_ID</th>
            <th>Payment_ID</th>
            <th>Amt</th>
          </tr>
        </thead>
        <tbody>
          {my_transaction.length > 0 ? (
            my_transaction.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{index + 1}</td>
                <td>432</td>
                <td>{transaction.house_id}</td>
                <td>{transaction.order_id}</td>
                <td>{transaction.payment_id}</td>
                <td>{transaction.payment_amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No transactions found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionHistoryComponent;
