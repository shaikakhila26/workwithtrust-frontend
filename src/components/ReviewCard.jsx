import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  const { rating, comment, userId, createdAt } = review;

  return (
    <div className="bg-white p-4 rounded shadow mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-700">{userId?.name || "Anonymous"}</span>
        <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex text-yellow-400 mb-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
        ))}
      </div>
      <p className="text-gray-700">{comment}</p>
    </div>
  );
};

export default ReviewCard;
