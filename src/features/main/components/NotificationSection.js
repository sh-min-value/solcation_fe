import React from 'react';
import PropTypes from 'prop-types';
import { AlarmAPI } from '../../../services/AlarmAPI';

// 알림 스타일 반환
const getNotificationStyle = acCode => {
  switch (acCode) {
    case 'GROUP_INVITE':
      return {
        bg: 'bg-gradient-to-r from-group-2/50 to-group-2/20',
        icon: 'text-main',
        border: 'border-l-4 border-group-2',
      };
    case 'DEPOSIT_REMINDER':
      return {
        bg: 'bg-gradient-to-r from-group-3/50 to-group-3/20',
        icon: 'text-yellow-600',
        border: 'border-l-4 border-group-3',
      };
    case 'TRAVEL_CREATED':
      return {
        bg: 'bg-gradient-to-r from-group-5/50 to-group-5/20',
        icon: 'text-third',
        border: 'border-l-4 border-group-5',
      };
    case 'ACCOUNT_CREATED':
      return {
        bg: 'bg-gradient-to-r from-group-7/50 to-group-7/20',
        icon: 'text-green-600',
        border: 'border-l-4 border-group-7',
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-secondary/80 to-secondary/50',
        icon: 'text-gray-600',
        border: 'border-l-4 border-gray-400',
      };
  }
};

const NotificationSection = ({ notifications = [], navigate }) => {
  const handleNotificationClick = async notification => {
    const dest = notification.acDest;
    let destUrl = null;

    switch (dest) {
      case 'main':
        destUrl = ``;
        break;
      case 'account':
        destUrl = `/group/${notification.groupPk}/account`;
        break;
      case 'travel':
        destUrl = `/group/${notification.groupPk}/travel`;
        break;
      default:
        destUrl = ``;
    }
    try {
      await AlarmAPI.checkNoti(notification.pnPk);
      if (destUrl === null) {
        throw new Error('알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      console.log('알림 확인 중 오류 발생: ' + err);
    } finally {
      navigate(destUrl);
    }
  };

  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-[18px] font-bold text-gray-1">알림</h2>
        </div>
        <button
          className="flex items-center space-x-1 cursor-pointer hover:bg-gray-6 rounded-lg px-2 py-1 transition-all hover:scale-105"
          onClick={() => navigate('/alarm')}
        >
          <span className="text-sm text-gray-2 font-medium">더보기</span>
          <svg
            className="w-4 h-4 text-gray-2"
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

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-4 mx-auto mb-3 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-3 font-medium">새로운 알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const style = getNotificationStyle(notification.acCode);
            return (
              <div
                key={`${notification.acCode}-${notification.groupName}-${index}`}
                className={`rounded-xl p-4 ${style.bg}  shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleNotificationClick(notification)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNotificationClick(notification);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${notification.pnTitle} 알림 상세보기`}
              >
                <div className="flex items-start space-x-3">
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-1 mb-1.5 leading-tight">
                      {notification.pnTitle}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-2">
                      &ldquo;
                      <span className="font-medium truncate max-w-[60%]">
                        {notification.groupName}
                      </span>
                      &rdquo;
                      <span className="flex-shrink-0">from</span>
                      <span className="truncate max-w-[33%]">
                        {notification.groupLeader}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
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
