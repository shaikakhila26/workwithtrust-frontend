import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CLOUDINARY_UPLOAD_PRESET = 'workwithtrust_unsigned';
const CLOUDINARY_CLOUD_NAME = 'dfonkafln';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    deliveryTime: '',
    images: [],
    video: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderCount, setRenderCount] = useState(0); // Debug re-renders

  // Memoize user and token to prevent re-renders
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')) || null, []);
  const token = useMemo(() => localStorage.getItem('token'), []);

  // Debug re-renders
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
    console.log('🔄 Render count:', renderCount + 1);
  }, [renderCount]);

  useEffect(() => {
    if (!user || !token) {
      setError('Please log in to edit the gig.');
      toast.error('Please log in');
      navigate('/login');
      return;
    }
    if (user.role !== 'freelancer') {
      setError('Only freelancers can edit gigs.');
      toast.error('Only freelancers can edit gigs');
      navigate('/');
      return;
    }

    let isMounted = true;

    const fetchGig = async () => {
      try {
        console.log('📤 Fetching gig ID:', id);
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('✅ Gig received:', res.data);
        if (isMounted) {
          setFormData({
            title: res.data.title || '',
            description: res.data.description || '',
            category: res.data.category || '',
            amount: res.data.amount ? res.data.amount.toString() : '',
            deliveryTime: res.data.deliveryTime ? res.data.deliveryTime.toString() : '',
            images: Array.isArray(res.data.images) ? res.data.images : [],
            video: res.data.video || '',
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Failed to fetch gig:', err.response?.data || err.message);
        if (isMounted) {
          setError('Failed to load gig: ' + (err.response?.data?.message || err.message));
          toast.error('Failed to load gig');
          setLoading(false);
        }
      }
    };

    fetchGig();

    return () => {
      isMounted = false;
    };
  }, [id, navigate, token, user?._id, user?.role]); // Stable dependencies

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('📝 Handling change:', name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' || name === 'deliveryTime' ? (value === '' ? '' : Number(value)) : value,
    }));
  }, []);

  const handleImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    console.log('📸 Uploading images:', files.length);
    const uploaded = [];
    let failed = false;
    setUploading(true);

    for (let file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          data
        );
        uploaded.push(res.data.secure_url);
      } catch (err) {
        console.error('❌ Image upload failed:', err);
        failed = true;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));

    setUploading(false);
    if (uploaded.length > 0 && !failed) {
      toast.success('✅ All images uploaded successfully');
    } else if (uploaded.length > 0 && failed) {
      toast.warn('⚠️ Some images uploaded, but some failed');
    } else {
      toast.error('❌ All image uploads failed');
    }
  }, []);

  const handleRemoveImage = useCallback((index) => {
    console.log('🗑️ Removing image at index:', index);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success('🗑️ Image removed');
  }, []);

  const handleVideoUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🎥 Uploading video');
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        data
      );
      setFormData((prev) => ({
        ...prev,
        video: res.data.secure_url,
      }));
      toast.success('🎥 Video uploaded successfully!');
    } catch (err) {
      console.error('❌ Video upload error:', err);
      toast.error('❌ Failed to upload video');
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      amount: Number(formData.amount),
      deliveryTime: Number(formData.deliveryTime),
      images: formData.images,
      video: formData.video,
    };

    console.log('📤 Submitting gig ID:', id, 'Payload:', payload);

    if (!payload.title || !payload.description || !payload.category || !payload.amount || !payload.deliveryTime) {
      setError('All fields are required');
      toast.error('❌ All fields are required');
      return;
    }
    if (isNaN(payload.amount) || payload.amount <= 0) {
      setError('Amount must be a positive number');
      toast.error('❌ Amount must be a positive number');
      return;
    }
    if (isNaN(payload.deliveryTime) || payload.deliveryTime <= 0) {
      setError('Delivery time must be a positive number');
      toast.error('❌ Delivery time must be a positive number');
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/gigs/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Gig updated:', res.data);
      toast.success('🎉 Gig updated successfully!');
      navigate('/gigs');
    } catch (err) {
      console.error('❌ Failed to update gig:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = err.response?.data?.message || 'Failed to update gig';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    }
  }, [formData, id, navigate, token]);

  if (loading) {
    return <div className="min-h-screen p-6 bg-gray-100 text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 text-center text-red-700">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-200"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-bold mb-6 text-gray-800">Edit Gig</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={5}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Price ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Delivery Time (days)</label>
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              name="images"
              className="mt-2"
            />
            {uploading && <p className="text-xs text-gray-500">Upload image...</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`Image ${i}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-1 text-red-600 hover:text-red-800"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              name="video"
              className="mt-2"
            />
            {formData.video && (
              <video controls className="w-64 mt-4 rounded-md">
                <source src={formData.video} type="video/mp4" />
              </video>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Update Gig
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditGig;





















/*
mport { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CLOUDINARY_UPLOAD_PRESET = 'workwithtrust_unsigned';
const CLOUDINARY_CLOUD_NAME = 'dfonkafln';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    deliveryTime: '',
    images: [],
    video: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      setError('Please log in to edit the gig.');
      toast.error('Please log in');
      navigate('/login');
      return;
    }
    if (user.role !== 'freelancer') {
      setError('Only freelancers can edit gigs.');
      toast.error('Only freelancers can edit gigs');
      navigate('/');
      return;
    }

    const fetchGig = async () => {
      try {
        console.log('Fetching gig:', id);
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Gig received:', res.data);
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          category: res.data.category || '',
          amount: res.data.amount || '',
          deliveryTime: res.data.deliveryTime || '',
          images: res.data.images || [],
          video: res.data.video || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        setError('Failed to load gig: ' + (err.response?.data?.message || err.message));
        toast.error('Failed to load gig');
        setLoading(false);
      }
    };

    fetchGig();
  }, [id, navigate, token, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploaded = [];
    let failed = false;
    setUploading(true);

    for (let file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          data
        );
        uploaded.push(res.data.secure_url);
      } catch (err) {
        console.error('Image upload failed:', err);
        failed = true;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));

    setUploading(false);
    if (uploaded.length > 0 && !failed) {
      toast.success('✅ All images uploaded successfully');
    } else if (uploaded.length > 0 && failed) {
      toast.warn('⚠️ Some images uploaded, but some failed');
    } else {
      toast.error('❌ All image uploads failed');
    }
  };
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success('🗑️ Image removed');
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        data
      );
      setFormData((prev) => ({
        ...prev,
        video: res.data.secure_url,
      }));
      toast.success('🎥 Video uploaded successfully!');
    } catch (err) {
      console.error('Video upload error:', err);
      toast.error('❌ Failed to upload video');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.amount || !formData.category || !formData.deliveryTime) {
      setError('All fields are required');
      toast.error('❌ All fields are required');
      return;
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      setError('Amount must be a positive number');
      toast.error('❌ Amount must be a positive number');
      return;
    }
    if (isNaN(formData.deliveryTime) || formData.deliveryTime <= 0) {
      setError('Delivery time must be a positive number');
      toast.error('❌ Delivery time must be a positive number');
      return;
    }

    try {
      console.log('Updating gig:', id , 'data:', formData);
      const res = await axios.put(
        `http://localhost:5000/api/gigs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Gig updated:', res.data);
      toast.success('Gig updated successfully');
      navigate('/gigs');
    } catch (err) {
      console.error('❌ Failed to update gig:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to update gig';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Gig</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Delivery Time (days)</label>
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            {formData.images.length > 0 && (
              <div key={idx} className="relative inline-block mr-2 mb-2">
                    <img
                      src={img}
                      alt={`Gig Image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full px-4 py-2 border rounded"
            />
            {formData.video && (
              <video controls className="w-64 mt-4 rounded">
                <source src={formData.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Update Gig
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditGig;



*/

















/*
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditGig = () => {
  const { id } = useParams(); // Get gig ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    deliveryTime: '',
    images:[],
    video:'',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch gig data
  /*
  useEffect(() => {
    let isMounted = true;

    const fetchGig = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User from localStorage:', user);
        console.log('Fetching gig:', id);
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('Gig received:', res.data);
        if (isMounted) {
          setFormData({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            amount: res.data.amount,
            deliveryTime: res.data.deliveryTime,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        if (isMounted) {
          setError('Failed to load gig. Please try again.');
          toast.error('Failed to load gig');
          setLoading(false);
        }
      }
    };

    fetchGig();
    return () => {
      isMounted = false;
    };
  }, [id]);

  */

  // Fetch user and gig data
  /*
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Get user from localStorage
        let storedUser;
        try {
          storedUser = JSON.parse(localStorage.getItem('user'));
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
          if (isMounted) {
            setError('Please log in to edit the gig.');
            toast.error('Please log in');
            navigate('/login');
          }
          return;
        }

        if (!storedUser || !storedUser.token) {
          console.error('No user or token found in localStorage:', storedUser);
          if (isMounted) {
            setError('Please log in to edit the gig.');
            toast.error('Please log in');
            navigate('/login');
          }
          return;
        }

        console.log('User from localStorage:', storedUser);
        console.log('Token from localStorage:', storedUser.token);
        if (isMounted) {
          setUser(storedUser);
        }

        // Fetch gig
        console.log('Fetching gig:', id);
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });
        console.log('Gig received:', res.data);
        if (isMounted) {
          setFormData({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            amount: res.data.amount,
            deliveryTime: res.data.deliveryTime,
            images:res.data.images || [], // Ensure images is an array
            video: res.data.video || '', // Ensure video is a string
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        if (isMounted) {
          setError('Failed to load gig: ' + (err.response?.data?.message || err.message));
          toast.error('Failed to load gig');
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);






  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Before axios.put in handleSubmit
  /*
console.log('FormData content:');
for (const [key, value] of data.entries()) {
  console.log(`${key}: ${value}`);
}
  */
  // Handle form submission
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user || !user.token) {
      console.error('No user or token in handleSubmit:', user);
      setError('Please log in to update the gig.');
      toast.error('Please log in');
      navigate('/login');
      return;
    }



    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('amount', formData.amount);
    data.append('deliveryTime', formData.deliveryTime);
    if (image) {
      data.append('image', image);
    }
    // Include video if updated (optional, depends on your backend)
    if (formData.video) {
      data.append('video', formData.video); // Only if backend accepts URL update
    }
    

    try {
      console.log('Updating gig:', id);
      const res = await axios.put(`http://localhost:5000/api/gigs/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    //console.log('fetching user:', JSON.parse(localStorage.getItem('user')));
      console.log('Gig updated:', res.data);
      // Update formData.images with the new image from the response
      setFormData((prev) => ({
        ...prev,
        images: res.data.images || prev.images,
        video:res.data.video || prev.video, // Update video if available
      }));
      toast.success('Gig updated successfully');
      navigate('/gigs');
    } catch (err) {
      console.error('Failed to update gig:', err);
      setError('Failed to update gig. Please try again.');
      toast.error('Failed to update gig');
    }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Gig</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Delivery Time (days)</label>
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded"
            />
       
            {formData.images.length > 0 && (
              <div className="mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative inline-block mr-2 mb-2">
                    <img
                      src={img}
                      alt={`Gig Image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.nextSibling.style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.nextSibling.style.display = 'none';
                      }}
                    />
                    {formData.video && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded"
                        style={{ display: 'none' }}
                      >
                        <button
                          onClick={() => {
                            const videoElement = document.getElementById(`video-${idx}`);
                            videoElement.play();
                          }}
                          className="text-white text-3xl"
                        >
                          ▶
                        </button>
                        <video
                          id={`video-${idx}`}
                          src={formData.video}
                          className="absolute inset-0 w-full h-full object-cover rounded hidden"
                          onEnded={() => (document.getElementById(`video-${idx}`).style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Update Gig
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditGig;
*/