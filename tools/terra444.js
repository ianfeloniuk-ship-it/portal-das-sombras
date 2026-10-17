/* v456: Terraplenagem desativada — o relevo natural (terrain245.js / terrH) e os arredores
   de Aster e das 5 Capitais permanecem 100% protegidos e com visual natural intacto. */
(function () {
  'use strict';
  if (window.TER245 && TER245.TFN) TER245.TFN.value = 0;
  function cleanLegacyTerra() {
    try {
      if (typeof run !== 'undefined' && run) {
        if (run.terra444 && run.terra444.length) run.terra444 = [];
        if (run.surv437 && run.surv437.leveled && run.surv437.leveled.length) run.surv437.leveled = [];
      }
      if (window.TER245 && TER245.TFN) TER245.TFN.value = 0;
      const oldBtn = document.getElementById('bTerra444');
      if (oldBtn) oldBtn.remove();
      const oldHud = document.getElementById('terra444hud');
      if (oldHud) oldHud.remove();
    } catch (_) {}
  }
  setInterval(cleanLegacyTerra, 2000);
  window.Terra444 = {
    st: () => [],
    add: () => false,
    undo: () => false,
    sync: () => { if (window.TER245 && TER245.TFN) TER245.TFN.value = 0; },
    toggle: () => false,
    open: () => false,
    active: () => false
  };
})();
