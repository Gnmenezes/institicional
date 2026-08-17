import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Leads recebidos</h1>
      <p className="mt-1 text-sm text-brand-navy/50">
        Pedidos de orçamento enviados pelo formulário do site.
      </p>

      {leads.length === 0 ? (
        <p className="mt-10 text-sm text-brand-navy/50">Nenhum lead recebido ainda.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{lead.name}</p>
                <span className="text-xs text-brand-navy/40">
                  {lead.createdAt.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-navy/60">
                <span>📞 {lead.phone}</span>
                {lead.email && <span>✉️ {lead.email}</span>}
                {lead.city && <span>📍 {lead.city}</span>}
                {lead.billAmount && <span>💡 Conta média: {lead.billAmount}</span>}
              </div>
              {lead.message && (
                <p className="mt-3 rounded-xl bg-brand-navy-light p-3 text-sm text-brand-navy/70">
                  {lead.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
