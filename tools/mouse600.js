/* v600: mouse no padrão do Skyrim (PC) — a câmera gira só mexendo o mouse, com pointer lock durante o jogo.
   O lock é solto ao abrir menu/mapa/inventário/conversa/leitura, na tela de morte, no menu do jogo e com Esc;
   clicar na tela (ou apertar uma tecla) prende de novo. O botão direito fica só com a defesa (Guard472). */
(() => {
  'use strict';
  if (typeof touch !== 'undefined' && touch) return;
  const c = document.getElementById('c');
  if (!c || !c.requestPointerLock) return;
  window.MOUSE600 = true;
  const $ = id => document.getElementById(id);
  const vis = id => { const e = $(id); return !!e && !e.hidden && getComputedStyle(e).display !== 'none'; };

  const css = document.createElement('style');
  css.textContent = '#xh600{position:fixed;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:rgba(255,255,255,.75);box-shadow:0 0 3px #000;pointer-events:none;z-index:6;display:none}'
    + '#hint600{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:7;padding:6px 14px;border-radius:4px;background:rgba(10,14,18,.8);color:#e8e2d0;font:500 14px Jost,"Chakra Petch",sans-serif;pointer-events:none;display:none}';
  document.head.append(css);
  const xh = document.createElement('div'); xh.id = 'xh600'; document.body.append(xh);
  const hint = document.createElement('div'); hint.id = 'hint600'; hint.textContent = 'Clique na tela para controlar a câmera com o mouse'; document.body.append(hint);

  /* o jogo é jogável com o cursor preso? */
  function playing() {
    try {
      if (!started || paused || modalOpen || !player || player.dead) return false;
      if (!$('gameMenu95').hidden) return false;
      if (!$('dead').hidden) return false;
      if (window.Dream488 && Dream488.active) return false;
      if (window.Intro401 && (Intro401.conversation || (Intro401.reclaiming && Intro401.reclaiming()))) return false;
      if (vis('cons523') || vis('reader406') || vis('fav593')) return false;
      if (window.CINE231) return false;
      const sd = $('skyrim-dialog'); if (sd && sd.style.display && sd.style.display !== 'none') return false;
      return true;
    } catch (_) { return false; }
  }
  const locked = () => document.pointerLockElement === c;
  function tryLock() { if (!locked() && playing()) { try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (_) {} } }

  /* clique/tecla dentro do jogo prende o cursor (precisa de gesto do usuário) */
  addEventListener('pointerdown', e => { if (e.target === c && e.pointerType !== 'touch') tryLock(); }, true);
  addEventListener('keydown', e => { if (e.code !== 'Escape') tryLock(); }, true);

  /* solta quando a janela pede o cursor */
  setInterval(() => {
    const ok = playing();
    if (locked() && !ok) { try { document.exitPointerLock(); } catch (_) {} }
    xh.style.display = ok && locked() && !(window.FP550 && FP550.active) ? 'block' : 'none';
    hint.style.display = ok && !locked() ? 'block' : 'none';
  }, 120);

  /* giro da câmera + mira no centro da tela (o jogo mira pelo cursor; preso, o cursor é o centro) */
  addEventListener('mousemove', e => {
    if (!locked() || !playing()) return;
    if (typeof cameraLook373 === 'function') cameraLook373(e.movementX, e.movementY);
    try { mouseAim.x = innerWidth / 2; mouseAim.y = innerHeight / 2; mouseAim.ok = true; } catch (_) {}
  });
  /* no 1º quadro depois de prender, a mira também vai para o centro */
  document.addEventListener('pointerlockchange', () => { if (locked()) { try { mouseAim.x = innerWidth / 2; mouseAim.y = innerHeight / 2; mouseAim.ok = true; } catch (_) {} } });
  /* o botão do meio não faz nada */
  c.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
  c.addEventListener('auxclick', e => { if (e.button === 1) e.preventDefault(); });
  window.Mouse600 = { playing, locked, tryLock };
})();
