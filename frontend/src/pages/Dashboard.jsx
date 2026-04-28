import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import PatientDashboard from '../components/PatientDashboard/PatientDashboard';
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard';
import RelativeDashboard from '../components/RelativeDashboard/RelativeDashboard';

const Dashboard = () => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'PATIENT':
        return <PatientDashboard />;
      case 'RELATIVE':
        return <RelativeDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <>
      <Navbar />
      {renderDashboard()}
    </>
  );
};

export default Dashboard;
