import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getGroupProfileImage } from '../../../services/s3';

// 로딩 스피너
const LoadingSpinner = ({ size = 'h-4 w-4' }) => (
  <div
    className={`animate-spin rounded-full ${size} border-b-2 border-gray-2`}
  ></div>
);

// 그룹 이미지
const GroupImage = ({ imagePath, groupName }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (imagePath) {
        try {
          const url = await getGroupProfileImage(imagePath);
          setImageUrl(url);
        } catch (error) {
          console.error('이미지 로딩 실패:', error);
        }
      }
      setLoading(false);
    };
    loadImage();
  }, [imagePath]);

  if (loading) {
    return (
      <div className="w-[55px] h-[55px] bg-gray-5 rounded-[10px] mb-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-[50px] h-[50px] bg-gray-6 rounded-lg mb-1 flex items-center justify-center text-xl overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={groupName}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <span className="text-gray-2 font-medium">
          {groupName ? groupName.charAt(0).toUpperCase() : '?'}
        </span>
      )}
    </div>
  );
};

const MyGroupsSection = ({ myGroups, navigate }) => {
  return (
    <>
      {/* 헤더 */}
      <div
        className="relative z-10 bg-white rounded-xl p-4 shadow-sm mb-[-26px] cursor-pointer"
        onClick={() => navigate('/group')}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/group');
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-gray-1">
            내 그룹 보러가기
          </h2>
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
        </div>
      </div>

      {/* 그룹 목록 */}
      <div
        className="relative z-0 bg-white rounded-xl px-6 py-4 pt-12 mb-6 cursor-pointer"
        onClick={() => navigate('/group')}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/group');
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="grid grid-cols-4 gap-3">
          {myGroups.map(group => (
            <div
              key={group.groupPk}
              className="flex flex-col items-center text-center text-medium"
            >
              <GroupImage
                imagePath={group.groupImage}
                groupName={group.groupName}
              />
              <p className="text-xs text-gray-2 truncate w-full max-w-[60px]">
                {group.groupName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

MyGroupsSection.propTypes = {
  myGroups: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default MyGroupsSection;
