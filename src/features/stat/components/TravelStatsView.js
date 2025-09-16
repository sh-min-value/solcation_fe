import React from 'react';
import PropTypes from 'prop-types';
import TotalSpentSection from './TotalSpentSection';

const TravelStatsView = ({ travel }) => {
  return (
    <div className="pt-0 px-4 pb-4 h-full overflow-y-auto bg-white">
      {/* 헤더 */}
      <div className="text-center mb-[24px]">
        <h1 className="text-xl font-bold text-third mb-[3px]">
          {travel?.tpTitle || travel?.title || '여행'}
        </h1>
        <p className="text-sm text-blue">
          {travel?.tpStart?.replace(/-/g, '.').substring(5) ||
            travel?.startDate?.replace(/-/g, '.').substring(5)}{' '}
          ~{' '}
          {travel?.tpEnd?.replace(/-/g, '.').substring(5) ||
            travel?.endDate?.replace(/-/g, '.').substring(5)}
        </p>
      </div>

      {/* 총 경비 및 카테고리별 지출 */}
      <TotalSpentSection travel={travel} groupid={travel?.groupid} />

      {/* 구분선 */}
      <div className="mt-5 mb-5">
        <hr className="border-gray-5" />
      </div>

      {/* 통계 데이터 없음 */}
      <div className="text-center py-12">
        <p className="text-gray-2 text-lg">통계 데이터가 없습니다</p>
        <p className="text-gray-3 text-sm mt-2">이 여행의 소비 기록이 없어요</p>
      </div>
    </div>
  );
};

TravelStatsView.propTypes = {
  travel: PropTypes.shape({
    tpTitle: PropTypes.string,
    title: PropTypes.string,
    tpStart: PropTypes.string,
    startDate: PropTypes.string,
    tpEnd: PropTypes.string,
    endDate: PropTypes.string,
    groupid: PropTypes.string,
  }),
};

export default TravelStatsView;
