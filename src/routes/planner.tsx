import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner · Sphe's Beauty Palace" },
      { name: "description", content: "Plan and prioritise your salon team's week with AI." },
      { property: "og:title", content: "AI Task Planner · Sphe's Beauty Palace" },
      { property: "og:description", content: "Plan and prioritise your salon team's week with AI." },
    ],
  }),
  component: () => (
    <AppShell title="AI Task Planner" subtitle="List your goals and let AI build a prioritised schedule.">
      <AiTool
        tool="planner"
        label="Goals & tasks"
        placeholder="e.g. Restock gel polish, train new lash tech, post 3 Instagram reels, prep for Saturday bridal party…"
        buttonText="Plan My Tasks"
      />
    </AppShell>
  ),
});
