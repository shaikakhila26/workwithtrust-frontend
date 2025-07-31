
// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FreelancerSidebar from '../components/FreelancerSidebar';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token'); // Fetch token separately
  const [earnings, setEarnings] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedGigs, setCompletedGigs] = useState(0);
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// Toggle function and conditional rendering for sidebar

  useEffect(() => {
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }

    if (user.role !== 'freelancer') {
      navigate('/client-dashboard');
      return;
    }

    if (!token) {
      toast.error('Authentication token missing');
      navigate('/login');
      return;
    }

    
    const fetchDashboardData = async () => {
  try {
    console.log('Fetching gigs for user:', user._id);
    const gigsRes = await axios.get(`https://workwithtrust-backend.onrender.com/api/gigs/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Dashboard gigs:', gigsRes.data);
    setGigs(gigsRes.data);
    setCompletedGigs(gigsRes.data.length);

    // 🔹 Fetch active orders
    let orders = [];
    try {
      const ordersRes = await axios.get('https://workwithtrust-backend.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      orders = ordersRes.data;
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No orders found for this freelancer');
        orders = [];
      } else {
        throw err;
      }
    }

    const activeCount = orders.filter(order => order.status === 'in-progress').length;
    setActiveOrders(activeCount);

    // 🔹 Fetch earnings
    try {
      const earningsRes = await axios.get('https://workwithtrust-backend.onrender.com/api/orders/earnings/total', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEarnings(earningsRes.data.total || 0);
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No earnings found for this freelancer');
        setEarnings(0);
      } else {
        throw err;
      }
    }

  } catch (err) {
    console.error('Dashboard data fetch error:', err);
    setError('Failed to load dashboard data. Please try again.');
    toast.error('Failed to load dashboard data');
  }
};




    fetchDashboardData();
  }, [user, navigate, token]);

  const handleEditGig = (gigId) => {
    navigate(`/edit-gig/${gigId}`);
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        console.log('Deleting gig with ID:', gigId);
        await axios.delete(`https://workwithtrust-backend.onrender.com/api/gigs/${gigId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGigs((prevGigs) => prevGigs.filter((gig) => gig._id !== gigId));
        console.log('Gig deleted:', gigId);
      } catch (error) {
        console.error('Error deleting gig:', error);
        if (error.response?.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          toast.error('Please log in again');
        } else if (error.response?.status === 404) {
          console.error('Gig not found:', gigId);
          toast.error('Gig not found');
        } else {
          toast.error('Failed to delete gig');
        }
      }
    }
  };

const handleToggleSidebar = () => {
    console.log('Toggling sidebar, isSidebarOpen:', !isSidebarOpen); // Debug log
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
  setIsSidebarOpen(false);
};


useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col sm:flex-row">
        <FreelancerSidebar  className="sm:block hidden"/>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="text-center text-red-600 py-6 sm:py-8">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col sm:flex-row relative">
      {/* Sidebar - Toggle on mobile, static on sm+ */}
      <FreelancerSidebar
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } sm:static sm:translate-x-0 sm:h-screen`}
/>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      

      {/* Hamburger Button - only on mobile */}
      <button
        className="fixed top-4 left-4 z-50 sm:hidden bg-white p-2 rounded shadow"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>
      

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 pb-24 ${isSidebarOpen ? 'ml-64' : 'ml-0'} sm:ml-64 sm:pb-8`}>
        <div className="flex flex-col gap-3 sm:flex-row justify-between items-center mb-6 sm:mb-8 text-center sm:text-left">

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Welcome back, {user?.name || 'User'} 👋</h1>
          <Link
            to="/create-gig"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
          >
            + Create Gig
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <p className="text-xs sm:text-sm text-gray-500">Earnings</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-2">${earnings}</h3>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <p className="text-xs sm:text-sm text-gray-500">Active Orders</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-2">{activeOrders}</h3>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <p className="text-xs sm:text-sm text-gray-500">Completed Gigs</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-2">{completedGigs}</h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Your Gigs</h2>
          <div className="overflow-x-auto w-full">
            <table className="min-w-[600px] text-xs sm:text-sm text-left text-gray-700">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-1 px-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Title</th>
                  <th className="py-1 px-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Status</th>
                  <th className="py-1 px-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Views</th>
                  <th className="py-1 px-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Earnings</th>
                  <th className="py-1 px-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500 text-xs sm:text-sm">No gigs created yet.</td>
                  </tr>
                ) : (
                  gigs.map((gig) => (
                    <tr key={gig._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/gigs/${gig._id}`)}>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{gig.title}</td>
                      <td className="py-2 px-2 sm:px-4 text-green-600 text-xs sm:text-sm">Active</td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{gig.views || 0}</td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">${gig.amount}</td>
                      <td className="py-2 px-2 sm:px-4 space-x-2">
                        <button
                          className="text-xs sm:text-sm text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGig(gig._id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs sm:text-sm text-red-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGig(gig._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;




















/*
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // make sure it's imported at the top
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';




const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
    const [earnings, setEarnings] = useState(0);
const [activeOrders, setActiveOrders] = useState(0);
const [completedGigs, setCompletedGigs] = useState(0);
const [gigs, setGigs] = useState([]);
const [error, setError] = useState(null);


  useEffect(() => {
  if (!user) {
    toast.error("Please log in first");
    navigate("/login");
    return;
  }

  if (user.role !== 'freelancer') {
      // 👇 Redirect clients away from this page
      navigate('/client-dashboard');
      return;
    }



//const token = localStorage.getItem('token');
 if (!user.token) {
      toast.error('Authentication token missing');
      navigate('/login');
      return;
    }

  const fetchDashboardData = async () => {
    try {
     console.log('Fetching gigs for user:', user._id);
      const gigsRes = await axios.get(`http://localhost:5000/api/gigs/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log('Dashboard gigs:', gigsRes.data);
      setGigs(gigsRes.data);
      setCompletedGigs(gigsRes.data.length); // for now all are considered completed

      // 🔹 2. Fetch active orders
      const ordersRes = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const activeCount = ordersRes.data.filter(order => order.status === 'in-progress').length;
      setActiveOrders(activeCount);

      // 🔹 3. Fetch earnings
      const earningsRes = await axios.get('http://localhost:5000/api/orders/earnings/total', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setEarnings(earningsRes.data.total || 0);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error("Failed to load dashboard data");
    }
  };

  fetchDashboardData();
},[user, navigate]);


  const handleEditGig = (gigId) => {
    navigate(`/edit-gig/${gigId}`);
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        console.log('Deleting gig with ID:', gigId);
      const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.token) {
      console.error('No token found in localStorage');
      return; // Optionally redirect to login
    }   
        await axios.delete(`http://localhost:5000/api/gigs/${gigId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        // Update state to remove the deleted gig
    setGigs((prevGigs) => prevGigs.filter((gig) => gig._id !== gigId));
    console.log('Gig deleted:', gigId);
  } catch (error) {
    console.error('Error deleting gig:', error);
    if (error.response?.status === 401) {
      console.error('Unauthorized: Invalid or expired token');
      toast.error('Please log in again');
      // Optionally redirect to login
    } else if (error.response?.status === 404) {
      console.error('Gig not found:', gigId);
      toast.error('Gig not found');
    }
    else {
          toast.error('Failed to delete gig');
        }
  }
};
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center text-red-600 py-10">{error}</div>
        </main>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gray-100 flex">
     
      <Sidebar />

    
      <main className="flex-1 p-8">
       
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <Link
            to="/create-gig"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            + Create Gig
          </Link>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Earnings</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">${earnings}</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Active Orders</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{activeOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Completed Gigs</p>
         <h3 className="text-2xl font-bold text-emerald-600 mt-2">{completedGigs}</h3>
          </div>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Gigs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Views</th>
                  <th className="py-2 px-4">Earnings</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
  {gigs.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">No gigs created yet.</td>
    </tr>
  ) : (
    gigs.map((gig) => (
      <tr key={gig._id} className="border-b"
           onClick={() => navigate(`/gigs/${gig._id}`)}>
        <td className="py-2 px-4">{gig.title}</td>
        <td className="py-2 px-4 text-green-600">Active</td>
        <td className="py-2 px-4">{gig.views || 0}</td>
        <td className="py-2 px-4">${gig.amount}</td>
        <td className="py-2 px-4 space-x-2">
          <button className="text-sm text-blue-600 hover:underline"
          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGig(gig._id);
                          }}
          >Edit</button>
          <button className="text-sm text-red-600 hover:underline"
          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGig(gig._id);
                          }}
          >Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
*/