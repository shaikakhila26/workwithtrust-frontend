// src/pages/GigDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa"; // For star icons

const GigDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/${gigId}`);
        console.log("Gig object:", res.data);
        

        setGig(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${gigId}`);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load reviews");
      }
    };


    fetchGig();
    fetchReviews();
  }, [gigId]);

  const handlePurchase = () => {
    if (gig?._id) {
      navigate(`/purchase/${gig._id}`);
    } else {
      toast.error("Gig ID not available");
    }
  };

  const handleMessageClick = () => {
    if (gig?.freelancer?._id) {
      navigate(`/chat?userId=${gig.freelancer._id}`);
    } else {
      toast.error("Cannot message seller: Freelancer data missing");
    }
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white p-4 rounded shadow mb-3">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-semibold text-gray-800">{review.userId?.name || "Anonymous"}</h4>
        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!gig) return <div className="text-center py-10 text-gray-600">Gig not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-400">

    <div className="max-w-5xl mx-auto px-6 py-10 bg-blue-200  rounded-xl shadow-md justify-center w-[600px] backdrop-blur-lg p-4 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[#1c2a49] mb-6">{gig.title}</h1>

      {/* Freelancer Info */}
      {gig.freelancer ? (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
    gig.freelancer.profilePic
      ? `http://localhost:5000/uploads/${gig.freelancer.profilePic}`
      : '/default-avatar.jpg'
  }
            alt="Freelancer"
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-600"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{gig.freelancer.name}</h2>
            <p className="text-sm text-gray-600">
              {gig.freelancer.bio || "No bio available"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 mb-6">Freelancer information not available</div>
      )}

      {/* Gig Description */}
      <p className="text-lg text-gray-700 mb-4">{gig.description}</p>

      {/* Price */}
      <div className="text-2xl font-bold text-purple-700 mb-6">₹{gig.amount}</div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleMessageClick}
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition duration-200"
        >
          💬 Message Seller
        </button>

        <button
          onClick={handlePurchase}
          className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded transition duration-200"
        >
          Purchase
        </button>
      </div>
      {/* 💬 Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet for this gig.</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>
    </div>
    </div>
    
  );
};

export default GigDetail;
