"use client";

interface TaskEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  draftTitle: string;
  setDraftTitle: (value: string) => void;
  draftDetails: string;
  setDraftDetails: (value: string) => void;
  draftKind: "task" | "event";
  setDraftKind: (value: "task" | "event") => void;
  activePrimary: string;
  activePrimaryFixed: string;
  activeOnPrimary: string;
  activeOnPrimaryFixedVariant: string;
  appliesToLabel: string;
}

export default function TaskEventModal({
  isOpen,
  onClose,
  onSave,
  draftTitle,
  setDraftTitle,
  draftDetails,
  setDraftDetails,
  draftKind,
  setDraftKind,
  activePrimary,
  activePrimaryFixed,
  activeOnPrimary,
  activeOnPrimaryFixedVariant,
  appliesToLabel,
}: TaskEventModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-headline text-2xl font-bold">Add Task / Event</h4>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant">Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDraftKind("task")}
              className="px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor:
                  draftKind === "task" ? activePrimaryFixed : "#e6e8e9",
                color:
                  draftKind === "task"
                    ? activeOnPrimaryFixedVariant
                    : "#3f484f",
              }}
            >
              Task
            </button>
            <button
              onClick={() => setDraftKind("event")}
              className="px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor:
                  draftKind === "event" ? activePrimaryFixed : "#e6e8e9",
                color:
                  draftKind === "event"
                    ? activeOnPrimaryFixedVariant
                    : "#3f484f",
              }}
            >
              Event
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant">Title</label>
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full rounded-xl px-4 py-3 bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-2"
            style={{
              boxShadow: `inset 0 0 0 1px ${activePrimary}22`,
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant">Details</label>
          <textarea
            value={draftDetails}
            onChange={(e) => setDraftDetails(e.target.value)}
            placeholder="Optional details"
            className="w-full rounded-xl px-4 py-3 h-28 bg-surface-container-low border border-outline-variant/40 resize-none focus:outline-none"
          />
        </div>

        <p className="text-xs text-on-surface-variant">Applies to: {appliesToLabel}</p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!draftTitle.trim()}
            className="px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: activePrimary, color: activeOnPrimary }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
