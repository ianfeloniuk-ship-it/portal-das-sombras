/* v378 (Ian): correr NÃO gasta Estamina. Walking and held sprint. No gameplay globals: reusable in tests. */
(function(g){'use strict';const API={walkFactor:.65,runFactor:1.35,drain:0,minStart:5};
API.canSprint=function(state,resource,held,allowed){state.exhausted=false;return !!(held&&allowed)};
API.spend=function(){};
g.Sprint373=API;})(typeof window==='undefined'?globalThis:window);
