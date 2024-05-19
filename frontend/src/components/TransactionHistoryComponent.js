import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import './TransactionHistoryComponent.css';
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from 'date-fns'; // Import date-fns for formatting dates

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
            <th>HouseID_Number</th>
            <th>Order_ID</th>
            <th>Payment_ID</th>
            <th>Amt</th>
            <th>Date</th> {/* Add a new column for the date */}
          </tr>
        </thead>
        <tbody>
          {my_transaction.length > 0 ? (
            my_transaction.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{index + 1}</td>
                <td>{transaction.house_id}</td>
                <td>{transaction.order_id}</td>
                <td>{transaction.payment_id}</td>
                <td>{transaction.payment_amount}</td>
                <td>{format(new Date(transaction.createdAt), 'dd-MM-yyyy')}</td> {/* Format and display the date */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No transactions found</td> {/* Update colSpan to match the number of columns */}
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionHistoryComponent;
