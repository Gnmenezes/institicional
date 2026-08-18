type TestimonialCardProps = {
  authorName: string;
  authorLocation?: string | null;
  text: string;
  rating: number;
};

export default function TestimonialCard({
  authorName,
  authorLocation,
  text,
  rating,
}: TestimonialCardProps) {
  return (
    <figure className="card-lift shadow-brand relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-7">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[7rem] leading-none text-brand-orange/10"
      >
        &rdquo;
      </span>

      <div className="relative flex gap-0.5 text-brand-orange">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.2}
            aria-hidden="true"
          >
            <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L10 1.5Z" />
          </svg>
        ))}
      </div>

      <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
        “{text}”
      </blockquote>

      <figcaption className="relative mt-5 border-t border-black/5 pt-4 text-sm font-bold text-brand-navy">
        {authorName}
        {authorLocation ? (
          <span className="mt-0.5 block text-xs font-normal text-brand-navy/50">
            {authorLocation}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
