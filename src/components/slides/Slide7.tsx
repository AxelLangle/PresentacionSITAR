'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TelemetryData = {
  time: string;
  flow: number;
  totalizer: number;
};

export default function Slide7() {
  const { t } = useLanguage();
  const [data, setData] = useState<TelemetryData[]>([]);
  const [currentFlow, setCurrentFlow] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(1450.0);
  const [logs, setLogs] = useState<{ time: string, file: string, status: string }[]>([]);
  const [events, setEvents] = useState<{ time: string, device: string, flow: number, total: number }[]>([]);

  // Simulate incoming real-time data
  useEffect(() => {
    // Generate initial data
    const initialData: TelemetryData[] = [];
    const now = new Date();
    let tempTotal = 1445.0;
    for (let i = 20; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 5000);
      const flow = 3.5 + Math.random() * 0.8;
      tempTotal += flow * (5 / 3600); // 5 seconds worth of flow
      initialData.push({
        time: d.toISOString().substring(11, 19),
        flow: Number(flow.toFixed(4)),
        totalizer: Number(tempTotal.toFixed(3))
      });
    }
    setData(initialData);
    setCurrentFlow(initialData[initialData.length - 1].flow);
    setCurrentTotal(initialData[initialData.length - 1].totalizer);

    // Initial logs
    setLogs([
      { time: new Date(now.getTime() - 15000).toLocaleTimeString('es-MX', { hour12: false }), file: 'telemetry_1445.csv', status: 'OK' },
      { time: new Date(now.getTime() - 30000).toLocaleTimeString('es-MX', { hour12: false }), file: 'telemetry_1444.csv', status: 'OK' },
    ]);
    
    setEvents([
      { time: new Date(now.getTime() - 5000).toISOString(), device: 'SITAR-NODE-01', flow: initialData[initialData.length - 1].flow, total: tempTotal }
    ]);

    const interval = setInterval(() => {
      const newDate = new Date();
      const newTime = newDate.toISOString().substring(11, 19);
      
      setCurrentFlow(prev => {
        const newFlow = 3.5 + Math.random() * 0.8;
        
        setCurrentTotal(prevTotal => {
          const updatedTotal = prevTotal + newFlow * (5 / 3600);
          
          setData(currentData => {
            const newData = [...currentData, { time: newTime, flow: Number(newFlow.toFixed(4)), totalizer: Number(updatedTotal.toFixed(3)) }];
            if (newData.length > 20) newData.shift();
            return newData;
          });

          setEvents(prevEvents => {
            const newEvents = [{ time: newDate.toISOString(), device: 'SITAR-NODE-01', flow: Number(newFlow.toFixed(4)), total: Number(updatedTotal.toFixed(3)) }, ...prevEvents];
            if (newEvents.length > 5) newEvents.pop();
            return newEvents;
          });

          return updatedTotal;
        });

        // Simulate FTP log occasionally
        if (Math.random() > 0.7) {
          setLogs(prevLogs => {
            const newLogs = [...prevLogs, { time: newDate.toLocaleTimeString('es-MX', { hour12: false }), file: `telemetry_${Math.floor(Math.random() * 9000) + 1000}.csv`, status: 'OK' }];
            if (newLogs.length > 10) newLogs.shift();
            return newLogs;
          });
        }

        return newFlow;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0e1726] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className="text-[#00E5FF] font-bold font-mono">
            {payload[0].value} {payload[0].dataKey === 'flow' ? 'L/s' : 'm³'}
          </p>
        </div>
      );
    }
    return null;
  };

  const [step, setStep] = useState(0);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (step < 1) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setStep(1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (step > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setStep(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [step]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#080D1A] font-sans flex flex-col">
      {/* Background gradients simulating dashboard */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 15% 10%, rgba(0, 229, 255, 0.04), transparent 40%), radial-gradient(circle at 85% 90%, rgba(11, 112, 183, 0.08), transparent 50%)'
      }} />

      {/* Slide Content Overlay */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 bg-slate-950/80 backdrop-blur-sm"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              {t.dashTitle}
            </h2>
            <p className="text-2xl md:text-3xl font-medium text-cyan-400 tracking-wide">
              {t.dashSubtitle}
            </p>
            
            <div className="mt-16 max-w-4xl text-center space-y-6 text-slate-300 text-lg md:text-xl leading-relaxed">
              <p>
                Toda la circuitería, el código de bajo nivel y los servidores convergen finalmente aquí: en la interfaz de usuario.
              </p>
              <p>
                Desarrollamos un dashboard web utilizando HTML5, CSS y librerías de visualización en JavaScript. Mediante WebSockets, el administrador no necesita estar refrescando la página; puede ver el comportamiento de sus redes de agua en tiempo real.
              </p>
              <div className="p-6 mt-8 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-100">
                <p>
                  <strong>Resultados del prototipo:</strong> Durante nuestras pruebas, logramos transmitir exitosamente tramas desde una locación remota hasta nuestro servidor local, demostrando una latencia mínima y validando que el concepto funciona en el mundo real.
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-12 text-slate-500 text-sm animate-pulse">
              Presiona ➔ para ver el dashboard
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Dashboard UI */}
      <motion.div 
        className="flex-1 flex flex-col w-full h-full p-4 md:p-8 z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: step === 1 ? 1 : 0.3, scale: step === 1 ? 1 : 0.95, filter: step === 1 ? 'none' : 'blur(4px)' }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-baseline">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">SITAR</h1>
            <span className="ml-3 text-xs font-semibold tracking-widest text-[#00E5FF] uppercase">SOVETEC Telemetry</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5A3]"></span>
            </span>
            {t.systemOnline}
          </div>
        </header>

        {/* Readouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00E5FF]" />
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">{t.instFlow}</div>
            <div className="text-4xl font-bold text-white font-mono flex items-baseline">
              {currentFlow.toFixed(4)} <span className="text-lg text-slate-400 ml-2">L/s</span>
            </div>
            <div className="text-xs text-slate-500 mt-3">{t.live}</div>
          </div>
          
          <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0B70B7]" />
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">{t.accVolume}</div>
            <div className="text-4xl font-bold text-white font-mono flex items-baseline">
              {currentTotal.toFixed(3)} <span className="text-lg text-slate-400 ml-2">m³</span>
            </div>
            <div className="text-xs text-slate-500 mt-3">{t.live}</div>
          </div>
          
          <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0E4D48]" />
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">{t.sensorId}</div>
            <div className="text-3xl font-bold text-white font-mono mt-1">SITAR-NODE-01</div>
            <div className="text-xs text-slate-500 mt-3">Active connection</div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-0">
              <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">{t.instFlow} (L/s)</h2>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#8a919c" fontSize={10} tickMargin={10} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis stroke="#00E5FF" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="flow" stroke="#00E5FF" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#00E5FF', stroke: '#fff' }} fill="url(#colorFlow)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-0">
              <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">{t.eventLog}</h2>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-3 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-white/5">Time</th>
                      <th className="p-3 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-white/5">Device</th>
                      <th className="p-3 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-white/5">Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {events.map((evt, idx) => (
                        <motion.tr 
                          key={evt.time + idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-3 text-slate-300 font-mono text-xs">{evt.time.substring(11, 19)}</td>
                          <td className="p-3 text-slate-300">{evt.device}</td>
                          <td className="p-3 text-[#00E5FF] font-mono">{evt.flow.toFixed(4)}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 h-full">
            <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-0">
              <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">{t.totalizer} (m³)</h2>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTot" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B70B7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0B70B7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#8a919c" fontSize={10} tickMargin={10} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis stroke="#0B70B7" fontSize={10} axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} tickFormatter={(v) => v.toFixed(2)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="totalizer" stroke="#0B70B7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#0B70B7', stroke: '#fff' }} fill="url(#colorTot)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0e1726]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-0">
              <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">{t.ftpLog}</h2>
              <div className="flex-1 bg-[#05070d] border border-white/5 rounded-lg p-4 font-mono text-xs overflow-auto flex flex-col justify-end">
                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <motion.div 
                      key={log.time + log.file + idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-1.5 flex"
                    >
                      <span className="text-slate-500 mr-2">[{log.time}]</span>
                      <span className="text-slate-300 flex-1">{log.file}</span>
                      <span className="text-[#00E5A3] font-bold">[{log.status}]</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {logs.length === 0 && <div className="text-slate-500 italic">{t.waitingActivity}</div>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
