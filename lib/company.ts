// Fatos institucionais usados como prova de credibilidade no site.
// Ponto único de edição: atualize aqui e todas as páginas acompanham.

/**
 * Obras concluídas de fato. Em 18/08/2026 eram 86, com 3 em andamento.
 *
 * O site publica um piso arredondado para baixo (`PROJECTS_FLOOR`), não este
 * número: assim a frase continua verdadeira à medida que novas obras entram,
 * sem precisar de manutenção. Ao atualizar aqui, suba o piso junto.
 */
export const PROJECTS_COMPLETED = 86;

/** Piso publicado no site. Sempre menor ou igual a PROJECTS_COMPLETED. */
export const PROJECTS_FLOOR = 85;

/**
 * Potência total instalada, em kWp, publicada também como piso.
 * Em 18/08/2026 o total passava de 1000 com folga e não chegava a 1500.
 */
export const INSTALLED_KWP_FLOOR = 1000;

/** Início das atividades da Sumart. */
export const FOUNDED_AT = new Date(2021, 7); // agosto/2021

export const LEGAL_NAME = "Sumart Instalações e Manutenções Ltda";
export const CNPJ = "43.019.170/0001-20";

/** Prazo de resposta que a equipe se compromete a cumprir. */
export const RESPONSE_TIME = "1 dia útil";

/** Anos completos de mercado, para não precisar mexer no texto todo ano. */
export function getYearsInBusiness(now = new Date()) {
  let years = now.getFullYear() - FOUNDED_AT.getFullYear();
  if (now.getMonth() < FOUNDED_AT.getMonth()) years -= 1;
  return years;
}
