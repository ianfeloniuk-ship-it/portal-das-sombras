/* Local Web Audio synthesis: no samples, account, download or external service. */
(function(global){
 'use strict';
 function create(ctx,destination){
  const out=ctx.createGain(),bus=ctx.createGain(),pan=ctx.createStereoPanner?ctx.createStereoPanner():ctx.createGain();out.gain.value=0;bus.connect(pan);pan.connect(out);out.connect(destination||ctx.destination);
  const live=[],nodes=[out,bus,pan];let seed=131;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const noise=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate),samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=random()*2-1;
  const ir=ctx.createBuffer(2,ctx.sampleRate*1.8,ctx.sampleRate);for(let ch=0;ch<2;ch++){const s=ir.getChannelData(ch);for(let i=0;i<s.length;i++)s[i]=(random()*2-1)*Math.pow(1-i/s.length,3.5)*.42;}
  const reverb=ctx.createConvolver(),wet=ctx.createGain();reverb.buffer=ir;wet.gain.value=.22;reverb.connect(wet);wet.connect(bus);nodes.push(reverb,wet);
  function connect(n,gain,reverberant=true){const g=ctx.createGain();g.gain.value=gain;n.connect(g);g.connect(bus);if(reverberant)g.connect(reverb);nodes.push(g);return g;}
  function oscillator(f,type,gain){const o=ctx.createOscillator();o.type=type;o.frequency.value=f;const g=connect(o,gain);o.start();live.push(o);return {o,g};}
  const bass=oscillator(43,'sine',.095),body=oscillator(65.1,'sine',.045),upper=oscillator(129.3,'triangle',.012);
  const wind=ctx.createBufferSource(),filter=ctx.createBiquadFilter();wind.buffer=noise;wind.loop=true;filter.type='bandpass';filter.frequency.value=480;filter.Q.value=.75;wind.connect(filter);const windGain=connect(filter,.17);wind.start();live.push(wind);nodes.push(filter);
  const air=ctx.createBufferSource(),airFilter=ctx.createBiquadFilter();air.buffer=noise;air.loop=true;air.playbackRate.value=.73;airFilter.type='bandpass';airFilter.frequency.value=1700;airFilter.Q.value=1.2;air.connect(airFilter);const airGain=connect(airFilter,.025);air.start();live.push(air);nodes.push(airFilter);
  let disposed=false;
  function update(time,amount=0,position=0){if(disposed)return;const now=ctx.currentTime,level=Math.max(0,Math.min(1,amount));out.gain.setTargetAtTime(level*.72,now,.14);if(pan.pan)pan.pan.setTargetAtTime(Math.max(-.8,Math.min(.8,position)),now,.15);
   filter.frequency.setTargetAtTime(370+180*(.5+.5*Math.sin(time*.8)),now,.08);windGain.gain.setTargetAtTime(.13+.075*(.5+.5*Math.sin(time*1.4)),now,.06);airGain.gain.setTargetAtTime(.014+.025*(.5+.5*Math.sin(time*.91)),now,.08);bass.o.frequency.setTargetAtTime(42+Math.sin(time*.4)*1.4,now,.1);body.g.gain.setTargetAtTime(.038+.012*Math.sin(time*.8),now,.1);

  }
  function silence(){out.gain.setTargetAtTime(0,ctx.currentTime,.09);}
  function dispose(){if(disposed)return;disposed=true;for(const n of live){try{n.stop();}catch(e){}n.disconnect();}nodes.forEach(n=>n.disconnect());}
  return{update,silence,dispose};
 }
 global.RiftAudio131={create};
})(window);
