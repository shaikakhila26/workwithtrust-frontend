import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import avatar from '../assets/avatar.svg'; // Replace with your avatar image

const Login = () => {
  const navigate = useNavigate(); // ✅ Fixes "navigate is not defined"

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);


  try {
    console.log('Logging in with:', formData);
    const res = await axios.post('http://localhost:5000/api/auth/login', formData);

    // Optional: log the whole response to debug
    console.log("Login response:", res.data);
/*
    if (res.status === 200 && res.data?.token) {
      if (!toast.isActive('login-toast')) {
  toast.success('Login successful!', { toastId: 'login-toast' });
}

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
*/
/*
if (!res.data.token || !res.data._id){
        console.error('No token in login response:', res.data);
        throw new Error('No token received from server');
      }
   /* localStorage.setItem('user', JSON.stringify(res.data));
      console.log('User stored in localStorage:', res.data);
      toast.success('Login successful');

     // Store user data as is (flattened structure)
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      
        token: res.data.token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User stored in localStorage:', userData);
      toast.success('Login successful');

      // Check role
      const userRole = res.data.role;
      if (!userRole || userRole === '' || userRole === null) {
        navigate('/select-role');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };


*/





// Handle nested or flat response
      const userData = res.data.user || res.data; // Adjust based on backend structure
      if (!userData._id || !userData.token) {
        console.error('No _id or token in login response:', userData);
        throw new Error('Invalid login response from server');
      }
      // Store token and user data separately
      localStorage.setItem('token', userData.token);
      const storedUser = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
    //  token: userData.token,
      };
      localStorage.setItem('user', JSON.stringify(storedUser));
      localStorage.setItem('profileImage', userData.profileImage || '');


      console.log('User stored in localStorage:', storedUser);
      console.log('Token stored in localStorage:', userData.token);
      toast.success('Login successful');

      // Navigate based on role
      const userRole = storedUser.role;
      console.log('User role:', userRole); // Debug role
      if (!userRole || userRole === '' || userRole === null) {
        console.log('Redirecting to /select-role due to missing role');
        navigate('/select-role');
      }
      else if (userRole === 'client') {
        console.log('Redirecting to /client-dashboard');
        navigate('/client-dashboard');
      }
       else {
        console.log('Redirecting to /dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

/*
      // 👉 Check role
        const userRole = res.data.user?.role;
        if (!userRole || userRole === '' || userRole === null) {
          navigate('/select-role');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error('⚠️ Unexpected response. Try again.');
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        toast.error('❌ Invalid credentials');
      } else {
        toast.error('⚠️ Something went wrong. Try again.');
      }
    }
  };

  */

  return (
    <div className="min-h-screen  flex items-center justify-center bg-cover bg-center px-4"
    style={{ backgroundImage: `url(${"login-bg.jpg"})` }}>
      <div className="w-full max-w-sm p-8 bg-[#0e1d4ad9] rounded-xl shadow-lg text-center relative text-white">
        
        <div className="flex justify-center mb-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>

        <h2 className="text-2xl font-bold">LOGIN</h2>
        <p className="text-sm text-blue-200 mb-6">Welcome</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            placeholder="User Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-[#162b63] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-[#162b63] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-between items-center text-sm text-gray-300">
            
            
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="underline text-blue-300">
            Create Account
          </Link>
        </p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;


























/*
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      toast.success('🎉 Login successful!');
      navigate('/dashboard'); // adjust as per your route
    } catch (err) {
      toast.error('❌ Invalid credentials');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
      
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-purple-500 opacity-40 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-fuchsia-300 opacity-20 rounded-full blur-2xl z-0" />

      
      <div className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-fuchsia-600 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
            <div className="text-sm text-right text-gray-500">Forgot your password?</div>
            <button
              type="submit"
              className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold py-3 rounded-full transition"
            >
              Login
            </button>
          </form>
        </div>

        <div className="hidden md:flex items-center justify-center p-6 bg-gradient-to-tr from-fuchsia-100 to-purple-200">
          <img
            src="/login-illustration.png" // make sure this exists in public/ or adjust path
            alt="Login Illustration"
            className="w-3/4 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

*/



/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 👉 You can call your backend API here
    console.log('Logging in:', { email, password });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      
      <div className="w-1/2 bg-gradient-to-br from-emerald-400 to-green-600 text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-lg text-center">We are glad to see you again 🎉</p>
        <img
          src="login-bg.jpg"
          alt="Login Illustration"
          className="mt-6 max-w-xs"
        />
      </div>

     
      <div className="w-1/2 bg-white flex flex-col justify-center px-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm mb-1 text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-500 text-center">
          Don’t have an account? <span className="text-emerald-600 cursor-pointer">Register Now</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
*/