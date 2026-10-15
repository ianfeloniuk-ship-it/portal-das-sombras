const fs=require('fs'),vm=require('vm'),assert=require('assert'),{loadThree}=require('./test-three405.cjs');
async function main(){const T=await loadThree();
const src=fs.readFileSync(__dirname+'/exhibit-fx405.js','utf8');
function run(skill,until){
 const scene=new T.Scene(),mat=new T.MeshBasicMaterial({transparent:false,opacity:1,depthWrite:true});
 const heroRoot=new T.Group(),heroModel=new T.Group();heroModel.add(new T.Mesh(new T.BoxGeometry(1,1,1),mat));heroRoot.add(heroModel);
 const hero={root:heroRoot,model:heroModel,mats:[mat],mixer:{stopAllAction(){},setTime(){}}},target={root:new T.Group(),model:new T.Group(),mixer:{stopAllAction(){}}};
 let adds=0,now=0,addTimes=[],pulses=[];const fx={size:0,add(o){adds++;addTimes.push(now);this.size++;},update(){},clear(){this.size=0;},dispose(){this.size=0;},play(){},dust(){},flames(){},streak(){},shockwave(){}};
 const ctx={THREE:T,window:null,scene,camera:new T.PerspectiveCamera(),hero,targets:[target],ci:4,VFX302:{createPreview:()=>fx},VFX328:{createPreview:()=>({})},Exhibit405:{animate(){}},MAGIC_CLS:[4],Warrior127:{staffMuzzle:()=>null},projModel:()=>new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial()),makeSpiritWolf:()=>({root:new T.Group()}),makeStoneColossus:()=>({root:new T.Group()}),makeChibi:()=>({root:new T.Group()}),toon:()=>mat,pulseFx156:o=>pulses.push(o),fallFx:()=>{},THREE:T,Math,Object,console};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);const e=ctx.ExhibitEffects405.create({scene,camera:ctx.camera,hero,targets:[target],ci:4});
 for(let t=0;t<=until;t+=1/60){now=t;e.sample(skill,t);}return {e,mat,hero,scene,adds,addTimes,pulses};
}
const near=(a,b)=>Math.abs(a-b)<=1/60+.002;
const pulse=run({n:'Chuva de Flechas',t:'kit111',effect:'pulses',pulses:3,delay:.1,radius:4,col:1},3.8);assert.strictEqual(pulse.pulses.length,3);assert.strictEqual(pulse.pulses[1].r,4);assert(pulse.e.duration>=3.8);
const move=run({n:'move',effect:'move',range:5,back:true},1);assert(move.hero.root.position.x< -2.8);
const stealth=run({n:'stealth',effect:'stealth',duration:3},3.8);assert.strictEqual(stealth.mat.transparent,false);assert.strictEqual(stealth.mat.opacity,1);
const archer=run({n:'Disparo',t:'kit111',effect:'bolt',sourceClass:4,col:1},1.2);assert.strictEqual(archer.adds,3);assert(near(archer.addTimes[1]-archer.addTimes[0],.11));assert(near(archer.addTimes[2]-archer.addTimes[1],.11));
const fan=run({n:'Leque',t:'kit111',effect:'fan',sourceClass:4,col:1},.5);assert.strictEqual(fan.adds,3);
const long=run({n:'Chuva de Flechas',t:'kit111',effect:'pulses',pulses:6,delay:.1,radius:4,col:1},6);assert(long.e.duration>=.25+.1+5*.65+.55+1.3,'six pulses must include final pulse tail');
const disposed=run({n:'Chuva de Flechas',t:'kit111',effect:'pulses',pulses:3,delay:.1,radius:4,col:1},.3);const before=disposed.pulses.length;disposed.e.dispose();disposed.e.sample({n:'Chuva de Flechas',t:'kit111',effect:'pulses',pulses:3,delay:.1,radius:4,col:1},1.5);assert.strictEqual(disposed.pulses.length,before,'dispose must prevent queued callbacks');
const toggle=run({n:'stealth',effect:'stealth',duration:3},.4);toggle.e.reset({n:'idle',effect:'heal'});assert.strictEqual(toggle.mat.transparent,false);assert.strictEqual(toggle.mat.opacity,1,'reset must restore stealth material immediately');
console.log('exhibit-effects405 runtime regressions: ok');
}
main().catch(e=>{console.error(e);process.exitCode=1});
