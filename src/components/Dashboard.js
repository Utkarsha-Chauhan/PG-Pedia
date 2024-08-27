import React from 'react';
import { useAuth } from '../AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className='dashboard'>
      <h2>Dashboard</h2>
      {/* Personalized welcome message */}
      <h1>
        Welcome to <span>PG-Pedia</span>, {currentUser?.name}
      </h1>
      <p>
        Your one-stop solution for all your health-related queries. We provide a variety of tools to help you keep track of your health. Get started by selecting one of the options below.
      </p>
      <h3>
        Choose one of the following:
      </h3>
      
    </div>
  );
};

export default Dashboard;
