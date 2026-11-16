"use client";

import { useSyncExternalStore } from "react";

const sub = () => () => {};
export function CopyrightYear() {
  const year = useSyncExternalStore(sub, () => new Date().getFullYear(), () => 2026);
  return <>{year}</>;
}
