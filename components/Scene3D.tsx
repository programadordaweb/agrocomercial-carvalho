"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment, PerspectiveCamera, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ── Wheat / Grain stalk ── */
function WheatStalk({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stem */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 1.2, 8]} />
        <meshStandardMaterial color="#6d8c3f" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Grain head */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#d4a843" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#c49a35" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#c49a35" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Sack / bag of grain ── */
function GrainSack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} castShadow receiveShadow>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.44, 12]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Top fold */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#b8994e" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Band */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <torusGeometry args={[0.19, 0.015, 8, 20]} />
        <meshStandardMaterial color="#8B6914" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Tractor body ── */
function Tractor() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group ref={group} position={[0, -0.3, 0]} castShadow receiveShadow>
      {/* Main body */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#2e7d32" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Hood / engine */}
      <mesh position={[0.55, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.35, 0.5]} />
        <meshStandardMaterial color="#1a4d1a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Exhaust pipe */}
      <mesh position={[0.7, 0.75, 0.15]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.3, 12]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.1, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.4, 0.55]} />
        <meshStandardMaterial color="#1a4d1a" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Cabin glass */}
      <mesh position={[-0.1, 0.95, 0.28]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.01]} />
        <meshStandardMaterial color="#a8d5e2" metalness={0.95} roughness={0.05} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.16, 0.95, 0]} castShadow>
        <boxGeometry args={[0.01, 0.35, 0.5]} />
        <meshStandardMaterial color="#a8d5e2" metalness={0.95} roughness={0.05} transparent opacity={0.6} />
      </mesh>
      {/* Rear wheels (big) */}
      <mesh position={[-0.3, 0.22, 0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[-0.3, 0.22, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rear wheel rims */}
      <mesh position={[-0.3, 0.22, 0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 12]} />
        <meshStandardMaterial color="#f5c518" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.3, 0.22, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 12]} />
        <meshStandardMaterial color="#f5c518" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Front wheels (small) */}
      <mesh position={[0.55, 0.14, 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0.55, 0.14, -0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Front wheel rims */}
      <mesh position={[0.55, 0.14, 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.09, 12]} />
        <meshStandardMaterial color="#f5c518" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.55, 0.14, -0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.09, 12]} />
        <meshStandardMaterial color="#f5c518" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ── Ground ── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
      <circleGeometry args={[4, 64]} />
      <meshStandardMaterial color="#4a3829" roughness={0.95} metalness={0} />
    </mesh>
  );
}

/* ── Grass patches ── */
function Grass({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.3) * 0.06, 0.06, Math.cos(i * 1.3) * 0.06]} rotation={[0, 0, Math.sin(i) * 0.3]} castShadow>
          <boxGeometry args={[0.01, 0.12, 0.01]} />
          <meshStandardMaterial color="#5cb85d" metalness={0} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Full Scene ── */
function FarmScene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Professional Lighting Setup */}
      <PerspectiveCamera makeDefault position={[3, 2.5, 3]} fov={45} />
      
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight 
        position={[8, 12, 8]} 
        intensity={1.8} 
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 6, -5]} intensity={0.5} color="#b3e5fc" />
      <pointLight position={[2, 3, 2]} intensity={1} color="#f5c518" distance={10} decay={2} />
      <pointLight position={[-2, 2, -2]} intensity={0.6} color="#ff9500" distance={8} decay={2} />

      {/* Sky and environment */}
      <Environment preset="sunset" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
        <Tractor />
      </Float>

      {/* Enhanced Wheat field */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 1.3 + Math.random() * 0.9;
        return (
          <WheatStalk
            key={`w${i}`}
            position={[Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius]}
            rotation={[0, angle, Math.sin(i * 0.7) * 0.15 + (scrollY * 0.0001)]}
          />
        );
      })}

      {/* Inner ring of wheat */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.3;
        const radius = 0.8 + Math.random() * 0.4;
        return (
          <WheatStalk
            key={`w2${i}`}
            position={[Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius]}
            rotation={[0, angle + 0.5, Math.sin(i) * 0.15 + (scrollY * 0.0001)]}
          />
        );
      })}

      {/* Enhanced Grain sacks */}
      <GrainSack position={[-1.2, -0.6, 0.7]} />
      <GrainSack position={[-1.5, -0.6, 0.2]} />
      <GrainSack position={[1.3, -0.6, -0.7]} />
      <GrainSack position={[0.9, -0.6, -0.3]} />

      {/* Grass patches */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <Grass key={`g${i}`} position={[Math.cos(angle) * 1.8, -0.6, Math.sin(angle) * 1.8]} />
        );
      })}

      <Ground />
      
      {/* Sparkles for magical effect */}
      <Sparkles count={100} scale={4} size={5.5} speed={0.5} opacity={0.6} />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2}
        zoomSpeed={1}
        panSpeed={0.8}
      />
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full\">
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ 
          alpha: true, 
          antialias: true,
          precision: "highp",
          powerPreference: "high-performance"
        }}
        shadows
      >
        <FarmScene />
      </Canvas>
    </div>
  );
}
