// src/pages/PurchasePage.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import config from '../config';

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const PurchasePage = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`https://workwithtrust-backend.onrender.com/api/gigs/${gigId}`);
        setGig(res.data);
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        toast.error("Failed to load gig");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [gigId, navigate]);

  const handleConfirmPurchase = async () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (parseErr) {
      console.error('Failed to parse user from localStorage:', parseErr);
      toast.error('Session data corrupted. Please log in again.');
      navigate('/login');
      return;
    }

    if (!token || !user || !gig) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://workwithtrust-backend.onrender.com/api/stripe/create-checkout-session`,
        { gigId: gig._id || gigId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize.');
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error('Purchase error:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Purchase failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (!gig) return <div className="p-6 text-center text-red-500">Gig not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-400
 px-4 py-12">
      <div className="bg-[#1c2a49]/50 text-white w-[400px] max-w-5xl rounded-2xl shadow-lg p-8 grid md:grid-cols-3-row-2 gap-8">
        <h1 className="text-3xl font-extrabold text-emerald mb-6 border-b pb-2">{gig.title}</h1>
        <p className="text-white-700 mb-4 text-lg leading-relaxed">{gig.description}</p>
        <p className="text-white-600 text-2xl font-semibold mb-8">₹{gig.amount}</p>

        <button
          onClick={handleConfirmPurchase}
          className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 w-auto "
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Purchase'}
        </button>
      </div>
    </div>
  );
};

export default PurchasePage;


















// src/pages/PurchasePage.jsx
/*
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import config from '../config';


const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY); // Ensure you have your Stripe public key here

const PurchasePage = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/${gigId}`);
        setGig(res.data);
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        toast.error("Failed to load gig");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();

  
  }, [gigId, navigate]);

  

  const handleConfirmPurchase = async () => {
 

 // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let user = null;
    

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
   
    } catch (parseErr) {
      console.error('Failed to parse user from localStorage:', parseErr);
      toast.error('Session data corrupted. Please log in again.');
      navigate('/login');
      return;
    }

    if (!token || !user ||!gig){
        console.log('Missing data:',{token : !token, user: !user, gig: !gig});
      toast.error("Please login first");
      navigate('/login');
      return;
    }

    try {
        setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/stripe/create-checkout-session`,
        { gigId: gig._id || gigId}, // Use gig._id if available, fallback to gigId
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     console.log('localStorage before Stripe redirect:', {
  user: localStorage.getItem('user'),
  token: localStorage.getItem('token'),
});
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize. Check your public key.');
      }
    await stripe.redirectToCheckout({ sessionId: res.data.id });

      toast.success("Order placed!");
  
    } catch (err) {
      console.error('purchase error:', err);
      toast.error("failed to redirect to checkout");
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      }
      else{
        toast.error('purchase failed please try again');
        navigate('/login');
      }
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!gig) return <div className="p-6">Gig not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">{gig.title}</h1>
      <p className="text-gray-700 mb-2">{gig.description}</p>
      <p className="text-purple-700 text-xl font-semibold mb-4">₹{gig.amount}</p>

      <button
        onClick={handleConfirmPurchase}
        className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Confirm Purchase'}
      </button>
    </div>
  );
};

export default PurchasePage;

*/