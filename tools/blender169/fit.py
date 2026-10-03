import bpy,sys,bmesh,numpy as np
from mathutils import Vector,Matrix
body_path,setdir,setid,out=sys.argv[-4:]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=body_path)
A=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
body=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('tripo_part_')]
for o in list(bpy.context.scene.objects):
  if o.type=='MESH' and o not in body:bpy.data.objects.remove(o)
dg=bpy.context.evaluated_depsgraph_get()
pts={}  # bone -> world verts (dominant weight)
allp=[]
for o in body:
  ev=o.evaluated_get(dg);me=ev.to_mesh();mw=o.matrix_world
  names={g.index:g.name for g in o.vertex_groups}
  for v,vo in zip(me.vertices,o.data.vertices):
    w=mw@v.co;allp.append(w)
    pts.setdefault(o.name,[]).append(w)
    if vo.groups:g=max(vo.groups,key=lambda g:g.weight);pts.setdefault(names[g.group],[]).append(w);pts.setdefault(o.name+'&'+names[g.group],[]).append(w)
  ev.to_mesh_clear()
P={k:np.array([list(v) for v in vs]) for k,vs in pts.items()}
def bone_ht(n):b=A.data.bones[n];return A.matrix_world@b.head_local,A.matrix_world@b.tail_local
# body copy for weight transfer
bpy.ops.object.select_all(action='DESELECT')
cp=[]
for o in body:
  c=o.copy();c.data=o.data.copy();bpy.context.scene.collection.objects.link(c);cp.append(c)
for c in cp:
  c.select_set(True)
bpy.context.view_layer.objects.active=cp[0];bpy.ops.object.join();BODY=cp[0];BODY.name='BODYREF'
for m in list(BODY.modifiers):
  if m.type=='ARMATURE':
    bpy.context.view_layer.objects.active=BODY;bpy.ops.object.modifier_apply(modifier=m.name)
BODY.parent=None
def load_piece(name):
  import os
  if not os.path.exists(f'{setdir}/{setid}-{name}.glb'):return None
  before=set(bpy.context.scene.objects)
  bpy.ops.import_scene.gltf(filepath=f'{setdir}/{setid}-{name}.glb')
  new=[o for o in bpy.context.scene.objects if o not in before]
  ms=[o for o in new if o.type=='MESH']
  bpy.ops.object.select_all(action='DESELECT')
  for o in ms:o.select_set(True)
  bpy.context.view_layer.objects.active=ms[0]
  if len(ms)>1:bpy.ops.object.join()
  p=bpy.context.view_layer.objects.active
  for o in new:
    if o!=p and o.name in bpy.data.objects:bpy.data.objects.remove(o)
  p.parent=None;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
  return p
def verts(o):return np.array([list(o.matrix_world@v.co) for v in o.data.vertices])
def place(o,M):
  o.data.transform(M);o.data.update()
def box_fit(o,T,expand,shift=(0,0,0)):
  V=verts(o);pmin,pmax=V.min(0),V.max(0);tmin,tmax=T.min(0),T.max(0)
  tc=(tmin+tmax)/2+np.array(shift)*(tmax-tmin);ts=(tmax-tmin)*np.array(expand);ps=pmax-pmin;pc=(pmin+pmax)/2
  s=ts/np.maximum(ps,1e-6)
  M=Matrix.Translation(Vector(tc))@Matrix.Diagonal(Vector(list(s)+[1]))@Matrix.Translation(Vector(-pc))
  place(o,M)
def seg_fit(o,bone,length_k=.9,thick=1.25,mirror=False,lo=3,hi=97):
  T=P[bone];c0=T.mean(0);U,S_,Vt=np.linalg.svd(T-c0,full_matrices=False);ax=Vt[0]
  if ax[2]>0:ax=-ax  # aponta para baixo (ombro→mão, joelho→pé)
  proj=(T-c0)@ax;p0,p1=np.percentile(proj,lo),np.percentile(proj,hi);L=p1-p0;mid=c0+ax*(p0+p1)/2
  radial=(T-c0)-np.outer(proj,ax);r=np.percentile(np.linalg.norm(radial,axis=1),80)
  d=Vector(list(ax))
  if mirror:
    place(o,Matrix.Diagonal(Vector((-1,1,1,1))));bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.reverse_faces(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free()
  V=verts(o);pmin,pmax=V.min(0),V.max(0);ext=pmax-pmin;pc=(pmin+pmax)/2;i=int(np.argmax(ext))
  axes=[Vector((1,0,0)),Vector((0,1,0)),Vector((0,0,1))];a=axes[i];f=Vector((0,-1,0)) if i!=1 else Vector((0,0,1));c=a.cross(f)
  fw=Vector((0,-1,0));fw=(fw-d*fw.dot(d)).normalized();cw=d.cross(fw)
  Pm=Matrix((a,f,c)).transposed();Tm=Matrix((d,fw,cw)).transposed();R=(Tm@Pm.inverted()).to_4x4()
  sc=[0,0,0];sc[i]=length_k*L/ext[i]
  for k in range(3):
    if k!=i:sc[k]=2*r*thick/ext[k]
  M=Matrix.Translation(Vector(list(mid)))@R@Matrix.Diagonal(Vector(sc+[1]))@Matrix.Translation(Vector(-pc))
  place(o,M);return o
def skin(o,name):
  o.name=name
  for b in A.data.bones:o.vertex_groups.new(name=b.name)
  m=o.modifiers.new('dt','DATA_TRANSFER');m.object=BODY;m.use_vert_data=True;m.data_types_verts={'VGROUP_WEIGHTS'};m.vert_mapping='POLYINTERP_NEAREST';m.layers_vgroup_select_src='ALL';m.layers_vgroup_select_dst='NAME'
  bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=m.name)
  o.parent=A;am=o.modifiers.new('arm','ARMATURE');am.object=A
pieces=[]
H=load_piece('elmo')
if H:box_fit(H,P['tripo_part_6'],(1.42,1.45,1.28),(0,-.02,.03))
if H:skin(H,'set169_h');pieces.append(H)
C=load_piece('peitoral')
C_T=np.vstack([P['tripo_part_0'],P['tripo_part_3']]);C and box_fit(C,C_T,(1.12,1.35,1.1),(0,-.03,0))
if C:skin(C,'set169_a');pieces.append(C)
for side in 'rl':
  g=load_piece('bracal')
  if g:seg_fit(g,'tripo_part_'+('7' if side=='r' else '8')+'&forearm_'+side,1.0,1.85,mirror=(side=='l'),lo=0,hi=100)
  if g:skin(g,'set169_g_'+side);pieces.append(g)
  b=load_piece('greva')
  if b:seg_fit(b,'shin_'+side,.95,1.3,mirror=(side=='l'),lo=0,hi=92)
  if b:skin(b,'set169_b_'+side);pieces.append(b)
for o in body:bpy.data.objects.remove(o)
bpy.data.objects.remove(BODY)
bpy.ops.object.select_all(action='DESELECT');A.select_set(True)
for p in pieces:p.select_set(True)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',use_selection=True,export_skins=True,export_animations=False,export_image_format='WEBP')
print('OK',[ (p.name,len(p.data.vertices)) for p in pieces])
