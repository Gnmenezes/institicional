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
    <figure className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex gap-0.5 text-brand-orange">
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
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
        “{text}”
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-brand-navy">
        {authorName}
        {authorLocation ? (
          <span className="block font-normal text-brand-navy/50">{authorLocation}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
