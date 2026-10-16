import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer · Sphe's Beauty Palace" },
      { name: "description", content: "Turn messy meeting notes into clear decisions and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer · Sphe's Beauty Palace" },
      { property: "og:description", content: "Turn messy meeting notes into clear decisions and action items." },
    ],
  }),
  component: () => (
    <AppShell title="Meeting Notes Summarizer" subtitle="Paste your notes — get a summary, decisions and action items.">
      <AiTool
        tool="notes"
        label="Meeting notes"
        placeholder="Paste your staff meeting notes here…"
        buttonText="Summarize Notes"
      />
    </AppShell>
  ),
});
