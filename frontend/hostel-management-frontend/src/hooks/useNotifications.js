import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/index.js';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getMine();
      setNotifications(res.data.data.notifications);
      setUnread(res.data.data.unread);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetch]);

  return { notifications, unread, loading, refetch: fetch, markAllRead };
};

export default useNotifications;