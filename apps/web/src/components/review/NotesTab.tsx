"use client";

import { useState, useCallback } from "react";
import type {
  FullCaseNote,
  SoapNote,
  PsychosocialAssessment,
  ConfidenceLevel,
} from "@civicguard/shared";
import { CopyIcon, CheckIcon } from "../icons";

type Props = {
  note: FullCaseNote;
  onNoteChange: (note: FullCaseNote) => void;
  approverName: string;
  onApproverNameChange: (name: string) => void;
  onApprove: () => void;
};

const SOAP_LABELS: Record<keyof SoapNote, string> = {
  subjective: "Subjective (client/caregiver reported)",
  objective: "Objective (clinician observations)",
  assessment: "Assessment (risk level & clinical impression)",
  plan: "Plan (interventions & follow-up)",
};

const PSYCH_LABELS: Record<keyof PsychosocialAssessment, string> = {
  crisisReason: "Crisis / Presenting Reason",
  substanceUse: "Substance Use",
  longevityOfIssues: "Longevity of Issues",
  aggressionHistory: "Aggression History",
  supportSystems: "Support Systems",
  pastInterventions: "Past Interventions",
};

const CONFIDENCE_COLOR: Record<ConfidenceLevel, string> = {
  high: "text-green-600",
  medium: "text-amber",
  low: "text-red-600",
  insufficient_data: "text-teal-dark/40",
};

/* ── Copy helper ── */
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  return { copiedKey, copy };
}

function CopyButton({
  label,
  copied,
  onClick,
}: {
  label: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
        copied
          ? "bg-green-50 text-green-600"
          : "bg-surface-card text-teal-dark/60 hover:bg-surface-hover"
      }`}
    >
      {copied ? (
        <>
          <CheckIcon size={12} /> Copied!
        </>
      ) : (
        <>
          <CopyIcon size={12} /> {label}
        </>
      )}
    </button>
  );
}

const textareaClass =
  "w-full px-3 py-2 rounded-lg border border-surface-hover bg-white text-sm text-teal-dark focus:ring-2 focus:ring-teal/30 outline-none resize-y";

export function NotesTab({
  note,
  onNoteChange,
  approverName,
  onApproverNameChange,
  onApprove,
}: Props) {
  const { copiedKey, copy } = useCopy();

  const setSoap = (field: keyof SoapNote, value: string) =>
    onNoteChange({ ...note, soap: { ...note.soap, [field]: value } });

  const setPsych = (field: keyof PsychosocialAssessment, value: string) =>
    onNoteChange({
      ...note,
      psychosocial: {
        ...note.psychosocial,
        [field]: { ...note.psychosocial[field], value },
      },
    });

  const canApprove = approverName.trim().length > 0;

  const soapText = (Object.keys(SOAP_LABELS) as Array<keyof SoapNote>)
    .map((f) => `${SOAP_LABELS[f]}:\n${note.soap[f]}`)
    .join("\n\n");

  return (
    <div className="space-y-8">
      {/* ── Narrative Summary ── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-teal-dark">
            Narrative Summary (Epic Format)
          </h3>
          <CopyButton
            label="Copy"
            copied={copiedKey === "narrative"}
            onClick={() => copy("narrative", note.narrativeSummary)}
          />
        </div>
        <textarea
          className={textareaClass}
          style={{ minHeight: 100 }}
          value={note.narrativeSummary}
          onChange={(e) =>
            onNoteChange({ ...note, narrativeSummary: e.target.value })
          }
        />
      </section>

      {/* ── SOAP Note ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-teal-dark">SOAP Note</h3>
          <CopyButton
            label="Copy All"
            copied={copiedKey === "soap"}
            onClick={() => copy("soap", soapText)}
          />
        </div>
        <div className="space-y-3">
          {(Object.keys(SOAP_LABELS) as Array<keyof SoapNote>).map((field) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-teal-dark/70 mb-1">
                {SOAP_LABELS[field]}
              </label>
              <textarea
                className={textareaClass}
                style={{ minHeight: 72 }}
                value={note.soap[field]}
                onChange={(e) => setSoap(field, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Psychosocial Assessment ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-teal-dark">
            Psychosocial Assessment
          </h3>
          <CopyButton
            label="Copy All"
            copied={copiedKey === "psych"}
            onClick={() =>
              copy(
                "psych",
                (
                  Object.keys(PSYCH_LABELS) as Array<
                    keyof PsychosocialAssessment
                  >
                )
                  .map(
                    (f) =>
                      `${PSYCH_LABELS[f]}: ${note.psychosocial[f].value}`,
                  )
                  .join("\n"),
              )
            }
          />
        </div>
        <div className="space-y-3">
          {(
            Object.keys(PSYCH_LABELS) as Array<keyof PsychosocialAssessment>
          ).map((field) => {
            const item = note.psychosocial[field];
            return (
              <div key={field}>
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-xs font-semibold text-teal-dark/70">
                    {PSYCH_LABELS[field]}
                  </label>
                  <span
                    className={`text-[11px] font-medium ${CONFIDENCE_COLOR[item.confidence]}`}
                  >
                    {item.confidence.replace("_", " ")}
                  </span>
                </div>
                <textarea
                  className={textareaClass}
                  style={{ minHeight: 60 }}
                  value={item.value}
                  onChange={(e) => setPsych(field, e.target.value)}
                />
                {item.omitted && (
                  <p className="text-xs text-teal-dark/40 mt-1">
                    Note: {item.omitReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── High-Stress / High-Risk Flags ── */}
      <section>
        <h3 className="text-sm font-semibold text-teal-dark mb-2">
          High-Stress / High-Risk Flags
        </h3>
        {note.stressFlags.length === 0 ? (
          <p className="text-sm text-teal-dark/40">
            No stress or risk indicators detected.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {note.stressFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`flex-shrink-0 text-xs font-bold mt-0.5 ${
                    flag.severity === "high"
                      ? "text-red-600"
                      : flag.severity === "medium"
                        ? "text-amber"
                        : "text-teal-dark/60"
                  }`}
                >
                  [{flag.severity.toUpperCase()}]
                </span>
                <span className="text-teal-dark">
                  <strong>{flag.keyword}</strong> — {flag.context}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Documentation Boundaries ── */}
      <section>
        <h3 className="text-sm font-semibold text-teal-dark mb-2">
          Documentation Boundaries
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-3">
          <p className="text-sm text-teal-dark m-0">
            <strong>Legal status:</strong>{" "}
            {note.boundaries.legalStatusOmitted
              ? "Legal/immigration status was present in the source and has been omitted from this documentation (as required)."
              : "No legal or immigration status references detected in source transcript."}
          </p>
        </div>

        {note.boundaries.overdocumentationWarnings.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-teal-dark mb-1">
              Content removed to prevent overdocumentation:
            </p>
            <ul className="list-disc pl-5 text-sm text-teal-dark space-y-0.5">
              {note.boundaries.overdocumentationWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {note.boundaries.insurancePhrasing.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-teal-dark mb-1">
              Insurance-relevant phrasing suggestions:
            </p>
            <ul className="list-disc pl-5 text-sm text-teal-dark/80 space-y-0.5">
              {note.boundaries.insurancePhrasing.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Clinician Approval ── */}
      <section className="border-t border-surface-hover pt-6">
        <h3 className="text-sm font-semibold text-teal-dark mb-2">
          Clinician Approval
        </h3>
        <p className="text-sm text-teal-dark/70 mb-4">
          By entering your name and clicking <strong>Approve</strong>, you
          confirm that you have reviewed this documentation, it accurately
          reflects the clinical encounter, and it is ready for Epic entry.
        </p>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-teal-dark/70 mb-1">
            Your name (required):
          </label>
          <input
            type="text"
            value={approverName}
            onChange={(e) => onApproverNameChange(e.target.value)}
            placeholder="Full name or credential (e.g. Jane Smith, LCSW)"
            className="w-full px-3 py-2 rounded-lg border border-surface-hover bg-white text-sm text-teal-dark outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
        <button
          disabled={!canApprove}
          onClick={onApprove}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            canApprove
              ? "bg-teal text-white hover:bg-teal-dark cursor-pointer"
              : "bg-teal-lighter text-teal-dark/40 cursor-not-allowed"
          }`}
        >
          Approve and Proceed to Export
        </button>
        {!canApprove && (
          <p className="text-xs text-teal-dark/40 mt-2">
            Enter your name above to enable approval.
          </p>
        )}
      </section>
    </div>
  );
}
