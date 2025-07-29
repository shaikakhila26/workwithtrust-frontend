// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);
  const [rating, setRating] = useState(0); // State for star rating

  const backendBase = 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      if (!token) {
        console.log('No valid token found');
        setError('Please log in to view your orders.');
        toast.error('Please log in to view your orders.');
        return;
      }

      if (!user || user.role !== 'client') {
        throw new Error('Access denied. Only clients can view this page.');
      }

      console.log('Fetching orders with token for client:', token);
      const res = await axios.get(`${backendBase}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Orders data:', JSON.stringify(res.data, null, 2)); // Debug: Log formatted response
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

  const handleLeaveFeedback = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    console.log('Order data for feedback:', JSON.stringify(order, null, 2)); // Debug: Log formatted order
    const gigId = order?.gigId; // Only use gigId if it exists
    if (!gigId) {
      console.error('Invalid gigId detected:', gigId);
      toast.error('Unable to leave feedback: gigId is missing. Please contact support or check backend setup.');
      return;
    }
    setShowFeedback({ orderId, gigId });
    setRating(0); // Reset rating
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    try {
      if (!showFeedback?.gigId) {
        throw new Error('Invalid gig ID');
      }
      console.log('Submitting feedback for gigId:', showFeedback.gigId); // Debug
      const res = await axios.post(
        `${backendBase}/api/reviews/${showFeedback.gigId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Feedback submitted!');
      setShowFeedback(null);
      setRating(0); // Reset rating
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('❌ Error submitting feedback:', err.response?.data || err.message);
      toast.error(`Failed to submit feedback: ${err.response?.data?.message || err.message}`);
    }
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
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 Your Orders</h1>
          <button
            onClick={handleRefresh}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">{order.gigTitle || 'N/A'}</h3>
                <p className="text-gray-600">Client: {order.buyerName || 'N/A'}</p>
                <p className="text-green-600 font-semibold">Price: ${order.amount || 0}</p>
                <p className="text-gray-500">Status: {order.status}</p>
                <div className="mt-2">
                  {order.status === 'completed' && !order.reviewId && (
                    <button
                      onClick={() => handleLeaveFeedback(order._id)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                      Leave Feedback
                    </button>
                  )}
                  {order.reviewId && (
                    <span className="text-green-600 font-medium">Feedback Submitted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Leave Feedback</h2>
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <span
                        className={`text-2xl cursor-pointer transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Comment</label>
                <textarea
                  name="comment"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedback(null);
                    setRating(0);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
                   


























/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);

  const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      let user = null;
      try {
        user = storedUser ? JSON.parse(storedUser) : null;
        console.log('Parsed user from localStorage:', user); // Debug
      } catch (parseErr) {
        console.error('Failed to parse user from localStorage:', parseErr);
        setError('Session data corrupted. Please log in again.');
        toast.error('Session data corrupted. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No valid token found');
        setError('Please log in to view your orders.');
        toast.error('Please log in to view your orders.');
        return;
      }

      if (!user || user.role !== 'client') {
        throw new Error('Access denied. Only clients can view this page.');
      }

      console.log('Fetching orders with token for client:', token);
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

const handleLeaveFeedback = (orderId, gigId) => {
    setShowFeedback({ orderId, gigId });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const { rating, comment } = e.target.elements;
    try {
      const res = await axios.post(
        `${backendBase}/api/reviews/${showFeedback.gigId}`,
        { rating: Number(rating.value), comment: comment.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Feedback submitted!');
      setShowFeedback(null);
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('❌ Error submitting feedback:', err);
      toast.error('Failed to submit feedback');
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">📦 Your Orders</h1>
        <button
          onClick={handleRefresh}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Gig</th>
                <th className="p-3">Client</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{order.gigTitle}</td>
                  <td className="p-3">{order.buyerName || "N/A"}</td>
                  <td className="p-3 text-green-600 font-semibold">${order.amount}</td>
                  <td className="p-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
};

export default Orders;

*/
















// src/pages/Orders.jsx
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
/*
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load orders");
      }
      finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  if (loading) return <div className="text-center py-10">Loading...</div>;
*/
/*
const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

   const token = localStorage.getItem('token'); // Fetch token separately

      if (!token) {
        console.log('No valid token found');
        setError('Please log in to view your orders.');
        toast.error('Please log in to view your orders.');
        return;
      }
      if (!user || user.role ) {
          throw new Error('User role not found or not logged in.');
      }

      console.log('Fetching orders with token for role:', user.role );

      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null); // Clear any previous errors
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
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📦 Your Orders</h1>
      <button
          onClick={handleRefresh}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Gig</th>
                <th className="p-3">Client</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{order.gigTitle}</td>
                  <td className="p-3">{order.buyerName || "N/A"}</td>
                  <td className="p-3 text-green-600 font-semibold">${order.amount}</td>
                  <td className="p-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
*/