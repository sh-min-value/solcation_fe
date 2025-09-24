import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';
import { getTransactionCategoryIconOnly } from '../../../utils/CategoryIcons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const OverallStatsView = ({ groupid, groupInfo }) => {
  const [overallStats, setOverallStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 카테고리별 색상 매핑
  const getCategoryColor = tcCode => {
    const colorMap = {
      FOOD: '#F08676',
      CAFE_AND_SNACK: '#FBAA68',
      STORE: '#ECC369',
      PLEASURE: '#A7C972',
      SHOPPING: '#7DD1C1',
      MEDICAL_TREATMENT: '#7AA5E9',
      LODGMENT: '#39A7FF',
      TRANSPORTATION: '#87C4FF',
      TRANSFER: '#FE9100',
      ETC: '#BDBDBD',
    };
    return colorMap[tcCode] || '#BDBDBD';
  };

  // 파이 차트 데이터 변환
  const getChartData = () => {
    if (!overallStats?.categoryShares) return [];

    return overallStats.categoryShares
      .filter(category => category.amount > 0)
      .map(category => ({
        name: category.name,
        value: category.amount,
        percentage: (category.ratio * 100).toFixed(1),
        color: getCategoryColor(category.code),
        tcCode: category.code,
      }));
  };

  // 전체 여행 통계 데이터 가져오기
  useEffect(() => {
    const fetchOverallStats = async () => {
      if (!groupid) return;

      try {
        setIsLoading(true);
        const response = await statAPI.getAllTravelStats(groupid);
        setOverallStats(response);
      } catch (error) {
        setOverallStats(null);
        navigator('/error', {
          state: {
            error: error,
            from: location.pathname,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverallStats();
  }, [groupid]);
  return (
    <div
      className="pt-0 px-4 pb-4 overflow-y-auto bg-white relative"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      {/* 전체 통계 내용 */}
      <div className="space-y-6 mb-28">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
            <p className="text-gray-2">전체 여행 통계를 불러오는 중...</p>
          </div>
        ) : overallStats ? (
          <>
            {/* 전체 요약 */}
            <div className="bg-white rounded-xl px-6 py-2">
              <h2 className="text-lg font-bold text-third mb-6">
                전체 여행 요약
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-2">
                    {groupInfo?.groupName || '그룹'}에서 총{' '}
                    <span className="font-bold text-main">
                      {overallStats.totalTrips}회
                    </span>{' '}
                    여행하셨어요
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-2">
                    총{' '}
                    <span className="font-bold text-main">
                      {overallStats.totalTripDays}일
                    </span>{' '}
                    동안 여행하셨어요
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-2">
                    총{' '}
                    <span className="font-bold text-main">
                      {overallStats.totalSpent?.toLocaleString()}원
                    </span>{' '}
                    사용하셨어요
                  </p>
                </div>
              </div>
            </div>

            <div className="my-1">
              <hr className="border-gray-5" />
            </div>

            {/* TOP 3 카테고리 */}
            <div className="bg-white rounded-xl px-6 py-2">
              <h2 className="text-base font-bold text-third mb-4">
                이 카테고리에서 많이 사용하셨어요
              </h2>
              <div className="space-y-3">
                {overallStats.top3Categories?.map((category, index) => (
                  <div
                    key={category.tcPk}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-bold text-blue">
                      {category.amount?.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              <h2 className="text-base font-bold text-third mb-4 mt-8">
                이 카테고리엔 적게 사용하셨어요
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: getCategoryColor(
                          overallStats.leastCategory?.code
                        ),
                      }}
                    >
                      {getTransactionCategoryIconOnly(
                        overallStats.leastCategory?.code,
                        'w-4 h-4'
                      )}
                    </div>
                    <span className="font-medium">
                      {overallStats.leastCategory?.name}
                    </span>
                  </div>
                  <span className="font-bold text-blue">
                    {overallStats.leastCategory?.amount?.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            <div className="my-1">
              <hr className="border-gray-5" />
            </div>

            {/* 카테고리별 소비 비율 */}
            <div className="bg-white rounded-xl px-6 py-2">
              <h2 className="text-lg font-bold text-third mb-4">
                카테고리별 소비 비율
              </h2>

              {/* 파이 차트 */}
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                      className="focus:outline-none"
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${props.payload.percentage}%`,
                        props.payload.name,
                      ]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 상세 정보 */}
              <div className="space-y-2">
                {overallStats.categoryShares?.map(category => (
                  <div
                    key={category.tcPk}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(category.code),
                        }}
                      ></div>
                      <span className="font-medium text-black">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-black">
                      {category.amount?.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-6 rounded-lg p-6 text-center">
            <p className="text-gray-2">
              전체 여행 통계 데이터를 불러올 수 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

OverallStatsView.propTypes = {
  groupid: PropTypes.string.isRequired,
  groupInfo: PropTypes.object,
};

export default OverallStatsView;
