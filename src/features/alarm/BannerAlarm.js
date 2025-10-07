import React from 'react';
import NotificationItem from './NotificationItem';
import { useEffect, useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { useSSEContext } from '../../context/SSEContext';

const BannerAlarm = () => {
  const { notification, clearNotification } = useNotification();
  const { connected } = useSSEContext();

  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsLeaving(false);

      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      clearNotification();
    }, 300);
  };

  if (!notification || !isVisible) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`max-w-md w-full transform transition-all duration-300 ease-out pointer-events-auto ${
          isLeaving
            ? 'translate-y-[-100%] opacity-0 scale-95'
            : 'translate-y-0 opacity-100 scale-100'
        }`}
      >
        <div className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
          <NotificationItem
            notification={notification}
            isRecent={true}
            onBannerClose={clearNotification}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerAlarm;
