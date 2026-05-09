import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Connect to Socket.io server
      const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');
      
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        // Join personal room for messages
        newSocket.emit('join_chat', user.id);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, isLoaded]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
