import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupProfileImage } from '../../services/s3';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { AlarmAPI } from '../../services/AlarmAPI';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const NotificationItem = React.memo(
  ({ notification, isRecent = false, onBannerClose = null }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    // S3에서 이미지 로드
    useEffect(() => {
      const loadImage = async () => {
        if (!notification.groupImage) return;

        setImageLoading(true);
        try {
          const url = await getGroupProfileImage(notification.groupImage);
          setImageUrl(url);
        } catch (error) {
          console.error('이미지 로드 실패:', error);
          setImageUrl(null);
        } finally {
          setImageLoading(false);
        }
      };

      loadImage();
    }, [notification.groupImage]);

    const handleClick = async () => {
      const dest = notification.acDest;
      let destUrl = null;

      if (isRecent === true) {
        destUrl = `/alarm`;
        if (onBannerClose) onBannerClose();
        navigate(destUrl, { state: { reload: true } });
        return;
      }
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
          destUrl = `/`;
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

    const handleKeyDown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        role="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`w-full flex items-center p-3 hover:bg-gray-6 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-xl 
        ${
          isRecent
            ? 'bg-light-blue'
            : notification.isAccepted
            ? 'bg-gray-6'
            : 'bg-white'
        }`}
      >
        {/* 사진 */}
        <div className="w-16 h-16 bg-light-blue rounded-lg flex-shrink-0">
          {imageLoading ? (
            <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={notification.groupImage}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {notification.groupName?.charAt(0) || 'G'}
              </span>
            </div>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <div className="ml-4 flex-1 w-24">
            {notification.groupName && (
              <span className="text-medium font-semibold text-gray-900 flex-shrink-0 truncate w-full">
                {notification.groupName}
              </span>
            )}
            {notification.content && (
              <p className="text-sm text-gray-500 mt-1">
                {notification.content}
              </p>
            )}
          </div>
          <div className="ml-3 text-xs text-gray-400 flex-shrink-0">
            {dayjs(notification.pnTime).fromNow()}
          </div>
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
export default NotificationItem;
