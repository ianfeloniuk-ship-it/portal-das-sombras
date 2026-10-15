const fs=require('fs'),path=require('path'),vm=require('vm');
async function loadThree(){
 const p=process.env.PRIMEVA_THREE_PATH;
 if(p)return require(path.resolve(p));
 const html=fs.readFileSync(path.join(__dirname,'..','game.html'),'utf8');
 const m=html.match(/<script[^>]+src="(https?:[^"']*three[^"']*\.js)"/i); if(!m)throw new Error('pinned Three URL missing from game.html');
 const code=await (await fetch(m[1])).text(), box={console};box.globalThis=box;
 vm.runInNewContext(code,box,{filename:m[1]});
 if(!box.THREE)throw new Error('Three URL did not expose THREE: '+m[1]);
 return box.THREE;
}
module.exports={loadThree};
