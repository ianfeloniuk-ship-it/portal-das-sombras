/* ================= PERFIL ================= */
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let profile=store.get('pds2_profile');
function pickAwaken(ci){return {journey92:true,creationPending91:true,progress80:1,rankSchema:78,rank:0,cls:ci,deaths:0,best:1,seed:(Math.random()*2**31)|0}}
function rollAwaken(){
  let r=Math.random()*100,ri=0;for(;ri<TOPR;ri++){if(r<RANKS[ri].p)break;r-=RANKS[ri].p}
  const tw=CLASSES.reduce((a,c)=>a+c.w,0);let c=Math.random()*tw,ci=0;for(;ci<CLASSES.length-1;ci++){if(c<CLASSES[ci].w)break;c-=CLASSES[ci].w}
  return {progress80:1,rankSchema:78,rank:ri,cls:ci,deaths:0,best:1,seed:(Math.random()*2**31)|0};
}

