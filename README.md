# CardVault JP

Plataforma web para gestão, catalogação, avaliação e negociação de cartas colecionáveis (Pokémon TCG, foco em coleções japonesas).

Disciplina: Desenvolvimento Web Front-End — FUMEC — Prof. Dângelo Silva Miranda
Aluno: Kaique Ferreira Peixoto

> As cartas, nomes e coleções exibidos na aplicação são **fictícios**; as artes são gradientes CSS (nenhuma imagem ou nome oficial é utilizado).

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| `prototipo/` | Trabalho 01 — protótipo navegável em HTML/CSS (6 telas) |
| `relatorio/` | Fonte HTML do relatório do Trabalho 01 |
| `app/` | Aplicação Angular 22 (NgModule) + Web API JSON-Server (`app/api/`) |
| `docs/` | Prints das telas e relatórios dos Trabalhos 02 e Final |
| `entrega/` | PDFs e pacotes entregues |

## Como executar a aplicação (Trabalho Final)

Pré-requisitos: Node.js 20+ e npm. São dois terminais, ambos dentro de `app/`:

```bash
cd app
npm install

# Terminal 1 — Web API (JSON-Server em http://localhost:3000)
npm run api            # cria api/db.json a partir de api/db.seed.json na 1ª vez
npm run api:reset      # (opcional) restaura os dados iniciais

# Terminal 2 — aplicação Angular (http://localhost:4200)
npx ng serve
```

Usuários de teste: `cliente@cardvault.jp` / `cliente123` e `admin@cardvault.jp` / `admin1234`.

## Páginas e rotas

| Rota | Componente | Acesso | Descrição |
|---|---|---|---|
| `/catalogo` | `CatalogoComponent` | público | Grade de cards com busca e filtros (formulário reativo + debounce) |
| `/cards/:id` | `DetalheCardComponent` | público | Detalhe, histórico de preço real e formulário de proposta |
| `/login` | `LoginComponent` | público | Login por perfil e cadastro de cliente (validador assíncrono de e-mail) |
| `/sobre` | `SobreComponent` | público | Página institucional e formulário "Fale conosco" |
| `/admin/cards` | `AdminCardsComponent` | **admin** | CRUD de cards com formulário reativo validado |
| `/admin/dashboard` | `DashboardComponent` | **admin** | Indicadores, gráficos e propostas recebidas |
| `''` / `**` | — | — | Redirecionam para `/catalogo` |

As rotas `/admin/**` ficam no `AdminModule`, carregado por **lazy loading** e protegido pelo guard `adminGuard` (`canMatch`).

## Web API (JSON-Server)

| Recurso | Métodos usados | Service |
|---|---|---|
| `/cards` | GET (lista, `q`, filtros, `_sort`), GET `/:id`, POST, PUT, DELETE | `CardService` |
| `/usuarios` | GET (`email`, `perfil`), POST | `AuthService` |
| `/propostas` | GET, POST, PATCH (status) | `PropostaService` |
| `/mensagens` | GET, POST | `MensagemService` |

## Arquitetura

- `app.module.ts` / `app-routing.module.ts` — módulo raiz (NgModule, sem standalone), `provideHttpClient` com interceptor
- `admin/admin.module.ts` / `admin-routing.module.ts` — área administrativa (lazy loading)
- `shared/shared.module.ts` — `CommonModule`, `ReactiveFormsModule`, `RouterModule` e o pipe `conservacao`
- `shared/validadores.ts` — validadores próprios: `naoVazio`, `camposIguais` (grupo) e `emailUnico` (assíncrono)
- `services/` — `CardService`, `AuthService`, `PropostaService`, `MensagemService` (toda regra de negócio + HttpClient)
- `guards/admin.guard.ts` — guard funcional `CanMatchFn`
- `interceptors/erro-api.interceptor.ts` — traduz erros HTTP em mensagens amigáveis
- `models/` — interfaces `Card`, `Usuario`, `Proposta`, `Mensagem`
- Estado das telas em **signals** (a aplicação é *zoneless*)

## Versionamento

GitFlow (`main`, `develop`, `feature/*` com merge `--no-ff`) e Conventional Commits.
