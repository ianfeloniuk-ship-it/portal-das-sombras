import bpy, sys, mathutils
argv = sys.argv[sys.argv.index('--')+1:]
src, out = argv[0], argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc = bpy.context.scene
for a in bpy.data.actions: pass
for o in sc.objects:
    if o.animation_data: o.animation_data.action = None
bpy.context.view_layer.update()
mn = mathutils.Vector((1e9,)*3); mx = mathutils.Vector((-1e9,)*3)
for o in sc.objects:
    if o.type=='MESH' and o.name.startswith('Icosphere'):
        o.hide_render=True
    elif o.type=='MESH':
        dg = bpy.context.evaluated_depsgraph_get()
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
        for v in me.vertices:
            w = ev.matrix_world @ v.co
            mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
print('BBOX', mn, mx)
c = (mn+mx)/2; h = mx.z-mn.z
cam_d = bpy.data.cameras.new('cam'); cam_d.type='ORTHO'; cam_d.ortho_scale = max(h*1.08, (mx.x-mn.x)*1.06*1.5)
cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam)
# glTF +Z forward -> Blender -Y; camera looks from -Y toward +Y
cam.location = (c.x, mn.y - 10, c.z); cam.rotation_euler = (1.5708, 0, 0)
sc.camera = cam
def light(name, rot, e):
    l = bpy.data.lights.new(name,'SUN'); l.energy=e
    ob = bpy.data.objects.new(name,l); ob.rotation_euler=rot; sc.collection.objects.link(ob)
light('key',(1.1,0,-0.5),3.5); light('fill',(1.2,0,0.8),1.5); light('rim',(-0.8,0,3.1),2.0)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes=True
w.node_tree.nodes['Background'].inputs[0].default_value=(0.78,0.78,0.78,1)
w.node_tree.nodes['Background'].inputs[1].default_value=0.6
sc.render.engine='BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x=1024; sc.render.resolution_y=1536
sc.render.film_transparent=False
sc.view_settings.view_transform='Standard'
sc.render.filepath=out
bpy.ops.render.render(write_still=True)
