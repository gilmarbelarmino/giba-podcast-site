/**
 * Conteúdo e configuração da página pessoal de Gilmar (@gibaz4) — /gibaz4
 *
 * Como editar:
 * - Para publicar um item pendente (canal, projeto social, produto ou material),
 *   preencha os dados confirmados e altere `published: true`.
 * - Para ativar o botão de WhatsApp, preencha `contact.whatsappNumber` apenas
 *   com números (código do país + DDD + número, ex.: "5511999999999").
 * - Para ativar um material digital para download/compra, altere `status` para
 *   `"available"` e informe `downloadOrPurchaseUrl`.
 */

export type ProductCategory =
  | "Esporte e movimento"
  | "Tecnologia"
  | "Organização e rotina"
  | "Livros e aprendizado";

export type ProductPlatform = "Shopee" | "Mercado Livre";

export type SocialRoleType =
  | "Trabalho voluntário"
  | "Apoio pontual"
  | "Divulgação"
  | "Participação profissional"
  | "Trajetória pessoal e divulgação"
  | "Colaboração";

export type Gibaz4Channel = {
  id: string;
  name: string;
  handle?: string;
  platform: "YouTube" | "Instagram" | "TikTok" | "Spotify" | "LinkedIn";
  description: string;
  url: string;
  image?: string;
  ctaLabel: string;
  featured?: boolean;
  published: boolean;
};

export type Gibaz4CurriculumBlock = {
  id: string;
  title: string;
  items: string[];
  published: boolean;
};

export type Gibaz4HistoryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  published: boolean;
};

export type Gibaz4SocialProject = {
  id: string;
  name: string;
  roleType: SocialRoleType;
  description: string;
  participationDetails: string;
  image?: string;
  imageAlt?: string;
  officialUrl?: string;
  helpText?: string;
  helpUrl?: string;
  published: boolean;
};

export type Gibaz4Product = {
  id: string;
  name: string;
  category: ProductCategory;
  platform: ProductPlatform;
  reason: string;
  image: string;
  imageAlt?: string;
  affiliateUrl: string;
  isAffiliate: boolean;
  published: boolean;
};

export type Gibaz4Material = {
  id: string;
  title: string;
  description: string;
  format: string;
  accessType?: "Gratuito" | "Pago";
  status: "available" | "coming_soon";
  coverImage?: string;
  downloadOrPurchaseUrl?: string;
  ctaLabel?: string;
  healthDisclaimer?: string;
  published: boolean;
};

export type Gibaz4Content = {
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
  };
  profile: {
    displayName: string;
    nickname: string;
    handle: string;
    headerTitle: string;
    heroTitle: string;
    introText: string;
    logoImage: string;
    logoAlt: string;
    avatarPhoto: string;
    heroPhoto: string;
    heroPhotoAlt: string;
    podcastSiteUrl: string;
    podcastYoutubeUrl: string;
  };
  contact: {
    /**
     * Número do WhatsApp com código do país (55) + DDD + número, apenas dígitos.
     * Exemplo: "5511999999999". Deixe vazio ("") enquanto não confirmado para ocultar o botão.
     */
    whatsappNumber: string;
    whatsappInitialMessage: string;
    /** Número confirmado para ligações diretas (tel:). Deixe vazio ("") se não aplicável. */
    phoneForCalls: string;
    email: string;
    instagramUrl: string;
    /** URL do perfil no TikTok. Deixe vazio ("") até confirmar para ocultar o botão. */
    tiktokUrl: string;
    youtubeUrl: string;
  };
  channels: Gibaz4Channel[];
  about: {
    eyebrow: string;
    title: string;
    summaryParagraphs: string[];
    historyPhotos: Gibaz4HistoryPhoto[];
    curriculumBlocks: Gibaz4CurriculumBlock[];
  };
  socialProjectsSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  socialProjects: Gibaz4SocialProject[];
  productsSection: {
    eyebrow: string;
    title: string;
    description: string;
    affiliateDisclosure: string;
    priceNote: string;
  };
  products: Gibaz4Product[];
  materialsSection: {
    eyebrow: string;
    title: string;
    description: string;
    generalHealthNotice: string;
  };
  materials: Gibaz4Material[];
};

/**
 * Monta o link oficial do WhatsApp (https://wa.me/...) somente quando há um número válido configurado.
 */
export function buildWhatsAppLink(whatsappNumber: string, initialMessage?: string): string | null {
  const digits = whatsappNumber.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const baseUrl = `https://wa.me/${digits}`;
  if (!initialMessage || !initialMessage.trim()) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(initialMessage.trim())}`;
}

export const GIBAZ4_CONTENT: Gibaz4Content = {
  seo: {
    title: "Gilmar | @gibaz4 — Giba Podcast",
    description:
      "Perfil oficial de Gilmar (@gibaz4): esporte, tecnologia, conversas e vida real. Acesse o Giba Podcast, canais oficiais, trajetória, projetos sociais e materiais para sua rotina.",
    canonicalUrl: "https://gibapodcast.com.br/gibaz4",
    ogImage: "https://gibapodcast.com.br/assets/gibaz4/giba-perfil.jpg",
  },

  profile: {
    displayName: "Gilmar",
    nickname: "Giba",
    handle: "@gibaz4",
    headerTitle: "Giba | @gibaz4",
    heroTitle: "Gilmar • @gibaz4",
    introText:
      "Esporte, tecnologia, conversas e vida real. Conheça minha trajetória, acompanhe meus canais e descubra os projetos dos quais participo.",
    logoImage: "/assets/gibaz4/logo-gb-gilmar.png",
    logoAlt: "Logo oficial Gilmar Belarmino — Esporte, Tecnologia e Vida Real",
    avatarPhoto: "/assets/gibaz4/giba-perfil.jpg",
    heroPhoto: "/assets/gibaz4/giba-perfil.jpg",
    heroPhotoAlt: "Foto de Gilmar (@gibaz4)",
    podcastSiteUrl: "/",
    podcastYoutubeUrl: "https://www.youtube.com/@gibapodcast",
  },

  contact: {
    whatsappNumber: "5511961526673",
    whatsappInitialMessage: "Olá, Gilmar! Vim pela sua página do Instagram.",
    phoneForCalls: "",
    email: "contato@gibapodcast.com.br",
    instagramUrl: "https://www.instagram.com/gibaz4/",
    tiktokUrl: "",
    youtubeUrl: "https://www.youtube.com/@gibapodcast",
  },

  channels: [
    {
      id: "giba-podcast-youtube",
      name: "Giba Podcast",
      handle: "@gibapodcast",
      platform: "YouTube",
      description:
        "Conversas sobre superação, esporte, saúde, tecnologia, negócios e iniciativas que fazem a diferença na sociedade. Episódios completos, cortes e transmissões ao vivo.",
      url: "https://www.youtube.com/@gibapodcast",
      image: "/assets/logo-giba.png",
      ctaLabel: "Assistir no YouTube",
      featured: true,
      published: true,
    },
    {
      id: "instagram-gibaz4",
      name: "Instagram • @gibaz4",
      handle: "@gibaz4",
      platform: "Instagram",
      description:
        "Rotina real, retomada dos treinos, bastidores do estúdio, tecnologia e conexões do dia a dia.",
      url: "https://www.instagram.com/gibaz4/",
      image: "/assets/gibaz4/giba-perfil.jpg",
      ctaLabel: "Acompanhar no Instagram",
      featured: false,
      published: true,
    },
    {
      id: "tiktok-gibaz4",
      name: "TikTok • @gibaz4",
      handle: "@gibaz4",
      platform: "TikTok",
      description: "Cortes rápidos, bastidores e vídeos curtos.",
      url: "",
      ctaLabel: "Seguir no TikTok",
      featured: false,
      published: false,
    },
  ],

  about: {
    eyebrow: "Trajetória e valores",
    title: "Conheça o Giba",
    summaryParagraphs: [
      "Minha história começou no Lar Nossa Senhora Aparecida, onde morei dos 10 aos 21 anos. Foi uma fase que marcou minha vida, construiu muitos dos meus valores e me trouxe experiências que carrego até hoje.",
      "Foi também nessa época que o esporte entrou de vez na minha rotina por meio do ciclismo, participando de competições de mountain bike com a equipe do Lar.",
      "Hoje uno minha atuação em tecnologia e comunicação com a condução do Giba Podcast, a retomada das atividades físicas em busca de qualidade de vida e o apoio a iniciativas que geram impacto positivo.",
    ],
    historyPhotos: [
      {
        id: "foto-historia-lar",
        src: "/assets/gibaz4/giba-minha-historia-lar.jpg",
        alt: "Registros da infância e juventude de Gilmar no Lar Nossa Senhora Aparecida, onde morou dos 10 aos 21 anos",
        caption: "Infância e juventude no Lar Nossa Senhora Aparecida (dos 10 aos 21 anos).",
        width: 1080,
        height: 1350,
        published: true,
      },
      {
        id: "foto-equipe-lar-mtb",
        src: "/assets/gibaz4/giba-ciclismo-equipe-lar.jpg",
        alt: "Gilmar ao lado dos colegas da equipe de ciclismo do Lar na 4ª Copa DirecTV de Mountain Bike Amador",
        caption: "Equipe de mountain bike do Lar em etapa da Copa de Mountain Bike Amador.",
        width: 1080,
        height: 1055,
        published: true,
      },
      {
        id: "foto-podio-mtb",
        src: "/assets/gibaz4/giba-ciclismo-podio.jpg",
        alt: "Pódio da Supercopa de Mountain Bike com integrantes da equipe do Lar",
        caption: "Presença no pódio na Supercopa de Mountain Bike representando a equipe do Lar.",
        width: 1044,
        height: 678,
        published: true,
      },
    ],
    curriculumBlocks: [
      {
        id: "atuacao-profissional",
        title: "Atuação profissional",
        items: [
          "Tecnologia, comunicação e desenvolvimento de projetos digitais.",
          "Apresentação e condução de entrevistas no Giba Podcast, com produção CETUSG.",
        ],
        published: true,
      },
      {
        id: "experiencias-projetos",
        title: "Experiências e projetos",
        items: [
          "Idealização e apresentação do Giba Podcast, dedicado a histórias reais, esporte, saúde, tecnologia e negócios.",
          "Produção de conteúdo multiplataforma conectando empreendedores, atletas e especialistas.",
        ],
        published: true,
      },
      {
        id: "formacao-estudos",
        title: "Formação e estudos",
        items: [
          "Atuação e atualização contínua na área de tecnologia, comunicação e mídia digital.",
        ],
        published: true,
      },
      {
        id: "esporte-trajetoria",
        title: "Esporte e trajetória pessoal",
        items: [
          "Vivência no ciclismo (mountain bike) durante a juventude pela equipe do Lar Nossa Senhora Aparecida.",
          "Retomada consistente das atividades físicas com foco em saúde, disciplina e qualidade de vida.",
        ],
        published: true,
      },
    ],
  },

  socialProjectsSection: {
    eyebrow: "Compromisso e origens",
    title: "Projetos sociais dos quais participo",
    description:
      "Iniciativas e instituições que fazem parte da minha caminhada pessoal ou que acompanho e divulgo.",
  },

  socialProjects: [
    {
      id: "lar-nossa-senhora-aparecida",
      name: "Lar Nossa Senhora Aparecida",
      roleType: "Trajetória pessoal e divulgação",
      description:
        "Instituição onde Gilmar viveu dos 10 aos 21 anos — período fundamental na formação de seus valores pessoais, convivência comunitária e início no ciclismo com a equipe de mountain bike do Lar.",
      participationDetails:
        "Compartilhamento dessa história de vida e divulgação da importância do acolhimento, do esporte e de iniciativas sociais na formação de crianças e jovens.",
      image: "/assets/gibaz4/giba-ciclismo-equipe-lar.jpg",
      imageAlt: "Equipe de ciclismo do Lar Nossa Senhora Aparecida",
      officialUrl: "",
      helpText: "",
      helpUrl: "",
      published: true,
    },
    {
      id: "projeto-social-pendente",
      name: "Nova iniciativa social (a confirmar)",
      roleType: "Trabalho voluntário",
      description: "Descrição confirmada da organização ou ação social.",
      participationDetails: "Detalhamento da participação específica de Gilmar.",
      image: "",
      officialUrl: "",
      helpText: "",
      helpUrl: "",
      published: false,
    },
  ],

  productsSection: {
    eyebrow: "Curadoria pessoal",
    title: "Produtos que eu indico",
    description:
      "Equipamentos, acessórios e leituras selecionados para esporte, tecnologia e organização da rotina.",
    affiliateDisclosure:
      "Alguns links são de afiliado. Posso receber uma comissão pelas compras realizadas por eles.",
    priceNote: "Consultar preço na loja",
  },

  products: [
    {
      id: "produto-exemplo-esporte",
      name: "Produto de esporte e movimento (a confirmar)",
      category: "Esporte e movimento",
      platform: "Mercado Livre",
      reason: "Motivo da indicação confirmado por Gilmar.",
      image: "",
      affiliateUrl: "",
      isAffiliate: true,
      published: false,
    },
    {
      id: "produto-exemplo-tecnologia",
      name: "Produto de tecnologia (a confirmar)",
      category: "Tecnologia",
      platform: "Shopee",
      reason: "Motivo da indicação confirmado por Gilmar.",
      image: "",
      affiliateUrl: "",
      isAffiliate: true,
      published: false,
    },
  ],

  materialsSection: {
    eyebrow: "Ferramentas e leituras",
    title: "Materiais para sua rotina",
    description:
      "Planilhas de organização pessoal e materiais sobre rotina de treinos e qualidade de vida.",
    generalHealthNotice:
      "Observação importante: os materiais compartilhados nesta seção refletem organização e experiência pessoal. Não constituem prescrição individualizada e não substituem o acompanhamento de médicos, nutricionistas ou profissionais de Educação Física.",
  },

  materials: [
    {
      id: "planilha-registro-treinos",
      title: "Planilha de Registro e Acompanhamento de Treinos",
      description:
        "Modelo prático para anotar frequência semanal, atividades realizadas e evolução da sua rotina de movimento.",
      format: "Planilha digital",
      status: "coming_soon",
      healthDisclaimer:
        "Ferramenta de organização pessoal. Não substitui orientação ou prescrição de um profissional de Educação Física.",
      published: true,
    },
    {
      id: "planilha-calculos-treinamento",
      title: "Planilha com Cálculos de Treinamento",
      description:
        "Recurso em estruturação para auxiliar na visualização de métricas básicas de treino após validação do conteúdo.",
      format: "Planilha digital",
      status: "coming_soon",
      healthDisclaimer:
        "Conteúdo em definição e validação. Uso informativo que não substitui avaliação física ou acompanhamento especializado.",
      published: true,
    },
    {
      id: "ebook-jornada-qualidade-vida",
      title: "E-book: Jornada de Qualidade de Vida e Retomada dos Treinos",
      description:
        "Relato pessoal sobre a retomada das atividades físicas, construção de constância e aprendizados na busca por mais saúde no dia a dia.",
      format: "E-book (PDF)",
      status: "coming_soon",
      healthDisclaimer:
        "Relato de experiência pessoal. Não promete resultados específicos e não substitui orientação médica, nutricional ou de Educação Física.",
      published: true,
    },
  ],
};
