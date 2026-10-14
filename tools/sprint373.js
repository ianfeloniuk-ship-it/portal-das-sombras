/* Walking, held sprint and exhaustion. No gameplay globals: reusable in tests. */
(function(g){'use strict';const API={walkFactor:.65,runFactor:1.35,drain:16,minStart:5};
API.canSprint=function(state,resource,held,allowed){if(!held)state.exhausted=false;if(resource.vigor<=0)state.exhausted=true;return !!(held&&allowed&&!state.exhausted&&resource.vigor>=(state.running?0.001:API.minStart))};
API.spend=function(state,resource,dt,moved,wait){if(!state.running||!moved||dt<=0)return;resource.vigor=Math.max(0,resource.vigor-API.drain*dt);resource.vigorWait=Math.max(resource.vigorWait||0,wait);if(resource.vigor<=0){state.exhausted=true;state.running=false}};
g.Sprint373=API;})(typeof window==='undefined'?globalThis:window);
