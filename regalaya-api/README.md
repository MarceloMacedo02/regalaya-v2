# Regalaya API

Backend enterprise desenvolvido com Spring Boot 3.4+, seguindo padrões de Clean Architecture, DDD e SOLID.

## 🚀 Tecnologias

- **Java 21** + Spring Boot 3.4+
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação stateless
- **Spring Security** - Controle de acesso
- **Spring Data JPA** - Persistência
- **SpringDoc OpenAPI** - Documentação da API
- **Lombok** - Redução de boilerplate
- **Maven** - Build e dependências

## 📦 Estrutura do Projeto

```
src/main/java/br/com/regalaya/
├── shared/                    # Kernel compartilhado (imutável)
│   ├── config/               # Configurações globais
│   ├── domain/               # Value Objects e BaseEntities
│   ├── exception/            # Exceções customizadas
│   └── utils/                # Utilitários genéricos
└── auth/                      # Módulo de Autenticação (Bounded Context)
    ├── controller/           # REST Controllers
    ├── dto/                  # Data Transfer Objects
    │   ├── requests/
    │   └── responses/
    ├── domain/model/         # Entidades JPA
    ├── exception/            # Exceções específicas do módulo
    ├── infrastructure/
    │   ├── jwt/              # Utilitários JWT
    │   └── security/         # Configuração de segurança
    ├── mapper/               # Conversores Entity <-> DTO
    ├── repository/           # Spring Data JPA Repositories
    └── services/             # Lógica de negócio
        ├── impl/
        └── service/
```

## 🔧 Configuração

### Pré-requisitos

- Java 21+
- Maven 3.8+
- PostgreSQL 15+ (ou Docker)

### Variáveis de Ambiente

Crie um arquivo `.env` na raíz do projeto:

```env
DB_URL=jdbc:postgresql://localhost:5432/regalaya
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=sua-chave-secreta-muito-longa-para-assinatura-jwt-minimo-256-bits
EMAIL_FROM=noreply@regalaya.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Banco de Dados

```sql
CREATE DATABASE regalaya;
CREATE USER regalaya_user WITH PASSWORD 'regalaya_pass';
GRANT ALL PRIVILEGES ON DATABASE regalaya TO regalaya_user;
```

## 🏃 Execução

### Com Maven

```bash
# Compilar
mvn clean compile

# Executar
mvn spring-boot:run

# Ou executar o JAR
mvn clean package
java -jar target/regalaya-api-1.0.0.jar
```

### Com Docker

```bash
# Build da imagem
docker build -t regalaya-api .

# Executar
docker run -p 8080:8080 --env-file .env regalaya-api
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs
- **Health Check**: http://localhost:8080/api/actuator/health
- **Prometheus Metrics**: http://localhost:8080/api/actuator/prometheus

## 🔐 Endpoints de Autenticação

Base URL: `/api/v1/auth`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/register` | Registra novo usuário | ❌ Público |
| `POST` | `/login` | Autentica usuário | ❌ Público |
| `POST` | `/logout` | Invalida token (futuro) | ✅ Requerido |
| `POST` | `/refresh` | Renova access token | ❌ Público (Refresh-Token header) |
| `POST` | `/forgot-password` | Solicita recuperação de senha | ❌ Público |
| `POST` | `/reset-password` | Redefine senha com token | ❌ Público |
| `POST` | `/validate-email` | Valida email de verificação | ❌ Público |
| `POST` | `/validate-username` | Verifica disponibilidade de email | ❌ Público |
| `GET` | `/me` | Obtém dados do usuário atual | ✅ Requerido |

### Autenticação

Para endpoints protegidos, inclua o header:

```
Authorization: Bearer <access_token>
```

Para renovar o token:

```
Refresh-Token: <refresh_token>
```

## 👥 Roles e Permissões

| Role | Permissões |
|------|------------|
| `ADMIN` | CREATE_USER, READ_USER, UPDATE_USER, DELETE_USER, MANAGE_SYSTEM |
| `USER` | READ_OWN_PROFILE, UPDATE_OWN_PROFILE |
| `CLIENT` | READ_OWN_DATA, CREATE_ORDERS, READ_OWN_ORDERS |

## 🛡️ Padrões de Código

Este projeto segue os **Spring Boot Enterprise Standards**:

- ✅ Clean Architecture e DDD
- ✅ SOLID e DRY
- ✅ TDD (testes implementados)
- ✅ Fail Fast com validações Jakarta
- ✅ Virtual Threads ativadas
- ✅ UUID v7 para IDs
- ✅ Records para DTOs
- ✅ JPA com Specifications para queries dinâmicas
- ✅ Event-Driven com `ApplicationEventPublisher`
- ✅ ArchUnit para testes de arquitetura
- ✅ Swagger/OpenAPI documentado

## 🧪 Testes

```bash
# Testes unitários
mvn test

# Testes com cobertura
mvn test jacoco:report
```

## 📊 Monitoramento

- Health: `/actuator/health`
- Metrics: `/actuator/metrics`
- Prometheus: `/actuator/prometheus`
- Tracing: Configurado com Micrometer

## 🔧 Qualidade de Código

- **Cobertura mínima**: 80%
- **Complexidade ciclomática**: ≤ 10
- **Linhas por método**: ≤ 50
- **Tamanho de classe**: ≤ 300 linhas

## 📝 Convenções

- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/)
- Branch names: `feature/`, `fix/`, `refactor/`, `chore/`
- Porta do servidor: **8080** (NÃO alterar)

## 📄 Licença

Proprietary - Todos os direitos reservados para Regalaya.

---

Desenvolvido com ❤️ seguindo as melhores práticas de mercado para aplicações Enterprise.
