"use client";

import { useEffect } from "react";

/** Mobilde aşağı kaydırınca <html data-compact> ekler; yukarı kaydırınca kaldırır. */
export function ScrollCompact() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let last = window.scrollY;
    let raf = 0;
    const measure = () => {
      const header = document.querySelector<HTMLElement>("header.m-header");
      if (!header) return;
      let h = 0;
      header.querySelectorAll<HTMLElement>(".m-collapse").forEach((el) => (h += el.offsetHeight));
      header.style.setProperty("--m-collapse", `${h}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const root = document.documentElement;
      if (!mq.matches) {
        root.removeAttribute("data-compact");
      } else if (y > 160 && y > last + 4) {
        root.setAttribute("data-compact", "");
      } else if (y < last - 4 || y < 80) {
        root.removeAttribute("data-compact");
      }
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.removeAttribute("data-compact");
    };
  }, []);
  return null;
}
