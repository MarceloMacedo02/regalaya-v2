#!/bin/bash
# Script de inicialização do LocalStack
# Recria recursos AWS necessários na inicialização

set -e

echo "Aguardando LocalStack estar pronto..."
until awslocal s3 ls >/dev/null 2>&1; do
  sleep 2
done

echo "LocalStack está pronto! Configurando recursos..."

# Criar buckets S3 se não existirem
for bucket in regalaya-uploads regalaya-assets; do
  if ! awslocal s3 ls "s3://$bucket" >/dev/null 2>&1; then
    echo "Criando bucket S3: $bucket"
    awslocal s3 mb "s3://$bucket"
  else
    echo "Bucket S3 já existe: $bucket"
  fi
done

# Criar filas SQS se não existirem
for queue in orders notifications emails; do
  if ! awslocal sqs get-queue-url --queue-name "$queue" >/dev/null 2>&1; then
    echo "Criando fila SQS: $queue"
    awslocal sqs create-queue --queue-name "$queue"
  else
    echo "Fila SQS já existe: $queue"
  fi
done

# Criar tabelas DynamoDB se não existirem
if ! awslocal dynamodb describe-table --table-name Sessions >/dev/null 2>&1; then
  echo "Criando tabela DynamoDB: Sessions"
  awslocal dynamodb create-table \
    --table-name Sessions \
    --attribute-definitions AttributeName=SessionId,AttributeType=S \
    --key-schema AttributeName=SessionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
else
  echo "Tabela DynamoDB já existe: Sessions"
fi

echo "Configuração do LocalStack concluída!"
echo "Acesse o dashboard em: http://localhost:4566/_localstack/dashboard"
