import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatSidebar = ({ setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const backendBase = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/messages/chat-users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
        console.log("Chat users fetched:", res.data);
      } catch (err) {
        console.error('Contacts fetch error:', err);
      }
    };

    fetchUsers();
  }, [userId]);

  return (
    <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;











/*
import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatSidebar = ({ setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const backendBase = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // You must create this route to return potential chat contacts
    axios
      .get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Contacts fetch error:', err));
  }, []);

  return (
    <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user)}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
*/