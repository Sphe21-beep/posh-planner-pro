import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAiTool } from "@/lib/ai.functions";
import { addToArchive } from "@/lib/archive";

export function AiTool({
  tool,
  label,
  placeholder,
  buttonText,
  buildPrompt,
  extra,
}: {
  tool: "email" | "notes" | "planner";
  label: string;
  placeholder: string;
  buttonText: string;
  buildPrompt?: (text: string) => string;
  extra?: React.ReactNode;
}) {
  const run = useServerFn(runAiTool);
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    setErr("");
    setOut("");
    try {
      const prompt = buildPrompt ? buildPrompt(text) : text;
      const r = await run({ data: { tool, prompt } });
      setOut(r.text);
      addToArchive(tool, prompt, r.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card-ui space-y-4">
        {extra}
        <div>
          <label className="label-ui">{label}</label>
          <textarea className="input-ui min-h-56" placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button className="btn-primary w-full" disabled={loading || !text.trim()} onClick={go}>
          {loading ? "Working its magic…" : `✨ ${buttonText}`}
        </button>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </div>
      <div className="card-ui bg-gradient-soft">
        <div className="mb-3 flex items-center justify-between">
          <span className="label-ui">AI Result</span>
          {out && (
            <button className="btn-ghost py-1 text-xs" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
          )}
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {out || (loading ? "Generating…" : "Your result will appear here.")}
        </pre>
      </div>
    </div>
  );
}
