"""Bind the distinct veteran NPC to the shared warrior animation bone names."""
from pathlib import Path
import json,struct,numpy as np
root=Path(__file__).resolve().parent.parent
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path,required=True);source=parser.parse_args().source
b=source.read_bytes();n=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+n]);binary=b[28+n:];views=[binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']] for v in d['bufferViews']]
def read(i):
 a=d['accessors'][i];dt={5126:'<f4',5125:'<u4',5123:'<u2'}[a['componentType']];w={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']];return np.frombuffer(views[a['bufferView']],dtype=dt,count=a['count']*w,offset=a.get('byteOffset',0)).reshape(-1,w).copy()
def add(a,kind,component=5126):
 a=np.asarray(a,dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[component]);v=len(views);views.append(a.tobytes());d['bufferViews'].append({'buffer':0,'byteLength':a.nbytes});ac={'bufferView':v,'componentType':component,'count':len(a),'type':kind};
 if kind=='VEC3':ac.update(min=a.min(0).tolist(),max=a.max(0).tolist())
 d['accessors'].append(ac);return len(d['accessors'])-1
bones=[('hips',None,[0,-.025,0]),('spine','hips',[0,.10,0]),('chest','spine',[0,.245,0]),('neck','chest',[0,.355,0]),('head','neck',[0,.415,0]),('upperarm_r','chest',[-.14,.26,.01]),('forearm_r','upperarm_r',[-.21,.125,-.025]),('hand_r','forearm_r',[-.213,.012,.02]),('upperarm_l','chest',[.14,.26,.01]),('forearm_l','upperarm_l',[.21,.125,-.025]),('hand_l','forearm_l',[.213,.012,.02]),('thigh_r','hips',[-.078,-.04,0]),('shin_r','thigh_r',[-.09,-.255,.005]),('foot_r','shin_r',[-.10,-.445,.03]),('thigh_l','hips',[.078,-.04,0]),('shin_l','thigh_l',[.09,-.255,.005]),('foot_l','shin_l',[.10,-.445,.03]),('cape','chest',[0,.225,-.075]),('cape_tail','cape',[0,-.095,-.105])]
names=[v[0] for v in bones];positions={a:np.array(c) for a,_,c in bones};start=len(d['nodes']);ids={a:start+i for i,a in enumerate(names)}
for name,parent,pos in bones:
 node={'name':name,'translation':(positions[name]-(positions[parent] if parent else 0)).tolist()};children=[ids[a] for a,p,_ in bones if p==name]
 if children:node['children']=children
 d['nodes'].append(node)
ibm=[]
for name,_,pos in bones:
 m=np.eye(4);m[:3,3]=-np.array(pos);ibm.append(m.T.reshape(-1))
d['skins']=[{'joints':[ids[x] for x in names],'skeleton':ids['hips'],'inverseBindMatrices':add(ibm,'MAT4')}];d['scenes'][0]['nodes'].append(ids['hips'])
allp=np.concatenate([read(pr['attributes']['POSITION']) for mesh in d['meshes'] for pr in mesh['primitives']]);lo=allp.min(0);hi=allp.max(0);scale=1.014584/(hi[1]-lo[1]);center=(lo+hi)/2
smooth=lambda a,b,x: np.clip((x-a)/(b-a),0,1)**2*(3-2*np.clip((x-a)/(b-a),0,1))
for node in d['nodes'][:start]:
 if 'mesh' not in node:continue
 node['skin']=0
 for pr in d['meshes'][node['mesh']]['primitives']:
  attrs=pr['attributes'];P=read(attrs['POSITION']);P=(P-center)*scale;P[:,1]+=.005399;attrs['POSITION']=add(P,'VEC3');x,y,z=P.T;W=np.zeros((len(P),len(names)),np.float32)
  # Surface distances keep hands separate from nearby skirt/torso vertices.
  from scipy.spatial import cKDTree
  from scipy.sparse import coo_matrix
  from scipy.sparse.csgraph import dijkstra
  unique,inverse=np.unique(np.round(P,5),axis=0,return_inverse=True);faces=read(pr['indices']).reshape(-1,3);f=inverse[faces];edges=np.vstack([f[:,[0,1]],f[:,[1,2]],f[:,[2,0]]]);edges=np.unique(np.sort(edges,axis=1),axis=0);edges=edges[edges[:,0]!=edges[:,1]];length=np.linalg.norm(unique[edges[:,0]]-unique[edges[:,1]],axis=1);graph=coo_matrix((np.r_[length,length],(np.r_[edges[:,0],edges[:,1]],np.r_[edges[:,1],edges[:,0]])),shape=(len(unique),len(unique))).tocsr();tree=cKDTree(unique);D=[]
  for name,parent,pos in bones[:17]:
   children=[positions[a] for a,p,_ in bones[:17] if p==name];end=children[0] if children else positions[name]+np.array([0,.07 if name=='head' else -.04,0]);samples=np.array([positions[name]*(1-u)+end*u for u in [.15,.4,.65,.85]]);seeds=np.unique(tree.query(samples,k=4)[1]);dist=dijkstra(graph,directed=False,indices=seeds,min_only=True);D.append(dist)
  D=np.array(D).T;bad=~np.isfinite(D).any(1)
  if bad.any():D[bad]=np.linalg.norm(unique[bad,None,:]-np.array([p for _,_,p in bones[:17]])[None,:,:],axis=2)
  closest=np.min(D,axis=1,keepdims=True);G=np.exp(-np.square((D-closest)/.045));G/=np.maximum(G.sum(1,keepdims=True),1e-8);W[:,:17]=G[inverse];W[:,17:]=0
  for side,sign in [('r',-1),('l',1)]:
   for part in ['upperarm_','forearm_','hand_']:
    k=names.index(part+side);gate=smooth(.085,.16,x*sign);removed=W[:,k]*(1-gate);W[:,k]*=gate;W[:,names.index('chest')]+=removed
  W[y>.38]=0;W[y>.38,names.index('head')]=1
  J=np.argsort(W,axis=1)[:,-4:];weights=np.take_along_axis(W,J,axis=1);weights/=np.maximum(weights.sum(1,keepdims=True),1e-8)
  assert np.isfinite(weights).all() and np.allclose(weights.sum(1),1)
  attrs['JOINTS_0']=add(J,'VEC4',5123);attrs['WEIGHTS_0']=add(weights,'VEC4');attrs['_GEAR_MASK']=add(np.zeros((len(P),4)),'VEC4')
parts=[];offset=0
for i,v in enumerate(views):d['bufferViews'][i]['byteOffset']=offset;pad=v+b'\0'*((-len(v))%4);parts.append(pad);offset+=len(pad)
data=b''.join(parts);d['buffers']=[{'byteLength':len(data)}];j=json.dumps(d,separators=(',',':')).encode();j+=b' '*((-len(j))%4);out=root/'models/cacador-veterano138.glb';out.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(data))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(data),0x004e4942)+data);print('Saved',out,len(data),'bytes')
