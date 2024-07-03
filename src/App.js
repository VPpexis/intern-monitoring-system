// src/App.js
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './components/login.js';
import CreateAccount from './components/createAccount.js';
import Dashboard from './components/dashboard.js';
import NavBarAdmin from './components/navBarAdmin.js';
import AdminDashboard from './components/adminDashboard.js';
import AdminLogin from './components/adminLogin.js';
import AdminInternEdit from './components/adminInternEdit.js';

const App = () => {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="intern-monitoring-system/" element={<Login />} />
      <Route path="intern-monitoring-system/login" element={<Login />} />
      <Route path="intern-monitoring-system/createAccount" element={<CreateAccount />} />
      <Route path="intern-monitoring-system/dashboard/:userID" element={<Dashboard />} />
      <Route path="intern-monitoring-system/admin" element={<AdminLogin />} />
      <Route path="intern-monitoring-system/admin/dashboard" element={<AdminDashboard />} />
      <Route path="intern-monitoring-system/admin/edit/:userID" element={<AdminInternEdit />} />
      <Route path="intern-monitoring-system/admin/create-account" element={<CreateAccount />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;