import { ImageResponse } from "next/og";
import { INSTALLED_KWP_FLOOR, PROJECTS_FLOOR, getYearsInBusiness } from "@/lib/company";

/**
 * Cartão que aparece quando o link é compartilhado — WhatsApp, Instagram,
 * Google. É gerado aqui em vez de ser uma foto solta porque o texto é o que
 * faz a pessoa abrir: só a foto do telhado não diz o que a empresa faz.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Sumart Energia Solar — sistemas híbridos com bateria em Juiz de Fora e região";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1f2059 0%, #353693 60%, #2a2b6e 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: "#ff6a1a",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "white", fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>
              SUMART
            </span>
            <span
              style={{
                color: "#ff9a5c",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              ENERGIA SOLAR
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "white",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Energia solar que não
          </span>
          <span
            style={{
              color: "#ff8a3d",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            te deixa no escuro
          </span>
          <span style={{ color: "rgba(255,255,255,0.72)", fontSize: 27, marginTop: 22 }}>
            Sistemas híbridos com bateria e on-grid com microinversores
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          {[
            [`+${PROJECTS_FLOOR}`, "obras entregues"],
            [`+${INSTALLED_KWP_FLOOR.toLocaleString("pt-BR")}`, "kWp instalados"],
            [`${getYearsInBusiness()} anos`, "de mercado"],
            ["Juiz de Fora", "Guiricema e região de Ubá"],
          ].map(([valor, rotulo]) => (
            <div key={rotulo} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "white", fontSize: 32, fontWeight: 800 }}>{valor}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>{rotulo}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
