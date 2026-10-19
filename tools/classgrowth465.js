/* v465 (Ian, 19/10/2026): "não ganha mais ponto por nível, já que agora ganha ponto por treino, e não ganha aqueles nove
   pontos iniciais… mas tu ganha coisas ao subir de nível, dependendo da tua classe; quando for escolher a classe, um painel
   que explique o que a classe ganha (os magos ganham mais mana e menos vida que um guerreiro)."
   - Painel "AO SUBIR DE NÍVEL" com a tabela de crescimento da classe (RpgBalance.growthFor, a mesma do PDF Grimório de
     Atributos v281): vida, mana, ataque físico e mágico base + por nível, comparado ao Guerreiro. Aparece na escolha de
     classe (vocação do Kael e lista do título) e na janela de Status.
   - Recompensas que davam "ponto de atributo para distribuir" viram ponto de treino direto num atributo (gift).
   - Saves antigos: pontos livres que sobraram são repartidos sozinhos entre os 9 atributos, uma vez. */
(function () {
  'use strict';
  const KEYS = ['for', 'des', 'agi', 'per', 'int', 'vit', 'res', 'esp', 'von'];
  const NAME = { for: 'Força', des: 'Destreza', agi: 'Agilidade', per: 'Percepção', int: 'Inteligência', vit: 'Vitalidade', res: 'Resistência', esp: 'Espírito', von: 'Vontade' };
  const num = x => (Math.round(x * 10) / 10).toString().replace('.', ',');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function growth(ci) { try { return RpgBalance.growthFor(ci); } catch (_) { return null; } }
  function compare(g, w) {
    const parts = [], diff = (key, label) => {
      const a = g[key].perLevel, b = w[key].perLevel, r = b > 0 ? a / b : 1;
      if (r >= 1.15) parts.push({ more: true, t: (r >= 2.5 ? 'muito mais ' : 'mais ') + label });
      else if (r <= .85) parts.push({ more: false, t: (r <= .4 ? 'bem menos ' : 'menos ') + label });
    };
    diff('hp', 'vida'); diff('mp', 'mana'); diff('physical', 'ataque físico'); diff('magic', 'ataque mágico');
    const m = parts.filter(p => p.more).map(p => p.t), l = parts.filter(p => !p.more).map(p => p.t), j = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a.slice(-1) : a[0];
    if (g.id === w.id) return 'O Guerreiro é a base de comparação: muita vida e ataque físico, quase nada de mana e magia.';
    if (!m.length && !l.length) return 'Cresce parecido com o Guerreiro.';
    return 'Comparado ao Guerreiro: ' + [m.length ? j(m) : '', l.length ? j(l) : ''].filter(Boolean).join('; ') + ' a cada nível.';
  }
  /* painel para a escolha de classe e para o Status */
  function panel(ci, opts = {}) {
    const g = growth(ci); if (!g) return '';
    const w = growth(0), c = (typeof CLASSES !== 'undefined' && CLASSES[ci]) || { n: '' }, L50 = k => num(g[k].base + g[k].perLevel * 50);
    const cell = (lbl, k) => '<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid rgba(231,189,108,.18)"><span>' + lbl + '</span><b>' + num(g[k].base) + ' <span style="color:#7ef5a5">+' + num(g[k].perLevel) + '/nível</span></b></div>';
    return '<div class="g465" style="margin:8px 0;padding:8px 10px;border:1px solid rgba(231,189,108,.35);border-radius:8px;background:rgba(0,0,0,.18);font-size:12.5px;line-height:1.4;text-align:left">' +
      '<strong style="display:block;letter-spacing:.06em;color:#e7bd6c;font-size:11.5px">AO SUBIR DE NÍVEL' + (opts.name ? ' · ' + esc(c.n).toUpperCase() : '') + '</strong>' +
      cell('Vida', 'hp') + cell('Mana', 'mp') + cell('Ataque físico', 'physical') + cell('Ataque mágico', 'magic') +
      '<div style="margin-top:5px">' + esc(compare(g, w)) + ' No nível 50: <b>' + L50('hp') + '</b> de vida e <b>' + L50('mp') + '</b> de mana (sem contar atributos e equipamento).</div>' +
      '<div style="margin-top:4px;opacity:.85">Cada nível também dá <b>1 ponto de habilidade</b>. Os <b>atributos não sobem com o nível</b>: sobem treinando (Força com golpes corpo a corpo, Inteligência com magia, Vitalidade gastando e recuperando vida…).</div></div>';
  }

  /* ponto de treino direto (recompensas que antes davam ponto para distribuir) */
  function gift(k, n, why) {
    if (!run || !run.stats || !KEYS.includes(k) || !(n > 0)) return;
    run.stats[k] = Math.max(0, Math.floor(+run.stats[k] || 0)) + n;
    const t = run.train462 || (run.train462 = { c: {}, l: {}, g: {} }); t.g = t.g || {}; t.g[k] = (+t.g[k] || 0) + n;
    try { refreshStats(); } catch (_) {}
    try { floater(player.x, player.z, '+' + n + ' ' + NAME[k].toUpperCase(), '#ffd76a', true, 3); } catch (_) {}
    if (why) toast('<b>[TREINO]</b> ' + why + ' <b>+' + n + ' de ' + NAME[k] + '</b>.', 5500);
    try { saveRun(); } catch (_) {}
  }

  /* saves antigos: pontos livres viram atributo, uma vez (do menor para o maior) */
  function migrate() {
    if (typeof run === 'undefined' || !run || !run.stats || run.noFreePts465) return;
    if (typeof profile !== 'undefined' && profile && profile.creationPending91) return;
    let p = Math.max(0, Math.floor(+run.pts || 0)); run.noFreePts465 = true;
    if (!p) { run.pts = 0; return; }
    const n = p;
    while (p > 0) { const k = KEYS.slice().sort((a, b) => (+run.stats[a] || 0) - (+run.stats[b] || 0))[0]; run.stats[k] = (+run.stats[k] || 0) + 1; p--; }
    run.pts = 0;
    try { refreshStats(); saveRun(); } catch (_) {}
    setTimeout(() => { try { showSys('Atributos agora só sobem <b>treinando</b>: não existe mais ponto para distribuir. Os seus <b>' + n + ' pontos livres</b> foram repartidos entre os 9 atributos (os mais baixos primeiro).'); } catch (_) {} }, 2500);
  }
  setInterval(() => { try { if (typeof started !== 'undefined' && started) migrate(); } catch (_) {} }, 1500);

  /* Status: painel de crescimento da classe abaixo do resumo */
  if (typeof statusView === 'function') {
    const sv0 = statusView;
    statusView = function () {
      const r = sv0.apply(this, arguments);
      try {
        const mb = document.getElementById('mb');
        if (mb && !mb.querySelector('.g465') && typeof profile !== 'undefined' && profile && !profile.classless) {
          const anchor = mb.querySelector('.a462-surv') || mb.querySelector('.c405-points') || mb.querySelector('.guide93');
          if (anchor) anchor.insertAdjacentHTML('afterend', panel(profile.cls, { name: true }));
        }
      } catch (e) { console.warn('classgrowth465', e); }
      return r;
    };
  }

  window.Growth465 = { panel, gift, compare, migrate };
})();
