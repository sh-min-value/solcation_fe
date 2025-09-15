import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 색상 배열
const colors = [
  '#F08676',
  '#FBAA68',
  '#ECC369',
  '#A7C972',
  '#7DD1C1',
  '#7AA5E9',
];

// 인덱스에 따라 색상 반환
const getColorByIndex = index => {
  return colors[index % colors.length];
};

// 그룹 아이콘 컴포넌트
const GroupIcon = ({ gcCode }) => {
  const [iconSrc, setIconSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        if (gcCode) {
          const iconModule = await import(
            `../../assets/categoryIcons/${gcCode}.svg`
          );
          setIconSrc(iconModule.default);
        }
      } catch (error) {
        // 파일이 없으면 아무것도 표시하지 않음
        setIconSrc(null);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [gcCode]);

  if (loading) {
    return <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (iconSrc) {
    return <img src={iconSrc} alt={gcCode} className="w-4 h-4" />;
  }

  // 파일이 없으면 아무것도 표시하지 않음
  return null;
};

GroupIcon.propTypes = {
  gcCode: PropTypes.string,
};

const EventSection = ({ events = [], isLoading = false }) => {
  // 날짜 형식 변환 함수
  const formatDateRange = (tpStart, tpEnd) => {
    const startDate = new Date(tpStart);
    const endDate = new Date(tpEnd);

    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth}/${startDay} ~ ${startMonth}/${endDay}`;
    } else {
      return `${startMonth}/${startDay} ~ ${endMonth}/${endDay}`;
    }
  };

  return (
    <div className="bg-white rounded-xl px-[19px] py-4">
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
            <p className="text-gray-600">일정을 불러오는 중...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">일정이 없습니다</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg"
            >
              <div className="text-sm font-medium text-gray-800">
                {formatDateRange(event.tpStart, event.tpEnd)}
              </div>
              <div
                className="w-1 h-8 rounded"
                style={{ backgroundColor: getColorByIndex(index) }}
              ></div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {event.tpTitle}
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-1">
                  <GroupIcon gcCode={event.gcCode} />
                  <span>{event.groupName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

EventSection.propTypes = {
  events: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default EventSection;
