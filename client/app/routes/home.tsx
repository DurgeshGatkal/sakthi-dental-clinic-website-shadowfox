export function meta() {
  return [
    { title: "Sakthi Dental Clinic | Dental Care in Hosur" },
    {
      name: "description",
      content:
        "Experience compassionate, expert-led dental services tailored to your needs, all in a modern and welcoming environment.",
    },
  ];
}

/*
 * Day 4 replaces this with the full Home page: hero, assurance banner,
 * why choose, six core treatments, testimonials, facilities and CTA.
 */
export default function Home() {
  return (
    <section className="section-y">
      <div className="container-page">
        <p className="text-sm font-semibold tracking-wide text-lavender-700 uppercase">
          Sakthi Dental Clinic, Hosur
        </p>
        <h1 className="mt-3 text-h1">Specialized Dental Care for Women, Children &amp; Families</h1>
        <p className="mt-4 max-w-2xl text-ink-600">
          Experience compassionate, expert-led dental services tailored to your needs, all in a
          modern and welcoming environment.
        </p>
      </div>
    </section>
  );
}
