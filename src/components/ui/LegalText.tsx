/** Yönetim panelinden girilen düz metni paragraflara/başlıklara çevirir (satır başı "## " başlık, "- " madde). */
export function LegalText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-6 text-sm leading-relaxed text-ink-700 sm:p-8">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} className="mb-2 mt-6 text-lg font-bold text-ink-900 first:mt-0">{b.slice(3)}</h2>;
        if (b.startsWith("# ")) return <h2 key={i} className="mb-2 mt-6 text-xl font-extrabold text-ink-900 first:mt-0">{b.slice(2)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- ")))
          return (
            <ul key={i} className="my-3 list-disc space-y-1 pl-5">
              {lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}
            </ul>
          );
        return <p key={i} className="my-3 whitespace-pre-line">{b}</p>;
      })}
    </div>
  );
}
