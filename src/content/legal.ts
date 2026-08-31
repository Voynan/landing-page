import type { Locale } from "@/content/contracts"

export type LegalDocumentKind = "privacy" | "terms"

type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
}

export type LegalDocument = {
  locale: Locale
  kind: LegalDocumentKind
  title: string
  summary: string
  updatedLabel: string
  updatedDate: string
  backLabel: string
  contentsLabel: string
  languageLabel: string
  contactLabel: string
  metadata: {
    title: string
    description: string
    openGraphTitle: string
    openGraphDescription: string
  }
  sections: LegalSection[]
}

export const legalPaths = {
  privacy: { pt: "/pt/privacidade", en: "/en/privacy" },
  terms: { pt: "/pt/termos", en: "/en/terms" },
} satisfies Record<LegalDocumentKind, Record<Locale, string>>

const portuguesePrivacy: LegalDocument = {
  locale: "pt",
  kind: "privacy",
  title: "Política de privacidade",
  summary:
    "Esta política explica de forma direta quais dados podem ser tratados quando você visita o site da Voynan ou entra em contato conosco.",
  updatedLabel: "Última atualização",
  updatedDate: "30 de agosto de 2026",
  backLabel: "Voltar para a Voynan",
  contentsLabel: "Nesta página",
  languageLabel: "Idioma",
  contactLabel: "Entre em contato",
  metadata: {
    title: "Política de privacidade | Voynan",
    description:
      "Saiba como a Voynan trata dados pessoais no site, em contatos por e-mail e em links para serviços externos.",
    openGraphTitle: "Política de privacidade | Voynan",
    openGraphDescription:
      "Como a Voynan trata dados pessoais no site e em contatos por e-mail.",
  },
  sections: [
    {
      id: "quem-somos",
      title: "1. Quem somos",
      paragraphs: [
        "Voynan é o nome utilizado para identificar o estúdio de produtos e serviços digitais apresentado neste site. Para dúvidas sobre privacidade ou para exercer seus direitos, escreva para contact@voynan.com.",
      ],
    },
    {
      id: "escopo",
      title: "2. Escopo desta política",
      paragraphs: [
        "Esta política se aplica ao site institucional da Voynan e às mensagens enviadas voluntariamente ao nosso endereço de e-mail. Produtos, repositórios e serviços externos acessados por links possuem regras próprias de privacidade.",
      ],
    },
    {
      id: "dados-tecnologias",
      title: "3. Dados e tecnologias utilizados",
      paragraphs: [
        "Na versão atual, o site não oferece contas, pagamentos ou envio ativo de formulários e não utiliza analytics ativo. A preferência de idioma pode ser armazenada localmente no seu navegador para que a próxima visita abra no idioma escolhido.",
        "A infraestrutura que entrega o site pode processar automaticamente dados técnicos, como endereço IP, data e hora da requisição, tipo de navegador e registros de segurança, quando isso for necessário para disponibilizar e proteger o serviço. Esses registros são administrados conforme as práticas do provedor de hospedagem utilizado.",
        "Se ferramentas de analytics ou outras tecnologias de acompanhamento forem ativadas no futuro, esta política será atualizada antes ou no momento dessa mudança e os controles exigidos serão adotados.",
      ],
    },
    {
      id: "contato-email",
      title: "4. Contato por e-mail",
      paragraphs: [
        "Quando você entra em contato, podemos receber seu nome, endereço de e-mail, conteúdo da mensagem e outras informações que decidir compartilhar. Usamos esses dados para responder, avaliar uma possível relação comercial, dar continuidade à conversa e cumprir obrigações legais quando aplicável.",
      ],
    },
    {
      id: "finalidades-bases",
      title: "5. Finalidades e bases legais",
      paragraphs: [
        "O tratamento pode se apoiar, conforme o contexto, em procedimentos preliminares relacionados a um possível contrato, no legítimo interesse de responder comunicações e manter o site seguro, ou no cumprimento de obrigação legal ou regulatória. Quando a lei exigir consentimento para uma finalidade específica, ele será solicitado de forma adequada.",
      ],
    },
    {
      id: "compartilhamento",
      title: "6. Compartilhamento e links externos",
      paragraphs: [
        "Não vendemos dados pessoais. Informações podem ser processadas por fornecedores necessários à operação, como hospedagem e e-mail, ou compartilhadas quando houver obrigação legal, ordem válida ou necessidade de proteger direitos e segurança.",
        "Links para GitHub, redes sociais e outros sites levam a ambientes controlados por terceiros. Recomendamos consultar as políticas desses serviços antes de fornecer dados a eles.",
      ],
    },
    {
      id: "retencao-seguranca",
      title: "7. Retenção e segurança",
      paragraphs: [
        "Mantemos dados somente pelo tempo razoavelmente necessário às finalidades descritas, à continuidade de uma conversa ou ao cumprimento de obrigações legais. Adotamos medidas técnicas e organizacionais proporcionais ao contexto, embora nenhum sistema possa garantir segurança absoluta.",
      ],
    },
    {
      id: "direitos",
      title: "8. Seus direitos",
      paragraphs: [
        "Nos termos da Lei Geral de Proteção de Dados Pessoais (LGPD), você pode solicitar informações e exercer direitos aplicáveis ao seu caso. Envie sua solicitação para contact@voynan.com; poderemos pedir informações suficientes para confirmar sua identidade e proteger seus dados.",
      ],
      items: [
        "confirmação da existência de tratamento e acesso aos dados;",
        "correção de dados incompletos, inexatos ou desatualizados;",
        "anonimização, bloqueio ou eliminação, quando cabível;",
        "informações sobre compartilhamento e portabilidade, quando aplicável;",
        "revogação do consentimento, oposição e revisão de decisões automatizadas, nas hipóteses previstas em lei.",
      ],
    },
    {
      id: "criancas",
      title: "9. Crianças e adolescentes",
      paragraphs: [
        "Este site institucional não é direcionado a crianças. Se você acreditar que dados de uma criança ou adolescente foram enviados de maneira inadequada, entre em contato para avaliarmos e adotarmos as medidas cabíveis.",
      ],
    },
    {
      id: "alteracoes-contato",
      title: "10. Alterações e contato",
      paragraphs: [
        "Podemos atualizar esta política para refletir mudanças no site, nos serviços ou na legislação. A data no início da página indicará a versão vigente. Dúvidas e solicitações podem ser enviadas para contact@voynan.com.",
      ],
    },
  ],
}

const englishPrivacy: LegalDocument = {
  locale: "en",
  kind: "privacy",
  title: "Privacy policy",
  summary:
    "This policy explains in plain language which data may be processed when you visit Voynan’s website or contact us.",
  updatedLabel: "Last updated",
  updatedDate: "August 30, 2026",
  backLabel: "Back to Voynan",
  contentsLabel: "On this page",
  languageLabel: "Language",
  contactLabel: "Contact us",
  metadata: {
    title: "Privacy policy | Voynan",
    description:
      "Learn how Voynan handles personal data on this website, in email communications, and through links to external services.",
    openGraphTitle: "Privacy policy | Voynan",
    openGraphDescription:
      "How Voynan handles personal data on this website and in email communications.",
  },
  sections: [
    {
      id: "who-we-are",
      title: "1. Who we are",
      paragraphs: [
        "Voynan is the name used to identify the digital product and services studio presented on this website. For privacy questions or to exercise your rights, email contact@voynan.com.",
      ],
    },
    {
      id: "scope",
      title: "2. Scope of this policy",
      paragraphs: [
        "This policy applies to Voynan’s institutional website and to messages voluntarily sent to our email address. Products, repositories, and external services reached through links have their own privacy rules.",
      ],
    },
    {
      id: "data-technologies",
      title: "3. Data and technologies used",
      paragraphs: [
        "The current version of the website does not offer accounts, payments, or active form submission, and it does not use active analytics. Your language preference may be stored locally in your browser so a future visit opens in the language you selected.",
        "The infrastructure that delivers the website may automatically process technical data such as IP address, request date and time, browser type, and security logs when needed to provide and protect the service. These records are managed according to the practices of the hosting provider in use.",
        "If analytics or other tracking technologies are enabled in the future, this policy will be updated before or when that change takes place, and any required controls will be implemented.",
      ],
    },
    {
      id: "email-contact",
      title: "4. Contact by email",
      paragraphs: [
        "When you contact us, we may receive your name, email address, message content, and any other information you choose to share. We use this data to respond, evaluate a potential business relationship, continue the conversation, and meet legal obligations where applicable.",
      ],
    },
    {
      id: "purposes-bases",
      title: "5. Purposes and legal bases",
      paragraphs: [
        "Depending on the context, processing may be based on steps taken before a possible contract, the legitimate interest in responding to communications and keeping the website secure, or compliance with a legal or regulatory obligation. When the law requires consent for a specific purpose, it will be requested appropriately.",
      ],
    },
    {
      id: "sharing",
      title: "6. Sharing and external links",
      paragraphs: [
        "We do not sell personal data. Information may be processed by providers required for operations, such as hosting and email, or shared when required by law, a valid order, or the need to protect rights and security.",
        "Links to GitHub, social networks, and other websites lead to environments controlled by third parties. We recommend reviewing their policies before giving them your data.",
      ],
    },
    {
      id: "retention-security",
      title: "7. Retention and security",
      paragraphs: [
        "We keep data only for as long as reasonably necessary for the purposes described, to continue a conversation, or to meet legal obligations. We use technical and organizational measures appropriate to the context, although no system can guarantee absolute security.",
      ],
    },
    {
      id: "rights",
      title: "8. Your rights",
      paragraphs: [
        "Under Brazil’s General Personal Data Protection Law (LGPD), you may request information and exercise rights applicable to your situation. Send your request to contact@voynan.com; we may ask for enough information to verify your identity and protect your data.",
      ],
      items: [
        "confirmation of processing and access to data;",
        "correction of incomplete, inaccurate, or outdated data;",
        "anonymization, blocking, or deletion where applicable;",
        "information about sharing and portability where applicable;",
        "withdrawal of consent, objection, and review of automated decisions in the circumstances provided by law.",
      ],
    },
    {
      id: "children",
      title: "9. Children and teenagers",
      paragraphs: [
        "This institutional website is not directed at children. If you believe a child’s or teenager’s data was submitted improperly, contact us so we can assess the situation and take appropriate measures.",
      ],
    },
    {
      id: "changes-contact",
      title: "10. Changes and contact",
      paragraphs: [
        "We may update this policy to reflect changes to the website, services, or law. The date at the top of the page identifies the current version. Questions and requests may be sent to contact@voynan.com.",
      ],
    },
  ],
}

const portugueseTerms: LegalDocument = {
  locale: "pt",
  kind: "terms",
  title: "Termos de uso",
  summary:
    "Estes termos organizam o uso do site institucional da Voynan e esclarecem o alcance das informações, produtos e serviços apresentados.",
  updatedLabel: "Última atualização",
  updatedDate: "30 de agosto de 2026",
  backLabel: "Voltar para a Voynan",
  contentsLabel: "Nesta página",
  languageLabel: "Idioma",
  contactLabel: "Entre em contato",
  metadata: {
    title: "Termos de uso | Voynan",
    description:
      "Consulte os termos aplicáveis ao uso do site institucional da Voynan e às informações sobre produtos e serviços apresentados.",
    openGraphTitle: "Termos de uso | Voynan",
    openGraphDescription:
      "Termos aplicáveis ao uso do site institucional da Voynan.",
  },
  sections: [
    {
      id: "aceitacao",
      title: "1. Aceitação",
      paragraphs: [
        "Ao acessar este site, você concorda em utilizá-lo de acordo com estes termos e com a legislação aplicável. Se não concordar, interrompa o uso. Estes termos não substituem um contrato específico celebrado para produtos ou serviços.",
      ],
    },
    {
      id: "finalidade",
      title: "2. Finalidade do site",
      paragraphs: [
        "O site apresenta a Voynan, seus produtos, projetos de código aberto e serviços de desenvolvimento. O conteúdo é informativo e não constitui, por si só, proposta vinculante, garantia de disponibilidade, aconselhamento profissional ou contratação automática.",
      ],
    },
    {
      id: "produtos-servicos",
      title: "3. Produtos e serviços",
      paragraphs: [
        "Produtos exibidos podem estar em desenvolvimento, acesso antecipado ou indisponíveis. Recursos, prazos, integrações e condições podem mudar antes de um lançamento. Uma relação comercial somente começa quando as partes concordam com uma proposta, contrato ou instrumento próprio.",
        "O envio de uma mensagem ou pedido de orçamento não obriga nenhuma das partes a contratar. Caso uma etapa de diagnóstico seja paga, isso será informado antes de qualquer compromisso.",
      ],
    },
    {
      id: "uso-aceitavel",
      title: "4. Uso aceitável",
      paragraphs: ["Ao utilizar o site, você não deve:"],
      items: [
        "praticar atos ilícitos, fraudulentos ou que violem direitos de terceiros;",
        "tentar comprometer a segurança, disponibilidade ou funcionamento do site;",
        "introduzir código malicioso, automatizar acessos abusivos ou contornar controles técnicos;",
        "copiar ou apresentar conteúdo da Voynan de modo enganoso ou como se fosse de sua autoria.",
      ],
    },
    {
      id: "autoria",
      title: "5. Autoria e propriedade intelectual",
      paragraphs: [
        "Todos os produtos e serviços apresentados são criados e mantidos por Voynan. Marcas, identidade visual, textos, interfaces e demais materiais do site permanecem sujeitos aos direitos e permissões aplicáveis. Estes termos não concedem licença ampla para reprodução, distribuição ou uso comercial desses materiais.",
      ],
    },
    {
      id: "aegis",
      title: "6. Aegis e código aberto",
      paragraphs: [
        "O Aegis é apresentado como um projeto em desenvolvimento. O uso, a cópia e a distribuição de código publicado em repositórios da Voynan são regidos pela licença indicada no respectivo repositório. Em caso de conflito, a licença do repositório prevalece para aquele código.",
      ],
    },
    {
      id: "links-externos",
      title: "7. Links externos",
      paragraphs: [
        "O site contém links para GitHub, redes sociais e outros serviços de terceiros. Esses ambientes são independentes da Voynan; não controlamos sua disponibilidade, conteúdo, segurança ou práticas. O acesso é de responsabilidade do usuário e sujeito aos termos do terceiro.",
      ],
    },
    {
      id: "disponibilidade",
      title: "8. Disponibilidade e informações",
      paragraphs: [
        "Buscamos manter o site útil e correto, mas ele pode ficar temporariamente indisponível e seu conteúdo pode conter imprecisões ou ficar desatualizado. Informações sobre produtos em desenvolvimento são expectativas atuais, não promessas definitivas.",
      ],
    },
    {
      id: "responsabilidade",
      title: "9. Responsabilidade",
      paragraphs: [
        "Na extensão permitida pela legislação, a Voynan não responde por perdas decorrentes do uso indevido do site, da confiança exclusiva em conteúdo informativo ou de serviços externos. Nada nestes termos exclui direitos ou responsabilidades que não possam ser afastados, inclusive os assegurados pela legislação de proteção ao consumidor quando aplicável.",
      ],
    },
    {
      id: "alteracoes-lei-contato",
      title: "10. Alterações, lei aplicável e contato",
      paragraphs: [
        "Podemos atualizar estes termos para refletir mudanças no site, nos serviços ou na legislação. A versão vigente será indicada pela data no início da página. Estes termos são interpretados conforme as leis da República Federativa do Brasil, preservadas as regras obrigatórias de proteção aplicáveis. Dúvidas podem ser enviadas para contact@voynan.com.",
      ],
    },
  ],
}

const englishTerms: LegalDocument = {
  locale: "en",
  kind: "terms",
  title: "Terms of use",
  summary:
    "These terms govern the use of Voynan’s institutional website and clarify the scope of the information, products, and services presented.",
  updatedLabel: "Last updated",
  updatedDate: "August 30, 2026",
  backLabel: "Back to Voynan",
  contentsLabel: "On this page",
  languageLabel: "Language",
  contactLabel: "Contact us",
  metadata: {
    title: "Terms of use | Voynan",
    description:
      "Read the terms that apply to Voynan’s institutional website and to information about its products and services.",
    openGraphTitle: "Terms of use | Voynan",
    openGraphDescription: "Terms that apply to Voynan’s institutional website.",
  },
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance",
      paragraphs: [
        "By accessing this website, you agree to use it in accordance with these terms and applicable law. If you do not agree, stop using it. These terms do not replace a specific agreement entered into for products or services.",
      ],
    },
    {
      id: "purpose",
      title: "2. Website purpose",
      paragraphs: [
        "The website presents Voynan, its products, open-source projects, and development services. Its content is informational and does not by itself constitute a binding offer, guarantee of availability, professional advice, or automatic engagement.",
      ],
    },
    {
      id: "products-services",
      title: "3. Products and services",
      paragraphs: [
        "Products shown may be in development, early access, or unavailable. Features, timelines, integrations, and terms may change before release. A business relationship begins only when the parties agree to a proposal, contract, or other specific instrument.",
        "Sending a message or requesting an estimate does not require either party to proceed. If a discovery phase involves a fee, this will be disclosed before any commitment.",
      ],
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable use",
      paragraphs: ["When using the website, you must not:"],
      items: [
        "engage in unlawful or fraudulent conduct or violate third-party rights;",
        "attempt to compromise the website’s security, availability, or operation;",
        "introduce malicious code, automate abusive access, or bypass technical controls;",
        "copy or present Voynan content misleadingly or as your own work.",
      ],
    },
    {
      id: "authorship",
      title: "5. Authorship and intellectual property",
      paragraphs: [
        "All featured products and services are created and maintained by Voynan. Trademarks, visual identity, text, interfaces, and other website materials remain subject to applicable rights and permissions. These terms do not grant a broad license to reproduce, distribute, or commercially use those materials.",
      ],
    },
    {
      id: "aegis",
      title: "6. Aegis and open source",
      paragraphs: [
        "Aegis is presented as a project in development. Use, copying, and distribution of code published in Voynan repositories are governed by the license identified in the relevant repository. If these terms and that license conflict, the repository license controls that code.",
      ],
    },
    {
      id: "external-links",
      title: "7. External links",
      paragraphs: [
        "The website links to GitHub, social networks, and other third-party services. Those environments are independent of Voynan; we do not control their availability, content, security, or practices. You access them at your own discretion and under the third party’s terms.",
      ],
    },
    {
      id: "availability",
      title: "8. Availability and information",
      paragraphs: [
        "We aim to keep the website useful and accurate, but it may be temporarily unavailable and its content may include inaccuracies or become outdated. Information about products in development reflects current expectations, not final promises.",
      ],
    },
    {
      id: "liability",
      title: "9. Liability",
      paragraphs: [
        "To the extent permitted by law, Voynan is not responsible for losses caused by misuse of the website, exclusive reliance on informational content, or external services. Nothing in these terms excludes rights or responsibilities that cannot lawfully be limited, including mandatory consumer protections where applicable.",
      ],
    },
    {
      id: "changes-law-contact",
      title: "10. Changes, governing law, and contact",
      paragraphs: [
        "We may update these terms to reflect changes to the website, services, or law. The date at the top of the page identifies the current version. These terms are interpreted under the laws of the Federative Republic of Brazil, subject to any mandatory protections that apply. Questions may be sent to contact@voynan.com.",
      ],
    },
  ],
}

const documents = {
  pt: { privacy: portuguesePrivacy, terms: portugueseTerms },
  en: { privacy: englishPrivacy, terms: englishTerms },
} satisfies Record<Locale, Record<LegalDocumentKind, LegalDocument>>

export function getLegalDocument(
  locale: Locale,
  kind: LegalDocumentKind,
): LegalDocument {
  return documents[locale][kind]
}
