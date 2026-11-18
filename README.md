# Sistema de Adoção de Animais — Guia de Execução

Este guia cobre a execução do projeto via **Docker Compose** (recomendado) ou **Localmente** para desenvolvimento, contemplando a API (`adocao-api`), o portal do adotante (`frontend-adotante`) e o painel da ONG (`frontend-ong`).

---

## 1. Execução Rápida com Docker (Recomendado)

Com o Docker e o Docker Compose instalados, não é necessário configurar Java, Maven, Node.js ou PostgreSQL na máquina.

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Aguarde o build das imagens e a inicialização dos containers. As tabelas e os dados de teste são criados automaticamente pelo Flyway na primeira subida.

### URLs de acesso

- **Portal do Adotante (`frontend-adotante`)**: http://localhost:5173
- **Painel da ONG (`frontend-ong`)**: http://localhost:5174
- **API Backend (`adocao-api`)**: http://localhost:8080
- **Swagger / OpenAPI**: http://localhost:8080/swagger-ui.html

### Comandos úteis do Docker

- **Verificar status dos containers**:
  ```bash
  docker compose ps
  ```
- **Acompanhar logs da API em tempo real**:
  ```bash
  docker compose logs -f api
  ```
- **Parar todos os serviços**:
  ```bash
  docker compose down
  ```
- **Parar e resetar o banco de dados para os dados iniciais**:
  ```bash
  docker compose down -v
  ```

---

## 2. Execução Local (Sem Docker / Desenvolvimento)

### Requisitos

- Java 17+
- Maven 3.9+
- Node.js 18+ e npm
- PostgreSQL 14+ (ou container apenas do banco)

### 2.1. Banco de dados

Crie o banco e o usuário (via `psql` ou cliente gráfico):

```sql
CREATE DATABASE adocao_db;
CREATE USER adocao_user WITH PASSWORD 'adocao_pass';
GRANT ALL PRIVILEGES ON DATABASE adocao_db TO adocao_user;
```

Ou suba apenas o PostgreSQL via Docker:

```bash
docker compose up -d postgres
```

### 2.2. Backend (API)

```bash
cd adocao-api
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

Para rodar os testes unitários:

```bash
cd adocao-api
mvn test
```

### 2.3. Frontend do Adotante

```bash
cd frontend-adotante
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5173`.

### 2.4. Frontend da ONG

```bash
cd frontend-ong
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5174`.

> **Nota:** Os dois frontends rodam simultaneamente em portas distintas, consumindo a mesma API em `http://localhost:8080/api`.

---

## 3. Swagger / Documentação da API

Com a API rodando, acesse:

```
http://localhost:8080/swagger-ui.html
```

Para testar endpoints autenticados, clique em **Authorize** e informe `Bearer <token>` (obtido na resposta de `POST /api/auth/login`).

---

## 4. Usuários de teste (seed SQL via Flyway)

Senha de todos: **123456**

| Perfil | Email |
|---|---|
| Adotante | sarah@example.com |
| Adotante | joao@example.com |
| ONG | contato@amigosdequatropatas.org |
| ONG | contato@patasfelizes.org |

Também é possível criar novas contas pelas telas de cadastro de cada frontend (ou via `POST /api/auth/cadastro` e `POST /api/auth/ong`).

---

## 5. Testando o fluxo completo de adoção

1. Acesse o **frontend-adotante** (http://localhost:5173), faça login com `sarah@example.com` / `123456`.
2. Vá em **Animais**, filtre por espécie/porte se quiser, e abra um animal disponível (ex.: "Thor").
3. Clique em **Tenho interesse** → confirme. Isso cria uma solicitação `PENDENTE`.
4. Acesse o **frontend-ong** (http://localhost:5174) e faça login com `contato@patasfelizes.org` / `123456` (a ONG responsável pelo "Thor").
5. Vá em **Solicitações** e abra a solicitação recebida.
6. Clique em **Colocar em análise** e depois em **Aprovar**.
7. O animal passa automaticamente para `ADOTADO`; qualquer outra solicitação ativa para o mesmo animal é recusada automaticamente.
8. Volte ao **frontend-adotante**, em **Minhas Solicitações**, e veja o status atualizado para "Aprovada" na timeline.
9. Para testar uma recusa, repita o fluxo demonstrando interesse em outro animal e clique em **Recusar** no painel da ONG.
10. Para testar o cancelamento, crie uma nova solicitação e, antes da ONG decidir, clique em **Cancelar solicitação** no frontend-adotante.

---

## 6. Estrutura do repositório

```text
.
├── adocao-api/           # Backend Spring Boot (Java 17) + Dockerfile
├── frontend-adotante/    # React + Vite — área do adotante + Dockerfile/Nginx
├── frontend-ong/         # React + Vite — painel da ONG + Dockerfile/Nginx
├── docker-compose.yml    # Orquestração completa (Postgres + API + Frontends)
└── README.md             # Este guia
```

---

## 7. Solução de problemas comuns

- **Porta 8080, 5173 ou 5174 ocupada**: certifique-se de encerrar execuções locais (IntelliJ ou `npm run dev`) antes de rodar `docker compose up`.
- **Erro de conexão com o banco**: confira usuário/senha/porta em `adocao-api/src/main/resources/application.yml` contra as variáveis definidas no `docker-compose.yml`.
- **Token expirado (401)**: os tokens JWT duram 24h por padrão (`app.jwt.expiration-ms`); basta fazer login novamente.
