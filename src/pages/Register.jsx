import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://workwithtrust-backend.onrender.com/api/auth/register', formData);
      toast.success('🎉 Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config,
    });
      if (err.response?.status === 400) {
        toast.error('⚠️ User already exists!');
      } else {
        toast.error('🚫 Registration failed. Try again.');
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url(register-bg.jpg)', // ✅ You can replace this with any other soft image
      }}
    >
      <div className="w-full max-w-4xl flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/80 absolute right-20 bottom-20">

        {/* Left Panel */}
        <div className="w-full sm:w-1/2 bg-emerald-400 text-white flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 space-y-4 backdrop-blur-md ">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center text-sm sm:text-base lg:text-lg mb-6">
            Already have an account? Please sign in.
          </p>
          <Link
            to="/login"
            className="border-2 border-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-white hover:text-emerald-600 transition-all duration-300 text-sm sm:text-base"
          >
            Sign In
          </Link>
        </div>

        {/* Right Panel */}
        <div className="w-full sm:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2 rounded-full hover:bg-emerald-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;













/*import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer', // default role
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('🎉 Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error('⚠️ User already exists!');
      } else {
        toast.error('🚫 Registration failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden flex w-full max-w-5xl">

      
        <div className="w-1/2 bg-emerald-500 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-6 text-center">
            Already have an account? Please sign in.
          </p>
          <Link
            to="/login"
            className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-emerald-500 transition"
          >
            Sign In
          </Link>
        </div>

       
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

         
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={formData.role === 'freelancer'}
                  onChange={handleChange}
                />
                Freelancer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={formData.role === 'client'}
                  onChange={handleChange}
                />
                Client
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-full hover:bg-emerald-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;


*/














/*import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden flex w-full max-w-5xl">

        
        <div className="w-1/2 bg-emerald-500 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-6 text-center">
            To keep connected with us please login with your personal info
          </p>
          <Link
            to="/login"
            className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-emerald-500 transition"
          >
            Sign In
          </Link>
        </div>

        
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
            Create Account
          </h2>

          <div className="flex justify-center gap-4 mb-4">
            <button className="bg-gray-100 p-2 rounded-full hover:shadow-md">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5" />
            </button>
            <button className="bg-gray-100 p-2 rounded-full hover:shadow-md">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5" />
            </button>
            <button className="bg-gray-100 p-2 rounded-full hover:shadow-md">
              <img src="https://www.svgrepo.com/show/475675/linkedin-color.svg" alt="LinkedIn" className="w-5" />
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            or use your email for registration
          </p>

       
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-full hover:bg-emerald-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
*/