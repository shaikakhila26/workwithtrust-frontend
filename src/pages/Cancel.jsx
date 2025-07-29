// src/pages/Cancel.jsx
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed or Cancelled</h1>
      <p className="text-gray-700 mb-6">Your payment could not be completed. Please try again.</p>
      <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
        Go Back to Home
      </Link>
    </div>
  );
};

export default Cancel;
