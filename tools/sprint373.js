/* v378 (Ian): correr NÃO gasta Estamina. Walking and held sprint. No gameplay globals: reusable in tests. */
(function(g){'use strict';const API={walkFactor:1.85/4.2,normalFactor:1.0,runFactor:7.5/4.2,sprintFactor:7.5/4.2/* v670 (Ian): correr 7,5 m/s para fugir de lobo (5,4) e raptor (5,2); antes 5,8 */,drain:0,minStart:5};
API.canSprint=function(state,resource,held,allowed){state.exhausted=false;return !!(held&&allowed)};
API.spend=function(){};
g.Sprint373=API;})(typeof window==='undefined'?globalThis:window);
