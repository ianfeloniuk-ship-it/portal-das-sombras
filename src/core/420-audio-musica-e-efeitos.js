/* ================= ÁUDIO: MÚSICA E EFEITOS ================= */
window.CFG=Object.assign({vol:1,btn:1,moveLimit:false,moveCap:100},store.get('pds_cfg')||{});
CFG.music=CFG.music??CFG.vol;CFG.effects=CFG.effects??CFG.vol;CFG.cues=CFG.cues??CFG.effects;CFG.historyCollapsed95=CFG.historyCollapsed95??touch;
normalizeReadySounds();
const AU={ctx:null,on:true,track:null,want:'city',step:0,next:0,bar:0,lastBoom:0};
try{AU.on=localStorage.getItem('pds_sound')!=='0'}catch(e){}
function audioInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  try{const C=new(window.AudioContext||window.webkitAudioContext)();AU.ctx=C;
    const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(C.destination);
    AU.master=C.createGain();AU.master.gain.value=AU.on?1:0;AU.master.connect(comp);
    AU.mus=C.createGain();AU.mus.gain.value=.24*CFG.music;AU.mus.connect(AU.master);
    AU.fx=C.createGain();AU.fx.gain.value=.75*CFG.effects;AU.fx.connect(AU.master);
    AU.cues=C.createGain();AU.cues.gain.value=.75*CFG.cues;AU.cues.connect(AU.master);
    const len=Math.floor(C.sampleRate*2.4),ir=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
    const cv=C.createConvolver();cv.buffer=ir;AU.rev=C.createGain();AU.rev.gain.value=.3;AU.rev.connect(cv);cv.connect(AU.fx);const mc=C.createConvolver();mc.buffer=ir;AU.musRev=C.createGain();AU.musRev.gain.value=.3;AU.musRev.connect(mc);mc.connect(AU.mus);
    const nb=C.createBuffer(1,C.sampleRate,C.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;AU.noise=nb;
    AU.next=C.currentTime+.15;setInterval(musicTick,40);
  }catch(e){AU.ctx=null}
}
const anow=()=>AU.ctx.currentTime;
function envl(g,t,a,peak,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function tone(f,t,d,o={}){const C=AU.ctx,osc=C.createOscillator(),g=C.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(f,t);if(o.slide)osc.frequency.exponentialRampToValueAtTime(Math.max(20,o.slide),t+d);
  let n=osc;if(o.filt){const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.filt;osc.connect(fl);n=fl}n.connect(g);envl(g,t,o.a||.005,o.v??.2,d);g.connect(o.dest||AU.fx);
  if(o.rev){const s=C.createGain();s.gain.value=o.rev;g.connect(s);s.connect(o.dest===AU.mus?AU.musRev:AU.rev)}osc.start(t);osc.stop(t+(o.a||.005)+d+.05)}
function noiz(t,d,o={}){const C=AU.ctx,s=C.createBufferSource();s.buffer=AU.noise;const fl=C.createBiquadFilter();fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(o.f||1000,t);if(o.sweep)fl.frequency.exponentialRampToValueAtTime(o.sweep,t+d);fl.Q.value=o.q||1;
  const g=C.createGain();s.connect(fl);fl.connect(g);envl(g,t,o.a||.002,o.v??.3,d);g.connect(o.dest||AU.fx);if(o.rev){const r=C.createGain();r.gain.value=o.rev;g.connect(r);r.connect(o.dest===AU.mus?AU.musRev:AU.rev)}s.start(t,Math.random()*.5);s.stop(t+(o.a||.002)+d+.05)}
const SFX={
  swing(){const t=anow();noiz(t,.12,{v:.16,type:'highpass',f:2500,sweep:6500})},
  hit(c){const t=anow();noiz(t,.07,{v:.32,f:c?2600:1400,q:1.5});tone(c?230:140,t,.13,{v:.32,slide:50})},
  block(){const t=anow();tone(900,t,.16,{type:'square',v:.07,filt:2200});tone(1350,t,.12,{type:'square',v:.05,filt:2200})},
  hurt(){const t=anow();tone(210,t,.25,{type:'sawtooth',v:.14,slide:70,filt:900});noiz(t,.1,{v:.18,f:600})},
  ding(){const t=anow();tone(1318,t,.45,{v:.06,rev:.6});tone(1976,t+.06,.55,{v:.045,rev:.6})},
  levelup357(){const t=anow();[523,659,784,1046,1568].forEach((f,i)=>tone(f,t+i*.11,i===4?.65:.28,{type:'triangle',v:i===4?.20:.17,rev:.3}));tone(262,t,.48,{type:'sine',v:.1})},
  level(){const t=anow();[523,659,784,1046,1318].forEach((f,i)=>tone(f,t+i*.07,.5,{type:'triangle',v:.09,rev:.5}))},
  coin(){const t=anow();tone(1760,t,.07,{type:'triangle',v:.07});tone(2637,t+.05,.14,{type:'triangle',v:.06})},
  portal(){const t=anow();tone(110,t,1.1,{type:'sawtooth',v:.1,slide:880,filt:1400,rev:.5});noiz(t,1,{v:.14,f:300,sweep:4000,rev:.4})},
  boom(){const t=anow();noiz(t,.5,{v:.4,type:'lowpass',f:600,sweep:80});tone(90,t,.5,{v:.35,slide:35})},
  mine(){const t=anow();tone(2200+Math.random()*600,t,.14,{type:'triangle',v:.08,rev:.35});noiz(t,.05,{v:.14,type:'highpass',f:5000})},
  skill(){const t=anow();tone(330,t,.35,{type:'sawtooth',v:.07,slide:990,filt:2500,rev:.4})},
  dodge(){const t=anow();noiz(t,.18,{v:.11,f:800,sweep:2600})},
  arise(){const t=anow();[55,82.5,110].forEach(f=>tone(f,t,2,{type:'sawtooth',v:.1,filt:700,rev:.8}));tone(440,t+.3,1.6,{v:.05,rev:.9,slide:220})},
  laser(){const t=anow();tone(1800,t,.35,{type:'sawtooth',v:.08,slide:200,filt:3000,rev:.3});noiz(t,.3,{v:.2,f:3000,sweep:500})},
  gong(){const t=anow();[98,147,196,293].forEach((f,i)=>tone(f,t,3,{type:'sine',v:.12/(i+1),rev:.9}))}
};
function sfx(n,a){if(AU.ctx&&AU.on)try{SFX[n](a)}catch(e){}}
function beep(f,d,v=.04,type='sine'){if(!AU.ctx||!AU.on)return;try{tone(f,anow(),d,{type,v:v*1.4,rev:.2})}catch(e){}}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const TRACKS={
  city:{bpm:84,prog:[[62,65,69],[58,62,65],[65,69,72],[60,64,67]],bass:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],arp:[0,2,1,2],arpEvery:4,arpOct:12,padV:.045,bell:true},
  world:{bpm:92,prog:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],bass:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],arp:[0,1,2,1],arpEvery:2,arpOct:12,drums:{h:[0,0,1,0]},padV:.04},
  dungeon:{bpm:100,prog:[[52,55,59],[48,52,55],[45,48,52],[47,51,54]],bass:[1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0],arp:[0,2,1,2,0,1],arpEvery:4,arpOct:24,drums:{k:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],h:[0,0,1,0]},padV:.045,dark:true},
  boss:{bpm:140,prog:[[50,53,57],[46,50,53],[48,52,55],[45,49,52]],bass:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],arp:[0,1,2,1,2,1],arpEvery:2,arpOct:24,drums:{k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[1,1,1,1]},padV:.035,lead:true},
  temple:{bpm:58,prog:[[50,57,62],[53,57,60],[48,55,60],[52,55,59]],bass:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],arp:[2,1,0],arpEvery:8,arpOct:24,padV:.065,bell:true,choir:true}};
function wantTrack(){if(!started||!player)return'city';if(L.special)return L.special.kind==='temple'?'temple':'boss';if(L.mode==='dungeon')return bossE&&bossE.aggro&&!bossE.dead?'boss':'dungeon';return inCity(player.x,player.z)?'city':'world'}
function musicTick(){
  const C=AU.ctx;if(!C||C.state!=='running')return;
  if(AU.next<C.currentTime)AU.next=C.currentTime+.05;
  while(AU.next<C.currentTime+.15){
    const st=AU.step%16;if(st===0){AU.bar++;if(AU.track!==AU.want){AU.track=AU.want;AU.bar=0}}
    const T=TRACKS[AU.track||'city'];if(AU.on)try{playStep(T,T.prog[AU.bar%T.prog.length],st,AU.next)}catch(e){}
    AU.next+=60/T.bpm/4;AU.step++;
  }
}
function playStep(T,ch,st,t){
  const beat=60/T.bpm;
  if(st===0)for(const n of ch){const f=NOTE(n);tone(f,t,beat*4,{type:T.choir?'sine':'triangle',v:T.padV,a:beat*.8,dest:AU.mus,rev:.5});tone(f*1.006,t,beat*4,{v:T.padV*.7,a:beat*.8,dest:AU.mus,rev:.5})}
  if(T.bass[st])tone(NOTE(ch[0]-24),t,beat*(T.bpm>120?.4:.9),{type:T.dark?'sawtooth':'triangle',v:.15,filt:T.dark?500:800,dest:AU.mus});
  if(st%T.arpEvery===0){const i=(st/T.arpEvery)%T.arp.length;tone(NOTE(ch[T.arp[i]]+T.arpOct),t,T.bell?beat*1.5:beat*.4,{type:T.lead?'square':T.bell?'sine':'triangle',v:T.lead?.03:.045,filt:T.lead?2400:0,dest:AU.mus,rev:.35})}
  const D=T.drums;if(D){if(D.k&&D.k[st])tone(150,t,.25,{v:.32,slide:45,dest:AU.mus});if(D.s&&D.s[st])noiz(t,.15,{v:.18,f:1800,q:.8,dest:AU.mus});if(D.h&&D.h[st%D.h.length])noiz(t,.04,{v:.05,type:'highpass',f:7000,dest:AU.mus})}
}
function setSound(on){AU.on=on;try{localStorage.setItem('pds_sound',on?'1':'0')}catch(e){}if(AU.master)AU.master.gain.value=on?1:0;$('bSnd').textContent=on?'SOM':'MUDO'}

