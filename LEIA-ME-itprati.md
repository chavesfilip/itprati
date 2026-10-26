# Site iTpraTi — guia completo

Site estático (HTML/CSS/JS) para **www.itprati.ao**, gerado por um script Node.js sem dependências. Funciona no GitHub + Vercel exatamente como o site anterior.

## 1. Estrutura de pastas

```
itprati/
├─ index.html                  Página inicial                       (GERADO)
├─ internet/index.html         /internet/  Planos de internet       (GERADO)
├─ tv/index.html               /tv/        TV Online                (GERADO)
├─ pacotes/index.html          /pacotes/   Internet + TV            (GERADO)
├─ empresas/index.html         /empresas/  Soluções para empresas   (GERADO)
├─ cobertura/index.html        /cobertura/ Verificador de cobertura (GERADO)
├─ blog/
│  ├─ index.html               /blog/      Lista de artigos         (GERADO)
│  ├─ feed.xml                 Feed RSS                             (GERADO)
│  └─ <slug>/index.html        Um artigo por pasta (20)             (GERADO)
├─ sobre/  privacidade/  termos/                                    (GERADO)
├─ 404.html                    Página de erro 404                   (GERADO)
├─ robots.txt   sitemap.xml    SEO                                  (GERADO)
├─ ads.txt                     Só aparece quando configurar o AdSense (GERADO)
│
├─ site.config.js              ★ DEFINIÇÕES: preços, contactos, GA, AdSense, keywords
├─ build.js                    ★ GERADOR: cria todas as páginas (comentado por secções)
├─ content/blog/*.md           ★ ARTIGOS do blog em Markdown (20 incluídos)
├─ assets/css/style.css        Estilos de todo o site
├─ assets/js/main.js           Menu, cookies, Analytics/AdSense, formulários, filtro do blog
├─ img/                        ★ AS SUAS IMAGENS (ver secção 4)
│  └─ blog/                    Capas dos artigos
├─ vercel.json                 URLs limpas, cache e cabeçalhos de segurança
├─ package.json  .gitignore  README.md
```

**Regra de ouro:** os ficheiros marcados `GERADO` não se editam à mão, porque são reescritos de cada vez que corre `node build.js`. Edite sempre os ficheiros marcados ★.

## 2. Como publicar

1. Copie **todo o conteúdo** desta pasta para o seu repositório `chavesfilip/itprati` (substitui o `index.html` antigo).
2. Coloque as imagens em `img/` (secção 4).
3. `git add . && git commit -m "Novo site" && git push`. A Vercel publica sozinha.
4. Na Vercel: *Framework Preset* = **Other**, sem *Build Command* (o HTML gerado já vem incluído). Se preferir que a Vercel gere sempre: *Build Command* = `node build.js`, *Output Directory* = `.`.

### Fluxo de trabalho diário

```
editar site.config.js ou content/blog/*.md   →   node build.js   →   git commit + push
```

Precisa de Node.js 18+ instalado (`node -v`). O comando termina com um resumo, por exemplo `30 páginas no sitemap (20 artigos) · plano mais barato: 6 Mbps por 33.333 Kz · links quebrados: 0`, e avisa se um título/descrição passar do tamanho ideal.

## 3. Alterar preços, contactos e planos

Tudo em `site.config.js` (está comentado):

- **Planos:** lista `plans` (velocidade, perfil, preço, descrição). O plano mais barato é calculado sozinho e usado nas descrições SEO ("desde 33.333 Kz"), por isso nunca fica desatualizado.
- **TV:** `tv.price`, `tv.box`, `tv.trialDays`, `tv.channels` (use um número só, o verdadeiro).
- **WhatsApp, e-mail, redes sociais**, imagem de partilha e **meta keywords**.
- `clientAreaUrl`: ponha o endereço do portal de cliente para aparecer o botão "Área de cliente". Vazio = escondido (melhor que um botão que não leva a lado nenhum).
- `coverageZones`: lista de zonas com cobertura confirmada; quando preenchida, aparece na página `/cobertura/`.

## 4. Imagens (pasta `img/`)

Todas as páginas procuram as imagens em `/img/`. **Enquanto um ficheiro não existir**, o site mostra um bloco colorido com o nome do ficheiro em falta; basta enviar a imagem com **exatamente esse nome** (e voltar a publicar) para aparecer. Não é preciso mexer no código.

Use JPG ou WebP, com cerca de 100–200 KB por imagem (imagens leves = site rápido).

| Ficheiro | Onde aparece | Tamanho sugerido |
|---|---|---|
| `logo-itprati.png` | Topo e rodapé | já existe |
| `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png` | Separador do navegador / ecrã inicial | 32×32, 32×32, 180×180 |
| `og-cover.jpg` | Pré-visualização ao partilhar no WhatsApp/Facebook | 1200×630 |
| `hero-home.jpg` | Início (imagem principal) | 900×700 |
| `internet-casa.jpg` | /internet/ (topo) | 1200×900 |
| `internet-instalacao.jpg` | /internet/ (instalação) | 1200×900 |
| `tv-sala.jpg` | Início e /tv/ | 1600×1200 |
| `tv-box.jpg` | /tv/ (dispositivos) | 1200×900 |
| `pacote-familia.jpg` | /pacotes/ | 1200×900 |
| `empresas-escritorio.jpg` | /empresas/ | 1200×900 |
| `cobertura-mapa.jpg` | /cobertura/ | 1200×675 |
| `blog/<slug>.jpg` | Capa de cada artigo (lista abaixo) | 1200×675 |

Capas dos artigos (nome do ficheiro = endereço do artigo):

- `blog/qual-a-velocidade-de-internet-ideal.jpg`
- `blog/melhorar-wifi-em-apartamentos.jpg`
- `blog/fibra-radio-ou-4g-qual-escolher.jpg`
- `blog/como-instalar-tv-online-na-smart-tv.jpg`
- `blog/smart-tv-ou-box-android-tv.jpg`
- `blog/teste-de-velocidade-como-medir.jpg`
- `blog/burlas-por-whatsapp-em-angola.jpg`
- `blog/como-proteger-o-router-e-a-rede.jpg`
- `blog/internet-ilimitada-e-uso-justo.jpg`
- `blog/teletrabalho-em-angola.jpg`
- `blog/faturacao-certificada-o-que-saber.jpg`
- `blog/cloud-para-pme-em-angola.jpg`
- `blog/ia-para-pequenos-negocios.jpg`
- `blog/cabos-submarinos-e-ixp.jpg`
- `blog/como-escolher-um-router.jpg`
- `blog/streaming-e-consumo-de-dados.jpg`
- `blog/verificacao-em-dois-passos.jpg`
- `blog/varios-dispositivos-sem-perder-velocidade.jpg`
- `blog/tech-da-semana-edicao-de-lancamento.jpg`
- `blog/perguntas-frequentes-instalacao-internet-em-casa.jpg`

Para usar outro nome numa capa, escreva `image: blog/meu-nome.jpg` no cabeçalho do artigo.

## 5. Blog: como adicionar e gerir artigos

### Adicionar um artigo novo

1. Crie um ficheiro em `content/blog/`, por exemplo `21-melhores-routers.md`.
2. Escreva o cabeçalho e o texto:

```
---
title: Os melhores routers para casa em 2026
seo_title: Melhores Routers para Casa em 2026
description: Resumo de 120 a 155 caracteres que aparece no Google.
date: 2026-11-02
category: Guias práticos
slug: melhores-routers-para-casa
cta: internet
image: blog/melhores-routers-para-casa.jpg
---
Primeiro parágrafo (introdução).
## Um subtítulo
Texto do subtítulo, com **negrito** e [uma ligação](/internet/).
- item de lista
- outro item
```

3. Corra `node build.js`, faça `git push`. O artigo passa a existir em `/blog/melhores-routers-para-casa/`.

### Campos do cabeçalho

| Campo | Obrigatório | Para que serve |
|---|---|---|
| `title` | sim | Título (H1) do artigo |
| `seo_title` | não | Título curto (≤55 caracteres) para o Google; se faltar, usa `title` |
| `description` | sim | Descrição para o Google e para as partilhas (≤155 caracteres) |
| `date` | sim | Data `AAAA-MM-DD`; ordena os artigos (mais recente primeiro) |
| `category` | sim | Cria o filtro na página do blog (use sempre o mesmo nome para a mesma categoria) |
| `slug` | recomendado | Endereço do artigo (sem acentos, com hífens). Se faltar, usa o nome do ficheiro |
| `cta` | não | Caixa de chamada à ação no fim: `internet`, `tv`, `empresas` ou `geral` |
| `image` | não | Capa; por omissão `blog/<slug>.jpg` |
| `published` | não | Escreva `false` para guardar como rascunho (não é publicado) |

### Escrever em Markdown (versão simples)

`## Título`, `### Subtítulo`, `- lista`, `1. lista numerada`, `**negrito**`, `[texto](endereço)`. **Cada linha de texto é um parágrafo**, por isso não parta frases em várias linhas. Ligações internas começam por `/` (ex.: `/tv/`).

### Onde um artigo aparece automaticamente

- **Página do blog** (`/blog/`), com o filtro por categoria.
- **Página inicial:** os **3 mais recentes** aparecem na secção "Blog iTpraTi Tech". Quando publicar um novo, ele entra na home e o mais antigo sai.
- **Fim de cada artigo:** "Continue a ler" (3 artigos da mesma categoria).
- **sitemap.xml** e **feed RSS** (`/blog/feed.xml`).

Para **editar** um artigo, altere o `.md` e volte a correr o build. Para **retirar**, apague o ficheiro ou ponha `published: false`.

### Antes de publicar os 20 artigos incluídos

São **rascunhos de qualidade para rever**: têm ~150–250 palavras e são deliberadamente genéricos (sem números ou factos locais que não pude confirmar). Reveja-os, acrescente dados e exemplos de Angola, aumente os guias para 800+ palavras e confirme os factos (por exemplo, regras fiscais no artigo de faturação). O artigo "Tech da Semana" descreve o formato do resumo semanal; as edições com notícias reais têm de ser escritas por si, com as fontes indicadas.

## 6. Google Analytics 4

- O ID está em `site.config.js` → `analyticsId`. **Atenção:** o `index.html` antigo carregava `G-VD2PLGSRPQ` mas configurava `G-XXXXXXXXXX`, por isso o Analytics **não registava visitas**. Confirme no GA4 que `G-VD2PLGSRPQ` é o ID certo.
- Com `requireConsent: true`, o GA só carrega depois de o visitante clicar "Aceitar" no aviso de cookies (mais seguro do ponto de vista legal, mas regista menos visitantes). Ponha `false` para carregar sempre.
- **Eventos de conversão já enviados:** `whatsapp_click` (qualquer clique para o WhatsApp), `form_submit`, `plan_click` (com o plano), `trial_whatsapp`, `combo_whatsapp`, `hero_whatsapp`, `cta_whatsapp`. No GA4 vá a *Administração → Eventos* e marque os importantes como **conversões**.

## 7. Google AdSense (só no blog)

1. Candidate-se em adsense.google.com com o domínio. O AdSense pede conteúdo original, política de privacidade e página de contacto (já existem em `/privacidade/` e `/sobre/`).
2. Em `site.config.js` preencha `adsense.client` (ex.: `'ca-pub-1234567890123456'`) e crie 3 unidades de anúncio para preencher `slots.top`, `slots.inline` e `slots.bottom`.
3. `node build.js` e `git push`. O build acrescenta o meta de verificação, cria o `ads.txt` e coloca os anúncios **dentro dos artigos** (topo, meio, fim). Com `client` vazio não há anúncios nem scripts.
4. Os anúncios só carregam depois de o visitante aceitar os cookies.

## 8. SEO: o que está feito e o que fazer a seguir

**Já feito:** título, descrição e H1 próprios em cada página; canonical; Open Graph e Twitter; `lang="pt-AO"`; dados estruturados JSON-LD (Organization, WebSite, BreadcrumbList, FAQPage, Service/Offer nos planos, Article nos artigos); `sitemap.xml`, `robots.txt` e RSS; planos e preços **no HTML** (visíveis ao Google; antes eram desenhados por JavaScript); sem carrossel pesado; imagens com tamanho e carregamento diferido; FAQ sem JavaScript.

**Faça depois de publicar:**

1. **Google Search Console:** adicione a propriedade de domínio e submeta `https://www.itprati.ao/sitemap.xml`.
2. **Google Business Profile:** crie o perfil (área de serviço Luanda e outras províncias) e peça avaliações a clientes.
3. Na Vercel, configure **`itprati.ao` → redireciona para `www.itprati.ao`** (e `tv.itprati.ao` → `/tv/` quando migrar a lista de canais).
4. Meça a velocidade em pagespeed.web.dev e compare com os alvos (LCP ≤ 2,5 s).
5. Teste a partilha de uma página no WhatsApp e no Debugger do Facebook.

## 9. Como o código funciona

**`build.js`** (lê `site.config.js` e `content/blog/*.md`, escreve os `.html`). Secções numeradas no ficheiro:
1. *Utilitários*: formatação de preços (`money`), ligações de WhatsApp (`wa`), mini-Markdown (`md`).
2. *Layout*: `head()` (metadados e JSON-LD) e `layout()` (topo, menu, rodapé, WhatsApp flutuante, aviso de cookies). Todas as páginas partilham isto, por isso alterar o menu ou o rodapé é mudar num sítio só.
3. *Componentes*: `slot()` (espaço de imagem que lê `/img`), `planCard()`, `faqHtml()`, `form()` (formulário → WhatsApp), `ctaStrip()`.
4. *Textos FAQ*: perguntas e respostas reutilizadas nas páginas.
5. *Páginas*: uma função por página (`home()`, `internet()`, `tv()`, `pacotes()`, `empresas()`, `cobertura()`, `institucional()`).
6. *Blog*: lê os `.md`, gera lista, artigos, relacionados e anúncios.
7. *SEO*: `sitemap.xml`, `robots.txt`, feed RSS, `ads.txt`.
8. *Verificação*: percorre todas as páginas e avisa de links internos quebrados.

**`assets/js/main.js`**: (1) menu móvel; (2) aviso de cookies e carregamento do Analytics/AdSense; (3) eventos de conversão; (4) formulários que montam a mensagem e abrem o WhatsApp; (5) filtro de categorias do blog.

**`assets/css/style.css`**: variáveis de cor no topo (`--navy`, `--blue`, `--cyan`), depois componentes por ordem de página, e no fim as regras para telemóvel (`@media`).

## 10. O que foi corrigido (checklist do pedido)

- **Nota interna removida** ("valores... exemplos de apresentação"), o FAQ passou a ter texto final e o tom condicional desapareceu.
- **Planos validados:** os 6 cartões vêm de uma só lista; o plano mais barato é 6 Mbps por 33.333 Kz/mês e coincide com o "desde 33.333 Kz" usado em todo o site. Os cartões agora existem no HTML.
- **CTA final enganoso:** o botão "Falar no WhatsApp agora" abre agora o WhatsApp.
- **Meta keywords:** removidos unitv e youcine; acrescentados "parceria com DSTV", "parceria com ZAP" e "parceria com TVCabo".
- **Formulário:** campos Província, Município e Bairro, consentimento com ligação à privacidade e origem da página na mensagem.
- **Canais:** um só número (`tv.channels`, 400) em todo o site.
- **Páginas próprias:** /internet, /tv, /pacotes, /empresas, /cobertura, /blog (e /sobre, /privacidade, /termos), cada uma com title, descrição e H1.
- **Blog** com 20 artigos, filtro, RSS, relacionados e AdSense opcional; **404**, **robots.txt**, **sitemap.xml**.
- **Google Analytics** corrigido (ID coerente) e com consentimento; **AdSense** preparado.
- Removidos o carrossel, as imagens externas do Unsplash (agora tudo vem de `/img/`) e as âncoras sem destino.

## 11. Confirme antes de publicar

1. **Parcerias DSTV, ZAP e TVCabo:** estão só nas meta keywords, conforme pediu. Confirme que a parceria é real e autorizada antes de as usar (marcas registadas); se quiser mostrá-las no texto, é preciso consentimento delas.
2. **"Velocidade garantida" e "suporte 24/7":** retirei estas promessas por não terem prova no site. Reponha-as só se forem verdade e explique a condição.
3. **Preços e planos:** são os do `index.html` que enviou; confirme que são os preços comerciais finais.
4. **FAQ, Privacidade e Termos:** reveja com um jurista (Lei n.º 22/11 de Proteção de Dados Pessoais).
5. **Empresas:** os links Vendus, Cloud, Qyar e Claw apontam para `vendus.itprati.ao`, `cloud.it.ao`, `qyar.me` e `claw.itprati.ao`; corrija em `build.js` (função `empresas()`) se algum endereço for diferente.
6. **Conteúdo de TV:** tenha à mão a prova de licenciamento dos canais, porque o Google e a Meta costumam pedi-la para anúncios de IPTV.

## 12. Próximas melhorias sugeridas

Testemunhos reais com foto e bairro; páginas por bairro (ex.: `/internet/luanda/talatona/`); avaliações do Google no site; portal de cliente ligado a `clientAreaUrl`; verificador de cobertura com base de dados (Supabase) quando houver lista de zonas.
