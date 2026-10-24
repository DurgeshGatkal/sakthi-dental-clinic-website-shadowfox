import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@sakthi/shared";
import { CircleCheck, Send, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Link } from "react-router";
import { ApiError, apiPost } from "~/lib/api";
import { Button } from "../ui/Button";
import { FormField, inputClasses } from "../ui/FormField";

/*
 * Section 12 — one zod schema from shared/ validates here for instant
 * feedback and again on the server as the real gate. The server's 422 field
 * messages are written straight back onto the inputs.
 */
type ContactValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

type Props = {
  phoneDisplay: string;
  phoneE164: string;
};

const FIELD_NAMES = ["name", "email", "phone", "message"] as const;

export function ContactForm({ phoneDisplay, phoneE164 }: Props) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema) as Resolver<ContactValues>,
    defaultValues: { name: "", email: "", phone: "", message: "", website: "" },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await apiPost("/contact", values);
      setSentTo(values.name.trim().split(/\s+/)[0] ?? "");
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const name of FIELD_NAMES) {
          const message = error.fields[name];
          if (message) setError(name, { type: "server", message });
        }
        setFormError(error.message);
      } else {
        setFormError("We could not reach the clinic just now. Please try again.");
      }
    }
  });

  if (sentTo) {
    return (
      <div
        role="status"
        className="rounded-card border border-lavender-100 bg-white p-6 shadow-soft md:p-8"
      >
        <CircleCheck aria-hidden="true" className="size-10 text-success-600" />
        <h3 className="mt-4 text-h3">Thank you{sentTo ? `, ${sentTo}` : ""}.</h3>
        <p className="mt-3 text-body text-ink-600">
          Your message is with our front desk. We will get back to you during clinic hours.
        </p>
        <p className="mt-3 text-body text-ink-600">
          Need an answer sooner? Call{" "}
          <a href={`tel:${phoneE164}`} className="font-semibold text-lavender-700 underline">
            {phoneDisplay}
          </a>
          .
        </p>

        <Button variant="secondary" className="mt-6" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-error-600/30 bg-rose-50 p-4 text-small text-ink-900"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error-600" />
          <p>
            {formError} You can also call{" "}
            <a href={`tel:${phoneE164}`} className="font-semibold text-lavender-700 underline">
              {phoneDisplay}
            </a>
            .
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="name" label="Name" required error={errors.name?.message}>
          {(describedBy) => (
            <input
              {...register("name")}
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy}
              className={inputClasses(Boolean(errors.name))}
            />
          )}
        </FormField>

        <FormField id="email" label="Email" required error={errors.email?.message}>
          {(describedBy) => (
            <input
              {...register("email")}
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy}
              className={inputClasses(Boolean(errors.email))}
            />
          )}
        </FormField>
      </div>

      <FormField
        id="phone"
        label="Phone"
        required
        error={errors.phone?.message}
        hint="10-digit mobile number, or include +91."
      >
        {(describedBy) => (
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy}
            className={inputClasses(Boolean(errors.phone))}
          />
        )}
      </FormField>

      <FormField
        id="message"
        label="Message"
        error={errors.message?.message}
        hint="Optional. Up to 1000 characters."
      >
        {(describedBy) => (
          <textarea
            {...register("message")}
            id="message"
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy}
            className={inputClasses(Boolean(errors.message), "resize-y")}
          />
        )}
      </FormField>

      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="website">Leave this field empty</label>
        <input {...register("website")} id="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send aria-hidden="true" className="size-5" />
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>

      <p className="text-small text-ink-600">
        We use your details only to answer this enquiry. Read the{" "}
        <Link to="/privacy-policy" className="font-medium text-lavender-700 underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
