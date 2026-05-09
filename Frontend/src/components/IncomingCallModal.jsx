import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function IncomingCallModal() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      // data: { roomId, callerName, callerImageUrl }
      setIncomingCall(data);
      
      // Optional: Auto dismiss after 30 seconds
      setTimeout(() => {
        setIncomingCall(null);
      }, 30000);
    };

    socket.on('incoming_call', handleIncomingCall);

    return () => {
      socket.off('incoming_call', handleIncomingCall);
    };
  }, [socket]);

  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const declineCall = () => {
    setIncomingCall(null);
  };

  return (
    <AnimatePresence>
      {incomingCall && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm"
        >
          <div className="bg-white/80 dark:bg-[#1a1a1e]/90 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full mb-4 overflow-hidden ring-4 ring-indigo-500/30">
              <img src={incomingCall.callerImageUrl || 'https://via.placeholder.com/80'} alt="caller" className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-xl font-bold dark:text-white mb-1">{incomingCall.callerName}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex items-center justify-center gap-2">
              <Video className="w-4 h-4 text-indigo-500 animate-pulse" /> {t('Incoming Video Call...')}
            </p>
            
            <div className="flex gap-8 w-full justify-center">
              <button 
                onClick={declineCall} 
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-110 transition active:scale-95"
                title={t('Decline')}
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              
              <button 
                onClick={acceptCall} 
                className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition active:scale-95 animate-bounce"
                title={t('Accept')}
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
