import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [projectCount, testimonialCount, leadCount, recentLeads] = await Promise.all([
    prisma.project.count(),
    prisma.testimonial.count(),
    prisma.lead.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Obras no portfólio", value: projectCount, href: "/admin/portfolio" },
    { label: "Depoimentos", value: testimonialCount, href: "/admin/depoimentos" },
    { label: "Leads recebidos", value: leadCount, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-3xl font-bold text-brand-navy">{stat.value}</span>
            <span className="mt-1 block text-sm text-brand-navy/60">{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-brand-navy">Últimos leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-orange hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentLeads.length > 0 ? (
          <ul className="mt-4 divide-y divide-black/5">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-brand-navy">{lead.name}</span>
                  <span className="ml-2 text-brand-navy/50">{lead.phone}</span>
                </div>
                <span className="text-xs text-brand-navy/40">
                  {lead.createdAt.toLocaleDateString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-brand-navy/50">Nenhum lead recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
