import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { loadArchive, saveArchive, type ArchiveItem, type ArchiveKind } from "@/lib/archive";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive · Sphe's Beauty Palace" },
      { name: "description", content: "Browse past generated emails, summarized notes and planned tasks." },
      { property: "og:title", content: "Archive · Sphe's Beauty Palace" },
      { property: "og:description", content: "Browse past generated emails, summarized notes and planned tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArchivePage,
});

const TABS: { kind: ArchiveKind; label: string }[] = [
  { kind: "email", label: "✉ Sent Emails" },
  { kind: "notes", label: "✎ Summarized Notes" },
  { kind: "planner", label: "☑ Planned Tasks" },
];

function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [tab, setTab] = useState<ArchiveKind>("email");
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setItems(loadArchive()), []);

  const list = items.filter((i) => i.kind === tab);
  const remove = (id: string) => {
    const n = items.filter((i) => i.id !== id);
    setItems(n);
    saveArchive(n);
  };

  return (
    <AppShell title="Archive" subtitle="Everything your AI tools have created, saved in one place.">
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.kind} onClick={() => setTab(t.kind)} className={tab === t.kind ? "btn-primary" : "btn-ghost"}>
            {t.label} ({items.filter((i) => i.kind === t.kind).length})
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="card-ui text-sm text-muted-foreground">Nothing archived here yet — results are saved automatically when you use the tool.</div>
      ) : (
        <div className="space-y-3">
          {list.map((i) => (
            <div key={i.id} className="card-ui">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(open === i.id ? null : i.id)}>
                  <p className="truncate font-semibold">{i.output.split("\n")[0]}</p>
                  <p className="text-xs text-muted-foreground">{i.at}</p>
                </button>
                <div className="flex gap-2">
                  <button className="btn-ghost py-1 text-xs" onClick={() => navigator.clipboard.writeText(i.output)}>Copy</button>
                  <button className="btn-ghost py-1 text-xs" onClick={() => remove(i.id)}>Delete</button>
                </div>
              </div>
              {open === i.id && (
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl bg-muted p-3 text-xs">
                    <p className="label-ui">Request</p>
                    <pre className="whitespace-pre-wrap font-sans">{i.input}</pre>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{i.output}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
