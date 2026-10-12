# Sistema de Adoção de Animais — Guia de Execução

Este guia cobre os três projetos: `adocao-api` (backend), `frontend-adotante` e `frontend-ong`.

## 1. Requisitos

- Java 17+
- Maven 3.9+
- Node.js 18+ e npm
- PostgreSQL 14+ (ou Docker)

## 2. Banco de dados

Crie o banco e o usuário (via `psql` ou um cliente gráfico):

```sql
CREATE DATABASE adocao_db;
CREATE USER adocao_user WITH PASSWORD 'adocao_pass';
GRANT ALL PRIVILEGES ON DATABASE adocao_db TO adocao_user;
```

Ou, com Docker:

```bash
docker run --name adocao-postgres -e POSTGRES_DB=adocao_db \
  -e POSTGRES_USER=adocao_user -e POSTGRES_PASSWORD=adocao_pass \
  -p 5432:5432 -d postgres:16
```

As tabelas e os dados de teste são criados automaticamente pelo Flyway na primeira execução da API (migrations em `adocao-api/src/main/resources/db/migration`).

## 3. Backend (API)

```bash
cd adocao-api
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

Se quiser trocar usuário/senha/porta do banco, edite `src/main/resources/application.yml`.

### Rodando os testes

```bash
cd adocao-api
mvn test
```

## 4. Swagger

Com a API rodando, acesse:

```
http://localhost:8080/swagger-ui.html
```

Lá estão documentados todos os endpoints, com exemplos de request/response. Para testar endpoints autenticados, clique em **Authorize** e informe `Bearer <token>` (o token vem da resposta de `/api/auth/login`).

## 5. Frontend do Adotante

```bash
cd frontend-adotante
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## 6. Frontend da ONG

```bash
cd frontend-ong
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5174`.

> Os dois frontends podem rodar ao mesmo tempo, cada um na sua porta, ambos consumindo a mesma API em `http://localhost:8080/api`.

## 7. Usuários de teste (já inseridos via seed SQL)

Senha de todos: **123456**

| Perfil    | Email                              |
|-----------|-------------------------------------|
| Adotante  | sarah@example.com                  |
| Adotante  | joao@example.com                   |
| ONG       | contato@amigosdequatropatas.org    |
| ONG       | contato@patasfelizes.org           |

Também é possível criar novas contas pelas telas de cadastro de cada frontend (ou via `POST /api/auth/cadastro` e `POST /api/auth/ong`).

## 8. Testando o fluxo completo de adoção

1. Acesse o `frontend-adotante`, faça login com `sarah@example.com` / `123456`.
2. Vá em **Animais**, filtre por espécie/porte se quiser, e abra um animal disponível (ex.: "Thor").
3. Clique em **Tenho interesse** → confirme. Isso cria uma solicitação `PENDENTE`.
4. Acesse o `frontend-ong` (outra aba/navegador) e faça login com `contato@patasfelizes.org` / `123456` (a ONG dona do "Thor").
5. Vá em **Solicitações**, abra a solicitação recebida.
6. Clique em **Colocar em análise** e depois em **Aprovar**.
7. O animal passa automaticamente para `ADOTADO`; qualquer outra solicitação ativa para o mesmo animal é recusada automaticamente.
8. Volte ao `frontend-adotante`, em **Minhas Solicitações**, e veja o status atualizado para "Aprovada" na timeline.
9. Para testar uma recusa, repita o fluxo demonstrando interesse em outro animal e clique em **Recusar** no painel da ONG.
10. Para testar o cancelamento, crie uma nova solicitação e, antes da ONG decidir, clique em **Cancelar solicitação** no `frontend-adotante`.

## 9. Estrutura dos projetos

```text
.
├── adocao-api/           # Backend Spring Boot
├── frontend-adotante/    # React — área do adotante
├── frontend-ong/         # React — painel da ONG
└── README.md             # Este guia
```

## 10. Solução de problemas comuns

- **Erro de conexão com o banco**: confira usuário/senha/porta em `adocao-api/src/main/resources/application.yml` contra o que você configurou no Postgres.
- **CORS bloqueado no navegador**: o backend já libera CORS para qualquer origem (`SecurityConfig`); se mudar as portas dos frontends, não é necessário reconfigurar nada.
- **Token expirado (401)**: os tokens JWT duram 24h por padrão (`app.jwt.expiration-ms`); basta logar novamente.
- **Porta 8080/5173/5174 ocupada**: altere a porta correspondente em `application.yml` (backend) ou `vite.config.js` (frontends).
