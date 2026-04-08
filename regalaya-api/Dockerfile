# ===================================================================
# Regalaya API - Dockerfile simplificado
# ===================================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copia apenas pom.xml primeiro para cache de dependências
COPY pom.xml .

# Download das dependências
RUN mvn dependency:go-offline -B -DskipTests

# Copia código fonte
COPY src src

# Build da aplicação
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Instala wget para healthcheck e tzdata
RUN apt-get update && apt-get install -y --no-install-recommends tzdata wget && \
    rm -rf /var/lib/apt/lists/*

# Cria usuário não-root
RUN groupadd -r spring && useradd -r -g spring spring
USER spring

# Copia JAR do builder
COPY --from=builder /app/target/regalaya-api-1.0.0.jar app.jar

# Expõe porta
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1

# Entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
