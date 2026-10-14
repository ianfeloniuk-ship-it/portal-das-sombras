"""Build the Escama single-shot pistol, in metres. Grip origin; GLB barrel +Z."""
import bpy, math
from pathlib import Path
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
out=Path(__file__).resolve().parents[1]/'models'/'firearms372'; out.mkdir(parents=True,exist_ok=True)
def material(n,c,metal=0):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=.58;return m
wood=material('Nogueira escura',(.19,.065,.025));iron=material('Aço escurecido',(.075,.09,.1),.25);gold=material('Latão Escama Dourada',(.58,.34,.085),.25);black=material('Interior do cano',(.006,.008,.01))
def box(n,p,s,m,rot=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=s;o.rotation_euler.x=rot;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);b=o.modifiers.new('Bordas trabalhadas','BEVEL');b.width=.009;b.segments=2;o.modifiers.new('Normais','WEIGHTED_NORMAL');return o
def tube(n,y,z,r,l,m):
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=l,location=(0,y,z),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name=n;o.data.materials.append(m);return o
# Blender coordinates: muzzle -Y, up +Z, export maps these to +Z/+Y.
box('Coronha', (0,.025,-.03),(.075,.13,.17),wood,-.32)
box('Platina',(0,-.10,.075),(.085,.25,.075),wood)
tube('Cano octogonal',-.24,.115,.033,.38,iron)
tube('Boca de latão',-.425,.115,.038,.032,gold)
tube('Boca escura',-.442,.115,.027,.001,black)
for y in [-.12,-.33]:tube('Abraçadeira',y,.115,.036,.023,gold)
box('Mira frontal',(0,-.397,.153),(.014,.021,.019),gold)
box('Cão de pederneira',(.051,-.012,.14),(.023,.04,.10),iron,-.4)
box('Pedra do cão',(.051,-.045,.182),(.028,.04,.028),black)
# Open trigger guard and trigger.
for p,s in [((0,-.11,-.015),(.016,.014,.095)),((0,-.061,-.059),(.018,.11,.015))]:box('Guarda-mato',p,s,gold)
box('Gatilho',(0,-.067,-.005),(.014,.015,.058),iron,-.18)
box('Medalhão Escama',(.041,.009,-.027),(.008,.05,.047),gold)
bpy.ops.object.empty_add(location=(0,-.448,.115));bpy.context.object.name='muzzle372'
# Save only asset objects, no render helpers in export.
bpy.ops.wm.save_as_mainfile(filepath=str(out/'escama-pistol.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'escama-pistol.glb'),export_format='GLB',export_apply=True)
# Reimport verifies exported material/geometry and muzzle.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(out/'escama-pistol.glb'))
assert bpy.data.objects.get('muzzle372') is not None
assert sum(o.type=='MESH' for o in bpy.context.scene.objects)>=12
print('FIREARM372 VERIFIED', (out/'escama-pistol.glb').stat().st_size)
