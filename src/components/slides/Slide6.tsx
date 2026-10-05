'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CONFIG = {
  colors: {
    bgFrom: '#0a0f20',
    bgTo: '#1a2552',
    platformStroke: '#06b6d4',
    ftp: { top: '#1e293b', left: '#0f172a', right: '#020617', stroke: '#38bdf8' },
    http: { top: '#064e3b', left: '#022c22', right: '#011813', stroke: '#34d399' },
    db: { top: '#1e3a8a', side: '#172554', stroke: '#60a5fa' },
    routeA: '#38bdf8', // cian
    routeB: '#34d399', // verde
    routeC: '#93c5fd'  // azul
  },
  nodes: {
    sim: { cx: 640, cy: 640 },
    ftp: { cx: 480, cy: 450, rx: 60, ry: 30, h: 50 },
    http: { cx: 800, cy: 450, rx: 60, ry: 30, h: 50 },
    db: { cx: 640, cy: 190, rx: 65, ry: 25, h: 22 },
    platform: { cx: 640, cy: 450, rx: 360, ry: 180, h: 20 },
    dashboard: { cx: 1050, cy: 300 }
  },
  routes: {
    A: "M 640,640 Q 480,600 480,480",
    B: "M 640,640 Q 800,600 800,480",
    A2: "M 480,400 Q 480,260 590,205",
    B2: "M 800,400 Q 800,260 690,205",
    C: "M 705,170 Q 880,170 1000,260"
  }
};

const IsoBlock = ({ cx, cy, rx, ry, h, colors, frontLabel, glow }: any) => (
  <g style={{ filter: glow ? `drop-shadow(0 0 12px ${colors.stroke})` : 'none', transition: 'filter 0.4s' }}>
    <path d={`M ${cx},${cy-ry} L ${cx+rx},${cy} L ${cx},${cy+ry} L ${cx-rx},${cy} Z`} fill={colors.top} stroke={colors.stroke} strokeWidth="1.5" />
    <path d={`M ${cx-rx},${cy} L ${cx},${cy+ry} L ${cx},${cy+ry+h} L ${cx-rx},${cy+h} Z`} fill={colors.left} stroke={colors.stroke} strokeWidth="1.5" />
    <path d={`M ${cx},${cy+ry} L ${cx+rx},${cy} L ${cx+rx},${cy+h} L ${cx},${cy+ry+h} Z`} fill={colors.right} stroke={colors.stroke} strokeWidth="1.5" />
    {frontLabel && (
      <g transform={`translate(${cx - rx/2}, ${cy + ry/2 + h/2}) skewY(26.5)`}>
        <text textAnchor="middle" fill={colors.stroke} fontSize="20" fontWeight="bold">{frontLabel}</text>
      </g>
    )}
  </g>
);

const PostgresNode = ({ cx, cy, rx, ry, h, colors, active }: any) => (
  <g>
    {[2, 1, 0].map(i => (
      <g key={i} transform={`translate(0, ${i * h})`}>
        <path d={`M ${cx-rx},${cy} A ${rx} ${ry} 0 0 0 ${cx+rx},${cy} L ${cx+rx},${cy+h} A ${rx} ${ry} 0 0 1 ${cx-rx},${cy+h} Z`} fill={colors.side} stroke={colors.stroke} strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={colors.top} stroke={colors.stroke} strokeWidth="1.5" />
      </g>
    ))}
    {active && (
      <circle cx={cx} cy={cy + h*2.5} r="5" fill={colors.stroke} filter={`drop-shadow(0 0 8px ${colors.stroke})`}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
      </circle>
    )}
  </g>
);

const DashboardPanel = ({ cx, cy, active }: any) => (
  <g transform={`translate(${cx}, ${cy}) scale(0.866, 0.866) skewY(-26.5)`}>
    <rect x="-160" y="-120" width="320" height="200" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="2" style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))' }} />
    <rect x="-160" y="-120" width="320" height="36" rx="8" fill="#1e293b" />
    <text x="-145" y="-95" fill="#f8fafc" fontSize="16" fontWeight="bold">Dashboard SITAR</text>
    <circle cx="120" cy="-100" r="5" fill="#22c55e">
      {active && <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />}
    </circle>
    <text x="110" y="-96" fill="#22c55e" fontSize="10" textAnchor="end" fontWeight="bold">EN VIVO</text>
    
    <rect x="-145" y="-70" width="140" height="55" rx="4" fill="#1e293b" />
    <text x="-135" y="-55" fill="#94a3b8" fontSize="11">Flujo instantáneo</text>
    <path d="M -135,-25 Q -115,-45 -95,-20 T -55,-35 T -15,-25" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
    
    <rect x="5" y="-70" width="140" height="55" rx="4" fill="#1e293b" />
    <text x="15" y="-55" fill="#94a3b8" fontSize="11">Totalizador</text>
    <rect x="15" y="-35" width="120" height="8" rx="4" fill="#334155" />
    {active ? (
      <rect x="15" y="-35" width="80" height="8" rx="4" fill="#22c55e">
        <animate attributeName="width" values="80;100;80" dur="4s" repeatCount="indefinite" />
      </rect>
    ) : (
      <rect x="15" y="-35" width="80" height="8" rx="4" fill="#22c55e" />
    )}

    <rect x="5" y="-5" width="140" height="75" rx="4" fill="#1e293b" />
    {[10, 30, 50, 70, 90, 110].map((x, i) => {
      const h = [25, 45, 20, 60, 40, 55][i];
      return (
        <rect key={i} x={15 + x} y={65 - h} width="12" height={h} rx="2" fill="#818cf8">
          {active && <animate attributeName="height" values={`${h};${h+15};${h}`} dur={`${2+i*0.3}s`} repeatCount="indefinite" />}
          {active && <animate attributeName="y" values={`${65-h};${65-(h+15)};${65-h}`} dur={`${2+i*0.3}s`} repeatCount="indefinite" />}
        </rect>
      )
    })}
  </g>
);

const MiniPacket = ({ color }: { color: string }) => (
  <g transform="scale(0.5)">
    <path d="M 0,-10 L 10,-5 L 0,0 L -10,-5 Z" fill="#fff" />
    <path d="M -10,-5 L 0,0 L 0,10 L -10,5 Z" fill={color} />
    <path d="M 10,-5 L 0,0 L 0,10 L 10,5 Z" fill={color} filter="brightness(0.7)" />
  </g>
);

const PacketFlow = ({ path, color, active, loop }: any) => {
  if (!active && !loop) return null;
  return (
    <>
      {active && !loop && (
        <g>
          <MiniPacket color={color} />
          <animateMotion dur="1s" path={path} repeatCount="1" fill="freeze" />
        </g>
      )}
      {loop && [0, 0.4, 0.8].map((delay) => (
        <g key={delay} style={{ opacity: 1 - delay }}>
          <MiniPacket color={color} />
          <animateMotion dur="2.5s" begin={`${delay}s`} path={path} repeatCount="indefinite" />
        </g>
      ))}
    </>
  );
};

const FloatingLabel = ({ x, y, title, sub, colorClass, align = 'left', icon }: any) => (
  <foreignObject x={x} y={y} width="280" height="90" style={{ pointerEvents: 'none' }}>
    <div xmlns="http://www.w3.org/1999/xhtml" className={`flex flex-col justify-center bg-slate-900/85 border border-slate-700/60 rounded-xl p-3 backdrop-blur-md shadow-2xl ${align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <div className="font-bold text-slate-100 text-sm">{title}</div>
      </div>
      <div className={`text-xs mt-1 ${colorClass}`}>{sub}</div>
    </div>
  </foreignObject>
);

export default function Slide06Memoria() {
  const [step, setStep] = useState(0);
  const isReduced = useReducedMotion();
  const MAX_STEP = 5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setStep(s => {
          if (s < MAX_STEP) {
            e.stopPropagation();
            return s + 1;
          }
          return s;
        });
      } else if (e.key === 'ArrowLeft') {
        setStep(s => {
          if (s > 0) {
            e.stopPropagation();
            return s - 1;
          }
          return s;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  const floatAnim = (delay: number) => isReduced ? {} : {
    y: [0, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
  };

  return (
    <div className="h-full w-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${CONFIG.colors.bgFrom}, ${CONFIG.colors.bgTo})` }}>
      {/* Grid de fondo */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'scale(1, 0.5) rotate(45deg)' }} />

      <div className="absolute top-10 left-12 z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">La Memoria</h2>
        <p className="text-gray-400 mt-2 text-lg">Infraestructura Cloud y Backend</p>
      </div>

      <svg viewBox="0 0 1280 720" className="w-full h-full absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g>
          {/* Platform */}
          <motion.g initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <path d={`M ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy-CONFIG.nodes.platform.ry} L ${CONFIG.nodes.platform.cx+CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy} L ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.ry} L ${CONFIG.nodes.platform.cx-CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy} Z`} fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <path d={`M ${CONFIG.nodes.platform.cx-CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy} L ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.ry} L ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.ry+CONFIG.nodes.platform.h} L ${CONFIG.nodes.platform.cx-CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.h} Z`} fill="#020617" stroke="#06b6d4" strokeWidth="2" />
            <path d={`M ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.ry} L ${CONFIG.nodes.platform.cx+CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy} L ${CONFIG.nodes.platform.cx+CONFIG.nodes.platform.rx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.h} L ${CONFIG.nodes.platform.cx},${CONFIG.nodes.platform.cy+CONFIG.nodes.platform.ry+CONFIG.nodes.platform.h} Z`} fill="#020617" stroke="#06b6d4" strokeWidth="2" />
          </motion.g>

          {/* Separator */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <line x1="640" y1="310" x2="640" y2="590" stroke="#334155" strokeWidth="2" strokeDasharray="8 8" />
              <rect x="575" y="440" width="130" height="24" rx="12" fill="#0f172a" stroke="#475569" />
              <text x="640" y="456" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">usuarios distintos</text>
            </motion.g>
          )}

          {/* SIM800L */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <IsoBlock {...CONFIG.nodes.sim} rx={30} ry={15} h={15} colors={{ top: '#334155', left: '#1e293b', right: '#0f172a', stroke: '#475569' }} />
            <text x="640" y="690" fill="#94a3b8" fontSize="14" textAnchor="middle" fontWeight="bold">SITAR · SIM800L · red celular (GPRS)</text>
          </motion.g>

          {/* Rutas SVG (Fondo) */}
          <g fill="none" strokeWidth="3" strokeDasharray="6 6" opacity="0.3">
            <path d={CONFIG.routes.A} stroke={CONFIG.colors.routeA} />
            <path d={CONFIG.routes.B} stroke={CONFIG.colors.routeB} />
            <path d={CONFIG.routes.A2} stroke={CONFIG.colors.routeA} />
            <path d={CONFIG.routes.B2} stroke={CONFIG.colors.routeB} />
            <path d={CONFIG.routes.C} stroke={CONFIG.colors.routeC} />
          </g>

          {/* Rutas SVG (Activas animadas) */}
          <g fill="none" strokeWidth="3" strokeLinecap="round">
            <motion.path d={CONFIG.routes.A} stroke={CONFIG.colors.routeA} initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }} />
            <motion.path d={CONFIG.routes.B} stroke={CONFIG.colors.routeB} initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }} />
            <motion.path d={CONFIG.routes.A2} stroke={CONFIG.colors.routeA} initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }} />
            <motion.path d={CONFIG.routes.B2} stroke={CONFIG.colors.routeB} initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }} />
            <motion.path d={CONFIG.routes.C} stroke={CONFIG.colors.routeC} initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }} />
          </g>

          {/* Animación de Paquetes */}
          <PacketFlow path={CONFIG.routes.A} color={CONFIG.colors.routeA} active={step === 2} loop={step >= 5 && !isReduced} />
          <PacketFlow path={CONFIG.routes.B} color={CONFIG.colors.routeB} active={step === 3} loop={step >= 5 && !isReduced} />
          <PacketFlow path={CONFIG.routes.A2} color={CONFIG.colors.routeA} active={step === 4} loop={step >= 5 && !isReduced} />
          <PacketFlow path={CONFIG.routes.B2} color={CONFIG.colors.routeB} active={step === 4} loop={step >= 5 && !isReduced} />
          <PacketFlow path={CONFIG.routes.C} color={CONFIG.colors.routeC} active={step === 5} loop={step >= 5 && !isReduced} />

          {/* Nodos interactivos encima de las rutas */}
          <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, ...floatAnim(0) }} transition={{ duration: 0.6, delay: 0.1 }}>
            <IsoBlock {...CONFIG.nodes.ftp} colors={CONFIG.colors.ftp} frontLabel="FTP" glow={step === 2 || step >= 5} />
          </motion.g>

          <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, ...floatAnim(0.5) }} transition={{ duration: 0.6, delay: 0.2 }}>
            <IsoBlock {...CONFIG.nodes.http} colors={CONFIG.colors.http} frontLabel="API" glow={step === 3 || step >= 5} />
          </motion.g>

          <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, ...floatAnim(1) }} transition={{ duration: 0.6, delay: 0.3 }}>
            <PostgresNode {...CONFIG.nodes.db} colors={CONFIG.colors.db} active={step >= 4} />
          </motion.g>

          <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0, ...floatAnim(1.5) }} transition={{ duration: 0.6, delay: 0.4 }}>
            <DashboardPanel {...CONFIG.nodes.dashboard} active={step >= 5} />
          </motion.g>

          {/* HTML Labels */}
          {step >= 0 && (
            <FloatingLabel x="120" y="320" title="Microsoft Azure" sub="VM · Ubuntu Server" colorClass="text-slate-400" icon="☁️" />
          )}
          
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0 }}>
            <FloatingLabel x="130" y="380" title={CONFIG.labels.ftp.title} sub={CONFIG.labels.ftp.sub1 + ' · ' + CONFIG.labels.ftp.sub2} colorClass="text-sky-300" align="right" />
            <FloatingLabel x="880" y="380" title={CONFIG.labels.http.title} sub={CONFIG.labels.http.sub1 + ' · ' + CONFIG.labels.http.sub2} colorClass="text-emerald-300" />
            <FloatingLabel x="500" y="70" title={CONFIG.labels.db.title} sub={CONFIG.labels.db.sub} colorClass="text-blue-300" align="center" />
            <FloatingLabel x="930" y="80" title={CONFIG.labels.dash.title} sub={CONFIG.labels.dash.sub} colorClass="text-slate-400" align="center" />
          </motion.g>

          {/* Route Labels */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <foreignObject x="250" y="550" width="200" height="40">
                <div xmlns="http://www.w3.org/1999/xhtml" className="text-center font-mono text-[10px] text-sky-300 bg-slate-900/60 rounded px-2 py-1 backdrop-blur-sm border border-sky-900/50">
                  Archivos (FTP) · puerto 21
                </div>
              </foreignObject>
              <foreignObject x="800" y="550" width="220" height="40">
                <div xmlns="http://www.w3.org/1999/xhtml" className="text-center font-mono text-[10px] text-emerald-300 bg-slate-900/60 rounded px-2 py-1 backdrop-blur-sm border border-emerald-900/50">
                  POST /api/telemetry · HTTP · p. 8080
                </div>
              </foreignObject>
            </motion.g>
          )}

        </g>
      </svg>
    </div>
  );
}
