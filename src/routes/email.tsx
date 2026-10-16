import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · Sphe's Beauty Palace" },
      { name: "description", content: "Draft professional salon emails in seconds with AI." },
      { property: "og:title", content: "Smart Email Generator · Sphe's Beauty Palace" },
      { property: "og:description", content: "Draft professional salon emails in seconds with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("Friendly");
  const [to, setTo] = useState("");
  return (
    <AppShell title="Smart Email Generator" subtitle="Describe what you need and get a ready-to-send email.">
      <AiTool
        tool="email"
        label="What should the email say?"
        placeholder="e.g. Remind Thandi her lash refill is tomorrow at 10am and ask her to confirm."
        buttonText="Generate Email"
        buildPrompt={(t) => `Recipient: ${to || "a client"}\nTone: ${tone}\nRequest: ${t}`}
        extra={
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-ui">Recipient</label>
              <input className="input-ui" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Client, supplier, staff…" />
            </div>
            <div>
              <label className="label-ui">Tone</label>
              <select className="input-ui" value={tone} onChange={(e) => setTone(e.target.value)}>
                {["Friendly", "Formal", "Apologetic", "Persuasive", "Celebratory"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        }
      />
    </AppShell>
  );
}
