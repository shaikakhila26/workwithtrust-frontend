import { useRef, useState,useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify';


const ProfileImageUploader = ({ user, setUser }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  // ✅ Step 1: Load image from user OR localStorage on mount
  useEffect(() => {
    if (user?.profileImage) {
      setPreview(user.profileImage);
    } else {
      const storedImage = localStorage.getItem('profileImage');
      if (storedImage) {
        setPreview(storedImage);
      } else {
        setPreview('/default-avatar.png'); // fallback
      }
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('https://workwithtrust-backend.onrender.com/api/users/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.imageUrl) {
            const newImage = res.data.imageUrl;

        // ✅ Step 2: update state and localStorage
      
        const updatedUser = {
            ...user,
            profileImage: newImage,
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('profileImage', newImage);
                    setPreview(newImage);

        toast.success('Profile image updated successfully!');

}

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="relative group">
      <div
        className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden relative cursor-pointer"
        onClick={triggerFileSelect}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-sm">
            Uploading...
          </div>
        ) : preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover justify-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-800">
            No Image Yet
          </div>
        )}

        <div className="absolute bottom-1 right-1 bg-gray-900 p-1 rounded-full group-hover:opacity-100 opacity-0 transition-opacity">
          <FaPen className="text-white text-xs" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUploader;





















// components/ProfileImageUploader.jsx
/*
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Pencil } from 'lucide-react';

const ProfileImageUploader = ({ user, setUser }) => {
  const [preview, setPreview] = useState(user?.image || '/default-avatar.png');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/upload-profile-image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { imageUrl } = response.data;

      // Update frontend state
      setUser((prev) => ({ ...prev, image: imageUrl }));
      setPreview(imageUrl);

      toast.success('Profile picture updated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32">
      <img
        src={preview}
        alt="Profile"
        className="rounded-full w-32 h-32 object-cover border-4 border-gray-700"
      />

      <label className="absolute bottom-1 right-1 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full cursor-pointer transition duration-200">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Pencil size={16} />
      </label>

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm rounded-full">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
*/