import React from 'react';
import PropTypes from 'prop-types';

// 알림 스타일 반환
const getNotificationStyle = acCode => {
  switch (acCode) {
    case 'GROUP_INVITE':
      return 'bg-main bg-opacity-20';
    case 'DEPOSIT_REMINDER':
    case 'TRAVEL_CREATED':
    case 'ACCOUNT_CREATED':
      return 'bg-secondary';
    default:
      return 'bg-secondary';
  }
};

const NotificationSection = ({ notifications = [], navigate }) => {
  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-bold text-gray-1">알림</h2>
        <button
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-6 rounded-lg p-1 transition-colors"
          onClick={() => navigate('/alarm')}
        >
          <span className="text-sm text-gray-2">더보기</span>
          <svg
            className="w-5 h-5 text-gray-2"
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
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-2">새로운 알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={`${notification.acCode}-${notification.groupName}-${index}`}
              className={`rounded-lg p-[19px] ${getNotificationStyle(
                notification.acCode
              )}`}
            >
              <h3 className="font-bold text-gray-1 mb-1">
                {notification.pnTitle}
              </h3>
              <p className="text-sm text-gray-2 truncate">
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
