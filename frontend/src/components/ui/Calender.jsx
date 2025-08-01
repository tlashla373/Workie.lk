import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ 
  onDateSelect,
  onMonthChange,
  className = ""
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const generateCalendarDays = () => {
    const days = [];
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonth - i, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, isCurrentMonth: false });
    }

    return days;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (dateObj) => {
    if (dateObj.isCurrentMonth) {
      setSelectedDay(dateObj.day);
      if (onDateSelect) {
        onDateSelect(dateObj.day, currentDate);
      }
    }
  };

  useEffect(() => {
    if (onMonthChange) onMonthChange(currentDate);
  }, [currentDate]);

  return (
    <div className={`bg-white rounded-2xl p-2 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((dateObj, index) => {
          const isToday = 
            dateObj.day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear() &&
            dateObj.isCurrentMonth;

          return (
            <div 
              key={index}
              onClick={() => handleDateClick(dateObj)}
              className={`
                text-center py-2 text-sm rounded-lg transition-colors
                ${dateObj.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                ${isToday 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'}
                ${!dateObj.isCurrentMonth ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              {dateObj.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
