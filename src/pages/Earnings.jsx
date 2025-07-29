// src/pages/Earnings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Earnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('https://workwithtrust-backend.onrender.com/api/earnings/total', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTotalEarnings(res.data.total || 0);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load earnings");
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">💸 Earnings</h1>

      <div className="bg-white p-6 rounded-lg shadow text-center mb-8">
        <p className="text-gray-600">Total Earnings</p>
        <h2 className="text-4xl text-emerald-600 font-bold mt-2">${totalEarnings}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Tips</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Respond quickly to clients to increase engagement</li>
          <li>Complete orders on time for higher ratings</li>
          <li>Higher ratings = More gigs shown = More earnings 💰</li>
        </ul>
      </div>
    </div>
  );
};

export default Earnings;
