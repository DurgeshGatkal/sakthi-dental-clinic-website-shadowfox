import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import type { Faq } from "~/lib/api";

/*
 * Section 5 — one panel open at a time and the first open by default.
 * Each header is a real button with aria-expanded/aria-controls, and the
 * answer stays in the DOM (hidden) so screen readers can reach it by id.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="overflow-hidden rounded-card border border-lavender-100 bg-white shadow-soft">
      {faqs.map((faq, index) => {
        const open = index === openIndex;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <div
            key={faq.question}
            className={index > 0 ? "border-t border-lavender-100" : undefined}
          >
            <h2>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-ink-900 transition-colors hover:bg-lavender-50 md:px-6"
              >
                <span>{faq.question}</span>
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-lavender-100 text-lavender-700"
                  aria-hidden="true"
                >
                  {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-5 md:px-6"
            >
              <p className="measure text-body text-ink-600">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
