import React from 'react';
import PropTypes from 'prop-types';

const NotificationSection = ({ notifications = [], navigate }) => {
  // 알림 타입별 스타일링
  const getNotificationStyle = acCode => {
    switch (acCode) {
      case 'GROUP_INVITE':
        return 'bg-blue-50';
      case 'DEPOSIT_REMINDER':
      case 'TRAVEL_CREATED':
      case 'ACCOUNT_CREATED':
        return 'bg-orange-50';
      default:
        return 'bg-orange-50';
    }
  };

  // 최대 2개까지만 표시
  const displayedNotifications = notifications.slice(0, 2);

  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-bold text-gray-800">알림</h2>
        <button
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors"
          onClick={() => navigate('/alarm')}
        >
          <span className="text-sm text-gray-600">더보기</span>
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-[10px]">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">새로운 알림이 없습니다</p>
          </div>
        ) : (
          displayedNotifications.map((notification, index) => (
            <div
              key={`${notification.acCode}-${notification.groupName}-${index}`}
              className={`rounded-lg p-[19px] ${getNotificationStyle(
                notification.acCode
              )}`}
            >
              <h3 className="font-bold text-gray-800 mb-1">
                {notification.pnTitle}
              </h3>
              <p className="text-sm text-gray-600">
                &ldquo;{notification.groupName}&rdquo; from{' '}
                {notification.groupLeader}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

NotificationSection.propTypes = {
  notifications: PropTypes.array,
  navigate: PropTypes.func.isRequired,
};

export default NotificationSection;
