/* v655 (Ian, 27/10/2026): «arruma os nomes por região e tipo, e não coloca tipo "Zahar, o mestre do deserto"» ·
   «tem gente que eu mato e simplesmente fica de pé» · «essa mecânica de vida que existe independente de você, como em Skyrim,
   quero copiar bem igual: as pessoas vivem sem mim».
   NOMES   Nomes655: nome e sobrenome pela região da cidade (Aster medieval, Solaria latina, Ymiria nórdica com -sson/-dottir,
           Zahar árabe com ibn/bint, Thalor portuguesa de porto, Urdan e Verden celta). Sem apelido nem título no nome;
           o que a pessoa faz aparece embaixo, como função (job523). Guardas: «Guarda Fulano»; capitão: «Capitão Sobrenome».
   POVO    Povo655: cada cidade tem moradores fixos (sempre os mesmos, pela semente da cidade), com nome, profissão da região,
           casa, amigo e se bebe na taverna. Eles seguem a rotina do relógio do jogo (tools/vida523.js) mesmo sem você:
           quando você chega, cada um já está onde a hora manda (trabalho, almoço, taverna, casa), não nasce na porta de casa.
           Quem morre continua morto (profile.povo655). Depois de 3 dias do jogo chega alguém novo para a casa vazia.
           Os outros comentam a morte e quem chegou (Dialogo520 usa Povo655.noticia).
   CONVERSA Moradores e guardas da mesma cidade param para conversar entre si (balões, só visíveis de perto, como no Skyrim):
           clima, trabalho, a morte de alguém, o que andam falando de você, fantasmas à noite, taverna. Quando você passa
           perto, às vezes falam com você sozinhos (saudação pela sua fama). */
(function (global) {
  'use strict';
  function hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const pickR = (R, a) => a[Math.floor(R() * a.length)];

  /* ---------- nomes ---------- */
  const REG = {
    aster: { m: ['Aldric', 'Bertram', 'Cedric', 'Edmund', 'Godwin', 'Hugo', 'Lambert', 'Osric', 'Roland', 'Walter', 'Gerold', 'Otto', 'Ivo', 'Leofric', 'Anselm', 'Baldwin'],
      f: ['Adela', 'Brígida', 'Elsbeth', 'Gisela', 'Helena', 'Isolde', 'Matilde', 'Rowena', 'Edith', 'Maud', 'Flora', 'Petronela', 'Agnes', 'Wilma'],
      s: ['Ashford', 'Brandt', 'Fenwick', 'Holt', 'Hale', 'Marlow', 'Thorne', 'Weller', 'Crane', 'Dunmore', 'Garrow', 'Pell'] },
    solaria: { m: ['Aurelio', 'Cassio', 'Dario', 'Fausto', 'Marco', 'Octavio', 'Severo', 'Tullio', 'Valen', 'Emilio', 'Silvio', 'Renzo'],
      f: ['Aurelia', 'Bianca', 'Camila', 'Livia', 'Octavia', 'Serena', 'Valeria', 'Cynthia', 'Giulia', 'Flavia', 'Nerina'],
      s: ['Albani', 'Corvino', 'Ferraro', 'Galli', 'Morandi', 'Orsini', 'Valerio', 'Solari', 'Rinaldi', 'Cortesi'] },
    ymiria: { m: ['Bjorn', 'Einar', 'Gunnar', 'Halvard', 'Leif', 'Sigurd', 'Torben', 'Ulf', 'Ragnar', 'Vidar', 'Arne', 'Knut'],
      f: ['Astrid', 'Eira', 'Freya', 'Gudrun', 'Hilda', 'Ingrid', 'Sigrid', 'Solveig', 'Thyra', 'Runa', 'Liv'], pat: 'nordico' },
    zahar: { m: ['Farid', 'Hakim', 'Karim', 'Nadir', 'Rashid', 'Samir', 'Tariq', 'Yusuf', 'Zayd', 'Idris', 'Malik', 'Omar'],
      f: ['Amira', 'Farah', 'Layla', 'Nadia', 'Samira', 'Yasmin', 'Zahra', 'Leila', 'Rania', 'Soraya'], pat: 'arabe' },
    thalor: { m: ['Bento', 'Duarte', 'Gaspar', 'Inácio', 'Martim', 'Nuno', 'Rui', 'Tomé', 'Vasco', 'Afonso', 'Gonçalo'],
      f: ['Beatriz', 'Catarina', 'Inês', 'Leonor', 'Marina', 'Teresa', 'Violante', 'Isaura', 'Brites', 'Mécia'],
      s: ['Amaral', 'Barros', 'Correia', 'Moura', 'Salgado', 'Teixeira', 'Vieira', 'Pinheiro', 'Rocha', 'Sardinha'] },
    urdan_verden: { m: ['Bran', 'Cian', 'Dafydd', 'Emrys', 'Gwyn', 'Owain', 'Rhys', 'Sylas', 'Tiernan', 'Cadoc', 'Ifor'],
      f: ['Aine', 'Bronwen', 'Ceri', 'Eluned', 'Fiona', 'Gwen', 'Maeve', 'Niamh', 'Rhiannon', 'Tegan'],
      s: ['Ardwyn', 'Bevan', 'Carrow', 'Fenwyr', 'Llewellyn', 'Morgan', 'Pryce', 'Rowan', 'Glyn', 'Madoc'] }
  };
  const SEXO = {};
  for (const r of Object.values(REG)) { for (const n of r.m) SEXO[n] = 'm'; for (const n of r.f) SEXO[n] = 'f'; }
  const regiao = c => { try { return (global.Povo482 && Povo482.regionOf && Povo482.regionOf(c)) || 'aster'; } catch (_) { return 'aster'; } };
  function sobrenome(R, reg, sexo) {
    const D = REG[reg] || REG.aster;
    if (D.pat === 'nordico') { const p = pickR(R, D.m); return p + (sexo === 'f' ? 'sdottir' : 'sson'); }
    if (D.pat === 'arabe') return (sexo === 'f' ? 'bint ' : 'ibn ') + pickR(R, D.m);
    return pickR(R, D.s);
  }
  function emUso() { const s = new Set(); try { for (const n of npcs) if (!n.gone) { s.add(String(n.short || n.name || '').replace(/\s*\[.*\]$/, '')); } } catch (_) {} return s; }
  /* tipo: 'morador' | 'cacador' | 'guarda' | 'capitao' | 'crianca' */
  function nome(c, tipo, o) {
    o = o || {}; const reg = o.reg || regiao(c), D = REG[reg] || REG.aster, R = o.R || Math.random, usados = emUso();
    for (let k = 0; k < 30; k++) {
      const sexo = o.sexo || (R() < .5 ? 'f' : 'm'), pre = pickR(R, sexo === 'f' ? D.f : D.m);
      let nm = tipo === 'crianca' ? pre : tipo === 'guarda' ? 'Guarda ' + pre : tipo === 'capitao' ? (sexo === 'f' ? 'Capitã ' : 'Capitão ') + (D.pat ? pre : sobrenome(R, reg, sexo)) : pre + ' ' + sobrenome(R, reg, sexo);
      if (!usados.has(nm)) { SEXO[nm] = sexo; return nm; }
    }
    return pickR(R, D.m) + ' ' + Math.floor(R() * 90 + 10);
  }
  function sexo(nm) { nm = String(nm || '').replace(/^(Guarda|Capitão|Capitã)\s+/, ''); if (SEXO[nm]) return SEXO[nm]; return SEXO[nm.split(/[ ·]/)[0]] || null; }
  global.Nomes655 = { nome, sexo, regiao, REG };

  /* ---------- profissões por região (forma masculina / feminina) ---------- */
  const JOB = {
    comum: [['Padeiro', 'Padeira'], ['Carregador', 'Carregadora'], ['Tecelão', 'Tecelã'], ['Varredor da praça', 'Varredora da praça'], ['Ajudante do mercado', 'Ajudante do mercado'], ['Lavrador', 'Lavradora'], ['Taberneiro', 'Taberneira']],
    aster: [['Aprendiz de ferreiro', 'Aprendiz de ferreiro'], ['Carpinteiro', 'Carpinteira']],
    solaria: [['Vidreiro', 'Vidreira'], ['Ourives', 'Ourives']],
    ymiria: [['Mineiro', 'Mineira'], ['Curtidor de peles', 'Curtidora de peles']],
    zahar: [['Mercador de especiarias', 'Mercadora de especiarias'], ['Oleiro', 'Oleira']],
    thalor: [['Pescador', 'Pescadora'], ['Remendador de redes', 'Remendadora de redes']],
    urdan_verden: [['Herborista', 'Herborista'], ['Lenhador', 'Lenhadora']]
  };

  /* ---------- população fixa de cada cidade ---------- */
  const DIA = () => { try { return Math.floor(dayT / DAYLEN); } catch (_) { return 0; } };
  const chave = c => String((c && (c.id || c.name)) || '?');
  function estado(c) {
    if (typeof profile === 'undefined' || !profile) return { mortos: {}, ger: {} };
    const P = profile.povo655 = profile.povo655 || {}; const S = P[chave(c)] = P[chave(c)] || { mortos: {}, ger: {} };
    S.mortos = S.mortos || {}; S.ger = S.ger || {}; return S;
  }
  const cap = c => (typeof cityBig533 === 'function' && cityBig533(c) > 0) ? 14 : 3; /* mesmo tamanho de antes (vida523) */
  function residente(c, slot) {
    const S = estado(c), g = S.ger[slot] || 0, reg = regiao(c), R = rng(hash(chave(c) + '|' + slot + '|' + g));
    const sx = R() < .5 ? 'f' : 'm', jobs = JOB.comum.concat(JOB[reg] || []), j = pickR(R, jobs);
    const D = REG[reg] || REG.aster, pre = pickR(R, sx === 'f' ? D.f : D.m), nm = pre + ' ' + sobrenome(R, reg, sx);
    SEXO[nm] = sx;
    return { id: slot + '.' + g, slot, nome: nm, sexo: sx, job: j[sx === 'f' ? 1 : 0], seed: Math.floor(R() * 360), beber: R() < .4, amigo: (slot + 1) % cap(c), novo: g > 0 };
  }
  function residentes(c) {
    const S = estado(c), out = [];
    for (let i = 0; i < cap(c); i++) {
      let r = residente(c, i), m = S.mortos[r.id];
      /* casa vazia há 3 dias: chega alguém novo */
      if (m != null && DIA() - m >= 3) { S.ger[i] = (S.ger[i] || 0) + 1; S.chegou = { nome: residente(c, i).nome, dia: DIA() }; r = residente(c, i); m = S.mortos[r.id]; }
      if (m == null) out.push(r);
    }
    return out;
  }
  function proximo(c) {
    const vivos = new Set(); try { for (const n of npcs) if (!n.gone && n.res655 && n.home === c) vivos.add(n.res655); } catch (_) {}
    return residentes(c).find(r => !vivos.has(r.id)) || null;
  }
  function morreu(n) {
    if (!n || !n.res655 || !n.home) return; const S = estado(n.home);
    S.mortos[n.res655] = DIA(); S.ultimo = { nome: n.short || n.name, dia: DIA() };
    try { if (typeof store !== 'undefined' && store.set) store.set('pds2_profile', profile); } catch (_) {}
  }
  function noticia(c) {
    if (!c) return null; const S = estado(c), L = [];
    if (S.ultimo && DIA() - S.ultimo.dia <= 6) L.push('Ainda não acredito que ' + S.ultimo.nome + ' morreu. A casa ficou vazia.', 'Fizeram o enterro de ' + S.ultimo.nome + '. Pouca gente foi.');
    if (S.chegou && DIA() - S.chegou.dia <= 6) L.push('Tem gente nova na cidade: ' + S.chegou.nome + '. Ficou com a casa de quem morreu.');
    return L.length ? L[Math.floor(Math.random() * L.length)] : null;
  }

  /* ---------- conversas entre eles (vida própria) ---------- */
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const night = () => typeof isNight === 'function' && isNight();
  const wx = () => { try { return WX.type; } catch (_) { return 'clear'; } };
  const fala = (n, l) => { try { if (typeof speech153 === 'function') speech153(n, l, ''); } catch (_) {} };
  const pre = n => String(n.short || n.name || '').replace(/^(Guarda|Capitão|Capitã)\s+/, '').split(' ')[0];
  function fama() { try { return (typeof profile !== 'undefined' && profile && profile.fama523) || {}; } catch (_) { return {}; } }
  function roteiro(a, b) {
    const S = estado(a.home), F = fama(), op = [];
    op.push([['Bom dia, ' + pre(b) + '.', 'Bom dia. Dormiu bem?', 'Mal. Os cachorros latiram a noite inteira.']]);
    if (a.job523) op.push([['Como vai o trabalho?', 'Cansativo. Mas paga o pão.', 'Melhor que caçar fera lá fora.'], ['Viu o preço do sal?', 'Um roubo. Daqui a pouco nem sopa a gente faz.']]);
    if (wx() === 'rain') op.push([['Essa chuva não para.', 'Bom para a plantação.', 'Ruim para os meus ossos.']]);
    if (wx() === 'snow') op.push([['Que frio, pelos deuses.', 'Lá em Ymiria é pior, dizem.', 'Não quero nem saber.']]);
    if (night()) op.push([['Você viu a luz azul perto da muralha?', 'Vi. Era um morto, tenho certeza.', 'Não fale disso de noite.'], ['Uma caneca antes de dormir?', 'Só uma. Amanhã cedo tem serviço.']]);
    if (S.ultimo && DIA() - S.ultimo.dia <= 6) op.push([['Soube de ' + S.ultimo.nome + '?', 'Soube. Que descanse em paz.', 'Quem faria uma coisa dessas?']]);
    if (S.chegou && DIA() - S.chegou.dia <= 6) op.push([['Já falou com ' + S.chegou.nome + '?', 'Ainda não. Parece gente boa.']]);
    if (F.maldade >= 2) op.push([['Aquele viajante passou por aqui de novo.', 'O de mau gênio? Fique longe dele.']]);
    else if (F.bondade >= 2) op.push([['Sabe o viajante que dá esmola?', 'Sei. Pelo menos alguém faz alguma coisa.']]);
    try { const k = (global.Crime545 && Crime545.bounty && Crime545.bounty(a.home)) || 0; if (k > 0) op.push([['Os guardas estão atrás de alguém.', 'Ouvi. Matou gente aqui dentro.', 'Tranque a porta hoje.']]); } catch (_) {}
    op.push([['Dizem que abriu outra Fenda perto da estrada.', 'De novo? A Ordem não dá conta.'], ['Minha filha quer ser caçadora.', 'Deixa. Na idade dela eu também queria.']]);
    const o = op[Math.floor(Math.random() * op.length)]; return o[Math.floor(Math.random() * o.length)];
  }
  const livre = n => n && !n.gone && !n.dead545 && !n.hostile545 && !n.knock545 && n.kind !== 'deco' && n.vida523 && n.role523 !== 'ladrao' && !n.chat655 && !(n.brigaT523 > performance.now()) && !n.chase523;
  function conversar(a, b) {
    const L = roteiro(a, b), t0 = performance.now(), dur = L.length * 3400 + 1500;
    a.chat655 = { o: b, until: t0 + dur }; b.chat655 = { o: a, until: t0 + dur };
    for (const n of [a, b]) { n.path = []; n.tx = n.x; n.tz = n.z; n.wait = dur / 1000; }
    L.forEach((l, i) => setTimeout(() => { const n = i % 2 ? b : a; if (n.gone || n.dead545 || n.hostile545) return; fala(n, l);
      try { if (n.m && n.m.povo482) { const C = n.m.civ486; if (C) { C.n = i === 0 ? 'greet_01' : Math.random() < .3 ? 'laugh_01' : 'standing_relax'; C.t = 2.5; } } } catch (_) {} }, 400 + i * 3400));
  }
  let lastGreet = 0;
  function tick() {
    try {
      if (typeof L === 'undefined' || !L || L.mode !== 'world' || typeof player === 'undefined' || !player || typeof npcs === 'undefined') return;
      const now = performance.now();
      const vida = npcs.filter(n => n.vida523 && !n.gone);
      for (const n of vida) if (n.chat655) {
        const o = n.chat655.o;
        if (now > n.chat655.until || !o || o.gone || o.dead545 || o.hostile545 || n.hostile545) { n.chat655 = null; n.cd655 = now + 40000 + Math.random() * 40000; n.wait = 0; continue; }
        n.face = Math.atan2(o.x - n.x, o.z - n.z);
      }
      /* novas conversas: dois livres da mesma cidade a até 9 m (acontece perto ou longe de você) */
      const L0 = vida.filter(n => livre(n) && !(n.cd655 > now));
      for (let i = 0; i < L0.length; i++) for (let j = i + 1; j < L0.length; j++) {
        const a = L0[i], b = L0[j]; if (a.home !== b.home || dist(a, b) > 9 || a.chat655 || b.chat655) continue;
        if (Math.random() < .35) { const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, d = dist(a, b) || 1, ux = (b.x - a.x) / d, uz = (b.z - a.z) / d;
          a.tx = mx - ux * .8; a.tz = mz - uz * .8; b.tx = mx + ux * .8; b.tz = mz + uz * .8; a.wait = b.wait = 0;
          a.cd655 = b.cd655 = now + 3000; setTimeout(() => { if (livre(a) && livre(b) && dist(a, b) < 4) conversar(a, b); }, 2600); }
        else { a.cd655 = now + 15000; }
      }
      /* falam com você quando você passa perto (como no Skyrim) */
      if (now - lastGreet > 9000 && !document.body.classList.contains('dlg520')) {
        const n = vida.find(x => livre(x) && dist(x, player) < 4.5 && !(x.greet655 > now));
        if (n) { lastGreet = now; n.greet655 = now + 60000; const F = fama(); let l;
          try { if (global.Crime545 && Crime545.bounty && Crime545.bounty(n.home) > 0) l = 'Fique longe de mim. Eu sei o que você fez.'; } catch (_) {}
          if (!l) l = F.maldade >= 2 ? 'Hm. Você de novo.' : F.bondade >= 2 ? 'É você que ajuda os pobres? Que os deuses te paguem.' : night() ? 'Tarde da noite para andar por aí.' : wx() === 'rain' ? 'Que tempo, hein?' : ['Bom dia.', 'Olá, viajante.', 'Precisa de alguma coisa?', 'Cuidado lá fora.'][Math.floor(Math.random() * 4)];
          n.face = Math.atan2(player.x - n.x, player.z - n.z); fala(n, l); }
      }
    } catch (e) { console.warn('Povo655', e); }
  }
  setInterval(tick, 1500);
  global.Povo655 = { residentes, proximo, morreu, noticia, estado, conversar, cap };
})(typeof window !== 'undefined' ? window : globalThis);
