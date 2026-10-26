/* =====================================================================
   site.config.js — TODAS as definições editáveis do site iTpraTi.
   Altere aqui e execute:  node build.js   (ver README.md)
   ===================================================================== */
module.exports = {
  siteUrl: 'https://www.itprati.ao',   // domínio oficial (sem barra no fim)
  siteName: 'iTpraTi',

  // ---- Contactos ----------------------------------------------------
  whatsapp: '244935020324',            // só dígitos, com indicativo
  whatsappLabel: '+244 935 020 324',   // como aparece escrito no site
  email: 'comercial@itprati.ao',
  clientAreaUrl: '',                   // URL do portal de cliente. Vazio = botão "Área de cliente" escondido

  // ---- Google Analytics 4 -------------------------------------------
  // ATENÇÃO: no index.html antigo o script carregava G-VD2PLGSRPQ mas o
  // gtag('config') usava G-XXXXXXXXXX (erro: não registava visitas). Confirme o ID certo no GA4.
  analyticsId: 'G-VD2PLGSRPQ',
  requireConsent: true,                // true = GA/AdSense só carregam depois de o visitante aceitar cookies

  // ---- Google AdSense (só aparece no BLOG) --------------------------
  // Preencha 'client' (ex.: 'ca-pub-1234567890123456') e os 'slots' (IDs das unidades de anúncio).
  // Com 'client' vazio, nenhum anúncio nem script é incluído.
  adsense: { client: '', slots: { top: '', inline: '', bottom: '' } },

  // ---- Redes sociais ------------------------------------------------
  social: {
    instagram: 'https://www.instagram.com/itprati.angola/',
    facebook: 'https://www.facebook.com/itprati',
    linkedin: 'https://ao.linkedin.com/company/itprati'
  },

  // ---- Imagem de partilha (Facebook, WhatsApp, Google) ---------------
  ogImage: '/img/og-cover.jpg',        // 1200x630

  // ---- TV Online ----------------------------------------------------
  tv: { price: 7777, box: 77777, trialDays: 3, channels: 400,
        channelsUrl: 'https://tv.itprati.ao/tvprationline.html' }, // lista de canais (migrar para /tv/canais/ quando existir)

  // ---- Planos de Internet (preço em Kz/mês) --------------------------
  // O "plano mais barato" é calculado automaticamente a partir desta lista
  // e usado nas descrições SEO, para nunca ficar desatualizado.
  plans: [
    { speed: 6,   profile: 'Pessoal',      price: 33333,  desc: 'Para navegação, mensagens e tarefas essenciais.' },
    { speed: 10,  profile: 'Residencial',  price: 44444,  desc: 'Para o dia a dia conectado em casa.' },
    { speed: 25,  profile: 'Familiar',     price: 88888,  desc: 'Para partilhar momentos, estudos e entretenimento.', featured: true },
    { speed: 50,  profile: 'Profissional', price: 133333, desc: 'Para produtividade, reuniões e trabalho online.' },
    { speed: 100, profile: 'Empresarial',  price: 177777, desc: 'Para equipas e operações que exigem mais.' },
    { speed: 200, profile: 'Corporativo',  price: 333333, desc: 'Para utilização intensiva e múltiplos dispositivos.' }
  ],

  // ---- Zonas com cobertura confirmada (opcional) ---------------------
  // Ex.: ['Luanda — Talatona', 'Luanda — Kilamba', 'Benguela — Lobito']. Vazio = a lista não aparece.
  coverageZones: [],

  // ---- Meta keywords (o Google ignora, mas outros motores/ferramentas leem) ----
  keywords: 'internet ilimitada Angola, provedor de internet Luanda, IPTV Angola, TV online Angola, televisão por aplicação, internet + TV Angola, net barata Angola, Box Android TV, cobertura nacional internet, parceria com DSTV, parceria com ZAP, parceria com TVCabo, iTpraTi'
};
