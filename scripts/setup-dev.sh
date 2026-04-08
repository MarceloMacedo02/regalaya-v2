#!/bin/bash
# ===================================================================
# REGALAYA - Script de Setup para Desenvolvimento
# ===================================================================
# Uso: ./scripts/setup-dev.sh
# Requer: Docker, Docker Compose, curl
# ===================================================================

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Banner
echo ""
echo "========================================"
echo "   REGALAYA - Setup de Desenvolvimento"
echo "========================================"
echo ""

# Verificar pré-requisitos
check_prerequisites() {
    log_info "Verificando pré-requisitos..."

    local missing=()

    # Docker
    if ! command -v docker &> /dev/null; then
        missing+=("Docker")
    fi

    # Docker Compose
    if ! docker compose version &> /dev/null 2>&1 && ! command -v docker-compose &> /dev/null; then
        missing+=("Docker Compose")
    fi

    # curl
    if ! command -v curl &> /dev/null; then
        missing+=("curl")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        log_error "Pré-requisitos faltando:"
        for item in "${missing[@]}"; do
            echo "  - $item"
        done
        echo ""
        log_info "Instale os pré-requisitos e execute este script novamente."
        exit 1
    fi

    log_success "Todos os pré-requisitos encontrados!"
}

# Verificar Docker daemon
check_docker() {
    log_info "Verificando Docker daemon..."
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon não está rodando!"
        log_info "Inicie o Docker e execute este script novamente."
        exit 1
    fi
    
    log_success "Docker daemon está rodando!"
}

# Setup Backend (regalaya-api)
setup_backend() {
    log_info "Configurando Backend (regalaya-api)..."
    
    cd regalaya-api
    
    # Criar .env se não existir
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            log_success "Arquivo .env criado a partir do .env.example"
        else
            cat > .env << 'EOF'
# Database
DB_USERNAME=regalaya
DB_PASSWORD=postgres
POSTGRES_DB=regalaya
POSTGRES_PASSWORD=postgres

# JWT (Change this in production!)
JWT_SECRET=regalaya-dev-secret-key-change-in-production-minimum-256-bits

# Email (optional - for password recovery)
EMAIL_FROM=noreply@regalaya.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=
EMAIL_PASSWORD=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# Spring Profiles
SPRING_PROFILES_ACTIVE=dev,docker

# AWS / LocalStack Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT_URL=http://localhost:4566
AWS_S3_BUCKET=regalaya-uploads
EOF
            log_success "Arquivo .env criado com valores padrão"
        fi
    else
        log_warning ".env já existe, pulando..."
    fi
    
    # Verificar se Java está disponível (opcional - pode usar Docker)
    if command -v java &> /dev/null; then
        log_info "Java detectado: $(java -version 2>&1 | head -n 1)"
    else
        log_info "Java não detectado localmente - usando Docker para build"
    fi
    
    # Verificar se Maven está disponível (opcional)
    if command -v mvn &> /dev/null; then
        log_info "Maven detectado: $(mvn -version 2>&1 | head -n 1)"
    else
        log_info "Maven não detectado localmente - usando Docker para build"
    fi
    
    cd ..
    log_success "Backend configurado!"
}

# Setup Frontend (regalaya-web)
setup_frontend() {
    log_info "Configurando Frontend (regalaya-web)..."
    
    cd regalaya-web
    
    # Criar .env.local se não existir
    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            cp .env.example .env.local
            log_success "Arquivo .env.local criado a partir do .env.example"
        else
            cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Regalaya
NEXT_PUBLIC_SITE_DESCRIPTION=Plataforma Omnichannel de Presentes com IA

# Authentication
NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD=300

# Feature Flags
NEXT_PUBLIC_ENABLE_TRADITIONAL_LOGIN=true
NEXT_PUBLIC_ENABLE_OTP_LOGIN=true
NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=false

# Session
NEXT_PUBLIC_SESSION_TIMEOUT=604800000

# Cache
NEXT_PUBLIC_CACHE_TTL=3600

# Upload
NEXT_PUBLIC_MAX_UPLOAD_SIZE=5242880
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
EOF
            log_success "Arquivo .env.local criado com valores padrão"
        fi
    else
        log_warning ".env.local já existe, pulando..."
    fi
    
    cd ..
    log_success "Frontend configurado!"
}

# Iniciar serviços com Docker
start_services() {
    log_info "Iniciando serviços com Docker Compose..."
    
    # Verificar se docker-compose.yml existe no raiz
    if [ ! -f docker-compose.yml ]; then
        log_warning "docker-compose.yml não encontrado no raiz!"
        log_info "Criando compose unificado..."
        
        cat > docker-compose.yml << 'EOF'
version: '3.8'

# ===================================================================
# REGALAYA - Docker Compose Unificado para Desenvolvimento
# ===================================================================
# Uso: docker-compose up -d
# Parar: docker-compose down
# Limpar volumes: docker-compose down -v
# ===================================================================

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: regalaya-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-regalaya_dev}
      POSTGRES_USER: ${POSTGRES_USER:-regalaya}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-regalaya123}
      TZ: America/Sao_Paulo
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-regalaya} -d ${POSTGRES_DB:-regalaya_dev}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - regalaya-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: regalaya-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - regalaya-network

  # Mailpit (SMTP local)
  mailpit:
    image: axllent/mailpit:latest
    container_name: regalaya-mailpit
    restart: unless-stopped
    ports:
      - "1025:1025"
      - "8025:8025"
    networks:
      - regalaya-network

  # LocalStack (AWS emulator)
  localstack:
    image: localstack/localstack-pro:latest
    container_name: regalaya-localstack
    restart: unless-stopped
    environment:
      - SERVICES=s3,sqs,sns,ses,lambda
      - DEFAULT_REGION=us-east-1
      - DEBUG=1
    ports:
      - "4566:4566"
    volumes:
      - localstack_data:/var/lib/localstack
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - regalaya-network

networks:
  regalaya-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  localstack_data:
EOF
        log_success "docker-compose.yml criado!"
    fi
    
    # Iniciar serviços básicos
    log_info "Iniciando serviços (postgres, redis, mailpit, localstack)..."
    docker compose up -d postgres redis mailpit localstack
    
    # Aguardar PostgreSQL estar pronto
    log_info "Aguardando PostgreSQL estar pronto..."
    for i in {1..30}; do
        if docker exec regalaya-postgres pg_isready -U regalaya -d regalaya_dev &> /dev/null; then
            log_success "PostgreSQL está pronto!"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "PostgreSQL não ficou pronto a tempo!"
            exit 1
        fi
        sleep 2
    done
    
    # Aguardar Redis estar pronto
    log_info "Aguardando Redis estar pronto..."
    for i in {1..15}; do
        if docker exec regalaya-redis redis-cli ping &> /dev/null; then
            log_success "Redis está pronto!"
            break
        fi
        if [ $i -eq 15 ]; then
            log_error "Redis não ficou pronto a tempo!"
            exit 1
        fi
        sleep 1
    done
    
    log_success "Serviços iniciados!"
}

# Verificar setup
verify_setup() {
    log_info "Verificando setup..."
    
    local all_ok=true
    
    # Verificar containers
    echo ""
    echo "Container Status:"
    echo "-----------------"
    
    for container in regalaya-postgres regalaya-redis regalaya-mailpit regalaya-localstack; do
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            status=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo "running")
            echo -e "  $container: ${GREEN}✓ running${NC}"
        else
            echo -e "  $container: ${RED}✗ not running${NC}"
            all_ok=false
        fi
    done
    
    echo ""
    
    # Verificar arquivos
    echo "Arquivos de Configuração:"
    echo "-------------------------"
    
    if [ -f regalaya-api/.env ]; then
        echo -e "  regalaya-api/.env: ${GREEN}✓${NC}"
    else
        echo -e "  regalaya-api/.env: ${RED}✗${NC}"
        all_ok=false
    fi
    
    if [ -f regalaya-web/.env.local ]; then
        echo -e "  regalaya-web/.env.local: ${GREEN}✓${NC}"
    else
        echo -e "  regalaya-web/.env.local: ${RED}✗${NC}"
        all_ok=false
    fi
    
    echo ""
    
    if $all_ok; then
        log_success "Setup verificado com sucesso!"
    else
        log_warning "Alguns problemas foram encontrados."
    fi
}

# Mostrar instruções finais
show_instructions() {
    echo ""
    echo "========================================"
    echo "   Setup Concluído!"
    echo "========================================"
    echo ""
    echo "Próximos passos:"
    echo ""
    echo "1. Iniciar a aplicação:"
    echo "   Backend:  cd regalaya-api && docker compose up -d"
    echo "   Frontend: cd regalaya-web && npm run dev"
    echo ""
    echo "2. Ou usar o script de desenvolvimento:"
    echo "   ./scripts/dev.sh"
    echo ""
    echo "3. Acessar serviços:"
    echo "   - API:       http://localhost:8080"
    echo "   - Swagger:   http://localhost:8080/api/swagger-ui.html"
    echo "   - Web:       http://localhost:3000"
    echo "   - Mailpit:   http://localhost:8025"
    echo "   - LocalStack: http://localhost:4566"
    echo ""
    echo "4. Comandos úteis:"
    echo "   - Ver logs:    docker compose logs -f"
    echo "   - Parar:       docker compose down"
    echo "   - Limpar:      docker compose down -v"
    echo ""
}

# Main
main() {
    check_prerequisites
    check_docker
    setup_backend
    setup_frontend
    start_services
    verify_setup
    show_instructions
    
    log_success "Setup concluído com sucesso!"
}

# Executar
main "$@"
