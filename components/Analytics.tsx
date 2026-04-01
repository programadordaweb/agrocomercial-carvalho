"use client";

import { useEffect } from "react";

export default function Analytics() {
  useEffect(() => {
    // Track page visit
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "visit",
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});

    // Track WhatsApp clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href.includes("wa.me")) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "whatsapp",
            page: window.location.pathname,
          }),
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
