'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodEntry, formatDateForDisplay } from '@/lib/moodStorage';

interface CalendarViewProps {
  entries: MoodEntry[];
  className?: string;
}

export default function CalendarView({ entries, className = '' }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date());
  
  // Create a map for quick entry lookup
  const entryMap = React.useMemo(() => {
    const map: { [date: string]: MoodEntry } = {};
    entries.forEach(entry => {
      map[entry.date] = entry;
    });
    return map;
  }, [entries]);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const entry = entryMap[dateString];
      
      days.push({
        date: new Date(currentDate),
        dateString,
        isCurrentMonth,
        isToday,
        entry,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = getCalendarDays();

  return (
    <Card className={`p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-orange-50 border-pink-100 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-pink-100"
            >
              <span className="text-lg">←</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="hover:bg-pink-100 text-sm"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-pink-100"
            >
              <span className="text-lg">→</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map(({ date, dateString, isCurrentMonth, isToday, entry }) => (
            <div
              key={dateString}
              className={`
                relative p-1 sm:p-2 min-h-[40px] sm:min-h-[50px] rounded-lg
                flex flex-col items-center justify-center
                transition-all duration-200
                ${isCurrentMonth ? 'bg-white/60' : 'bg-transparent'}
                ${isToday ? 'ring-2 ring-pink-300 bg-pink-100' : ''}
                ${entry ? 'hover:bg-white hover:shadow-md cursor-pointer' : ''}
              `}
              title={entry ? `${formatDateForDisplay(dateString)}: ${entry.note || 'No note'}` : undefined}
            >
              <span className={`
                text-sm font-medium
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                ${isToday ? 'text-pink-800' : ''}
              `}>
                {date.getDate()}
              </span>
              
              {entry && (
                <span className="text-lg sm:text-xl mt-1">
                  {entry.mood}
                </span>
              )}
              
              {isToday && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-pink-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-pink-500 rounded-full" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-lg">😊</span>
            <span>Has mood entry</span>
          </div>
        </div>
      </div>
    </Card>
  );
}