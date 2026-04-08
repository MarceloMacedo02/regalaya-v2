# ===================================================================
# Regalaya Web - Dockerfile para Produção/Homologação
# ===================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copia package files
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências de build
COPY package.json package-lock.json ./
RUN npm ci

# Copia código fonte
COPY . .

# Build arguments para variáveis de ambiente
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Build da aplicação
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Instala curl para healthcheck
RUN apk add --no-cache curl

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copia dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copia build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia .env.local se existir
COPY .env.local .env.local 2>/dev/null || true

# Usuário não-root
USER nextjs

# Expõe porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Entry point
CMD ["node", "server.js"]
