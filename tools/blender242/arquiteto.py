# v242: O Arquiteto montado por script (pedra, ouro, luz roxa), com esqueleto e 5 animações. Uso: python arquiteto.py <saida.glb>
import bpy, math, sys
from mathutils import Vector, Euler
out=sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
def mat(n,col,metal=0,rough=.8,em=None,es=0):
    m=bpy.data.materials.new(n);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough
    if em:b.inputs['Emission Color'].default_value=(*em,1);b.inputs['Emission Strength'].default_value=es
    return m
STONE=mat('pedra',(.22,.24,.30),0,.85);STONE2=mat('pedra2',(.30,.32,.38),0,.8);GOLD=mat('ouro',(.78,.56,.20),.9,.35)
GLOW=mat('luz',(.55,.2,.95),0,.3,(.62,.25,1.),6);MARB=mat('marmore',(.92,.90,.86),0,.4);DARK=mat('ferro',(.12,.11,.14),.7,.5)
parts=[]
def add(o,m,bone):o.data.materials.append(m);parts.append((o,bone));return o
def box(s,loc,m,bone,rot=(0,0,0),bev=.06):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc,rotation=rot);o=bpy.context.object;o.scale=s;bpy.ops.object.transform_apply(scale=True)
    if bev:mo=o.modifiers.new('b','BEVEL');mo.width=bev;mo.segments=1;bpy.ops.object.modifier_apply(modifier='b')
    return add(o,m,bone)
def cyl(r,h,loc,m,bone,v=8,rot=(0,0,0),r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=v,radius1=r,radius2=r2 if r2 is not None else r,depth=h,location=loc,rotation=rot);return add(bpy.context.object,m,bone)
def cone(r,h,loc,m,bone,v=6):return cyl(r,h,loc,m,bone,v,r2=0)
def torus(R,r,loc,m,bone,rot=(0,0,0),seg=24):
    bpy.ops.mesh.primitive_torus_add(major_radius=R,minor_radius=r,major_segments=seg,minor_segments=6,location=loc,rotation=rot);return add(bpy.context.object,m,bone)
# ---------- pernas-pilar
for sx,s in ((-1,'L'),(1,'R')):
    x=sx*1.0
    box((1.5,1.7,.6),(x,0,.3),STONE2,'shin_'+s)
    cyl(.72,2.0,(x,0,1.3),STONE,'shin_'+s,8,r2=.62)
    for zz in (.65,1.9):cyl(.78,.14,(x,0,zz),GOLD,'shin_'+s,8)
    box((.18,.05,1.3),(x,-.66,1.3),GLOW,'shin_'+s,bev=0)
    cyl(.95,.35,(x,0,2.45),GOLD,'thigh_'+s,8,r2=.75)
    cyl(.35,.12,(x,0,2.68),GLOW,'thigh_'+s,12)
    cyl(.62,1.6,(x,0,3.45),STONE,'thigh_'+s,8,r2=.72)
    for i in range(7):
        a=i/7*math.tau;torus(.16,.04,(x+math.cos(a)*.88,math.sin(a)*.88,.5),DARK,'shin_'+s,(math.pi/2,0,a))
# ---------- quadril
box((2.9,1.5,.8),(0,0,4.35),STONE2,'hips');box((3.0,1.6,.16),(0,0,4.72),GOLD,'hips',bev=.02)
# ---------- tronco catedral
box((3.4,1.9,2.6),(0,0,6.1),STONE,'chest');box((3.5,2.0,.18),(0,0,7.42),GOLD,'chest',bev=.02)
bpy.ops.mesh.primitive_cone_add(vertices=4,radius1=2.2,radius2=0,depth=1.2,location=(0,0,8.1),rotation=(0,0,math.pi/4));o=bpy.context.object;o.scale=(1,.62,1);bpy.ops.object.transform_apply(scale=True);add(o,STONE2,'chest')
for x in (-1.45,1.45):
    cyl(.28,1.9,(x,-.6,7.3),STONE2,'chest',6);cone(.32,.8,(x,-.6,8.6),GOLD,'chest')
cyl(.22,1.3,(0,-.7,8.2),STONE2,'chest',6);cone(.26,.6,(0,-.7,9.1),GOLD,'chest')
cyl(.95,.14,(0,-.98,6.3),GOLD,'chest',24,rot=(math.pi/2,0,0));cyl(.82,.1,(0,-1.02,6.3),GLOW,'chest',24,rot=(math.pi/2,0,0))
torus(.45,.06,(0,-1.08,6.3),GOLD,'chest',(math.pi/2,0,0))
for i in range(8):
    a=i/8*math.tau;box((.06,.04,.8),(math.cos(a)*.4,-1.06,6.3+math.sin(a)*.4),GOLD,'chest',(0,a,0),bev=0)
for i,(x,z) in enumerate(((-2.3,8.8),(2.4,9.2),(-1.9,9.8),(2.0,6.0),(-2.5,5.4),(0,10.4))):
    box((.35,.35,.35),(x,.6,z),STONE2,'chest',(i,i*2,i))
# ---------- ombros
for sx,s in ((-1,'L'),(1,'R')):
    box((1.5,1.6,1.3),(sx*2.35,0,7.4),STONE2,'arm_'+s);box((1.6,1.7,.14),(sx*2.35,0,8.0),GOLD,'arm_'+s,bev=.02)
# braço direito (martelo)
box((1.0,1.0,1.4),(2.5,0,6.1),STONE,'arm_R');box((.12,.06,1.0),(2.5,-.52,6.1),GLOW,'arm_R',bev=0)
box((1.3,1.3,1.6),(2.6,0,4.5),STONE2,'fore_R');box((1.35,1.35,.14),(2.6,0,5.1),GOLD,'fore_R',bev=.02);box((.1,.06,1.2),(2.6,-.68,4.4),GLOW,'fore_R',bev=0)
box((1.8,1.8,1.9),(2.7,0,2.75),STONE,'hand_R');box((.12,.06,1.4),(2.7,-.92,2.8),GLOW,'hand_R',bev=0);box((1.4,.06,.12),(2.7,-.92,2.4),GLOW,'hand_R',bev=0)
for i in range(4):box((.38,.4,.42),(2.1+i*.4,-.85,1.95),STONE2,'hand_R')
# braço esquerdo (régua/compasso)
cyl(.35,1.6,(-2.45,0,6.0),STONE,'arm_L',6);cyl(.42,.14,(-2.45,0,5.2),GOLD,'arm_L',6)
cyl(.3,1.6,(-2.5,0,4.3),STONE2,'fore_L',6);cyl(.36,.12,(-2.5,0,3.5),GOLD,'fore_L',6)
box((.6,.5,.6),(-2.5,0,3.15),STONE,'hand_L')
cyl(.32,.12,(-2.5,-.4,2.7),GOLD,'hand_L',20,rot=(math.pi/2,0,0));cyl(.14,.14,(-2.5,-.47,2.7),GLOW,'hand_L',12,rot=(math.pi/2,0,0))
for sx in (-1,1):
    bpy.ops.mesh.primitive_cone_add(vertices=6,radius1=.08,radius2=0,depth=2.9,location=(-2.5+sx*.35,-.4,1.25),rotation=(0,sx*.24,0));add(bpy.context.object,GOLD,'hand_L')
# ---------- cabeça
bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=1,location=(0,-.1,9.55));o=bpy.context.object;o.scale=(.55,.5,.78);bpy.ops.object.transform_apply(scale=True);bpy.ops.object.shade_smooth();add(o,MARB,'head')
box((.07,.1,.85),(0,-.6,9.55),GLOW,'head',bev=0)
for i in range(12):
    if i in (2,7):continue
    a=i/12*math.tau;box((.28,.2,.42),(math.cos(a)*1.3,.55,9.6+math.sin(a)*1.3),GOLD,'head',(0,-a,0))
# ---------- esqueleto
bpy.ops.object.armature_add(location=(0,0,0));arm=bpy.context.object;arm.name='Arquiteto';bpy.ops.object.mode_set(mode='EDIT');eb=arm.data.edit_bones;eb.remove(eb[0])
def bone(n,h,t,p=None):
    b=eb.new(n);b.head=h;b.tail=t
    if p:b.parent=eb[p]
    return b
bone('root',(0,0,0),(0,0,.5));bone('hips',(0,0,4.0),(0,0,4.8),'root');bone('chest',(0,0,4.8),(0,0,8.5),'hips');bone('head',(0,0,8.8),(0,0,10.3),'chest')
for sx,s in ((-1,'L'),(1,'R')):
    bone('arm_'+s,(sx*2.4,0,7.6),(sx*2.5,0,5.3),'chest');bone('fore_'+s,(sx*2.5,0,5.3),(sx*2.6,0,3.6),'arm_'+s);bone('hand_'+s,(sx*2.6,0,3.6),(sx*2.6,0,2.0),'fore_'+s)
    bone('thigh_'+s,(sx*1.0,0,4.2),(sx*1.0,0,2.4),'hips');bone('shin_'+s,(sx*1.0,0,2.4),(sx*1.0,0,.1),'thigh_'+s)
bpy.ops.object.mode_set(mode='OBJECT')
# juntar peças por osso e parentear rígido
from collections import defaultdict
groups=defaultdict(list)
for o,b in parts:groups[b].append(o)
for b,objs in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();j=bpy.context.object;j.name='parte_'+b
    j.parent=arm;j.parent_type='BONE';j.parent_bone=b
    pb=arm.data.bones[b];j.matrix_parent_inverse=(arm.matrix_world@pb.matrix_local@__import__('mathutils').Matrix.Translation((0,pb.length,0))).inverted()
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
act('golpe1',36,[(1,{}),(14,{'chest':(R(-12),0,R(-8)),'arm_R':(R(-150),0,R(-10)),'fore_R':(R(-20),0,0)}),(22,{'chest':(R(18),0,R(6)),'arm_R':(R(20),0,0),'fore_R':(R(-5),0,0),'hips@':(0,-.25,0)}),(36,{})])
act('golpe2',30,[(1,{}),(10,{'arm_L':(R(-30),0,R(25)),'fore_L':(R(-40),0,0),'chest':(0,0,R(10))}),(16,{'arm_L':(R(-95),0,R(-5)),'fore_L':(R(0),0,0),'chest':(R(8),0,R(-10))}),(30,{})])
act('morte',48,[(1,{}),(20,{'hips@':(0,-1.2,0),'thigh_L':(R(-60),0,0),'thigh_R':(R(-55),0,0),'shin_L':(R(90),0,0),'shin_R':(R(85),0,0),'chest':(R(25),0,0)}),(48,{'hips@':(0,-2.6,0),'thigh_L':(R(-85),0,0),'thigh_R':(R(-85),0,0),'shin_L':(R(100),0,0),'shin_R':(R(100),0,0),'chest':(R(70),0,0),'head':(R(30),0,0),'arm_L':(R(-40),0,R(40)),'arm_R':(R(-40),0,R(-40))})])
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_animations=True,export_animation_mode='NLA_TRACKS',export_apply=False)
print('OK',out)
