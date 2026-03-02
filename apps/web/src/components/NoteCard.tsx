"use client";

import type { MockNote } from "@/lib/mockNotes";

type Props = {
  note: MockNote;
};

export function NoteCard({ note }: Props) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors cursor-default">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-teal-dark/70 ${note.avatarColor}`}
      >
        {note.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-teal-dark truncate">
          {note.patientName}
        </p>
        <p className="text-xs text-teal-dark/50 truncate mt-0.5">
          {note.time} &middot; {note.tags.join(", ")}
        </p>
      </div>
    </div>
  );
}
