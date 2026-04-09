"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

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
  eachDayOfInterval,
} from "date-fns";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type CalendarTheme = {
  primary: string;
  primaryFixed: string;
  onPrimary: string;
  onPrimaryFixedVariant: string;
};

interface CalendarGridProps {
  viewDate: Date;
  setViewDate: (date: Date) => void;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  holidayDates: Set<string>;
  theme: CalendarTheme;
}

const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

export default function CalendarGrid({
  viewDate,
  setViewDate,
  range,
  onRangeChange,
  holidayDates,
  theme,
}: CalendarGridProps) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

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
      onRangeChange({ start: day, end: null });
    } else if (isBefore(day, range.start)) {
      onRangeChange({ start: day, end: null });
    } else {
      onRangeChange({ ...range, end: day });
    }
  };

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  const yearOptions = useMemo(() => {
    const currentYear = viewDate.getFullYear();
    return Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);
  }, [viewDate]);

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setIsYearDropdownOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewDate.toString()}
        initial={{ opacity: 0, y: 20, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: -20, rotateX: 10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full flex-1"
      >
        <div className="bg-surface-container-low p-6 md:p-8 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 relative">
              <h2 className="text-3xl font-headline font-semibold text-on-background">
                {format(viewDate, "MMMM")}
              </h2>
              <button
                onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                className="text-3xl font-headline font-semibold text-on-background hover:bg-surface-container-high px-2 py-1 rounded-lg transition-colors"
                title="Select year"
              >
                {format(viewDate, "yyyy")}
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-12 left-0 w-28 max-h-56 overflow-y-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-xl z-20">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-container-high transition-colors ${
                        year === viewDate.getFullYear() ? "font-bold text-primary" : "text-on-background"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center">
            {daysOfWeek.map((d) => (
              <span key={d} className="text-on-surface-variant font-label text-xs uppercase tracking-widest py-2">
                {d}
              </span>
            ))}

            {calendarDays.map((day) => {
              const isStart = range.start && isSameDay(day, range.start);
              const isEnd = range.end && isSameDay(day, range.end);
              const isInRange = range.start && range.end && isWithinInterval(day, { start: range.start, end: range.end });
              const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
              const hasHoliday = holidayDates.has(toDateKey(day));
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`h-16 md:h-24 flex items-center justify-center font-body text-lg relative cursor-pointer transition-colors ${!isCurrentMonth ? "opacity-30" : ""
                    } ${isInRange && !isStart && !isEnd
                      ? "bg-primary-fixed text-on-primary-fixed-variant"
                      : "hover:bg-surface-container-high rounded-full"
                    }`}
                >
                  {isStart || isEnd ? (
                    <div
                      className={`w-full h-full bg-primary text-on-primary flex items-center justify-center font-bold ${isStart && isEnd
                        ? "rounded-full"
                        : isStart
                          ? "rounded-l-full"
                          : "rounded-r-full"
                        }`}
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.onPrimary,
                      }}
                    >
                      {format(day, "d")}
                    </div>
                  ) : (
                    <span
                      className={isInRange ? "font-bold" : ""}
                      style={
                        {
                          backgroundColor: isInRange ? theme.primaryFixed : undefined,
                          color: isInRange ? theme.onPrimaryFixedVariant : undefined,
                          borderRadius: "9999px",
                          width: isInRange || isToday ? "2.5rem" : undefined,
                          height: isInRange || isToday ? "2.5rem" : undefined,
                          display: isInRange || isToday ? "flex" : undefined,
                          alignItems: isInRange || isToday ? "center" : undefined,
                          justifyContent: isInRange || isToday ? "center" : undefined,
                          border: isToday && !isInRange ? `2px solid ${theme.primary}` : undefined,
                          fontWeight: isToday && !isInRange ? 700 : undefined,
                        }
                      }
                      title={isToday ? "Today" : undefined}
                    >
                      {format(day, "d")}
                    </span>
                  )}

                  {hasHoliday && (
                    <span
                      className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      title="Holiday marker"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}