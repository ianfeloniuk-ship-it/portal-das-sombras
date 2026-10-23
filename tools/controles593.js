/* v593: controles no estilo Skyrim — Favoritos (Q), Esperar (T), salvar/carregar rápido (F5/F9).
   As teclas vêm de KEYACT/keyOf (tela de Controles); o resto do layout está em src/core/630-controles.js. */
(() => {
  'use strict';
  const ok = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && !player.dead;
  const busy = () => (typeof modalOpen !== 'undefined' && modalOpen) || (typeof paused !== 'undefined' && paused);
  const key = a => { try { return keyOf(a); } catch (_) { return ''; } };
  const lab = a => { try { return keyLabel(key(a)); } catch (_) { return ''; } };
  const say = (t, ms) => { try { toast(t, ms || 2200); } catch (_) {} };

  /* ---------- Favoritos (Q) ---------- */
  let box = null;
  function close() { if (box) { box.remove(); box = null; } }
  function entries() {
    const out = [];
    const sks = ['sk0', 'sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6'];
    (player.skills || []).forEach((sk, i) => { if (sk && !sk.empty && sks[i]) out.push([lab(sks[i]), sk.n, () => useSkill(sk)]); });
    try { (window.Lote541 ? Lote541.list() : []).forEach((it, i) => { if (it) out.push([lab('lote' + i), 'Trocar para ' + (typeof gearText === 'function' ? gearText(it.name) : it.name), () => Lote541.select(i)]); }); } catch (_) {}
    out.push([lab('pot'), 'Poção de vida (' + (run?.pots || 0) + ')', () => usePot()]);
    (run?.stolen || []).slice(0, 3).forEach((s, i) => { if (s) out.push([lab('absorbed' + i), 'Poder absorvido: ' + (s.n || s.name || ''), () => useSkill(s)]); });
    if (run?.fused) out.push([lab('fusion'), 'Poder fundido', () => useSkill(run.fused)]);
    return out;
  }
  function open() {
    close();
    box = document.createElement('div');
    box.id = 'fav593';
    box.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9996;min-width:300px;max-width:420px;max-height:70vh;overflow:auto;background:rgba(10,14,18,.94);border:1px solid rgba(255,255,255,.22);border-radius:6px;padding:14px 16px;color:#e8e2d0;font:500 15px Jost,"Chakra Petch",sans-serif;box-shadow:0 8px 40px #000';
    const h = document.createElement('div');
    h.textContent = 'FAVORITOS';
    h.style.cssText = 'letter-spacing:4px;font-size:13px;opacity:.8;margin-bottom:8px;text-align:center';
    box.append(h);
    for (const [k, n, fn] of entries()) {
      const b = document.createElement('button');
      b.type = 'button';
      b.style.cssText = 'display:flex;gap:12px;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.08);color:inherit;font:inherit;padding:7px 4px;cursor:pointer';
      b.innerHTML = '<b style="min-width:42px;color:#ffd070">' + k + '</b><span></span>';
      b.lastChild.textContent = n;
      b.onclick = () => { close(); try { fn(); } catch (e) { console.warn('fav593', e); } };
      box.append(b);
    }
    const f = document.createElement('div');
    f.textContent = lab('fav') + ' ou Esc para fechar';
    f.style.cssText = 'margin-top:8px;font-size:12px;opacity:.6;text-align:center';
    box.append(f);
    document.body.append(box);
  }

  /* ---------- Esperar (T) ---------- */
  function waitHour() {
    if (typeof enemies !== 'undefined' && enemies.some(e => !e.dead && Math.hypot(e.x - player.x, e.z - player.z) < 45)) { say('Você não pode esperar com inimigos por perto.'); return; }
    if (typeof dayT === 'undefined' || typeof DAYLEN === 'undefined') return;
    dayT += DAYLEN / 24;
    try { player.hp = Math.min(player.maxHp || player.hp, player.hp + (player.maxHp || 0) * .04); } catch (_) {}
    say('<b>[TEMPO]</b> Você esperou 1 hora.');
  }

  /* ---------- salvar / carregar rápido ---------- */
  function quickSave() {
    if (!ok()) return;
    try { saveRun(); store.set('pds3_quick593', { run: store.get('pds3_run'), profile: store.get('pds2_profile') }); say('<b>[SAVE]</b> Salvo rápido.'); } catch (e) { say('Não foi possível salvar.'); }
  }
  function quickLoad() {
    const q = store.get('pds3_quick593');
    if (!q || !q.run) { say('Nenhum salvamento rápido ainda. Use ' + lab('qsave') + ' para criar um.'); return; }
    window._wipe = true;
    store.set('pds3_run', q.run); if (q.profile) store.set('pds2_profile', q.profile);
    say('<b>[SAVE]</b> Carregando o salvamento rápido…', 1500);
    setTimeout(() => location.reload(), 400);
  }

  addEventListener('keydown', e => {
    if (e.repeat) return;
    const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.code === 'Escape' && box) { close(); return; }
    if (!ok()) return;
    if (e.code === key('qsave')) { e.preventDefault(); quickSave(); return; }
    if (e.code === key('qload')) { e.preventDefault(); quickLoad(); return; }
    if (busy() && !box) return;
    if (e.code === key('fav')) { e.preventDefault(); box ? close() : open(); return; }
    if (box) { close(); return; }
    if (e.code === key('wait')) { e.preventDefault(); waitHour(); }
  });
  window.Controles593 = { open, close, waitHour, quickSave, quickLoad };
})();
