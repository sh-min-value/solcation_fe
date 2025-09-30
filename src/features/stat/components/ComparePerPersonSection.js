import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';

const formatAmount = amount => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만원`;
  }
  return `${amount.toLocaleString()}원`;
};

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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-main border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-400 font-medium">
          인당 소비 데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  if (!data || (data.ourPayPerDay === 0 && data.averagePayPerDay === 0)) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-5xl mb-3">💰</div>
        <p className="text-gray-500 text-base font-medium">데이터가 없습니다</p>
        <p className="text-gray-400 text-sm mt-2">
          이 여행의 소비 기록이 없어요
        </p>
      </div>
    );
  }

  const { ourPayPerDay, averagePayPerDay, difference } = data;
  const maxValue = Math.max(ourPayPerDay, averagePayPerDay);
  const maxHeight = 100;
  const minHeight = 10;
  const ourHeight = Math.max((ourPayPerDay / maxValue) * maxHeight, minHeight);
  const averageHeight = Math.max(
    (averagePayPerDay / maxValue) * maxHeight,
    minHeight
  );

  const isMore = difference > 0;
  const differenceAmount = Math.abs(difference);

  let headerContent;
  if (isMore) {
    headerContent = (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <div>
            <p className="text-sm text-gray-600">평균보다</p>
            <p className="text-xl font-bold text-red-600">
              {formatAmount(differenceAmount)} 더 썼어요
            </p>
          </div>
        </div>
      </div>
    );
  } else if (difference < 0) {
    headerContent = (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-sm text-gray-600">평균보다</p>
            <p className="text-xl font-bold text-green-600">
              {formatAmount(differenceAmount)} 덜 썼어요
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    headerContent = (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <div>
            <p className="text-xl font-bold text-blue-600">평균과 동일해요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 범례 */}
      <div className="flex justify-center gap-6 mb-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-stat"></div>
          <span className="text-sm text-gray-600 font-medium">우리 그룹</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-600 font-medium">평균</span>
        </div>
      </div>

      {/* 막대 그래프 */}
      <div className="rounded-xl p-6">
        <div className="flex justify-center items-end gap-8 h-40">
          {/* 우리 그룹 막대 */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-black mb-2">
              {formatAmount(ourPayPerDay)}
            </div>
            <div
              className="w-16 bg-gradient-to-t from-stat/80 to-stat/50 rounded-t-lg shadow-md"
              style={{
                height: `${ourHeight}px`,
                transition: 'height 0.3s ease',
              }}
            />
            <div className="text-xs font-semibold text-gray-700 mt-2">
              우리 그룹
            </div>
          </div>

          {/* 평균 막대 */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-600 mb-2">
              {formatAmount(averagePayPerDay)}
            </div>
            <div
              className="w-16 bg-gradient-to-t from-gray-400/80 to-gray-400/50 rounded-t-lg shadow-md"
              style={{
                height: `${averageHeight}px`,
                transition: 'height 0.3s ease',
              }}
            />
            <div className="text-xs font-semibold text-gray-700 mt-2">평균</div>
          </div>
        </div>
      </div>
      {headerContent}
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
