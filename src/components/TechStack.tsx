import * as THREE from "three";

import { useRef, useMemo, useState, useEffect } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import ScrollIndicator from "./ScrollIndicator";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react.webp",
  "/images/next.webp",
  "/images/node.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
  "/images/flutter.webp",
  "/images/firebase.webp",
  "/images/supabase.webp",
  "/images/tailwind.webp",
  "/images/vercel.webp",
  "/images/render.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const spheres = [...Array(28)].map(() => ({
  scale: [0.95, 1.2, 1.05, 1.28, 1.12][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.05, delta);
    const pos = api.current?.translation();
    if (!pos) return;

    // Centering spring pull towards target center [0, -2.2, 0] to keep title completely clear
    const targetY = -2.2;
    const dx = -pos.x;
    const dy = targetY - pos.y;
    const dz = -pos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > 0.2) {
      const strength = Math.min(dist * 16, 32) * delta * scale;
      api.current?.applyImpulse(
        vec.set(
          (dx / dist) * strength,
          (dy / dist) * strength * 0.95,
          (dz / dist) * strength
        ),
        true
      );
    }
  });

  return (
    <RigidBody
      linearDamping={0.65}
      angularDamping={0.3}
      friction={0.2}
      restitution={0.5}
      position={[r(12), r(8) - 2.5, r(6)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.15 * scale]}
        args={[0.15 * scale, 0.28 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.25
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2.0]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting);
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack" id="techstack" ref={containerRef}>
      <div className="techstack-title-wrap">
        <div className="techstack-badge">
          <span>CORE STACK &amp; CAPABILITIES</span>
        </div>
        <h2>
          My <span>Techstack</span>
        </h2>
        <p className="techstack-hint">
          Interactive 3D Physics · Hover or drag to disperse
        </p>
      </div>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 22], fov: 35, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.4)}
        className="tech-canvas"
      >
        <ambientLight intensity={1.2} />
        <spotLight
          position={[15, 20, 20]}
          penumbra={1}
          angle={0.3}
          color="#ffffff"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 8, 6]} intensity={2.2} color="#f2eaff" />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[i % materials.length]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.65}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
      <ScrollIndicator targetId="contact" label="SCROLL TO CONTACT" />
    </div>
  );
};

export default TechStack;
