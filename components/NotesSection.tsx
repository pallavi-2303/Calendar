"use client";

import React, { useState } from "react";
import { format } from "date-fns";

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

interface NotesSectionProps {
  currentDate: Date;
  selectedRange: DateRange;
  onSaveRangeNote: (text: string) => void;
  selectionNotes: SavedNote[];
}

const formatRangeLabel = (selectedRange: DateRange) => {
  if (!selectedRange.start) {
    return "No date selected";
  }

  const endDate = selectedRange.end ?? selectedRange.start;
  const sameDay = format(selectedRange.start, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");

  if (sameDay) {
    return format(selectedRange.start, "MMM d, yyyy");
  }

  return `${format(selectedRange.start, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
};

export default function NotesSection({
  currentDate,
  selectedRange,
  onSaveRangeNote,
  selectionNotes,
}: NotesSectionProps) {
  const [draftNote, setDraftNote] = useState("");
  const selectionLabel = formatRangeLabel(selectedRange);
  const hasSelection = Boolean(selectedRange.start);

  const handleSave = () => {
    const trimmed = draftNote.trim();
    if (!trimmed || !hasSelection) {
      return;
    }

    onSaveRangeNote(trimmed);
    setDraftNote("");
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)] min-h-[500px] flex flex-col">
      <h3 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">description</span>
        Notes for {format(currentDate, "MMMM")}
      </h3>

      <p className="text-sm text-on-surface-variant mb-4">
        Selection: <span className="font-semibold">{selectionLabel}</span>
      </p>

      <div className="ruled-lines h-[400px] font-body text-on-surface-variant flex-1">
        <textarea
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          placeholder="Add a note for the selected date or range..."
          className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-on-surface-variant leading-[2rem] placeholder:text-on-surface-variant/70"
        />
      </div>

      <div className="mt-8 border-t border-outline-variant/15 pt-6">
        <button
          onClick={handleSave}
          disabled={!hasSelection || !draftNote.trim()}
          className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Save Note to Selection
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">
          Notes on this selection
        </p>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {selectionNotes.length === 0 ? (
            <p className="text-sm text-on-surface-variant/70">No notes yet for this date range.</p>
          ) : (
            selectionNotes.map((note) => (
              <div key={note.id} className="rounded-lg bg-surface-container-low p-3">
                <p className="text-xs text-on-surface-variant/70 mb-1">
                  {note.start === note.end ? note.start : `${note.start} to ${note.end}`}
                </p>
                <p className="text-sm text-on-surface">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}