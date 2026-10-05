# v246: rig do Arquiteto feito pelo Ian no Tripo (modelo estático) — esqueleto, pesos por proximidade e animações.
# uso: /tmp/bl/bin/python tools/blender246/rig_arquiteto.py entrada.glb saida.glb
import bpy,sys,math
from mathutils import Vector,Euler
from mathutils.geometry import intersect_point_line
src,out=sys.argv[-2],sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
ms=[o for o in bpy.context.scene.objects if o.type=='MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in ms:o.select_set(True)
bpy.context.view_layer.objects.active=ms[0]
if len(ms)>1:bpy.ops.object.join()
me=bpy.context.object;me.parent=None
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
K=10.3
for v in me.data.vertices:v.co=v.co*K
bpy.ops.object.armature_add(location=(0,0,0));arm=bpy.context.object;arm.name='Arquiteto';bpy.ops.object.mode_set(mode='EDIT');eb=arm.data.edit_bones;eb.remove(eb[0])
def bone(n,h,t,p=None):
    b=eb.new(n);b.head=Vector(h)*K;b.tail=Vector(t)*K
    if p:b.parent=eb[p];b.use_connect=False
    return b
bone('root',(0,0,0),(0,0,.04));bone('hips',(0,0,.44),(0,0,.52),'root');bone('chest',(0,0,.52),(0,0,.82),'hips');bone('head',(0,0,.83),(0,0,1.0),'chest')
# R = braço do punho gigante (x negativo); L = braço fino do compasso
bone('arm_R',(-.27,0,.78),(-.32,0,.56),'chest');bone('fore_R',(-.32,0,.56),(-.36,0,.40),'arm_R');bone('hand_R',(-.36,0,.40),(-.38,0,.08),'fore_R')
bone('arm_L',(.27,0,.78),(.30,0,.60),'chest');bone('fore_L',(.30,0,.60),(.32,0,.43),'arm_L');bone('hand_L',(.32,0,.43),(.34,0,.12),'fore_L')
for sx,s in ((-1,'R'),(1,'L')):
    bone('thigh_'+s,(sx*.1,0,.46),(sx*.1,0,.27),'hips');bone('shin_'+s,(sx*.1,0,.27),(sx*.1,0,.0),'thigh_'+s)
bpy.ops.object.mode_set(mode='OBJECT')
segs=[(b.name,arm.matrix_world@b.head_local,arm.matrix_world@b.tail_local) for b in arm.data.bones if b.name!='root']
def near(p,side=None):
    cand=segs
    if side=='legs':cand=[x for x in segs if x[0].startswith(('thigh','shin','hips'))]
    elif side=='armR':cand=[x for x in segs if x[0] in('arm_R','fore_R','hand_R')]
    elif side=='armL':cand=[x for x in segs if x[0] in('arm_L','fore_L','hand_L')]
    elif p.z<.2*K and abs(p.x)<.27*K:cand=[x for x in segs if x[0].startswith(('thigh','shin'))]
    elif p.x<-.19*K and p.z>.05*K:cand=[x for x in segs if x[0].endswith('_R') and not x[0].startswith(('thigh','shin'))]
    elif p.x>.19*K and p.z>.05*K:cand=[x for x in segs if x[0].endswith('_L') and not x[0].startswith(('thigh','shin'))]
    return min((dseg(p,a,b),n) for n,a,b in cand)[1]
def dseg(p,a,b):
    q,t=intersect_point_line(p,a,b);t=max(0,min(1,t));return (p-(a+(b-a)*t)).length
G={n:me.vertex_groups.new(name=n) for n,_,_ in segs}
# peças soltas (ilhas) vão inteiras para um osso: evita esticar a malha entre peito e braço
# ilhas por posição (o glTF duplica vértices nas costuras de UV)
par=list(range(len(me.data.vertices)))
def f(x):
    while par[x]!=x:par[x]=par[par[x]];x=par[x]
    return x
def u(a,b):
    a,b=f(a),f(b)
    if a!=b:par[a]=b
key={}
for v in me.data.vertices:
    k=tuple(round(c,3) for c in v.co)
    if k in key:u(v.index,key[k])
    else:key[k]=v.index
for e in me.data.edges:u(e.vertices[0],e.vertices[1])
from collections import defaultdict
gr=defaultdict(list)
for v in me.data.vertices:gr[f(v.index)].append(v.index)
isl=list(gr.values())
V=me.data.vertices;big=0
for ids in isl:
    c=sum((V[i].co for i in ids),Vector())/len(ids)
    zs=[V[i].co.z for i in ids];span=max(zs)-min(zs)
    if span<.32*K:
        G[near(c)].add(ids,1.,'REPLACE')
    else:
        big+=1
        side='armR' if c.x<-.2*K else 'armL' if c.x>.2*K else 'legs' if c.z<.45*K else None
        for i in ids:
            p=V[i].co;n0=near(p,side)
            if abs(p.x)>.15*K and abs(p.x)<.26*K and p.z>.62*K:
                side='_R' if p.x<0 else '_L';k=(abs(p.x)-.15*K)/(.11*K)
                G['arm'+side].add([i],k,'REPLACE');G['chest'].add([i],1-k,'REPLACE')
            else:G[n0].add([i],1.,'REPLACE')
# corta triângulos que ligam cadeias que se movem separadas (ex.: punho grudado no pé, perna com perna)
def chain(n):
    if n in('arm_R','fore_R','hand_R'):return 'aR'
    if n in('arm_L','fore_L','hand_L'):return 'aL'
    if n.endswith('_R') and n[:1] in 'ts':return 'lR'
    if n.endswith('_L') and n[:1] in 'ts':return 'lL'
    return 'c'
OK={frozenset(x) for x in (('aR','c'),('aL','c'),('lR','c'),('lL','c'))}
def top(v):return me.vertex_groups[max(v.groups,key=lambda g:g.weight).group].name
ch=[chain(top(v)) for v in V]
import bmesh
bm=bmesh.new();bm.from_mesh(me.data)
kill=[f for f in bm.faces if len({ch[v.index] for v in f.verts})>1 and frozenset({ch[v.index] for v in f.verts}) not in OK]
bmesh.ops.delete(bm,geom=kill,context='FACES_ONLY');bm.to_mesh(me.data);bm.free()
print('ilhas',len(isl),'grandes',big,'cortados',len(kill))
md=me.modifiers.new('arm','ARMATURE');md.object=arm;me.parent=arm
# ---------- animações
def act(name,length,keys):
    a=bpy.data.actions.new(name);arm.animation_data_create();arm.animation_data.action=a
    for pb in arm.pose.bones:pb.rotation_mode='XYZ'
    for f,pose in keys:
        for pb in arm.pose.bones:
            r=pose.get(pb.name,(0,0,0));pb.rotation_euler=Euler(r);pb.keyframe_insert('rotation_euler',frame=f)
            loc=pose.get(pb.name+'@',(0,0,0));pb.location=Vector(loc);pb.keyframe_insert('location',frame=f)
    a.use_fake_user=True;tr=arm.animation_data.nla_tracks.new();tr.name=name;tr.strips.new(name,1,a);arm.animation_data.action=None
R=math.radians
act('idle',48,[(1,{}),(24,{'chest':(R(-3),0,0),'hips@':(0,.08,0),'arm_L':(0,0,R(4)),'arm_R':(0,0,R(-4)),'head':(R(4),0,0)}),(48,{})])
act('andar',32,[(1,{'thigh_L':(R(22),0,0),'thigh_R':(R(-22),0,0),'shin_L':(R(-10),0,0),'arm_L':(R(-14),0,0),'arm_R':(R(14),0,0)}),
 (9,{'hips@':(0,.15,0)}),(17,{'thigh_L':(R(-22),0,0),'thigh_R':(R(22),0,0),'shin_R':(R(-10),0,0),'arm_L':(R(14),0,0),'arm_R':(R(-14),0,0)}),(25,{'hips@':(0,.15,0)}),
 (32,{'thigh_L':(R(22),0,0),'thigh_R':(R(-22),0,0),'shin_L':(R(-10),0,0),'arm_L':(R(-14),0,0),'arm_R':(R(14),0,0)})])
act('golpe1',36,[(1,{}),(14,{'chest':(R(-10),0,R(-6)),'arm_R':(R(-110),0,0),'fore_R':(R(-35),0,0)}),(22,{'chest':(R(18),0,R(6)),'arm_R':(R(20),0,0),'fore_R':(R(-5),0,0),'hips@':(0,-.25,0)}),(36,{})])
act('golpe2',30,[(1,{}),(10,{'arm_L':(R(-30),0,R(25)),'fore_L':(R(-40),0,0),'chest':(0,0,R(10))}),(16,{'arm_L':(R(-95),0,R(-5)),'fore_L':(R(0),0,0),'chest':(R(8),0,R(-10))}),(30,{})])
act('morte',48,[(1,{}),(20,{'hips@':(0,-1.2,0),'thigh_L':(R(-60),0,0),'thigh_R':(R(-55),0,0),'shin_L':(R(90),0,0),'shin_R':(R(85),0,0),'chest':(R(25),0,0)}),(48,{'hips@':(0,-2.6,0),'thigh_L':(R(-85),0,0),'thigh_R':(R(-85),0,0),'shin_L':(R(100),0,0),'shin_R':(R(100),0,0),'chest':(R(70),0,0),'head':(R(30),0,0),'arm_L':(R(-40),0,R(40)),'arm_R':(R(-40),0,R(-40))})])
for im in bpy.data.images:
    if im.size[0]>1024:im.scale(1024,1024)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_animations=True,export_animation_mode='NLA_TRACKS',export_apply=False,export_image_format='JPEG')
print('OK',out)
