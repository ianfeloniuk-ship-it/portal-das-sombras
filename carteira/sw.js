// Service worker só da Carteira (escopo /carteira/). Sempre tenta a rede primeiro;
// o cache serve apenas para abrir o app sem internet. Chamadas à API nunca são guardadas.
const V='carteira-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon.svg'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('carteira-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==location.origin){e.respondWith(fetch(r));return}
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
