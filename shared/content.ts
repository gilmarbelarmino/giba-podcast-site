/**
 * Conteúdo do site do Giba Podcast.
 *
 * Este arquivo define a estrutura do conteúdo e os valores padrão.
 * O painel administrativo (/admin) grava as alterações no banco de dados;
 * enquanto nada for salvo, o site usa exatamente o conteúdo definido aqui.
 *
 * Para trocar um texto rápido sem abrir o painel, edite os valores abaixo.
 */

export type EpisodeType = "Episódio" | "Corte" | "Short" | "Ao vivo";

export type Episode = {
  id: string;
  title: string;
  guest: string;
  /** Data no formato AAAA-MM-DD */
  date: string;
  /** Duração livre, ex.: "48 min". Vazio esconde a etiqueta. */
  duration: string;
  category: "Vida Real" | "Tecnologia" | "Esporte e Qualidade de Vida";
  youtubeId: string;
  /** Capa personalizada opcional (ex.: "/assets/capa-queli-live.png"). */
  thumbnail?: string;
  description: string;
  type: EpisodeType;
  featured: boolean;
};

export type Guest = {
  id: string;
  name: string;
  role: string;
  /** URL da foto. Vazio usa a capa do episódio relacionado. */
  photo: string;
  episodeId: string;
};

export type Stat = { id: string; value: string; label: string };

export type Topic = {
  id: string;
  icon: "briefcase" | "cpu" | "book" | "users" | "heart";
  title: string;
  description: string;
};

export type SocialLink = {
  id: string;
  platform: "YouTube" | "Instagram" | "Spotify" | "TikTok" | "LinkedIn" | "Apple Podcasts" | "WhatsApp";
  url: string;
};

export type SponsorshipTier = {
  id: string;
  name: string;
  tagline: string;
  features: string[];
  highlight: boolean;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    presenter: string;
    production: string;
    logoUrl: string;
    youtubeUrl: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    highlight: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    image: string;
    imageCaption: string;
    badge: string;
  };
  marquee: string[];
  episodesSection: { eyebrow: string; title: string; description: string };
  episodes: Episode[];
  topics: Topic[];
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: string;
    image: string;
    founderName: string;
    founderRole: string;
    founderBio: string;
    productionName: string;
    productionBio: string;
  };
  stats: Stat[];
  guestsSection: { eyebrow: string; title: string; description: string; ctaLabel: string };
  guests: Guest[];
  sponsorship: {
    eyebrow: string;
    title: string;
    description: string;
    tiers: SponsorshipTier[];
    ctaLabel: string;
    ctaHref: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    whatsapp: string;
    location: string;
    subjects: string[];
  };
  newsletter: { title: string; description: string; successMessage: string };
  social: SocialLink[];
  footer: { tagline: string; note: string };
};

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "GIBA Podcast",
    tagline: "Negócios, tecnologia e histórias",
    presenter: "Gilmar Belarmino",
    production: "Produção CETUSG",
    logoUrl: "/assets/logo-giba.png",
    youtubeUrl: "https://www.youtube.com/@gibapodcast",
  },
  hero: {
    eyebrow: "HISTÓRIAS REAIS · ESPORTE · TECNOLOGIA · NEGÓCIOS",
    headline: "Toda história tem o poder de",
    highlight: "inspirar",
    description:
      "O GIBA Podcast é um espaço para conhecer pessoas, compartilhar experiências e descobrir ideias que podem transformar vidas.\n\nCom apresentação de Gilmar Belarmino, cada episódio traz conversas sobre superação, esporte, saúde, tecnologia, negócios e iniciativas que fazem a diferença na sociedade.",
    primaryCtaLabel: "Assistir no YouTube",
    primaryCtaHref: "https://www.youtube.com/@gibapodcast",
    secondaryCtaLabel: "Quero contar minha história",
    secondaryCtaHref: "#contato",
    image: "/assets/estudio-giba.jpg",
    imageCaption: "Estúdio GIBA Podcast · gravação com Dra. Queli Meireles",
    badge: "Novo episódio no ar",
  },
  marquee: [
    "Vida Real",
    "Tecnologia",
    "Esporte e Qualidade de Vida",
    "Carreira",
    "Empreendedorismo",
    "Superação",
    "Conexões",
  ],
  episodesSection: {
    eyebrow: "No ar",
    title: "Últimos episódios",
    description:
      "Entrevistas completas, cortes e conversas ao vivo. Aperte o play sem sair da página.",
  },
  episodes: [
    {
      id: "ep-thiago-campoi",
      title: "De pioneiro do bossaball a dono de escola de inglês: a trajetória de Thiago Campoi",
      guest: "Thiago Campoi",
      date: "2026-11-13",
      duration: "Último episódio",
      category: "Vida Real",
      youtubeId: "5CzKRktl8_U",
      description:
        "Ex-atleta e pioneiro do bossaball no Brasil, Thiago Campoi rodou o mundo jogando, aprendeu inglês na prática, viveu intercâmbio na Austrália e transformou um convite para dar aulas na compra da sua própria unidade da IW English School Santo Eduardo.",
      type: "Episódio",
      featured: true,
    },
    {
      id: "ep-revalida",
      title: "Como passar no Revalida? Dra. Queli conta sua trajetória",
      guest: "Dra. Queli Meireles",
      date: "2026-11-09",
      duration: "Episódio em destaque",
      category: "Esporte e Qualidade de Vida",
      youtubeId: "_TjWFs-ZnjM",
      description:
        "De enfermeira a médica: os critérios para escolher a faculdade no Paraguai, a rotina de estudos, os desafios da segunda fase do Revalida e o papel da família e da fé nessa caminhada.",
      type: "Episódio",
      featured: false,
    },
    {
      id: "corte-thiago-campoi",
      title: "De pioneiro do bossaball a dono de escola de inglês: a trajetória de Thiago Campoi",
      guest: "Thiago Campoi",
      date: "2026-11-13",
      duration: "Corte",
      category: "Vida Real",
      youtubeId: "5CzKRktl8_U",
      description:
        "Como o esporte moldou sua carreira, as viagens pelo mundo onde aprendeu inglês na prática e a virada de chave até se tornar dono da IW English School Santo Eduardo.",
      type: "Corte",
      featured: false,
    },
    {
      id: "corte-faculdade-paraguai",
      title: "Como escolher uma faculdade de Medicina no Paraguai?",
      guest: "Dra. Queli Meireles",
      date: "2026-11-12",
      duration: "Corte",
      category: "Esporte e Qualidade de Vida",
      youtubeId: "DzDodgoV6-g",
      description:
        "Quais critérios avaliar antes de escolher onde estudar Medicina no Paraguai: estrutura da faculdade, laboratórios, salas climatizadas, documentação e referências de quem já estudou na instituição.",
      type: "Corte",
      featured: false,
    },
    {
      id: "corte-como-passar-revalida",
      title: "Como passar no Revalida? Dra. Queli conta sua trajetória",
      guest: "Dra. Queli Meireles",
      date: "2026-11-09",
      duration: "Corte",
      category: "Esporte e Qualidade de Vida",
      youtubeId: "_TjWFs-ZnjM",
      description:
        "Da formação em enfermagem à decisão de cursar Medicina no Paraguai: como pesquisou a faculdade, conciliou os estudos com a família e se preparou para a segunda fase do Revalida.",
      type: "Corte",
      featured: false,
    },
    {
      id: "corte-enfermeira",
      title: "De enfermeira a médica: uma trajetória de fé, família e aprovação no Revalida",
      guest: "Dra. Queli Meireles",
      date: "2026-11-03",
      duration: "Short",
      category: "Esporte e Qualidade de Vida",
      youtubeId: "19SQF3WkYdc",
      description:
        "Uma trajetória de recomeço: como conciliar família, trabalho e estudos até conquistar o registro profissional no Brasil.",
      type: "Short",
      featured: false,
    },
    {
      id: "teaser-novembro",
      title: "Toda conquista tem uma história que merece ser ouvida",
      guest: "Gilmar Belarmino",
      date: "2026-10-30",
      duration: "Short",
      category: "Vida Real",
      youtubeId: "wFLv_Y53VaU",
      description:
        "O convite do GIBA Podcast para quem tem uma história, um propósito e conhecimento para compartilhar.",
      type: "Short",
      featured: false,
    },
    {
      id: "corte-identificacao",
      title: "Sabe quando você ouve uma história e pensa: “Eu também estou passando por isso”?",
      guest: "Gilmar Belarmino",
      date: "2026-10-27",
      duration: "Short",
      category: "Vida Real",
      youtubeId: "CZzbhF7s85Y",
      description:
        "Por que as histórias reais conectam tanto: identificação, aprendizado e novas possibilidades.",
      type: "Short",
      featured: false,
    },
    {
      id: "corte-cursos",
      title: "Otimização de cursos para as empresas hoje: a saída tecnológica mais procurada",
      guest: "GIBA Podcast · CETUSG",
      date: "2026-10-22",
      duration: "Short",
      category: "Tecnologia",
      youtubeId: "fns68QLbGwQ",
      description:
        "Como tecnologia e treinamento corporativo se encontram para acelerar resultados dentro das empresas.",
      type: "Short",
      featured: false,
    },
    {
      id: "live-semanal",
      title: "Dra. Queli Meirelles: foco, fé e aprovação no Revalida",
      guest: "Dra. Queli Meireles",
      date: "2026-11-03",
      duration: "Ao vivo",
      category: "Esporte e Qualidade de Vida",
      youtubeId: "JomldqmgpQQ",
      thumbnail: "/assets/capa-queli-live.png",
      description:
        "Bate-papo completo ao vivo: os detalhes da trajetória na faculdade de Medicina no Paraguai e toda a jornada de estudos até alcançar a aprovação no Revalida.",
      type: "Ao vivo",
      featured: false,
    },
  ],
  topics: [
    {
      id: "vida-real",
      icon: "users",
      title: "Vida Real",
      description:
        "Rotina, escolhas e desafios do dia a dia contados sem roteiro por quem viveu cada decisão de verdade.",
    },
    {
      id: "tecnologia",
      icon: "cpu",
      title: "Tecnologia",
      description:
        "IA, transformação digital e ferramentas que já mudam o dia a dia de profissionais e negócios.",
    },
    {
      id: "esporte",
      icon: "heart",
      title: "Esporte e Qualidade de Vida",
      description:
        "Disciplina, saúde, treino e bem-estar: histórias de quem transformou corpo e mente em propósito.",
    },
  ],
  about: {
    eyebrow: "Sobre o podcast",
    title: "Um espaço para dar voz a quem faz acontecer",
    paragraphs: [
      "O GIBA Podcast foi criado para dar voz a pessoas que transformaram desafios em resultados, construíram negócios, desenvolveram carreiras e decidiram fazer a diferença.",
      "Aqui, cada conversa vai além da entrevista: mostramos trajetórias reais, experiências, aprendizados e estratégias que ajudam outras pessoas a enxergar novas possibilidades.",
      "O programa nasce para fortalecer a comunicação, ampliar a visibilidade e valorizar quem tem uma história, um propósito e conhecimento para compartilhar.",
    ],
    quote: "Histórias que inspiram, conexões que geram oportunidades.",
    image: "/assets/estudio-giba.jpg",
    founderName: "Gilmar Belarmino",
    founderRole: "Apresentador e fundador",
    founderBio:
      "Empreendedor e comunicador, Gilmar conduz cada episódio com escuta atenta e perguntas que tiram a conversa do lugar comum. Sua missão é simples: transformar trajetórias reais em referência para quem está começando.",
    productionName: "CETUSG",
    productionBio:
      "A produção CETUSG cuida de gravação, edição, distribuição e cortes que levam cada episódio para além do YouTube.",
  },
  stats: [
    { id: "inscritos", value: "1,11 mi", label: "inscritos no canal" },
    { id: "videos", value: "10", label: "vídeos publicados" },
    { id: "temas", value: "3", label: "pilares editoriais" },
    { id: "estudio", value: "100%", label: "histórias reais" },
  ],
  guestsSection: {
    eyebrow: "Quem passa pelo estúdio",
    title: "Convidados",
    description:
      "Empreendedores, especialistas e pessoas comuns com histórias extraordinárias. Sua trajetória pode ser a próxima.",
    ctaLabel: "Quero ser convidado(a)",
  },
  guests: [
    {
      id: "thiago-campoi",
      name: "Thiago Campoi",
      role: "Pioneiro do Bossaball · IW English School",
      photo: "",
      episodeId: "ep-thiago-campoi",
    },
    {
      id: "queli",
      name: "Dra. Queli Meireles",
      role: "Médica aprovada no Revalida",
      photo: "/assets/queli-estudio.jpg",
      episodeId: "ep-revalida",
    },
  ],
  sponsorship: {
    eyebrow: "Para marcas",
    title: "Sua marca na conversa",
    description:
      "O GIBA Podcast conecta marcas a uma audiência que valoriza histórias, conhecimento e decisões práticas. Escolha o formato que combina com o seu objetivo.",
    tiers: [
      {
        id: "mencao",
        name: "Menção no episódio",
        tagline: "Presença rápida e direta",
        features: [
          "Abertura e encerramento com o nome da marca",
          "Link e cupom na descrição do vídeo",
          "Corte com a menção para as redes",
        ],
        highlight: false,
      },
      {
        id: "episodio",
        name: "Episódio com a sua marca",
        tagline: "O formato mais completo",
        features: [
          "Pauta alinhada ao posicionamento da marca",
          "Vinheta de abertura personalizada",
          "Cortes dedicados e publicação nas redes",
          "Relatório de alcance após 30 dias",
        ],
        highlight: true,
      },
      {
        id: "temporada",
        name: "Parceria de temporada",
        tagline: "Presença contínua",
        features: [
          "Série de episódios com identidade da marca",
          "Espaço fixo no site e no canal",
          "Ações ao vivo com a audiência",
          "Prioridade em convites e eventos",
        ],
        highlight: false,
      },
    ],
    ctaLabel: "Receber a mídia kit",
    ctaHref: "#contato",
  },
  contact: {
    eyebrow: "Fale com a produção",
    title: "Patrocínio, convite ou sugestão de pauta",
    description:
      "Conte em poucas linhas o que você quer propor. A produção CETUSG responde pelo e-mail informado.",
    email: "contato@gibapodcast.com.br",
    whatsapp: "",
    location: "Estúdio GIBA Podcast",
    subjects: [
      "Patrocínio / parceria",
      "Quero ser convidado(a)",
      "Sugestão de pauta",
      "Imprensa",
      "Outro assunto",
    ],
  },
  newsletter: {
    title: "Receba o próximo episódio antes de todo mundo",
    description:
      "Uma mensagem curta com o episódio da semana, cortes e convidados que estão chegando.",
    successMessage: "Pronto! Você está na lista do GIBA Podcast.",
  },
  social: [
    { id: "youtube", platform: "YouTube", url: "https://www.youtube.com/@gibapodcast" },
  ],
  footer: {
    tagline: "Histórias que inspiram, conexões que geram oportunidades.",
    note: "Negócios, tecnologia e histórias com Gilmar Belarmino.",
  },
};

/** Junta o conteúdo salvo com os padrões, garantindo campos novos após atualizações. */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  if (!saved) return DEFAULT_CONTENT;
  const base = DEFAULT_CONTENT;
  return {
    brand: { ...base.brand, ...saved.brand },
    hero: { ...base.hero, ...saved.hero },
    marquee: Array.isArray(saved.marquee) ? saved.marquee : base.marquee,
    episodesSection: { ...base.episodesSection, ...saved.episodesSection },
    episodes: Array.isArray(saved.episodes) ? saved.episodes : base.episodes,
    topics: Array.isArray(saved.topics) ? saved.topics : base.topics,
    about: { ...base.about, ...saved.about },
    stats: Array.isArray(saved.stats) ? saved.stats : base.stats,
    guestsSection: { ...base.guestsSection, ...saved.guestsSection },
    guests: Array.isArray(saved.guests) ? saved.guests : base.guests,
    sponsorship: { ...base.sponsorship, ...saved.sponsorship },
    contact: { ...base.contact, ...saved.contact },
    newsletter: { ...base.newsletter, ...saved.newsletter },
    social: Array.isArray(saved.social) ? saved.social : base.social,
    footer: { ...base.footer, ...saved.footer },
  };
}

export function youtubeThumbnail(youtubeId: string, quality: "hq" | "max" = "max") {
  if (!youtubeId) return "";
  return `https://i.ytimg.com/vi/${youtubeId}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`;
}

export function formatEpisodeDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(date)
    .replace(".", "");
}
