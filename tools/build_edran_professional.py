import bpy, math
from mathutils import Vector, Euler

def build_edran():
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 1. Load base character from viajante153.glb
    bpy.ops.import_scene.gltf(filepath='models/viajante153.glb')
    arm = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE'][0]
    arm.name = 'EdranArmature'

    keep_viajante = {
        'tripo_part_6',  # Head / Hair / Face
        'tripo_part_7',  # Left Hand / Glove
        'tripo_part_8',  # Right Hand / Glove
        'tripo_part_4',  # Trousers / Gambeson legs
        'tripo_part_5',  # Left Boot
        'tripo_part_10', # Right Boot
        'tripo_part_9',  # Belt & Buckle
        'tripo_part_11'  # Belt Pouches
    }

    for o in list(bpy.context.scene.objects):
        if o.type == 'MESH' and o.name not in keep_viajante:
            bpy.data.objects.remove(o)

    # 2. Load Steel Guard Helmet
    bpy.ops.import_scene.gltf(filepath='models/equipment323/helmet-F-common.glb')
    helmet = [o for o in bpy.context.scene.objects if o.name.startswith('Ferro_Elmo')][0]
    helmet.name = 'Edran_Helmet'
    # Remove unused objects from helmet file
    for o in list(bpy.context.scene.objects):
        if o != helmet and o.name not in keep_viajante and o != arm:
            bpy.data.objects.remove(o)

    # Bind helmet to head bone
    helmet.parent = arm
    for mod in list(helmet.modifiers):
        helmet.modifiers.remove(mod)
    mod = helmet.modifiers.new('Armature', 'ARMATURE')
    mod.object = arm
    vg = helmet.vertex_groups.new(name='head')
    vg.add(list(range(len(helmet.data.vertices))), 1.0, 'REPLACE')

    # 3. Load Royal Guard Armor set from set153/guardiao-rig.glb
    bpy.ops.import_scene.gltf(filepath='models/set153/guardiao-rig.glb')
    arm2 = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE' and o != arm][0]

    armor_pieces = {
        'set169_a',       # Plate Cuirass with Order of the Rift Sun Crest
        'set169_b_l',     # Left Pauldron & Arm plates
        'set169_b_r',     # Right Pauldron & Arm plates
        'set169_g_l_lo',  # Left Greave & Knee Poleyn
        'set169_g_r_lo',  # Right Greave & Knee Poleyn
    }

    for o in list(bpy.context.scene.objects):
        if o.type == 'MESH':
            if o.name not in keep_viajante and o != helmet and o.name not in armor_pieces:
                bpy.data.objects.remove(o)

    # Re-parent and link modifiers of armor pieces to EdranArmature
    for o in bpy.context.scene.objects:
        if o.name in armor_pieces:
            o.parent = arm
            for mod in o.modifiers:
                if mod.type == 'ARMATURE':
                    mod.object = arm

    bpy.data.objects.remove(arm2)

    # 4. Create modeled 3D combat bandage wrap around wounded left shoulder/arm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.14, vertices=16, location=(0.17, 0.02, 0.70))
    bandage = bpy.context.active_object
    bandage.name = 'Edran_CombatBandage'
    bandage.rotation_euler = (0.2, 0.4, 0.1)

    # Material for bandage
    mat_band = bpy.data.materials.new('M_Edran_CombatBandage')
    mat_band.use_nodes = True
    bsdf = mat_band.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (0.82, 0.76, 0.68, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.85
    bsdf.inputs['Metallic'].default_value = 0.0
    bandage.data.materials.append(mat_band)

    # Add solidify to give cloth thickness
    sol = bandage.modifiers.new('Solidify', 'SOLIDIFY')
    sol.thickness = 0.008
    bpy.ops.object.modifier_apply(modifier='Solidify')

    # Bind bandage to upperarm_l and chest
    bandage.parent = arm
    mod_b = bandage.modifiers.new('Armature', 'ARMATURE')
    mod_b.object = arm
    vg_arm = bandage.vertex_groups.new(name='upperarm_l')
    vg_chest = bandage.vertex_groups.new(name='chest')
    vg_arm.add(list(range(len(bandage.data.vertices))), 0.85, 'REPLACE')
    vg_chest.add(list(range(len(bandage.data.vertices))), 0.15, 'REPLACE')

    # 5. Clean up any leftover icospheres
    for o in list(bpy.context.scene.objects):
        if 'Icosphere' in o.name:
            bpy.data.objects.remove(o)

    # 6. Smooth shading on all meshes
    for o in bpy.context.scene.objects:
        if o.type == 'MESH':
            for p in o.data.polygons:
                p.use_smooth = True

    # 7. Export to models/edran452.glb
    out_path = 'models/edran452.glb'
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        use_selection=False,
        export_apply=False,
        export_skins=True,
        export_morph=True,
        export_materials='EXPORT',
        export_yup=True
    )
    print(f'Successfully built professional Edran model -> {out_path}')

if __name__ == '__main__':
    build_edran()
