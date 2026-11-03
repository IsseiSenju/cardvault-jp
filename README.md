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
| `app/` | Trabalho 02 — aplicação Angular 22 (NgModule) |
| `docs/` | Prints das telas e relatório do Trabalho 02 |
| `entrega/` | PDFs e pacotes entregues |

## Como executar a aplicação (Trabalho 02)

Pré-requisitos: Node.js 20+ e npm.

```bash
cd app
npm install
npx ng serve        # http://localhost:4200
npx ng build        # gera app/dist/cardvault-jp
```

Usuários de teste (mock): `cliente@cardvault.jp` / `cliente123` e `admin@cardvault.jp` / `admin1234`.

## Páginas e rotas

| Rota | Componente | Descrição |
|---|---|---|
| `/catalogo` | `CatalogoComponent` | Grade de cards com busca e filtros (raridade, tipo, coleção) |
| `/cards/:id` | `DetalheCardComponent` | Detalhe do card, histórico de preço e negociação |
| `/admin/cards` | `AdminCardsComponent` | CRUD de cards com formulário validado |
| `/dashboard` | `DashboardComponent` | Indicadores e gráficos do acervo |
| `/sobre` | `SobreComponent` | Página institucional e contato |
| `/login` | `LoginComponent` | Login por perfil e cadastro de cliente |
| `''` / `**` | — | Redirecionam para `/catalogo` |

## Arquitetura

- `app.module.ts` e `app-routing.module.ts` (projeto baseado em NgModule, sem standalone)
- `models/card.model.ts` — interface `Card` e tipos auxiliares
- `mocks/cards.mock.ts` — 12 cartas fictícias
- `services/card.service.ts` — toda a regra de negócio (CRUD, pesquisa e estatísticas)
- `services/auth.service.ts` — autenticação simples com usuários mock
- `pipes/conservacao.pipe.ts` — pipe próprio (`NM` → `Near Mint (NM)`)
- `components/navbar` — navegação com `routerLink` e `routerLinkActive`

## Versionamento

GitFlow (`main`, `develop`, `feature/*` com merge `--no-ff`) e Conventional Commits.
