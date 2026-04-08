"use client";

import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isWithinInterval, 
  isBefore,
  eachDayOfInterval
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface CalendarGridProps {
  viewDate: Date;
  setViewDate: (date: Date) => void;
}

export default function CalendarGrid({ viewDate, setViewDate }: CalendarGridProps) {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handleDateClick = (day: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: day, end: null });
    } else if (isBefore(day, range.start)) {
      setRange({ start: day, end: null });
    } else {
      setRange({ ...range, end: day });
    }
  };

   const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  return (
    <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#001e2e] tracking-tight">
          {format(viewDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center">
        {daysOfWeek.map((d) => (
          <span key={d} className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            {d}
          </span>
        ))}

        {calendarDays.map((day) => {
          const isStart = range.start && isSameDay(day, range.start);
          const isEnd = range.end && isSameDay(day, range.end);
          const isInRange = range.start && range.end && isWithinInterval(day, { start: range.start, end: range.end });
          const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`h-12 md:h-20 flex items-center justify-center text-sm md:text-lg relative cursor-pointer transition-all
                ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                ${isInRange ? "bg-blue-50/50" : "hover:bg-slate-50 rounded-full"}
                ${isStart ? "bg-primary text-white rounded-l-full z-10 shadow-lg shadow-blue-900/20" : ""}
                ${isEnd ? "bg-primary text-white rounded-r-full z-10 shadow-lg shadow-blue-900/20" : ""}
                ${isStart && isEnd ? "rounded-full" : ""}
              `}
            >
              <span className={isStart || isEnd ? "font-bold" : ""}>
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}