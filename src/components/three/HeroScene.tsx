import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Azure blue color
const AZURE_COLOR = new THREE.Color('#0078D4');
const AZURE_LIGHT = new THREE.Color('#00A8E8');

interface FloatingNodeProps {
  position: [number, number, number];
  size: number;
  speed: number;
  distort: number;
  color: THREE.Color;
  emissive?: boolean;
}

const FloatingNode = ({ position, size, speed, distort, color, emissive = false }: FloatingNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive ? color : undefined}
          emissiveIntensity={emissive ? 0.5 : 0}
          roughness={0.3}
          metalness={0.8}
          distort={distort}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

interface AzureGlowSphereProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

const AzureGlowSphere = ({ mousePosition }: AzureGlowSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      
      // Scale on hover
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={[0, 0, -2]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <torusKnotGeometry args={[1.2, 0.4, 100, 16]} />
        <meshStandardMaterial
          color={AZURE_COLOR}
          emissive={AZURE_COLOR}
          emissiveIntensity={hovered ? 1 : 0.6}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

interface ParticleFieldProps {
  count: number;
}

const ParticleField = ({ count }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={AZURE_LIGHT}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

interface StarLayerProps {
  count: number;
  depthRange: [number, number];
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  multiplier: number;
  size?: number;
  yOffset?: number;
}

const StarLayer = ({ count, depthRange, mousePosition, multiplier, size = 0.06, yOffset = 0 }: StarLayerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = Math.random() * (depthRange[1] - depthRange[0]) + depthRange[0];
    }
    return pos;
  }, [count, depthRange]);

  useFrame(() => {
    if (groupRef.current) {
      const targetX = -mousePosition.current.x * multiplier;
      const targetY = -mousePosition.current.y * multiplier * 0.6 + yOffset;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.0001) * 0.002;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = Date.now() * 0.00002;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={size} color={AZURE_LIGHT} transparent opacity={0.85} sizeAttenuation />
      </points>
    </group>
  );
};

interface SceneContentProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

const SceneContent = ({ mousePosition }: SceneContentProps) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const foregroundRef = useRef<THREE.Group>(null);
  
  // Store target values for smooth interpolation
  const target = useRef({ x: 0, y: 0 });
  
  useFrame(() => {
    // Update targets based on mouse position
    target.current.x = mousePosition.current.x * 0.5;
    target.current.y = mousePosition.current.y * 0.3;
    
    // Smoothly interpolate camera position for parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x * 0.8, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, target.current.y * 0.5, 0.05);
    camera.lookAt(0, 0, -2);
    
    // Move foreground elements more for depth effect
    if (foregroundRef.current) {
      foregroundRef.current.position.x = THREE.MathUtils.lerp(
        foregroundRef.current.position.x,
        -target.current.x * 1.5,
        0.08
      );
      foregroundRef.current.position.y = THREE.MathUtils.lerp(
        foregroundRef.current.position.y,
        -target.current.y * 1,
        0.08
      );
    }
    
    // Move background group less
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        -target.current.x * 0.3,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -target.current.y * 0.2,
        0.03
      );
    }
  });

  const nodes = useMemo(() => [
    { position: [-5, 2, -8] as [number, number, number], size: 0.4, speed: 0.8, distort: 0.3, color: AZURE_COLOR },
    { position: [6, -1, -10] as [number, number, number], size: 0.5, speed: 0.6, distort: 0.4, color: AZURE_LIGHT },
    { position: [-3, -2, -6] as [number, number, number], size: 0.3, speed: 1.0, distort: 0.2, color: new THREE.Color('#1a1a2e') },
    { position: [4, 3, -12] as [number, number, number], size: 0.6, speed: 0.5, distort: 0.35, color: AZURE_COLOR },
    { position: [-6, -3, -14] as [number, number, number], size: 0.7, speed: 0.4, distort: 0.25, color: new THREE.Color('#0a0a15') },
    { position: [7, 0, -9] as [number, number, number], size: 0.35, speed: 0.9, distort: 0.3, color: AZURE_LIGHT },
  ], []);

  const foregroundNodes = useMemo(() => [
    { position: [-2.5, 1.5, 2] as [number, number, number], size: 0.15, speed: 1.2, distort: 0.2, color: AZURE_COLOR, emissive: true },
    { position: [3, -1, 1] as [number, number, number], size: 0.12, speed: 1.4, distort: 0.15, color: AZURE_LIGHT, emissive: true },
    { position: [-1, -2, 3] as [number, number, number], size: 0.1, speed: 1.6, distort: 0.1, color: AZURE_COLOR, emissive: true },
    { position: [2, 2.5, 2.5] as [number, number, number], size: 0.08, speed: 1.8, distort: 0.1, color: AZURE_LIGHT, emissive: true },
  ], []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 5]} intensity={2} color={AZURE_COLOR} distance={20} />
      <pointLight position={[-5, 5, -5]} intensity={1} color={AZURE_LIGHT} distance={15} />
      <pointLight position={[5, -5, -5]} intensity={0.8} color="#ffffff" distance={10} />
      
      {/* Background particles */}
      <ParticleField count={120} />

      {/* Responsive star layers (move with cursor) */}
      <StarLayer count={220} depthRange={[-20, -6]} mousePosition={mousePosition} multiplier={0.25} size={0.04} />
      <StarLayer count={80} depthRange={[-4, 3]} mousePosition={mousePosition} multiplier={0.9} size={0.08} />
      {/* Extra bottom layer to add depth near the bottom of the hero */}
      <StarLayer count={140} depthRange={[1, 6]} mousePosition={mousePosition} multiplier={1.4} size={0.06} yOffset={-8} />
      
      {/* Background nodes */}
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <FloatingNode key={i} {...node} />
        ))}
      </group>
      
      {/* Main Azure glow sphere */}
      <AzureGlowSphere mousePosition={mousePosition} />
      
      {/* Foreground nodes (move more with cursor) */}
      <group ref={foregroundRef}>
        {foregroundNodes.map((node, i) => (
          <FloatingNode key={`fg-${i}`} {...node} />
        ))}
      </group>
    </>
  );
};

const HeroScene = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Local handler still present for accuracy when pointer is over the canvas container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosition.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  // Add global listeners so background responds even when cursor is over UI elements
  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if (e instanceof TouchEvent) {
        if (e.touches && e.touches[0]) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
      } else {
        const me = e as MouseEvent;
        clientX = me.clientX;
        clientY = me.clientY;
      }

      mousePosition.current = {
        x: (clientX / window.innerWidth - 0.5) * 2,
        y: -(clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', handleWindowMove);
    window.addEventListener('touchmove', handleWindowMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('touchmove', handleWindowMove as EventListener);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
