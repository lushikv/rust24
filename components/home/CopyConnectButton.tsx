"use client";

import { useState } from "react";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

export function CopyConnectButton({
  command,
  locale,
  className
}: {
  command: string;
  locale: Locale;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyCommand}
      aria-label={
        copied
          ? locale === "ru"
            ? "Команда скопирована"
            : "Command copied"
          : locale === "ru"
            ? "Скопировать команду подключения"
            : "Copy connect command"
      }
      title={copied ? (locale === "ru" ? "Скопировано" : "Copied") : locale === "ru" ? "Копировать" : "Copy"}
      className={cn(
        "focus-ring inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition duration-200",
        copied
          ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100"
          : "border-orange-200/35 bg-orange-500/12 text-orange-100 hover:border-orange-200/70 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_24px_rgba(249,115,22,0.35)]",
        className
      )}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="14" rx="2.4" width="14" x="8" y="8" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
