

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileImageUploader from '../components/ProfileImageUploader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://workwithtrust-backend.onrender.com/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setEditedUser(res.data); // clone user into editedUser
      } catch (err) {
        console.error("error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

/*
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("token:", token);
      const response = await axios.put(
        `http://localhost:5000/api/users/update`,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };
  */
 const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `https://workwithtrust-backend.onrender.com/api/users/${user._id}`,
      editedUser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Refetch the full profile to update state properly
    const refreshed = await axios.get("https://workwithtrust-backend.onrender.com/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setUser(refreshed.data);
      setEditedUser(refreshed.data); // Update editedUser with the latest data
      setIsEditing(false);
    }
  } catch (err) {
    console.error("Failed to save profile:", err.response?.data || err.message);
  }
};



  if (!user) {
    return <div className="text-gray-600 text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff6f5] to-[#e3f9f8] flex items-center justify-center p-6">
      <div className="bg-[#1c2a49]/60 text-white w-[600px] max-w-5xl rounded-2xl shadow-lg p-8 grid md:grid-cols-3-row-2 gap-8">
        <h1 className="text-3xl font-bold text-center">My Profile</h1>
        {/* Profile Image + Name */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-34 h-34 rounded-full border-4 border-blue-400 overflow-hidden shadow-md">
          <ProfileImageUploader user={user} setUser={setUser} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">{user.name}</h2>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-3 text-sm md:text-base text-center">
  {!isEditing ? (
    <>
      <p><span className="font-medium text-blue-950 font-extrabold">Email:</span> {user.email}</p>
      <p><span className="font-medium text-blue-950 font-extrabold">Role:</span> {user.role}</p>
      <p><span className="font-medium text-blue-950 font-extrabold">Bio:</span> {user.bio || 'No bio yet'}</p>
      <p><span className="font-medium text-blue-950 font-extrabold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-fit mx-auto"
      >
        Edit Profile
      </button>
    </>
  ) : (
    <>
      <div>
        <label className="block text-gray-400">Name</label>
        <input
          type="text"
          value={editedUser.name}
          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
        />
      </div>
      <div>
        <label className="block text-gray-400">Bio</label>
        <textarea
          value={editedUser.bio}
          onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
          rows="3"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditedUser(user); // revert
            setIsEditing(false);
          }}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </>
  )}
</div>

      </div>

      
    </div>
  );
};

export default Profile;



























// src/pages/Profile.jsx
/*
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ProfileImageUploader from '../components/ProfileImageUploader';
import { FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    bio: user.bio || '',
    joinedDate: user.joinedDate || new Date().toLocaleDateString(),
  });

  // This will handle uploading the image
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedImage(URL.createObjectURL(file)); // Temporary preview
    uploadImageToServer(file);
  }
};

const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:5000/api/users/upload-profile-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      // Save the new image URL to user object
      setUser((prev) => ({ ...prev, image: data.imageUrl }));
      localStorage.setItem('user', JSON.stringify({ ...user, image: data.imageUrl }));
      toast.success('Profile picture updated!');
    } else {
      toast.error('Upload failed');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error uploading image');
  }
};

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedUser),
      });
      const updatedUser = await response.json();
      if (response.ok) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        <div className="bg-[#1E1E1E] rounded-2xl p-6 text-center shadow-lg">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-700 mb-4">
            <img
              src={user.image || selectedImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="object-cover w-full h-full"
            />
            <label className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
  </label>
          </div>
          <h2 className="text-2xl font-semibold">{user.name || 'Unnamed User'}</h2>
          
        </div>

        
        <div className="bg-[#1E1E1E] rounded-2xl p-6 shadow-lg">
          {!isEditing ? (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span>{user.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span>{user.role || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bio:</span>
                <span>{user.bio || 'No bio yet'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Joined:</span>
                <span>{editedUser.joinedDate}</span>
              </div>
              

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400">Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400">Bio</label>
                <textarea
                  rows="3"
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 w-full py-2 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-600 hover:bg-red-700 w-full py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        
        <div className="md:col-span-2 mt-6 bg-[#1E1E1E] rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Social Media</h3>
          <div className="flex gap-6 text-2xl text-gray-400">
            <a href="#" className="hover:text-red-500"><FaYoutube /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTiktok /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


*/






















// src/pages/Profile.jsx
/*
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
  // Get user from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    bio: user.bio || '',
    joinedDate: user.joinedDate || new Date().toLocaleDateString(),
  });

  // Mock API call to update user (replace with actual backend endpoint)
  const handleSave = async () => {
    try {
      // Simulate API call
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedUser),
      });
      const updatedUser = await response.json();
      if (response.ok) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">👤 My Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center overflow-hidden">
            <span className="text-gray-600 text-lg">📷</span>
            
          </div>
          <h2 className="text-xl font-semibold text-gray-700">{user.name || 'N/A'}</h2>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-800">{user.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="text-gray-800">{user.role || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bio:</span>
              <span className="text-gray-800">{user.bio || 'No bio yet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Joined:</span>
              <span className="text-gray-800">{editedUser.joinedDate}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600">Bio</label>
              <textarea
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;



*/







// src/pages/Profile.jsx
/*
import React from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile</h1>

      {user ? (
        <div className="bg-white p-6 rounded shadow-md max-w-md">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p className="text-gray-500">User not found. Please log in again.</p>
      )}
    </div>
  );
};

export default Profile;
*/
