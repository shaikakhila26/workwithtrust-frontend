import { useState, useEffect,useRef } from "react";
import { useLocation , useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatBox from '../components/ChatBox';
import axios from "axios";
import { io } from 'socket.io-client';


    const socket = io('https://workwithtrust-backend.onrender.com', {
  auth: {
    token: localStorage.getItem('token') ,
  },
}

    ); // Backend URL

const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const messageEndRef = useRef(null);


const backendBase = import.meta.env.VITE_BACKEND_URL;
 const user = JSON.parse(localStorage.getItem("user")); // ✅ full object
  const userId = user?._id;




const handleUserClick = (user) => {
    console.log("User clicked:", user); // Debug log
  setSelectedUser(user); // ✅ Save the whole user object
  setMessages([]);       // Optional: reset chat window
  fetchMessages(user._id);        // ✅ Load new chat messages
};


  // Read userId from query string (like /chat?userId=xxxx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromQuery = params.get("userId");

    if (userIdFromQuery && contacts.length >0 ){
      const matchedUser = contacts.find((user) => user._id === userIdFromQuery);
      if (matchedUser) {
         handleUserClick(matchedUser); // Set selected user and fetch messages
      }
    
    }
  }, [location.search,contacts]);
  // Fetch list of users you've chatted with
useEffect(() => {
    if (!userId) {
      console.error('No user ID found in localStorage');
      alert("Please log in again.");
      return;
    }

    const fetchContacts = async () => {
      try {
        const url = `${backendBase}/api/users`;
        console.log("fetching contacts from :",url);
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (Array.isArray(res.data)) {
          setContacts(res.data);
          console.log("Contacts fetched:", res.data);
        } else {
          console.warn("Unexpected response format:", res.data);
          setContacts([]);
        }
      }
        catch (err) {
        console.error("❌ Error fetching users:", err);
        alert("Failed to load contacts. Please log in again.");
      }
    };

    fetchContacts();
  }, [userId , navigate]);


  const fetchMessages = async (receiverId) => {
    if (!receiverId) {
    console.warn("❌ fetchMessages: invalid user");
    return;
  }
    console.log("👉 Fetching messages with:", receiverId); // ✅ Debug log
    //setSelectedUser(user);
    try {
      const url = `${backendBase}/api/messages/${receiverId}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });


    setMessages(Array.isArray(res.data) ? res.data : []);
    console.log("📩 Received messages:", res.data);
   
    setTimeout(() => {
  const chatBox = document.querySelector('.overflow-y-scroll');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}, 100);

  } catch (err) {
    console.error("Error fetching messages:", err);
    setMessages([]); // fallback
  }

  };





  useEffect(() => {
  if (!socket) return;

  const handleMessage = (data) => {
    console.log("📥 Message received via socket:", data);

    // Show message only if it's for the currently selected chat
    if (
      data.sender === selectedUser?._id ||
      data.receiver === selectedUser?._id
    ) {
      setMessages(prev => [...prev, data]);
    }
  };

  socket.on('receiveMessage', handleMessage);

  return () => {
    socket.off('receiveMessage',handleMessage);
  };
}, [socket, selectedUser]);



  

  const sendMessage = async () => {
   

    if (!selectedUser || !selectedUser._id ) {
        console.warn("❌ selectedUser is missing, cannot send.");
    alert("Please select a user to chat with.");
    return;
  }


  // Make sure content is not empty
  if (!content.trim()) {
    alert("Message content cannot be empty.");
    return;
  }

     

  if (!userId) {
    console.warn("❌ senderId is missing");
    alert("User not authenticated. Please login again.");
    return;
  }
  const messageData = {
      senderId: userId,
      receiverId: selectedUser._id,
      content,
    };



  console.log("📤 Sending message to:", selectedUser._id);
  console.log("📝 Message content:", content);
try{
  const url = `${backendBase}/api/messages`;
    const res = await axios.post(url, messageData,{
       
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const savedMessage = res.data;

    // Add to local message state
      setMessages(prev => [...prev, savedMessage]);

    setContent("");

    // ✅ Emit message via socket
      socket.emit('send-message', savedMessage);
    //fetchMessages(selectedUser._id);
  

  // Optional: scroll to bottom
      setTimeout(() => {
        const chatBox = document.querySelector('.overflow-y-scroll');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100); 
    }
  catch(error){
    console.error("❌ Error sending message:", error);
    alert("Failed to send message. Please try again."); 
  }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-purple-100">
  {/* Sidebar */}
  <div className="w-full md:w-1/3 border-r bg-white shadow-md overflow-y-auto">
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold text-purple-700">Your Contacts</h2>
    </div>
    {contacts.length === 0 && (
      <p className="text-sm text-gray-500 p-4">No contacts yet</p>
    )}
    {contacts.map((user) => (
      <div
        key={user._id}
        onClick={() => handleUserClick(user)}
        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-purple-50 ${
          selectedUser?._id === user._id ? "bg-purple-100" : ""
        }`}
      >
        <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-800">{user.name}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Chat area */}
  <div className="w-full md:w-2/3 flex flex-col">
    {/* Header */}
    <div className="p-4 border-b bg-white shadow">
      <h3 className="text-lg font-semibold text-purple-700">
        {selectedUser ? `Chat with ${selectedUser.name}` : "Select a contact"}
      </h3>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-white to-purple-50">
      {messages.map((msg, idx) => {
        const isOwn = msg.sender === userId || msg.sender?._id === userId;
        return (
          <div
            key={idx}
            className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                isOwn
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef}></div>
    </div>

    {/* Input */}
    <div className="p-4 bg-white border-t flex items-center gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!selectedUser}
        placeholder={
          selectedUser ? "Type your message..." : "Select a contact to start"
        }
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
      />
      <button
        onClick={sendMessage}
        disabled={!selectedUser}
        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition disabled:opacity-50"
      >
        Send
      </button>
    </div>
  </div>
</div>

  );
};

export default ChatPage;
