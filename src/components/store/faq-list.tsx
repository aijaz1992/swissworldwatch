"use client";

import { useState } from "react";

export function FaqList({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="border border-neutral-200">
      {faqs.map((faq) => {
        const expanded = open === faq.id;
        return (
          <div key={faq.id} className="border-b border-neutral-200 last:border-b-0">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : faq.id)}
            >
              <span className="w-4 text-lg leading-none text-neutral-500" aria-hidden>
                {expanded ? "–" : "+"}
              </span>
              {faq.question}
            </button>
            {expanded && <p className="px-11 pb-4 text-sm leading-6 text-neutral-600">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
