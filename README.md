# Leonardo Navasconi — Portfólio + Apps

Site único em Next.js que serve:

- **`/`** — Portfólio (currículo, habilidades, atividades complementares, idiomas PT/EN/ES)
- **`/financas`** — Aplicativo de Finanças Pessoais (contas, lançamentos, orçamento, metas, recorrências)
- **`/marketplace`** — Marketplace multi-vendedor (em construção)

Todos compartilham o mesmo projeto Supabase (banco de dados + autenticação) e o mesmo deploy na Vercel.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Você vai precisar de um arquivo `.env.local` (veja `.env.example`) com:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## Configurando o Supabase (uma única vez)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, rode nesta ordem os arquivos em `supabase/migrations/`:
   - `0001_init.sql` — cria as tabelas do Finanças Pessoais (contas, categorias, lançamentos, orçamento, metas, recorrências) com RLS habilitado
   - `0002_default_categories.sql` — cria automaticamente categorias padrão para cada novo usuário
3. Em **Settings → API**, copie a **Project URL** e a **anon public key** para o `.env.local`
4. Em **Authentication → Sign In / Providers → Email**, deixe **"Confirm email"** ativado em produção (ele fica desativado apenas durante testes locais rápidos)

⚠️ Nunca coloque a **service_role key** no `.env.local`, no código ou em qualquer lugar do repositório — ela ignora todas as regras de segurança (RLS) do banco.

## Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte o repositório do GitHub
2. Ao importar o projeto, configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (mesmas do `.env.local`)
3. Deploy — a Vercel builda e publica automaticamente a cada push

## Arquitetura

- **Portfólio** (`src/app/page.tsx` + `src/components/portfolio/*`): usa CSS próprio (`src/styles/portfolio.css`), com todas as classes prefixadas com `nv-` para nunca colidir com as classes utilitárias do Tailwind usadas em `/financas` e `/marketplace`.
- **Finanças Pessoais** (`src/app/financas/*`): Tailwind CSS, Server Components para leitura de dados e Server Actions para escrita, Supabase Auth + Postgres com Row Level Security (cada usuário só enxerga os próprios dados).
- **Proteção de rotas** (`src/proxy.ts`): no Next.js 16 o antigo `middleware.ts` foi renomeado para `proxy.ts`. Ele protege apenas `/financas/*` e `/marketplace/*` — o portfólio continua público.
