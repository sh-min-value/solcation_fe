import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { statAPI } from '../../../services/StatAPI';

// 카테고리 별 색상 지정
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

const CategoryCompareSection = ({ travel, groupid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!travel?.tpPk || !groupid) return setLoading(false);

      try {
        const response = await statAPI.getCompareSpentCategory(
          groupid,
          travel.tpPk
        );

        // API 응답 데이터 구조 확인 및 처리
        const categoryData = Array.isArray(response)
          ? response
          : response?.data || [];

        setData(categoryData);
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [travel?.tpPk, groupid]);

  // 드래그 이벤트 핸들러
  const handleMouseDown = e => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
          <p className="text-gray-2">카테고리별 비교 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 데이터가 없거나 모든 금액이 0인지 확인
  const hasAnyData =
    data &&
    data.length > 0 &&
    data.some(
      category => (category.myAmount || 0) > 0 || (category.othersAvg || 0) > 0
    );

  if (!hasAnyData) {
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

  // 차트 렌더링을 위한 데이터 준비
  const filteredData = data.filter(
    category => (category.myAmount || 0) > 0 || (category.othersAvg || 0) > 0
  );

  const globalMaxValue = Math.max(
    ...filteredData.map(category =>
      Math.max(category.myAmount || 0, category.othersAvg || 0)
    )
  );

  const maxHeight = 150;
  const minHeight = 8;

  return (
    <div className="mb-6">
      <div className="text-left">
        <h2 className="text-base font-bold text-third mb-4">
          카테고리 별로 비교해 드릴게요
        </h2>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex justify-start items-end space-x-6 h-72 overflow-x-auto pb-16 mb-32 px-6 cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          role="button"
          tabIndex={0}
        >
          {filteredData.map((category, index) => {
            const myAmount = category.myAmount || 0;
            const othersAvg = category.othersAvg || 0;

            const myHeight =
              myAmount === 0
                ? 3
                : globalMaxValue === 0
                ? minHeight
                : Math.max((myAmount / globalMaxValue) * maxHeight, minHeight);

            const othersHeight =
              othersAvg === 0
                ? 3
                : globalMaxValue === 0
                ? minHeight
                : Math.max((othersAvg / globalMaxValue) * maxHeight, minHeight);

            return (
              <div
                key={category.tcPk || index}
                className="flex flex-col items-center min-w-[80px]"
              >
                <div className="flex items-end space-x-0.5 mb-2">
                  <div className="flex flex-col items-center">
                    <div className="text-[13px] text-black mb-1 font-medium leading-tight text-center max-w-[80px] whitespace-nowrap">
                      {myAmount.toLocaleString()}원
                    </div>
                    <div
                      className="bg-group-3 rounded min-w-[40px] px-1"
                      style={{ height: `${myHeight}px` }}
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-[12px] text-black mb-1 leading-tight text-center max-w-[80px] whitespace-nowrap">
                      {othersAvg.toLocaleString()}원
                    </div>
                    <div
                      className={`${getCategoryColor(
                        category.tcCode
                      )} rounded min-w-[40px] px-1`}
                      style={{ height: `${othersHeight}px` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-1 font-medium leading-tight text-center">
                    {category.tcName || '기타'}
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

CategoryCompareSection.propTypes = {
  travel: PropTypes.shape({
    tpPk: PropTypes.number,
  }),
  groupid: PropTypes.string,
};

export default CategoryCompareSection;
