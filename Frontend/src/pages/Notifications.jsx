import React, { useEffect, useState } from 'react';
import { Heart, UserPlus, MessageCircle, PlaySquare } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Notifications() {
  const { user } = useUser();
  const socket = useSocket();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/api/notifications/${user.id}`)
        .then(res => {
          setNotifications(res.data.notifications || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching notifications", err);
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handler = (notif) => {
        setNotifications(prev => [notif, ...prev]);
      };
      socket.on('receive_notification', handler);
      return () => socket.off('receive_notification', handler);
    }
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch(err) {}
  };

  const getIconData = (type) => {
    switch(type) {
      case 'like': return { icon: Heart, color: 'text-red-500 bg-red-100 dark:bg-red-950/30' };
      case 'comment': return { icon: MessageCircle, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/30' };
      case 'follow': return { icon: UserPlus, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-950/30' };
      case 'message': return { icon: MessageCircle, color: 'text-green-500 bg-green-100 dark:bg-green-950/30' };
      default: return { icon: Heart, color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800' };
    }
  };

  // Build notification text dynamically so it can be translated
  const getNotificationText = (notif) => {
    const senderName = notif.sender?.username || t('Someone');
    switch(notif.type) {
      case 'like':
        return `${senderName} ${t('liked your post.')}`;
      case 'comment':
        return `${senderName} ${t('commented on your post.')}`;
      case 'follow':
        return `${senderName} ${t('started following you.')}`;
      case 'message':
        return `${senderName} ${t('sent you a message.')}`;
      default:
        return notif.text || t('New notification');
    }
  };

  const getLinkTarget = (notif) => {
    if (notif.type === 'message') return '/messages';
    if (notif.type === 'follow') return `/profile/${notif.sender?.clerkId}`;
    return `/profile/${notif.sender?.clerkId}`; // Basic fallback
  };

  return (
    <div className="w-full">
      <div className="bg-card rounded-xl border p-6 text-card-foreground">
        <h2 className="text-2xl font-bold mb-6">{t('Notifications')}</h2>
        {loading ? (
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-16 bg-muted/50 rounded-lg"></div>
            <div className="h-16 bg-muted/50 rounded-lg"></div>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{t('No notifications yet.')}</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => {
              const { icon: Icon, color } = getIconData(notif.type);
              return (
                <Link 
                  key={notif._id} 
                  to={getLinkTarget(notif)}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  className={`flex items-center gap-4 p-4 rounded-lg transition border border-transparent ${notif.isRead ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/70 border-indigo-500/20 shadow-sm hover:bg-muted'}`}
                >
                  <div className={`p-2 rounded-full ${color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${notif.isRead ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                      {getNotificationText(notif)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
