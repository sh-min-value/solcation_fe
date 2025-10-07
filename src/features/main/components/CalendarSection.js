import React from 'react';
import PropTypes from 'prop-types';

// 달력 상수
const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 그룹별 색상 캐시
const groupColorCache = {};

// 그룹 색상 반환
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

// 날짜별 이벤트 필터링
const getEventsForDate = (date, events) => {
  if (!events?.length) return [];

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const filteredEvents = events
    .map(event => {
      const startDate = new Date(event.tpStart);
      const endDate = new Date(event.tpEnd);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const isStartDate = targetDate.getTime() === startDate.getTime();
      const isEndDate = targetDate.getTime() === endDate.getTime();
      const isInRange = targetDate >= startDate && targetDate <= endDate;

      return isInRange
        ? {
            ...event,
            isStartDate,
            isEndDate,
          }
        : null;
    })
    .filter(Boolean);

  return filteredEvents.sort((a, b) => {
    const aStartDate = new Date(a.tpStart);
    const bStartDate = new Date(b.tpStart);
    return aStartDate.getTime() !== bStartDate.getTime()
      ? aStartDate.getTime() - bStartDate.getTime()
      : a.travelPk - b.travelPk;
  });
};

// 달력 날짜 생성
const generateCalendarDays = (year, month, events = []) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const calendarDays = [];

  // 이전 달 날짜
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i);
    calendarDays.push({
      date: prevMonthDay.getDate(),
      isCurrentMonth: false,
      isToday: false,
      fullDate: prevMonthDay,
      events: [],
    });
  }

  // 현재 달 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = getEventsForDate(date, events);
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday: date.toDateString() === TODAY.toDateString(),
      fullDate: date,
      events: dayEvents,
    });
  }

  // 다음 달 날짜
  const totalCells = calendarDays.length;
  const weeksNeeded = Math.ceil(totalCells / 7);
  const cellsNeeded = weeksNeeded * 7;
  const remainingCells = cellsNeeded - totalCells;

  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDay = new Date(year, month + 1, day);
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      fullDate: nextMonthDay,
      events: [],
    });
  }

  return calendarDays;
};

// 전역 변수
const TODAY = new Date();
const TODAY_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);

const CalendarSection = ({
  events = [],
  onDateSelect,
  selectedDates = [],
  isClickable = false,
  showNextMonth = false,
  showPrevMonth = false,
}) => {
  const [currentDate, setCurrentDate] = React.useState(() => TODAY_MONTH);
  const [tempStartDate, setTempStartDate] = React.useState(null);
  const [isSelectingEnd, setIsSelectingEnd] = React.useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = generateCalendarDays(year, month, events);

  const handlePrevMonth = () => {
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    if (currentMonth == TODAY_MONTH) {
      return;
    }

    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // 이전 달 버튼 비활성화 여부 확인
  const isPrevMonthDisabled = () => {
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    return currentMonth <= TODAY_MONTH;
  };

  const handleDateClick = dayInfo => {
    if (!dayInfo.isCurrentMonth || !isClickable || !isDateInRange(dayInfo))
      return;

    const clickedDate = dayInfo.fullDate;

    if (!tempStartDate) {
      // 첫 번째 클릭: 시작일 설정
      setTempStartDate(clickedDate);
      setIsSelectingEnd(true);
      onDateSelect(clickedDate);
    } else if (isSelectingEnd) {
      // 두 번째 클릭: 마감일 설정
      const startDate = tempStartDate;
      const endDate = clickedDate;

      if (clickedDate < startDate) {
        // 더 빠른 날짜를 클릭하면 시작일로 재설정
        setTempStartDate(clickedDate);
        onDateSelect(clickedDate);
      } else {
        // 마감일 설정 완료 - 시작일과 마감일만 전달
        onDateSelect([startDate, endDate]);
        setTempStartDate(null);
        setIsSelectingEnd(false);
      }
    }
  };

  const isDateSelected = dayInfo => {
    if (!dayInfo.isCurrentMonth || !selectedDates || selectedDates.length === 0)
      return false;

    const validDates = selectedDates.filter(
      date => date && typeof date.toDateString === 'function'
    );

    if (validDates.length === 0) return false;

    // 첫 번째 클릭만 있는 경우
    if (validDates.length === 1) {
      return dayInfo.fullDate.toDateString() === validDates[0].toDateString();
    }

    // 두 번째 클릭까지 있는 경우
    const startDate = new Date(Math.min(...validDates));
    const endDate = new Date(Math.max(...validDates));
    const currentDate = dayInfo.fullDate;

    // 시작일부터 마감일까지의 모든 날짜를 선택된 것으로 표시
    return currentDate >= startDate && currentDate <= endDate;
  };

  const isDateInRange = dayInfo => {
    if (!dayInfo.isCurrentMonth) return false;

    // 오늘 포함해서 선택 가능
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dayInfo.fullDate >= today;
  };

  const getSelectedDateStyle = dayInfo => {
    if (!isDateSelected(dayInfo)) return '';

    const validDates = selectedDates.filter(
      date => date && typeof date.toDateString === 'function'
    );

    if (validDates.length === 0) return '';

    // 첫 번째 클릭만 있는 경우
    if (validDates.length === 1) {
      return 'bg-secondary text-third font-bold rounded-full';
    }

    // 두 번째 클릭까지 있는 경우
    const startDate = new Date(Math.min(...validDates));
    const endDate = new Date(Math.max(...validDates));
    const currentDate = dayInfo.fullDate;

    const isStartDate = currentDate.toDateString() === startDate.toDateString();
    const isEndDate = currentDate.toDateString() === endDate.toDateString();
    const isOnlyDate = startDate.toDateString() === endDate.toDateString();

    if (isOnlyDate) {
      return 'bg-secondary text-third font-bold rounded-full';
    } else if (isStartDate) {
      return 'bg-secondary text-third font-bold rounded-l-full';
    } else if (isEndDate) {
      return 'bg-secondary text-third font-bold rounded-r-full';
    } else {
      return 'bg-secondary text-third font-bold';
    }
  };

  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-[14px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        {showPrevMonth && (
          <button
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled()}
            className={`p-2 rounded-full transition-colors ${
              isPrevMonthDisabled()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 cursor-pointer'
            }`}
            aria-label="이전 달"
          >
            <svg
              className={`w-5 h-5 ${
                isPrevMonthDisabled() ? 'text-gray-3' : 'text-gray-1'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <h2 className="text-xl font-bold text-gray-1">
          {year} {MONTH_NAMES[month]}
        </h2>

        {showNextMonth && (
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="다음 달"
          >
            <svg
              className="w-5 h-5 text-gray-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-2 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div
        className="grid grid-cols-7"
        role={isClickable ? 'application' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? '달력 날짜 선택 영역' : undefined}
      >
        {calendarDays.map((dayInfo, index) => {
          const isSelected = isDateSelected(dayInfo);
          const selectedStyle = getSelectedDateStyle(dayInfo);

          return (
            <div
              key={index}
              data-date={index}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable && dayInfo.isCurrentMonth ? 0 : -1}
              className={`
                 aspect-square flex items-center justify-center text-sm relative
                 ${
                   isClickable && isDateInRange(dayInfo)
                     ? 'cursor-pointer'
                     : 'cursor-default'
                 }
                 ${!isDateInRange(dayInfo) ? 'text-gray-500' : ''}
                 ${dayInfo.isToday ? 'font-bold' : ''}
                 ${isClickable ? 'focus:outline-none' : ''}
                 ${selectedStyle || (dayInfo.isCurrentMonth ? 'text-gray-1' : 'text-gray-5')}
               `}
              onClick={isClickable ? () => handleDateClick(dayInfo) : undefined}
              onKeyDown={
                isClickable
                  ? e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDateClick(dayInfo);
                      }
                    }
                  : undefined
              }
              aria-label={`${dayInfo.date}일 ${
                isSelected ? '선택됨' : '선택 가능'
              }`}
            >
              {dayInfo.events.length > 0 && !isSelected && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[30px]">
                  {dayInfo.events.map((event, eventIndex) => {
                    const getBorderRadiusClass = event => {
                      if (!event) return '';

                      let borderRadiusClass = '';
                      if (event.isStartDate && event.isEndDate) {
                        borderRadiusClass = 'rounded-[20px]'; // 당일치기
                      } else if (event.isEndDate) {
                        borderRadiusClass = 'rounded-r-[20px]'; // 종료일
                      } else if (event.isStartDate) {
                        borderRadiusClass = 'rounded-l-[20px]'; // 시작일
                      } else {
                        borderRadiusClass = 'rounded-none'; // 중간 날짜
                      }

                      return `font-semibold ${borderRadiusClass}`;
                    };

                    return (
                      <div
                        key={event.travelPk}
                        className={`absolute inset-x-0 ${getGroupColor(
                          event.groupPk
                        )} ${getBorderRadiusClass(event)}`}
                        style={{
                          height: '30px',
                          opacity: 1,
                          zIndex: dayInfo.events.length - eventIndex,
                        }}
                      />
                    );
                  })}
                </div>
              )}
              <span className="relative z-10">{dayInfo.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CalendarSection.propTypes = {
  events: PropTypes.array,
  onDateSelect: PropTypes.func,
  selectedDates: PropTypes.array,
  isClickable: PropTypes.bool,
  showNextMonth: PropTypes.bool,
  showPrevMonth: PropTypes.bool,
};

export default CalendarSection;
