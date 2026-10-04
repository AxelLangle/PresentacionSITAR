'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Paleta Dracula (idéntica a snippet_sitar.png)                      */
/* ------------------------------------------------------------------ */
const C = {
  bg: '#282a36',
  bar: '#21222c',
  line: '#44475a',
  fg: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  yellow: '#f1fa8c',
  gray: '#8f94b8',
  label: '#bfc3d9',
  blue: '#60a5fa',
  blueGlow: '#3b82f6',
};

const MONO = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'DejaVu Sans Mono', monospace";

/* ------------------------------------------------------------------ */
/*  Código (snippet_sitar.ino) tokenizado para el efecto de escritura  */
/* ------------------------------------------------------------------ */
type Kind = 'p' | 'k' | 'c' | 'f' | 'n' | 'm' | 'mb';
type Token = [string, Kind];

const KIND_COLOR: Record<Kind, string> = {
  p: C.fg,
  k: C.pink,
  c: C.orange,
  f: C.green,
  n: C.purple,
  m: C.comment,
  mb: C.cyan,
};

const CODE: Token[][] = [
  [['enum', 'k'], [' Estado {', 'p']],
  [['  ', 'p'], ['IDLE', 'c'], [', ', 'p'], ['LEER_MODBUS', 'c'], [', ', 'p'], ['INIT_GPRS', 'c'], [',', 'p']],
  [['  ', 'p'], ['ENVIAR_HTTP', 'c'], [', ', 'p'], ['ESPERAR_HTTPACTION', 'c'], [',', 'p']],
  [['  ', 'p'], ['CERRAR_HTTP', 'c'], [', ', 'p'], ['ENVIAR_FTP', 'c'], [',', 'p']],
  [['  ', 'p'], ['FALLBACK_SMS', 'c'], [', ', 'p'], ['ESPERAR_SMS', 'c']],
  [['};', 'p']],
  [],
  [['void', 'k'], [' ', 'p'], ['loop', 'f'], ['() {', 'p']],
  [['  ', 'p'], ['switch', 'k'], [' (estadoActual) {', 'p']],
  [],
  [['    ', 'p'], ['case', 'k'], [' ', 'p'], ['IDLE', 'c'], [':', 'p']],
  [['      ', 'p'], ['if', 'k'], [' (ahora ', 'p'], ['-', 'k'], [' tiempoAnterior ', 'p'], ['>=', 'k'], [' ', 'p'], ['INTERVALO_LECTURA', 'c'], [')', 'p']],
  [['        ', 'p'], ['cambiarEstado', 'f'], ['(', 'p'], ['LEER_MODBUS', 'c'], [');', 'p']],
  [['      ', 'p'], ['break', 'k'], [';', 'p']],
  [],
  [['    ', 'p'], ['case', 'k'], [' ', 'p'], ['LEER_MODBUS', 'c'], [':', 'p']],
  [['      ', 'p'], ['usarPinesModbus', 'f'], ['();   ', 'p'], ['// ', 'm'], ['Modbus RTU', 'mb'], [' (RS485)', 'm']],
  [['      r1 ', 'p'], ['=', 'k'], [' node.', 'p'], ['readInputRegisters', 'f'], ['(', 'p'], ['0', 'n'], [', ', 'p'], ['5', 'n'], [');', 'p']],
  [['      r2 ', 'p'], ['=', 'k'], [' node.', 'p'], ['readInputRegisters', 'f'], ['(', 'p'], ['5', 'n'], [', ', 'p'], ['5', 'n'], [');', 'p']],
  [['      ', 'p'], ['usarPinesSIM', 'f'], ['();      ', 'p'], ['// GPRS (SIM800L)', 'm']],
  [],
  [['      ', 'p'], ['if', 'k'], [' (r1 ', 'p'], ['==', 'k'], [' node.', 'p'], ['ku8MBSuccess', 'c'], [' ', 'p'], ['&&', 'k'], [' r2 ', 'p'], ['==', 'k'], [' node.', 'p'], ['ku8MBSuccess', 'c'], [')', 'p']],
  [['        ', 'p'], ['cambiarEstado', 'f'], ['(', 'p'], ['ENVIAR_HTTP', 'c'], [');', 'p']],
  [['      ', 'p'], ['else', 'k']],
  [['        ', 'p'], ['cambiarEstado', 'f'], ['(', 'p'], ['IDLE', 'c'], [');', 'p']],
  [['      ', 'p'], ['break', 'k'], [';', 'p']],
  [['  }', 'p']],
  [['}', 'p']],
];

// Offset inicial de cada línea (cada salto de línea cuenta como 1 carácter → pausa natural)
const LINE_META = (() => {
  let offset = 0;
  return CODE.map((tokens) => {
    const start = offset;
    const len = tokens.reduce((acc, [txt]) => acc + txt.length, 0) + 1;
    offset += len;
    return { start, len };
  });
})();
const TOTAL_CHARS = LINE_META[LINE_META.length - 1].start + LINE_META[LINE_META.length - 1].len;

const TYPE_STEP = 2; // caracteres por tick
const TYPE_TICK_MS = 28; // ~10 s para todo el snippet
const TYPE_START_DELAY_MS = 700;

/*
 * Tamaño de fuente del editor ajustado al espacio disponible:
 *  - Alto: 100vh − 170px (encabezado) − 90px (pie) − ~54px (barra + margen)
 *          repartido entre 28 líneas × 1.6 de interlineado + 2em de padding ≈ 46.8em
 *  - Ancho: media pantalla (50vw − 84px) entre ~43em (línea más larga + gutter)
 */
const CODE_LINE_HEIGHT = 1.6;
const CODE_FONT_SIZE = 'clamp(8px, min(calc((100vh - 314px) / 46.8), calc((50vw - 84px) / 43)), 17px)';

/* ------------------------------------------------------------------ */
/*  Diagrama (sitar_maquina_estados.svg) como datos                    */
/* ------------------------------------------------------------------ */
type NodeId =
  | 'IDLE'
  | 'LEER_MODBUS'
  | 'INIT_GPRS'
  | 'ENVIAR_HTTP'
  | 'ESPERAR_HTTPACTION'
  | 'CERRAR_HTTP'
  | 'ENVIAR_FTP'
  | 'FALLBACK_SMS'
  | 'ESPERAR_SMS';

const NODE_W = 190;
const NODE_H = 54;

const NODES: Record<NodeId, { x: number; y: number; stroke: string; fontSize?: number }> = {
  IDLE: { x: 455, y: 73, stroke: C.yellow },
  LEER_MODBUS: { x: 455, y: 163, stroke: C.cyan },
  INIT_GPRS: { x: 105, y: 303, stroke: C.purple },
  ENVIAR_HTTP: { x: 455, y: 303, stroke: C.purple },
  ESPERAR_HTTPACTION: { x: 455, y: 443, stroke: C.purple, fontSize: 12 },
  CERRAR_HTTP: { x: 455, y: 583, stroke: C.purple },
  ENVIAR_FTP: { x: 455, y: 723, stroke: C.orange },
  FALLBACK_SMS: { x: 805, y: 443, stroke: C.pink },
  ESPERAR_SMS: { x: 805, y: 583, stroke: C.pink },
};

type EdgeId =
  | 'idle_leer' | 'leer_http' | 'http_wait' | 'wait_close' | 'close_ftp' | 'gprs_http'
  | 'r1' | 'r2' | 'r3'
  | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p_dash'
  | 'return';

const EDGES: { id: EdgeId; d: string; color: string; marker: string; dashed?: boolean }[] = [
  // flujo principal
  { id: 'idle_leer', d: 'M550 127 L550 163', color: C.green, marker: 's5aG' },
  { id: 'leer_http', d: 'M550 217 L550 303', color: C.green, marker: 's5aG' },
  { id: 'http_wait', d: 'M550 357 L550 443', color: C.green, marker: 's5aG' },
  { id: 'wait_close', d: 'M550 497 L550 583', color: C.green, marker: 's5aG' },
  { id: 'close_ftp', d: 'M550 637 L550 723', color: C.green, marker: 's5aG' },
  { id: 'gprs_http', d: 'M295 320 L455 320', color: C.green, marker: 's5aG' },
  // reintentos / errores
  { id: 'r1', d: 'M455 343 L295 343', color: C.orange, marker: 's5aO' },
  { id: 'r2', d: 'M455 470 L200 470 L200 357', color: C.orange, marker: 's5aO' },
  { id: 'r3', d: 'M455 190 L395 190 L395 90 L455 90', color: C.orange, marker: 's5aO' },
  // hacia SMS
  { id: 'p1', d: 'M645 330 L880 330 L880 443', color: C.pink, marker: 's5aP' },
  { id: 'p2', d: 'M645 470 L805 470', color: C.pink, marker: 's5aP' },
  { id: 'p3', d: 'M900 497 L900 583', color: C.pink, marker: 's5aP' },
  { id: 'p4', d: 'M900 637 L900 735 L645 735', color: C.pink, marker: 's5aP' },
  { id: 'p5', d: 'M995 470 L1055 470 L1055 765 L645 765', color: C.pink, marker: 's5aP' },
  { id: 'p_dash', d: 'M200 303 L200 255 L920 255 L920 443', color: C.pink, marker: 's5aP', dashed: true },
  // retorno a IDLE
  { id: 'return', d: 'M455 750 L40 750 L40 70 L455 70', color: C.gray, marker: 's5aX' },
];

const LABELS: { x: number; y: number; text: string; edge: EdgeId; anchor?: 'start' | 'middle' | 'end' }[] = [
  { x: 560, y: 150, text: 'cada 12 s', edge: 'idle_leer' },
  { x: 560, y: 290, text: 'lectura OK (r1 y r2)', edge: 'leer_http' },
  { x: 560, y: 405, text: 'AT+HTTPACTION=1', edge: 'http_wait' },
  { x: 560, y: 545, text: 'HTTP 200 / 201', edge: 'wait_close' },
  { x: 560, y: 685, text: 'mismo JSON', edge: 'close_ftp' },
  { x: 375, y: 310, text: 'bearer OK', edge: 'gprs_http', anchor: 'middle' },
  { x: 375, y: 362, text: 'HTTPINIT falla', edge: 'r1', anchor: 'middle' },
  { x: 375, y: 377, text: 'reintentos < 3', edge: 'r1', anchor: 'middle' },
  { x: 327, y: 490, text: 'timeout 30 s / HTTP ≠ 200', edge: 'r2', anchor: 'middle' },
  { x: 327, y: 505, text: 'reintentos < 3', edge: 'r2', anchor: 'middle' },
  { x: 385, y: 140, text: 'error Modbus', edge: 'r3', anchor: 'end' },
  { x: 720, y: 245, text: 'falla SAPBR', edge: 'p_dash', anchor: 'middle' },
  { x: 762, y: 312, text: 'reintentos ≥ 3', edge: 'p1', anchor: 'middle' },
  { x: 762, y: 327, text: 'o sin "DOWNLOAD"', edge: 'p1', anchor: 'middle' },
  { x: 725, y: 460, text: 'reintentos ≥ 3', edge: 'p2', anchor: 'middle' },
  { x: 910, y: 545, text: 'mensaje + Ctrl-Z', edge: 'p3' },
  { x: 775, y: 725, text: '+CMGS ó timeout 25 s', edge: 'p4', anchor: 'middle' },
  { x: 775, y: 783, text: "falla CMGF / sin prompt '>'", edge: 'p5', anchor: 'middle' },
];

/* ------------------------------------------------------------------ */
/*  Secuencia animada: Lectura → Modbus → GPRS → Sueño                 */
/* ------------------------------------------------------------------ */
type Phase = 0 | 1 | 2 | 3; // 0: Lectura, 1: Modbus, 2: GPRS, 3: Sueño

const STEPS: { phase: Phase; nodes: NodeId[]; edges: EdgeId[]; ms: number }[] = [
  { phase: 0, nodes: ['IDLE'], edges: ['idle_leer'], ms: 1800 },
  { phase: 1, nodes: ['LEER_MODBUS'], edges: ['leer_http'], ms: 2200 },
  { phase: 2, nodes: ['ENVIAR_HTTP'], edges: ['http_wait'], ms: 1400 },
  { phase: 2, nodes: ['ESPERAR_HTTPACTION'], edges: ['wait_close'], ms: 1400 },
  { phase: 2, nodes: ['CERRAR_HTTP'], edges: ['close_ftp'], ms: 1400 },
  { phase: 2, nodes: ['ENVIAR_FTP'], edges: [], ms: 1200 },
  { phase: 3, nodes: ['IDLE'], edges: ['return'], ms: 2800 },
];
const STEP_START_DELAY_MS = 1200;

// Líneas del código (1-indexadas) que se resaltan en cada fase una vez terminado el tecleo
const PHASE_LINES: Record<Phase, number[]> = {
  0: [13],
  1: [16, 17, 18, 19],
  2: [20, 22, 23],
  3: [11, 12],
};

/* ------------------------------------------------------------------ */
/*  "Modbus RTU" interactivo: brilla en azul al pasar el ratón         */
/* ------------------------------------------------------------------ */
function ModbusWord({
  children,
  hovered,
  onHover,
  baseColor = C.cyan,
}: {
  children: React.ReactNode;
  hovered: boolean;
  onHover: (v: boolean) => void;
  baseColor?: string;
}) {
  return (
    <span
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="font-bold cursor-pointer"
      style={{
        color: hovered ? C.blue : baseColor,
        textShadow: hovered ? `0 0 6px ${C.blueGlow}, 0 0 14px ${C.blueGlow}, 0 0 28px ${C.blueGlow}` : 'none',
        transition: 'color 0.25s ease, text-shadow 0.25s ease',
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide                                                              */
/* ------------------------------------------------------------------ */
export default function Slide5() {
  const { t } = useLanguage();
  const [typed, setTyped] = useState(0);
  const [step, setStep] = useState(-1);
  const [modbusHover, setModbusHover] = useState(false);

  // Efecto máquina de escribir
  useEffect(() => {
    if (typed >= TOTAL_CHARS) return;
    const id = setTimeout(
      () => setTyped((v) => Math.min(v + TYPE_STEP, TOTAL_CHARS)),
      typed === 0 ? TYPE_START_DELAY_MS : TYPE_TICK_MS,
    );
    return () => clearTimeout(id);
  }, [typed]);

  // Ciclo del diagrama (arranca mientras se escribe el código)
  useEffect(() => {
    const delay = step < 0 ? STEP_START_DELAY_MS : STEPS[step].ms;
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), delay);
    return () => clearTimeout(id);
  }, [step]);

  const typingDone = typed >= TOTAL_CHARS;
  const current = step >= 0 ? STEPS[step] : null;
  const phase = current?.phase ?? -1;

  const activeNodes = useMemo(() => {
    const set = new Set<NodeId>(current?.nodes ?? []);
    if (modbusHover) set.add('LEER_MODBUS');
    return set;
  }, [current, modbusHover]);
  const activeEdges = useMemo(() => new Set<EdgeId>(current?.edges ?? []), [current]);
  const highlightedLines = typingDone && phase >= 0 ? PHASE_LINES[phase as Phase] : [];
  const dimming = current !== null || modbusHover;

  const phases = [
    { label: t.fsmRead, color: C.green },
    { label: 'Modbus RTU', color: C.cyan, modbus: true },
    { label: 'GPRS', color: C.purple },
    { label: t.fsmSleep, color: C.yellow },
  ];

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(ellipse at 30% 40%, #1e1b2e, #0b0a12 55%, #000000)' }}
    >
      {/* Encabezado */}
      <div className="absolute top-16 left-16 z-10">
        <h2 className="text-4xl font-bold text-white tracking-tight">{t.firmwareTitle}</h2>
        <p className="text-gray-400 mt-2 text-lg">{t.firmwareDesc}</p>
      </div>

      {/* Contenido: código (izq.) + diagrama (der.) */}
      <div
        className="absolute left-16 right-16 grid grid-cols-2 grid-rows-1 gap-10 items-center"
        style={{ top: '170px', bottom: '90px' }}
      >
        {/* ---------------- Editor de código ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden shadow-2xl self-center max-h-full min-h-0"
          style={{ backgroundColor: C.bg, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 80px rgba(189,147,249,0.08)' }}
        >
          {/* Barra de título */}
          <div className="relative flex items-center px-5 py-3" style={{ backgroundColor: C.bar }}>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5555' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: C.yellow }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: C.green }} />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm" style={{ color: C.comment, fontFamily: MONO }}>
              SITAR-firmware.ino
            </span>
          </div>

          {/* Código: la fuente se ajusta al espacio disponible para que nunca se encime con el título */}
          <div style={{ fontFamily: MONO, fontSize: CODE_FONT_SIZE, lineHeight: CODE_LINE_HEIGHT, padding: '1em 1.5em 1em 0' }}>
            {CODE.map((tokens, i) => {
              const { start, len } = LINE_META[i];
              const lineNo = i + 1;
              const reached = typed > start || (i === 0 && typed > 0);
              const isCursorLine = typed >= start && (typed < start + len || (i === CODE.length - 1 && typingDone));
              const isHighlighted = highlightedLines.includes(lineNo);
              const hlColor = phase >= 0 ? phases[phase].color : C.cyan;
              let offset = start;

              return (
                <div
                  key={i}
                  className="flex whitespace-pre"
                  style={{
                    backgroundColor: isHighlighted ? `${hlColor}1a` : 'transparent',
                    boxShadow: isHighlighted ? `inset 3px 0 0 ${hlColor}` : 'inset 3px 0 0 transparent',
                    transition: 'background-color 0.4s ease, box-shadow 0.4s ease',
                  }}
                >
                  <span
                    className="select-none text-right shrink-0"
                    style={{ width: '3.6em', paddingRight: '1.4em', color: C.comment, opacity: reached ? 0.7 : 0.15, transition: 'opacity 0.2s' }}
                  >
                    {lineNo}
                  </span>
                  <span>
                    {tokens.map(([txt, kind], j) => {
                      const visible = Math.max(0, Math.min(txt.length, typed - offset));
                      offset += txt.length;
                      if (visible === 0) return null;
                      const shown = txt.slice(0, visible);
                      if (kind === 'mb') {
                        return (
                          <ModbusWord key={j} hovered={modbusHover} onHover={setModbusHover}>
                            {shown}
                          </ModbusWord>
                        );
                      }
                      return (
                        <span key={j} style={{ color: KIND_COLOR[kind] }}>
                          {shown}
                        </span>
                      );
                    })}
                    {isCursorLine && (
                      <motion.span
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 0.5, 1] }}
                        className="inline-block align-middle"
                        style={{ width: '0.55em', height: '1.15em', backgroundColor: C.fg, marginLeft: '1px' }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------- Máquina de estados ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="h-full flex flex-col gap-4 min-h-0"
        >
          {/* Indicador de fases */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {phases.map((p, i) => {
              const active = phase === i || (p.modbus && modbusHover);
              return (
                <React.Fragment key={i}>
                  <div
                    className="px-4 py-1.5 rounded-full text-sm tracking-wide"
                    style={{
                      fontFamily: MONO,
                      border: `1px solid ${active ? p.color : 'rgba(255,255,255,0.12)'}`,
                      color: active ? p.color : '#9ca3af',
                      backgroundColor: active ? `${p.color}1f` : 'rgba(255,255,255,0.03)',
                      boxShadow: active ? `0 0 18px ${p.color}55` : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    {p.modbus ? (
                      <ModbusWord hovered={modbusHover} onHover={setModbusHover} baseColor={active ? p.color : '#9ca3af'}>
                        {p.label}
                      </ModbusWord>
                    ) : (
                      p.label
                    )}
                  </div>
                  {i < phases.length - 1 && (
                    <span style={{ color: phase === i ? phases[i].color : '#4b5563', transition: 'color 0.4s' }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Diagrama */}
          <div className="flex-1 min-h-0">
            <svg
              viewBox="10 100 1080 820"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              fontFamily="DejaVu Sans, Arial, sans-serif"
            >
              <defs>
                {[
                  ['s5aG', C.green],
                  ['s5aO', C.orange],
                  ['s5aP', C.pink],
                  ['s5aB', C.cyan],
                  ['s5aX', C.gray],
                ].map(([id, fill]) => (
                  <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                    <path d="M0 0 L10 5 L0 10 z" fill={fill} />
                  </marker>
                ))}
              </defs>

              <g transform="translate(0,70)" fontSize="12" fill={C.label}>
                {/* inicio */}
                <g style={{ opacity: dimming ? 0.35 : 1, transition: 'opacity 0.5s' }}>
                  <circle cx="550" cy="48" r="6" fill={C.fg} />
                  <text x="562" y="52">setup()</text>
                  <path d="M550 54 L550 73" stroke={C.fg} strokeWidth="2" markerEnd="url(#s5aX)" fill="none" />
                </g>

                {/* aristas */}
                {EDGES.map((e) => {
                  const active = activeEdges.has(e.id);
                  return (
                    <g key={e.id}>
                      <path
                        d={e.d}
                        stroke={e.color}
                        strokeWidth={2.5}
                        strokeDasharray={e.dashed ? '7 5' : undefined}
                        fill="none"
                        markerEnd={`url(#${e.marker})`}
                        style={{ opacity: !dimming || active ? 1 : 0.28, transition: 'opacity 0.5s' }}
                      />
                      {active && (
                        <motion.path
                          key={`${e.id}-${step}`}
                          d={e.d}
                          stroke={e.color === C.gray ? C.yellow : '#ffffff'}
                          strokeWidth={4}
                          strokeLinecap="round"
                          fill="none"
                          initial={{ pathLength: 0, opacity: 1 }}
                          animate={{ pathLength: 1, opacity: [1, 1, 0.6] }}
                          transition={{ duration: e.id === 'return' ? 1.4 : 0.7, ease: 'easeInOut' }}
                          style={{ filter: `drop-shadow(0 0 6px ${e.color === C.gray ? C.yellow : e.color})` }}
                        />
                      )}
                    </g>
                  );
                })}

                {/* etiquetas */}
                {LABELS.map((l, i) => {
                  const active = activeEdges.has(l.edge);
                  return (
                    <text
                      key={i}
                      x={l.x}
                      y={l.y}
                      textAnchor={l.anchor ?? 'start'}
                      style={{
                        opacity: !dimming || active ? 1 : 0.3,
                        fill: active ? C.fg : C.label,
                        fontWeight: active ? 700 : 400,
                        transition: 'opacity 0.5s, fill 0.5s',
                      }}
                    >
                      {l.text}
                    </text>
                  );
                })}
                <text
                  transform="translate(28,410) rotate(-90)"
                  textAnchor="middle"
                  style={{
                    opacity: !dimming || activeEdges.has('return') ? 1 : 0.3,
                    fill: activeEdges.has('return') ? C.yellow : C.label,
                    transition: 'opacity 0.5s, fill 0.5s',
                  }}
                >
                  siempre (éxito o fallo) → vuelve a IDLE
                </text>

                {/* nodos */}
                <g fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="DejaVu Sans Mono, monospace">
                  {(Object.keys(NODES) as NodeId[]).map((id) => {
                    const n = NODES[id];
                    const active = activeNodes.has(id);
                    const hoverBlue = id === 'LEER_MODBUS' && modbusHover;
                    const glow = hoverBlue ? C.blueGlow : n.stroke;
                    return (
                      <g
                        key={id}
                        style={{ opacity: !dimming || active ? 1 : 0.45, transition: 'opacity 0.5s' }}
                        onMouseEnter={id === 'LEER_MODBUS' ? () => setModbusHover(true) : undefined}
                        onMouseLeave={id === 'LEER_MODBUS' ? () => setModbusHover(false) : undefined}
                        className={id === 'LEER_MODBUS' ? 'cursor-pointer' : undefined}
                      >
                        {active && (
                          <motion.rect
                            key={`${id}-${step}-${modbusHover}`}
                            fill="none"
                            stroke={glow}
                            strokeWidth={2}
                            initial={{ x: n.x, y: n.y, width: NODE_W, height: NODE_H, rx: 27, opacity: 0.8 }}
                            animate={{
                              x: n.x - 12,
                              y: n.y - 12,
                              width: NODE_W + 24,
                              height: NODE_H + 24,
                              rx: 39,
                              opacity: 0,
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                          />
                        )}
                        <rect
                          x={n.x}
                          y={n.y}
                          width={NODE_W}
                          height={NODE_H}
                          rx={27}
                          style={{
                            fill: active ? (hoverBlue ? '#1e3a8a' : '#565a75') : C.line,
                            stroke: hoverBlue ? C.blue : n.stroke,
                            strokeWidth: active ? 4 : 3,
                            filter: active ? `drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 22px ${glow}88)` : 'none',
                            transition: 'fill 0.4s, stroke 0.3s, stroke-width 0.4s, filter 0.4s',
                          }}
                        />
                        <text x={n.x + NODE_W / 2} y={n.y + 32} fontSize={n.fontSize} fill={C.fg}>
                          {id}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Zz… cuando el sistema vuelve a dormir */}
                {phase === 3 && (
                  <g key={`zz-${step}`} fontFamily={MONO} fontWeight="bold" fill={C.yellow}>
                    {['z', 'Z', 'z'].map((z, i) => (
                      <motion.text
                        key={i}
                        x={660 + i * 18}
                        y={95}
                        fontSize={14 + i * 4}
                        initial={{ opacity: 0, y: 105 }}
                        animate={{ opacity: [0, 1, 0], y: [105 - i * 8, 80 - i * 12] }}
                        transition={{ duration: 1.8, delay: 0.9 + i * 0.25, repeat: Infinity, repeatDelay: 0.3 }}
                      >
                        {z}
                      </motion.text>
                    ))}
                  </g>
                )}

                {/* leyenda */}
                <g fontSize="12" fill={C.label}>
                  <line x1="140" y1="835" x2="175" y2="835" stroke={C.green} strokeWidth="3" />
                  <text x="182" y="839">flujo normal</text>
                  <line x1="300" y1="835" x2="335" y2="835" stroke={C.orange} strokeWidth="3" />
                  <text x="342" y="839">reintento / error</text>
                  <line x1="500" y1="835" x2="535" y2="835" stroke={C.pink} strokeWidth="3" />
                  <text x="542" y="839">respaldo SMS</text>
                  <line x1="680" y1="835" x2="715" y2="835" stroke={C.gray} strokeWidth="3" />
                  <text x="722" y="839">retorno a IDLE</text>
                </g>
              </g>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
