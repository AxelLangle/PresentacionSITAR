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
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function Slide7() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
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
    <div className={`h-full w-full flex items-center justify-center transition-colors duration-500 ${anomaly ? 'bg-red-500/20' : 'bg-slate-950'}`}>
      <div className="absolute top-14 left-5 right-5 md:top-16 md:left-16 md:right-auto z-10 pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{t.dashboard}</h2>
        <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-lg">{t.dashboardDesc}</p>
      </div>

      {/* Mockup Laptop Container: 800×500 en escritorio, fluido en pantallas pequeñas */}
      <div 
        className="bg-slate-900 border-slate-800 rounded-2xl relative shadow-2xl flex flex-col overflow-hidden border-[6px] md:border-[12px] w-[calc(100%-2.5rem)] max-w-[800px] h-[45dvh] max-h-[500px] min-h-[200px] md:h-[min(500px,60dvh)]"
      >
        {/* Top bar of laptop */}
        <div className="h-5 md:h-6 w-full bg-slate-950 flex items-center justify-center shrink-0">
           <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>

        <div className="flex-1 min-h-0 p-2 md:p-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={isMobile ? { top: 5, right: 8, left: -20, bottom: 0 } : { top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" tick={isMobile ? { fontSize: 10 } : undefined} minTickGap={isMobile ? 24 : 5} />
              <YAxis stroke="#94a3b8" domain={[0, 120]} tick={isMobile ? { fontSize: 10 } : undefined} />
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
              className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-1.5 md:gap-2 text-red-500 bg-red-950/50 px-3 py-1 md:px-4 md:py-2 rounded-full border border-red-500 animate-pulse text-xs md:text-base"
            >
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold">{t.flowAlert}</span>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={() => setAnomaly(!anomaly)}
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-32 md:right-16 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base whitespace-nowrap rounded-full font-bold transition-all shadow-xl z-20 ${
          anomaly 
            ? 'bg-white text-red-600 hover:bg-gray-200' 
            : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
        }`}
      >
        {anomaly ? t.restoreFlow : t.simulateAnomaly}
      </button>
    </div>
  );
}
