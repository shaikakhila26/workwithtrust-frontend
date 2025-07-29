import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FreelancerOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      console.error('❌ No user or token found');
      toast.error('Please log in');
      navigate('/login');
      return;
    }
    if (user.role !== 'freelancer') {
      console.error('❌ User is not a freelancer:', user.role);
      toast.error('Only freelancers can view orders');
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log('📤 Fetching freelancer orders for user:', user._id);
        const res = await axios.get('https://workwithtrust-backend.onrender.com/api/orders/freelancer', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('✅ Orders received:', res.data);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
        setError(errorMessage);
        toast.error(`❌ ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user, token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log('📤 Updating order status:', { orderId, newStatus });
      const res = await axios.put(
        `https://workwithtrust-backend.onrender.com/api/orders/freelancer/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Order status updated:', res.data);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`✅ Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('❌ Failed to update order status:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = err.response?.data?.message || 'Failed to update order status';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6 bg-gray-100 text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 text-center text-red-700">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-700">Your Freelancer Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found. Create gigs to attract clients!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  <Link
                    to={`/gigs/${order.gig?._id}`}
                    className="text-emerald-600 hover:underline"
                  >
                    {order.gig?.title || 'N/A'}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Order ID:</span> {order._id}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Client:</span>{' '}
                  {order.client?.name || 'N/A'} ({order.client?.email || 'N/A'})
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Amount:</span> ${order.amount}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'completed')}
                      className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerOrders;















/*
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No valid token found');
        setError('Please log in to view your orders.');
        toast.error('Please log in to view your orders.');
        return;
      }

      if (!user || user.role !== 'freelancer') {
        throw new Error('Access denied. Only freelancers can view this page.');
      }

      console.log('Fetching orders with token for freelancer:', token);
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('❌ Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return (
    <div className="p-6 text-center">
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{order.gigTitle || 'Untitled'}</h3>
              <p>Status: {order.status}</p>
              <p>Price: ₹{order.amount}</p>
              <p>Buyer: {order.buyerName || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
*/