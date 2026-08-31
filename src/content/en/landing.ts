import aegisLogo from "@/assets/aegis/aegis-logo.svg"
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
    approval: "received",
  },
  hero: {
    id: "hero",
    kicker: "Voynan / Product studio",
    title: "We build digital products. For us. For you.",
    support:
      "Our own SaaS products and software engineering that turn ideas into systems built for the real world.",
    contextLine:
      "3 SaaS products in production · 1 open-source project on the way · end-to-end development",
    productCta: { label: "Explore our products", sectionId: "products" },
    contactCta: { label: "Build with us", sectionId: "contact" },
    approval: "received",
  },
  thesis: {
    id: "thesis",
    statement:
      "We do more than deliver software. We launch it, run it and evolve it. That experience shapes every project we build.",
    approval: "received",
  },
  products: {
    id: "products",
    items: [
      {
        id: "cryptovault",
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
          approval: "missing",
        },
        claimReview: {
          text: "File integrity and verifiable records",
          category: "legal",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "received",
      },
      {
        id: "investfusion",
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
          label: "Explore InvestFusion",
          approval: "missing",
        },
        claimReview: {
          text: "Organization and analysis of financial and tax data",
          category: "financial",
          approval: "missing",
        },
        media: { approval: "missing" },
        copyApproval: "received",
      },
      {
        id: "constrully",
        kicker: "03 / SaaS",
        title: "Every construction cost, under control.",
        support:
          "Manage expenses, track taxes and generate reports with an up-to-date view of every construction project.",
        capabilities: [
          "Expense management and tracking",
          "Tracking of construction-related taxes",
          "Operational and tax reports",
        ],
        destination: {
          label: "Explore Constrully",
          approval: "missing",
        },
        claimReview: {
          text: "Organization of construction costs, taxes and reports",
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
    approval: "received",
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
      href: "/en/privacy",
      approval: "approved",
    },
    terms: { label: "Terms", href: "/en/terms", approval: "approved" },
    copyApproval: "approved",
  },
  footer: {
    creatorNotice:
      "All featured products and services are created and maintained by Voynan.",
    approval: "approved",
  },
} satisfies LandingContentDraft
