import { createServerFn } from "@tanstack/react-start";

type Tool = "email" | "notes" | "planner";

const SYSTEM: Record<Tool, string> = {
  email:
    "You write polished, warm, professional workplace emails for Sphe's Beauty Palace, a beauty salon (nails, hair, lashes). Return a subject line on the first line as 'Subject: ...', then the email body. No markdown.",
  notes:
    "You summarize meeting notes for Sphe's Beauty Palace salon staff. Return sections: Summary, Key Decisions, Action Items (with owner if mentioned), Follow-ups. Use short bullet points with '-'. No markdown headers symbols, just section titles followed by a colon.",
  planner:
    "You are an AI task planner for a beauty salon team. Turn the goals into a prioritized, time-boxed plan. Group by day or time block, mark priority (High/Medium/Low), and estimate durations. Use plain text with '-' bullets.",
};

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: { tool: Tool; prompt: string }) => {
    if (!["email", "notes", "planner"].includes(input.tool)) throw new Error("Invalid tool");
    if (!input.prompt || input.prompt.length > 8000) throw new Error("Please enter 1–8000 characters.");
    return input;
  })
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured.");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM[data.tool],
        input: data.prompt,
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) {
      const t = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Too many requests, please wait a moment.");
      if (res.status === 402) throw new Error("AI credits are used up for this workspace.");
      throw new Error(`AI request failed (${res.status}). ${t.slice(0, 200)}`);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let out = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") out += ev.delta;
        } catch {
          /* ignore */
        }
      }
    }
    return { text: out.trim() || "No response was generated." };
  });
