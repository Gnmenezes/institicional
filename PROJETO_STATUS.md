# Status do projeto — Site institucional Sumart Energia Solar

> Resumo de continuidade. Leia isso antes de continuar o trabalho em uma nova conversa.

## Onde tudo está

- **Código local**: `C:\Users\Gabriel\sumart-site`
- **GitHub**: https://github.com/Gnmenezes/institicional (repositório **público** — cogitar deixar privado)
- **Deploy**: Vercel, projeto `institicional`, time `Sumart` (plano Hobby)
- **Site no ar**: https://sumart.com.br (domínio raiz é o canônico; `www.sumart.com.br` redireciona 308 pra ele)
- **Deploy automático**: todo `git push` na branch `main` dispara build/deploy na Vercel

## Stack

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Prisma 7 (Postgres) + Vercel Blob (upload de imagem) + Resend (e-mail, ainda não configurado) + embeds do YouTube (vídeos).

## Acesso ao admin

- URL: `https://sumart.com.br/admin`
- E-mail: `admin@sumart.com.br`
- Senha (produção): `1LGH8DY1`
- Senha (`.env` local, dev): `sumart2026`

## Estrutura do admin

`/admin/dashboard` · `/admin/carrossel` (fotos do hero, giram automaticamente) · `/admin/videos` (vídeos do YouTube do elevador de placas) · `/admin/portfolio` (obras) · `/admin/depoimentos` · `/admin/leads` (somente leitura) · `/admin/configuracoes` (número de WhatsApp)

## Modelos no banco (`prisma/schema.prisma`)

`Project` (categorias: RESIDENCIAL, COMERCIAL, INDUSTRIAL, RURAL) + `ProjectPhoto` · `Testimonial` · `Lead` · `SiteSettings` (whatsappNumber) · `HeroPhoto` · `Video` (youtubeId extraído do link colado)

## Pegadinhas importantes (não redescobrir)

1. **`$` em `.env` local**: valores com `$` (ex: hash bcrypt) precisam ser escapados como `\$`, senão o Next tenta interpretar como variável. **Isso NÃO vale pro painel da Vercel** — lá é texto puro, sem escapar.
2. **Next.js 16**: usa `proxy.ts` (não `middleware.ts`), `params`/`searchParams` são `Promise` (assíncronos), Turbopack é padrão.
3. **Prisma 7**: client é gerado em `app/generated/prisma` (gitignored). É **obrigatório** ter `"postinstall": "prisma generate"` no `package.json`, senão o build da Vercel quebra (já corrigido, não remover).
4. **Upload de imagem**: usa upload direto do navegador pro Vercel Blob (`@vercel/blob/client`, função `upload()` + `handleUpload()` na rota `/api/admin/upload`) — NÃO passa pelo corpo da função serverless, porque a Vercel tem limite de ~4,5MB por request e fotos de celular estouram isso facilmente.
5. **`export const dynamic = "force-dynamic"`** no `app/(site)/layout.tsx` é necessário — sem isso, o Next tenta pré-renderizar estático e mudanças feitas no admin (WhatsApp, fotos, obras) não apareceriam no site sem um novo deploy.
6. **Banco de dados**: é um banco "Prisma Postgres" que era temporário e foi **reivindicado** (claim) — confirmado funcionando, não precisa trocar a `DATABASE_URL`.
7. **`.claude/launch.json`** na raiz de `C:\Users\Gabriel` (não dentro do projeto) tem duas entradas: `sumart-site` (este projeto, via `run-dev.cmd`) e `obras-app` (**sistema interno separado, não mexer**). O preview tool lê esse arquivo raiz, não o do projeto.
8. **Alternância de cores** nas seções da home (clara/branca intercalando) é proposital — manter o padrão ao adicionar/remover seções.
9. **Ambiente de preview aqui não tira screenshot nem dispara `IntersectionObserver` de forma confiável** (painel não composita frames) — verificação precisa ser por estilos computados via `javascript_tool`, não visual. O componente `Reveal.tsx` (animação ao rolar) foi propositalmente feito à prova de falha: nasce visível e só esconde depois que confirma via JS, com timeout de segurança de 2,5s.

## O que foi feito (cronologicamente)

Site completo do zero → domínio próprio configurado → reposicionamento de copy pra "sistemas híbridos com bateria" (fuga de foco só em painel solar) → jornada de vendas na home (dor → agitação → solução → investimento, com fotos reais de momentos interrompidos por falta de energia, geradas por IA) → seção comparativa Híbrido x On-Grid → vitrine de vídeos do elevador de placas (diferencial da empresa) → repaginação visual completa (hero escuro com glow, animações de entrada, sombras em camada) → correção de bug do carrossel (colapsava pra largura zero).

## Pendências / próximos passos

1. Usuário está subindo fotos reais das obras via `/admin/portfolio` agora — substituindo as 3 obras de exemplo.
2. Substituir depoimentos de exemplo pelos reais.
3. Resend (e-mail de notificação de lead) ainda não configurado — `RESEND_API_KEY` vazio. Leads continuam sendo salvos no banco normalmente, só o e-mail que não dispara.
4. Considerar deixar o repositório GitHub privado.
5. Considerar trocar a senha do admin por uma definitiva (hoje é uma senha de teste).

## Resolvido recentemente

- **Escolher a foto de capa da obra** (commit `7806360`): `ImageUploader` ganhou a prop `allowCover`, usada só pelo `ProjectForm`. A primeira miniatura mostra a faixa "Capa"; as outras têm o botão "Definir capa", que move a foto pra posição 0 do array. Não precisou mexer no banco nem na API — o `PATCH` de `/api/admin/projects/[id]` já grava `order: index`, e o `ProjectCard` já lê a foto de `order` 0. Na mesma mudança, o "✕" de remover foto deixou de ser só-hover (`sm:opacity-0 sm:group-hover:opacity-100`), porque no celular hover não existe e o botão era inalcançável.

## Comandos úteis

```bash
cd ~/sumart-site
npx tsc --noEmit          # checar tipos
npm run build              # build de produção (rodar antes de cada push)
git add -A && git commit -m "..." && git push   # publica (dispara deploy automático)
```
