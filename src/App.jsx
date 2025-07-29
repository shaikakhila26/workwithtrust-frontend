import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import Home from './pages/Home';
import Login from './pages/Login';
import CreateGig from './pages/CreateGig'; // ✅ step 2 import
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SelectRole from './pages/SelectRole';
import Onboarding from './pages/Onboarding';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import GigList from './pages/GigList';
import GigDetail from './pages/GigDetail'; // ✅ Adjust path as needed
import ClientDashboard from './pages/ClientDashboard';
import PurchasePage from './pages/PurchasePage';
import SuccessPage from './pages/SuccessPage';
import Cancel from './pages/Cancel';
import OrdersDashboard from './pages/FreelancerOrders.jsx';
import ChatPage from './pages/ChatPage';
import EditGig from './components/EditGig.jsx'; // Import EditGig component

import { SocketProvider } from './context/SocketContext';
import { useEffect } from 'react';
import FreelancerOrders from './pages/FreelancerOrders.jsx';





function App() {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user?._id;

  useEffect(() => {
    console.log('App userId:', userId); // Debug log
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/freelancer-orders" element={<FreelancerOrders />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-gig" element={<CreateGig />} /> 
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/gigs" element={<GigList />} />
        <Route path="/gigs/:gigId" element={<GigDetail />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/purchase/:gigId" element={<PurchasePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<Cancel />} />
        
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/edit-gig/:id" element={<EditGig />} /> {/* Add this route */}

        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Fallback */}
      


      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;






















/*

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateGig from './pages/CreateGig'; // ✅ import your new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-4xl text-center text-green-600 font-bold mt-10">
              ✅ Tailwind is working in WorkWithTrust!
            </div>
          }
        />
        <Route path="/create-gig" element={<CreateGig />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/



