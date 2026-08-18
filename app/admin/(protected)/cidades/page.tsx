import { prisma } from "@/lib/prisma";
import { REFERENCE_GENERATION, REFERENCE_HSP, generationFromHsp } from "@/lib/solar";
import CityToggle from "@/components/admin/CityToggle";

export default async function CidadesPage() {
  const cities = await prisma.city.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Cidades da calculadora</h1>
      <p className="mt-1 text-sm text-brand-navy/50">
        Cidades oferecidas no seletor da calculadora de economia, com a
        irradiação solar de cada uma.
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 text-sm leading-relaxed text-brand-navy/70">
        <p>
          O <strong>HSP</strong> (horas de sol pleno) mede quanta energia solar
          chega por dia em cada lugar. A geração estimada de cada cidade sai
          desse número, ancorada em Juiz de Fora — onde os orçamentos reais dão{" "}
          {REFERENCE_GENERATION.toString().replace(".", ",")} kWh por kWp ao mês
          com HSP de {REFERENCE_HSP.toString().replace(".", ",")}.
        </p>
        <p className="mt-3 text-brand-navy/50">
          Desmarcar uma cidade tira ela do seletor do site. Vale lembrar que
          listar uma cidade aqui é anunciar que a Sumart atende lá.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-brand-navy/40">
              <th className="p-4 font-semibold">Cidade</th>
              <th className="p-4 font-semibold">HSP</th>
              <th className="p-4 font-semibold">Geração estimada</th>
              <th className="p-4 font-semibold">vs. Juiz de Fora</th>
              <th className="p-4 font-semibold">No site</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => {
              const generation = generationFromHsp(city.hsp);
              const delta = (generation / REFERENCE_GENERATION - 1) * 100;
              return (
                <tr key={city.id} className="border-b border-black/5">
                  <td className="p-4 font-medium text-brand-navy">
                    {city.name}
                    <span className="ml-1.5 text-xs text-brand-navy/40">{city.state}</span>
                  </td>
                  <td className="p-4 text-brand-navy/70">
                    {city.hsp.toFixed(3).replace(".", ",")}
                  </td>
                  <td className="p-4 text-brand-navy/70">
                    {generation.toFixed(1).replace(".", ",")} kWh/kWp/mês
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        Math.abs(delta) < 0.05
                          ? "text-brand-navy/40"
                          : delta > 0
                            ? "text-green-600"
                            : "text-brand-navy/60"
                      }
                    >
                      {delta > 0 ? "+" : ""}
                      {delta.toFixed(1).replace(".", ",")}%
                    </span>
                  </td>
                  <td className="p-4">
                    <CityToggle id={city.id} active={city.active} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-brand-navy/40">
        Fonte da irradiação: {cities[0]?.source ?? "NASA POWER"}. Para incluir
        cidades novas, rode <code>npx tsx scripts/seed-cities.ts</code> depois de
        acrescentá-las em <code>prisma/cities-hsp.json</code>.
      </p>
    </div>
  );
}
