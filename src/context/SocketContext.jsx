
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = localStorage.getItem('token') || user?.token;
  const userId = user?._id;

  useEffect(() => {
    if (!token) {
      console.error('❌ No token available, socket connection aborted');
      return;
    }

    const s = io('https://workwithtrust-backend.onrender.com', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      console.log('✅ Connected to socket server');
      if (userId) s.emit('joinRoom', userId);
    };

    const handleDisconnect = (reason) => {
      console.log('❌ Disconnected from socket server, reason:', reason);
    };

    const handleError = (error) => {
      console.error('❌ Socket error:', error.message);
    };

    const handleConnectError = (error) => {
      console.error('❌ Socket connect_error:', error.message);
    };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);
    s.on('error', handleError);
    s.on('connect_error', handleConnectError);

    // Set socket on connection
    s.on('connect', () => setSocket(s));

    // Cleanup
    return () => {
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.off('error', handleError);
      s.off('connect_error', handleConnectError);
      if (s.connected) s.disconnect();
    };
  }, [token, userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;















// src/context/SocketContext.js
/*
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

 
export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext); // Hook to access socket

 //ort const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  // Retrieve token from user object in localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = user?.token;

  const userId = user?._id ;// Ensure userId is available



  useEffect(() => {

  //Abort if no token is available
    if (!token) {
      console.error('❌ No token available, socket connection aborted');
      return;
    }

    const s = io('http://localhost:5000' , {
  auth: {
    token: token,
  },
  transports: ['websocket' , 'polling'], // Use WebSocket and polling transports
  reconnection: true, // Enable reconnection
      reconnectionAttempts: 5,//Limit retries
      reconnectionDelay: 1000, // Delay between retries
}
    ); // your backend

    // Log when connected
  s.on('connect', () => {
    console.log("✅ Connected to socket server");
    if (userId) {
        s.emit('joinRoom', userId);
      }
  });
 console.log('User', userId, 'joined room:', userId);

    s.on('connect_error', (error) => {
      console.error('❌ Socket connect_error:', error.message);
    });
    setSocket(null);

    s.on('disconnect', (reason) => {
      console.log('❌ Disconnected from socket server, reason:', reason);
    });
    setSocket(null);

    s.on('error', (error) => {
      console.error('❌ Socket error:', error.message);
    });

    // Set socket only after successful connection
    s.on('connect', () => setSocket(s));

    // Cleanup
    return () => {
      if (s.connected) s.disconnect();
    };
  }, [token, userId]); // Re-run if token or userId changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; // 👈 default export

*/