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

export const englishLandingContent = {
  locale: "en",
  metadata: {
    title: "Voynan — We build digital products. For us. For you.",
    description:
      "Our own SaaS products and software engineering that turn ideas into systems built for the real world.",
    openGraphTitle: "Voynan — We build digital products. For us. For you.",
    openGraphDescription:
      "Our own SaaS products and software engineering that turn ideas into systems built for the real world.",
    approval: "approved",
  },
  hero: {
    id: "hero",
    kicker: "Voynan / Product studio",
    title: "We build digital products. For us. For you.",
    support:
      "Our own SaaS products and software engineering that turn ideas into systems built for the real world.",
    contextLine:
      "2 SaaS products in production · 1 product in development · 1 open-source project in development",
    productCta: { label: "Explore our products", sectionId: "products" },
    contactCta: { label: "Build with us", sectionId: "contact" },
    approval: "approved",
  },
  thesis: {
    id: "thesis",
    statement:
      "We do more than deliver software. We launch it, run it and evolve it. That experience shapes every project we build.",
    approval: "approved",
  },
  products: {
    id: "products",
    kicker: "Our products",
    title: "Products we build, operate, and continue to evolve.",
    summary: "2 SaaS products in production · 1 product in development",
    closing:
      "The experience of operating these products is the same experience we bring to every client project.",
    items: [
      {
        id: "cryptovault",
        name: "CryptoVault",
        stage: "production",
        kicker: "01 / SaaS",
        title: "Protect files. Prove their integrity.",
        support:
          "Authenticated encryption, integrity validation and verifiable records for files that cannot rely on trust alone.",
        capabilities: [
          "AES-GCM encryption",
          "Integrity validation",
          "Verifiable blockchain record",
        ],
        destination: {
          label: "Explore CryptoVault",
          href: "https://cryptovault.rosetta-solutions.com/",
          approval: "approved",
        },
        claimReview: {
          text: "File integrity and verifiable records",
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
          alt: "CryptoVault's home page: the product header above the headline “Your Files. Your Keys. Your Control.” and buttons to upload a first file or open the API documentation.",
          source:
            "src/assets/crypto-vault/cryptovault-evidence-desktop.avif, -mobile.avif and -poster.jpg — captured from https://cryptovault.rosetta-solutions.com/ on 2026-09-07; Voynan-owned product, capture approved by Kaio Vinícios",
          approval: "approved",
        },
        copyApproval: "approved",
      },
      {
        id: "bullledger",
        name: "BullLedger",
        stage: "production",
        kicker: "02 / SaaS",
        title: "Your investments, beyond spreadsheets.",
        support:
          "Track assets across Brazil, the United States and Canada, generate reports and turn scattered data into clearer decisions.",
        capabilities: [
          "Investment tracking across three markets",
          "Reports and insights",
          "Organization of information for income tax reporting",
        ],
        destination: {
          label: "Explore BullLedger",
          href: "https://bull-ledger.voynan.com",
          approval: "approved",
        },
        claimReview: {
          text: "Organization and analysis of financial and tax data",
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
          alt: "BullLedger's Overview page: the product sidebar beside a portfolio summary with total value, nominal return and free cash, above a month-by-month line chart of demonstration data.",
          source:
            "src/assets/bull-ledger/bullledger-evidence-desktop.avif, -mobile.avif and -poster.jpg — captured from http://localhost:5173/app, a development build of https://bull-ledger.voynan.com, on 2026-09-07 with seeded demonstration data; the signed-in account address and the development-build label were hidden before capture, nothing was added or altered; Voynan-owned product, capture approved by Kaio Vinícios",
          approval: "approved",
        },
        copyApproval: "approved",
      },
      {
        id: "constrully",
        name: "Constrully",
        stage: "development",
        kicker: "03 / SaaS",
        title: "Every construction cost, under control.",
        support:
          "Manage expenses, track taxes and generate reports with an up-to-date view of every construction project.",
        capabilities: [
          "Expense management and tracking",
          "Tracking of construction-related taxes",
          "Operational and tax reports",
        ],
        icon: {
          src: construllyIcon,
          alt: "Constrully icon: four stacked architectural chevrons in a silver-to-slate gradient.",
          width: 1254,
          height: 1254,
          source:
            "src/assets/constrully/constrully-icon.svg — Voynan-owned asset",
          approval: "approved",
        },
        destination: {
          label: "Explore Constrully",
          href: "https://constrully.voynan.com",
          approval: "approved",
        },
        claimReview: {
          text: "Organization of construction costs, taxes and reports",
          category: "tax",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "approved",
      },
    ],
  },
  services: {
    id: "services",
    kicker: "Build with us",
    title: "The experience of running our products, applied to yours.",
    support:
      "We build projects of every size—from focused automations to complex digital systems—with engineering designed to keep evolving after launch.",
    layers: [
      { title: "Build", capabilities: ["Web and mobile development"] },
      {
        title: "Connect and automate",
        capabilities: ["APIs, integrations, automation, and AI"],
      },
      {
        title: "Operate with confidence",
        capabilities: ["Cloud/DevOps, security, maintenance, and evolution"],
      },
      {
        title: "Expand frontiers",
        capabilities: ["Web3 and blockchain"],
      },
    ],
    cta: { label: "Start a conversation", sectionId: "contact" },
    approval: "approved",
  },
  aegis: {
    id: "aegis",
    stage: "development",
    kicker: "Open source / Coming soon",
    title: "File encryption, without the friction.",
    support:
      "A library for encrypting and authenticating files of any format or size with AES-GCM, designed for straightforward implementation.",
    github: {
      label: "View on GitHub",
      href: "https://github.com/Voynan/aegis",
      approval: "approved",
    },
    documentation: {
      label: "Read the docs",
      href: "https://github.com/Voynan/aegis/blob/main/README.md",
      approval: "received",
    },
    technicalEvidence: { approval: "missing" },
    logo: {
      src: aegisLogo,
      alt: "Aegis logo: the word αιγις in Greek letters, with a purple-to-magenta gradient.",
      width: 649,
      height: 262,
      source: "src/assets/aegis/aegis-logo.svg — Voynan-owned asset",
      approval: "approved",
    },
    copyApproval: "approved",
  },
  founder: {
    id: "founder",
    profile: {
      name: "Kaio Vinícios",
      role: "Founder and principal engineer",
      note: "I started Voynan to build the products I wanted to use, and then to run them every day. Every system I hand to a client meets the same bar: it has to keep working when nobody is watching. That standard is what I bring to everyone who builds with us.",
      portraitSrc: founderPortrait,
      portraitAlt:
        "Pixel-art portrait of Kaio Vinícios with his arms crossed, wearing a black T-shirt.",
      source:
        "src/assets/pixelated_portrait.png — image supplied and approved by Kaio Vinícios on 2026-08-30",
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
    title: "Let’s build something that keeps evolving.",
    commercialNote:
      "The initial conversation is free. Most estimates are free as well. If your project requires a paid discovery phase, we will tell you before any commitment is made.",
    ctaLabel: "Start a conversation",
    publicEmail: {
      label: "Email",
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
      label: "Privacy policy",
      href: "/privacy",
      approval: "approved",
    },
    terms: { label: "Terms", href: "/terms", approval: "approved" },
    copyApproval: "approved",
  },
  footer: {
    creatorNotice:
      "All featured products and services are created and maintained by Voynan.",
    approval: "approved",
  },
} satisfies LandingContentDraft
