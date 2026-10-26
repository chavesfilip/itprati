#!/usr/bin/env node
/* =====================================================================
   build.js — GERADOR DO SITE iTpraTi (Node.js, sem dependências)

   O QUE FAZ: lê  site.config.js  +  content/blog/*.md  e escreve todas as
   páginas HTML estáticas (index.html, internet/, tv/, pacotes/, empresas/,
   cobertura/, blog/, 404.html, ...) mais robots.txt, sitemap.xml e o feed RSS.

   COMO USAR:   node build.js      (depois: git add . && git commit && git push)

   ÍNDICE DESTE FICHEIRO
     1. Utilitários            5. Páginas do site (home, internet, tv, ...)
     2. Layout (head/topo/rodapé)  6. Blog (artigos em Markdown)
     3. Componentes reutilizáveis  7. Ficheiros de SEO (sitemap, robots, feed)
     4. Textos (FAQ)               8. Verificação de links
   ===================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const C = require('./site.config.js');
const R = __dirname;
const sitemap = [];                                   // lista de URLs para o sitemap.xml

/* ============================ 1. UTILITÁRIOS ============================ */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');            // 33333 -> 33.333
const wa = t => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;    // link de WhatsApp com mensagem
const abs = p => C.siteUrl + p;
const MES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const fmtDate = d => { const [y, m, dd] = d.split('-').map(Number); return `${dd} de ${MES[m - 1]} de ${y}`; };
const today = new Date().toISOString().slice(0, 10);
const cheapest = Math.min(...C.plans.map(p => p.price));                        // plano mais barato (automático)
const cheapestPlan = C.plans.find(p => p.price === cheapest);
const P = money(cheapest);

function write(rel, txt) { const f = path.join(R, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); }
function outFile(urlPath) { return urlPath === '/404.html' ? '404.html' : urlPath.replace(/^\//, '') + 'index.html'; }

/* Mini-Markdown para os artigos: ## título, ### subtítulo, - lista, 1. lista numerada,
   **negrito**, [texto](link). Cada linha de texto é um parágrafo. */
function md(src) {
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${a}</a>`);
  const out = []; let list = null;
  const flush = () => { if (list) { out.push(`<${list.t}>${list.i.map(x => `<li>${inl(x)}</li>`).join('')}</${list.t}>`); list = null; } };
  src.split(/\r?\n/).forEach(l => {
    let m;
    if (!l.trim()) return flush();
    if ((m = l.match(/^###\s+(.*)/))) { flush(); out.push(`<h3>${inl(m[1])}</h3>`); }
    else if ((m = l.match(/^##\s+(.*)/))) { flush(); out.push(`<h2>${inl(m[1])}</h2>`); }
    else if ((m = l.match(/^[-*]\s+(.*)/))) { if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', i: [] }; } list.i.push(m[1]); }
    else if ((m = l.match(/^\d+\.\s+(.*)/))) { if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', i: [] }; } list.i.push(m[1]); }
    else { flush(); out.push(`<p>${inl(l)}</p>`); }
  });
  flush(); return out.join('\n');
}

/* ============================ 2. LAYOUT ============================ */
/* <head>: título, descrição, canonical, Open Graph, Twitter, ícones, JSON-LD.
   Cada página passa um objeto p = { title, desc, path, keywords, image, ld[], noindex, type } */
function head(p) {
  if (p.desc.length > 160) console.warn(`  ! descrição com ${p.desc.length} caracteres (ideal ≤160): ${p.path}`);
  if (p.title.length > 65) console.warn(`  ! título com ${p.title.length} caracteres (ideal ≤60): ${p.path}`);
  const url = abs(p.path), img = abs(p.image || C.ogImage), ld = (p.ld || []).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
${p.keywords ? `<meta name="keywords" content="${esc(p.keywords)}">` : ''}
<link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<meta property="og:type" content="${p.type || 'website'}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="pt_AO"><meta property="og:site_name" content="${C.siteName}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${img}">
<link rel="icon" href="/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Blog iTpraTi Tech" href="/blog/feed.xml">
<meta name="theme-color" content="#082B49">
${C.adsense.client ? `<meta name="google-adsense-account" content="${C.adsense.client}">` : ''}
<link rel="stylesheet" href="/assets/css/style.css">
<script>window.ITP=${JSON.stringify({ ga: C.analyticsId, ads: C.adsense.client, consent: C.requireConsent })}</script>
${ld}
</head>`;
}

const NAV = [['/internet/', 'Internet'], ['/tv/', 'TV Online'], ['/pacotes/', 'Pacotes'], ['/empresas/', 'Empresas'], ['/blog/', 'Blog'], ['/cobertura/', 'Cobertura']];

/* Estrutura comum a todas as páginas: topo, menu, <main>, rodapé, botão WhatsApp, aviso de cookies. */
function layout(p, body) {
  const links = NAV.map(([u, t]) => `<a href="${u}"${p.path.startsWith(u) ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  const social = Object.entries({ Instagram: C.social.instagram, Facebook: C.social.facebook, LinkedIn: C.social.linkedin })
    .map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener me">${n}</a>`).join('');
  if (!p.noindex) sitemap.push({ loc: abs(p.path), lastmod: p.lastmod || today });
  write(outFile(p.path), `<!DOCTYPE html>
<html lang="pt-AO">
${head(p)}
<body>
<a class="skip" href="#main">Saltar para o conteúdo</a>
<div class="topbar"><div class="container"><div>Conectamos a sua casa ao que importa.</div><div class="top-extra">Precisa de ajuda? <a href="${wa('Olá iTpraTi, preciso de ajuda.')}" target="_blank" rel="noopener">Fale no WhatsApp</a></div></div></div>
<header class="header"><div class="container nav">
<a class="brand" href="/" aria-label="iTpraTi — página inicial"><img alt="Logótipo iTpraTi Internet e Televisão" src="/img/logo-itprati.png" width="140" height="64"></a>
<nav class="navlinks" id="navlinks" aria-label="Navegação principal">${links}</nav>
<div class="nav-actions">${C.clientAreaUrl ? `<a class="btn btn-outline" href="${C.clientAreaUrl}">Área de cliente</a>` : ''}<a class="btn btn-primary" href="/cobertura/">Pedir contacto</a><button class="menu-toggle" id="menuToggle" aria-label="Abrir menu" aria-expanded="false">☰</button></div>
</div></header>
<main id="main">
${body}
</main>
<footer><div class="container"><div class="footer-grid">
<div class="footer-about"><img class="footer-logo" alt="Logótipo iTpraTi" src="/img/logo-itprati.png" width="140" height="62" loading="lazy"><p>Internet ilimitada e TV Online para ligar pessoas, casas e ideias em Angola.</p></div>
<div class="footer-col"><h4>Serviços</h4><a href="/internet/">Internet</a><a href="/tv/">TV Online</a><a href="/pacotes/">Pacotes Internet + TV</a><a href="/empresas/">Empresas</a></div>
<div class="footer-col"><h4>Recursos</h4><a href="/blog/">Blog iTpraTi Tech</a><a href="/cobertura/">Cobertura</a><a href="/#ajuda">Perguntas frequentes</a><a href="/sobre/">Sobre nós</a></div>
<div class="footer-col"><h4>Contactos</h4><a href="${wa('Olá iTpraTi, gostaria de mais informações.')}" target="_blank" rel="noopener">WhatsApp ${C.whatsappLabel}</a><a href="mailto:${C.email}">${C.email}</a>${C.clientAreaUrl ? `<a href="${C.clientAreaUrl}">Área de cliente</a>` : ''}</div>
<div class="footer-col"><h4>Redes sociais</h4>${social}</div>
</div><div class="copyright"><span>© ${new Date().getFullYear()} iTpraTi. Todos os direitos reservados.</span><span><a href="/privacidade/">Privacidade</a> · <a href="/termos/">Termos e condições</a></span></div></div></footer>
<a class="whatsapp" href="${wa('Olá iTpraTi, gostaria de mais informações.')}" target="_blank" rel="noopener" aria-label="Contactar a iTpraTi pelo WhatsApp">WhatsApp</a>
<div class="cookie" id="cookie" hidden role="dialog" aria-label="Cookies"><p>Usamos cookies de análise e publicidade para melhorar o site. Pode aceitar ou recusar. <a href="/privacidade/">Saber mais</a></p><button class="btn btn-primary" data-consent="yes">Aceitar</button><button class="btn btn-outline" data-consent="no">Recusar</button></div>
<script src="/assets/js/main.js" defer></script>
</body>
</html>`);
}

/* ============================ 3. COMPONENTES ============================ */
/* Espaço para imagem: lê /img/<ficheiro>. Se o ficheiro não existir, mostra um bloco
   colorido com o nome do ficheiro a enviar (onerror). eager=true para a imagem principal da página. */
const slot = (file, alt, cls = '', w = 1200, h = 800, eager = false) =>
  `<figure class="img-slot ${cls}" data-file="${file}"><img src="/img/${file}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()"></figure>`;

const crumbs = (items, current) => `<p class="crumbs"><a href="/">Início</a>${items.map(([n, u]) => ` › <a href="${u}">${n}</a>`).join('')} › ${current}</p>`;
const crumbLD = (items, current, cur) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Início', '/'], ...items, [current, cur]].map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(u) })) });

const planCard = p => `<article class="plan${p.featured ? ' featured' : ''}">${p.featured ? '<span class="popular">Mais escolhido</span>' : ''}<span class="profile-badge">${p.profile}</span><h3>${p.speed} Mbps</h3><p class="plan-desc">${p.desc}</p><div class="price">${money(p.price)} Kz <small>/mês</small></div><ul class="features"><li>Cobertura nacional</li><li>Pedido simples pelo WhatsApp</li><li>Apoio da equipa iTpraTi</li></ul><a class="btn ${p.featured ? 'btn-primary' : 'btn-outline'}" data-ev="plan_click" data-label="${p.speed} Mbps" href="${wa(`Olá iTpraTi, tenho interesse no plano ${p.profile} de ${p.speed} Mbps por ${money(p.price)} Kz/mês. Gostaria de avançar com o pedido.`)}" target="_blank" rel="noopener">${p.featured ? 'Contratar agora' : 'Contratar no WhatsApp'} →</a></article>`;

const faqHtml = items => `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
const faqLD = items => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });

const PROV = ['Bengo','Benguela','Bié','Cabinda','Cuando','Cubango','Cuanza Norte','Cuanza Sul','Cunene','Huambo','Huíla','Icolo e Bengo','Luanda','Lunda Norte','Lunda Sul','Malanje','Moxico','Moxico Leste','Namibe','Uíge','Zaire'];
/* Formulário "Pedido de contacto": envia os dados por WhatsApp (ver main.js, secção 4). */
function form(id, o = {}) {
  const services = o.services || ['Internet', 'TV Online', 'Internet + TV (Combo)', 'Soluções para empresas'];
  return `<form class="coverage-form" id="${id}" data-wa-form data-wa="${C.whatsapp}">
<h3>${o.title || 'Pedido de contacto'}</h3><p>${o.sub || 'Preencha em 1 minuto. A equipa responde pelo WhatsApp.'}</p>
<div class="field"><label for="${id}-n">Nome</label><input id="${id}-n" name="nome" autocomplete="name" placeholder="Como se chama?" required></div>
<div class="row"><div class="field"><label for="${id}-p">Província</label><input id="${id}-p" name="provincia" list="${id}-pl" placeholder="Ex.: Luanda" required><datalist id="${id}-pl">${PROV.map(x => `<option value="${x}">`).join('')}</datalist></div>
<div class="field"><label for="${id}-m">Município</label><input id="${id}-m" name="municipio" placeholder="Ex.: Talatona" required></div></div>
<div class="field"><label for="${id}-b">Bairro ou ponto de referência</label><input id="${id}-b" name="bairro" placeholder="Rua, bairro ou ponto de referência" required></div>
<div class="field"><label for="${id}-s">Serviço pretendido</label><select id="${id}-s" name="servico" required><option value="">Escolha uma opção</option>${services.map(s => `<option>${s}</option>`).join('')}</select></div>
<div class="field"><label for="${id}-t">WhatsApp / telemóvel</label><input id="${id}-t" name="telefone" type="tel" autocomplete="tel" placeholder="+244 9XX XXX XXX" required></div>
<label class="consent"><input type="checkbox" name="consentimento" required> <span>Aceito que a iTpraTi use estes dados para me contactar, conforme a <a href="/privacidade/">Política de Privacidade</a>.</span></label>
<button class="btn btn-primary" type="submit">Pedir contacto →</button><div class="form-message" role="status" aria-live="polite"></div>
<p class="form-note">O custo de instalação é definido após avaliação da localização, tecnologia e serviço solicitado.</p></form>`;
}

const ctaStrip = (t = 'Pronto para se conectar?', s = 'Fale connosco no WhatsApp e dê o próximo passo.') =>
  `<div class="cta-strip"><div class="container cta-inner"><div><h2>${t}</h2><p>${s}</p></div><a class="btn btn-primary" data-ev="cta_whatsapp" href="${wa('Olá iTpraTi, quero saber mais sobre os planos de Internet e TV.')}" target="_blank" rel="noopener">Falar no WhatsApp agora →</a></div></div>`;

const pageHero = (cr, h1, lead, extra = '') => `<section class="page-hero"><div class="container">${cr}<h1>${h1}</h1><p class="lead">${lead}</p>${extra}</div></section>`;

/* ============================ 4. TEXTOS (FAQ) ============================ */
// Reveja estas respostas: devem refletir as condições reais da iTpraTi.
const FAQ_COB = ['Como sei se existe cobertura na minha zona?', `Indique a província, o município e o bairro na página de <a href="/cobertura/">cobertura</a> ou fale connosco no WhatsApp. A equipa iTpraTi confirma a disponibilidade e a tecnologia adequada antes de qualquer contratação.`];
const FAQ_PRECO = ['O preço inclui instalação e equipamento?', 'A mensalidade depende do plano escolhido. O custo de instalação e os equipamentos são definidos após a avaliação da localização, da tecnologia e do serviço. Antes de confirmar o pedido recebe o detalhe da mensalidade, instalação, equipamentos e eventuais taxas.'];
const FAQ_VEL = ['Que velocidade de internet devo escolher?', `Depende de quantas pessoas e dispositivos usam a ligação. Para navegação e mensagens bastam velocidades mais baixas; para streaming, estudo e teletrabalho em simultâneo convém subir. Veja o guia <a href="/blog/qual-a-velocidade-de-internet-ideal/">Qual a velocidade de internet ideal para a sua casa em Angola?</a>.`];
const FAQ_COMBO = ['Posso contratar Internet e TV em conjunto?', 'Sim. Escolha "Internet + TV (Combo)" no formulário ou peça no WhatsApp. Na página de <a href="/pacotes/">pacotes</a> vê o valor de referência (mensalidade do plano mais a TV Online) e a equipa confirma o preço total e as condições antes de avançar.'];
const FAQ_TESTE = ['Como funciona o teste grátis da TV Online?', `O teste dura ${C.tv.trialDays} dias e é pedido pelo WhatsApp. A equipa envia o acesso e indica como instalar a app. A compatibilidade depende do modelo do equipamento.`];
const FAQ_AJUDA = ['Como posso pedir ajuda com o meu serviço?', `Fale com a equipa pelo WhatsApp (${C.whatsappLabel}) ou envie e-mail para <a href="mailto:${C.email}">${C.email}</a>. Tenha à mão o seu nome e a morada do serviço para agilizar o atendimento.`];
const FAQ_HOME = [FAQ_COB, FAQ_PRECO, FAQ_AJUDA, FAQ_COMBO, FAQ_TESTE, FAQ_VEL];
const FAQ_INTERNET = [FAQ_VEL, FAQ_PRECO, ['Os planos são mesmo ilimitados?', 'Os planos são apresentados como internet ilimitada. As condições de utilização de cada plano são comunicadas antes da contratação; em caso de dúvida, peça-as à equipa.'], ['Quanto tempo demora a instalação?', 'O prazo depende da zona e da tecnologia. A equipa indica a data prevista depois de avaliar o seu pedido.']];
const FAQ_TV = [FAQ_TESTE, ['Que dispositivos posso usar?', `A app iTpraTi funciona em Smart TVs compatíveis. Se a sua televisão não for compatível, pode adquirir uma Box TV Android por ${money(C.tv.box)} Kz (pagamento único). Confirme o seu modelo com a equipa.`], ['Que canais posso ver?', `Mais de ${C.tv.channels} canais, filmes, séries e desporto em directo. Pode consultar a lista em <a href="${C.tv.channelsUrl}" target="_blank" rel="noopener">ver canais online</a>; a oferta pode variar.`], ['Preciso de antena?', 'Não. A TV Online funciona através da internet, por isso precisa de uma ligação estável.']];
const FAQ_COBERTURA = [['A cobertura é nacional?', 'A iTpraTi apresenta cobertura em todo o território nacional. A disponibilidade e a tecnologia em cada morada são confirmadas pela equipa.'], ['O que acontece depois de enviar o pedido?', 'Abre-se o WhatsApp com os seus dados já preenchidos. Ao enviar a mensagem, a equipa responde para confirmar a zona e orientar os próximos passos.']];
const FAQ_EMP = [['Que soluções empresariais oferecem?', 'Internet para empresas, faturação certificada (Vendus), ERP Odoo, cloud e alojamento, menus digitais (Qyar) e automação com IA (Claw).'], ['Como peço uma proposta?', `Preencha o formulário desta página ou fale com a equipa comercial no WhatsApp (${C.whatsappLabel}) ou por e-mail (${C.email}).`]];

/* ============================ 5. PÁGINAS ============================ */
const org = { '@context': 'https://schema.org', '@type': 'Organization', name: C.siteName, url: C.siteUrl, logo: abs('/img/logo-itprati.png'), sameAs: Object.values(C.social), contactPoint: { '@type': 'ContactPoint', telephone: '+' + C.whatsapp, contactType: 'customer service', areaServed: 'AO', availableLanguage: 'pt' } };

/* --- Carregar artigos já aqui porque a home mostra os 3 últimos --- */
const blogDir = path.join(R, 'content/blog');
const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).map(f => {
  const m = fs.readFileSync(path.join(blogDir, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) { console.warn('  ! sem cabeçalho (front matter):', f); return null; }
  const fm = {}; m[1].split(/\r?\n/).forEach(l => { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  if (fm.published === 'false') return null;                                  // rascunho: não publica
  const slug = fm.slug || f.replace(/\.md$/, '').replace(/^\d+-/, ''), body = m[2].trim();
  return { slug, title: fm.title, seo: fm.seo_title, desc: fm.description, date: fm.date, cat: fm.category || 'Geral', cta: fm.cta || 'geral', image: fm.image || `blog/${slug}.jpg`, body, mins: Math.max(1, Math.round(body.split(/\s+/).length / 200)) };
}).filter(Boolean).sort((a, b) => b.date.localeCompare(a.date));

const card = p => `<article class="post-card" data-cat="${esc(p.cat)}"><a href="/blog/${p.slug}/" tabindex="-1" aria-hidden="true">${slot(p.image, '', '', 800, 450)}</a><div class="pc-body"><span class="profile-badge">${esc(p.cat)}</span><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.desc)}</p><small>${fmtDate(p.date)} · ${p.mins} min de leitura</small></div></article>`;

/* --- HOME --- */
function home() {
  layout({ path: '/', title: 'Internet Ilimitada e TV Online em Angola | iTpraTi', desc: `Internet ilimitada e TV Online (IPTV) em toda Angola. Planos desde ${P} Kz. Mais de ${C.tv.channels} canais, teste grátis ${C.tv.trialDays} dias. Peça no WhatsApp.`, keywords: C.keywords, ld: [org, { '@context': 'https://schema.org', '@type': 'WebSite', name: C.siteName, url: C.siteUrl, inLanguage: 'pt-AO' }, faqLD(FAQ_HOME)] }, `
<section class="hero"><div class="container hero-grid"><div>
<span class="eyebrow">Conectividade feita para si</span>
<h1>Internet Ilimitada + TV Online em Angola.<br><span>Uma só experiência. Toda Angola.</span></h1>
<p class="lead">Internet ilimitada, mais de ${C.tv.channels} canais e apoio local. Planos a partir de ${P} Kz/mês. Peça hoje e a equipa agenda a instalação.</p>
<div class="hero-ctas"><a class="btn btn-primary" data-ev="hero_whatsapp" href="${wa('Olá iTpraTi, quero saber mais sobre os planos de Internet e TV.')}" target="_blank" rel="noopener">Falar no WhatsApp agora →</a><a class="btn btn-outline" href="/internet/">Ver planos e preços</a></div>
<div class="trust-row"><span><b>✓</b> Planos claros</span><span><b>✓</b> Apoio local</span><span><b>✓</b> Internet e TV</span></div></div>
<div class="hero-visual">${slot('hero-home.jpg', 'Família a usar internet e TV online em casa, em Angola', '', 900, 700, true)}<div class="float-tag ft1">Internet desde<strong>${P} Kz/mês</strong></div><div class="float-tag ft2">TV Online<strong>${money(C.tv.price)} Kz/mês</strong></div></div></div></section>
<div class="quickbar"><div class="container"><a class="quick" href="/internet/"><i>⌁</i><span><strong>Internet para a sua casa</strong><small>Descubra os planos</small></span></a><a class="quick" href="/tv/"><i>▣</i><span><strong>TV Online e entretenimento</strong><small>Teste grátis ${C.tv.trialDays} dias</small></span></a><a class="quick" href="/pacotes/"><i>✦</i><span><strong>Internet + TV</strong><small>Veja o pacote combinado</small></span></a></div></div>
<section class="alt" id="planos"><div class="container"><div class="section-head"><span class="eyebrow">Escolha com confiança</span><h2>Planos de internet ilimitada desde ${P} Kz/mês</h2><p>Compare e escolha a velocidade que acompanha a sua casa. Preços em kwanzas, por mês.</p></div>
<div class="plans">${[6, 25, 50].map(s => planCard(C.plans.find(p => p.speed === s) || C.plans[0])).join('')}</div>
<p class="fineprint">Cobertura, velocidade, instalação, equipamentos e condições dependem do plano e da zona. <a href="/internet/"><strong>Ver todos os planos →</strong></a></p></div></section>
<section><div class="container split"><div>${slot('tv-sala.jpg', 'Família a ver TV Online na sala', 'wide', 1200, 675)}</div><div><span class="eyebrow">Mais para ver</span><h2>TV Online por ${money(C.tv.price)} Kz/mês</h2><p class="lead">Mais de ${C.tv.channels} canais, filmes, séries e desporto em directo. Sem antena e sem complicação. Teste grátis ${C.tv.trialDays} dias.</p><div class="tv-actions"><a class="btn btn-primary" href="/tv/">Conhecer a TV Online</a><a class="btn btn-outline" data-ev="trial_whatsapp" href="${wa(`Olá iTpraTi, quero experimentar a TV Online durante ${C.tv.trialDays} dias grátis.`)}" target="_blank" rel="noopener">Experimentar ${C.tv.trialDays} dias grátis</a></div></div></div></section>
<section class="coverage" id="cobertura"><div class="container coverage-grid"><div><span class="eyebrow">Comece por aqui</span><h2>A sua zona já tem cobertura iTpraTi?</h2><p class="lead">Temos cobertura em todo o território nacional. Deixe os seus dados e a equipa confirma a disponibilidade e orienta os próximos passos.</p><div class="trust-row"><span>✓ Cobertura nacional</span><span>✓ Atendimento personalizado</span><span>✓ Sem compromisso</span></div><div class="contact-options"><a href="${wa('Olá iTpraTi, gostaria de pedir contacto.')}" target="_blank" rel="noopener">Falar pelo WhatsApp ↗</a><a href="mailto:${C.email}?subject=Pedido%20de%20contacto%20iTpraTi">Enviar e-mail ↗</a></div></div>${form('f-home')}</div></section>
<section><div class="container"><div class="section-head"><span class="eyebrow">Para negócios</span><h2>Soluções digitais para a sua empresa</h2><p>Internet empresarial, faturação, ERP, cloud e automação com IA, num só lugar.</p></div><div class="tv-actions" style="justify-content:center"><a class="btn btn-dark" href="/empresas/">Ver soluções para empresas →</a></div></div></section>
<section class="alt"><div class="container"><div class="section-head"><span class="eyebrow">Blog iTpraTi Tech</span><h2>Notícias e guias de tecnologia em Angola</h2></div><div class="blog-grid">${posts.slice(0, 3).map(card).join('')}</div><p class="fineprint"><a href="/blog/"><strong>Ver todos os artigos →</strong></a></p></div></section>
<section id="ajuda"><div class="container"><div class="section-head"><span class="eyebrow">Estamos aqui para ajudar</span><h2>Perguntas frequentes</h2><p>Respostas rápidas para decidir com confiança.</p></div>${faqHtml(FAQ_HOME)}</div></section>
${ctaStrip()}`);
}

/* --- INTERNET --- */
function internet() {
  const t = 'Internet em Casa em Angola: Planos desde ' + P + ' Kz | iTpraTi';
  layout({ path: '/internet/', title: t, desc: `Internet ilimitada em casa em toda Angola. Planos de ${C.plans[0].speed} a ${C.plans[C.plans.length - 1].speed} Mbps desde ${P} Kz/mês. Peça no WhatsApp e agende a instalação.`, keywords: C.keywords, ld: [crumbLD([], 'Internet', '/internet/'), faqLD(FAQ_INTERNET), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Planos de internet iTpraTi', itemListElement: C.plans.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Service', name: `Internet ${p.speed} Mbps — ${p.profile}`, description: p.desc, provider: { '@type': 'Organization', name: C.siteName }, areaServed: 'AO', offers: { '@type': 'Offer', price: String(p.price), priceCurrency: 'AOA', url: abs('/internet/') } } })) }] }, `
<section class="page-hero"><div class="container hero-grid"><div>${crumbs([], 'Internet')}<h1>Internet ilimitada em casa, em toda Angola</h1><p class="lead">Seis planos, de ${C.plans[0].speed} a ${C.plans[C.plans.length - 1].speed} Mbps, a partir de <strong>${P} Kz/mês</strong> (plano ${cheapestPlan.profile}, ${cheapestPlan.speed} Mbps). Peça pelo WhatsApp e a equipa trata da instalação.</p><div class="hero-ctas"><a class="btn btn-primary" href="${wa('Olá iTpraTi, quero contratar internet em casa.')}" target="_blank" rel="noopener">Pedir internet no WhatsApp →</a><a class="btn btn-outline" href="/cobertura/">Verificar cobertura</a></div></div><div>${slot('internet-casa.jpg', 'Router e família a usar internet em casa', '', 1200, 900, true)}</div></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Planos de internet para casa e empresa</h2><p>Preços mensais em kwanzas. Escolha a velocidade ideal para o seu uso.</p></div><div class="banner"><b>✓</b><div><strong>Cobertura em todo o território nacional</strong><p>Onde estiver em Angola, fale connosco para escolher o serviço e agendar a instalação.</p></div></div><div class="plans">${C.plans.map(planCard).join('')}</div><p class="fineprint">Cobertura, velocidade, instalação, equipamentos e condições dependem do plano e da zona. Confirme os detalhes antes de contratar.</p></div></section>
<section><div class="container"><div class="section-head"><h2>Que velocidade escolher?</h2><p>Referência orientativa. Veja o <a href="/blog/qual-a-velocidade-de-internet-ideal/" style="color:var(--blue);text-decoration:underline">guia completo</a>.</p></div><div class="table-wrap"><table><thead><tr><th>Utilização</th><th>Velocidade orientativa</th></tr></thead><tbody><tr><td>Navegação, WhatsApp e e-mail (1–2 pessoas)</td><td>6–10 Mbps</td></tr><tr><td>Streaming em HD e estudo online (3–4 pessoas)</td><td>25 Mbps</td></tr><tr><td>Teletrabalho, videochamadas e vários ecrãs</td><td>50 Mbps</td></tr><tr><td>Equipas, 4K e muitos dispositivos em simultâneo</td><td>100–200 Mbps</td></tr></tbody></table></div></div></section>
<section class="alt"><div class="container split"><div><h2>Como contratar em 3 passos</h2><ol class="steps" style="grid-template-columns:1fr"><li><strong>Escolha o plano</strong><p>Clique em "Contratar" no plano pretendido ou fale com a equipa.</p></li><li><strong>Confirmamos a sua zona</strong><p>A equipa valida a cobertura e a tecnologia na sua morada.</p></li><li><strong>Agendamos a instalação</strong><p>Recebe o detalhe de mensalidade, instalação e equipamentos antes de confirmar.</p></li></ol></div><div>${slot('internet-instalacao.jpg', 'Técnico a instalar internet numa casa', '', 1200, 900)}</div></div></section>
<section><div class="container"><div class="section-head"><h2>Perguntas frequentes sobre internet</h2></div>${faqHtml(FAQ_INTERNET)}</div></section>
${ctaStrip('Quer internet em casa esta semana?', 'Fale com a equipa e confirme a cobertura na sua zona.')}`);
}

/* --- TV --- */
function tv() {
  layout({ path: '/tv/', title: `TV Online em Angola: +${C.tv.channels} canais | iTpraTi`, desc: `TV Online por ${money(C.tv.price)} Kz/mês. Mais de ${C.tv.channels} canais, filmes, séries e desporto em directo. Teste grátis ${C.tv.trialDays} dias. Peça no WhatsApp.`, keywords: C.keywords, ld: [crumbLD([], 'TV Online', '/tv/'), faqLD(FAQ_TV), { '@context': 'https://schema.org', '@type': 'Service', name: 'TV Online iTpraTi', provider: { '@type': 'Organization', name: C.siteName }, areaServed: 'AO', offers: { '@type': 'Offer', price: String(C.tv.price), priceCurrency: 'AOA' } }] }, `
<section class="page-hero"><div class="container hero-grid"><div>${crumbs([], 'TV Online')}<h1>TV Online em Angola: mais de ${C.tv.channels} canais por ${money(C.tv.price)} Kz/mês</h1><p class="lead">Canais, filmes, séries e desporto em directo, sem antena. Experimente ${C.tv.trialDays} dias grátis.</p><div class="hero-ctas"><a class="btn btn-primary" data-ev="trial_whatsapp" href="${wa(`Olá iTpraTi, quero experimentar a TV Online durante ${C.tv.trialDays} dias grátis.`)}" target="_blank" rel="noopener">Experimentar ${C.tv.trialDays} dias grátis →</a><a class="btn btn-outline" href="${C.tv.channelsUrl}" target="_blank" rel="noopener">Ver canais online ↗</a></div></div><div>${slot('tv-sala.jpg', 'TV Online a funcionar numa Smart TV', '', 1200, 900, true)}</div></div></section>
<section><div class="container"><div class="section-head"><h2>Tudo num só plano</h2><p>Um plano único de ${money(C.tv.price)} Kz/mês, com teste grátis para experimentar.</p></div><div class="cards"><div class="card"><h3>+${C.tv.channels} canais</h3><p>Notícias, desporto, filmes, séries e conteúdo para toda a família.</p></div><div class="card"><h3>Sem antena</h3><p>Funciona pela internet, em casa ou onde estiver, com uma ligação estável.</p></div><div class="card"><h3>Teste grátis ${C.tv.trialDays} dias</h3><p>Peça no WhatsApp e experimente antes de decidir.</p></div></div></div></section>
<section class="alt"><div class="container split"><div><h2>Em que dispositivos posso ver?</h2><div class="benefit-list"><div class="benefit"><strong>A app iTpraTi na sua Smart TV</strong><p>Funciona em Smart TVs compatíveis. Consulte a equipa para confirmar a instalação no seu modelo.</p></div><div class="benefit"><strong>Não tem Smart TV compatível?</strong><p>Adquira uma Box TV Android por <strong>${money(C.tv.box)} Kz</strong>, pagamento único, e use a TV Online no seu televisor.</p></div></div><p class="fineprint" style="text-align:left">A compatibilidade depende do modelo do equipamento e da aplicação disponível.</p></div><div>${slot('tv-box.jpg', 'Box TV Android ligada a uma televisão', '', 1200, 900)}</div></div></section>
<section><div class="container"><div class="section-head"><h2>Como começar</h2></div><ol class="steps"><li><strong>Peça o teste</strong><p>Fale com a equipa no WhatsApp.</p></li><li><strong>Receba o acesso</strong><p>Enviamos as instruções e os dados de acesso.</p></li><li><strong>Instale e veja</strong><p>Instale a app, entre e escolha o que ver. Precisa de ajuda? Veja <a href="/blog/como-instalar-tv-online-na-smart-tv/" style="color:var(--blue);text-decoration:underline">como instalar na Smart TV</a>.</p></li></ol></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Perguntas frequentes sobre a TV Online</h2></div>${faqHtml(FAQ_TV)}</div></section>
${ctaStrip('Experimente a TV Online grátis', `Peça agora o seu teste de ${C.tv.trialDays} dias.`)}`);
}

/* --- PACOTES --- */
function pacotes() {
  layout({ path: '/pacotes/', title: 'Pacotes Internet + TV em Angola | iTpraTi', desc: `Junte internet ilimitada e TV Online num só pedido. Valor de referência desde ${money(cheapest + C.tv.price)} Kz/mês. Peça a sua proposta no WhatsApp.`, keywords: C.keywords, ld: [crumbLD([], 'Pacotes', '/pacotes/'), faqLD([FAQ_COMBO, FAQ_PRECO])] }, `
<section class="page-hero"><div class="container hero-grid"><div>${crumbs([], 'Pacotes')}<h1>Pacotes Internet + TV em Angola</h1><p class="lead">Internet ilimitada e TV Online com a mesma equipa e o mesmo contacto. Veja o valor de referência e peça a sua proposta combinada.</p><div class="hero-ctas"><a class="btn btn-primary" data-ev="combo_whatsapp" href="${wa('Olá iTpraTi, quero uma proposta combinada de Internet + TV.')}" target="_blank" rel="noopener">Pedir proposta combinada →</a></div></div><div>${slot('pacote-familia.jpg', 'Família a usar internet e TV online em casa', '', 1200, 900, true)}</div></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Valor de referência: internet + TV Online</h2><p>Soma da mensalidade do plano com a TV Online (${money(C.tv.price)} Kz/mês). As condições do pacote combinado são confirmadas pela equipa antes de avançar.</p></div><div class="table-wrap"><table><thead><tr><th>Plano de internet</th><th>Internet</th><th>TV Online</th><th>Total de referência</th></tr></thead><tbody>${C.plans.map(p => `<tr><td><strong>${p.speed} Mbps</strong> · ${p.profile}</td><td>${money(p.price)} Kz</td><td>${money(C.tv.price)} Kz</td><td><strong>${money(p.price + C.tv.price)} Kz/mês</strong></td></tr>`).join('')}</tbody></table></div><p class="fineprint">Valores mensais, sem instalação. Box TV Android opcional: ${money(C.tv.box)} Kz (pagamento único). Teste grátis da TV: ${C.tv.trialDays} dias.</p></div></section>
<section><div class="container"><div class="cards"><div class="card"><h3>Um só contacto</h3><p>Internet e TV tratadas pela mesma equipa, no mesmo WhatsApp.</p></div><div class="card"><h3>Comece pela TV</h3><p>Experimente a TV ${C.tv.trialDays} dias grátis antes de decidir o pacote.</p><a class="more" href="/tv/">Ver a TV Online →</a></div><div class="card"><h3>Escolha a velocidade</h3><p>Da navegação simples ao teletrabalho, há um plano para cada casa.</p><a class="more" href="/internet/">Ver planos →</a></div></div></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Perguntas frequentes</h2></div>${faqHtml([FAQ_COMBO, FAQ_PRECO, FAQ_TESTE])}</div></section>
${ctaStrip('Quer o pacote Internet + TV?', 'Diga-nos a sua zona e o plano que lhe interessa.')}`);
}

/* --- EMPRESAS --- */
function empresas() {
  const items = [['Internet empresarial', 'Planos de 100 e 200 Mbps para equipas e operações que exigem mais.', '/internet/', 'Ver planos'], ['Faturação certificada (Vendus)', 'Revendedor oficial Cegid Vendus em Angola: faturação e gestão comercial.', 'https://vendus.itprati.ao', 'Conhecer o Vendus'], ['ERP Odoo', 'Gestão integrada de vendas, stocks, compras e contabilidade.', wa('Olá iTpraTi, quero saber mais sobre o ERP Odoo para a minha empresa.'), 'Pedir informações'], ['Cloud e alojamento', 'Servidores, alojamento web e soluções cloud para o seu negócio.', 'https://cloud.it.ao', 'Ver cloud'], ['Menus digitais (Qyar)', 'Menus digitais e ferramentas para restaurantes e hotelaria.', 'https://qyar.me', 'Ver Qyar'], ['Automação com IA (Claw)', 'Automatize atendimento e tarefas repetitivas com inteligência artificial.', 'https://claw.itprati.ao', 'Ver Claw']];
  layout({ path: '/empresas/', title: 'Soluções Digitais para Empresas em Angola | iTpraTi', desc: 'Internet empresarial, faturação certificada Vendus, ERP Odoo, cloud, alojamento e automação com IA para empresas em Angola. Peça proposta.', keywords: 'internet empresarial Angola, faturação certificada Angola, Vendus Angola, Odoo Angola, cloud Angola, alojamento web Angola, automação IA Angola, iTpraTi empresas', ld: [crumbLD([], 'Empresas', '/empresas/'), faqLD(FAQ_EMP)] }, `
<section class="page-hero"><div class="container hero-grid"><div>${crumbs([], 'Empresas')}<h1>Soluções digitais para empresas em Angola</h1><p class="lead">Internet, faturação, ERP, cloud e automação com IA. Conte-nos o que precisa e a equipa propõe o próximo passo.</p><div class="hero-ctas"><a class="btn btn-primary" href="#proposta">Pedir proposta →</a><a class="btn btn-outline" href="${wa('Olá iTpraTi, quero falar com a equipa comercial.')}" target="_blank" rel="noopener">Falar no WhatsApp</a></div></div><div>${slot('empresas-escritorio.jpg', 'Equipa de uma empresa a trabalhar com soluções digitais', '', 1200, 900, true)}</div></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>O que a iTpraTi faz pela sua empresa</h2></div><div class="cards">${items.map(([t, d, u, b]) => `<div class="card"><h3>${t}</h3><p>${d}</p><a class="more" href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${b} →</a></div>`).join('')}</div></div></section>
<section class="coverage" id="proposta"><div class="container coverage-grid"><div><span class="eyebrow">Equipa comercial</span><h2>Peça a sua proposta</h2><p class="lead">Diga-nos o serviço pretendido e a localização da empresa. Respondemos pelo WhatsApp.</p></div>${form('f-emp', { title: 'Pedido de proposta', services: ['Internet empresarial', 'Faturação (Vendus)', 'ERP Odoo', 'Cloud e alojamento', 'Menus digitais (Qyar)', 'Automação com IA (Claw)'] })}</div></section>
<section><div class="container"><div class="section-head"><h2>Perguntas frequentes</h2></div>${faqHtml(FAQ_EMP)}</div></section>`);
}

/* --- COBERTURA --- */
function cobertura() {
  layout({ path: '/cobertura/', title: 'Cobertura de Internet em Angola: Verifique a sua Zona | iTpraTi', desc: 'Verifique a cobertura iTpraTi na sua província, município e bairro. Cobertura nacional de internet e TV Online. Resposta rápida pelo WhatsApp.', keywords: C.keywords, ld: [crumbLD([], 'Cobertura', '/cobertura/'), faqLD(FAQ_COBERTURA)] }, `
${pageHero(crumbs([], 'Cobertura'), 'Verifique a cobertura iTpraTi na sua zona', 'Cobertura em todo o território nacional. Indique a sua localização e a equipa confirma a disponibilidade e a tecnologia.')}
<section class="coverage"><div class="container coverage-grid"><div><span class="eyebrow">Passo 1 de 2</span><h2>Onde quer a sua ligação?</h2><p class="lead">Preencha a província, o município e o bairro. Depois abrimos o WhatsApp com tudo preenchido para confirmar consigo.</p><div class="trust-row"><span>✓ Cobertura nacional</span><span>✓ Sem compromisso</span><span>✓ Resposta pelo WhatsApp</span></div></div>${form('f-cob', { title: 'Verificar cobertura', sub: 'Indique onde pretende o serviço.' })}</div></section>
${C.coverageZones.length ? `<section class="alt"><div class="container"><div class="section-head"><h2>Zonas com cobertura confirmada</h2></div><div class="cards">${C.coverageZones.map(z => `<div class="card"><h3>${esc(z)}</h3></div>`).join('')}</div></div></section>` : ''}
<section><div class="container split"><div>${slot('cobertura-mapa.jpg', 'Mapa de Angola com a cobertura iTpraTi', 'wide', 1200, 675)}</div><div><h2>Internet e TV Online em todo o país</h2><p class="lead">A iTpraTi leva internet ilimitada e TV Online a casas e empresas em Angola. A tecnologia disponível depende da zona e é confirmada antes da contratação.</p><div class="tv-actions"><a class="btn btn-primary" href="/internet/">Ver planos de internet</a><a class="btn btn-outline" href="/tv/">Ver TV Online</a></div></div></div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Perguntas sobre cobertura</h2></div>${faqHtml(FAQ_COBERTURA)}</div></section>`);
}

/* --- SOBRE, PRIVACIDADE, TERMOS, 404 --- */
function institucional() {
  layout({ path: '/sobre/', title: 'Sobre a iTpraTi e a Redação | iTpraTi', desc: 'Conheça a iTpraTi, os seus contactos e a política editorial do blog iTpraTi Tech: fontes, correções e transparência.' }, `
${pageHero(crumbs([], 'Sobre nós'), 'Sobre a iTpraTi', 'Internet ilimitada e TV Online para ligar pessoas, casas e ideias em Angola.')}
<section><div class="container legal"><h2>Quem somos</h2><p>A iTpraTi é uma empresa de internet e tecnologia sediada em Luanda, que oferece internet para casas e empresas, TV Online e soluções digitais para negócios.</p>
<h2>Contactos</h2><ul><li>WhatsApp: <a href="${wa('Olá iTpraTi')}">${C.whatsappLabel}</a></li><li>E-mail: <a href="mailto:${C.email}">${C.email}</a></li></ul>
<h2>Política editorial do blog iTpraTi Tech</h2><ul><li>Escrevemos com palavras próprias e indicamos sempre as fontes das notícias.</li><li>Verificamos os factos em fontes primárias (reguladores, empresas, comunicados oficiais).</li><li>Mostramos a data de publicação de cada artigo e corrigimos erros de forma transparente.</li><li>Conteúdo patrocinado ou publicitário é sempre identificado.</li><li>Para correções ou sugestões, escreva para <a href="mailto:${C.email}">${C.email}</a>.</li></ul></div></section>`);

  layout({ path: '/privacidade/', title: 'Política de Privacidade | iTpraTi', desc: 'Saiba como a iTpraTi recolhe e usa os seus dados pessoais, cookies, Google Analytics e AdSense, e como exercer os seus direitos.' }, `
${pageHero(crumbs([], 'Privacidade'), 'Política de Privacidade', `Última atualização: ${fmtDate(today)}.`)}
<section><div class="container legal"><p class="note"><strong>Modelo base.</strong> Reveja este texto com um jurista antes de o considerar definitivo (Lei n.º 22/11 de Proteção de Dados Pessoais).</p>
<h2>Quem trata os dados</h2><p>iTpraTi, Luanda, Angola. Contacto: <a href="mailto:${C.email}">${C.email}</a>.</p>
<h2>Que dados recolhemos</h2><ul><li>Dados que indica nos formulários: nome, localização (província, município, bairro), serviço pretendido e telefone/WhatsApp.</li><li>Dados de navegação e cookies de análise (Google Analytics), apenas se aceitar cookies.</li><li>Cookies de publicidade (Google AdSense) nas páginas do blog, apenas se aceitar cookies e se a publicidade estiver ativa.</li></ul>
<h2>Para que usamos</h2><p>Para responder aos seus pedidos, confirmar cobertura, apresentar propostas, melhorar o site e, se aplicável, mostrar publicidade.</p>
<h2>Partilha e conservação</h2><p>Os pedidos são enviados por WhatsApp à equipa iTpraTi. Os dados são conservados apenas pelo tempo necessário para a finalidade para que foram recolhidos. Serviços como Google Analytics e AdSense têm as suas próprias políticas.</p>
<h2>Os seus direitos</h2><p>Pode pedir acesso, retificação ou eliminação dos seus dados e retirar o consentimento, escrevendo para <a href="mailto:${C.email}">${C.email}</a>.</p>
<h2>Cookies</h2><p>Pode aceitar ou recusar cookies no aviso apresentado no site. Para alterar a escolha, limpe os dados do site no seu navegador.</p></div></section>`);

  layout({ path: '/termos/', title: 'Termos e Condições | iTpraTi', desc: 'Termos e condições de utilização do site iTpraTi: informação de preços, serviços, ligações externas e limitação de responsabilidade.' }, `
${pageHero(crumbs([], 'Termos'), 'Termos e Condições', `Última atualização: ${fmtDate(today)}.`)}
<section><div class="container legal"><p class="note"><strong>Modelo base.</strong> Reveja com um jurista e adapte aos contratos reais de serviço.</p>
<h2>Utilização do site</h2><p>O conteúdo do site tem carácter informativo. A iTpraTi pode atualizar textos, preços e condições sem aviso prévio.</p>
<h2>Preços e serviços</h2><p>Os preços indicados são mensalidades em kwanzas. Cobertura, velocidade, instalação, equipamentos e condições dependem do plano e da zona e são confirmados pela equipa antes da contratação.</p>
<h2>Ligações externas</h2><p>O site pode ligar a páginas de terceiros. A iTpraTi não é responsável pelo seu conteúdo.</p>
<h2>Blog</h2><p>Os artigos do blog têm fins informativos e não constituem aconselhamento jurídico, fiscal ou financeiro.</p>
<h2>Lei aplicável</h2><p>Estes termos regem-se pela lei angolana.</p></div></section>`);

  layout({ path: '/404.html', noindex: true, title: 'Página não encontrada | iTpraTi', desc: 'A página que procura não existe ou mudou de endereço. Volte ao início ou veja os nossos serviços.' }, `
<section class="notfound"><div class="container"><p class="big">404</p><h1>Página não encontrada</h1><p class="lead" style="margin:0 auto">A página que procura não existe ou mudou de endereço.</p><div class="links"><a class="btn btn-primary" href="/">Ir para o início</a><a class="btn btn-outline" href="/internet/">Internet</a><a class="btn btn-outline" href="/tv/">TV Online</a><a class="btn btn-outline" href="/blog/">Blog</a><a class="btn btn-outline" href="/cobertura/">Cobertura</a></div></div></section>`);
}

/* ============================ 6. BLOG ============================ */
const CTA = { internet: ['Escolha o plano certo para a sua casa', 'Veja os planos de internet ilimitada desde ' + P + ' Kz/mês.', 'Ver planos de internet', '/internet/'], tv: ['Experimente a TV Online grátis', `${C.tv.trialDays} dias de teste, sem compromisso.`, 'Ver a TV Online', '/tv/'], empresas: ['Soluções digitais para a sua empresa', 'Internet, faturação, ERP, cloud e IA.', 'Ver soluções para empresas', '/empresas/'], geral: ['Fale com a equipa iTpraTi', 'Tire dúvidas e confirme a cobertura na sua zona.', 'Falar no WhatsApp', wa('Olá iTpraTi, li um artigo no blog e gostaria de falar convosco.')] };
const ad = k => C.adsense.client && C.adsense.slots[k] ? `<div class="ad" aria-label="Publicidade"><ins class="adsbygoogle" style="display:block" data-ad-client="${C.adsense.client}" data-ad-slot="${C.adsense.slots[k]}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>` : '';

function blog() {
  const cats = [...new Set(posts.map(p => p.cat))];
  layout({ path: '/blog/', title: 'Blog de Tecnologia em Angola: Notícias e Guias | iTpraTi', desc: 'Notícias e guias de tecnologia, internet, TV online e negócios digitais em Angola, em português claro. Blog iTpraTi Tech.', keywords: 'blog tecnologia Angola, notícias tecnologia Angola, guias internet Angola, iTpraTi Tech', ld: [crumbLD([], 'Blog', '/blog/')] }, `
${pageHero(crumbs([], 'Blog'), 'Blog iTpraTi Tech: notícias e guias de tecnologia em Angola', 'Internet, TV online, segurança e negócios digitais explicados em português claro.')}
<section><div class="container"><div class="chips"><button class="chip active" data-cat="all">Todos (${posts.length})</button>${cats.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="blog-grid">${posts.map(card).join('')}</div></div></section>
<div class="cta-strip"><div class="container cta-inner"><div><h2>Receba o resumo semanal Tech da Semana</h2><p>Peça pelo WhatsApp e receba as novidades de tecnologia.</p></div><a class="btn btn-primary" href="${wa('Olá iTpraTi, quero receber o resumo semanal Tech da Semana.')}" target="_blank" rel="noopener">Quero receber →</a></div></div>`);

  posts.forEach(p => {
    const url = `/blog/${p.slug}/`, c = CTA[p.cta] || CTA.geral, ext = /^https?:/.test(c[3]);
    const rel = [...posts.filter(x => x.slug !== p.slug && x.cat === p.cat), ...posts.filter(x => x.slug !== p.slug && x.cat !== p.cat)].slice(0, 3);
    const html = md(p.body), cut = html.indexOf('</p>') + 4;
    const share = `${abs(url)}`;
    layout({ path: url, type: 'article', image: '/img/' + p.image, lastmod: p.date, title: p.seo ? `${p.seo} | iTpraTi` : `${p.title} | iTpraTi Tech`, desc: p.desc, ld: [crumbLD([['Blog', '/blog/']], p.title, url), { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, datePublished: p.date, dateModified: p.date, inLanguage: 'pt-AO', image: [abs('/img/' + p.image)], mainEntityOfPage: abs(url), author: { '@type': 'Organization', name: 'Equipa iTpraTi' }, publisher: { '@type': 'Organization', name: C.siteName, logo: { '@type': 'ImageObject', url: abs('/img/logo-itprati.png') } } }] }, `
<section class="page-hero"><div class="container article">${crumbs([['Blog', '/blog/']], esc(p.cat))}<h1 style="font-size:clamp(30px,4vw,46px)">${esc(p.title)}</h1><p class="meta">${fmtDate(p.date)} · ${p.mins} min de leitura · Equipa iTpraTi</p></div></section>
<section><div class="container article">${slot(p.image, p.title, 'wide', 1200, 675, true)}<div class="prose" style="margin-top:26px">${html.slice(0, cut)}${ad('top')}${html.slice(cut)}</div>${ad('inline')}
<div class="cta-box"><h3>${c[0]}</h3><p>${c[1]}</p><a class="btn btn-primary" href="${c[3]}"${ext ? ' target="_blank" rel="noopener"' : ''}>${c[2]} →</a></div>
<div class="share"><strong>Partilhar:</strong><a href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + share)}" target="_blank" rel="noopener">WhatsApp</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(share)}" target="_blank" rel="noopener">Facebook</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(share)}" target="_blank" rel="noopener">LinkedIn</a></div>${ad('bottom')}</div></section>
<section class="alt"><div class="container"><div class="section-head"><h2>Continue a ler</h2></div><div class="blog-grid">${rel.map(card).join('')}</div></div></section>`);
  });
}

/* ============================ 7. SEO: sitemap, robots, feed, ads.txt ============================ */
function seoFiles() {
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${abs('/sitemap.xml')}\n`);
  write('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>iTpraTi Tech</title><link>${abs('/blog/')}</link><description>Notícias e guias de tecnologia em Angola.</description><language>pt-AO</language>\n${posts.map(p => `<item><title>${esc(p.title)}</title><link>${abs('/blog/' + p.slug + '/')}</link><guid>${abs('/blog/' + p.slug + '/')}</guid><pubDate>${new Date(p.date + 'T08:00:00Z').toUTCString()}</pubDate><description>${esc(p.desc)}</description></item>`).join('\n')}\n</channel></rss>\n`);
  if (C.adsense.client) write('ads.txt', `google.com, ${C.adsense.client.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);   // exigido pelo AdSense
}

/* ============================ 8. EXECUÇÃO + VERIFICAÇÃO DE LINKS ============================ */
fs.mkdirSync(path.join(R, 'blog'), { recursive: true });
fs.readdirSync(path.join(R, 'blog'), { withFileTypes: true }).forEach(d => { if (d.isDirectory()) fs.rmSync(path.join(R, 'blog', d.name), { recursive: true, force: true }); }); // limpa artigos antigos
home(); internet(); tv(); pacotes(); empresas(); cobertura(); institucional(); blog(); seoFiles();

let bad = 0;
const all = []; (function walk(d) { fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const f = path.join(d, e.name); if (e.isDirectory() && !['node_modules', '.git', 'content'].includes(e.name)) walk(f); else if (f.endsWith('.html')) all.push(f); }); })(R);
all.forEach(f => { const h = fs.readFileSync(f, 'utf8'); [...h.matchAll(/href="(\/[^"#?]*)/g)].forEach(m => { const u = m[1]; if (u.startsWith('/img/') || u.startsWith('/assets/') || u.endsWith('.xml')) return; const t = u.endsWith('/') ? u + 'index.html' : u; if (!fs.existsSync(path.join(R, t))) { console.warn('  ! link quebrado', u, 'em', path.relative(R, f)); bad++; } }); });
console.log(`✔ ${sitemap.length} páginas no sitemap (${posts.length} artigos) · plano mais barato: ${cheapestPlan.speed} Mbps por ${P} Kz · links quebrados: ${bad}`);
