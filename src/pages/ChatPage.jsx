import { useState, useEffect,useRef } from "react";
import { useLocation , useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatBox from '../components/ChatBox';
import axios from "axios";
import { io } from 'socket.io-client';


    const socket = io('http://localhost:5000', {
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
        const res = await axios.get(`${backendBase}/api/users`, {
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
    const res = await axios.get(`${backendBase}/api/messages/${receiverId}`, {
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
    const res = await axios.post(`${backendBase}/api/messages`, messageData,{
       
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4">
        <h2 className="font-bold mb-4">Contacts</h2>
        {contacts.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            {user.name}
          </div>
        ))}
        <p className="text-sm text-gray-500">Selected user: {selectedUser?.name||'None'}</p>
        
      </div>

      {/* Chat area */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-scroll border p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.sender === userId || msg.sender?._id === userId? 'text-right' : 'text-left'}`}>
              <span className="px-3 py-2 bg-blue-200 inline-block rounded">{msg.content}</span>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!selectedUser}
            placeholder={selectedUser ? "Type your message..." : "Select a contact to start"}
            className="border flex-1 p-2 rounded"
          />
          <button onClick={sendMessage} 
          disabled={!selectedUser}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
