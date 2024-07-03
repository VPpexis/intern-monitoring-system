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
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createAccount" element={<CreateAccount />} />
      <Route path="/dashboard/:userID" element={<Dashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/edit/:userID" element={<AdminInternEdit />} />
      <Route path="/admin/create-account" element={<CreateAccount />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;