import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';

const ComparePerPersonSection = ({ travel, groupid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!travel?.tpPk || !groupid) return setLoading(false);

      try {
        const response = await statAPI.getCompareSpentPerPerson(
          groupid,
          travel.tpPk
        );
        setData(response);
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [travel?.tpPk, groupid]);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
          <p className="text-gray-2">비교 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!data || (data.ourPayPerDay === 0 && data.averagePayPerDay === 0)) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <p className="text-gray-2 text-lg">데이터가 없습니다</p>
          <p className="text-gray-3 text-sm mt-2">
            이 여행의 소비 기록이 없어요
          </p>
        </div>
      </div>
    );
  }

  const { ourPayPerDay, averagePayPerDay, difference } = data;
  const maxValue = Math.max(ourPayPerDay, averagePayPerDay);
  const maxHeight = 80;
  const minHeight = 15;
  const ourHeight = Math.max((ourPayPerDay / maxValue) * maxHeight, minHeight);
  const averageHeight = Math.max(
    (averagePayPerDay / maxValue) * maxHeight,
    minHeight
  );

  const isMore = difference > 0;
  const differenceText = isMore
    ? `평균보다 ${Math.abs(difference).toLocaleString()}원 더 썼어요`
    : `평균보다 ${Math.abs(difference).toLocaleString()}원 덜 썼어요`;

  return (
    <div className="mb-6">
      <div className="text-left mb-4">
        <p className="text-gray-1 text-base mb-1">
          이번 여행에서 인당 하루에{' '}
          <span className="font-bold text-third">
            {ourPayPerDay.toLocaleString()}
          </span>
          원 썼어요
        </p>
        <p className="text-gray-2 text-xs">{differenceText}</p>
      </div>

      {/* 막대 그래프 */}
      <div className="flex justify-center items-end space-x-8 h-32">
        {/* 우리 그룹룹 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-[13px] text-gray-1 mb-1 font-medium">
            {ourPayPerDay.toLocaleString()}원
          </div>
          <div
            className="w-12 bg-group-3 rounded"
            style={{ height: `${ourHeight}px` }}
          />
          <div className="text-sm text-gray-2 mt-1">우리 그룹</div>
        </div>

        {/* 평균 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-[13px] text-gray-1 mb-1 font-medium">
            {averagePayPerDay.toLocaleString()}원
          </div>
          <div
            className="w-12 bg-blue rounded"
            style={{ height: `${averageHeight}px` }}
          />
          <div className="text-sm text-gray-2 mt-1">평균</div>
        </div>
      </div>
    </div>
  );
};

ComparePerPersonSection.propTypes = {
  travel: PropTypes.shape({
    tpPk: PropTypes.number,
  }),
  groupid: PropTypes.string,
};

export default ComparePerPersonSection;
