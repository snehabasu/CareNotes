"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FullCaseNote, ApprovedCaseNote } from "@civicguard/shared";
import { ReviewSidebar } from "@/components/ReviewSidebar";
import { ContextTab } from "@/components/review/ContextTab";
import { NotesTab } from "@/components/review/NotesTab";
import { ChevronLeftIcon } from "@/components/icons";

type Tab = "context" | "notes";

export default function ReviewPage() {
  const [note, setNote] = useState<FullCaseNote | null>(null);
  const [approverName, setApproverName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingCaseNote");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setNote(JSON.parse(raw) as FullCaseNote);
    } catch {
      router.replace("/");
    }
  }, [router]);

  const handleApprove = () => {
    if (!note || !approverName.trim()) return;
    const approved: ApprovedCaseNote = {
      visitId: note.visitId,
      isDraft: false,
      approvedAtIso: new Date().toISOString(),
      approvedBy: approverName.trim(),
      narrativeSummary: note.narrativeSummary,
      soap: note.soap,
      psychosocial: note.psychosocial,
      stressFlags: note.stressFlags,
      boundaries: note.boundaries,
    };

    sessionStorage.removeItem("pendingCaseNote");
    sessionStorage.setItem("approvedCaseNote", JSON.stringify(approved));
    router.push("/export");
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-teal-dark/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Sidebar */}
      <ReviewSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-surface border-b border-surface-hover">
          <div className="flex items-center gap-3 px-4 h-16">
            {/* Mobile: back button */}
            <button
              onClick={() => router.push("/")}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-teal-dark/60"
            >
              <ChevronLeftIcon size={20} />
            </button>

            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-teal">Care</span>
              <span className="text-lg font-bold text-amber">Notes</span>
            </div>

            <div className="flex-1" />
          </div>
        </header>

        {/* Draft banner */}
        <div className="px-4 pt-4">
          <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-300 rounded-lg px-4 py-3">
            <p className="text-sm font-bold text-amber-800">
              {note.draftLabel}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Review each section carefully. Edit any inaccurate or missing
              information before approving. Do not submit to Epic until you have
              reviewed and approved this draft.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-4 pt-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface-card rounded-lg p-1 inline-flex">
              {(["context", "notes"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-white text-teal shadow-sm"
                      : "text-teal-dark/50 hover:text-teal-dark/70"
                  }`}
                >
                  {tab === "context" ? "Context" : "Notes"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-12">
          <div className="max-w-2xl mx-auto">
            {activeTab === "context" ? (
              <ContextTab transcript={note.transcript} />
            ) : (
              <NotesTab
                note={note}
                onNoteChange={setNote}
                approverName={approverName}
                onApproverNameChange={setApproverName}
                onApprove={handleApprove}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
