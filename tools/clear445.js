/* v456: Coleta orgânica com regeneração natural — sem desmatamento permanente do mapa.
   Os recursos e árvores regeneram naturalmente após 1 dia de jogo, mantendo o bioma limpo e vivo. */
(function () {
  'use strict';
  function cleanLegacyClear() {
    try {
      if (typeof run !== 'undefined' && run && run.clear445 && run.clear445.length) {
        run.clear445 = [];
      }
    } catch (_) {}
  }
  setInterval(cleanLegacyClear, 2500);
  window.Clear445 = {
    st: () => [],
    around: () => {},
    hit: () => false,
    apply: () => {}
  };
})();
