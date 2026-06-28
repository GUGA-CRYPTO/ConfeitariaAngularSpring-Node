# Aura Spring API

API em **Spring Boot** feita para rodar com o frontend **AuraAngular** sem precisar alterar as rotas do Angular.

## O que já está pronto

- Porta configurada em `5010`, igual ao `environment.ts` do Angular.
- Login em `/login` com usuário padrão:
  - usuário: `admin`
  - senha: `aura2025`
- CRUD de produtos em `/produto` com upload de imagem.
- Registro e listagem de vendas em `/venda`.
- Registro público de pedidos em `/pedido`.
- CRUD de despesas em `/despesa`.
- CORS liberado para `http://localhost:4200`.
- Banco H2 local, sem precisar instalar MySQL.

## Como rodar a API

Abra o terminal dentro da pasta `AuraSpringApi` e rode:

```bash
mvn spring-boot:run
```

A API vai subir em:

```txt
http://localhost:5010
```

## Como rodar o Angular

Em outro terminal, entre na pasta do Angular e rode:

```bash
npm install
npm start
```

O Angular vai abrir em:

```txt
http://localhost:4200
```

## Banco de dados

A API usa H2 local. O banco fica salvo na pasta:

```txt
data/aura-db
```

Console do H2:

```txt
http://localhost:5010/h2-console
```

Dados para entrar no H2:

```txt
JDBC URL: jdbc:h2:file:./data/aura-db
User: sa
Password: deixe vazio
```

## Endpoints principais

```txt
POST   /login
GET    /produto
GET    /produto/{id}
POST   /produto
PUT    /produto/{id}
DELETE /produto/{id}

GET    /venda
GET    /venda/{id}
POST   /venda
POST   /pedido
PUT    /venda/{id}
PUT    /venda/{id}/status
DELETE /venda/{id}

GET    /despesa
POST   /despesa
PUT    /despesa/{id}
DELETE /despesa/{id}
```

Rotas privadas usam o header que o Angular já envia:

```txt
x-access-token: token recebido no login
```
