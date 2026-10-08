/* v324: catálogo sempre acessível, descoberta clicável e ficha por criatura. */
(()=>{
const css=document.createElement('style');css.textContent=`
#dexSearch324{display:block;width:100%;box-sizing:border-box;padding:9px 10px;margin:6px 0 10px;border:1px solid #80623c;border-radius:5px;background:#100c18;color:var(--txt,#f4ead8);font:inherit}
.dex324-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.dex324-card{min-height:85px;text-align:left;white-space:normal;padding:10px}
.dex324-card small{display:block;margin-top:6px;color:var(--dim)}
.dex324-portrait{display:block;width:100%;height:220px;object-fit:contain;background:radial-gradient(ellipse,#3b2949,#100c18);border:1px solid #80623c;border-radius:8px;margin:10px 0}
body:has(#modal:not([hidden])) #ach294{display:none!important}
#ach294 button{text-align:left;font:inherit;cursor:pointer;max-height:170px;overflow:hidden}
#ach294 button:focus-visible{outline:3px solid #fff;outline-offset:3px}
`;document.head.appendChild(css);
const keys=()=>Object.keys(KINDS).filter(k=>!KINDS[k].alias308);
const bosses=()=>window.Variants308?.bossNames||[];
const count=k=>k.startsWith('boss:')?(profile.bossSeen308?.[k.slice(5)]?.kills||0):(profile.bestiary?.[k]||0);
const name=k=>k.startsWith('boss:')?k.slice(5):KINDS[k]?.n||'';
let filter='',query='',previewRenderer;
const pictures=new Map();
function catalog(){view=catalog;const all=[...keys(),...bosses().map(n=>'boss:'+n)],found=all.filter(k=>count(k)>0);let h='<div class="guide93"><strong>'+found.length+' / '+all.length+' criaturas descobertas</strong><p>Derrote uma criatura para registrá-la. Abra sua ficha para ver o monstro, os abates e o conhecimento desbloqueado.</p><p><b>Dica de combate.</b> Conspiração: Monstros que não perfuram sua defesa se unem e atacam todos juntos. Só os golpes que acertam somam: esquive, saia do alcance ou reduza o grupo para menos de dois.</p></div><label for="dexSearch324">Buscar criatura descoberta</label><input id="dexSearch324" type="search" placeholder="Nome do monstro" value="'+gearText(query)+'"><div class="tabs">'+[['','Todas'],['known','Descobertas'],['boss','Chefes']].map(([k,n])=>btn(n,'dexfilter324',k,true,filter===k?'on':'')).join('')+'</div><div class="dex324-grid">';
for(const k of all){const n=count(k),boss=k.startsWith('boss:');if(filter==='known'&&!n||filter==='boss'&&!boss||query&&(!n||!name(k).toLocaleLowerCase().includes(query.toLocaleLowerCase())))continue;const no=String(all.indexOf(k)+1).padStart(3,'0');h+='<button class="btn dex324-card" data-a="dexentry324" data-v="'+gearText(k)+'" '+(!n?'disabled':'')+'><small>#'+no+(boss?' · Chefe':'')+'</small><b>'+(n?safeText(name(k)):'???')+'</b><small>'+(n?n+' abate'+(n===1?'':'s')+' · Ver ficha':'Ainda não descoberto')+'</small></button>'}
h+='</div>';openModal('BESTIÁRIO / GRIMÓRIO',h);$('dexSearch324').addEventListener('input',e=>{query=e.target.value;const pos=e.target.selectionStart;catalog();const input=$('dexSearch324');input.focus();input.setSelectionRange?.(pos,pos)});
}
function portrait(k){
if(pictures.has(k))return pictures.get(k);
let K=KINDS[k];if(k.startsWith('boss:')){const B=ALLBOSS().find(b=>b.n===name(k));if(!B)return '';const type=(B.types||[B.type])[0];K={...B,gk:{seismic:'Knight',fury:'Barbarian',soulrain:'Skeleton_Mage',legion:'Skeleton_Warrior'}[type],gtint:B.body,wep:type==='soulrain'?'staff':type==='fury'?'axe':'sword',scale:B.scale||2.2,eye:0xff2020};}
if(!K)return '';
const m=makeChibi({...K,tint:K.gtint,atkClip:K.clip});
if(K.variant&&window.Variants308?.dress)Variants308.dress({m,kind:k,x:0,z:0,biome124:K.bio||'campos',name:K.n});
const scene324=new THREE.Scene();scene324.add(new THREE.HemisphereLight(0xffffff,0x57436b,1.5));const light=new THREE.DirectionalLight(0xffffff,1.4);light.position.set(3,5,5);scene324.add(light);scene324.add(m.root);
m.root.rotation.y=.35;m.root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(m.root),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const radius=Math.max(size.x,size.y,size.z,.5)*.55;const camera=new THREE.PerspectiveCamera(38,2,0.01,Math.max(100,radius*30));camera.position.set(center.x,center.y+radius*.12,center.z+radius/Math.tan(19*Math.PI/180)*1.2);camera.lookAt(center);
previewRenderer=previewRenderer||new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});previewRenderer.setSize(560,280);previewRenderer.setPixelRatio(1);previewRenderer.render(scene324,camera);const src=previewRenderer.domElement.toDataURL('image/png');scene324.remove(m.root);m.mixer?.stopAllAction();m.mixer?.uncacheRoot(m.model||m.root);if(pictures.size>=32)pictures.delete(pictures.keys().next().value);pictures.set(k,src);return src;
}
function open(k){if(!k)return catalog();if(!count(k)||!name(k))return catalog();view=()=>open(k);const n=count(k),boss=k.startsWith('boss:'),all=[...keys(),...bosses().map(n=>'boss:'+n)],idx=all.indexOf(k);let h=btn('← Todas as criaturas','bestv',0)+'<div class="guide93"><strong>#'+String(idx+1).padStart(3,'0')+' · '+safeText(name(k))+'</strong><p>'+n+' abate'+(n===1?'':'s')+(boss?' · Chefe':'')+'</p></div><div id="dexPortrait324" aria-live="polite"></div>';
if(boss){const lore=Variants308.BOSSLORE[name(k)];['Descrição','Alimentação','Comportamento'].forEach((label,i)=>{h+=row(label,lore?.[i]||'Ainda não registrado.','')})}else{const lvl=bestLvl(k),next=BEST_STEPS.find(s=>n<s[0]);h+=row('Domínio da espécie',lvl?lvl[2]+' · +'+Math.round(lvl[1]*100)+'% de dano contra esta espécie.':'Primeiro contato · sem bônus de dano.',next?Math.max(0,next[0]-n)+' abates para '+next[2]:'Máximo');h+='<div class="sec">CONHECIMENTO</div><div class="sysline">'+Bestiary294.loreHtml(k,n)+'</div><div class="sec">COMBATE</div><div class="sysline">'+bestStats293(k)+bestInfo(k,n)+'</div>'}
openModal('FICHA · '+name(k),h);try{const src=portrait(k);if(src){const img=document.createElement('img');img.className='dex324-portrait';img.alt='Modelo de '+name(k);img.src=src;$('dexPortrait324').replaceChildren(img)}else $('dexPortrait324').textContent='Modelo indisponível.'}catch(e){$('dexPortrait324').textContent='Não foi possível exibir o modelo agora.';console.error('Bestiário: prévia',e)}
}
const previous=extraActions;extraActions=function(a,v){if(a==='dexentry324'){open(v);return 'close0'}if(a==='dexfilter324'){filter=v;catalog();return 'close0'}return previous(a,v)};
bestView=catalog;window.Bestiary324={open,catalog};
})();
