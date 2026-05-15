"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const currencies = ["RUB", "EUR"] as const;

export function CurrencySwitcher() {
  const [currency, setCurrency] = useState<(typeof currencies)[number]>("RUB");

  return (
    <div
      aria-label="Currency"
      className="hidden rounded-md border border-white/10 bg-black/25 p-1 text-xs font-bold sm:flex"
    >
      {currencies.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setCurrency(item)}
          className={cn(
            "focus-ring rounded px-2 py-1 transition",
            item === currency
              ? "bg-zinc-100 text-zinc-950"
              : "text-zinc-300 hover:bg-white/10 hover:text-white"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
