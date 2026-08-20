import { revalidatePath } from "next/cache";

/**
 * Derruba o cache das páginas públicas depois de uma gravação no /admin.
 *
 * As páginas públicas ficam em cache por 15 dias (ver `revalidate` em
 * `app/(site)/layout.tsx`). Sem esta chamada, uma obra nova no portfólio ou a
 * troca do número do WhatsApp levaria até 15 dias para aparecer no site.
 *
 * Purgamos tudo de uma vez, e não a página específica, porque quase todo
 * conteúdo do painel aparece em mais de um lugar: o WhatsApp está no rodapé e
 * no botão flutuante de todas as páginas, o portfólio aparece na home e na
 * página de obras, e os depoimentos idem. Gravações no painel são raras —
 * purgar demais custa um render, purgar de menos publica conteúdo velho.
 */
export function revalidatePublicPages() {
  revalidatePath("/", "layout");
}
