// src/pages/ClientDashboard.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa';

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const token = localStorage.getItem('token'); // Fetch token separately
  console.log('User from state:', user,'token:', token);

  const fetchOrders = async () => {
    try {
      if (!user || user.role !== 'client') {
        throw new Error('Access denied. Client role required or user not logged in.');
      }
      if (!token) {
        throw new Error('No token available, please log in.');
      }

      console.log('Fetching orders with token:', token);


      
      const res = await axios.get('https://workwithtrust-backend.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      const spent = res.data.reduce((acc, order) => acc + (order.amount || 0), 0);
      setTotalSpent(spent);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      if (err.response?.status === 404) {
    setOrders([]); // explicitly set empty array
  } else {
    setError('Failed to load orders. Please try again.');
    toast.error(err.response?.data?.message || 'Error loading your orders');
  }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, token]);

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={handleRefresh}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
  
  {/* Mobile toggle */}
      <button
        className="md:hidden absolute top-4 left-4 z-20 bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars className="text-xl text-emerald-400" />
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-300 ${
          sidebarOpen ? 'block' : 'hidden'
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>



      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || 'Guest'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Spent" value={`₹${totalSpent}`} />
          <StatCard label="Orders in Progress" value={orders.filter(o => o.status === 'in-progress').length} />
          <StatCard label="Completed Orders" value={orders.filter(o => o.status === 'completed').length} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchased Gigs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-2 px-4">Gig</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      You haven't ordered any gigs yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 px-4">{order.gigTitle || 'Untitled'}</td>
                      <td className="py-2 px-4 capitalize">{order.status}</td>
                      <td className="py-2 px-4">₹{order.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
          >
            Refresh
          </button>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-2xl font-bold text-emerald-600 mt-2">{value}</h3>
  </div>
);

export default ClientDashboard;




















/*
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//const user = JSON.parse(localStorage.getItem('user'));
//console.log("User from localStorage:", user);

//const token = localStorage.getItem('token');



  useEffect(() => {
    if (!user || user.role !== 'client') {
      setLoading(false);
       return;
}

    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
         console.log("Fetched orders:", res.data);


        const spent = res.data.reduce((acc, order) => acc + (order.amount || 0), 0);
        setTotalSpent(spent);
      } catch (err) {
        console.error(err);
        toast.error("Error loading your orders");
        console.error("❌ Error fetching orders:", err);
      }
      finally{
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);
  
  console.log("Sending token:", user.token);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Spent" value={`₹${totalSpent}`} />
          <StatCard label="Orders in Progress" value={orders.filter(o => o.status === 'in-progress').length} />
          <StatCard label="Completed Orders" value={orders.filter(o => o.status === 'completed').length} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-2 px-4">Gig</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      You haven't ordered any gigs yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 px-4">{order.gigTitle || "Untitled"}</td>
                      <td className="py-2 px-4 capitalize">{order.status}</td>
                      <td className="py-2 px-4">₹{order.amount}</td>
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

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-2xl font-bold text-emerald-600 mt-2">{value}</h3>
  </div>
);

export default ClientDashboard;
*/
