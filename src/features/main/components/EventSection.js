import React from 'react';
import PropTypes from 'prop-types';
import { getGroupCategoryIcon } from '../../../utils/CategoryIcons';

// 그룹별 색상 캐시
const groupColorCache = {};

// 그룹 색상 반환 (동적 할당)
const getGroupColor = groupPk => {
  if (!groupPk) return 'bg-group-1';

  // 캐시에 있으면 반환
  if (groupColorCache[groupPk]) {
    return groupColorCache[groupPk];
  }

  // 새로운 그룹에 색상 할당
  const colorIndex = Object.keys(groupColorCache).length % 6;
  const colorClass = `bg-group-${colorIndex + 1}`;
  groupColorCache[groupPk] = colorClass;

  return groupColorCache[groupPk];
};

// 로딩 스피너
const LoadingSpinner = ({
  size = 'h-6 w-6',
  text = '일정을 불러오는 중...',
}) => (
  <div className="text-center py-8">
    <div
      className={`animate-spin rounded-full ${size} border-b-2 border-gray-2 mx-auto mb-2`}
    ></div>
    <p className="text-gray-2">{text}</p>
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  text: PropTypes.string,
};

// 날짜 범위 포맷팅
const formatDateRange = (tpStart, tpEnd) => {
  const startDate = new Date(tpStart);
  const endDate = new Date(tpEnd);
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
  const startDay = String(startDate.getDate()).padStart(2, '0');
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDate.getDate()).padStart(2, '0');

  return startMonth === endMonth
    ? `${startMonth}/${startDay} ~ ${startMonth}/${endDay}`
    : `${startMonth}/${startDay} ~ ${endMonth}/${endDay}`;
};

// 그룹 아이콘
const GroupIcon = ({ gcCode }) => {
  const iconSrc = getGroupCategoryIcon(gcCode);
  return iconSrc ? (
    <img src={iconSrc} alt={gcCode} className="w-4 h-4 opacity-50" />
  ) : null;
};

GroupIcon.propTypes = {
  gcCode: PropTypes.string,
};

const EventSection = ({ events = [], isLoading = false }) => {
  return (
    <div className="bg-white rounded-xl px-[19px] py-4">
      <div className="space-y-3">
        {isLoading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-2">일정이 없습니다</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white rounded-xl"
            >
              <div className="w-24 text-sm font-bold text-gray-1 flex-shrink-0">
                {formatDateRange(event.tpStart, event.tpEnd)}
              </div>
              <div
                className={`w-1 h-8 rounded mx-3 flex-shrink-0 ${getGroupColor(
                  event.groupPk
                )}`}
              ></div>
              <div className="flex-1">
                <div className="font-semibold text-gray-1">{event.tpTitle}</div>
                <div className="text-sm text-gray-2 flex items-center space-x-1">
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
