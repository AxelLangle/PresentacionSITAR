'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

/* ══════════════════════════════════════════════════════════════════════
   Slide 6 · La Memoria — Infraestructura Cloud y Backend
   ──────────────────────────────────────────────────────────────────────
   Idea central: UN solo reloj maestro (useAnimationFrame) que dirige
   paquetes, brillos de nodos y llegada al dashboard. Nada de animateMotion
   con duraciones sueltas: todo vive en la misma línea de tiempo (0 → 1),
   por eso el loop cierra perfecto (igual que el video de 6 s).

   · Los paquetes NO pasan por encima de los servicios: entran, el nodo
     "procesa" (brilla) y salen por arriba. Eso es lo que vende el video.
   · Se actualiza el DOM por ref → cero re-renders por frame.
   · Pasos con teclado (0‥4) o mode="loop" para ver solo el loop final.
   ══════════════════════════════════════════════════════════════════════ */

/* ─────────────── CONFIG (todo lo editable vive aquí) ─────────────── */

type Pt = { x: number; y: number };
type Palette = { top: string; left: string; right: string; stroke: string };
type RouteKey = 'A1' | 'A2' | 'B1' | 'B2' | 'C';

const CONFIG = {
  cycleSeconds: 6, // un paquete recorre toda la ruta en este tiempo
  packetsPerChain: 3, // paquetes simultáneos por cadena
  maxStep: 4,
  colors: {
    bgFrom: '#0a0f20',
    bgTo: '#1a2552',
    platform: { top: 'url(#s6-platform)', left: '#0a1129', right: '#0a1129', stroke: '#22d3ee' } as Palette,
    ftp: { top: '#1d2a50', left: '#16213f', right: '#0e1731', stroke: '#38bdf8' } as Palette,
    http: { top: '#0f3a30', left: '#0b2b25', right: '#08201b', stroke: '#34d399' } as Palette,
    sim: { top: '#2f3d6b', left: '#1e2a52', right: '#141d3d', stroke: '#4b5d96' } as Palette,
    db: { top: '#3d63b8', side: '#2f4f9a', stroke: '#7ea6ff' },
    cyan: { top: '#e6f9ff', left: '#38bdf8', right: '#0ea5e9', glow: '#38bdf8' },
    green: { top: '#eafff3', left: '#4ade80', right: '#16a34a', glow: '#34d399' },
    routeC: '#93c5fd',
  },
  // Coordenadas en un viewBox 1280×720 (derivadas de la escena 1920×1080 ÷ 1.5)
  nodes: {
    platform: { cx: 560, cy: 410, rx: 270, ry: 135, h: 20 },
    ftp: { cx: 445, cy: 388, rx: 52, ry: 26, h: 54 },
    http: { cx: 675, cy: 395, rx: 52, ry: 26, h: 54 },
    db: { cx: 560, cy: 149, rx: 58, ry: 29, h: 28 },
    sim: { cx: 560, cy: 641, rx: 36, ry: 18, h: 14 },
    dashboard: { x: 900, y: 232, w: 260, h: 151, depth: { dx: 22, dy: -10 } },
  },
  routes: {
    A1: 'M 560,620 C 500,600 445,520 445,440', // SIM → FTP
    A2: 'M 445,360 C 450,290 510,240 560,205', // FTP → BD (base is ~205)
    B1: 'M 560,620 C 620,600 675,520 675,440', // SIM → API
    B2: 'M 675,360 C 670,290 610,240 560,205', // API → BD
    C:  'M 560,149 C 620,100 750,180 900,270', // BD top → Dashboard
  } as Record<RouteKey, string>,
};

/* Línea de tiempo normalizada de un paquete (0 → 1) */
const TL = {
  inEnd: 0.24, //  SIM → servicio
  outStart: 0.33, // (0.24‥0.33 el servicio "procesa", paquete oculto)
  outEnd: 0.55, //  servicio → BD
  cStart: 0.62, //  (0.55‥0.62 la BD "escribe") BD → Dashboard
};

const CHAINS = [
  { id: 'ftp', routes: ['A1', 'A2'] as [RouteKey, RouteKey], color: CONFIG.colors.cyan, phase: 0, minStep: 2 },
  { id: 'http', routes: ['B1', 'B2'] as [RouteKey, RouteKey], color: CONFIG.colors.green, phase: 1 / 6, minStep: 3 },
];

/* ─────────────── Utilidades de animación (puras) ─────────────── */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
const frac = (u: number, a: number, b: number) => (u - a) / (b - a);
const bump = (u: number, a: number, b: number) => (u <= a || u >= b ? 0 : Math.sin((Math.PI * (u - a)) / (b - a)));

type Lookup = Partial<Record<RouteKey, Pt[]>>;

function sample(lookup: Lookup, route: RouteKey, f: number): Pt {
  const pts = lookup[route]!;
  const x = clamp(f) * (pts.length - 1);
  const i = Math.min(Math.floor(x), pts.length - 2);
  const t = x - i;
  return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t };
}

/** Posición/escala/opacidad de un paquete en el instante u ∈ [0,1). null = oculto. */
function place(u: number, [rIn, rOut]: [RouteKey, RouteKey], cOn: boolean, lookup: Lookup) {
  const grow = (f: number) => 0.55 + 0.45 * clamp(f / 0.3);
  const shrink = (f: number) => 1 - 0.45 * clamp((f - 0.7) / 0.3);

  if (u < TL.inEnd) {
    const f = ease(frac(u, 0, TL.inEnd));
    return { ...sample(lookup, rIn, f), o: clamp(u / 0.03), s: shrink(f) };
  }
  if (u < TL.outStart) return null; // dentro del servicio
  if (u < TL.outEnd) {
    const f = ease(frac(u, TL.outStart, TL.outEnd));
    return { ...sample(lookup, rOut, f), o: 1, s: Math.min(grow(f), shrink(f)) };
  }
  if (u < TL.cStart || !cOn) return null; // dentro de la BD
  const f = ease(frac(u, TL.cStart, 1));
  return { ...sample(lookup, 'C', f), o: clamp((1 - u) / 0.04), s: grow(f) };
}

/* ─────────────── Piezas SVG ─────────────── */

const diamond = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx},${cy - ry} L${cx + rx},${cy} L${cx},${cy + ry} L${cx - rx},${cy} Z`;

function IsoBlock(p: {
  cx: number; cy: number; rx: number; ry: number; h: number; c: Palette;
  label?: string; leds?: boolean; inset?: boolean; sw?: number;
}) {
  const { cx, cy, rx, ry, h, c, label, leds, inset, sw = 1.5 } = p;
  const k = ry / rx; // pendiente isométrica (0.5)
  return (
    <g strokeLinejoin="round">
      <path d={`M${cx - rx},${cy} L${cx},${cy + ry} L${cx},${cy + ry + h} L${cx - rx},${cy + h} Z`} fill={c.left} stroke={c.stroke} strokeWidth={sw} />
      <path d={`M${cx},${cy + ry} L${cx + rx},${cy} L${cx + rx},${cy + h} L${cx},${cy + ry + h} Z`} fill={c.right} stroke={c.stroke} strokeWidth={sw} />
      <path d={diamond(cx, cy, rx, ry)} fill={c.top} stroke={c.stroke} strokeWidth={sw} />
      {inset && <path d={diamond(cx, cy, rx * 0.6, ry * 0.6)} fill={c.stroke} fillOpacity={0.1} stroke={c.stroke} strokeOpacity={0.8} strokeWidth={1.2} />}
      {label && (
        <text transform={`matrix(1 ${k} 0 1 ${cx - rx} ${cy})`} x={rx / 2} y={h * 0.7} textAnchor="middle" fill={c.stroke} fontSize={17} fontWeight={700} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          {label}
        </text>
      )}
      {leds && (
        <g transform={`matrix(1 ${-k} 0 1 ${cx} ${cy + ry})`}>
          {[0.25, 0.5, 0.75].map((f, i) => (
            <circle key={i} cx={rx * 0.72} cy={h * f} r={2.3} fill={c.stroke} opacity={1 - i * 0.28} />
          ))}
        </g>
      )}
    </g>
  );
}

function Database({ cx, cy, rx, ry, h }: { cx: number; cy: number; rx: number; ry: number; h: number }) {
  const c = CONFIG.colors.db;
  return (
    <g>
      {[2, 1, 0].map((i) => (
        <g key={i} transform={`translate(0 ${i * h})`}>
          <path d={`M${cx - rx},${cy} A${rx} ${ry} 0 0 0 ${cx + rx},${cy} L${cx + rx},${cy + h} A${rx} ${ry} 0 0 1 ${cx - rx},${cy + h} Z`} fill={c.side} stroke={c.stroke} strokeOpacity={0.55} strokeWidth={1.2} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={c.top} stroke={c.stroke} strokeOpacity={0.55} strokeWidth={1.2} />
          <circle cx={cx + rx * 0.53} cy={cy + ry * 0.85} r={3} fill="#9ccbff" />
        </g>
      ))}
    </g>
  );
}

function Packet({ color, setRef }: { color: typeof CONFIG.colors.cyan; setRef: (el: SVGGElement | null) => void }) {
  return (
    <g ref={setRef} opacity={0}>
      <circle r={26} fill={`url(#s6-glow-${color === CONFIG.colors.cyan ? 'cyan' : 'green'})`} />
      <g strokeLinejoin="round" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={0.6}>
        <path d="M-11,-6 L0,0 L0,12 L-11,6 Z" fill={color.left} />
        <path d="M11,-6 L0,0 L0,12 L11,6 Z" fill={color.right} />
        <path d="M0,-12 L11,-6 L0,0 L-11,-6 Z" fill={color.top} />
      </g>
    </g>
  );
}

function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={36} cy={32} r={27} fill="url(#s6-cloud)" />
      <circle cx={80} cy={40} r={21} fill="url(#s6-cloud)" />
      <circle cx={102} cy={50} r={13} fill="url(#s6-cloud)" />
      <rect x={0} y={44} width={114} height={22} rx={11} fill="url(#s6-cloud)" />
    </g>
  );
}

function Dashboard({ live, t }: { live: boolean, t: any }) {
  const { x, y, w, h, depth } = CONFIG.nodes.dashboard;
  const bars = [16, 28, 12, 38, 24, 32];
  return (
    <g>
      <path d={`M${x},${y} L${x + depth.dx},${y + depth.dy} L${x + w + depth.dx},${y + w / 2 + depth.dy} L${x + w},${y + w / 2} Z`} fill="#36467c" stroke="#38bdf8" strokeOpacity={0.5} />
      <path d={`M${x + w},${y + w / 2} L${x + w + depth.dx},${y + w / 2 + depth.dy} L${x + w + depth.dx},${y + w / 2 + depth.dy + h} L${x + w},${y + w / 2 + h} Z`} fill="#121a3a" stroke="#38bdf8" strokeOpacity={0.4} />
      <g transform={`matrix(1 0.5 0 1 ${x} ${y})`}>
        <rect width={w} height={h} rx={6} fill="#101a3c" stroke="#38bdf8" strokeWidth={1.6} />
        <path d={`M0,28 L0,6 Q0,0 6,0 L${w - 6},0 Q${w},0 ${w},6 L${w},28 Z`} fill="#1a2655" />
        <text x={14} y={19} fill="#f1f5ff" fontSize={12.5} fontWeight={700}>Dashboard SITAR</text>
        <text x={w - 22} y={18} fill="#4ade80" fontSize={8.5} fontWeight={700} textAnchor="end">{t.live}</text>
        <circle cx={w - 14} cy={14} r={3.2} fill="#4ade80" className={live ? 's6-blink' : ''} />

        {/* Flujo instantáneo */}
        <rect x={10} y={34} width={118} height={34} rx={4} fill="#18244f" stroke="#2a3a73" strokeWidth={0.8} />
        <text x={18} y={47} fill="#9fb0e8" fontSize={9}>{t.instFlow}</text>
        <rect x={18} y={54} width={96} height={6} rx={3} fill="#243566" />
        <rect x={18} y={54} width={70} height={6} rx={3} fill="#2b8fa6" className={live ? 's6-fill' : ''} />

        {/* Totalizador */}
        <rect x={134} y={34} width={116} height={34} rx={4} fill="#18244f" stroke="#2a3a73" strokeWidth={0.8} />
        <text x={142} y={47} fill="#9fb0e8" fontSize={9}>{t.totalizer}</text>
        <rect x={142} y={54} width={98} height={6} rx={3} fill="#243566" />
        <rect x={142} y={54} width={70} height={6} rx={3} fill="#4ade80" className={live ? 's6-fill' : ''} style={{ animationDelay: '-2s' }} />

        {/* Serie de tiempo */}
        <rect x={10} y={74} width={118} height={68} rx={4} fill="#18244f" stroke="#2a3a73" strokeWidth={0.8} />
        <path d="M18,118 L28,102 L38,106 L48,98 L56,112 L64,126 L74,121 L84,122 L94,112 L102,116 L112,128 L120,134 L18,134 Z" fill="#22d3ee" fillOpacity={0.14} />
        <path d="M18,118 L28,102 L38,106 L48,98 L56,112 L64,126 L74,121 L84,122 L94,112 L102,116 L112,128 L120,134" fill="none" stroke="#22d3ee" strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx={120} cy={134} r={2.8} fill="#a5f3fc" className={live ? 's6-blink' : ''} />

        {/* Barras */}
        <rect x={134} y={74} width={116} height={68} rx={4} fill="#18244f" stroke="#2a3a73" strokeWidth={0.8} />
        {bars.map((bh, i) => (
          <rect key={i} x={146 + i * 17} y={134 - bh} width={10} height={bh} rx={2} fill="#6d8cff"
            className={live ? 's6-bar' : ''}
            style={{ animationDelay: `${-i * 0.45}s`, ['--s' as string]: 1 + 6 / bh }} />
        ))}
      </g>
    </g>
  );
}

/* Texto suelto y tarjeta de servicio */
const FONT = 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif)';

function Reveal({ show, x = 0, y = 0, children }: { show: boolean; x?: number; y?: number; children: React.ReactNode }) {
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : x, y: show ? 0 : y }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      {children}
    </motion.g>
  );
}

/* ─────────────── Componente principal ─────────────── */

type Props = {
  /** 'steps': avanza con flechas/espacio (0‥4). 'loop': arranca en el estado final, sin teclado. */
  mode?: 'steps' | 'loop';
  initialStep?: number;
  showTitle?: boolean;
};

export default function Slide06Memoria({ mode = 'loop', initialStep = 4, showTitle = true }: Props) {
  const { maxStep, cycleSeconds: CYCLE, packetsPerChain: N } = CONFIG;
  const isReduced = !!useReducedMotion();
  const { t } = useLanguage();

  const L = {
    azure: { title: 'Microsoft Azure', sub: 'VM · Ubuntu Server' },
    ftp: { title: t.ftpService, sub1: 'vsftpd', sub2: t.dedicatedUser },
    http: { title: t.httpService, sub1: 'FastAPI · Python', sub2: t.dedicatedUser },
    db: { title: 'PostgreSQL', sub: t.waterHistory },
    dash: { title: 'Dashboard', sub: t.dashAllHere },
    sim: `SITAR · SIM800L · ${t.cellularNet} (GPRS)`,
    ftpRoute: { title: t.filesFtp, sub: `${t.port} 21` },
    httpRoute: { title: 'POST /api/telemetry', sub: `HTTP · ${t.port} 8080` },
    users: t.distinctUsers,
  };

  const [step, setStep] = useState(mode === 'loop' ? maxStep : initialStep);
  const stepRef = useRef(step); // fuente de verdad síncrona (la lee el teclado y el reloj)
  const go = useCallback((n: number) => { stepRef.current = n; setStep(n); }, []);

  /* Teclado: solo consume la flecha si todavía hay pasos; si no, deja pasar al contenedor (siguiente/anterior slide).
     Se decide con la ref, NO dentro del updater de setState (ahí stopPropagation llegaría tarde y corre doble en StrictMode). */
  useEffect(() => {
    if (mode === 'loop') return;
    const onKey = (e: KeyboardEvent) => {
      const s = stepRef.current;
      if ((e.key === 'ArrowRight' || e.key === ' ') && s < maxStep) {
        e.preventDefault(); e.stopImmediatePropagation(); go(s + 1);
      } else if (e.key === 'ArrowLeft' && s > 0) {
        e.preventDefault(); e.stopImmediatePropagation(); go(s - 1);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [mode, maxStep, go]);

  /* Refs al DOM que mueve el reloj */
  const pathRefs = useRef<Partial<Record<RouteKey, SVGPathElement | null>>>({});
  const packetRefs = useRef<(SVGGElement | null)[]>([]);
  const glowRefs = useRef<Record<string, SVGElement | null>>({});
  const lookupRef = useRef<Lookup | null>(null);

  /* Pre-muestreo de cada ruta por longitud de arco → velocidad uniforme y cero getPointAtLength por frame */
  const frame = useCallback((tMs: number) => {
    const lookup = lookupRef.current;
    if (!lookup) return;
    const s = stepRef.current;
    const cOn = s >= 4;
    const tMsNum = tMs / 1000;
    const g = { ftp: 0, http: 0, db: 0, dash: 0 };

    CHAINS.forEach((chain, ci) => {
      const on = s >= chain.minStep;
      for (let k = 0; k < N; k++) {
        const el = packetRefs.current[ci * N + k];
        if (!el) continue;
        const u = (((tMsNum / CYCLE + chain.phase + k / N) % 1) + 1) % 1;
        const p = on ? place(u, chain.routes, cOn, lookup) : null;
        if (p) {
          el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.s.toFixed(2)})`);
          el.setAttribute('opacity', p.o.toFixed(2));
        } else {
          el.setAttribute('opacity', '0');
        }
        if (on) {
          g[chain.id as 'ftp' | 'http'] = Math.max(g[chain.id as 'ftp' | 'http'], bump(u, TL.inEnd - 0.02, TL.outStart + 0.04));
          g.db = Math.max(g.db, bump(u, TL.outEnd - 0.02, TL.cStart + 0.04));
          if (cOn) g.dash = Math.max(g.dash, bump(u, 0.9, 1));
        }
      }
    });

    (Object.keys(g) as (keyof typeof g)[]).forEach((key) => {
      const el = glowRefs.current[key];
      if (el) el.style.opacity = String(clamp(g[key as keyof typeof g]));
    });
  }, [CYCLE, N]);

  useEffect(() => {
    const SAMPLES = 160;
    const out: Lookup = {};
    (Object.keys(CONFIG.routes) as RouteKey[]).forEach((key) => {
      const el = pathRefs.current[key];
      if (!el) return;
      const len = el.getTotalLength();
      out[key] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
        const p = el.getPointAtLength((len * i) / SAMPLES);
        return { x: p.x, y: p.y };
      });
    });
    lookupRef.current = out;
    console.log('Slide6 Mount: lookup populated', Object.keys(out));
    if (isReduced) frame(2400);
  }, [frame, isReduced]);

  // Con prefers-reduced-motion: un frame congelado (paquetes quietos, sin loop) que se refresca al cambiar de paso
  useEffect(() => { 
    console.log('Slide6 step updated:', step, 'cOn will be:', step >= 4);
    if (isReduced) frame(2400); 
  }, [isReduced, step, frame]);
  useAnimationFrame((time) => { if (!isReduced) frame(time); });

  const n = CONFIG.nodes;
  const c = CONFIG.colors;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.bgFrom}, ${c.bgTo})` }}>
      {showTitle && (
        <div className="absolute left-12 top-10 z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{t.cloudTitle}</h2>
          <p className="mt-2 text-lg text-slate-400">{t.cloudDesc}</p>
        </div>
      )}

      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" style={{ fontFamily: FONT }} role="img" aria-label="Arquitectura: el SIM800L envía por FTP y HTTP a una VM en Azure, que guarda en PostgreSQL y alimenta el dashboard">
        <style>{`
          .s6-march{stroke-dasharray:8 8;animation:s6-march 1s linear infinite}
          @keyframes s6-march{to{stroke-dashoffset:-16}}
          .s6-blink{animation:s6-blink 1.4s ease-in-out infinite}
          @keyframes s6-blink{0%,100%{opacity:.25}50%{opacity:1}}
          .s6-wifi{animation:s6-blink 1.8s ease-in-out infinite}
          .s6-bar{transform-box:fill-box;transform-origin:50% 100%;animation:s6-bar 3s ease-in-out infinite}
          @keyframes s6-bar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(var(--s,1.4))}}
          .s6-fill{transform-box:fill-box;transform-origin:0 50%;animation:s6-fill 5s ease-in-out infinite}
          @keyframes s6-fill{0%,100%{transform:scaleX(.8)}50%{transform:scaleX(1)}}
          .s6-float{animation:s6-float 6s ease-in-out infinite}
          @keyframes s6-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
          @media (prefers-reduced-motion:reduce){.s6-march,.s6-blink,.s6-wifi,.s6-bar,.s6-fill,.s6-float{animation:none}}
        `}</style>

        <defs>
          <linearGradient id="s6-platform" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#17306a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0f1d4a" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="s6-cloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe9ff" />
            <stop offset="1" stopColor="#4aa3ff" />
          </linearGradient>
          {([['cyan', c.cyan.glow], ['green', c.green.glow], ['blue', '#5b8cff']] as const).map(([id, col]) => (
            <radialGradient key={id} id={`s6-glow-${id}`}>
              <stop offset="0" stopColor={col} stopOpacity="0.55" />
              <stop offset="1" stopColor={col} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id="s6-shadow">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <pattern id="s6-grid" width="60" height="30" patternUnits="userSpaceOnUse">
            <path d="M0,0 L60,30 M0,30 L60,0" stroke="#fff" strokeOpacity="0.04" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="1280" height="720" fill="url(#s6-grid)" />

        {/* Plataforma (la VM) */}
        <motion.g initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <IsoBlock {...n.platform} c={c.platform} sw={2} />
        </motion.g>

        {/* Sombras */}
        <ellipse cx={n.ftp.cx} cy={500} rx={46} ry={11} fill="url(#s6-shadow)" />
        <ellipse cx={n.http.cx} cy={502} rx={46} ry={11} fill="url(#s6-shadow)" />
        <ellipse cx={n.db.cx} cy={283} rx={66} ry={16} fill="url(#s6-shadow)" />
        <Reveal show={step >= 4}><ellipse cx={1033} cy={548} rx={150} ry={22} fill="url(#s6-shadow)" /></Reveal>

        {/* Separador */}
        <Reveal show={step >= 1}>
          <line x1={560} y1={278} x2={560} y2={534} stroke="#475569" strokeWidth={1.6} strokeDasharray="6 6" />
          <rect x={504} y={466} width={112} height={22} rx={11} fill="#0f1a3d" stroke="#3b5aa0" />
          <text x={560} y={481} fill="#b7c4f5" fontSize={11.5} textAnchor="middle">{L.users}</text>
        </Reveal>

        {/* Rutas: halo + guion que "marcha" en el sentido del flujo */}
        {(Object.keys(CONFIG.routes) as RouteKey[]).map((key) => {
          const color = key.startsWith('A') ? c.cyan.glow : key.startsWith('B') ? c.green.glow : c.routeC;
          const show = step >= 1;
          return (
            <Reveal key={key} show={show}>
              <path ref={(el) => { pathRefs.current[key] = el; }} d={CONFIG.routes[key]} fill="none" stroke={color} strokeOpacity={0.16} strokeWidth={9} strokeLinecap="round" />
              <path d={CONFIG.routes[key]} fill="none" stroke={color} strokeOpacity={0.9} strokeWidth={2.6} strokeLinecap="round" className="s6-march" />
            </Reveal>
          );
        })}

        {/* Halos de actividad (los enciende el reloj) */}
        <ellipse ref={(el) => { glowRefs.current.ftp = el; }} cx={n.ftp.cx} cy={n.ftp.cy + 12} rx={92} ry={64} fill="url(#s6-glow-cyan)" opacity={0} />
        <ellipse ref={(el) => { glowRefs.current.http = el; }} cx={n.http.cx} cy={n.http.cy + 12} rx={92} ry={64} fill="url(#s6-glow-green)" opacity={0} />
        <ellipse ref={(el) => { glowRefs.current.db = el; }} cx={n.db.cx} cy={n.db.cy + 50} rx={110} ry={100} fill="url(#s6-glow-blue)" opacity={0} />
        <ellipse ref={(el) => { glowRefs.current.dash = el; }} cx={1035} cy={390} rx={200} ry={160} fill="url(#s6-glow-blue)" opacity={0} />

        {/* Nodos */}
        <motion.g initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <IsoBlock {...n.ftp} c={c.ftp} label="FTP" leds inset />
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
          <IsoBlock {...n.http} c={c.http} label="API" leds inset />
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
          <Database {...n.db} />
        </motion.g>

        {/* SIM800L + señal */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <IsoBlock {...n.sim} c={c.sim} />
          <circle cx={571} cy={663} r={2.4} fill="#4ade80" className="s6-blink" />
          {[9, 18, 27].map((r, i) => (
            <path key={r} d={`M${560 - r},608 A${r} ${r * 0.5} 0 0 1 ${560 + r},608`} fill="none" stroke="#6f86c9" strokeWidth={2} strokeLinecap="round" className="s6-wifi" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
          <text x={560} y={702} fill="#a5b4fc" fontSize={15} fontWeight={700} textAnchor="middle">{L.sim}</text>
        </motion.g>

        {/* Paquetes (los mueve el reloj) */}
        {CHAINS.map((chain, ci) =>
          Array.from({ length: N }, (_, k) => (
            <Packet key={`${chain.id}-${k}`} color={chain.color} setRef={(el) => { packetRefs.current[ci * N + k] = el; }} />
          )),
        )}

        {/* Etiquetas */}
        <Cloud x={95} y={225} />
        <text x={152} y={322} fill="#fff" fontSize={22} fontWeight={700} textAnchor="middle">{L.azure.title}</text>
        <text x={152} y={341} fill="#a5b4fc" fontSize={14.5} textAnchor="middle">{L.azure.sub}</text>

        <text x={482} y={168} fill="#f1f5ff" fontSize={20} fontWeight={700} textAnchor="end">{L.db.title}</text>
        <text x={482} y={187} fill="#a5b4fc" fontSize={14.5} textAnchor="end">{L.db.sub}</text>

        <rect x={237} y={355} width={150} height={73} rx={11} fill="#0a1129" fillOpacity={0.88} stroke="#27407a" strokeOpacity={0.8} />
        <text x={375} y={380} fill="#f1f5ff" fontSize={17} fontWeight={700} textAnchor="end">{L.ftp.title}</text>
        <text x={375} y={399} fill="#a5b4fc" fontSize={13.5} textAnchor="end">{L.ftp.sub1}</text>
        <text x={375} y={416} fill="#a5b4fc" fontSize={13.5} textAnchor="end">{L.ftp.sub2}</text>

        <rect x={737} y={355} width={150} height={73} rx={11} fill="#0a1129" fillOpacity={0.88} stroke="#27407a" strokeOpacity={0.8} />
        <text x={749} y={380} fill="#f1f5ff" fontSize={17} fontWeight={700}>{L.http.title}</text>
        <text x={749} y={399} fill="#a5b4fc" fontSize={13.5}>{L.http.sub1}</text>
        <text x={749} y={416} fill="#a5b4fc" fontSize={13.5}>{L.http.sub2}</text>

        <Reveal show={step >= 1}>
          <text x={431} y={599} fill="#5eead4" fontSize={16} fontWeight={700} textAnchor="end" style={{ fill: c.cyan.glow }}>{L.ftpRoute.title}</text>
          <text x={431} y={618} fill="#a5b4fc" fontSize={13.5} textAnchor="end">{L.ftpRoute.sub}</text>
          <text x={690} y={599} fontSize={16} fontWeight={700} style={{ fill: '#4ade80' }}>{L.httpRoute.title}</text>
          <text x={690} y={618} fill="#a5b4fc" fontSize={13.5}>{L.httpRoute.sub}</text>
        </Reveal>

        {/* Dashboard (encima de todo: los paquetes "entran" por su borde izquierdo) */}
        <Reveal show={step >= 0} x={30}>
          <text x={1030} y={200} fill="#f1f5ff" fontSize={21} fontWeight={700} textAnchor="middle">{L.dash.title}</text>
          <text x={1030} y={221} fill="#a5b4fc" fontSize={14} textAnchor="middle">{L.dash.sub}</text>
          <g className="s6-float">
            <Dashboard live={step >= 4 && !isReduced} t={t} />
          </g>
        </Reveal>
      </svg>
    </div>
  );
}
