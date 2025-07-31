import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    console.log('📝 Stored user:', storedUser);
    console.log('📝 Stored token:', storedToken);

    if (!storedUser || !storedToken) {
      console.error('❌ No user or token found');
      toast.error('Please log in');
      navigate('/login');
      return;
    }
    setUser(storedUser);
    setToken(storedToken);

    // Initialize Socket.IO
    socketRef.current = io(backendBase, {
      auth: { token: storedToken },
    });
    socketRef.current.on('connect', () => {
      console.log('🔌 Socket connected:', socketRef.current.id);
      socketRef.current.emit('joinRoom', storedUser._id);
    });
    socketRef.current.on('receiveMessage', (data) => {
      console.log('📬 New message received:', data);
      if (data.sender._id === selectedUser?._id || data.receiver._id === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
      toast.info(`New message from ${data.sender.name}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setUnreadCounts((prev) => ({
        ...prev,
        [data.sender._id]: (prev[data.sender._id] || 0) + (data.sender._id === selectedUser?._id ? 0 : 1),
      }));
    });
    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    return () => {
      socketRef.current.disconnect();
      console.log('🔌 Socket disconnected');
    };
  }, [navigate, selectedUser]);

  useEffect(() => {
    if (!user || !token) return;

    const fetchChatUsers = async () => {
      try {
        console.log('📤 Fetching chat users for:', user._id);
        const res = await axios.get(`${backendBase}/api/messages/chat-users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('✅ Chat users fetched:', res.data);
        setChatUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Failed to fetch chat users:', err.response?.data);
        toast.error('Failed to load chat users');
      }
    };

    fetchChatUsers();
  }, [user, token]);

  useEffect(() => {
    if (!selectedUser || !token) return;

    const fetchMessages = async () => {
      try {
        console.log('📤 Fetching messages for user:', selectedUser._id);
        const res = await axios.get(`${backendBase}/api/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('✅ Messages fetched:', res.data);
        setMessages(Array.isArray(res.data) ? res.data : []);
        // Reset unread count for selected user
        setUnreadCounts((prev) => ({ ...prev, [selectedUser._id]: 0 }));
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err.response?.data);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: newMessage,
    };

    try {
      console.log('📤 Sending message:', msg);
      const res = await axios.post(`${backendBase}/api/messages`, msg, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Message sent:', res.data);
      setMessages((prev) => [...prev, res.data]);
      socketRef.current.emit('send-message', res.data);
      setNewMessage('');
    } catch (err) {
      console.error('❌ Send message error:', err.response?.data);
      toast.error('Failed to send message');
    }
  };

return (
  <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-emerald-50 to-white">
    {/* Sidebar */}
    <div className="w-full md:w-1/3 bg-white rounded-none md:rounded-xl shadow-md p-4 overflow-y-auto h-1/2 md:h-full">
      <h2 className="text-xl font-semibold mb-4 text-emerald-700">Chats</h2>
      {chatUsers.length === 0 ? (
        <div className="text-gray-500 text-sm">No users you've chatted with yet</div>
      ) : (
        chatUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`cursor-pointer p-3 rounded-md mb-2 ${
              selectedUser?._id === u._id ? 'bg-emerald-100' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{u.name || u.email}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
              </div>
              {unreadCounts[u._id] > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCounts[u._id]}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Chat Box */}
    <div className={`w-full md:w-2/3 bg-white rounded-none md:rounded-xl shadow-md p-4 flex flex-col h-full ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
      {selectedUser ? (
        <>
          <h2 className="text-lg font-bold mb-4 text-emerald-700">
            Chat with {selectedUser.name || selectedUser.email}
          </h2>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender._id.toString() === user._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender._id.toString() === user._id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center flex-1 flex items-center justify-center">
          Select a user to start chatting 💬
        </div>
      )}
    </div>
  </div>
);

};

export default Messages;























/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {io} from 'socket.io-client';


const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});


const Messages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const backendBase = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user || !user._id) {
      console.error('No user found in localStorage');
      navigate('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setChatUsers(Array.isArray(res.data) ? res.data : []);
        console.log("🧍‍♀️ Chat users fetched:", res.data);
      } catch (err) {
        console.error('Failed to load chat users:', err);
      }
    };

    fetchChats();
  }, [user, navigate]);

    useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      console.log("📥 Message received via socket:", data);
      if (data.senderId === selectedUser?._id || data.receiverId === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receiveMessage', handleMessage);
    return () => socket.off('receiveMessage', handleMessage);
  }, [socket, selectedUser]);


  useEffect(() => {

    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/messages/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: newMessage,
    };

    try {
      const res = await axios.post(`${backendBase}/api/messages`, msg, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages((prev) => [...prev, res.data]);
      socket.emit('send-message', res.data);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {chatUsers.length === 0 && (
          <div className="text-gray-500 text-sm">No users you've chatted with yet</div>
        )}
        {Array.isArray(chatUsers) && chatUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`cursor-pointer p-2 rounded-md mb-2 ${
              selectedUser?._id === u._id ? 'bg-purple-100' : 'hover:bg-gray-100'
            }`}
          >
            {u.name || u.email}
          </div>
        ))}
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-bold mb-2 text-purple-700">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1 border rounded p-3 overflow-y-auto bg-white mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.senderId === user._id ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.senderId === user._id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 mt-12 text-center">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;







*/















// src/pages/Messages.jsx
/*
import React, { useEffect, useState, useContext } from 'react';
import  AuthContext  from '../context/AuthContext';
import  SocketContext  from '../context/SocketContext'; // Assuming you're using context for socket
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Messages = () => {
  const { currentUser: user } = useContext(AuthContext);

  const  socket  = useContext(SocketContext);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 🔃 Load users you've chatted with
  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user._id) return; // 🛑 Prevent if user is not ready
      try {
        const res = await axios.get(`/api/messages/chat-users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`, //equired for `protect` middleware
            },
          }
        );
        
        setChatUsers(res.data);
          console.log("🧍‍♀️ Chat users fetched:", res.data);
      } catch (err) {
        console.error('Failed to load chat users:', err);
      }
    };
    if(user){
    fetchChats();
    console.log("👤 Current user:", user);

    }
  }, [user]);





  // 🔃 Load chat with selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${selectedUser._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // ✅ Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      console.log("📥 Message received via socket:", data);
      if (data.sender === selectedUser?._id || data.receiver === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [socket, selectedUser]);

  // 📤 Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msg = {
      sender: user._id,
      receiver: selectedUser._id,
      content: newMessage,
      timestamp: new Date(),
    };

    try {
      await axios.post('/api/messages', msg);
      socket.emit('sendMessage', msg); // emit to backend
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };



  return (
    <div className="flex h-screen">
     
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {chatUsers.length === 0 && (
  <div className="text-gray-500 text-sm">No users you've chatted with yet</div>
)}

        {Array.isArray(chatUsers) && chatUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`cursor-pointer p-2 rounded-md mb-2 ${
              selectedUser?._id === u._id ? 'bg-purple-100' : 'hover:bg-gray-100'
            }`}
          >
           {u.username || u.name || u.email}

          </div>
        ))}
      </div>

     
      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-bold mb-2 text-purple-700">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1 border rounded p-3 overflow-y-auto bg-white mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.sender === user._id ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.sender === user._id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 mt-12 text-center">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
*/