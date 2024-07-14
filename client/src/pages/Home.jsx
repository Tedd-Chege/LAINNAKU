import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '../components/logged';
import UserDashboard from '../components/noLogin';

const HomePage = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Check if currentUser is defined and isAdmin property is true
  const isAdmin = currentUser?.isAdmin || currentUser?.isOverallAdmin || currentUser?.isNormalAdmin;

  return (
    <div className="">
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default HomePage;
