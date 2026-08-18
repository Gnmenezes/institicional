export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
            invert ? "text-brand-orange" : "text-brand-orange"
          }`}
        >
          <span className="h-px w-6 bg-brand-orange/60" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-[2.6rem] sm:leading-[1.12] ${
          invert ? "text-white" : "text-brand-navy"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            invert ? "text-white/70" : "text-brand-navy/60"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
