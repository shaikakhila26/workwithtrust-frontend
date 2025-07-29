import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // ✅ MUST be imported here
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext'; // Only if you use AuthContext

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
    <App />
     </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
