import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: "✿" },
  { to: "/email", label: "Smart Email Generator", icon: "✉" },
  { to: "/notes", label: "Meeting Notes Summarizer", icon: "✎" },
  { to: "/planner", label: "AI Task Planner", icon: "☑" },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-2 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-lg">💅</div>
          <div>
            <p className="font-display text-lg leading-tight">Sphe's Beauty Palace</p>
            <p className="text-xs opacity-70">AI Productivity Assistant</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm opacity-80 transition hover:bg-sidebar-accent hover:opacity-100"
              activeProps={{ className: "bg-sidebar-accent opacity-100 font-semibold" }}
            >
              <span>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b bg-card/70 px-6 py-5 backdrop-blur">
          <h1 className="text-2xl md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <footer className="border-t bg-secondary px-6 py-8 text-secondary-foreground">
          <h2 className="text-xl">Contact Us</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <p>📍 123 Glam Street, Johannesburg</p>
            <p>📞 +27 11 000 0000</p>
            <p>✉ hello@sphesbeautypalace.co.za</p>
          </div>
          <p className="mt-4 text-xs opacity-70">© {new Date().getFullYear()} Sphe's Beauty Palace. Mon–Sat, 08:00–18:00.</p>
        </footer>
      </div>
    </div>
  );
}
