
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GigList = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fallback categories if API fails
  const fallbackCategories = [
    'web development',
    'graphic design',
    'video editing',
    'writing',
    'marketing'
  ];

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  // Fetch gigs
  useEffect(() => {
    let isMounted = true;

    const fetchGigs = async () => {
      try {
        console.log('Fetching gigs');
        const res = await axios.get('http://localhost:5000/api/gigs');
        console.log('Gigs received:', res.data);
        if (isMounted) {
          setGigs(res.data);
          setFilteredGigs(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
        if (isMounted) {
          setError('Failed to load gigs. Please try again.');
          toast.error('Failed to load gigs');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGigs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        console.log('Fetching categories');
        const res = await axios.get('http://localhost:5000/api/gigs/categories');
        console.log('Categories received:', res.data);
        if (isMounted) {
          setCategories(res.data.length ? res.data : fallbackCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (isMounted) {
          setError('Failed to load categories. Using fallback categories.');
          toast.error('Failed to load categories');
          setCategories(fallbackCategories);
        }
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort gigs
  useEffect(() => {
    let result = [...gigs];

    if (category !== 'all') {
      result = result.filter((gig) =>
        gig?.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      result = result.filter((gig) =>
        (gig.title?.toLowerCase().includes(search.toLowerCase()) ||
        gig.description?.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'time-asc') {
      result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'time-desc') {
      result.sort((a, b) => b.deliveryTime - a.deliveryTime);
    }

    setFilteredGigs(result);
  }, [search, category, sortBy, gigs]);

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSortBy('');
    setFilteredGigs(gigs);
  };

  if (loading) {
    return <div className="min-h-screen p-6 bg-gray-100 text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 text-center text-red-600 py-10">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Gigs</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search gigs..."
            className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="time-asc">Delivery Time: Fastest</option>
            <option value="time-desc">Delivery Time: Slowest</option>
          </select>
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGigs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No gigs found. Try adjusting your filters or{' '}
              <Link to="/create-gig" className="text-emerald-500 hover:underline">
                create a gig
              </Link>
              .
            </p>
          ) : (
            filteredGigs.map((gig) => (
              <Link
                to={`/gigs/${gig._id}`}
                key={gig._id}
                className="bg-white rounded shadow p-4 hover:shadow-lg transition"
              >
                <img
                  src={gig.images?.[0] || 'https://placehold.co/300x200?text=No+Image'}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => (e.target.src = 'https://placehold.co/300x200?text=No+Image')}
                />
                <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{gig.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gig.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-bold">${gig.amount}</span>
                  <span className="text-gray-400">{gig.deliveryTime} days</span>
                </div>
                <p className="text-sm text-gray-500">
                  By: {gig.freelancer?.name || 'Unknown'}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GigList;



















/*
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GigList = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gigs
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        console.log('Fetching gigs');
        const res = await axios.get('http://localhost:5000/api/gigs');
        console.log('Gigs received:', res.data);
        setGigs(res.data);
        setFilteredGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
        setError('Failed to load gigs. Please try again.');
        toast.error('Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories');
        const res = await axios.get('http://localhost:5000/api/gigs/categories');
        console.log('Categories received:', res.data);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again.');
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Filter and sort gigs
  useEffect(() => {
    let result = [...gigs];

    if (category !== 'all') {
      result = result.filter((gig) =>
        gig?.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search.trim()) {
      result = result.filter((gig) =>
        (gig.title?.toLowerCase().includes(search.toLowerCase()) ||
        gig.description?.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'time-asc') {
      result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'time-desc') {
      result.sort((a, b) => b.deliveryTime - a.deliveryTime);
    }

    setFilteredGigs(result);
  }, [search, category, sortBy, gigs]);

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSortBy('');
    setFilteredGigs(gigs);
  };

  if (loading) {
    return <div className="min-h-screen p-6 bg-gray-100 text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen p-6 bg-gray-100 text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Gigs</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search gigs..."
            className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="time-asc">Delivery Time: Fastest</option>
            <option value="time-desc">Delivery Time: Slowest</option>
          </select>
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGigs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No gigs found. Try adjusting your filters or{' '}
              <Link to="/create-gig" className="text-emerald-500 hover:underline">
                create a gig
              </Link>
              .
            </p>
          ) : (
            filteredGigs.map((gig) => (
              <Link
                to={`/gigs/${gig._id}`}
                key={gig._id}
                className="bg-white rounded shadow p-4 hover:shadow-lg transition"
              >
                <img
                  src={gig.images?.[0] || 'https://placehold.co/300x200?text=No+Image'}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => (e.target.src = 'https://placehold.co/300x200?text=No+Image')}
                />
                <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{gig.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gig.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-bold">${gig.amount}</span>
                  <span className="text-gray-400">{gig.deliveryTime} days</span>
                </div>
                <p className="text-sm text-gray-500">
                  By: {gig.freelancer?.name || 'Unknown'}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GigList;


*/
























/*
 mport { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';s
import axios from 'axios';
import { Link } from 'react-router-dom';


const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch all gigs (ONCE)
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gigs');
        setGigs(res.data);
        setFilteredGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs', err);
      }
    };
    fetchGigs();
  }, []);

  // 🔹 Fetch categories (ONCE)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gigs/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Filter + Sort logic
  useEffect(() => {
    let result = [...gigs];

    // ✅ Category Filter
    if (category !== 'all') {
      result = result.filter(gig =>
        gig?.category?.toLowerCase().includes(category.toLowerCase())
      );
    }
console.log("All gigs:", gigs);

    // ✅ Search Keyword
    if (search.trim()) {
      result = result.filter(gig =>
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✅ Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'time-asc') {
      result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'time-desc') {
      result.sort((a, b) => b.deliveryTime - a.deliveryTime);
    }

    setFilteredGigs(result);
  }, [search, category, sortBy, gigs]);

  // 🔄 Reset Filters
  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSortBy('');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
    
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search gigs..."
            className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="web development">Web Development</option>
            <option value="graphic design">Graphic Design</option>
            <option value="video editing">Video Editing</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
            
            
          </select>

          <select
            className="px-4 py-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="time-asc">Delivery Time: Fastest</option>
            <option value="time-desc">Delivery Time: Slowest</option>
          </select>

          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGigs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No gigs found.</p>
          ) : (
            filteredGigs.map((gig) => (
              <Link
                to={`/gigs/${gig._id}`}
                key={gig._id}
                className="bg-white rounded shadow p-4 hover:shadow-lg transition"
              >
                <img
                  src={gig.images?.[0] }
                onError={(e) => (e.target.src = 'https://placehold.co/300x200?text=No+Image')}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                

                <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{gig.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {gig.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-bold">${gig.amount}</span>
                  <span className="text-gray-400">{gig.deliveryTime} days</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GigList;



*/






// src/pages/GigList.jsx
/*import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
    



  // Fetch all gigs from backend
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gigs');
        setGigs(res.data);
        setFilteredGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs', err);
      }
    };

    fetchGigs();
  }, []);

  // Filter gigs when search/category changes
  useEffect(() => {
    let result = [...gigs];

    if (category !== 'all') {
      result = result.filter(gig =>
        gig.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search.trim()) {
      result = result.filter(gig =>
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredGigs(result);

    if (sortBy === 'price-asc') {
  result.sort((a, b) => a.price - b.price);
} else if (sortBy === 'price-desc') {
  result.sort((a, b) => b.price - a.price);
} else if (sortBy === 'time-asc') {
  result.sort((a, b) => a.deliveryTime - b.deliveryTime);
} else if (sortBy === 'time-desc') {
  result.sort((a, b) => b.deliveryTime - a.deliveryTime);
}


const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/gigs/categories');
    setCategories(res.data);
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
};

fetchCategories();



  }, [search, category, gigs]);


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
       
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search gigs..."
            className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="web development">Web Development</option>
            <option value="graphic design">Graphic Design</option>
            <option value="video editing">Video Editing</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
            <option value="all">All Categories</option>
{categories.map(cat => (
  <option key={cat} value={cat}>{cat}</option>
))}

            
          </select>
        </div>
        <select
  className="px-4 py-2 border rounded"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="">Sort By</option>
  <option value="price-asc">Price: Low to High</option>
  <option value="price-desc">Price: High to Low</option>
  <option value="time-asc">Delivery Time: Fastest</option>
  <option value="time-desc">Delivery Time: Slowest</option>
</select>




        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGigs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No gigs found.</p>
          ) : (
            filteredGigs.map((gig) => (
              <Link
                to={`/gigs/${gig._id}`}
                key={gig._id}
                className="bg-white rounded shadow p-4 hover:shadow-lg transition"
              >
                <img
                  src={gig.images[0] || 'https://via.placeholder.com/300'}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{gig.category}</p>
                <div className="flex justify-between items-center text-sm">
                    <p className="text-sm text-gray-600 line-clamp-2">
  {gig.description}
</p>

                  <span className="text-emerald-600 font-bold">${gig.price}</span>
                  <span className="text-gray-400">{gig.deliveryTime} days</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GigList;
*/