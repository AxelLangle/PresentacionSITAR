'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Componente simulando el modelo de PCB
function PCBModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.1, 2.5]} />
        <meshStandardMaterial color="#0f5132" metalness={0.6} roughness={0.3} />
        
        {/* Tooltip 1: ATtiny1614 */}
        <Html position={[-1, 0.5, 0]} center>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl w-32">
            <p className="text-white text-xs font-bold text-center">ATtiny1614</p>
          </div>
        </Html>

        {/* Tooltip 2: SIM800L EVB */}
        <Html position={[1, 0.5, -0.5]} center>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl w-36">
            <p className="text-white text-xs font-bold text-center">SIM800L EVB</p>
          </div>
        </Html>

        {/* Tooltip 3: Modbus RS485 */}
        <Html position={[1, 0.5, 0.8]} center>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl w-36">
            <p className="text-white text-xs font-bold text-center">Modbus RS485</p>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

export default function Slide4() {
  return (
    <div className="h-screen w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black relative flex items-center justify-center">
      <div className="absolute top-16 left-16 z-10 pointer-events-none">
        <h2 className="text-4xl font-bold text-white tracking-tight">Hardware / PCB</h2>
        <p className="text-gray-400 mt-2 text-lg">Modelo interactivo del diseño en KiCad</p>
      </div>
      
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <PCBModel />
          </Float>
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}
