import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';
import { getTransactionCategoryIcon } from '../../../utils/CategoryIcons';

// 카테고리별 고정 색상 매핑
const getCategoryColor = tcCode => {
  const colorMap = {
    FOOD: 'bg-group-1', // 식비
    CAFE_AND_SNACK: 'bg-group-2', // 카페, 간식
    STORE: 'bg-group-3', // 편의점, 마트
    PLEASURE: 'bg-group-4', // 술, 유흥
    SHOPPING: 'bg-group-5', // 쇼핑
    MEDICAL_TREATMENT: 'bg-group-6', // 의료
    LODGMENT: 'bg-main', // 숙박
    TRANSPORTATION: 'bg-blue', // 교통
    TRANSFER: 'bg-logo-orange', // 이체
    ETC: 'bg-gray-3', // 기타
  };
  return colorMap[tcCode] || 'bg-gray-3';
};

// 아이콘과 텍스트 분리
const getCategoryIconAndText = tcCode => {
  const result = getTransactionCategoryIcon(tcCode, 'w-3 h-3 text-white');
  const children = React.Children.toArray(result.props.children);
  return {
    icon: children[0],
    text: children[1]?.props?.children,
  };
};

const TotalSpentSection = ({ travel, groupid }) => {
  const [expenseData, setExpenseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 총 경비 및 카테고리별 지출 데이터 가져오기
  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!travel?.tpPk || !groupid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 총 경비와 카테고리별 소비 통계
        const [totalSpentResponse, categorySpentResponse] = await Promise.all([
          statAPI.getTotalSpent(groupid, travel.tpPk),
          statAPI.getCategorySpent(groupid, travel.tpPk),
        ]);

        // 총 경비 추출
        const totalExpense =
          typeof totalSpentResponse === 'number'
            ? totalSpentResponse
            : totalSpentResponse?.data;

        // 카테고리별 데이터 처리
        const categoryData = Array.isArray(categorySpentResponse)
          ? categorySpentResponse
          : categorySpentResponse?.data || [];

        if (totalExpense && categoryData.length > 0) {
          // 소비 금액이 0인 카테고리 제외하고 비율 계산 및 고정 색상 매핑
          const categories = categoryData
            // 0원인 카테고리 제외
            .filter(category => category.totalAmount > 0)
            .map(category => ({
              name: category.tcName,
              percentage: Math.round(
                (category.totalAmount / totalExpense) * 100
              ),
              amount: category.totalAmount,
              color: getCategoryColor(category.tcCode),
              tcCode: category.tcCode,
            }));

          setExpenseData({ totalExpense, categories });
        } else {
          setExpenseData(null);
        }
      } catch (error) {
        setError(error);
        setExpenseData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseData();
  }, [travel?.tpPk, groupid]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
          <p className="text-gray-2">총 경비를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !expenseData) {
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

  return (
    <div className="mb-6">
      {/* 총 경비 */}
      <h2 className="text-sm font-normal text-black mb-4">
        총 경비로{' '}
        <span className="text-lg font-bold text-third">
          {expenseData.totalExpense.toLocaleString()}
        </span>
        원 썼어요
      </h2>

      {/* 카테고리별 비율 바 */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6">
        {expenseData.categories.map((category, index) => (
          <div
            key={index}
            className={`${category.color}`}
            style={{ width: `${category.percentage}%` }}
          />
        ))}
      </div>

      {/* 카테고리별 상세 */}
      <div className="space-y-3">
        {expenseData.categories.map((category, index) => {
          const { icon, text } = getCategoryIconAndText(category.tcCode);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-[35px] h-[35px] rounded-full ${category.color} flex items-center justify-center`}
                >
                  {React.cloneElement(icon, {
                    className: 'w-5 h-5 text-white',
                  })}
                </div>
                <span className="text-gray-1 font-medium">{text}</span>
              </div>
              <div className="text-right">
                <div className="text-gray-1 font-bold">
                  {category.percentage}%
                </div>
                <div className="text-sm text-gray-2">
                  {category.amount.toLocaleString()}원
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TotalSpentSection.propTypes = {
  travel: PropTypes.shape({
    tpPk: PropTypes.number,
  }),
  groupid: PropTypes.string,
};

export default TotalSpentSection;
