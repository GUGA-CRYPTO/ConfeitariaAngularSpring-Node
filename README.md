
# 🧁 Protótipo de Confeitaria - Arquitetura Multi-API

Este é um projeto completo de um sistema para confeitaria, desenvolvido para simular um cenário real de mercado com foco em alta modularidade, escalabilidade e divisão de responsabilidades. A aplicação consiste em um ecossistema robusto onde um front-end dinâmico se conecta e orquestra a comunicação entre **duas APIs independentes (Spring Boot e Node.js)**.

## 🏗️ Arquitetura do Sistema

O projeto adota uma arquitetura baseada em microserviços/APIs especializadas para garantir que cada componente resolva um domínio específico do negócio:
              ┌───────────────────┐
              │    Front-end      │
              │    (Angular)      │
              └─────────┬─────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼


┌───────────────────────┐       ┌───────────────────────┐
│     API Back-end      │       │     API Back-end      │
│  (Java / Spring Boot) │       │      (Node.js)        │
└───────────────────────┘       └───────────────────────┘

```

1. **Front-end (Angular):** Interface rica, responsiva e de alta performance que centraliza a experiência do usuário, lidando com chamadas assíncronas paralelas e gerenciamento de estado para unificar os dados vindos das diferentes APIs.
2. **API Core Business (Spring Boot):** Responsável por toda a lógica de negócios complexa, gerenciamento de estoque de ingredientes, precificação, processamento de pedidos e persistência robusta de dados relacionais.
3. **API de Serviços Auxiliares (Node.js):** Responsável pela autenticação segura de usuários, gerenciamento de perfis, controle de acesso e microsserviços ágeis.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
* **Angular** (Framework principal)
* **TypeScript** (Tipagem estática e segurança no código)
* **RxJS** (Programação reativa para manipulação dos fluxos de dados das APIs)
* **HTML5 / CSS3 / SCSS** (Estilização moderna e modular)

### Back-end Java
* **Java** (Linguagem base)
* **Spring Boot** (Ecossistema para criação de APIs RESTful)
* **Spring Data JPA** (Persistência e mapeamento objeto-relacional)
* **Spring Security** (Proteção dos endpoints do core)

### Back-end JavaScript
* **Node.js** (Ambiente de execução)
* **Express** (Framework minimalista para gerenciamento de rotas e middlewares)

### Infraestrutura e Banco de Dados
* **SQL / Banco de Dados Relacional** (Armazenamento de pedidos, produtos e estoque)
* **NoSQL / MongoDB** (Estrutura flexível para logs ou dados não-estruturados, se aplicável)
* **Docker** (Conteinerização dos ambientes para facilitar o deploy e desenvolvimento local)

---

## 🚀 Funcionalidades Principais

* **Gestão de Cardápio e Pedidos:** Fluxo completo desde a escolha dos doces e bolos até o fechamento do pedido, processado de forma assíncrona pela API Spring Boot.
* **Controle de Estoque Automatizado:** Baixa automática de insumos e ingredientes a cada pedido finalizado.
* **Autenticação e Autorização:** Sistema seguro de login e gerenciamento de níveis de acesso (Clientes vs. Administradores/Confeiteiros) gerenciado pela API Node.js.
* **Dashboard Administrativo:** Visão analítica de vendas, faturamento e alertas de estoque baixo.

---

## 📂 Estrutura do Repositório

O repositório está estruturado de forma a isolar completamente os ambientes de desenvolvimento:

```text
├── angular-frontend/     # Código fonte da aplicação cliente (Angular)
├── spring-backend/       # Código fonte da API de Core Business (Java)
├── node-backend/         # Código fonte da API de Autenticação/Serviços (Node.js)
└── README.md             # Documentação do projeto

```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

* Node.js (v18+) e Angular CLI instalados
* Java JDK (v17+) e Maven configurados
* Docker (opcional, para execução de bancos de dados)

### 1. Executando a API Spring Boot

1. Navegue até o diretório do back-end Java:
```bash
cd spring-backend

```


2. Instale as dependências e compile o projeto:
```bash
mvn clean install

```


3. Inicie a aplicação:
```bash
mvn spring-boot:run

```


*A API estará disponível em `http://localhost:5010` (ou na porta configurada).*

### 2. Executando a API Node.js

1. Navegue até o diretório do back-end Node:
```bash
cd node-backend

```


2. Instale as dependências:
```bash
npm install

```


3. Inicie o servidor:
```bash
npm start

```


*A API estará disponível em `http://localhost:5010` (ou na porta configurada).*

### 3. Executando o Front-end Angular

1. Navegue até o diretório do front-end:
```bash
cd angular-frontend

```


2. Instale as dependências do ecossistema Angular:
```bash
npm install

```


3. Inicie o servidor de desenvolvimento:
```bash
ng serve

```


4. Abra o navegador e acesse `http://localhost:4200`.

---

## 🧑‍💻 Autor

Desenvolvido por **Gustavo** como parte dos projetos práticos do Centro Universitário Senac.

* **GitHub:** [GUGA-CRYPTO](https://www.google.com/search?q=https://github.com/GUGA-CRYPTO)
* **Repositório do Projeto:** [Confeitaria Angular-Spring-Node](https://github.com/GUGA-CRYPTO/ConfeitariaAngularSpring-Node/tree/main)

---

*Este projeto foi desenvolvido com fins estritamente acadêmicos e para consolidação de conhecimentos em engenharia de software, padrões de arquitetura e integração de sistemas full-stack.*
"""

