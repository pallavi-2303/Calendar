"use client";

import { format } from "date-fns";

type SidebarViewMode = "calendar" | "notes" | "tasks";

interface SidebarProps {
  toggle: boolean;
  setToggle: (val: boolean) => void;
  currentDate: Date;
  viewMode: SidebarViewMode;
  activePrimary: string;
  onViewModeChange: (mode: SidebarViewMode) => void;
  onAddHolidayMarkers: () => void;
  onClearSelection: () => void;
  canAddHoliday: boolean;
}

export default function Sidebar({
  currentDate,
  viewMode,
  activePrimary,
  onViewModeChange,
  onAddHolidayMarkers,
  onClearSelection,
  canAddHoliday,
  toggle,
  setToggle
}: SidebarProps) {
  return (
    <aside
      className={`
    fixed top-0 left-0 z-50 h-screen w-64 bg-surface-container-low
    pt-24 transition-transform duration-300
    ${toggle ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:flex flex-col
  `}
    >
      {" "}
      <button
  onClick={() => setToggle(false)}
  className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-high lg:hidden"
>
  <span className="material-symbols-outlined">close</span>
</button>
      <div className="px-6 mb-8">
        <h2 className="text-on-background font-bold font-headline text-xl">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <p className="text-on-surface-variant text-sm opacity-60">
          Productivity Cycle
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-4">
        <SidebarButton
          icon="calendar_month"
          label="Calendar"
          isActive={viewMode === "calendar"}
          activePrimary={activePrimary}
          onClick={() =>  onViewModeChange("calendar")}
        />
        <SidebarButton
          icon="edit_note"
          label="Notes"
          isActive={viewMode === "notes"}
          activePrimary={activePrimary}
          onClick={() => onViewModeChange("notes")}
        />
        <SidebarButton
          icon="event_note"
          label="Tasks/Events"
          isActive={viewMode === "tasks"}
          activePrimary={activePrimary}
          onClick={() => onViewModeChange("tasks")}
        />

        {/* <button className="flex items-center gap-4 px-4 py-3 text-on-background opacity-60 hover:text-primary transition-all">
          <span className="material-symbols-outlined">palette</span>
          <span>Themes</span>
        </button> */}
      </nav>
      <div className="mt-auto p-6 space-y-3">
        <button
          onClick={onAddHolidayMarkers}
          disabled={!canAddHoliday}
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: activePrimary,
            color: "#ffffff",
          }}
        >
          <span className="material-symbols-outlined">celebration</span>
          Add Holiday Marker
        </button>

        <button
          onClick={onClearSelection}
          className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">layers_clear</span>
          Clear Selection
        </button>
      </div>
    </aside>
  );
}

interface SidebarButtonProps {
  icon: string;
  label: string;
  isActive: boolean;
  activePrimary: string;
  onClick: () => void;
}

function SidebarButton({
  icon,
  label,
  isActive,
  activePrimary,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-l-xl transition-all ${
        isActive
          ? "font-bold bg-surface-container-lowest translate-x-1"
          : "text-on-background opacity-60 hover:text-primary"
      }`}
      style={{ color: isActive ? activePrimary : undefined }}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
