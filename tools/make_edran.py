import bpy, math
from mathutils import Vector, Matrix, Euler, Quaternion

def create_edran():
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 1. Create Armature
    arm_data = bpy.data.armatures.new("EdranRig")
    arm_obj = bpy.data.objects.new("EdranRig", arm_data)
    bpy.context.scene.collection.objects.link(arm_obj)
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode='EDIT')

    # Bone definitions: name, head, tail, parent
    # Height around 1.85m
    bone_defs = [
        ("hips", (0, 0, 0.98), (0, 0, 1.10), None),
        ("spine", (0, 0, 1.10), (0, 0, 1.28), "hips"),
        ("chest", (0, 0, 1.28), (0, 0, 1.48), "spine"),
        ("neck", (0, 0, 1.48), (0, 0, 1.58), "chest"),
        ("head", (0, 0, 1.58), (0, 0, 1.85), "neck"),
        # Left arm
        ("upperarm_l", (0.22, 0, 1.42), (0.46, 0, 1.42), "chest"),
        ("forearm_l", (0.46, 0, 1.42), (0.70, 0, 1.42), "upperarm_l"),
        ("hand_l", (0.70, 0, 1.42), (0.82, 0, 1.42), "forearm_l"),
        # Right arm
        ("upperarm_r", (-0.22, 0, 1.42), (-0.46, 0, 1.42), "chest"),
        ("forearm_r", (-0.46, 0, 1.42), (-0.70, 0, 1.42), "upperarm_r"),
        ("hand_r", (-0.70, 0, 1.42), (-0.82, 0, 1.42), "forearm_r"),
        # Left leg
        ("thigh_l", (0.12, 0, 0.98), (0.12, 0, 0.52), "hips"),
        ("shin_l", (0.12, 0, 0.52), (0.12, 0, 0.10), "thigh_l"),
        ("foot_l", (0.12, 0, 0.10), (0.12, 0.18, 0.0), "shin_l"),
        # Right leg
        ("thigh_r", (-0.12, 0, 0.98), (-0.12, 0, 0.52), "hips"),
        ("shin_r", (-0.12, 0, 0.52), (-0.12, 0, 0.10), "thigh_r"),
        ("foot_r", (-0.12, 0, 0.10), (-0.12, 0.18, 0.0), "shin_r"),
    ]

    edit_bones = {}
    for name, head, tail, parent in bone_defs:
        b = arm_data.edit_bones.new(name)
        b.head = Vector(head)
        b.tail = Vector(tail)
        edit_bones[name] = b

    for name, head, tail, parent in bone_defs:
        if parent:
            edit_bones[name].parent = edit_bones[parent]

    bpy.ops.object.mode_set(mode='OBJECT')

    # Materials
    def make_mat(name, color, roughness=0.6, metalness=0.0, emissive=(0,0,0,1)):
        mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metalness
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = emissive
        return mat

    mat_armor = make_mat("M_SteelArmor", (0.55, 0.58, 0.65, 1.0), roughness=0.35, metalness=0.85)
    mat_gold = make_mat("M_GoldTrim", (0.85, 0.70, 0.28, 1.0), roughness=0.3, metalness=0.9)
    mat_cloth = make_mat("M_OrderTunic", (0.15, 0.22, 0.40, 1.0), roughness=0.8, metalness=0.0)
    mat_leather = make_mat("M_Leather", (0.35, 0.20, 0.12, 1.0), roughness=0.7, metalness=0.0)
    mat_skin = make_mat("M_Skin", (0.82, 0.65, 0.52, 1.0), roughness=0.6, metalness=0.0)
    mat_hair = make_mat("M_Hair", (0.28, 0.18, 0.10, 1.0), roughness=0.8, metalness=0.0)
    mat_bandage = make_mat("M_BandageWounded", (0.75, 0.70, 0.65, 1.0), roughness=0.8, metalness=0.0)

    # Helper mesh creator
    parts = []

    # 1. Torso / Breastplate
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.30))
    torso = bpy.context.active_object
    torso.name = "Edran_Torso"
    torso.scale = (0.24, 0.15, 0.22)
    torso.data.materials.append(mat_armor)
    parts.append((torso, [("chest", 0.7), ("spine", 0.3)]))

    # Tunic / Tabard lower (hanging from waist)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.95))
    tabard = bpy.context.active_object
    tabard.name = "Edran_Tabard"
    tabard.scale = (0.22, 0.16, 0.18)
    tabard.data.materials.append(mat_cloth)
    parts.append((tabard, [("hips", 0.8), ("spine", 0.2)]))

    # Belt
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.08, location=(0, 0, 1.06))
    belt = bpy.context.active_object
    belt.name = "Edran_Belt"
    belt.scale = (1.05, 0.75, 1.0)
    belt.data.materials.append(mat_leather)
    parts.append((belt, [("hips", 0.7), ("spine", 0.3)]))

    # Belt Buckle (Gold)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.165, 1.06))
    buckle = bpy.context.active_object
    buckle.name = "Edran_Buckle"
    buckle.scale = (0.05, 0.02, 0.05)
    buckle.data.materials.append(mat_gold)
    parts.append((buckle, [("hips", 0.7), ("spine", 0.3)]))

    # Crest / Sunburst on chest (Gold Order symbol)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.02, location=(0, -0.155, 1.36))
    crest = bpy.context.active_object
    crest.name = "Edran_Crest"
    crest.rotation_euler = (math.pi/2, 0, 0)
    crest.data.materials.append(mat_gold)
    parts.append((crest, [("chest", 1.0)]))

    # Pauldrons (Shoulders)
    for side, sign, bname in [("L", 1, "upperarm_l"), ("R", -1, "upperarm_r")]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.10, location=(sign * 0.28, 0, 1.45))
        pld = bpy.context.active_object
        pld.name = f"Edran_Pauldron_{side}"
        pld.scale = (1.1, 1.0, 0.8)
        pld.data.materials.append(mat_armor)
        parts.append((pld, [(bname, 0.85), ("chest", 0.15)]))

    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0, 0, 1.68))
    head = bpy.context.active_object
    head.name = "Edran_Head"
    head.scale = (0.95, 1.05, 1.1)
    head.data.materials.append(mat_skin)
    parts.append((head, [("head", 1.0)]))

    # Hair
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.115, location=(0, -0.015, 1.72))
    hair = bpy.context.active_object
    hair.name = "Edran_Hair"
    hair.scale = (0.98, 1.02, 1.05)
    hair.data.materials.append(mat_hair)
    parts.append((hair, [("head", 1.0)]))

    # Bandage / Wounded dressing around right shoulder / upper arm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.12, location=(-0.36, 0, 1.42))
    bdg = bpy.context.active_object
    bdg.name = "Edran_Bandage"
    bdg.rotation_euler = (0, math.pi/2, 0)
    bdg.data.materials.append(mat_bandage)
    parts.append((bdg, [("upperarm_r", 1.0)]))

    # Arms and Forearms
    for side, sign, b_upper, b_fore, b_hand in [("L", 1, "upperarm_l", "forearm_l", "hand_l"), ("R", -1, "upperarm_r", "forearm_r", "hand_r")]:
        # Upper arm
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.22, location=(sign * 0.35, 0, 1.42))
        uarm = bpy.context.active_object
        uarm.name = f"Edran_UpperArm_{side}"
        uarm.rotation_euler = (0, math.pi/2, 0)
        uarm.data.materials.append(mat_cloth)
        parts.append((uarm, [(b_upper, 1.0)]))

        # Gauntlet (forearm)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.22, location=(sign * 0.58, 0, 1.42))
        farm = bpy.context.active_object
        farm.name = f"Edran_Gauntlet_{side}"
        farm.rotation_euler = (0, math.pi/2, 0)
        farm.data.materials.append(mat_armor)
        parts.append((farm, [(b_fore, 1.0)]))

        # Hand / Glove
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.75, 0, 1.42))
        hand = bpy.context.active_object
        hand.name = f"Edran_Hand_{side}"
        hand.scale = (0.05, 0.045, 0.04)
        hand.data.materials.append(mat_leather)
        parts.append((hand, [(b_hand, 1.0)]))

    # Legs (Thighs, Shin/Greaves, Boots)
    for side, sign, b_thigh, b_shin, b_foot in [("L", 1, "thigh_l", "shin_l", "foot_l"), ("R", -1, "thigh_r", "shin_r", "foot_r")]:
        # Thigh
        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.42, location=(sign * 0.12, 0, 0.74))
        thigh = bpy.context.active_object
        thigh.name = f"Edran_Thigh_{side}"
        thigh.data.materials.append(mat_cloth)
        parts.append((thigh, [(b_thigh, 1.0)]))

        # Greave (shin plate)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.40, location=(sign * 0.12, 0, 0.31))
        greave = bpy.context.active_object
        greave.name = f"Edran_Greave_{side}"
        greave.data.materials.append(mat_armor)
        parts.append((greave, [(b_shin, 1.0)]))

        # Boot
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.12, 0.06, 0.05))
        boot = bpy.context.active_object
        boot.name = f"Edran_Boot_{side}"
        boot.scale = (0.065, 0.12, 0.05)
        boot.data.materials.append(mat_leather)
        parts.append((boot, [(b_foot, 1.0)]))

    # Join meshes into one single mesh
    bpy.ops.object.select_all(action='DESELECT')
    for p, _ in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0][0]
    bpy.ops.object.join()
    body_mesh = bpy.context.active_object
    body_mesh.name = "Edran_Mesh"

    # Apply all transformations to mesh
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # Assign vertex groups based on proximity to parts
    for name, head, tail, parent in bone_defs:
        body_mesh.vertex_groups.new(name=name)

    for v in body_mesh.data.vertices:
        co = v.co
        z = co.z
        x = co.x
        abs_x = abs(x)
        side = "_l" if x >= 0 else "_r"

        if z > 1.55:
            # Head
            body_mesh.vertex_groups["head"].add([v.index], 1.0, 'REPLACE')
        elif z > 1.45 and abs_x < 0.12:
            body_mesh.vertex_groups["neck"].add([v.index], 1.0, 'REPLACE')
        elif abs_x > 0.20 and z > 1.25:
            # Arms
            if abs_x > 0.68:
                body_mesh.vertex_groups["hand" + side].add([v.index], 1.0, 'REPLACE')
            elif abs_x > 0.44:
                body_mesh.vertex_groups["forearm" + side].add([v.index], 1.0, 'REPLACE')
            else:
                body_mesh.vertex_groups["upperarm" + side].add([v.index], 0.9, 'REPLACE')
                body_mesh.vertex_groups["chest"].add([v.index], 0.1, 'REPLACE')
        elif z > 1.25:
            body_mesh.vertex_groups["chest"].add([v.index], 0.85, 'REPLACE')
            body_mesh.vertex_groups["spine"].add([v.index], 0.15, 'REPLACE')
        elif z > 1.06:
            body_mesh.vertex_groups["spine"].add([v.index], 0.7, 'REPLACE')
            body_mesh.vertex_groups["hips"].add([v.index], 0.3, 'REPLACE')
        elif z > 0.92:
            body_mesh.vertex_groups["hips"].add([v.index], 1.0, 'REPLACE')
        elif z > 0.50:
            body_mesh.vertex_groups["thigh" + side].add([v.index], 1.0, 'REPLACE')
        elif z > 0.10:
            body_mesh.vertex_groups["shin" + side].add([v.index], 1.0, 'REPLACE')
        else:
            body_mesh.vertex_groups["foot" + side].add([v.index], 1.0, 'REPLACE')

    # Parent mesh to armature with Armature modifier
    mod = body_mesh.modifiers.new("Armature", 'ARMATURE')
    mod.object = arm_obj
    body_mesh.parent = arm_obj

    # Export GLB
    filepath = "models/edran452.glb"
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=filepath, export_format='GLB', export_yup=True)
    print(f"Edran model successfully exported to {filepath}")

create_edran()
