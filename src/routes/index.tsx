import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import nails from "@/assets/nails.jpg";
import hair from "@/assets/hair.jpg";
import lashes from "@/assets/lashes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sphe's Beauty Palace · AI Productivity Assistant" },
      { name: "description", content: "Book nails, hair and lash appointments, pay, and share feedback — plus AI tools for the salon team." },
      { property: "og:title", content: "Sphe's Beauty Palace · AI Productivity Assistant" },
      { property: "og:description", content: "Book, pay and share feedback at Sphe's Beauty Palace." },
    ],
  }),
  component: Dashboard,
});

const SERVICES = [
  { name: "Nails", price: 350, img: nails, desc: "Gel, acrylic & nail art" },
  { name: "Hair", price: 500, img: hair, desc: "Styling, braids & colour" },
  { name: "Lashes", price: 400, img: lashes, desc: "Classic, hybrid & volume" },
];

type Appt = { id: string; name: string; service: string; date: string; time: string; status: "Booked" | "Paid" | "Cancelled" };
type Feedback = { id: string; kind: "Complaint" | "Praise"; name: string; message: string; at: string };

function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) setV(JSON.parse(raw));
  }, [key]);
  const set = (n: T) => { setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set] as const;
}

function Dashboard() {
  const [appts, setAppts] = useStored<Appt[]>("sbp-appts", []);
  const [fb, setFb] = useStored<Feedback[]>("sbp-feedback", []);
  const [form, setForm] = useState({ name: "", service: "Nails", date: "", time: "" });
  const [payId, setPayId] = useState<string | null>(null);
  const [fbForm, setFbForm] = useState({ kind: "Praise" as Feedback["kind"], name: "", message: "" });
  const [notice, setNotice] = useState("");

  const flash = (m: string) => { setNotice(m); setTimeout(() => setNotice(""), 3000); };
  const price = (s: string) => SERVICES.find((x) => x.name === s)?.price ?? 0;

  function book(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.date || !form.time) return;
    setAppts([{ id: crypto.randomUUID(), ...form, status: "Booked" }, ...appts]);
    setForm({ ...form, name: "", date: "", time: "" });
    flash("Appointment booked 💖");
  }
  const update = (id: string, status: Appt["status"]) => setAppts(appts.map((a) => (a.id === id ? { ...a, status } : a)));

  function sendFb(e: React.FormEvent) {
    e.preventDefault();
    if (!fbForm.message.trim()) return;
    setFb([{ id: crypto.randomUUID(), ...fbForm, at: new Date().toLocaleString() }, ...fb]);
    setFbForm({ ...fbForm, message: "" });
    flash(`Thank you — your ${fbForm.kind.toLowerCase()} was logged.`);
  }

  const active = appts.filter((a) => a.status !== "Cancelled");
  const revenue = appts.filter((a) => a.status === "Paid").reduce((s, a) => s + price(a.service), 0);

  return (
    <AppShell title="Welcome to the Palace ✨" subtitle="Book your glow-up and let AI handle the busywork.">
      {notice && <div className="mb-4 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">{notice}</div>}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Upcoming", active.filter((a) => a.status === "Booked").length],
          ["Paid", appts.filter((a) => a.status === "Paid").length],
          ["Revenue", `R${revenue}`],
          ["Feedback", fb.length],
        ].map(([k, v]) => (
          <div key={k} className="card-ui">
            <p className="label-ui">{k}</p>
            <p className="font-display text-3xl text-primary">{v}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.name} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <img src={s.img} alt={`${s.name} at Sphe's Beauty Palace`} width={816} height={816} loading="lazy" className="h-48 w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-lg">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">R{s.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={book} className="card-ui space-y-3">
          <h2 className="text-xl">Book an Appointment</h2>
          <input className="input-ui" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input-ui" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
            {SERVICES.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="input-ui" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="time" className="input-ui" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Book Now</button>
        </form>

        <form onSubmit={sendFb} className="card-ui space-y-3">
          <h2 className="text-xl">Complaint or Praise</h2>
          <div className="flex gap-2">
            {(["Praise", "Complaint"] as const).map((k) => (
              <button type="button" key={k} onClick={() => setFbForm({ ...fbForm, kind: k })} className={fbForm.kind === k ? "btn-primary flex-1" : "btn-ghost flex-1"}>
                {k === "Praise" ? "💖 Praise" : "⚠ Complaint"}
              </button>
            ))}
          </div>
          <input className="input-ui" placeholder="Your name (optional)" value={fbForm.name} onChange={(e) => setFbForm({ ...fbForm, name: e.target.value })} />
          <textarea className="input-ui min-h-24" placeholder="Tell us about your experience…" value={fbForm.message} onChange={(e) => setFbForm({ ...fbForm, message: e.target.value })} />
          <button className="btn-primary w-full">Submit</button>
        </form>
      </div>

      <div className="card-ui mt-6">
        <h2 className="mb-3 text-xl">My Appointments</h2>
        {appts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments yet — book your first above.</p>
        ) : (
          <div className="space-y-2">
            {appts.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
                <div>
                  <p className="font-semibold">{a.service} · {a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.date} at {a.time} · R{price(a.service)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.status === "Paid" ? "bg-success text-primary-foreground" : a.status === "Cancelled" ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>{a.status}</span>
                  {a.status === "Booked" && (
                    <>
                      <button className="btn-primary py-1 text-xs" onClick={() => setPayId(a.id)}>Pay</button>
                      <button className="btn-ghost py-1 text-xs" onClick={() => { update(a.id, "Cancelled"); flash("Appointment cancelled."); }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {fb.length > 0 && (
        <div className="card-ui mt-6">
          <h2 className="mb-3 text-xl">Recent Feedback</h2>
          <div className="space-y-2">
            {fb.slice(0, 5).map((f) => (
              <div key={f.id} className="rounded-xl bg-muted p-3 text-sm">
                <span className="font-semibold">{f.kind === "Praise" ? "💖" : "⚠"} {f.kind}</span> · {f.name || "Anonymous"} · <span className="text-xs text-muted-foreground">{f.at}</span>
                <p className="mt-1">{f.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {([["/email", "✉ Smart Email Generator"], ["/notes", "✎ Meeting Notes Summarizer"], ["/planner", "☑ AI Task Planner"]] as const).map(([to, l]) => (
          <Link key={to} to={to} className="card-ui bg-gradient-soft font-semibold transition hover:-translate-y-0.5">{l} →</Link>
        ))}
      </div>

      {payId && <PayModal amount={price(appts.find((a) => a.id === payId)?.service ?? "")} onClose={() => setPayId(null)} onPaid={() => { update(payId, "Paid"); setPayId(null); flash("Payment successful 💳"); }} />}
    </AppShell>
  );
}

function PayModal({ amount, onClose, onPaid }: { amount: number; onClose: () => void; onPaid: () => void }) {
  const [card, setCard] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="card-ui w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl">Pay R{amount}</h2>
        <p className="text-xs text-muted-foreground">Demo checkout — no real money is charged.</p>
        <input className="input-ui" placeholder="Card number" value={card} onChange={(e) => setCard(e.target.value.replace(/\D/g, "").slice(0, 16))} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input-ui" placeholder="MM/YY" />
          <input className="input-ui" placeholder="CVC" />
        </div>
        <button className="btn-primary w-full" disabled={card.length < 12} onClick={onPaid}>Pay Now</button>
        <button className="btn-ghost w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
