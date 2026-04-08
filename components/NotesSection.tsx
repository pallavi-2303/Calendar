"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

interface NotesSectionProps {
  currentDate: Date;
}

export default function NotesSection({ currentDate }: NotesSectionProps) {
  const [notes, setNotes] = useState<string>("");

  // Load notes from localStorage whenever the month changes
  useEffect(() => {
    const storageKey = `notes-${format(currentDate, "MMM-yyyy")}`;
    const saved = localStorage.getItem(storageKey);
    setNotes(saved || "");
  }, [currentDate]);

  // Save notes to localStorage 
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    const storageKey = `notes-${format(currentDate, "MMM-yyyy")}`;
    localStorage.setItem(storageKey, value);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-xl font-bold text-[#001e2e] mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-primary rounded-full" />
        Monthly Memos
      </h3>
      
      <div className="relative flex-1">
        {/* The "Ruled Line" Aesthetic */}
        <textarea
          value={notes}
          onChange={handleNoteChange}
          placeholder="Jot down your goals for this month..."
          className="w-full h-64 lg:h-full bg-transparent border-none resize-none focus:ring-0 italic text-slate-600 leading-[2rem] placeholder:text-slate-300"
          style={{
            backgroundImage: "linear-gradient(transparent, transparent 31px, #e2e8f0 31px)",
            backgroundSize: "100% 32px",
          }}
        />
      </div>
      
      <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
        Auto-saved to local storage
      </p>
    </div>
  );
}