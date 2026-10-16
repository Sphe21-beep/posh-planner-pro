export type ArchiveKind = "email" | "notes" | "planner";
export type ArchiveItem = { id: string; kind: ArchiveKind; input: string; output: string; at: string };

const KEY = "sbp-archive";

export function loadArchive(): ArchiveItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveArchive(items: ArchiveItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToArchive(kind: ArchiveKind, input: string, output: string) {
  saveArchive([{ id: crypto.randomUUID(), kind, input, output, at: new Date().toLocaleString() }, ...loadArchive()]);
}
