'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Slide7() {
  const [data, setData] = useState<{ time: string; flow: number }[]>([]);
  const [anomaly, setAnomaly] = useState(false);

  useEffect(() => {
    // Generar datos iniciales
    const initialData = Array.from({ length: 15 }).map((_, i) => ({
      time: new Date(Date.now() - (15 - i) * 1000).toLocaleTimeString(),
      flow: Math.random() * 20 + 80, // Flujo normal entre 80 y 100
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        // Si hay anomalía, el flujo cae cerca de 0
        const newFlow = anomaly ? (Math.random() * 5) : (Math.random() * 20 + 80);
        newData.push({
          time: new Date().toLocaleTimeString(),
          flow: newFlow,
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [anomaly]);

  return (
    <div className={`h-screen w-full flex items-center justify-center transition-colors duration-500 ${anomaly ? 'bg-red-500/20' : 'bg-slate-950'}`}>
      <div className="absolute top-16 left-16 z-10 pointer-events-none">
        <h2 className="text-4xl font-bold text-white tracking-tight">Dashboard Live</h2>
        <p className="text-gray-400 mt-2 text-lg">Telemetría en tiempo real (Caudal de agua)</p>
      </div>

      {/* Mockup Laptop Container */}
      <div className="w-[800px] h-[500px] bg-slate-900 border-[12px] border-slate-800 rounded-2xl relative shadow-2xl flex flex-col overflow-hidden">
        {/* Top bar of laptop */}
        <div className="h-6 w-full bg-slate-950 flex items-center justify-center">
           <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>

        <div className="flex-1 p-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 120]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Line 
                type="monotone" 
                dataKey="flow" 
                stroke={anomaly ? '#ef4444' : '#38bdf8'} 
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {anomaly && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 flex items-center gap-2 text-red-500 bg-red-950/50 px-4 py-2 rounded-full border border-red-500 animate-pulse"
            >
              <AlertCircle size={20} />
              <span className="font-bold">¡ALERTA DE FLUJO!</span>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={() => setAnomaly(!anomaly)}
        className={`absolute bottom-32 right-16 px-6 py-3 rounded-full font-bold transition-all shadow-xl z-20 ${
          anomaly 
            ? 'bg-white text-red-600 hover:bg-gray-200' 
            : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
        }`}
      >
        {anomaly ? 'Restaurar Flujo' : 'Simular Anomalía'}
      </button>
    </div>
  );
}
