import React, { useState } from 'react';
import PropTypes from 'prop-types';
import profilePic from '../../../assets/images/mainUserProfilePic.svg';

// 로딩 스켈레톤
const LoadingSkeleton = ({ width, height, className = '' }) => (
  <div
    className={`animate-pulse bg-gray-5 rounded ${className}`}
    style={{ width, height }}
  ></div>
);

LoadingSkeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

const UserProfileSection = ({ userProfile, isProfileLoading, user }) => {
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  return (
    <>
      {/* 헤더 */}
      <div className="relative z-20 bg-white rounded-xl p-4 shadow-sm mb-[-26px]">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* 프로필 사진 */}
            <div className="w-16 h-16 bg-logo-orange bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
              <img
                src={profilePic}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* 사용자 정보 */}
            <div className="flex flex-col min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-1 truncate">
                {isProfileLoading ? (
                  <LoadingSkeleton width="96px" height="24px" />
                ) : userProfile?.userName || user?.name ? (
                  userProfile?.userName || user?.name
                ) : (
                  <div className="text-gray-3">사용자 정보 없음</div>
                )}
              </h2>
              <div className="text-sm text-gray-2 truncate max-w-[200px]">
                {isProfileLoading ? (
                  <LoadingSkeleton
                    width="128px"
                    height="16px"
                    className="mt-1"
                  />
                ) : userProfile?.email || user?.email ? (
                  userProfile?.email || user?.email
                ) : (
                  <div className="text-gray-3">이메일 정보 없음</div>
                )}
              </div>
            </div>
          </div>

          {/* 토글 버튼 */}
          <button
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
            className="p-2 hover:bg-gray-6 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-2 transform transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isProfileExpanded ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 상세 정보 */}
      <div
        className={`relative z-10 bg-white rounded-xl px-6 pt-12 overflow-hidden transition-all duration-300 ease-in-out ${
          isProfileExpanded
            ? 'h-44 opacity-100 py-4 mb-6'
            : 'h-0 opacity-0 py-0 mb-0'
        }`}
      >
        <div className="space-y-4">
          {/* 아이디 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-2 font-medium">아이디</span>
            <span className="text-gray-1 font-semibold">
              {isProfileLoading ? (
                <LoadingSkeleton width="80px" height="16px" />
              ) : userProfile?.userId || user?.id ? (
                userProfile?.userId || user?.id
              ) : (
                <span className="text-gray-3">아이디 정보 없음</span>
              )}
            </span>
          </div>

          {/* 이메일 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-2 font-medium">이메일</span>
            <span className="text-gray-1 font-semibold">
              {isProfileLoading ? (
                <LoadingSkeleton width="128px" height="16px" />
              ) : userProfile?.email || user?.email ? (
                userProfile?.email || user?.email
              ) : (
                <span className="text-gray-3">이메일 정보 없음</span>
              )}
            </span>
          </div>

          {/* 전화번호 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-2 font-medium">전화번호</span>
            <span className="text-gray-1 font-semibold">
              {isProfileLoading ? (
                <LoadingSkeleton width="96px" height="16px" />
              ) : userProfile?.tel || user?.phone ? (
                userProfile?.tel || user?.phone
              ) : (
                <span className="text-gray-3">전화번호 정보 없음</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

UserProfileSection.propTypes = {
  userProfile: PropTypes.object,
  isProfileLoading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default UserProfileSection;
