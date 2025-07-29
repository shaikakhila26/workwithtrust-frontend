import { useEffect ,useState } from 'react';
import { useSearchParams, useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';



const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    console.log('Success redirect URL:', location.search); // Debug the query string
    const urlParams = new URLSearchParams(location.search);
    const gigId = urlParams.get('gigId');
    const sessionId = urlParams.get('session_id');

    if (!gigId || !sessionId) {
      console.error('Missing gigId or sessionId in success redirect');
      toast.error('Invalid payment success data');
      navigate('/purchase');
      return;
    }

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let user = null;


    try {
      user = storedUser ? JSON.parse(storedUser) : null;
     
    } catch (parseErr) {
      console.error('Failed to parse user on success:', parseErr);
      toast.error('Session data corrupted. Please log in again.');
      navigate('/login');
      return;
    }

    if (!token || !user) {
      console.error('No token or user after payment success' , {token:!!token , user:!!user});
      toast.error('Please log in first');
      navigate('/login');
      return;
    }

    const confirmOrder = async () => {
        setIsLoading(true); // Start loading
      try {
        console.log('🔍 Sending POST to /api/orders', { gigId, sessionId, token });
        const res = await axios.post(
          `http://localhost:5000/api/orders`,
          { gigId, sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Order confirmed:', res.data);
        toast.success('Order placed successfully!');
        navigate('/client-dashboard'); // Redirect to client dashboard or orders page
      } catch (err) {
        console.error('Order confirmation error:', err);
        if (err.response?.status === 404) {
          console.error('Route not found on server:', err.config.url);
        }
        toast.error('Failed to confirm order');
        navigate('/purchase');
        } finally {
        setIsLoading(false); // End loading
      }
      
    };

    confirmOrder();
  }, [location.search, navigate]);

  return (
  <div className="p-6 text-center">{isLoading ? 'Processing your order... Please wait.' : 'Order processed. Redirecting...'}
  </div>
  );
};

export default SuccessPage;