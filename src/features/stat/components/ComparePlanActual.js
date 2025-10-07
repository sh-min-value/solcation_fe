import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';
import { getTransactionCategoryIconOnly } from '../../../utils/CategoryIcons';

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

const formatAmount = amount => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만원`;
  }
  return `${amount.toLocaleString()}원`;
};

const PlannedVsActualSection = ({ travel, groupid }) => {
  const [data, setData] = useState(null);
  const [totalData, setTotalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!travel?.tpPk || !groupid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [compareResponse, totalPlanResponse, totalActualResponse] =
          await Promise.all([
            statAPI.getComparePlanActual(groupid, travel.tpPk),
            statAPI.getTotalPlanSpent(groupid, travel.tpPk),
            statAPI.getTotalSpent(groupid, travel.tpPk),
          ]);

        const totalPlannedAmount =
          typeof totalPlanResponse === 'number'
            ? totalPlanResponse
            : totalPlanResponse?.data || 0;

        const totalActualAmount =
          typeof totalActualResponse === 'number'
            ? totalActualResponse
            : totalActualResponse?.data || 0;

        setData({ categories: compareResponse });
        setTotalData({
          totalPlanned: totalPlannedAmount,
          totalActual: totalActualAmount,
        });
      } catch (err) {
        console.error('계획 vs 실제 데이터 로드 실패:', err);
        setError(err);
        navigator('/error', {
          state: {
            error: err,
            from: location.pathname,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [travel?.tpPk, groupid]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-main border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-400 font-medium">
          계획 vs 실제 데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  const hasAnyData =
    data?.categories?.length > 0 &&
    data.categories.some(
      category =>
        (category.plannedAmount || 0) > 0 || (category.actualAmount || 0) > 0
    );

  if (!hasAnyData) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-5xl mb-3">📊</div>
        <p className="text-gray-500 text-base font-medium">데이터가 없습니다</p>
        <p className="text-gray-400 text-sm mt-2">
          이 여행의 계획 vs 실제 소비 기록이 없어요
        </p>
      </div>
    );
  }

  const filteredCategories = data.categories.filter(
    cat => (cat.plannedAmount || 0) > 0 || (cat.actualAmount || 0) > 0
  );

  const globalMaxValue = Math.max(
    ...filteredCategories.map(cat =>
      Math.max(cat.plannedAmount || 0, cat.actualAmount || 0)
    )
  );

  const totalPlanned = totalData?.totalPlanned || 0;
  const totalActual = totalData?.totalActual || 0;
  const difference = totalActual - totalPlanned;
  const differenceAmount = Math.abs(difference);

  let headerContent;
  if (difference > 0) {
    headerContent = (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <div>
              <p className="text-sm text-gray-600">계획보다</p>
              <p className="text-xl font-bold text-red-600">
                {formatAmount(differenceAmount)} 더 썼어요
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (difference < 0) {
    headerContent = (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm text-gray-600">계획보다</p>
              <p className="text-xl font-bold text-green-600">
                {formatAmount(differenceAmount)} 절약했어요
              </p>
            </div>
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
            <p className="text-xl font-bold text-blue-600">
              계획과 실제가 동일해요
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {headerContent}
      {/* 범례 */}
      <div className="flex justify-center gap-6 mb-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue"></div>
          <span className="text-sm text-gray-600 font-medium">계획</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-stat"></div>
          <span className="text-sm text-gray-600 font-medium">실제</span>
        </div>
      </div>
      {/* 양쪽 막대그래프 */}
      <div className="space-y-4">
        {filteredCategories.map((category, index) => {
          const plannedAmount = category.plannedAmount || 0;
          const actualAmount = category.actualAmount || 0;

          const plannedPercentage =
            globalMaxValue > 0 ? (plannedAmount / globalMaxValue) * 100 : 0;
          const actualPercentage =
            globalMaxValue > 0 ? (actualAmount / globalMaxValue) * 100 : 0;

          const plannedBarWidth =
            plannedAmount === 0 ? 2 : Math.max(plannedPercentage, 10);
          const actualBarWidth =
            actualAmount === 0 ? 2 : Math.max(actualPercentage, 10);

          return (
            <div
              key={category.tcPk || index}
              className="bg-gray-6/50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                {/* 계획 막대 (왼쪽) */}
                <div className="flex flex-col items-end">
                  <div className="text-xs font-medium text-blue-600 mb-2">
                    {formatAmount(plannedAmount)}
                  </div>
                  <div className="w-full max-w-[120px] h-7 bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-full flex justify-end items-center px-1">
                      <div
                        className="h-5 bg-gradient-to-r from-blue/80 to-blue/50 rounded"
                        style={{
                          width:
                            plannedAmount === 0 ? '2px' : `${plannedBarWidth}%`,
                          minWidth: plannedAmount === 0 ? '2px' : '10%',
                          transition: 'width 0.3s ease',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 카테고리명 (중앙) */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-1 shadow-sm"
                    style={{
                      backgroundColor: getCategoryColor(category.tcCode),
                    }}
                  >
                    {getTransactionCategoryIconOnly(
                      category.tcCode,
                      'w-5 h-5 text-white'
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-700 text-center whitespace-nowrap">
                    {category.tcName || '기타'}
                  </div>
                </div>

                {/* 실제 막대 (오른쪽) */}
                <div className="flex flex-col items-start">
                  <div className="text-xs font-medium text-black mb-2">
                    {formatAmount(actualAmount)}
                  </div>
                  <div className="w-full max-w-[120px] h-7 bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-full flex justify-start items-center px-1">
                      <div
                        className="h-5 bg-gradient-to-r from-stat/50 to-stat/80 rounded"
                        style={{
                          width:
                            actualAmount === 0 ? '2px' : `${actualBarWidth}%`,
                          minWidth: actualAmount === 0 ? '2px' : '10%',
                          transition: 'width 0.3s ease',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

PlannedVsActualSection.propTypes = {
  travel: PropTypes.shape({
    tpPk: PropTypes.number,
  }),
  groupid: PropTypes.string,
};

export default PlannedVsActualSection;
