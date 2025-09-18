import React, { useState, useEffect } from 'react';
import { FaUserGroup } from 'react-icons/fa6';
import { getGroupProfileImage } from '../../services/s3';
import {
  getGroupCategoryIcon,
  getGroupCategoryName,
} from '../../utils/CategoryIcons';

// 그룹 카드 컴포넌트
const GroupCard = ({ group, onClick }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  // S3에서 이미지 로드
  useEffect(() => {
    const loadImage = async () => {
      if (!group.profileImg) return;

      setImageLoading(true);
      try {
        const url = await getGroupProfileImage(group.profileImg);
        setImageUrl(url);
      } catch (error) {
        console.error('이미지 로드 실패:', error);
        setImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [group.profileImg]);

  // 이미지 로드 실패 핸들러
  const handleImageLoadError = e => {
    console.error('이미지 로드 실패:', e.target.src);
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.classList.remove('hidden');
      fallback.classList.add('flex');
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-white backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-center space-x-3">
        {/* 그룹 프로필 이미지 */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center relative">
          {imageLoading ? (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-main"></div>
            </div>
          ) : imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={group.groupName}
                className="w-16 h-16 rounded-lg object-cover"
                onError={handleImageLoadError}
              />
              {/* 이미지 로드 실패 시 표시될 기본 아이콘 */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center hidden">
                <span className="text-gray-600 font-bold text-sm">
                  {group.groupName?.charAt(0) || 'G'}
                </span>
              </div>
            </>
          ) : (
            <div className="w-16 h-16 bg-main rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {group.groupName?.charAt(0) || 'G'}
              </span>
            </div>
          )}
        </div>

        {/* 그룹 정보 */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-800">{group.groupName}</h3>
          <span className="text-xs text-gray-500">
            예정된 여정 {group.scheduled}개
          </span>

          <div className="flex items-center space-x-1 mt-1">
            <div className="flex items-center px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
              <FaUserGroup className="w-3 h-3 mr-1" />
              <span className="inline-flex items-center">
                <span
                  className="max-w-12 truncate flex-1 align-bottom"
                  title={group.groupLeader || '리더'}
                >
                  {group.groupLeader || '리더'}
                </span>
                <span className="ml-1">
                  외 {Math.max(0, (group.totalMembers ?? 1) - 1)}명
                </span>
              </span>
            </div>

            {group.gcPk && (
              <div className="flex items-center px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                <img
                  src={getGroupCategoryIcon(group.gcPk)}
                  alt={group.gcPk}
                  className="w-3 h-3 mr-1"
                />
                <span>{getGroupCategoryName(group.gcPk)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 */}
        <div className="text-gray-400">
          <svg
            className="w-4 h-4"
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
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
