import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Send, Phone, Video, Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const DMPage = () => {
  const socket = useSocket();
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        // filter out ourselves
        setUsers(res.data.users.filter(u => u.clerkId !== user?.id));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    if (user?.id) fetchUsers();
  }, [user?.id]);

  // Fetch messages if target user changes
  useEffect(() => {
    if (!targetUser || !user?.id) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages/${targetUser._id}?clerkId=${user.id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [targetUser, user?.id]);

  useEffect(() => {
    if (!socket) return;
    
    // Listen for incoming messages
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    // Listen for confirmation of sent messages
    socket.on('message_sent', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !targetUser) return;

    socket.emit('send_message', {
      senderId: user.id,
      targetUserId: targetUser.clerkId,
      content: input,
      tempId: Date.now().toString()
    });
    
    setInput('');
  };

  const startVideoCall = () => {
    if (!targetUser) return;
    // Create a room ID based on both users so it's consistent
    const roomId = [user.id, targetUser.clerkId].sort().join('-');
    
    // Notify the target user
    if (socket) {
      socket.emit('call_user', {
        targetUserId: targetUser.clerkId,
        roomId,
        callerName: user.username || user.firstName || 'A user',
        callerImageUrl: user.imageUrl
      });
    }

    navigate(`/call/${roomId}`);
  };

  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white/70 dark:bg-black/40 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-neutral-200/50 dark:border-neutral-800/50 p-4 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold dark:text-white mb-6">{t('Messages')}</h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('Search friends...')} 
            className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-[#1a1a1a] rounded-xl pl-10 pr-4 py-2.5 outline-none dark:text-white transition-all shadow-inner"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredUsers.map((u) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={u._id}
              onClick={() => setTargetUser(u)}
              className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors ${targetUser?._id === u._id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'hover:bg-neutral-100 dark:hover:bg-white/5 dark:text-white'}`}
            >
              <img src={u.imageUrl || 'https://via.placeholder.com/40'} alt={u.username} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
              <div>
                <p className="font-semibold">{u.username}</p>
                <p className={`text-xs ${targetUser?._id === u._id ? 'text-indigo-100' : 'text-neutral-500'}`}>{t('Tap to chat')}</p>
              </div>
            </motion.div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-center text-sm text-neutral-500 mt-10">{t('No users found.')}</p>
          )}
        </div>
      </div>
      
      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white/50 dark:bg-[#0a0a0c]/80 relative z-0">
        {targetUser ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center space-x-3">
                 <img src={targetUser.imageUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800" alt="avatar" />
                 <div>
                    <h3 className="font-bold dark:text-white leading-tight">{targetUser.username}</h3>
                    <p className="text-xs text-green-500 font-medium">{t('Online')}</p>
                 </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2.5 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition">
                  <Phone size={20} />
                </button>
                <button onClick={startVideoCall} className="p-2.5 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition">
                  <Video size={20} />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-8 custom-scrollbar scroll-smooth">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id || msg.tempId || idx} 
                    className={`flex ${msg.sender?.clerkId === user?.id || msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`px-5 py-3 text-[15px] shadow-sm max-w-[70%] ${msg.sender?.clerkId === user?.id || msg.senderId === user?.id ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl rounded-br-sm' : 'bg-white dark:bg-[#1a1a1e] border border-neutral-100 dark:border-neutral-800 dark:text-white rounded-3xl rounded-bl-sm'}`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {messages.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 space-y-3">
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2">
                    <MessageCircle className="w-10 h-10 text-indigo-500" />
                  </div>
                  <p className="font-medium text-lg dark:text-neutral-300">{t('Say hello!')}</p>
                  <p className="text-sm">{t('Start the conversation with')} {targetUser.username}</p>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-md border-t border-neutral-200/50 dark:border-neutral-800/50 pb-6">
              <form onSubmit={sendMessage} className="flex gap-3 items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('Type your message...')} 
                  className="flex-1 rounded-2xl px-5 py-3.5 bg-neutral-100/80 dark:bg-[#151515] dark:text-white border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center disabled:opacity-50 hover:scale-105 active:scale-95"
                  disabled={!input.trim()}
                >
                  <Send size={20} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-transparent to-white/50 dark:to-black/20">
            <div className="w-32 h-32 mb-6 opacity-20 dark:opacity-30">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-indigo-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold dark:text-white mb-2">{t('Your Messages')}</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm">{t('Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DMPage;
