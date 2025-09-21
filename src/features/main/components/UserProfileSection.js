import React, { useState } from 'react';
import PropTypes from 'prop-types';
import profilePic from '../../../assets/images/mainUserProfilePic.svg';

const UserProfileSection = ({ user }) => {
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
                {user?.userName ? (
                  user.userName
                ) : (
                  <div className="text-gray-3">사용자 정보 없음</div>
                )}
              </h2>
              <div className="text-sm text-gray-2 truncate max-w-[200px]">
                {user?.email ? (
                  user.email
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
              {user?.userId ? (
                user.userId
              ) : (
                <span className="text-gray-3">아이디 정보 없음</span>
              )}
            </span>
          </div>

          {/* 이메일 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-2 font-medium">이메일</span>
            <span className="text-gray-1 font-semibold">
              {user?.email ? (
                user.email
              ) : (
                <span className="text-gray-3">이메일 정보 없음</span>
              )}
            </span>
          </div>

          {/* 전화번호 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-2 font-medium">전화번호</span>
            <span className="text-gray-1 font-semibold">
              {user?.tel ? (
                user.tel
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
  user: PropTypes.object,
};

export default UserProfileSection;
