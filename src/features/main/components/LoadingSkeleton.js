import React from 'react';

// 그룹 섹션 스켈레톤
export const GroupsSkeleton = () => (
  <div className="mb-6 animate-fade-in">
    {/* 헤더 */}
    <div className="relative z-10 bg-white rounded-xl p-4 shadow-sm mb-[-26px]">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>

    {/* 그룹 목록 */}
    <div className="relative z-0 bg-white rounded-xl px-6 py-4 pt-12 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-[50px] h-[50px] bg-gray-300 rounded-lg mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 사용자 프로필 섹션 스켈레톤
export const UserProfileSkeleton = () => (
  <div className="mb-6 animate-fade-in">
    <div className="relative z-20 bg-white rounded-xl p-4 shadow-sm mb-[-26px]">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* 프로필 사진 */}
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>

          {/* 사용자 정보 */}
          <div className="flex flex-col min-w-0 flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        {/* 토글 버튼 */}
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>

    {/* 간격 유지 */}
    <div className="h-0 mb-0"></div>
  </div>
);

// 알림 섹션 스켈레톤
export const NotificationsSkeleton = () => (
  <div className="bg-white rounded-xl px-[19px] py-4 mb-6 animate-fade-in">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>

    <div className="space-y-[10px]">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg p-[19px] bg-gray-200 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

// 캘린더 섹션 스켈레톤
export const CalendarSkeleton = () => (
  <div className="bg-white rounded-xl px-[19px] py-4 mb-[14px] animate-fade-in">
    {/* 헤더 */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
    </div>

    {/* 요일 */}
    <div className="grid grid-cols-7 gap-1 mb-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="text-center py-2">
          <div className="h-4 bg-gray-300 rounded w-8 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>

    {/* 날짜 그리드 */}
    <div className="grid grid-cols-7">
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className="aspect-square flex items-center justify-center"
          style={{ animationDelay: `${i * 15}ms` }}
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

// 이벤트 섹션 스켈레톤
export const EventsSkeleton = () => (
  <div className="bg-white rounded-xl px-[19px] py-4 animate-fade-in">
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center p-3 bg-white rounded-xl animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* 날짜 */}
          <div className="w-24 flex-shrink-0">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>

          {/* 구분선 */}
          <div className="w-1 h-8 bg-gray-300 rounded mx-3 flex-shrink-0"></div>

          {/* 이벤트 정보 */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 페이드인 애니메이션을 위한 래퍼
export const FadeInWrapper = ({ isLoading, children, delay = 0 }) => (
  <div
    className={`transition-all duration-500 ${
      isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {children}
  </div>
);
