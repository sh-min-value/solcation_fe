import { useEffect, useState } from 'react';
import { notificationEmitter } from '../utils/EventEmitter';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    // 알림 이벤트 구독
    const unsubscribe = notificationEmitter.on('alarm', data => {
      console.log('useNotification: 알림 수신', data);
      setNotification(data);
      setNotificationList([data]);
      console.log(notificationList);
    });

    return unsubscribe;
  }, []);

  const clearNotification = () => {
    setNotification(null);
  };

  const clearNotificationList = () => {
    setNotificationList([]);
  };

  const removeNotificationFromList = pnPk => {
    setNotificationList(prev => prev.filter(noti => noti.pnPk !== pnPk));
  };

  return {
    notification,
    notificationList,
    clearNotification,
    clearNotificationList,
    removeNotificationFromList,
  };
};
