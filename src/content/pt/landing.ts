import aegisLogo from "@/assets/aegis/aegis-logo.svg"
import bullledgerEvidenceDesktop from "@/assets/bull-ledger/bullledger-evidence-desktop.avif"
import bullledgerEvidenceMobile from "@/assets/bull-ledger/bullledger-evidence-mobile.avif"
import bullledgerEvidencePoster from "@/assets/bull-ledger/bullledger-evidence-poster.jpg"
import cryptovaultEvidenceDesktop from "@/assets/crypto-vault/cryptovault-evidence-desktop.avif"
import cryptovaultEvidenceMobile from "@/assets/crypto-vault/cryptovault-evidence-mobile.avif"
import cryptovaultEvidencePoster from "@/assets/crypto-vault/cryptovault-evidence-poster.jpg"
import construllyIcon from "@/assets/constrully/constrully-icon.svg"
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
      "2 SaaS em produção · 1 produto em desenvolvimento · 1 projeto open source em desenvolvimento",
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
    kicker: "Produtos próprios",
    title: "Produtos que construímos, operamos e continuamos evoluindo.",
    summary: "2 SaaS em produção · 1 produto em desenvolvimento",
    closing:
      "A experiência de operar esses produtos é a mesma que levamos para cada projeto de cliente.",
    items: [
      {
        id: "cryptovault",
        name: "CryptoVault",
        stage: "production",
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
          href: "https://cryptovault.rosetta-solutions.com/",
          approval: "approved",
        },
        claimReview: {
          text: "Integridade e registro verificável de arquivos",
          category: "legal",
          approval: "missing",
        },
        media: {
          desktopSrc: cryptovaultEvidenceDesktop,
          mobileSrc: cryptovaultEvidenceMobile,
          posterSrc: cryptovaultEvidencePoster,
          width: 1280,
          height: 960,
          mobileWidth: 1040,
          mobileHeight: 1300,
          alt: "Página inicial do CryptoVault: o cabeçalho do produto acima do título “Your Files. Your Keys. Your Control.” e botões para enviar o primeiro arquivo ou abrir a documentação da API.",
          source:
            "src/assets/crypto-vault/cryptovault-evidence-desktop.avif, -mobile.avif and -poster.jpg — captured from https://cryptovault.rosetta-solutions.com/ on 2026-09-07; Voynan-owned product, capture approved by Kaio Vinícios",
          approval: "approved",
        },
        copyApproval: "received",
      },
      {
        id: "bullledger",
        name: "BullLedger",
        stage: "production",
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
          label: "Conhecer o BullLedger",
          href: "https://bull-ledger.voynan.com",
          approval: "approved",
        },
        claimReview: {
          text: "Organização e análise de dados financeiros e tributários",
          category: "financial",
          approval: "missing",
        },
        media: {
          desktopSrc: bullledgerEvidenceDesktop,
          mobileSrc: bullledgerEvidenceMobile,
          posterSrc: bullledgerEvidencePoster,
          width: 1280,
          height: 960,
          mobileWidth: 1040,
          mobileHeight: 1419,
          alt: "Página Overview do BullLedger: a barra lateral do produto ao lado de um resumo da carteira com valor total, retorno nominal e caixa livre, acima de um gráfico de linha mês a mês com dados de demonstração.",
          source:
            "src/assets/bull-ledger/bullledger-evidence-desktop.avif, -mobile.avif and -poster.jpg — captured from http://localhost:5173/app, a development build of https://bull-ledger.voynan.com, on 2026-09-07 with seeded demonstration data; the signed-in account address and the development-build label were hidden before capture, nothing was added or altered; Voynan-owned product, capture approved by Kaio Vinícios",
          approval: "approved",
        },
        copyApproval: "received",
      },
      {
        id: "constrully",
        name: "Constrully",
        stage: "development",
        kicker: "03 / SaaS",
        title: "Cada custo da obra, sob controle.",
        support:
          "Gerencie gastos, acompanhe impostos e gere relatórios para tomar decisões com uma visão atualizada de cada obra.",
        capabilities: [
          "Gestão e acompanhamento de despesas",
          "Acompanhamento de impostos relacionados à construção",
          "Relatórios operacionais e tributários",
        ],
        icon: {
          src: construllyIcon,
          alt: "Ícone do Constrully: quatro chevrons arquitetônicos empilhados, em gradiente prata para ardósia.",
          width: 1254,
          height: 1254,
          source:
            "src/assets/constrully/constrully-icon.svg — Voynan-owned asset",
          approval: "approved",
        },
        destination: {
          label: "Conhecer o Constrully",
          href: "https://constrully.voynan.com",
          approval: "approved",
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
    publicEmail: {
      label: "E-mail",
      address: "contact@voynan.com",
      approval: "approved",
    },
    social: [
      {
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/voynan/",
        approval: "approved",
      },
      {
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/voynan_/",
        approval: "approved",
      },
      {
        platform: "x",
        label: "X",
        href: "https://x.com/voynan_",
        approval: "approved",
      },
      {
        platform: "github",
        label: "GitHub",
        href: "https://github.com/Voynan",
        approval: "approved",
      },
    ],
    privacyPolicy: {
      label: "Política de privacidade",
      href: "/privacy",
      approval: "approved",
    },
    terms: { label: "Termos", href: "/terms", approval: "approved" },
    copyApproval: "approved",
  },
  footer: {
    creatorNotice:
      "Todos os produtos e serviços apresentados são criados e mantidos por Voynan.",
    approval: "approved",
  },
} satisfies LandingContentDraft
