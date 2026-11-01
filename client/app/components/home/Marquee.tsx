const words = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Dental Implants",
  "Orthodontics",
  "Pediatric Care",
  "Root Canal Therapy",
  "Teeth Whitening",
  "Laser Dentistry",
  "Emergency Care",
];

/*
 * Decorative keyword ribbon. The list is repeated once so the CSS
 * translateX(-50%) loop is seamless. Hidden from assistive tech because the
 * same treatments are listed in the page content.
 */
export function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="marquee marquee-mask overflow-hidden border-y border-lavender-100 bg-white py-5"
    >
      <div className="marquee-track flex w-max items-center">
        {[...words, ...words].map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="flex items-center gap-10 pr-10 font-heading text-lg whitespace-nowrap text-ink-600"
          >
            {word}
            <span className="size-1.5 rounded-full bg-gold-400" />
          </span>
        ))}
      </div>
    </section>
  );
}
