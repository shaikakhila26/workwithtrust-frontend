import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const backendBase = import.meta.env.VITE_BACKEND_URL;

  const fetchMessages = async () => {
    if (!selectedUser || !userId) return;

    try {
      const res = await axios.get(`${backendBase}/api/messages/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Fetching messages failed:', error);
    }
  };

  const sendMessage = async () => {
    if (!content || !selectedUser || !userId) return;

    try {
      const res = await axios.post(
        `${backendBase}/api/messages`,
        {
          senderId: userId,
          receiverId: selectedUser._id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages(prev => [...prev, res.data]);
      setContent('');
    } catch (error) {
      console.error('Sending message failed:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="w-2/3 p-4 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 flex flex-col justify-between">
      <div className="flex-1 overflow-y-scroll mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 max-w-xs rounded ${
              msg.senderId === userId || msg.sender?._id === userId
                ? 'ml-auto bg-blue-200 text-right'
                : 'mr-auto bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type message..."
          className="flex-1 border rounded p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;





















/*
import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.get(`/api/messages/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Fetching messages failed:', error);
    }
  };

  const sendMessage = async () => {
    if (!content || !selectedUser) return;

    try {
      await axios.post(
        '/api/messages',
        {
          receiverId: selectedUser._id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setContent('');
      fetchMessages(); // refresh chat
    } catch (error) {
      console.error('Sending message failed:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="w-2/3 p-4 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 flex flex-col justify-between">
      <div className="flex-1 overflow-y-scroll mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 max-w-xs rounded ${
              msg.sender === userId || msg.sender?._id === userId

                ? 'ml-auto bg-blue-200 text-right'
                : 'mr-auto bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Type message..."
          className="flex-1 border rounded p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
*/