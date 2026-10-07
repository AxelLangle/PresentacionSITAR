'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/contexts/LanguageContext';

// Componente del modelo de PCB con auto-centrado y auto-escalado
function PCBModel({ showTooltips }: { showTooltips: boolean }) {
  // Carga el archivo real de la placa (.glb)
  const { scene } = useGLTF('/PCB_SITARV2.glb');
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
useGLTF.preload('/PCB_SITARV2.glb');

// Posición base de la cámara (pensada para pantallas horizontales)
const BASE_CAMERA: [number, number, number] = [0, 4, 6];

// Aleja la cámara en pantallas verticales (celular) para que la placa completa quepa a lo ancho
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const factor = aspect < 1 ? Math.min(1 / aspect, 2.2) : 1;
    camera.position.set(BASE_CAMERA[0] * factor, BASE_CAMERA[1] * factor, BASE_CAMERA[2] * factor);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function Slide4() {
  const { t } = useLanguage();
  const [showTooltips, setShowTooltips] = useState(false);

  return (
    <div 
      className="h-full w-full relative flex items-center justify-center"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, #111827, #000000)' }}
    >
      <div className="absolute top-14 left-5 right-5 md:top-16 md:left-16 md:right-auto z-10 pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{t.hardware}</h2>
        <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-lg">{t.hardwareDesc}</p>
      </div>
      
      <div className="w-full h-full cursor-grab active:cursor-grabbing touch-none" data-no-swipe>
        <Canvas camera={{ position: BASE_CAMERA, fov: 45 }}>
          <ResponsiveCamera />
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
        className="absolute bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-32 md:right-16 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base whitespace-nowrap rounded-full font-bold transition-all shadow-xl z-20 bg-blue-600/80 backdrop-blur-md border border-blue-400/30 text-white hover:bg-blue-500 hover:scale-105"
      >
        {showTooltips ? 'Ocultar Componentes' : 'Explorar Placa'}
      </button>
    </div>
  );
}
