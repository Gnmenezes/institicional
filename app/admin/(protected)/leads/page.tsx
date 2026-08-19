import { prisma } from "@/lib/prisma";
import { SYSTEM_TYPE_LABELS } from "@/lib/email";

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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-brand-navy">{lead.name}</p>
                  {lead.systemType && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        lead.systemType === "HIBRIDO"
                          ? "bg-brand-orange text-white"
                          : "bg-brand-navy-light text-brand-navy/60"
                      }`}
                    >
                      {SYSTEM_TYPE_LABELS[lead.systemType] ?? lead.systemType}
                    </span>
                  )}
                </div>
                <span className="text-xs text-brand-navy/40">
                  {lead.createdAt.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-navy/60">
                <span>📞 {lead.phone}</span>
                {lead.email && <span>✉️ {lead.email}</span>}
                {lead.city && <span>📍 {lead.city}</span>}
                {lead.billAmount && <span>💡 Conta média: {lead.billAmount}</span>}
                {lead.roofType && <span>🏠 {lead.roofType}</span>}
              </div>
              {lead.simulation && (
                <p className="mt-3 rounded-xl border border-brand-orange/25 bg-brand-orange-light p-3 text-xs leading-relaxed text-brand-navy/70">
                  <span className="font-semibold text-brand-navy">Simulou no site:</span>{" "}
                  {lead.simulation}
                </p>
              )}
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
