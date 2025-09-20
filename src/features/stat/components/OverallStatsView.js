import React from 'react';
import PropTypes from 'prop-types';

const OverallStatsView = ({ groupid, groupInfo, onBack }) => {
  return (
    <div className="pt-0 px-4 pb-4 overflow-y-auto bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-blue hover:text-third transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로가기
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-third mb-1">
          {groupInfo?.groupName || '그룹'} 여행 소비 패턴 분석
        </h1>
        <p className="text-sm text-blue">
          모든 여행의 통합 통계를 확인해보세요
        </p>
      </div>

      {/* 전체 통계 내용이 들어갈 영역 */}
      <div className="space-y-6">
        <div className="bg-gray-6 rounded-lg p-6 text-center">
          <p className="text-gray-2">
            전체 여행 통계 데이터가 여기에 표시됩니다
          </p>
          <p className="text-sm text-gray-3 mt-2">그룹 ID: {groupid}</p>
          <p className="text-sm text-gray-3">추후 구현 예정</p>
        </div>
      </div>
    </div>
  );
};

OverallStatsView.propTypes = {
  groupid: PropTypes.string.isRequired,
  groupInfo: PropTypes.object,
  onBack: PropTypes.func.isRequired,
};

export default OverallStatsView;
