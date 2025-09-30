import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';
import { getTransactionCategoryIconOnly } from '../../../utils/CategoryIcons';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const OverallStatsView = ({ groupid, groupInfo }) => {
  const [overallStats, setOverallStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatAmount = amount => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    }
    if (amount >= 10000) {
      return `${Math.round(amount / 10000)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  };

  const getCategoryColor = tcCode => {
    const colorMap = {
      FOOD: '#F08676',
      CAFE_AND_SNACK: '#F48FB1',
      STORE: '#FBAA68',
      PLEASURE: '#ECC369',
      SHOPPING: '#A7C972',
      MEDICAL_TREATMENT: '#3E8E6E',
      LODGMENT: '#7DD1C1',
      TRANSPORTATION: '#7AA5E9',
      TRANSFER: '#CE93D8',
      ETC: '#BDBDBD',
    };
    return colorMap[tcCode] || '#BDBDBD';
  };

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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.name}
          </p>
          <p className="text-main font-bold">
            {formatAmount(payload[0].value.toLocaleString())}
          </p>
          <p className="text-sm text-gray-500">
            {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="pt-0 px-4 pb-4 overflow-y-auto relative"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <div className="space-y-4 mb-28">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400 font-medium">
              전체 여행 통계를 불러오는 중...
            </p>
          </div>
        ) : overallStats ? (
          <>
            {/* 전체 요약 - 카드 그리드 */}
            <div className="bg-gradient-to-br from-secondary to-blue rounded-2xl p-6 shadow-md text-third font-bold">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">✈️</span>
                {groupInfo?.groupName || '그룹'}의 여행 기록
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2 text-center">
                  <p className="text-xs opacity-90 mb-1">총 여행</p>
                  <span className="text-2xl font-bold ">
                    {overallStats.totalTrips}
                  </span>
                  <span className="text-xs opacity-75 pl-1">회</span>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2 text-center">
                  <p className="text-xs opacity-90 mb-1">여행 일수</p>
                  <span className="text-2xl font-bold">
                    {overallStats.totalTripDays}
                  </span>
                  <span className="text-xs opacity-75 pl-1">일</span>
                </div>
              </div>
            </div>

            {/* TOP 3 & LEAST 카테고리 - 나란히 배치 */}
            <div className="grid grid-cols-1 gap-4">
              {/* TOP 3 */}
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">🔥</span>
                  <h2 className="text-lg font-bold text-gray-800">
                    가장 많이 쓴 카테고리
                  </h2>
                </div>
                <div className="space-y-3">
                  {overallStats.top3Categories?.map((category, index) => (
                    <div
                      key={category.tcPk}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                          style={{
                            background:
                              index === 0
                                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                : index === 1
                                ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'
                                : 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-md text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="font-md text-gray-2 text-md">
                        {formatAmount(category.amount?.toLocaleString())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LEAST 카테고리 */}
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">💡</span>
                  <h2 className="text-lg font-bold text-gray-800">
                    가장 적게 쓴 카테고리
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: getCategoryColor(
                            overallStats.leastCategory?.code
                          ),
                        }}
                      >
                        {getTransactionCategoryIconOnly(
                          overallStats.leastCategory?.code,
                          'w-5 h-5 text-white'
                        )}
                      </div>
                      <span className="font-md text-gray-700 text-md">
                        {overallStats.leastCategory?.name}
                      </span>
                    </div>
                    <span className="font-md text-gray-2 text-md">
                      {formatAmount(
                        overallStats.leastCategory?.amount?.toLocaleString()
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리별 소비 비율 */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-2">📢</span>
                <h2 className="text-lg font-bold text-gray-800">
                  카테고리별 소비 비율
                </h2>
              </div>

              {/* 파이 차트 */}
              <div className="h-72 mb-6  rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 상세 정보 - 2열 그리드 */}
              <div className="grid grid-cols-1 gap-2">
                {overallStats.categoryShares?.map(category => (
                  <div
                    key={category.tcPk}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
                        style={{
                          backgroundColor: getCategoryColor(category.code),
                        }}
                      >
                        {getTransactionCategoryIconOnly(
                          category.code,
                          'w-4 h-4 text-white'
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-sm text-gray-700 block truncate">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs font-md text-gray-500 px-2 py-1 bg-gray-6/40 rounded-full">
                        {(category.ratio * 100).toFixed(1)}%
                      </span>
                    </div>
                    <span className="font-md text-gray-2 ml-3 text-sm">
                      {formatAmount(category.amount?.toLocaleString())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-500 font-medium">
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
