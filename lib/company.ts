// Fatos institucionais usados como prova de credibilidade no site.
// Ponto único de edição: atualize aqui e todas as páginas acompanham.

/** Obras concluídas. Atualize conforme novas instalações são entregues. */
export const PROJECTS_COMPLETED = 86;

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
