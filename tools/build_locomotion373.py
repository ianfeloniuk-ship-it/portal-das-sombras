"""Replace only Viajante locomotion clips; preserve mesh, rig and every combat clip.
Original source: models/anim-viajante155.glb from base commit 434bae9.
Run on an unmodified source or pass --source to the preserved source GLB.
"""
import json,struct,math,argparse
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R, Slerp
args=argparse.ArgumentParser();args.add_argument('--source',default='models/anim-viajante155-original.glb');args.add_argument('--output',default='models/anim-viajante155.glb');args=args.parse_args()
b=Path(args.source).read_bytes();jl=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+jl]);data=bytearray(b[28+jl:]);nodes=j['nodes'];parents={c:i for i,n in enumerate(nodes) for c in n.get('children',[])};names={n.get('name','').split(':')[-1]:i for i,n in enumerate(nodes)}
identity=R.identity();local=[R.from_quat(n.get('rotation',[0,0,0,1])) for n in nodes];pos=[np.array(n.get('translation',[0,0,0]),float) for n in nodes]
order=[]
def visit(i):
 order.append(i)
 for c in nodes[i].get('children',[]):visit(c)
for i in range(len(nodes)):
 if i not in parents:visit(i)
restQ={};restP={}
for i in order:
 p=parents.get(i);pq=restQ.get(p,identity);restQ[i]=pq*local[i];restP[i]=restP.get(p,np.zeros(3))+pq.apply(pos[i])
def euler(x=0,y=0,z=0):return R.from_euler('xyz',[x,y,z],degrees=True)
def align(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b);v=np.cross(a,b);return R.from_quat(np.r_[v,1+np.dot(a,b)])
def sagittal(angle,side=0):
 a=math.radians(angle);return np.array([side,-math.cos(a),math.sin(a)])
def frame(kind,u):
 desired={};p=2*math.pi*u
 def orient(name,rot):desired[names[name]]=rot*restQ[names[name]]
 def limb(name,child,direction):
  i=names[name];desired[i]=align(restP[names[child]]-restP[i],np.array(direction))*restQ[i]
 # Narrow forward lunge: preparation, propulsion, compact glide, recovery.
 keys=np.array([0,.14,.32,.62,.84,1]);values=np.array([[10,20,30,-5,22,-12,50],[24,38,65,-10,35,-18,62],[28,50,82,-22,18,-28,68],[24,42,68,-12,65,-18,58],[16,32,35,-18,38,-8,45],[5,8,12,-5,12,-2,22]],float)
 lean,lt,lk,rt,rk,arm,elbow=[np.interp(u,keys,values[:,k]) for k in range(7)]
 orient('Hips',euler(0,0,0));orient('Spine',euler(lean*.65));orient('Spine2',euler(lean));orient('Head',euler(lean*.25))
 for side,thigh,knee,sign in [('Left',lt,lk,1),('Right',rt,rk,-1)]:
  limb(side+'UpLeg',side+'Leg',sagittal(thigh,sign*.01));limb(side+'Leg',side+'Foot',sagittal(thigh-knee,sign*.01));limb(side+'Foot',side+'ToeBase',[0,-.32,1])
  a=arm+(12 if side=='Left' else -8)
  limb(side+'Arm',side+'ForeArm',sagittal(a,sign*.10));limb(side+'ForeArm',side+'Hand',sagittal(a+elbow,sign*.04));i=names[side+'ForeArm'];orient(side+'Hand',desired[i]*restQ[i].inv())
 world={};worldP={};out={}
 for i in order:
  parent=parents.get(i);pq=world.get(parent,identity);world[i]=desired.get(i,pq*local[i]);out[i]=(pq.inv()*world[i]).as_quat();worldP[i]=worldP.get(parent,np.zeros(3))+pq.apply(pos[i])
 # Keep the supporting sole at its original ground height (not the ankle center).
 support=min(worldP[names[s+'Foot']][1]-restP[names[s+'Foot']][1] for s in ['Left','Right'])
 hp=pos[names['Hips']].copy();hp[1]-=support
 return out,hp


# Human walk/run from the official Three.js Mixamo example, retargeted in model space.
sb=Path('models/locomotion-reference372.glb').read_bytes();sl=struct.unpack_from('<I',sb,12)[0];sj=json.loads(sb[20:20+sl]);binary=sb[28+sl:];sn=sj['nodes'];sp={c:i for i,n in enumerate(sn) for c in n.get('children',[])};sm={n.get('name','').split(':')[-1]:i for i,n in enumerate(sn)}
def readacc(idx):
 a=sj['accessors'][idx];v=sj['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']];return np.frombuffer(binary,dtype='<f4',count=a['count']*width,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(a['count'],width)
def worlds(changes={}):
 wq={};wp={};ws={}
 def calc(i):
  if i in wq:return
  parent=sp.get(i)
  if parent is not None:calc(parent)
  n=sn[i];q=R.from_quat(changes.get((i,'rotation'),n.get('rotation',[0,0,0,1])));t=np.array(changes.get((i,'translation'),n.get('translation',[0,0,0])));sc=np.array(changes.get((i,'scale'),n.get('scale',[1,1,1])))
  pq=wq.get(parent,identity);ps=ws.get(parent,np.ones(3));wq[i]=pq*q;wp[i]=wp.get(parent,np.zeros(3))+pq.apply(t*ps);ws[i]=ps*sc
 for i in range(len(sn)):calc(i)
 return wq,wp
tp={}
for an in sj['animations']:
 if an['name']=='TPose':
  for ch in an['channels']:
   sam=an['samplers'][ch['sampler']];tp[(ch['target']['node'],ch['target']['path'])]=readacc(sam['output'])[0]
srq,srp=worlds(tp);sourceTracks={};sourceDuration={}
for an in sj['animations']:
 if an['name'] not in ['Walk','Run']:continue
 ts=[]
 for ch in an['channels']:
  sam=an['samplers'][ch['sampler']];times=readacc(sam['input']).ravel();values=readacc(sam['output']);ts.append((ch['target']['node'],ch['target']['path'],times,values))
 sourceTracks[an['name']]=ts;sourceDuration[an['name']]=max(t[-1] for _,_,t,_ in ts)
def mocap(kind,u):
 key='Run' if kind=='correr' else 'Walk';time=u*sourceDuration[key];changes={}
 for i,path,t,v in sourceTracks[key]:
  x=np.clip(time,t[0],t[-1]);changes[(i,path)]=Slerp(t,R.from_quat(v))(x).as_quat() if path=='rotation' else np.array([np.interp(x,t,v[:,k]) for k in range(v.shape[1])])
 sq,spos=worlds(changes);desired={}
 for name,i in names.items():
  if name in sm and nodes[i].get('name','').startswith('mixamorig:'):desired[i]=euler(0,180,0)*sq[sm[name]]*srq[sm[name]].inv()*euler(0,-180,0)*restQ[i]
 # Match anatomical segment directions, not only bone roll: Viajante's bind feet splay out.
 for side in ['Left','Right']:
  for bone,child in [('UpLeg','Leg'),('Leg','Foot'),('Foot','ToeBase')]:
   name=side+bone;child=side+child;i=names[name];si=sm[name];ci=sm[child]
   aim=euler(0,180,0).apply(spos[ci]-spos[si]);targetRest=restP[names[child]]-restP[i]
   current=(desired[i]*restQ[i].inv()).apply(targetRest)
   if bone=='Foot':
    # Keep toes within 5 degrees of the travel direction while retaining heel/toe pitch.
    aim[0]=np.clip(aim[0],-abs(aim[2])*.0875,abs(aim[2])*.0875)
   desired[i]=align(current,aim)*desired[i]
 world={};out={}
 for i in order:
  pq=world.get(parents.get(i),identity);world[i]=desired.get(i,pq*local[i]);out[i]=(pq.inv()*world[i]).as_quat()
 hip=names['Hips'];sh=sm['Hips'];hp=pos[hip].copy();hp[1]+=(spos[sh][1]-srp[sh][1])*(restP[hip][1]/srp[sh][1]);return out,hp

def accessor(array,typ):
 a=np.asarray(array,dtype='<f4');data.extend(b'\0'*((-len(data))%4));offset=len(data);data.extend(a.tobytes());vi=len(j['bufferViews']);j['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':a.nbytes});idx=len(j['accessors']);entry={'bufferView':vi,'componentType':5126,'count':len(a),'type':typ}
 if typ=='SCALAR':entry.update(min=[float(a.min())],max=[float(a.max())])
 j['accessors'].append(entry);return idx
# Measured deformed-sole heights on original Viajante mesh; preserve run flight.
floor_samples={'caminhar': [-0.03025, -0.02991, -0.02818, -0.02804, -0.0272, -0.028, -0.02854, -0.03049, -0.03171, -0.03234, -0.0323, -0.03225, -0.03191, -0.03171, -0.03245, -0.03504, -0.04278, -0.05337, -0.06678, -0.07243, -0.05962, -0.03566, -0.02681, -0.02781, -0.02899, -0.02955, -0.03052, -0.03066, -0.0316, -0.03148, -0.03241, -0.03197, -0.0327, -0.03216, -0.03258, -0.03188, -0.03153, -0.03016, -0.02934, -0.02805, -0.02708, -0.02572, -0.02515, -0.02501, -0.026, -0.03006, -0.0368, -0.05359, -0.0689, -0.06604, -0.04769, -0.02761, -0.02861, -0.0295, -0.02987, -0.03049, -0.0303, -0.03085, -0.03029, -0.03102, -0.03025], 'correr': [-0.03816, -0.04352, -0.04168, -0.04376, -0.04223, -0.04034, -0.0482, -0.05353, -0.05406, -0.04375, -0.01216, 0.02465, 0.06174, 0.09368, 0.07253, 0.05102, 0.03032, 0.01697, 0.0055, -0.01514, -0.0239, -0.02891, -0.03299, -0.0314, -0.0363, -0.03419, -0.03923, -0.03703, -0.03528, -0.03623, -0.04043, -0.05202, -0.05131, -0.02381, 0.0071, 0.0426, 0.07399, 0.06221, 0.04717, 0.03383, 0.02151, 0.01285, 0.00241, -0.02182, -0.03621, -0.03912, -0.03788, -0.04143, -0.03816]}
for kind,duration,count in [('correr',sourceDuration['Run'],49),('caminhar',sourceDuration['Walk'],61),('esquiva',.32,25)]:
 samples=[(mocap if kind!='esquiva' else frame)(kind,k/(count-1)) for k in range(count)]
 if kind in floor_samples:
  for sample,height in zip(samples,floor_samples[kind]):sample[1][1]+=max(0,.003-height)/2.0940963858763237
 times=accessor(np.linspace(0,duration,count),'SCALAR');anim={'name':kind,'samplers':[],'channels':[]}
 def track(i,path,array,typ):
  ai=accessor(array,typ);si=len(anim['samplers']);anim['samplers'].append({'input':times,'output':ai,'interpolation':'LINEAR'});anim['channels'].append({'sampler':si,'target':{'node':i,'path':path}})
 for i,n in enumerate(nodes):
  if n.get('name','').startswith('mixamorig:'):
   qs=np.array([s[0][i] for s in samples])
   for k in range(1,len(qs)):
    if np.dot(qs[k-1],qs[k])<0:qs[k]*=-1
   track(i,'rotation',qs,'VEC4');track(i,'translation',[s[1] if i==names['Hips'] else pos[i] for s in samples],'VEC3');track(i,'scale',[n.get('scale',[1,1,1])]*count,'VEC3')
 for idx,old in enumerate(j['animations']):
  if old['name']==kind:j['animations'][idx]=anim;break
 else:j['animations'].append(anim)
j['buffers'][0]['byteLength']=len(data);jb=json.dumps(j,separators=(',',':')).encode();jb+=b' '*((-len(jb))%4);data.extend(b'\0'*((-len(data))%4));out=struct.pack('<III',0x46546c67,2,28+len(jb)+len(data))+struct.pack('<II',len(jb),0x4e4f534a)+jb+struct.pack('<II',len(data),0x004e4942)+data;Path(args.output).write_bytes(out);print('Wrote',args.output,len(out),'bytes; replaced correr/esquiva and added caminhar; other clips preserved')
