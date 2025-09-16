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

  return events
    .filter(event => {
      const startDate = new Date(event.tpStart);
      const endDate = new Date(event.tpEnd);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return targetDate >= startDate && targetDate <= endDate;
    })
    .map(event => {
      const startDate = new Date(event.tpStart);
      const endDate = new Date(event.tpEnd);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const isStartDate = targetDate.getTime() === startDate.getTime();
      const isEndDate = targetDate.getTime() === endDate.getTime();
      const targetDayOfWeek = targetDate.getDay();
      const isWeekStart = targetDayOfWeek === 0;
      const isWeekEnd = targetDayOfWeek === 6;
      const isEventContinuingFromPrevWeek =
        !isStartDate && targetDate > startDate;
      const isEventContinuingToNextWeek = !isEndDate && targetDate < endDate;
      const isEventStartingInCurrentWeekAndContinuingToNext =
        isStartDate && targetDate < endDate;
      const isNextWeekFirstDayOfContinuingEvent =
        !isStartDate && targetDate > startDate && isWeekStart;
      const isStartDateAndWeekEnd = isStartDate && isWeekEnd;

      return {
        ...event,
        isStartDate,
        isEndDate,
        isWeekStart,
        isWeekEnd,
        isEventContinuingFromPrevWeek,
        isEventContinuingToNextWeek,
        isEventStartingInCurrentWeekAndContinuingToNext,
        isNextWeekFirstDayOfContinuingEvent,
        isStartDateAndWeekEnd,
      };
    });
};

// 달력 날짜 생성
const generateCalendarDays = (year, month, events = []) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();
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
      isToday: date.toDateString() === today.toDateString(),
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

const CalendarSection = ({ events = [] }) => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = generateCalendarDays(year, month, events);

  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-[14px]">
      {/* 헤더 */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-1">
          {year} {MONTH_NAMES[month]}
        </h2>
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
      <div className="grid grid-cols-7">
        {calendarDays.map((dayInfo, index) => {
          // 이벤트 하이라이트 스타일
          const getEventHighlightStyle = () => {
            if (dayInfo.events.length === 0) return '';

            const firstEvent = dayInfo.events[0];
            let borderRadiusClass = '';

            // 당일치기
            if (firstEvent.isStartDate && firstEvent.isEndDate) {
              borderRadiusClass = 'rounded-[20px]';
            }
            // 종료일
            else if (firstEvent.isEndDate) {
              borderRadiusClass = 'rounded-r-[20px]';
            }
            // 시작일
            else if (firstEvent.isStartDate) {
              borderRadiusClass = 'rounded-l-[20px]';
            }
            // 중간 날짜
            else {
              borderRadiusClass = 'rounded-none';
            }

            return `font-semibold ${borderRadiusClass}`;
          };

          return (
            <div
              key={index}
              className={`
                 aspect-square flex items-center justify-center text-sm relative
               ${dayInfo.isCurrentMonth ? 'text-gray-1' : 'text-gray-3'}
               ${dayInfo.isToday ? 'font-bold' : ''}
               `}
              style={{}}
            >
              {dayInfo.events.length > 0 && (
                <div
                  className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[30px] ${getGroupColor(
                    dayInfo.events[0].groupPk
                  )} ${getEventHighlightStyle().split(' ')[1] || ''}`}
                />
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
};

export default CalendarSection;
