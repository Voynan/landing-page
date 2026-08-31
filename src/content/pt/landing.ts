import aegisLogo from "@/assets/aegis/aegis-logo.svg"
import founderPortrait from "@/assets/pixelated_portrait.png"

import type { LandingContentDraft } from "../contracts.js"

export const portugueseLandingContent = {
  locale: "pt",
  metadata: {
    title: "Voynan — Construímos produtos digitais. Para nós. Para você.",
    description:
      "Produtos SaaS próprios e engenharia de software para transformar ideias em sistemas que operam no mundo real.",
    openGraphTitle:
      "Voynan — Construímos produtos digitais. Para nós. Para você.",
    openGraphDescription:
      "Produtos SaaS próprios e engenharia de software para transformar ideias em sistemas que operam no mundo real.",
    approval: "received",
  },
  hero: {
    id: "hero",
    kicker: "Voynan / Product studio",
    title: "Construímos produtos digitais. Para nós. Para você.",
    support:
      "Produtos SaaS próprios e engenharia de software para transformar ideias em sistemas que operam no mundo real.",
    contextLine:
      "3 SaaS em produção · 1 projeto open source a caminho · desenvolvimento de ponta a ponta",
    productCta: { label: "Conheça os produtos", sectionId: "products" },
    contactCta: { label: "Construa conosco", sectionId: "contact" },
    approval: "received",
  },
  thesis: {
    id: "thesis",
    statement:
      "Não apenas entregamos software. Nós o lançamos, operamos e evoluímos. É essa experiência que levamos para cada projeto.",
    approval: "received",
  },
  products: {
    id: "products",
    items: [
      {
        id: "cryptovault",
        kicker: "01 / SaaS",
        title: "Proteja arquivos. Comprove sua integridade.",
        support:
          "Criptografia autenticada, validação de integridade e registro verificável para arquivos que não podem depender apenas da confiança.",
        capabilities: [
          "Criptografia AES-GCM",
          "Validação de integridade",
          "Registro verificável em blockchain",
        ],
        destination: {
          label: "Conhecer o CryptoVault",
          approval: "missing",
        },
        claimReview: {
          text: "Integridade e registro verificável de arquivos",
          category: "legal",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "received",
      },
      {
        id: "investfusion",
        kicker: "02 / SaaS",
        title: "Seus investimentos, além da planilha.",
        support:
          "Acompanhe ativos no Brasil, Estados Unidos e Canadá, gere relatórios e transforme dados dispersos em decisões mais claras.",
        capabilities: [
          "Acompanhamento de investimentos em três mercados",
          "Relatórios e insights",
          "Organização de informações para a declaração de imposto de renda",
        ],
        destination: {
          label: "Conhecer o InvestFusion",
          approval: "missing",
        },
        claimReview: {
          text: "Organização e análise de dados financeiros e tributários",
          category: "financial",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "received",
      },
      {
        id: "constrully",
        kicker: "03 / SaaS",
        title: "Cada custo da obra, sob controle.",
        support:
          "Gerencie gastos, acompanhe impostos e gere relatórios para tomar decisões com uma visão atualizada de cada obra.",
        capabilities: [
          "Gestão e acompanhamento de despesas",
          "Acompanhamento de impostos relacionados à construção",
          "Relatórios operacionais e tributários",
        ],
        destination: {
          label: "Conhecer o Constrully",
          approval: "missing",
        },
        claimReview: {
          text: "Organização de custos, impostos e relatórios de obras",
          category: "tax",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "received",
      },
    ],
  },
  credibility: {
    id: "credibility",
    metrics: [
      { approval: "missing" },
      { approval: "missing" },
      { approval: "missing" },
    ],
    testimonials: [
      { approval: "missing" },
      { approval: "missing" },
      { approval: "missing" },
    ],
  },
  services: {
    id: "services",
    kicker: "Construa conosco",
    title: "A experiência de operar nossos produtos, aplicada ao seu.",
    support:
      "Construímos projetos de todos os tamanhos — de uma automação focada a sistemas digitais complexos — com engenharia preparada para continuar evoluindo depois do lançamento.",
    layers: [
      {
        title: "Construir",
        capabilities: ["Desenvolvimento web e mobile"],
      },
      {
        title: "Conectar e automatizar",
        capabilities: ["APIs, integrações, automação e IA"],
      },
      {
        title: "Operar com confiança",
        capabilities: ["Cloud/DevOps, segurança, manutenção e evolução"],
      },
      {
        title: "Expandir fronteiras",
        capabilities: ["Web3 e blockchain"],
      },
    ],
    cta: { label: "Iniciar uma conversa", sectionId: "contact" },
    approval: "received",
  },
  aegis: {
    id: "aegis",
    stage: "development",
    kicker: "Open source / Em breve",
    title: "Criptografia de arquivos, sem atrito.",
    support:
      "Uma biblioteca para criptografar e autenticar arquivos de qualquer formato ou tamanho com AES-GCM, com implementação direta para desenvolvedores.",
    github: {
      label: "Ver no GitHub",
      href: "https://github.com/Voynan/aegis",
      approval: "approved",
    },
    documentation: {
      label: "Ler a documentação",
      href: "https://github.com/Voynan/aegis/blob/main/README.md",
      approval: "received",
    },
    technicalEvidence: { approval: "missing" },
    logo: {
      src: aegisLogo,
      alt: "Logotipo do Aegis: a palavra αιγις em letras gregas, com gradiente do roxo ao magenta.",
      width: 649,
      height: 262,
      source: "src/assets/aegis/aegis-logo.svg — ativo próprio da Voynan",
      approval: "approved",
    },
    copyApproval: "approved",
  },
  founder: {
    id: "founder",
    profile: {
      name: "Kaio Vinícios",
      role: "Fundador e engenheiro principal",
      note: "Comecei a Voynan para construir os produtos que eu queria usar e, depois, operá-los todos os dias. Cada sistema que entrego a um cliente passa pelo mesmo critério: precisa continuar funcionando quando ninguém está olhando. É esse padrão que ofereço a quem constrói conosco.",
      portraitSrc: founderPortrait,
      portraitAlt:
        "Retrato em pixel art de Kaio Vinícios, de braços cruzados e usando camiseta preta.",
      source:
        "src/assets/pixelated_portrait.png — imagem fornecida e aprovada por Kaio Vinícios em 2026-08-30",
      approval: "approved",
    },
    social: [
      {
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/kaiovinicios/",
        approval: "approved",
      },
      {
        platform: "x",
        label: "X",
        href: "https://x.com/KaioVinicios__",
        approval: "approved",
      },
      {
        platform: "github",
        label: "GitHub",
        href: "https://github.com/KaioVinicios",
        approval: "approved",
      },
    ],
  },
  contact: {
    id: "contact",
    title: "Vamos construir algo que continue evoluindo.",
    commercialNote:
      "A conversa inicial é gratuita. A maioria dos orçamentos também não tem custo. Se o seu projeto exigir uma etapa paga de diagnóstico, avisaremos antes de qualquer compromisso.",
    ctaLabel: "Iniciar conversa",
    publicEmail: { label: "E-mail", approval: "missing" },
    linkedIn: { label: "LinkedIn", approval: "missing" },
    privacyPolicy: {
      label: "Política de privacidade",
      approval: "missing",
    },
    terms: { label: "Termos", approval: "missing" },
    copyApproval: "received",
  },
  footer: { approval: "missing" },
} satisfies LandingContentDraft
