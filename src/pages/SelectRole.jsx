import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SelectRole = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    console.log('📝 Stored user:', user);
    console.log('📝 Stored token:', storedToken);

    if (!user || !storedToken) {
      console.error('❌ No user or token found in localStorage');
      toast.error('Please login first');
      navigate('/login');
    } else {
      setUserId(user._id);
      setToken(storedToken);
    }
  }, [navigate]);

  const handleRoleSelect = async (role) => {
    if (!userId || !token) {
      console.error('❌ Missing userId or token:', { userId, token });
      toast.error('User ID or token not found. Please log in again.');
      return;
    }

    try {
      console.log('📤 Setting role:', role, 'for userId:', userId);
      const res = await axios.put(
        'http://localhost:5000/api/auth/set-role',
        { userId, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('✅ Role update response:', res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token); // Update token
      toast.success(`🎯 Role set as ${role}`);
      navigate('/onboarding');
    } catch (err) {
      console.error('❌ Role update error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = err.response?.data?.message || 'Failed to set role';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Welcome to WorkWithTrust 👋</h1>
        <p className="text-gray-600 mb-10">
          Tell us who you are so we can tailor your experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Freelancer Card */}
          <div
            onClick={() => handleRoleSelect('freelancer')}
            className="border hover:shadow-lg rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1"
          >
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/freelancer-working-on-laptop-6172611-5090153.png"
              alt="Freelancer"
              className="w-36 h-36 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4 text-purple-600">I’m a Freelancer</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Offer your skills and earn by working on gigs.
            </p>
          </div>

          {/* Client Card */}
          <div
            onClick={() => handleRoleSelect('client')}
            className="border hover:shadow-lg rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1"
          >
            <img
              src="client.jpg"
              alt="Client"
              className="w-36 h-36 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4 text-yellow-600">I’m a Client</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Post projects and hire trusted freelancers for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;





















/*
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SelectRole = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
    } else {
      setUserId(user._id);
      setStoredUser(user); // Store the full user object
      console.log('Stored user:', user);
    }
  }, []);

  const handleRoleSelect = async (role) => {
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }
    if (!storedUser || !storedUser.token) {
      toast.error('Token not found. Please log in again.');
      return;
    }
    try {
    //const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.put('http://localhost:5000/api/auth/set-role', {
        userId,
        role,
      } ,
      { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      console.log('Role update response:', res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`🎯 Role set as ${role}`);
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      toast.error('Failed to set role. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Welcome to WorkWithTrust 👋</h1>
        <p className="text-gray-600 mb-10">
          Tell us who you are so we can tailor your experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   
          <div
            onClick={() => handleRoleSelect('freelancer')}
            className="border hover:shadow-lg rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1"
          >
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/freelancer-working-on-laptop-6172611-5090153.png"
              alt="Freelancer"
              className="w-36 h-36 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4 text-purple-600">I’m a Freelancer</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Offer your skills and earn by working on gigs.
            </p>
          </div>

          
          <div
            onClick={() => handleRoleSelect('client')}
            className="border hover:shadow-lg rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1"
          >
            <img
              src="client.jpg"
              alt="Client"
              className="w-36 h-36 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4 text-yellow-600">I’m a Client</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Post projects and hire trusted freelancers for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
*/