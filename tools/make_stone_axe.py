import bpy, math, os
from math import sin, cos, pi
from mathutils import Vector

OUT_GLB = os.path.abspath(r"C:\Users\irror\portal-das-sombras\models\m437\machado-pedra.glb")
os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)

# Clean scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def create_mat(name, col, metal=0.0, rough=0.6):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*col, 1)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*col, 1)
        bsdf.inputs['Metallic'].default_value = metal
        bsdf.inputs['Roughness'].default_value = rough
    return m

mat_wood = create_mat('Madeira Rustica', (0.18, 0.11, 0.06), 0.0, 0.75)
mat_stone = create_mat('Pedra Lascada', (0.28, 0.29, 0.31), 0.05, 0.85)
mat_edge = create_mat('Gume Lascado', (0.42, 0.44, 0.46), 0.1, 0.6)
mat_fiber = create_mat('Fibras Vegetais', (0.55, 0.45, 0.28), 0.0, 0.9)

created_objects = []

def finish_obj(o, name, m, bevel=0.003):
    o.name = name
    o.data.materials.clear()
    o.data.materials.append(m)
    if bevel > 0:
        b = o.modifiers.new('Bevel', 'BEVEL')
        b.width = bevel
        b.segments = 2
        o.modifiers.new('WeightedNormal', 'WEIGHTED_NORMAL')
    created_objects.append(o)
    return o

# 1. Haste de madeira rustica (Handle)
# Curve with subtle organic curve
curve_data = bpy.data.curves.new('HasteCurve', 'CURVE')
curve_data.dimensions = '3D'
curve_data.resolution_u = 16
curve_data.bevel_depth = 0.016
curve_data.bevel_resolution = 4
spline = curve_data.splines.new('BEZIER')
# 4 control points for a gentle curve
spline.bezier_points.add(3)
pts = [
    (Vector((0.005, 0.0, 0.02)), Vector((0.005, 0.0, -0.05)), Vector((0.005, 0.0, 0.09))),
    (Vector((0.0, 0.002, 0.22)), Vector((0.0, 0.002, 0.15)), Vector((0.0, 0.002, 0.29))),
    (Vector((-0.012, 0.0, 0.42)), Vector((-0.012, 0.0, 0.35)), Vector((-0.012, 0.0, 0.49))),
    (Vector((-0.008, 0.0, 0.58)), Vector((-0.008, 0.0, 0.52)), Vector((-0.008, 0.0, 0.64)))
]
for bp, (co, hl, hr) in zip(spline.bezier_points, pts):
    bp.co = co
    bp.handle_left = hl
    bp.handle_right = hr

haste_obj = bpy.data.objects.new('Haste_Madeira', curve_data)
bpy.context.collection.objects.link(haste_obj)
finish_obj(haste_obj, 'Haste_Madeira', mat_wood, 0)

# Convert curve to mesh so we can join or export cleanly
bpy.context.view_layer.objects.active = haste_obj
haste_obj.select_set(True)
bpy.ops.object.convert(target='MESH')
haste_obj.select_set(False)

# 2. Empunhadura de fibra trancada (Grip wrap at base)
for i in range(14):
    z = 0.06 + i * 0.014
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.0175,
        minor_radius=0.0028,
        location=(0.003, 0.0, z)
    )
    torus = bpy.context.object
    finish_obj(torus, f'Grip_Wrap_{i}', mat_fiber, 0)

# Pomo na base da haste
bpy.ops.mesh.primitive_uv_sphere_add(
    segments=12, ring_count=8, radius=0.021,
    location=(0.005, 0.0, 0.02)
)
pomo = bpy.context.object
finish_obj(pomo, 'Pomo_Madeira', mat_wood, 0.002)

# 3. Pedra Lascada (Flaked Stone Axe Head)
# Flaked triangular wedge pointing in -X, with thick back in +X
wedge_pts = [
    # Cutting blade arc (left, -X)
    (-0.16, 0.54),
    (-0.175, 0.565),
    (-0.18, 0.59),
    (-0.175, 0.615),
    (-0.16, 0.64),
    # Top slope
    (-0.07, 0.635),
    (0.01, 0.625),
    (0.06, 0.615),
    # Back hammer flat (+X)
    (0.065, 0.59),
    (0.06, 0.565),
    # Bottom slope
    (0.01, 0.555),
    (-0.07, 0.545)
]

n = len(wedge_pts)
verts = []
depth = 0.038
for d in (-depth/2, depth/2):
    for x, z in wedge_pts:
        # Taper toward cutting edge
        t = max(0.0, (-x - 0.02) / 0.16)
        dy = d * (1.0 - t * 0.72)
        verts.append((x, dy, z))

# Add central ridge points on both sides for faceted flaked look
faces = []
# Top and bottom caps
faces.append(tuple(range(n-1, -1, -1)))
faces.append(tuple(range(n, 2*n)))
# Side bands
for i in range(n):
    faces.append((i, (i+1)%n, (i+1)%n + n, i + n))

stone_mesh = bpy.data.meshes.new('Pedra_Lascada')
stone_mesh.from_pydata(verts, [], faces)
stone_mesh.update()
stone_obj = bpy.data.objects.new('Pedra_Lascada', stone_mesh)
bpy.context.collection.objects.link(stone_obj)
finish_obj(stone_obj, 'Pedra_Lascada', mat_stone, 0.003)

# 4. Amarrações de Fibra trançada (Twine lashings in X shape around axe eye)
# Ring around shaft above and below stone
for z_col in (0.53, 0.63):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.021, minor_radius=0.0035,
        location=(-0.009, 0.0, z_col)
    )
    col = bpy.context.object
    finish_obj(col, f'Colar_Fibra_{z_col}', mat_fiber, 0)

# Diagonal cross lashing 1
bpy.ops.mesh.primitive_cylinder_add(
    vertices=8, radius=0.004, depth=0.09,
    location=(-0.015, 0.022, 0.58),
    rotation=(0.4, 0.5, 0.8)
)
x1 = bpy.context.object
finish_obj(x1, 'Amarra_X1', mat_fiber, 0)

# Diagonal cross lashing 2
bpy.ops.mesh.primitive_cylinder_add(
    vertices=8, radius=0.004, depth=0.09,
    location=(-0.015, -0.022, 0.58),
    rotation=(-0.4, 0.5, -0.8)
)
x2 = bpy.context.object
finish_obj(x2, 'Amarra_X2', mat_fiber, 0)

# Join all objects into a single cohesive mesh
bpy.ops.object.select_all(action='SELECT')
bpy.context.view_layer.objects.active = stone_obj
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
final_axe = bpy.context.object
final_axe.name = 'Machado_De_Pedra'

# Normalize transform
final_axe.location = (0, 0, 0)
final_axe.rotation_euler = (0, 0, 0)
final_axe.scale = (1, 1, 1)

# Export GLB
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format='GLB',
    use_selection=True,
    export_apply=True
)

print(f"MACHADO_PEDRA_SUCCESS: {OUT_GLB} ({os.path.getsize(OUT_GLB)} bytes)")
