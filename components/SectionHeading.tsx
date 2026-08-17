export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold text-brand-navy sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-brand-navy/60">{description}</p>
      ) : null}
    </div>
  );
}
