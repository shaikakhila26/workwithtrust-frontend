
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CLOUDINARY_UPLOAD_PRESET = 'workwithtrust_unsigned';
const CLOUDINARY_CLOUD_NAME = 'dfonkafln';

const CreateGig = () => {
  console.log('📦 CreateGig page rendered');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deliveryTime: '',
    category: '',
    images: [],
    video: '',
  });
  const [uploading, setUploading] = useState(false);
  const [role, setRole] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token'); // Direct token retrieval

  useEffect(() => {
    if (!user || !token) {
      toast.error('🚫 Please log in to access this page.');
      navigate('/login');
    } else {
      setRole(user.role);
      if (user.role !== 'freelancer') {
        toast.warn('🚫 Only freelancers can create gigs. Setting role to freelancer.');
        handleSetRole();
      }
    }
  }, [navigate]);

  const handleSetRole = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/set-role',
        { role: 'freelancer' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.user.token);
      setRole('freelancer');
      toast.success('✅ Role updated to freelancer!');
    } catch (err) {
      console.error('❌ Error setting role:', err);
      toast.error('❌ Failed to set role: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!formData.title || !formData.description || !formData.amount || !formData.category || !formData.deliveryTime) {
      toast.error('❌ All fields are required');
      return;
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error('❌ Amount must be a positive number');
      return;
    }
    if (isNaN(formData.deliveryTime) || formData.deliveryTime <= 0) {
      toast.error('❌ Delivery time must be a positive number');
      return;
    }
    if (!token) {
      toast.error('⚠️ Please log in to create a gig.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/gigs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Gig created:', res.data);
      toast.success('🎉 Gig created successfully!');
      navigate('/gigs');
    } catch (err) {
      console.error('❌ Error creating gig:', err);
      toast.error(err.response?.data?.message || '❌ Failed to create gig');
    }
  };

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-emerald-600 mb-6">Create a New Gig</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Gig title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            rows={5}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g., Web Development)"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Price in USD"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            name="deliveryTime"
            placeholder="Delivery Time (in days)"
            value={formData.deliveryTime}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <h4 className="text-xl font-bold text-emerald-600 mb-6">Images</h4>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {formData.images.length > 0 && (
            <div className="mt-2">
              {formData.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gig Image ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded mr-2 mb-1 inline-block"
                />
              ))}
            </div>
          )}
          <h4 className="text-xl font-bold text-emerald-600 mb-6">Videos</h4>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="w-full mt-2"
          />
          {formData.video && (
            <video controls className="w-64 mt-4 rounded">
              <source src={formData.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition"
            disabled={role !== 'freelancer'}
          >
            Submit Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;

























/*
import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CLOUDINARY_UPLOAD_PRESET = 'workwithtrust_unsigned';
const CLOUDINARY_CLOUD_NAME = 'dfonkafln';


const CreateGig = () => {

  console.log("📦 CreateGig page rendered");


    const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // 🟡 Show loading until check completes

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
     if (!user) {
    alert("🚫 Please log in to access this page.");
    return <div className="text-center mt-10 text-lg text-gray-500">Redirecting...</div>;
    navigate('/login'); // Redirect to login
  } else if (user.role !== 'freelancer') {
    alert("🚫 Only freelancers can access this page.");
    return <div className="text-center mt-10 text-lg text-gray-500">Redirecting...</div>;
    navigate('/'); // Redirect to home or dashboard
  }
   }, []); 

  // Render nothing until role is checked
  //if (!authorized) return null;

  // ✅ existing JSX form continues here
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deliveryTime: '',
    category: '',
    images: [],
    video:'',
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploaded = [];
    let failed = false;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append('file', files[i]);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          data
        );
        uploaded.push(res.data.secure_url);
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error('❌ Image upload failed');
        failed=true;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
  
    }));

    setUploading(false);
    // ✅ Show only 1 toast based on result
  if (uploaded.length > 0 && !failed) {
    toast.success("✅ All images uploaded successfully");
  } else if (uploaded.length > 0 && failed) {
    toast.warn("⚠️ Some images uploaded, but some failed");
  } else {
    toast.error("❌ All image uploads failed");
  }
  };

  const handleVideoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      data
    );
    const videoUrl = res.data.secure_url;
    console.log("🎥 Cloudinary response:", res.data);


    // Save to your form data (assumes `video` field in formData)
    setFormData((prev) => ({
      ...prev,
      video: videoUrl,
    }));

    toast.success("🎥 Video uploaded successfully!");
  } catch (err) {
    console.error("Video upload error:", err);
    toast.error("❌ Failed to upload video");
  }
};









  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!formData.title || !formData.description || !formData.amount || !formData.category) {
      toast.error('❌ All fields are required');
      return;
    }
    if (isNaN(formData.amount)) {
      toast.error('❌ Price must be a number');
      return;
    }
    if (isNaN(formData.deliveryTime) || formData.deliveryTime <= 0) {
  toast.error('❌ Delivery time must be a valid number of days');
  return;
}


    try {
   // const token = localStorage.getItem('token');
      // Retrieve token from localStorage
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const token = user?.token;

      if (!token) {
        toast.error('⚠️ Please log in to create a gig.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/gigs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

console.log("Form data sending to backend:", formData);


      toast.success('🎉 Gig created successfully');
      // Optional: redirect or reset
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create gig');
    }
  };

const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'freelancer') return null;









  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-emerald-600 mb-6">Create a New Gig</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Gig title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            rows={5}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category (e.g., Web Development)"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Price in USD"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
  type="number"
  name="deliveryTime"
  placeholder="Delivery Time (in days)"
  value={formData.deliveryTime}
  onChange={handleChange}
  className="w-full border px-4 py-2 rounded"
  required
/>

   <h4 className="text-xl font-bold text-emerald-600 mb-6">Images </h4>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full"
          />
        
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
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
          <h4 className="text-xl font-bold text-emerald-600 mb-6">Videos</h4>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="w-full mt-2"
          />
          {formData.video && (
            <video controls className="w-64 mt-4 rounded hidden">
              <source src={formData.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
       




          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition"
          >
            Submit Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;













*/









/*const CreateGig = () => {

    const navigate = useNavigate();

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('Please login first');
    navigate('/login'); // redirect to login page
  } else if (user.role !== 'freelancer') {
    alert('Only freelancers can access this page');
    navigate('/'); // or navigate to another safe page
  }
}, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryTime: '',
    category: '',
    images: [''],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const newImages = [...formData.images];
    newImages[index] = e.target.value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/gigs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Gig created successfully!');
      console.log(res.data);
    } catch (err) {
      alert('❌ Failed to create gig');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Gig</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Gig Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="deliveryTime"
          placeholder="Delivery Time (in days)"
          value={formData.deliveryTime}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {formData.images.map((img, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Image URL ${index + 1}`}
            value={img}
            onChange={(e) => handleImageChange(e, index)}
            className="w-full border p-2 rounded"
          />
        ))}

        <button
          type="button"
          onClick={addImageField}
          className="text-blue-500 underline text-sm"
        >
          + Add more images
        </button>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full"
        >
          Create Gig
        </button>
      </form>
    </div>
  );
};

export default CreateGig;
*/