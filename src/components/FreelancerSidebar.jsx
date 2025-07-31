// src/components/FreelancerSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaClipboardList, FaEnvelope, FaDollarSign, FaUserCircle } from 'react-icons/fa';

const FreelancerSidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
   
    { label: 'Create Gig', icon: <FaPlusCircle />, path: '/create-gig' },
    { label: 'Your Orders', icon: <FaClipboardList />, path: '/freelancer-orders' },
    { label: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    { label: 'Earnings', icon: <FaDollarSign />, path: '/earnings' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-6  sticky top-0">
      <div className="text-2xl font-bold text-emerald-600 mb-8">WorkWithTrust</div>
      <nav className="space-y-4">
        {navItems.map(({ label, icon, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
              pathname === path
                ? 'bg-emerald-100 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default FreelancerSidebar;