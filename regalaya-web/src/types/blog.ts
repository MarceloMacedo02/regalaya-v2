// Blog types

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: Author
  category: BlogCategory
  tags: string[]
  publishedAt: string
  updatedAt: string
  readTime: number // minutes
  views: number
  isFeatured: boolean
  status: "draft" | "published" | "scheduled"
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}

export interface BlogCategory {
  id: string
  slug: string
  name: string
  description?: string
  color: string
}

export interface BlogTag {
  id: string
  slug: string
  name: string
  count: number // number of posts with this tag
}

// Mock data
export const blogCategories: BlogCategory[] = [
  {
    id: "1",
    slug: "dicas",
    name: "Dicas",
    description: "Dicas e conselhos para escolher o presente perfeito",
    color: "bg-blue-500",
  },
  {
    id: "2",
    slug: "ocasioes",
    name: "Ocasiões",
    description: "Ideias de presentes para cada ocasião especial",
    color: "bg-pink-500",
  },
  {
    id: "3",
    slug: "tendencias",
    name: "Tendências",
    description: "Últimas tendências em presentes e decoração",
    color: "bg-purple-500",
  },
  {
    id: "4",
    slug: "tutorial",
    name: "Tutoriais",
    description: "Passo a passo e como fazer",
    color: "bg-green-500",
  },
]

export const blogAuthors: Author[] = [
  {
    id: "1",
    name: "Maria Santos",
    avatar: "/avatars/author1.jpg",
    bio: "Especialista em presentes e curadoria de produtos",
    socialLinks: {
      instagram: "@mariasantos",
      linkedin: "mariasantos",
    },
  },
  {
    id: "2",
    name: "Carlos Silva",
    avatar: "/avatars/author2.jpg",
    bio: "Escritor e entusiasta de experiências únicas",
    socialLinks: {
      twitter: "@carlossilva",
    },
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "como-escolher-presente-perfeito",
    title: "Como Escolher o Presente Perfeito para Qualquer Ocasião",
    excerpt: "Descubra o guia definitivo para selecionar presentes memoráveis que vão encantar quem você ama.",
    content: `
      <p>Escolher o presente perfeito pode parecer desafiador, mas com as dicas certas, você vai se tornar um expert em presentear!</p>
      
      <h2>1. Conheça a Pessoa</h2>
      <p>O primeiro passo é entender os gostos, hobbies e interesses da pessoa. Observe o que ela faz no tempo livre, quais são suas cores favoritas, e que tipo de coisas ela valoriza.</p>
      
      <h2>2. Considere a Ocasião</h2>
      <p>Cada ocasião pede um tipo diferente de presente. Um aniversário de casamento pede algo mais sofisticado, enquanto um aniversário de amigo pode ser mais descontraído.</p>
      
      <h2>3. Pense em Experiências</h2>
      <p>Muitas vezes, uma experiência memorável vale mais que um objeto. Considere presentes como jantares, passeios, ou workshops.</p>
      
      <h2>4. Personalize</h2>
      <p>Presentes personalizados mostram que você se dedicou e pensou na pessoa. Pode ser algo simples como uma mensagem escrita à mão.</p>
      
      <h2>5. Não Deixe para a Última Hora</h2>
      <p>Planejar com antecedência permite que você escolha com calma e encontre algo realmente especial.</p>
    `,
    coverImage: "/images/blog/como-escolher-presente.jpg",
    author: blogAuthors[0],
    category: blogCategories[0],
    tags: ["dicas", "presentes", "guia"],
    publishedAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
    readTime: 5,
    views: 1250,
    isFeatured: true,
    status: "published",
  },
  {
    id: "2",
    slug: "presentes-dia-namorados",
    title: "10 Ideias de Presentes Românticos para o Dia dos Namorados",
    excerpt: "Surpreenda seu amor com presentes inesquecíveis. Confira nossa seleção especial.",
    content: `
      <p>O Dia dos Namorados está chegando e você quer surpreender? Separamos 10 ideias incríveis!</p>
      
      <h2>1. Caixa de Bombons Personalizada</h2>
      <p>Chocolates são clássicos, mas uma caixa personalizada com os sabores favoritos do seu amor é ainda melhor.</p>
      
      <h2>2. Buquê de Flores Artesanais</h2>
      <p>Flores que nunca murcham, feitas à mão com carinho.</p>
      
      <h2>3. Jantar Surpresa</h2>
      <p>Prepare o prato favorito do seu parceiro e crie uma atmosfera romântica.</p>
    `,
    coverImage: "/images/blog/dia-namorados.jpg",
    author: blogAuthors[0],
    category: blogCategories[1],
    tags: ["dia dos namorados", "romântico", "amor"],
    publishedAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
    readTime: 4,
    views: 890,
    isFeatured: true,
    status: "published",
  },
  {
    id: "3",
    slug: "presentes-natal",
    title: "Guia de Presentes de Natal: Dicas para Toda a Família",
    excerpt: "O Natal está chegando! Veja nossas sugestões para presentear toda a família.",
    content: `
      <p>O Natal é uma época de amor e generosidade. Confira nossas dicas para acertar nos presentes!</p>
      
      <h2>Para Ela</h2>
      <p>Produtos de beleza, acessórios ou uma experiência de spa.</p>
      
      <h2>Para Ele</h2>
      <p>Vinhos, gadgets ou itens de hobby.</p>
      
      <h2>Para Crianças</h2>
      <p>Brinquedos educativos e divertidos.</p>
    `,
    coverImage: "/images/blog/natal.jpg",
    author: blogAuthors[1],
    category: blogCategories[1],
    tags: ["natal", "família", "presentes"],
    publishedAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
    readTime: 6,
    views: 2100,
    isFeatured: false,
    status: "published",
  },
  {
    id: "4",
    slug: "tendencias-presentes-2026",
    title: "Tendências de Presentes para 2026",
    excerpt: "Descubra o que está em alta no mundo dos presentes este ano.",
    content: `
      <p>2026 traz tendências interessantes no mundo dos presentes!</p>
      
      <h2>Sustentabilidade</h2>
      <p>Presentes eco-friendly e sustentáveis estão em alta.</p>
      
      <h2>Personalização</h2>
      <p>Itens customizados e únicos são cada vez mais valorizados.</p>
      
      <h2>Experiências</h2>
      <p>Viver momentos juntos vale mais que objetos.</p>
    `,
    coverImage: "/images/blog/tendencias-2026.jpg",
    author: blogAuthors[0],
    category: blogCategories[2],
    tags: ["tendências", "2026", "inovacao"],
    publishedAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
    readTime: 4,
    views: 1500,
    isFeatured: false,
    status: "published",
  },
  {
    id: "5",
    slug: "como-embalar-presentes",
    title: "Como Embalar Presentes como um Profissional",
    excerpt: "Aprenda técnicas de embalagem que vão impressionar.",
    content: `
      <p>Uma embalagem bonita faz toda a diferença! Aprenda técnicas profissionais.</p>
      
      <h2>Materiais Necessários</h2>
      <p>Papel de qualidade, fitas, laços e tags.</p>
      
      <h2>Técnica Básica</h2>
      <p>Siga nosso passo a passo para uma embalagem perfeita.</p>
    `,
    coverImage: "/images/blog/embalagem.jpg",
    author: blogAuthors[1],
    category: blogCategories[3],
    tags: ["tutorial", "embalagem", "diy"],
    publishedAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
    readTime: 5,
    views: 780,
    isFeatured: false,
    status: "published",
  },
]
