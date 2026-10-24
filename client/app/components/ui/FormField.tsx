import type { ReactNode } from "react";

/*
 * Section 12 — label, input, hint and error in one place so every field is
 * wired the same way. The child is a function so the input can pick up the
 * aria-describedby id that FormField computed for its message.
 */
export function inputClasses(invalid = false, extra = "") {
  return [
    "mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 py-3",
    "text-body text-ink-900 placeholder:text-ink-600/60",
    invalid ? "border-error-600" : "border-lavender-300",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type Props = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (describedBy: string | undefined) => ReactNode;
};

export function FormField({ id, label, required = false, error, hint, children }: Props) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-small font-semibold text-ink-900">
        {label}{" "}
        <span className="font-normal text-ink-600">({required ? "required" : "optional"})</span>
      </label>

      {children(describedBy)}

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-small font-medium text-error-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-small text-ink-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
