import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CalendarSection = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫째 날과 마지막 날 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 달력에 표시할 날짜들 생성
  const calendarDays = [];

  // 빈칸 채우기 용도 이전 달의 마지막 날들
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i);
    calendarDays.push({
      date: prevMonthDay.getDate(),
      isCurrentMonth: false,
      isToday: false,
      fullDate: prevMonthDay,
    });
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const today = new Date();
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      fullDate: date,
    });
  }

  // 빈칸 채우기 용도 다음 달의 첫째 날들
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
    });
  }

  // 월 이름 배열
  const monthNames = [
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

  // 요일 배열
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl px-[19px] py-4 mb-[14px]">
      {/* 달력 헤더 */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {year} {monthNames[month]}
        </h2>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={`
               aspect-square flex items-center justify-center text-sm rounded-lg
               ${dayInfo.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
               ${
                 dayInfo.isToday
                   ? 'bg-blue-100 text-blue-800 font-semibold'
                   : ''
               }
             `}
          >
            {dayInfo.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSection;
