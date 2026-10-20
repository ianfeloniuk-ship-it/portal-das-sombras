/* ================= UTIL ================= */
const $=id=>document.getElementById(id);
const TAU=Math.PI*2,rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];
const touch=matchMedia('(hover:none)').matches||('ontouchstart' in window);
const fmt=n=>Math.floor(n).toLocaleString('pt-BR');
/* v485 (Ian: sem número quebrado): peso e distância sempre inteiros — abaixo de 10 kg em gramas, abaixo de 10 km em metros */
const wTxt=kg=>kg<10?Math.round(kg*1000)+' g':Math.round(kg)+' kg';
const distTxt=m=>m<10000?Math.round(m/10)*10+' m':Math.round(m/1000)+' km';
const fmtT=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makeNoise(seed){const R=mulberry32(seed),p=new Float32Array(1024);for(let i=0;i<1024;i++)p[i]=R();const h=(x,z)=>p[((Math.imul(x,374761393)^Math.imul(z,668265263))>>>0)&1023];
  return(x,z)=>{const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);const a=h(xi,zi),b=h(xi+1,zi),c=h(xi,zi+1),d=h(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}}
function wpick(arr){const t=arr.reduce((s,a)=>s+a.w,0);let r=Math.random()*t;for(const a of arr){if(r<a.w)return a;r-=a.w}return arr[arr.length-1]}
const hex=c=>'#'+c.toString(16).padStart(6,'0');

