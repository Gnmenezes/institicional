import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/data";

type ProjectCardProps = {
  slug: string;
  title: string;
  city: string;
  state: string;
  category: string;
  powerKwp: number | null;
  photoUrl?: string | null;
};

export default function ProjectCard({
  slug,
  title,
  city,
  state,
  category,
  powerKwp,
  photoUrl,
}: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className="card-lift shadow-brand group block h-full overflow-hidden rounded-2xl bg-white"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-navy-light">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-navy/25">
            <svg viewBox="0 0 48 48" className="h-16 w-16" fill="currentColor" aria-hidden="true">
              <path d="M24 4 6 13v9c0 10.5 7.2 19.9 18 22 10.8-2.1 18-11.5 18-22v-9L24 4Zm0 4.5 14 6.5v5.9L24 15.9 10 20.9V15l14-6.5Z" />
            </svg>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-navy shadow-sm backdrop-blur">
          {CATEGORY_LABELS[category] ?? category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-orange">
          {title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-brand-navy/55">
          <span>
            {city} — {state}
          </span>
          {powerKwp ? (
            <>
              <span className="h-1 w-1 rounded-full bg-brand-orange/50" />
              <span className="font-semibold text-brand-navy/70">{powerKwp} kWp</span>
            </>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
