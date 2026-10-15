/* Regression tests for item identity, asynchronous loading and DOM hydration. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/item-art405.js','utf8');
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
let checked=0;
function eq(a,b){checked++;assert.equal(a,b);}
function yes(a){checked++;assert.ok(a);}
class Element {
 constructor(tag='SPAN'){this.tagName=tag;this.nodeType=1;this.dataset={};this.attrs={};this.children=[];this.listeners={};this._html='';this.complete=false;this.naturalWidth=512;this.writes=0;}
 get innerHTML(){return this._html;}
 set innerHTML(s){this.writes++;this._html=s;this.children=[];const m=s.match(/<img\b[^>]*src="([^"]*)"/);if(m){const img=new Element('IMG');img.attrs.src=decode(m[1]);this.children.push(img);}}
 setAttribute(k,v){this.attrs[k]=String(v);}
 getAttribute(k){return this.attrs[k]??null;}
 matches(s){return s==='[data-item-art405]'&&Object.hasOwn(this.dataset,'itemArt405');}
 querySelectorAll(s){return this.children.flatMap(n=>[...(n.matches(s)?[n]:[]),...n.querySelectorAll(s)]);}
 querySelector(s){if(s==='img')return this.children.find(n=>n.tagName==='IMG')||null;return this.querySelectorAll(s)[0]||null;}
 addEventListener(event,fn,opt){(this.listeners[event]||=[]).push({fn,once:opt?.once});}
 emit(event){const handlers=this.listeners[event]||[];this.listeners[event]=handlers.filter(h=>!h.once);handlers.forEach(h=>h.fn());}
}
const item=(kind='sword',tier=0,rar=0)=>({slot:'w',kind155:kind,tier,rar});
const entries=[
 {key:'sword:0:0',kind:'sword',tier:0,rar:0,material:'ferro',scope:'item',src:'assets/equipment405/sword-0-0.webp'},
 {key:'sword:1:3',kind:'sword',tier:1,rar:3,material:'aco',scope:'item',src:'assets/equipment405/sword-1-3.webp'},
 {key:'a:2:1',kind:'a',tier:2,rar:1,material:'mithril',scope:'item',src:'assets/equipment405/a-2-1.webp'},
 {key:'class:8',kind:'staff',classId:8,scope:'class',src:'assets/equipment405/class-8.webp'}
];
function fixture({status=200,data={schemaVersion:1,entries},defer=false}={}){
 const body=new Element('BODY');
 const document={body,documentElement:body,querySelectorAll:s=>body.querySelectorAll(s)};
 let callback,observations,release;
 class Observer{constructor(fn){callback=fn;}observe(target,opts){observations={target,opts};}}
 const response={ok:status===200,status,json:()=>Promise.resolve(data)};
 const waiting=new Promise(r=>{release=()=>r(response);});
 const context={document,MutationObserver:Observer,fetch:()=>defer?waiting:Promise.resolve(response),console};
 context.window=context;
 vm.runInNewContext(source,context,{filename:'item-art405.js'});
 return {api:context.ItemArt405,body,observer:records=>callback(records),get observations(){return observations;},release};
}
function elementFrom(html){
 const e=new Element();
 for(const [a,key] of [['art','itemArt405'],['tier','itemTier405'],['rar','itemRar405'],['status','itemStatus405'],['request','itemRequest405']]){
  const m=html.match(new RegExp('data-item-'+a+'405="([^"]*)"'));if(m)e.dataset[key]=decode(m[1]);
 }
 const start=html.indexOf('>')+1;e.innerHTML=html.slice(start,html.lastIndexOf('</span>'));return e;
}
(async()=>{
 const f=fixture({defer:true}),A=f.api;
 eq(A.resolve(item()).status,'loading');
 const waiting=elementFrom(A.markup(item()));f.body.children.push(waiting);
 f.release();await A.ready;
 eq(waiting.dataset.itemStatus405,'exact');yes(waiting.querySelector('img'));
 eq(A.resolve(item()).status,'exact');
 eq(A.resolve(item('sword',1,3)).src,'assets/equipment405/sword-1-3.webp');
 eq(A.resolve(item('sword',0,3)).status,'missing');
 eq(A.resolve(item('axe')).status,'missing');
 eq(A.resolve({slot:'w'}).kind,'');
 eq(A.resolve({slot:'w',visual:{shape:'sword'},tier:0,rar:0}).status,'exact');
 for(const bad of [undefined,null,-1,10,'0',NaN,1.5])eq(A.resolve({...item(),tier:bad}).status,'missing');
 for(const bad of [undefined,null,-1,8,'0',NaN,1.5])eq(A.resolve({...item(),rar:bad}).status,'missing');
 eq(A.resolve({...item('sword',1,3),material:'Aço'}).status,'exact');
 eq(A.resolve({...item(),material:'celestial'}).status,'missing');
 eq(A.resolve({...item(),material:'unknown'}).status,'missing');
 for(const field of ['set153','unique183','custom']){
  const request={...item(),[field]:'special'};
  eq(A.resolve(request).status,'missing');
  const e=elementFrom(A.markup(request));e.innerHTML='<img src="wrong.webp">';
  A.hydrate(e);eq(e.dataset.itemStatus405,'missing');eq(e.querySelector('img'),null);
 }
 eq(A.resolve(item('staff'),{classId:8}).status,'missing');
 eq(A.resolve(item('sword',7,7),{classId:8}).status,'missing');
 eq(A.resolve(null,{scope:'class',kind:'staff',classId:8}).status,'reference');
 eq(A.resolve(null,{scope:'class',kind:'staff',classId:8}).src,'assets/equipment405/class-8.webp');
 eq(A.resolve(null,{scope:'class',kind:'sword',classId:8}).src,'assets/equipment405/sword-0-0.webp');
 eq(A.resolve(null,{scope:'class',kind:'tome',classId:8}).status,'missing');
 const classEl=elementFrom(A.weaponMarkup('staff',{classId:8,large:true}));A.hydrate(classEl);
 eq(classEl.dataset.itemStatus405,'reference');yes(classEl.querySelector('img'));
 const itemEl=elementFrom(A.weaponMarkup('staff',{classId:8,item:item('staff')}));A.hydrate(itemEl);
 eq(itemEl.dataset.itemStatus405,'missing');eq(itemEl.querySelector('img'),null);
 const legacy=new Element();legacy.dataset.itemArt405='sword';legacy.dataset.itemTier405='';legacy.dataset.itemRar405='';
 A.hydrate(legacy);eq(legacy.dataset.itemStatus405,'missing');
 const escaped=elementFrom(A.markup({...item(),name:'<img onerror="bad"> & sword'}));
 eq(JSON.parse(escaped.dataset.itemRequest405).item.name,'<img onerror="bad"> & sword');
 A.hydrate(escaped);yes(!escaped.innerHTML.includes('onerror'));
 const normal=elementFrom(A.markup(item()));A.hydrate(normal);
 const img=normal.querySelector('img'),writes=normal.writes;
 eq(img.listeners.error.length,1);A.hydrate(normal);
 eq(normal.querySelector('img'),img);eq(normal.writes,writes);eq(img.listeners.error.length,1);
 img.emit('error');eq(normal.dataset.itemStatus405,'missing');eq(normal.querySelector('img'),null);
 A.hydrate(normal);eq(normal.querySelector('img'),null);eq(normal.dataset.itemStatus405,'missing');
 normal.dataset.itemRequest405=JSON.stringify({item:item('sword',1,3),opt:{}});
 A.hydrate(normal);yes(normal.querySelector('img'));eq(normal.dataset.itemStatus405,'exact');
 const fresh=elementFrom(A.markup(item()));f.observer([{addedNodes:[fresh]}]);eq(fresh.querySelector('img').listeners.error.length,1);
 f.observer([{addedNodes:[fresh.querySelector('img')]}]);eq(fresh.querySelector('img').listeners.error.length,1);
 const cachedError=elementFrom(A.markup(item()));cachedError.querySelector('img').complete=true;cachedError.querySelector('img').naturalWidth=0;
 A.hydrate(cachedError);eq(cachedError.dataset.itemStatus405,'missing');eq(cachedError.querySelector('img'),null);
 eq(f.observations.opts.attributes,undefined);
 const unavailable=fixture({status:404});await unavailable.api.ready;
 eq(unavailable.api.resolve(item()).status,'missing');eq(unavailable.api.resolve(item()).reason,'Catálogo indisponível');
 const invalid=fixture({data:{entries}});await invalid.api.ready;eq(invalid.api.resolve(item()).status,'missing');
 const unsafe=fixture({data:{schemaVersion:1,entries:[{...entries[0],src:'https://drive.google.com/private.png'}]}});await unsafe.api.ready;
 eq(unsafe.api.resolve(item()).status,'missing');
 console.log('item-art405: '+checked+' assertions passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
