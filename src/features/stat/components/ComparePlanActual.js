import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';

// 카테고리별 색상 매핑 (다른 컴포넌트와 동일)
const getCategoryColor = tcCode => {
  const colorMap = {
    FOOD: 'bg-group-1',
    CAFE_AND_SNACK: 'bg-group-2',
    STORE: 'bg-group-3',
    PLEASURE: 'bg-group-4',
    SHOPPING: 'bg-group-5',
    MEDICAL_TREATMENT: 'bg-group-6',
    LODGMENT: 'bg-main',
    TRANSPORTATION: 'bg-blue',
    TRANSFER: 'bg-logo-orange',
    ETC: 'bg-gray-3',
  };
  return colorMap[tcCode] || 'bg-gray-3';
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [travel?.tpPk, groupid]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
          <p className="text-gray-2">계획 vs 실제 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 데이터가 없거나 모든 금액이 0인지 확인
  const hasAnyData =
    data?.categories?.length > 0 &&
    data.categories.some(
      category =>
        (category.plannedAmount || 0) > 0 || (category.actualAmount || 0) > 0
    );

  if (!hasAnyData) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <p className="text-gray-2 text-lg">데이터가 없습니다</p>
          <p className="text-gray-3 text-sm mt-2">
            이 여행의 계획 vs 실제 소비 기록이 없어요
          </p>
        </div>
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

  const differenceAmount = Math.abs(difference).toLocaleString();

  let titleElement;
  if (difference > 0) {
    titleElement = (
      <span>
        계획보다{' '}
        <span className="font-bold text-third text-lg">
          {differenceAmount}원
        </span>{' '}
        더 썼어요
      </span>
    );
  } else if (difference < 0) {
    titleElement = (
      <span>
        계획보다{' '}
        <span className="font-bold text-third text-lg">
          {differenceAmount}원
        </span>{' '}
        덜 썼어요
      </span>
    );
  } else {
    titleElement = <span>계획과 실제가 동일해요</span>;
  }

  return (
    <div className="mb-6">
      <div className="text-left">
        <h2 className="text-sm font-normal text-black mb-4">{titleElement}</h2>
      </div>

      <div className="bg-white rounded-lg">
        {/* 양쪽 막대그래프 */}
        <div className="space-y-3">
          {filteredCategories.map((category, index) => {
            const plannedAmount = category.plannedAmount || 0;
            const actualAmount = category.actualAmount || 0;

            const plannedPercentage =
              globalMaxValue > 0 ? (plannedAmount / globalMaxValue) * 100 : 0;
            const actualPercentage =
              globalMaxValue > 0 ? (actualAmount / globalMaxValue) * 100 : 0;

            const plannedBarWidth =
              plannedAmount === 0 ? 3 : Math.max(plannedPercentage, 8);
            const actualBarWidth =
              actualAmount === 0 ? 3 : Math.max(actualPercentage, 8);

            return (
              <div
                key={category.tcPk || index}
                className="grid grid-cols-3 items-center gap-4"
              >
                {/* 계획 막대 (왼쪽) */}
                <div className="flex justify-end items-center">
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      {plannedAmount.toLocaleString()}원
                    </div>
                    <div className="w-24 h-6 rounded relative">
                      <div
                        className={`absolute right-0 top-0 h-full ${getCategoryColor(
                          category.tcCode
                        )} rounded`}
                        style={{
                          width:
                            plannedAmount === 0 ? '3px' : `${plannedBarWidth}%`,
                          minWidth: plannedAmount === 0 ? '3px' : '8px',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 카테고리명 (중앙) */}
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {category.tcName || '기타'}
                    </div>
                  </div>
                </div>

                {/* 실제 막대 (오른쪽) */}
                <div className="flex justify-start items-center">
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {actualAmount.toLocaleString()}원
                    </div>
                    <div className="w-24 h-6 rounded relative">
                      <div
                        className="absolute left-0 top-0 h-full bg-group-3 rounded"
                        style={{
                          width:
                            actualAmount === 0 ? '3px' : `${actualBarWidth}%`,
                          minWidth: actualAmount === 0 ? '3px' : '8px',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
