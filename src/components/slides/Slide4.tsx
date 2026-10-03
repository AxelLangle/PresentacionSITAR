'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/contexts/LanguageContext';

// Componente del modelo de PCB con auto-centrado y auto-escalado
function PCBModel({ showTooltips }: { showTooltips: boolean }) {
  // Carga el archivo real de la placa (.glb)
  const { scene } = useGLTF('/pcb.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Calcular bounding box del modelo para centrarlo y escalarlo
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    // Escalar para que la dimensión más grande sea ~5 unidades
    const s = maxDim > 0 ? 5 / maxDim : 1;
    return { center: c, scaleFactor: s };
  }, [scene]);
  
  // Posiciones exactas recolectadas (en coordenadas del modelo original)
  const tooltips = [
    { id: 1, label: "ATtiny1614", position: [236.25, 118.84, 7.95] as [number, number, number] },
    { id: 2, label: "SIM800L EVB", position: [200.16, 123.52, 3.53] as [number, number, number] },
    { id: 3, label: "Modbus RS485", position: [227.93, 76.87, 2.35] as [number, number, number] }
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Rotación lenta constante para que luzca bien
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    console.log(`Coordenadas del clic -> x: ${e.point.x.toFixed(3)}, y: ${e.point.y.toFixed(3)}, z: ${e.point.z.toFixed(3)}`);
  };

  return (
    <group ref={groupRef} scale={scaleFactor}>
      {/* Grupo interior desplazado para centrar el modelo en el origen */}
      <group position={[-center.x, -center.y, -center.z]}>
        {/* El modelo 3D real */}
        <primitive object={scene} onClick={handleClick} />
        
        {showTooltips && tooltips.map((tooltip) => (
          <Html key={tooltip.id} position={tooltip.position} center>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl w-max pointer-events-none">
              <p className="text-white text-xs font-bold text-center tracking-wider">{tooltip.label}</p>
            </div>
          </Html>
        ))}
      </group>
    </group>
  );
}

// Pre-cargamos el modelo en memoria para evitar tirones
useGLTF.preload('/pcb.glb');

export default function Slide4() {
  const { t } = useLanguage();
  const [showTooltips, setShowTooltips] = useState(false);

  return (
    <div 
      className="h-screen w-full relative flex items-center justify-center"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, #111827, #000000)' }}
    >
      <div className="absolute top-16 left-16 z-10 pointer-events-none">
        <h2 className="text-4xl font-bold text-white tracking-tight">{t.hardware}</h2>
        <p className="text-gray-400 mt-2 text-lg">{t.hardwareDesc}</p>
      </div>
      
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 4, 6], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <PCBModel showTooltips={showTooltips} />
          </Float>
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      <button
        onClick={() => setShowTooltips(!showTooltips)}
        className="absolute bottom-32 right-16 px-6 py-3 rounded-full font-bold transition-all shadow-xl z-20 bg-blue-600/80 backdrop-blur-md border border-blue-400/30 text-white hover:bg-blue-500 hover:scale-105"
      >
        {showTooltips ? 'Ocultar Componentes' : 'Explorar Placa'}
      </button>
    </div>
  );
}
