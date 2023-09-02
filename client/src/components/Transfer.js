import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate  } from 'react-router-dom';
import './Transfer.css';
import Header from './Header';

function Transfer() {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('111');
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  const fetchBalance = () => {
    if (currentUser) {
      axios.get("http://localhost:5000/api/checkBalance")
        .then(response => {
          const userBalance = response.data.find(user => user.id === currentUser.id);
          if (userBalance) {
            setBalance(userBalance.currentBalance);
          }
        })
        .catch(error => {
          console.error("Failed to fetch balance", error);
        });
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleTransfer = async () => {
    if (amount <= 0) {
      alert("You cannot transfer a negative or zero amount.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/transferBalance",
        { recipientId: toAccount, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      fetchBalance();
    } catch (error) {
      alert("Failed to transfer money");
    }
  };
  

  const handleCancel = () => {
    navigate('/');  
  };

  return (
    <>
    <Header/>
    <div className="new-transfer-container">
      <h2>Transfer Money</h2>
      <div>User: {currentUser.name}</div>
      <div>Balance: {balance}</div>
      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div>
        <label>To Account: </label>
        <input type="text" value={toAccount} onChange={e => setToAccount(e.target.value)} />
      </div>
      <button onClick={handleTransfer}>Transfer</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
    </>
  );
}

export default Transfer;
