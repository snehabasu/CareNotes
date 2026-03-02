"use client";

type Props = {
  transcript: string;
};

export function ContextTab({ transcript }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-teal-dark/40 uppercase tracking-wider mb-3">
        Source Transcript (read-only)
      </h2>
      <blockquote className="bg-surface-card border border-surface-hover rounded-lg px-4 py-3 m-0 italic text-sm text-teal-dark leading-relaxed">
        {transcript}
      </blockquote>
    </section>
  );
}
