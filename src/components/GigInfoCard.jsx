import { Link } from 'react-router-dom';

const GigInfoCard = ({ gig }) => {
  return (
    <Link to={`/gigs/${gig._id}`}>
      <div className="bg-white shadow p-4 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{gig.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{gig.description}</p>
        <p className="text-purple-700 font-bold">₹{gig.amount}</p>
      </div>
    </Link>
  );
};

export default GigInfoCard;
