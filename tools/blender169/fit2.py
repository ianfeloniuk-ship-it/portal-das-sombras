# v181: corpo base justo (segunda pele) + armadura que substitui a roupa. Eixos pelas juntas do esqueleto.
import bpy,sys,bmesh,os,math,numpy as np
from mathutils import Vector,Matrix
body_path,setdir,setid,out=sys.argv[-4:]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=body_path)
A=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
body=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('tripo_part_')]
for o in list(bpy.context.scene.objects):
  if o.type=='MESH' and o not in body:bpy.data.objects.remove(o)
J=lambda n:A.matrix_world@A.data.bones[n].head_local
dg=bpy.context.evaluated_depsgraph_get();P={}
for o in body:
  ev=o.evaluated_get(dg);me=ev.to_mesh();names={g.index:g.name for g in o.vertex_groups}
  for v,vo in zip(me.vertices,o.data.vertices):
    w=list(o.matrix_world@v.co);P.setdefault(o.name,[]).append(w)
    if vo.groups:g=max(vo.groups,key=lambda g:g.weight);P.setdefault(o.name+'&'+names[g.group],[]).append(w)
  ev.to_mesh_clear()
P={k:np.array(v) for k,v in P.items()}
def radial(T,a,b,pct):
  a=np.array(list(a));b=np.array(list(b));d=b-a;L=np.linalg.norm(d);d/=L;rel=T-a;pr=rel@d;m=(pr>0)&(pr<L);rel=rel[m];pr=pr[m]
  return np.percentile(np.linalg.norm(rel-np.outer(pr,d),axis=1),pct) if len(rel) else .03
SIDE={'r':('7','5'),'l':('8','10')}
seg={}
for s in 'rl':
  sh,el,wr=J('upperarm_'+s),J('forearm_'+s),J('hand_'+s);hp,kn,an=J('thigh_'+s),J('shin_'+s),J('foot_'+s)
  rf=radial(P['tripo_part_'+SIDE[s][0]+'&forearm_'+s],el,wr,50)*1.05
  rs=radial(P['tripo_part_'+SIDE[s][1]+'&shin_'+s],kn,an,45)*.95 if ('tripo_part_'+SIDE[s][1]+'&shin_'+s) in P else .035
  rt=radial(P['tripo_part_4&thigh_'+s],hp,kn,55)*.9 if ('tripo_part_4&thigh_'+s) in P else rs*1.4
  seg['ua_'+s]=(sh,el,rf*1.3,'upperarm_'+s);seg['fa_'+s]=(el,wr,rf,'forearm_'+s)
  seg['th_'+s]=(hp,kn,max(rt,rs*1.3),'thigh_'+s);seg['sh_'+s]=(kn,an,rs,'shin_'+s)
print('RAIOS',{k:round(v[2],4) for k,v in seg.items()})
BASEMAT=bpy.data.materials.new('base169');BASEMAT.use_nodes=True;bs=BASEMAT.node_tree.nodes['Principled BSDF'];bs.inputs['Base Color'].default_value=(.07,.05,.045,1);bs.inputs['Roughness'].default_value=.75
def capsule(a,b,r,name,over=.25):
  d=(b-a);L=d.length;d.normalize();bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=10,radius=1);o=bpy.context.active_object;o.name=name
  sc=Matrix.Diagonal(Vector((r,r,L*(.5+over),1)));R=Vector((0,0,1)).rotation_difference(d).to_matrix().to_4x4();M=Matrix.Translation((a+b)/2)@R@sc
  o.data.transform(M);o.data.materials.append(BASEMAT);return o
def bind(o,weights):
  for b in A.data.bones:o.vertex_groups.new(name=b.name)
  for v in o.data.vertices:
    for bn,w in weights(o.matrix_world@v.co):o.vertex_groups[bn].add([v.index],w,'REPLACE')
  o.parent=A;am=o.modifiers.new('arm','ARMATURE');am.object=A
def join(objs,name):
  bpy.ops.object.select_all(action='DESELECT')
  for o in objs:o.select_set(True)
  bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.view_layer.objects.active;o.name=name;return o
base=[]
# tronco: hips→neck, elipse pela largura do tronco (part_0)
T0=P['tripo_part_0'];hx=(T0[:,0].max()-T0[:,0].min())/2*.86;hy=(T0[:,1].max()-T0[:,1].min())/2*.8
bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=1);tor=bpy.context.active_object;tor.name='base169_a'
z0,z1=J('hips').z,J('neck').z+.01;tor.data.transform(Matrix.Translation(Vector((0,(T0[:,1].max()+T0[:,1].min())/2,(z0+z1)/2)))@Matrix.Diagonal(Vector((hx,hy,(z1-z0)/2*1.08,1))));tor.data.materials.append(BASEMAT)
def wtorso(p):
  z=p.z;t=(z-z0)/(z1-z0)
  return [('hips',max(0,1-t*3))] if t<.33 else ([('spine',1.0)] if t<.66 else [('chest',1.0)])
bind(tor,wtorso);base.append(tor)
for s in 'rl':
  objs=[]
  for k in ('ua_','fa_'):
    a,b,r,bn=seg[k+s];c=capsule(a,b,r,'c');bind(c,lambda p,bn=bn:[(bn,1.0)]);objs.append(c)
  base.append(join(objs,'base169_g_'+s))
  objs=[]
  for k in ('th_','sh_'):
    a,b,r,bn=seg[k+s];c=capsule(a,b,r,'c');bind(c,lambda p,bn=bn:[(bn,1.0)]);objs.append(c)
  base.append(join(objs,'base169_b_'+s))
# ---- armadura ----
def load_piece(name):
  f=f'{setdir}/{setid}-{name}.glb'
  if not os.path.exists(f):return None
  before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=f)
  new=[o for o in bpy.context.scene.objects if o not in before];ms=[o for o in new if o.type=='MESH']
  bpy.ops.object.select_all(action='DESELECT')
  for o in ms:o.select_set(True)
  bpy.context.view_layer.objects.active=ms[0]
  if len(ms)>1:bpy.ops.object.join()
  p=bpy.context.view_layer.objects.active
  for o in new:
    if o!=p and o.name in bpy.data.objects:bpy.data.objects.remove(o)
  p.parent=None;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);return p
def verts(o):return np.array([list(o.matrix_world@v.co) for v in o.data.vertices])
def place(o,M):o.data.transform(M);o.data.update()
def box_fit(o,tmin,tmax,expand,shift=(0,0,0)):
  V=verts(o);pmin,pmax=V.min(0),V.max(0);tc=(tmin+tmax)/2+np.array(shift)*(tmax-tmin);ts=(tmax-tmin)*np.array(expand);ps=pmax-pmin;pc=(pmin+pmax)/2
  place(o,Matrix.Translation(Vector(tc))@Matrix.Diagonal(Vector(list(ts/np.maximum(ps,1e-6))+[1]))@Matrix.Translation(Vector(-pc)))
def seg_fit(o,a,b,r,length_k,thick,mirror,vertical=False):
  d=(b-a);L=d.length;d.normalize()
  if mirror:
    place(o,Matrix.Diagonal(Vector((-1,1,1,1))));bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.reverse_faces(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free()
  V=verts(o);pmin,pmax=V.min(0),V.max(0);ext=pmax-pmin;pc=(pmin+pmax)/2;i=2 if vertical else int(np.argmax(ext))
  axes=[Vector((1,0,0)),Vector((0,1,0)),Vector((0,0,1))];ax=axes[i];f=Vector((0,-1,0)) if i!=1 else Vector((0,0,1));c=ax.cross(f)
  fw=Vector((0,-1,0));fw=(fw-d*fw.dot(d));fw=fw.normalized() if fw.length>1e-4 else Vector((0,0,1));cw=d.cross(fw)
  R=(Matrix((d,fw,cw)).transposed()@Matrix((ax,f,c)).transposed().inverted()).to_4x4()
  sc=[0,0,0];sc[i]=length_k*L/ext[i]
  for k in range(3):
    if k!=i:sc[k]=2*r*thick/ext[k]
  place(o,Matrix.Translation((a+b)/2)@R@Matrix.Diagonal(Vector(sc+[1]))@Matrix.Translation(Vector(-pc)))
def skin_rigid(o,name,bn):o.name=name;bind(o,lambda p:[(bn,1.0)])
def skin_box(o,name,fn):o.name=name;bind(o,fn)
pieces=[]
H=load_piece('elmo')
if H:
  T=P['tripo_part_6'];box_fit(H,T.min(0),T.max(0),(1.42,1.45,1.28),(0,-.02,.03));skin_box(H,'set169_h',lambda p:[('head',1.0)]);pieces.append(H)
C=load_piece('peitoral')
if C:
  T=np.vstack([P['tripo_part_0'],P['tripo_part_3']]);box_fit(C,T.min(0),T.max(0),(1.05,1.3,1.08),(0,-.03,0))
  skin_box(C,'set169_a',lambda p:wtorso(p) if abs(p.x)<.1 else [('upperarm_r' if p.x<0 else 'upperarm_l',.5),('chest',.5)]);pieces.append(C)
for s in 'rl':
  for k,lab,lk,th in (('ua_','up',.95,2.0),('fa_','lo',.95,2.1)):
    g=load_piece('bracal')
    if g:a,b,r,bn=seg[k+s];seg_fit(g,a,b,r,lk,th,s=='l');skin_rigid(g,'set169_g_'+s+'_'+lab,bn);pieces.append(g)
  g=load_piece('greva')
  if g:
    hp,kn,an=J('thigh_'+s),J('shin_'+s),J('foot_'+s);rr=max(seg['th_'+s][2],seg['sh_'+s][2]*1.2)
    V0=verts(g);e0=V0.max(0)-V0.min(0);full=e0[2]/max(e0[0],e0[1])>2.6
    if full:seg_fit(g,hp+(kn-hp)*.05,an,rr,1.0,1.6,s=='l',vertical=True)
    else:seg_fit(g,kn+(an-kn)*-.08,an,seg['sh_'+s][2]*1.15,1.0,1.75,s=='l',vertical=True)
    print('GREVA',setid,s,'perna toda' if full else 'canela',round(float(e0[2]/max(e0[0],e0[1])),2))
    tk=(kn-hp).length/(an-hp).length;d=(an-hp).normalized();Lg=(an-hp).length
    def wleg(p,s=s,hp=hp,d=d,Lg=Lg,tk=tk):
      t=(p-hp).dot(d)/Lg;u=min(1,max(0,(t-(tk-.07))/.14));return [('thigh_'+s,1-u),('shin_'+s,u)] if 0<u<1 else [('shin_'+s if u>=1 else 'thigh_'+s,1.0)]
    skin_box(g,'set169_b_'+s,wleg);pieces.append(g)
for o in body:bpy.data.objects.remove(o)
bpy.ops.object.select_all(action='DESELECT');A.select_set(True)
for p in pieces+base:p.select_set(True)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',use_selection=True,export_skins=True,export_animations=False,export_image_format='WEBP')
print('OK',[p.name for p in pieces+base])
