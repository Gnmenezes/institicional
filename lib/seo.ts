/**
 * Dados estruturados e metadados compartilhados.
 *
 * Só entram aqui informações verificadas sobre a empresa — o Google penaliza
 * dado estruturado que não corresponde ao que a página mostra, e uma
 * afirmação inventada aqui é tão ruim quanto uma no texto do site.
 */
import {
  CNPJ,
  INSTALLED_KWP_FLOOR,
  LEGAL_NAME,
  PROJECTS_FLOOR,
  RESPONSE_TIME,
} from "@/lib/company";

export const SITE_URL = "https://sumart.com.br";
export const SITE_NAME = "Sumart Energia Solar";
export const CONTACT_EMAIL = "contato@sumart.com.br";
export const CONTACT_PHONE = "+55 32 99141-8802";

/** Cidades atendidas — as mesmas do seletor da calculadora. */
export const SERVED_CITIES = [
  "Juiz de Fora",
  "Guiricema",
  "Ubá",
  "Muriaé",
  "Cataguases",
  "Leopoldina",
  "Barbacena",
  "Viçosa",
  "Ponte Nova",
  "Além Paraíba",
  "Santos Dumont",
  "Miraí",
  "Visconde do Rio Branco",
  "São João Nepomuceno",
  "Bicas",
  "Rio Novo",
  "Rio Pomba",
  "Lima Duarte",
  "Astolfo Dutra",
  "Rodeiro",
  "Piau",
  "Mar de Espanha",
  "Matias Barbosa",
  "Ervália",
  "Coimbra",
  "Tocantins",
  "Senador Firmino",
  "Dona Euzébia",
  "Divinésia",
  "Descoberto",
  "Goianá",
  "Chácara",
];

/**
 * Termos que descrevem o negócio. O Google praticamente ignora a meta
 * keywords, mas estes mesmos termos guiam os títulos e textos das páginas,
 * que é onde eles de fato contam.
 */
export const KEYWORDS = [
  "energia solar",
  "energia solar Juiz de Fora",
  "sistema híbrido com bateria",
  "bateria para energia solar",
  "placa solar",
  "painel solar",
  "microinversor",
  "energia solar residencial",
  "energia solar comercial",
  "energia solar rural",
  "instalação de energia solar MG",
  "gerador de energia solar",
  "energia solar Ubá",
  "energia solar Guiricema",
  "sistema fotovoltaico",
  "backup de energia",
];

/**
 * A empresa como negócio local.
 *
 * Sem endereço de rua de propósito: o site não publica um, e inventar
 * endereço em dado estruturado é o tipo de erro que derruba a confiança do
 * Google no restante. Estado e país são certos, e areaServed cobre o resto.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectricalContractor",
    "@id": `${SITE_URL}/#organizacao`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    taxID: CNPJ,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    logo: `${SITE_URL}/logo/sumart-logo.png`,
    image: `${SITE_URL}/obras/rooftop-hero.jpg`,
    foundingDate: "2021-08",
    description:
      "Instalação de sistemas de energia solar fotovoltaica, híbridos com armazenamento em bateria ou convencionais com microinversores, para residências, empresas, indústrias e propriedades rurais na Zona da Mata mineira.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    areaServed: SERVED_CITIES.map((city) => ({
      "@type": "City",
      name: city,
      addressRegion: "MG",
      addressCountry: "BR",
    })),
    knowsAbout: [
      "energia solar fotovoltaica",
      "sistemas híbridos com bateria",
      "microinversores",
      "homologação junto à distribuidora",
      "bombeamento solar",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de energia solar",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sistema híbrido com bateria",
            description:
              "Sistema fotovoltaico com banco de baterias, que mantém o imóvel funcionando durante quedas de energia da rede.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sistema on-grid com microinversores",
            description:
              "Sistema fotovoltaico conectado à rede, de menor investimento, que reduz a conta de luz desde a primeira fatura.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manutenção e monitoramento",
            description:
              "Revisão de painéis, inversores e baterias, acompanhamento da geração e suporte técnico pós-instalação.",
          },
        },
      ],
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#site`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE_URL}/#organizacao` },
  };
}

/**
 * Perguntas que quem procura energia solar realmente digita.
 *
 * As respostas repetem o que o site já afirma — inclusive as ressalvas. Uma
 * resposta aqui mais otimista que a da página seria contradição visível
 * para quem chega pelo resultado de busca.
 */
export const FAQ = [
  {
    question: "Quanto custa um sistema de energia solar?",
    answer: `Depende do consumo do imóvel. Na Sumart, o menor sistema fica em torno de R$ 8.500 e um sistema residencial típico, para uma conta de cerca de R$ 600, fica próximo de R$ 13 mil. A calculadora do site dá uma estimativa a partir do valor da sua conta de luz, e o valor exato sai na visita técnica, que é sem custo.`,
  },
  {
    question: "Em quanto tempo o sistema de energia solar se paga?",
    answer:
      "Para contas residenciais acima de R$ 400 por mês, o retorno costuma ficar entre 2 e 4 anos, considerando a economia gerada. Quanto maior a conta de luz, mais rápido o sistema se paga.",
  },
  {
    question: "Qual a diferença entre sistema on-grid e sistema híbrido?",
    answer:
      "O on-grid é ligado direto à rede e tem o menor investimento, mas desliga junto com a rede durante uma queda de energia, por exigência de segurança. O híbrido armazena energia em bateria e mantém o imóvel funcionando mesmo sem rede.",
  },
  {
    question: "A energia solar funciona quando falta luz?",
    answer:
      "Só com bateria. Um sistema convencional on-grid desliga automaticamente quando a rede cai, para proteger quem trabalha na manutenção da linha. Um sistema híbrido com banco de baterias continua alimentando o imóvel.",
  },
  {
    question: "Dá para financiar o sistema de energia solar?",
    answer:
      "Sim. Existem linhas de financiamento específicas para energia solar, e em boa parte dos projetos a economia gerada na conta de luz ajuda a cobrir a parcela — em muitos casos cobre integralmente. O valor da parcela depende de análise de crédito, prazo e taxa do banco.",
  },
  {
    question: "Qual a garantia dos equipamentos de energia solar?",
    answer:
      "Os módulos fotovoltaicos costumam ter garantia de fábrica de 12 a 15 anos e os inversores de 5 a 25 anos, conforme o fabricante escolhido. O prazo exato de cada item vem discriminado na proposta, antes da assinatura.",
  },
  {
    question: "A energia solar reduz a conta de luz em quanto?",
    answer:
      "A conta cai quase por completo: sobra o custo de disponibilidade cobrado pela distribuidora — o equivalente a 50 kWh numa ligação bifásica — mais a contribuição de iluminação pública.",
  },
  {
    question: "Quais cidades a Sumart atende?",
    answer: `A Sumart atende Juiz de Fora, Guiricema, Ubá e a região da Zona da Mata mineira, incluindo ${SERVED_CITIES.slice(2, 12).join(", ")} e cidades vizinhas.`,
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Resumo usado em descrições — mantém os números alinhados com o site. */
export const CREDENTIALS_SNIPPET = `Mais de ${PROJECTS_FLOOR} obras e ${INSTALLED_KWP_FLOOR.toLocaleString("pt-BR")} kWp instalados. Resposta em até ${RESPONSE_TIME}.`;
