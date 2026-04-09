"use client";

import { useEffect, useMemo, useState } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from "date-fns";
import NotesSection from "@/components/NotesSection";
import CalenderGrid from "@/components/CalenderGrid";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import TaskEventModal from "@/components/TaskEventModal";

type ViewMode = "calendar" | "notes" | "tasks";
type TaskFilterMode = "month" | "all";
type NotesFilterMode = "month" | "all";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type SavedNote = {
  id: string;
  start: string;
  end: string;
  text: string;
  createdAt: string;
};

type TaskEvent = {
  id: string;
  title: string;
  details: string;
  kind: "task" | "event";
  start: string;
  end: string;
  createdAt: string;
  completed: boolean;
};

type MonthTheme = {
  heroImage: string;
  primary: string;
  primaryContainer: string;
  primaryFixed: string;
  onPrimary: string;
  onPrimaryContainer: string;
  onPrimaryFixedVariant: string;
};

const NOTES_STORAGE_KEY = "ephemera-range-notes-v1";
const HOLIDAYS_STORAGE_KEY = "ephemera-holidays-v1";
const TASKS_STORAGE_KEY = "ephemera-tasks-events-v1";

const monthThemes: MonthTheme[] = [
  {
    heroImage:
      "https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?auto=format&fit=crop&w=1800&q=80",
    primary: "#00628b",
    primaryContainer: "#007cae",
    primaryFixed: "#c7e7ff",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fcfcff",
    onPrimaryFixedVariant: "#004c6c",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=1800&q=80",
    primary: "#375f85",
    primaryContainer: "#45759f",
    primaryFixed: "#d5e6f8",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#ffffff",
    onPrimaryFixedVariant: "#1f4568",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=80",
    primary: "#206f63",
    primaryContainer: "#2f8d7f",
    primaryFixed: "#c7f1e7",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#f6fffc",
    onPrimaryFixedVariant: "#115548",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=80",
    primary: "#2c7b61",
    primaryContainer: "#389373",
    primaryFixed: "#c9f0da",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#f7fff9",
    onPrimaryFixedVariant: "#145541",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1800&q=80",
    primary: "#4f7a31",
    primaryContainer: "#699745",
    primaryFixed: "#e1f3c7",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#f8fff0",
    onPrimaryFixedVariant: "#33541a",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1472393365320-db77a5abbecc?auto=format&fit=crop&w=1800&q=80",
    primary: "#9c5b1f",
    primaryContainer: "#b76f2b",
    primaryFixed: "#ffe1c4",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff8f1",
    onPrimaryFixedVariant: "#6f3f12",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80",
    primary: "#ab4a2b",
    primaryContainer: "#c95d39",
    primaryFixed: "#ffd9ca",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff7f4",
    onPrimaryFixedVariant: "#7e2e16",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1800&q=80",
    primary: "#a24555",
    primaryContainer: "#bd586a",
    primaryFixed: "#ffd7de",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff7f8",
    onPrimaryFixedVariant: "#7d2b3b",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1800&q=80",
    primary: "#8e5e16",
    primaryContainer: "#a9761f",
    primaryFixed: "#ffe4bc",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff9f2",
    onPrimaryFixedVariant: "#623d08",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
    primary: "#705534",
    primaryContainer: "#886744",
    primaryFixed: "#f0decb",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff9f3",
    onPrimaryFixedVariant: "#4e381f",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80",
    primary: "#3e5f77",
    primaryContainer: "#507991",
    primaryFixed: "#d3e7f5",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#f7fcff",
    onPrimaryFixedVariant: "#244963",
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1800&q=80",
    primary: "#2f6587",
    primaryContainer: "#3d7ca5",
    primaryFixed: "#cbe7fa",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#f4fbff",
    onPrimaryFixedVariant: "#124d70",
  },
];

const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

const normalizeRange = (range: DateRange) => {
  if (!range.start) {
    return null;
  }

  const end = range.end ?? range.start;
  return range.start <= end
    ? { start: range.start, end }
    : { start: end, end: range.start };
};

const doesOverlap = (
  noteStart: string,
  noteEnd: string,
  selectedStart: string,
  selectedEnd: string,
) => !(noteEnd < selectedStart || noteStart > selectedEnd);

const rangeLabel = (start: string, end: string) =>
  start === end ? start : `${start} to ${end}`;

const normalizeStoredTaskEvents = (items: TaskEvent[]) => {
  return items.map((item) => ({
    ...item,
    completed: Boolean(item.completed),
  }));
};

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [toggle, settoggle] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [holidayDates, setHolidayDates] = useState<string[]>([]);
  const [taskEvents, setTaskEvents] = useState<TaskEvent[]>([]);
  const [notesFilterMode, setNotesFilterMode] =
    useState<NotesFilterMode>("month");
  const [taskFilterMode, setTaskFilterMode] = useState<TaskFilterMode>("month");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDetails, setDraftDetails] = useState("");
  const [draftKind, setDraftKind] = useState<"task" | "event">("task");

  useEffect(() => {
    const rawNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    const rawHolidays = localStorage.getItem(HOLIDAYS_STORAGE_KEY);
    const rawTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (rawNotes) {
      try {
        setSavedNotes(JSON.parse(rawNotes) as SavedNote[]);
      } catch {
        setSavedNotes([]);
      }
    }

    if (rawHolidays) {
      try {
        setHolidayDates(JSON.parse(rawHolidays) as string[]);
      } catch {
        setHolidayDates([]);
      }
    }

    if (rawTasks) {
      try {
        const parsed = JSON.parse(rawTasks) as TaskEvent[];
        setTaskEvents(normalizeStoredTaskEvents(parsed));
      } catch {
        setTaskEvents([]);
      }
    }
  }, []);

  const activeTheme = monthThemes[currentDate.getMonth()];
  const holidaySet = useMemo(() => new Set(holidayDates), [holidayDates]);
  const sidebarToggle = () => {
    settoggle(!toggle);
  };

  const normalizedSelection = useMemo(
    () => normalizeRange(selectedRange),
    [selectedRange],
  );

  const selectionNotes = useMemo(() => {
    if (!normalizedSelection) {
      return [];
    }

    const selectedStart = toDateKey(normalizedSelection.start);
    const selectedEnd = toDateKey(normalizedSelection.end);

    return savedNotes.filter((note) =>
      doesOverlap(note.start, note.end, selectedStart, selectedEnd),
    );
  }, [normalizedSelection, savedNotes]);

  const monthNotes = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthStartKey = toDateKey(monthStart);
    const monthEndKey = toDateKey(monthEnd);

    return savedNotes
      .filter((note) =>
        doesOverlap(note.start, note.end, monthStartKey, monthEndKey),
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [currentDate, savedNotes]);

  const allNotes = useMemo(() => {
    return [...savedNotes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [savedNotes]);

  const filteredNotes = useMemo(() => {
    return notesFilterMode === "all" ? allNotes : monthNotes;
  }, [notesFilterMode, allNotes, monthNotes]);

  const monthTaskEvents = useMemo(() => {
    return taskEvents
      .filter((item) => {
        const start = parseISO(item.start);
        return isSameMonth(start, currentDate);
      })
      .sort((a, b) => (a.start > b.start ? 1 : -1));
  }, [taskEvents, currentDate]);

  const filteredTaskEvents = useMemo(() => {
    return taskFilterMode === "all" ? taskEvents : monthTaskEvents;
  }, [taskFilterMode, taskEvents, monthTaskEvents]);

  const totalTasksCount = useMemo(
    () => taskEvents.filter((item) => item.kind === "task").length,
    [taskEvents],
  );

  const completedTasksCount = useMemo(
    () =>
      taskEvents.filter((item) => item.kind === "task" && item.completed)
        .length,
    [taskEvents],
  );

  const persistNotes = (notes: SavedNote[]) => {
    setSavedNotes(notes);
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
  };

  const persistHolidays = (markers: string[]) => {
    setHolidayDates(markers);
    if (typeof window !== "undefined") {
      localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(markers));
    }
  };

  const persistTaskEvents = (items: TaskEvent[]) => {
    setTaskEvents(items);
    if (typeof window !== "undefined") {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(items));
    }
  };

  const handleSaveRangeNote = (text: string) => {
    const selection = normalizeRange(selectedRange);
    if (!selection) {
      return;
    }

    const entry: SavedNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      start: toDateKey(selection.start),
      end: toDateKey(selection.end),
      text,
      createdAt: new Date().toISOString(),
    };

    persistNotes([entry, ...savedNotes]);
  };

  const addHolidayMarkers = () => {
    const selection = normalizeRange(selectedRange);
    if (!selection) {
      return;
    }

    const markers = eachDayOfInterval({
      start: selection.start,
      end: selection.end,
    }).map((date) => toDateKey(date));
    const unique = Array.from(new Set([...holidayDates, ...markers]));
    persistHolidays(unique);
  };

  const clearSelection = () => setSelectedRange({ start: null, end: null });

  const addTaskOrEvent = () => {
    const title = draftTitle.trim();
    if (!title) {
      return;
    }

    const normalized = normalizeRange(selectedRange);
    const start = normalized
      ? toDateKey(normalized.start)
      : toDateKey(currentDate);
    const end = normalized ? toDateKey(normalized.end) : start;

    const newItem: TaskEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      details: draftDetails.trim(),
      kind: draftKind,
      start,
      end,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    persistTaskEvents([newItem, ...taskEvents]);
    setDraftTitle("");
    setDraftDetails("");
    setDraftKind("task");
    setIsTaskModalOpen(false);
    setViewMode("tasks");
  };

  const toggleTaskCompletion = (id: string) => {
    const updated = taskEvents.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    persistTaskEvents(updated);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#ffffffcc] backdrop-blur-md rounded-b-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)]">
        <button onClick={sidebarToggle}>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu-icon lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[#191c1d] font-bold text-xl font-headline tracking-tight">
            Pallavi's Calendar
          </span>
        </div>

        {/* <div className="hidden md:flex gap-8 items-center">
          <button className="text-[#191c1d] opacity-70 font-headline font-semibold tracking-tight hover:bg-[#f2f4f5] transition-colors px-3 py-1 rounded-lg">
            Year View
          </button>
          <button className="text-[#191c1d] opacity-70 font-headline font-semibold tracking-tight hover:bg-[#f2f4f5] transition-colors px-3 py-1 rounded-lg">
            Print
          </button>
          <button className="text-[#191c1d] opacity-70 font-headline font-semibold tracking-tight hover:bg-[#f2f4f5] transition-colors px-3 py-1 rounded-lg">
            Settings
          </button>
        </div> */}

        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2 rounded-xl font-bold transition-colors scale-95 duration-200 ease-in-out"
            style={{
              backgroundColor: activeTheme.primary,
              color: activeTheme.onPrimary,
            }}
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
          <div className="flex gap-2">
            <span
              className="material-symbols-outlined cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors"
              style={{ color: activeTheme.primary }}
            >
              calendar_today
            </span>
            <span
              className="material-symbols-outlined cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors"
              style={{ color: activeTheme.primary }}
            >
              share
            </span>
          </div>
        </div>
      </nav>

      <Sidebar
        toggle ={toggle}
        setToggle={settoggle} 
        currentDate={currentDate}
        viewMode={viewMode}
        activePrimary={activeTheme.primary}
        onViewModeChange={setViewMode}
        onAddHolidayMarkers={addHolidayMarkers}
        onClearSelection={clearSelection}
        canAddHoliday={Boolean(selectedRange.start)}
      />

      <main className="pt-24 pb-12 px-4 md:px-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto space-y-8">
          <Hero
            currentDate={currentDate}
            heroImage={activeTheme.heroImage}
            primary={activeTheme.primary}
            onPrimary={activeTheme.onPrimary}
          />

          {viewMode === "calendar" ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <CalenderGrid
                    viewDate={currentDate}
                    setViewDate={setCurrentDate}
                    range={selectedRange}
                    onRangeChange={setSelectedRange}
                    holidayDates={holidaySet}
                    theme={{
                      primary: activeTheme.primary,
                      primaryFixed: activeTheme.primaryFixed,
                      onPrimary: activeTheme.onPrimary,
                      onPrimaryFixedVariant: activeTheme.onPrimaryFixedVariant,
                    }}
                  />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <NotesSection
                    currentDate={currentDate}
                    selectedRange={selectedRange}
                    onSaveRangeNote={handleSaveRangeNote}
                    selectionNotes={selectionNotes}
                  />

                  <div
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: activeTheme.primaryContainer,
                      color: activeTheme.onPrimaryContainer,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-headline font-bold text-lg">
                        Focus of the Month
                      </h4>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">
                      Theme auto-switches by month and hero image. Select one
                      day or a range, add holiday markers, and save notes linked
                      to those dates.
                    </p>
                  </div>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                  icon="list_alt"
                  label="Total Tasks"
                  value={String(totalTasksCount)}
                  primary={activeTheme.primary}
                />
                <DashboardCard
                  icon="check_circle"
                  label="Completed Tasks"
                  value={String(completedTasksCount)}
                  primary={activeTheme.primary}
                />
              </section>
            </>
          ) : viewMode === "notes" ? (
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-3xl font-bold text-on-background">
                  Notes Archive
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {notesFilterMode === "all"
                    ? `${allNotes.length} total notes`
                    : `${monthNotes.length} notes for ${format(currentDate, "MMMM yyyy")}`}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setNotesFilterMode("month")}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor:
                      notesFilterMode === "month"
                        ? activeTheme.primaryFixed
                        : "#e6e8e9",
                    color:
                      notesFilterMode === "month"
                        ? activeTheme.onPrimaryFixedVariant
                        : "#3f484f",
                  }}
                >
                  Current Month
                </button>
                <button
                  onClick={() => setNotesFilterMode("all")}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor:
                      notesFilterMode === "all"
                        ? activeTheme.primaryFixed
                        : "#e6e8e9",
                    color:
                      notesFilterMode === "all"
                        ? activeTheme.onPrimaryFixedVariant
                        : "#3f484f",
                  }}
                >
                  All
                </button>
              </div>

              <div className="space-y-4">
                {filteredNotes.length === 0 ? (
                  <p className="text-on-surface-variant">
                    No saved notes found for this view. Go to Calendar, select
                    date(s), and save notes.
                  </p>
                ) : (
                  filteredNotes.map((note) => {
                    const start = parseISO(note.start);
                    const end = parseISO(note.end);
                    const hasHolidayInRange = holidayDates.some((holiday) =>
                      isWithinInterval(parseISO(holiday), { start, end }),
                    );

                    return (
                      <article
                        key={note.id}
                        className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30"
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <p className="text-sm font-semibold text-on-background">
                            {rangeLabel(note.start, note.end)}
                          </p>
                          {hasHolidayInRange && (
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: activeTheme.primaryFixed,
                                color: activeTheme.onPrimaryFixedVariant,
                              }}
                            >
                              Holiday marked
                            </span>
                          )}
                        </div>
                        <p className="text-on-surface-variant">{note.text}</p>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          ) : (
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-3xl font-bold text-on-background">
                  Tasks & Events
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {taskFilterMode === "all"
                    ? `${taskEvents.length} total items`
                    : `${monthTaskEvents.length} items for ${format(currentDate, "MMMM yyyy")}`}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setTaskFilterMode("month")}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor:
                      taskFilterMode === "month"
                        ? activeTheme.primaryFixed
                        : "#e6e8e9",
                    color:
                      taskFilterMode === "month"
                        ? activeTheme.onPrimaryFixedVariant
                        : "#3f484f",
                  }}
                >
                  Current Month
                </button>
                <button
                  onClick={() => setTaskFilterMode("all")}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor:
                      taskFilterMode === "all"
                        ? activeTheme.primaryFixed
                        : "#e6e8e9",
                    color:
                      taskFilterMode === "all"
                        ? activeTheme.onPrimaryFixedVariant
                        : "#3f484f",
                  }}
                >
                  All
                </button>
              </div>

              <div className="space-y-4">
                {filteredTaskEvents.length === 0 ? (
                  <p className="text-on-surface-variant">
                    No tasks/events found for this view. Click the + button to
                    add one.
                  </p>
                ) : (
                  filteredTaskEvents.map((item) => (
                    <article
                      key={item.id}
                      className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30"
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p
                          className={`text-sm font-semibold ${
                            item.completed
                              ? "text-on-surface-variant line-through"
                              : "text-on-background"
                          }`}
                        >
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-1 rounded-full uppercase tracking-wide"
                            style={{
                              backgroundColor: activeTheme.primaryFixed,
                              color: activeTheme.onPrimaryFixedVariant,
                            }}
                          >
                            {item.kind}
                          </span>
                          {item.completed && (
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">
                        {rangeLabel(item.start, item.end)}
                      </p>
                      {item.details ? (
                        <p className="text-on-surface-variant">
                          {item.details}
                        </p>
                      ) : null}
                      <div className="mt-3">
                        <button
                          onClick={() => toggleTaskCompletion(item.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                          style={{
                            backgroundColor: item.completed
                              ? "#fee2e2"
                              : activeTheme.primaryFixed,
                            color: item.completed
                              ? "#b91c1c"
                              : activeTheme.onPrimaryFixedVariant,
                          }}
                        >
                          {item.completed
                            ? "Mark Incomplete"
                            : "Mark Completed"}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50"
        style={{
          backgroundColor: activeTheme.primary,
          color: activeTheme.onPrimary,
        }}
      >
        <span
          className="material-symbols-outlined text-3xl"
          style={{ fontVariationSettings: "'FILL' 0", fontWeight: 700 }}
        >
          add
        </span>
      </button>

      <TaskEventModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={addTaskOrEvent}
        draftTitle={draftTitle}
        setDraftTitle={setDraftTitle}
        draftDetails={draftDetails}
        setDraftDetails={setDraftDetails}
        draftKind={draftKind}
        setDraftKind={setDraftKind}
        activePrimary={activeTheme.primary}
        activePrimaryFixed={activeTheme.primaryFixed}
        activeOnPrimary={activeTheme.onPrimary}
        activeOnPrimaryFixedVariant={activeTheme.onPrimaryFixedVariant}
        appliesToLabel={
          normalizedSelection
            ? rangeLabel(
                toDateKey(normalizedSelection.start),
                toDateKey(normalizedSelection.end),
              )
            : toDateKey(currentDate)
        }
      />
    </>
  );
}

function DashboardCard({
  icon,
  label,
  value,
  primary,
}: {
  icon: string;
  label: string;
  value: string;
  primary: string;
}) {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-4">
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${primary}22`, color: primary }}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
