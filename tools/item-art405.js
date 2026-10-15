/* Primeva official artwork. Matching never falls back across item identity. */
(()=>{
'use strict';
const host=typeof window==='undefined'?globalThis:window;
const doc=typeof document==='undefined'?null:document;
const selector='[data-item-art405]',mounted=new WeakMap();
const slots=new Set(['h','a','g','b']);
const weapons=new Set(['sword','dagger','axe','staff','bow','wand','tome','bonestaff','spear','firearm','mace','hammer','orb','none']);
const materials=['ferro','aco','mithril','runas','dragao','vazio','abismo','celestial','transcendente','primeva'];
const names={h:'Elmo',a:'Peitoral',g:'Braçais',b:'Grevas',sword:'Espada',dagger:'Adagas',axe:'Machado',staff:'Cajado',bow:'Arco',wand:'Maça Sacra',tome:'Tomo',bonestaff:'Cajado de osso',spear:'Lança',firearm:'Arma de fogo',none:'Punhos'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const valid=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max;
const byKey=new Map(),byClass=new Map();
let catalog=null,failed=false;
function kindOf(item,opt){
 const slot=item.slot??opt.slot;
 if(slot&&slot!=='w')return slots.has(slot)?slot:'';
 const k=item.kind155||item.visual?.shape||item.visualWeapon?.shape||opt.kind||'';
 return weapons.has(k)?k:'';
}
function special(item){return !!(item.set153||item.unique183||item.custom||item.identity==='special')}
function ingest(value){
 if(value?.schemaVersion!==1||!Array.isArray(value.entries))throw new Error('Invalid equipment catalog');
 byKey.clear();byClass.clear();
 for(const entry of value.entries){
  if(!entry||!/^assets\/equipment405\/[a-z0-9-]+\.webp$/.test(entry.src||''))continue;
  if(entry.scope==='class'){
   if(Number.isInteger(entry.classId)&&weapons.has(entry.kind))byClass.set(entry.classId,entry);
  }else if(entry.scope==='item'&&(slots.has(entry.kind)||weapons.has(entry.kind))&&valid(entry.tier,9)&&valid(entry.rar,7)
    &&entry.material===materials[entry.tier]&&entry.key===entry.kind+':'+entry.tier+':'+entry.rar){
   byKey.set(entry.key,entry);
  }
 }
 catalog=value;
}
function resolve(item,opt){
 item=item&&typeof item==='object'?item:{};
 opt=opt&&typeof opt==='object'?opt:{};
 const kind=kindOf(item,opt),tier=item.tier??opt.tier,rar=item.rar??opt.rar;
 const supplied=item.material??item.materialName??opt.material,material=supplied==null?'':norm(supplied);
 const base={status:'missing',src:null,source:null,kind,tier,rar,material,label:item.name||opt.name||names[kind]||'Equipamento',reason:''};
 if(!kind)return {...base,reason:'Tipo de equipamento ausente'};
 if(special(item))return {...base,reason:'Peça especial sem arte correspondente'};
 if(!catalog)return {...base,status:failed?'missing':'loading',reason:failed?'Catálogo indisponível':'Carregando catálogo'};
 if(opt.scope==='class'){
  const own=byClass.get(opt.classId),entry=own?.kind===kind?own:byKey.get(kind+':0:0');
  if(!entry)return {...base,reason:kind==='none'?'Combate sem arma':'Referência de classe indisponível'};
  return {...base,status:'reference',src:entry.src,source:entry.source||null,tier:null,rar:null,material:entry.material||'',reason:entry.scope==='class'?'Referência oficial da classe':'Referência do tipo de arma'};
 }
 if(!valid(tier,9)||!valid(rar,7))return {...base,reason:'Ranque e raridade ausentes ou inválidos'};
 if(supplied!=null&&material!==materials[tier])return {...base,reason:'Material incompatível com o ranque'};
 const entry=byKey.get(kind+':'+tier+':'+rar);
 if(!entry)return {...base,reason:'Arte oficial desta combinação indisponível'};
 return {...base,status:'exact',src:entry.src,source:entry.source||null,material:entry.material,reason:'Arte oficial deste equipamento'};
}
function requestOf(item={},opt={}){
 // Copy only identity fields. Inventory stats, socket data and the player's save
 // are not serialized into DOM attributes.
 const clean={};
 for(const key of ['slot','kind155','tier','rar','material','materialName','name','set153','unique183','custom','identity'])
  if(item?.[key]!=null)clean[key]=item[key];
 if(!clean.kind155&&(item?.visual?.shape||item?.visualWeapon?.shape))clean.kind155=item.visual?.shape||item.visualWeapon.shape;
 const options={};
 for(const key of ['scope','classId','kind','slot','tier','rar','material','name'])if(opt[key]!=null)options[key]=opt[key];
 return {item:clean,opt:options};
}
function missing(result){
 const text=result.status==='loading'?'Carregando…':result.kind==='none'?'Punhos':'Imagem indisponível';
 return '<span class="item-art405-missing" style="font-size:11px;line-height:1.25;text-align:center;opacity:.7;padding:6px">'+esc(text)+'</span>';
}
function imageMarkup(result){return '<img alt="" loading="lazy" decoding="async" src="'+esc(result.src)+'">'}
function markup(item={},opt={}){
 const request=requestOf(item,opt),r=resolve(request.item,request.opt);
 const accessible=r.label+(r.status==='reference'?' · referência':r.status==='missing'?' · imagem indisponível':'');
 return '<span class="item-art405'+(opt.large?' large':'')+'" data-item-art405="'+esc(r.kind)+'" data-item-tier405="'+esc(r.tier??'')+'" data-item-rar405="'+esc(r.rar??'')+'" data-item-status405="'+r.status+'" data-item-request405="'+esc(JSON.stringify(request))+'" role="img" aria-label="'+esc(accessible)+'" title="'+esc(r.reason)+'">'+(r.src?imageMarkup(r):missing(r))+'</span>';
}
function weaponMarkup(kind,opt={}){
 if(opt.item)return markup(opt.item,{...opt,scope:'item'});
 const item={slot:'w',kind155:kind,tier:opt.tier,rar:opt.rar,name:opt.name};
 return markup(item,{...opt,kind,scope:opt.tier==null&&opt.rar==null?'class':'item'});
}
function paint(el){
 const serialized=el.dataset.itemRequest405;
 let request;
 try{request=JSON.parse(serialized||'{}')}catch(_){request={};}
 // Legacy/incomplete wrappers must not acquire F/common defaults.
 const r=resolve(request.item,request.opt);
 const signature=(serialized||'')+'|'+r.status+'|'+(r.src||'');
 const previous=mounted.get(el);
 if(previous?.signature===signature)return;
 const state={signature};mounted.set(el,state);
 el.dataset.itemStatus405=r.status;
 el.setAttribute('aria-label',r.label+(r.status==='reference'?' · referência':r.status==='missing'?' · imagem indisponível':''));
 el.setAttribute('title',r.reason);
 if(!r.src){if(el.innerHTML!==missing(r))el.innerHTML=missing(r);return;}
 let img=el.querySelector('img');
 if(!img||img.getAttribute('src')!==r.src){el.innerHTML=imageMarkup(r);img=el.querySelector('img');}
 if(!img)return;
 const onError=()=>{
  if(mounted.get(el)!==state)return;
  el.dataset.itemStatus405='missing';
  el.setAttribute('aria-label',r.label+' · imagem indisponível');
  el.setAttribute('title','Imagem indisponível');
  el.innerHTML=missing({...r,status:'missing'});
 };
 img.addEventListener('error',onError,{once:true});
 if(img.complete&&img.naturalWidth===0)onError();
}
function hydrate(root=doc){
 if(!root)return;
 if(root.matches?.(selector))paint(root);
 for(const el of root.querySelectorAll?.(selector)||[])paint(el);
}
function observe(){
 const target=doc?.body||doc?.documentElement;
 if(!target||typeof MutationObserver==='undefined')return;
 new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)
   if(node.nodeType===1&&(node.matches?.(selector)||node.querySelector?.(selector)))hydrate(node);
 }).observe(target,{childList:true,subtree:true});
}
if(doc){if(doc.body||doc.documentElement)observe();else doc.addEventListener('DOMContentLoaded',observe,{once:true});}
const ready=(typeof fetch==='function'?fetch('tools/equipment-art405.json?v=405').then(response=>{
 if(!response.ok)throw new Error('Equipment catalog unavailable');return response.json();
}).then(ingest):Promise.reject(new Error('Fetch unavailable'))).catch(()=>{failed=true;catalog=null;}).then(()=>{
 hydrate(doc);return catalog;
});
host.ItemArt405={markup,weaponMarkup,hydrate,resolve,ready,
 modelData:(kind,tier=0,rar=0)=>resolve({slot:slots.has(kind)?kind:'w',kind155:kind,tier,rar}).src};
})();
