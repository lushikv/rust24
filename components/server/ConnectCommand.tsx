"use client";

import { useState } from "react";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

export function ConnectCommand({
  command,
  locale
}: {
  command: string;
  locale: Locale;
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
    <div className="group relative mt-4 overflow-hidden rounded-lg border border-orange-400/30 bg-black/30 p-3 shadow-inner shadow-black/50 transition duration-200 hover:border-orange-300/55 hover:bg-orange-500/[0.045] hover:shadow-[0_0_28px_rgba(249,115,22,0.16),inset_0_0_26px_rgba(0,0,0,0.5)] focus-within:border-orange-300/60 focus-within:shadow-[0_0_28px_rgba(249,115,22,0.18),inset_0_0_26px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative space-y-2">
        <span className="block text-center text-xs font-black uppercase tracking-[0.22em] text-orange-200/80">
          {locale === "ru" ? "Команда подключения" : "Connect command"}
        </span>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-white/10 bg-[#07080b]/75 px-3 py-2 transition group-hover:border-orange-300/25 group-hover:bg-[#100b08]/85">
            <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.85)]" />
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-orange-100 sm:text-base">
              {command}
            </code>
          </div>
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
            title={
              copied
                ? locale === "ru"
                  ? "Скопировано"
                  : "Copied"
                : locale === "ru"
                  ? "Копировать"
                  : "Copy"
            }
            className={cn(
              "focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-md border transition sm:h-11 sm:w-11",
              copied
                ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100"
                : "border-orange-200/50 bg-orange-500/15 text-orange-100 hover:border-orange-200 hover:bg-orange-500 hover:text-black"
            )}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
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
      <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
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
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
