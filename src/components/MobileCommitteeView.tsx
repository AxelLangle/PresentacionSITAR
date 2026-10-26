'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Cpu,
  Radio,
  Cloud,
  Activity,
  ShieldCheck,
  Droplets,
  Code2,
  GitBranch,
  Database,
  Server,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  AlertTriangle,
  HardDrive,
  MonitorPlay,
  Headphones,
  Globe,
} from 'lucide-react';
import { Language } from '@/lib/translations';
import {
  AUDIO_CATALOG,
  SectionId,
  committeeTranslations,
} from '@/lib/committeeData';

const SECTION_IDS: SectionId[] = ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09'];

const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'ES', label: 'ES', nativeName: 'Español' },
  { code: 'EN', label: 'EN', nativeName: 'English' },
  { code: 'SK', label: 'SK', nativeName: 'Slovenčina' },
  { code: 'PL', label: 'PL', nativeName: 'Polski' },
];

const HARDWARE_MEDIA = [
  { type: 'video' as const, src: '/carousel/Animacion.mkv' },
  { type: 'image' as const, src: '/carousel/ATTINY1614_2.png' },
  { type: 'image' as const, src: '/carousel/RS48 Y SIM800L.png' },
  { type: 'image' as const, src: '/carousel/PowerSupply.png' },
];

/* Código fuente C++ resumido y coloreado (tema Dracula de Slide 5) */
const FIRMWARE_CODE_LINES: { line: number; phase: number; code: string; comment?: string }[] = [
  { line: 1, phase: -1, code: 'enum Estado {' },
  { line: 2, phase: 0, code: '  IDLE, LEER_MODBUS, INIT_GPRS,' },
  { line: 3, phase: 2, code: '  ENVIAR_HTTP, ESPERAR_HTTPACTION,' },
  { line: 4, phase: 3, code: '  CERRAR_HTTP, ENVIAR_FTP,' },
  { line: 5, phase: 4, code: '  FALLBACK_SMS, ESPERAR_SMS' },
  { line: 6, phase: -1, code: '};' },
  { line: 7, phase: -1, code: 'void loop() {' },
  { line: 8, phase: -1, code: '  switch (estadoActual) {' },
  { line: 9, phase: 0, code: '    case IDLE:' },
  { line: 10, phase: 0, code: '      if (ahora - tPrev >= INTERVALO_LECTURA)' },
  { line: 11, phase: 0, code: '        cambiarEstado(LEER_MODBUS);' },
  { line: 12, phase: 0, code: '      break;' },
  { line: 13, phase: 1, code: '    case LEER_MODBUS:', comment: '// Maestro RS-485' },
  { line: 14, phase: 1, code: '      usarPinesModbus();' },
  { line: 15, phase: 1, code: '      r1 = node.readInputRegisters(0, 5);' },
  { line: 16, phase: 1, code: '      r2 = node.readInputRegisters(5, 5);' },
  { line: 17, phase: 2, code: '      usarPinesSIM();', comment: '// GPRS SIM800L' },
  { line: 18, phase: 2, code: '      if (r1 == ku8MBSuccess && r2 == ku8MBSuccess)' },
  { line: 19, phase: 2, code: '        cambiarEstado(ENVIAR_HTTP);' },
  { line: 20, phase: 4, code: '      else cambiarEstado(IDLE);' },
  { line: 21, phase: 1, code: '      break;' },
  { line: 22, phase: -1, code: '  }' },
  { line: 23, phase: -1, code: '}' },
];

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function MobileCommitteeView() {
  const [language, setLanguage] = useState<Language>('ES');
  const [activeSection, setActiveSection] = useState<SectionId>('D01');
  const [expandedTranscripts, setExpandedTranscripts] = useState<Record<string, boolean>>({});
  const [hardwareIndex, setHardwareIndex] = useState(0);
  const [fsmTab, setFsmTab] = useState<'diagram' | 'code'>('diagram');
  const [activeFsmState, setActiveFsmState] = useState<number>(0);

  // Estado de simulación de telemetría en vivo (Sección D07)
  const [anomalyMode, setAnomalyMode] = useState(false);
  const [flowHistory, setFlowHistory] = useState<number[]>([3.72, 3.85, 3.68, 3.91, 3.79, 3.84, 3.95, 3.76, 3.88, 3.82, 3.9, 3.86]);
  const [totalizer, setTotalizer] = useState<number>(1452.48);
  const [recentFtpFile, setRecentFtpFile] = useState<string>('telemetry_1452.csv');

  // Estado de compartir / enlace
  const [copiedLink, setCopiedLink] = useState(false);

  // Catálogo dinámico de audios (permite detectar si se agregan nuevos .mp3 en public/audio)
  const [catalog, setCatalog] = useState<Record<SectionId, Record<Language, string[]>>>(AUDIO_CATALOG);

  // Estado del reproductor de audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    D01: null,
    D02: null,
    D03: null,
    D04: null,
    D05: null,
    D06: null,
    D07: null,
    D08: null,
    D09: null,
  });

  const [playingSection, setPlayingSection] = useState<SectionId | null>(null);
  const [playingLang, setPlayingLang] = useState<Language>('ES');
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fullGuideMode, setFullGuideMode] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const t = committeeTranslations[language];

  // Sondeo ligero para descubrir audios adicionales si el usuario deposita nuevos .mp3 en /public/audio/
  useEffect(() => {
    let cancelled = false;
    async function probeMissingAudios() {
      const checks: Promise<{ sec: SectionId; lang: Language; tracks: string[] } | null>[] = [];
      SECTION_IDS.forEach((sec, idx) => {
        const slideNum = idx + 1;
        if (AUDIO_CATALOG[sec][language].length === 0) {
          const candidates = [
            `/audio/${sec}/${language}/${slideNum}_1.mp3`,
            `/audio/${sec}/${language}/${slideNum}_2.mp3`,
          ];
          checks.push(
            (async () => {
              const found: string[] = [];
              for (const url of candidates) {
                try {
                  const res = await fetch(url, { method: 'HEAD' });
                  if (res.ok) found.push(url);
                } catch {
                  // Ignorar si no existe
                }
              }
              return found.length > 0 ? { sec, lang: language, tracks: found } : null;
            })()
          );
        }
      });

      const results = await Promise.all(checks);
      if (cancelled) return;
      const valid = results.filter((r): r is { sec: SectionId; lang: Language; tracks: string[] } => r !== null);
      if (valid.length > 0) {
        setCatalog((prev) => {
          const next = { ...prev };
          valid.forEach(({ sec, lang, tracks }) => {
            next[sec] = { ...next[sec], [lang]: tracks };
          });
          return next;
        });
      }
    }
    probeMissingAudios();
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Ciclo automático para resaltar estados del FSM en la sección D05
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFsmState((prev) => (prev + 1) % t.fsmStates.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [t.fsmStates.length]);

  // Simulación de telemetría en vivo para la sección D07
  useEffect(() => {
    const timer = setInterval(() => {
      setFlowHistory((prev) => {
        const base = anomalyMode ? 7.4 : 3.65;
        const variance = anomalyMode ? 1.1 : 0.45;
        const nextVal = Number((base + Math.random() * variance).toFixed(2));
        const nextArr = [...prev.slice(1), nextVal];
        setTotalizer((tot) => Number((tot + nextVal * (3 / 3600)).toFixed(3)));
        if (Math.random() > 0.6) {
          setRecentFtpFile(`telemetry_${Math.floor(1450 + Math.random() * 50)}.csv`);
        }
        return nextArr;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [anomalyMode]);

  // Detectar sección visible al hacer scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportOffset = scrollTop + 180;
      let current: SectionId = 'D01';

      for (const id of SECTION_IDS) {
        const el = sectionRefs.current[id];
        if (el && el.offsetTop <= viewportOffset) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: SectionId) => {
    const container = scrollContainerRef.current;
    const target = sectionRefs.current[id];
    if (container && target) {
      const top = Math.max(0, target.offsetTop - 118);
      container.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
  }, []);

  // Reproducir una pista específica
  const startPlayback = useCallback(
    (sectionId: SectionId, lang: Language, partIdx: number, isFullGuide: boolean) => {
      const tracks = catalog[sectionId]?.[lang] ?? [];
      if (!tracks.length || !tracks[partIdx]) return;

      const audio = audioRef.current;
      if (!audio) return;

      audio.src = tracks[partIdx];
      audio.playbackRate = playbackRate;
      setPlayingSection(sectionId);
      setPlayingLang(lang);
      setCurrentPartIndex(partIdx);
      setFullGuideMode(isFullGuide);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });

      if (autoScroll && isFullGuide) {
        scrollToSection(sectionId);
      }
    },
    [catalog, playbackRate, autoScroll, scrollToSection]
  );

  // Manejo del evento onEnded para encadenar Parte 1 -> Parte 2 -> Siguiente sección
  const handleAudioEnded = useCallback(() => {
    if (!playingSection) return;
    const tracks = catalog[playingSection]?.[playingLang] ?? [];

    // Si hay otra parte dentro de la misma sección, reproducirla inmediatamente
    if (currentPartIndex + 1 < tracks.length) {
      startPlayback(playingSection, playingLang, currentPartIndex + 1, fullGuideMode);
      return;
    }

    // Si estamos en modo Audioguía Completa, avanzar a la siguiente sección disponible
    if (fullGuideMode) {
      const currentIdx = SECTION_IDS.indexOf(playingSection);
      for (let i = currentIdx + 1; i < SECTION_IDS.length; i++) {
        const nextSec = SECTION_IDS[i];
        const nextTracks = catalog[nextSec]?.[playingLang] ?? [];
        if (nextTracks.length > 0) {
          startPlayback(nextSec, playingLang, 0, true);
          return;
        }
      }
    }

    // Fin de la reproducción
    setIsPlaying(false);
    setFullGuideMode(false);
    setCurrentPartIndex(0);
    setCurrentTime(0);
  }, [playingSection, playingLang, currentPartIndex, fullGuideMode, catalog, startPlayback]);

  //Alternar reproducción de una sección individual
  const toggleSectionAudio = (sectionId: SectionId, lang: Language) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingSection === sectionId && playingLang === lang) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      return;
    }

    startPlayback(sectionId, lang, 0, false);
  };

  // Alternar modo "Escuchar Presentación Completa"
  const toggleFullGuide = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fullGuideMode && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (fullGuideMode && !isPlaying && playingSection) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    // Buscar la primera sección con audio en el idioma actual (o en ES si el idioma actual no tiene ninguna)
    const hasAnyInSelected = SECTION_IDS.some((id) => (catalog[id]?.[language]?.length ?? 0) > 0);
    const targetLang: Language = hasAnyInSelected ? language : 'ES';
    const firstSec = SECTION_IDS.find((id) => (catalog[id]?.[targetLang]?.length ?? 0) > 0) ?? 'D01';

    startPlayback(firstSec, targetLang, 0, true);
  };

  // Saltar a sección anterior/siguiente desde el reproductor flotante
  const skipSection = (dir: -1 | 1) => {
    const currentSec = playingSection ?? activeSection;
    const langToUse = playingSection ? playingLang : (catalog[currentSec]?.[language]?.length ? language : 'ES');
    const idx = SECTION_IDS.indexOf(currentSec);

    let i = idx + dir;
    while (i >= 0 && i < SECTION_IDS.length) {
      const candidate = SECTION_IDS[i];
      if ((catalog[candidate]?.[langToUse]?.length ?? 0) > 0) {
        startPlayback(candidate, langToUse, 0, fullGuideMode);
        scrollToSection(candidate);
        return;
      }
      i += dir;
    }
  };

  // Cambiar velocidad de reproducción (1x -> 1.25x -> 1.5x -> 1x)
  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback silencioso
    }
  };

  const nativeAudioSectionCount = useMemo(() => {
    return SECTION_IDS.filter((id) => (catalog[id]?.[language]?.length ?? 0) > 0).length;
  }, [catalog, language]);

  const currentFlow = flowHistory[flowHistory.length - 1] ?? 3.82;

  // Renderizador del control de audio dentro de cada tarjeta de sección
  const renderSectionAudioBar = (sectionId: SectionId) => {
    const nativeTracks = catalog[sectionId]?.[language] ?? [];
    const esTracks = catalog[sectionId]?.ES ?? [];
    const hasNative = nativeTracks.length > 0;
    const isThisNativePlaying = playingSection === sectionId && playingLang === language && isPlaying;
    const isThisEsPlaying = playingSection === sectionId && playingLang === 'ES' && isPlaying;
    const isThisActive = playingSection === sectionId;
    const activeTracks = isThisActive ? catalog[sectionId]?.[playingLang] ?? [] : nativeTracks;
    const isTranscriptOpen = !!expandedTranscripts[sectionId];

    return (
      <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {hasNative ? (
            <button
              onClick={() => toggleSectionAudio(sectionId, language)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                isThisNativePlaying
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25'
              }`}
            >
              {isThisNativePlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>
                {isThisNativePlaying ? t.meta.pauseSection : `${t.meta.listenSection} (${language})`}
              </span>
              {activeTracks.length > 1 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isThisNativePlaying ? 'bg-slate-950/25 text-slate-950' : 'bg-cyan-950/80 text-cyan-300'
                  }`}
                >
                  {isThisActive ? `${t.meta.partIndicator} ${currentPartIndex + 1}/${activeTracks.length}` : `${activeTracks.length} pts`}
                </span>
              )}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                {t.meta.audioPendingLang}
              </span>
              {esTracks.length > 0 && (
                <button
                  onClick={() => toggleSectionAudio(sectionId, 'ES')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                    isThisEsPlaying
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25'
                  }`}
                >
                  {isThisEsPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isThisEsPlaying ? t.meta.playingSpanishFallback : t.meta.playInSpanishFallback}</span>
                </button>
              )}
            </div>
          )}

          <button
            onClick={() =>
              setExpandedTranscripts((prev) => ({
                ...prev,
                [sectionId]: !prev[sectionId],
              }))
            }
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{isTranscriptOpen ? t.meta.hideTranscript : t.meta.transcriptToggle}</span>
            {isTranscriptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Barra de progreso local cuando esta sección se está reproduciendo */}
        {isThisActive && (
          <div className="flex items-center gap-2.5 bg-slate-950/70 px-3 py-2 rounded-xl border border-cyan-500/20">
            <span className="text-[10px] font-mono text-cyan-400 tabular-nums w-8">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentTime(val);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              aria-label="Progreso de audio"
            />
            <span className="text-[10px] font-mono text-slate-400 tabular-nums w-8 text-right">
              {formatTime(duration)}
            </span>
            {activeTracks.length > 1 && (
              <div className="flex items-center gap-1 ml-1">
                {activeTracks.map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => startPlayback(sectionId, playingLang, pIdx, fullGuideMode)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      currentPartIndex === pIdx
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    P{pIdx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Síntesis hablada desplegable */}
        <AnimatePresence>
          {isTranscriptOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 italic leading-relaxed">
                {t.sections[sectionId].transcriptSummary}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-dvh w-full overflow-y-auto overflow-x-hidden bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 pb-36"
    >
      {/* Elemento de audio global */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          e.currentTarget.playbackRate = playbackRate;
        }}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* ──────────────── HEADER STICKY SUPERIOR ──────────────── */}
      <header className="sticky top-0 z-40 bg-[#030712]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2.5">
          {/* Fila 1: Marca + Selector de Idioma */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white">SITAR</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    SOVETEC
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{t.meta.headerBadge}</p>
              </div>
            </div>

            {/* Selector de idioma ES | EN | SK | PL */}
            <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-full p-0.5 shrink-0">
              {LANGUAGES.map((langObj) => {
                const active = language === langObj.code;
                return (
                  <button
                    key={langObj.code}
                    onClick={() => setLanguage(langObj.code)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={langObj.nativeName}
                  >
                    {langObj.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila 2: Chips de navegación rápida por sección (D01..D09) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-1 px-1">
            {SECTION_IDS.map((secId) => {
              const sec = t.sections[secId];
              const isActive = activeSection === secId;
              const isAudioHere = playingSection === secId && isPlaying;
              return (
                <button
                  key={secId}
                  onClick={() => scrollToSection(secId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-white/15 text-white border border-cyan-400/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                    {sec.number}
                  </span>
                  <span>{sec.shortNav}</span>
                  {isAudioHere && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ──────────────── CONTENIDO PRINCIPAL SPA ──────────────── */}
      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-6">
        {/* ════════════════ D01: HERO E INTRODUCCIÓN ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D01 = el;
          }}
          id="D01"
          className="relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 p-5 shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3" />
                01 · {t.sections.D01.badge}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {nativeAudioSectionCount}/9 {t.meta.tracksAvailableCount}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t.sections.D01.title}
            </h1>
            <p className="mt-1.5 text-sm text-cyan-300/90 font-medium">
              {t.sections.D01.subtitle}
            </p>

            {/* Botón Destacado: Escuchar Presentación Completa */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-slate-900 border border-cyan-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wide">
                    {t.meta.committeeViewTitle}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    ES · EN · SK · PL ({LANGUAGES.find((l) => l.code === language)?.nativeName})
                  </div>
                </div>
              </div>
              <button
                onClick={toggleFullGuide}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
                  fullGuideMode && isPlaying
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                }`}
              >
                {fullGuideMode && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>{t.meta.stopFullGuide}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.meta.listenFullGuide}</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.sections.D01.summary}
            </p>

            {/* Tarjetas de datos clave D01 */}
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              {t.sections.D01.keyPoints.map((kp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {kp.label}
                    </span>
                    <span className="text-xs font-bold text-cyan-300">{kp.value}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{kp.detail}</p>
                </div>
              ))}
            </div>

            {renderSectionAudioBar('D01')}
          </div>
        </section>

        {/* ════════════════ D02: EL PROBLEMA Y NORMATIVA ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D02 = el;
          }}
          id="D02"
          className="rounded-3xl border border-red-500/25 bg-gradient-to-b from-red-950/30 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30 mb-3">
            <AlertTriangle className="w-3 h-3" />
            02 · {t.sections.D02.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D02.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-red-300/90 font-medium">
            {t.sections.D02.subtitle}
          </p>

          {/* KPIs de la Crisis Hídrica */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {t.sections.D02.keyPoints.map((kp, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/80 border border-red-500/20 flex flex-col justify-between"
              >
                <span className="text-[10px] text-slate-400 leading-tight">{kp.label}</span>
                <span className="text-sm sm:text-base font-extrabold font-mono text-red-400 my-1 break-words">
                  {kp.value}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">{kp.detail}</span>
              </div>
            ))}
          </div>

          {/* Imagen contextual del operador + explicación */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/70 flex flex-col sm:flex-row items-center">
            <div
              className="w-full sm:w-36 h-28 sm:h-full min-h-[110px] bg-cover bg-center grayscale relative shrink-0"
              style={{ backgroundImage: "url('/Operador_escala_grises.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-bold uppercase tracking-wider text-white">
                NMX-AA-179-2018
              </span>
            </div>
            <p className="p-3.5 text-xs text-slate-300 leading-relaxed">
              {t.sections.D02.summary}
            </p>
          </div>

          {renderSectionAudioBar('D02')}
        </section>

        {/* ════════════════ D03: METODOLOGÍA Y 3 PILARES ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D03 = el;
          }}
          id="D03"
          className="rounded-3xl border border-blue-500/25 bg-gradient-to-b from-blue-950/25 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30 mb-3">
            <GitBranch className="w-3 h-3" />
            03 · {t.sections.D03.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D03.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-blue-300/90 font-medium">
            {t.sections.D03.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D03.summary}
          </p>

          {/* Los 3 Pilares */}
          <div className="mt-4 grid grid-cols-1 gap-2.5">
            {t.sections.D03.keyPoints.map((kp, i) => {
              const Icon = i === 0 ? Cpu : i === 1 ? Radio : Cloud;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-950/75 border border-blue-500/20 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300">
                        {kp.label}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{kp.value}</div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{kp.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {renderSectionAudioBar('D03')}
        </section>

        {/* ════════════════ D04: HARDWARE Y PCB EN KICAD ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D04 = el;
          }}
          id="D04"
          className="rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-emerald-950/20 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-3">
            <Cpu className="w-3 h-3" />
            04 · {t.sections.D04.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D04.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-emerald-300/90 font-medium">
            {t.sections.D04.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D04.summary}
          </p>

          {/* Visor Interactivo de Hardware (Video 3D + Renders KiCad) */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-black/80">
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">
                {t.meta.interactiveHardware}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t.hardwareGallery[hardwareIndex]?.tag}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {HARDWARE_MEDIA[hardwareIndex].type === 'video' ? (
                <video
                  key={HARDWARE_MEDIA[hardwareIndex].src}
                  src={HARDWARE_MEDIA[hardwareIndex].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  key={HARDWARE_MEDIA[hardwareIndex].src}
                  src={HARDWARE_MEDIA[hardwareIndex].src}
                  alt={t.hardwareGallery[hardwareIndex]?.title ?? 'PCB Render'}
                  className="w-full h-full object-contain"
                />
              )}

              <button
                onClick={() =>
                  setHardwareIndex((prev) => (prev - 1 + HARDWARE_MEDIA.length) % HARDWARE_MEDIA.length)
                }
                aria-label="Render anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setHardwareIndex((prev) => (prev + 1) % HARDWARE_MEDIA.length)
                }
                aria-label="Siguiente render"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Descripción del render activo y selector de miniaturas */}
            <div className="p-3.5 bg-slate-950/90 border-t border-white/10">
              <div className="text-xs font-bold text-white">
                {t.hardwareGallery[hardwareIndex]?.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {t.hardwareGallery[hardwareIndex]?.caption}
              </p>

              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {t.hardwareGallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHardwareIndex(idx)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-mono text-center truncate transition-all ${
                      hardwareIndex === idx
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {item.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Especificaciones Técnicas de Hardware */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {t.sections.D04.keyPoints.map((kp, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/75 border border-emerald-500/20 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">{kp.label}</span>
                <span className="text-sm font-bold text-emerald-300 my-1 font-mono">{kp.value}</span>
                <span className="text-[11px] text-slate-400 leading-snug">{kp.detail}</span>
              </div>
            ))}
          </div>

          {renderSectionAudioBar('D04')}
        </section>

        {/* ════════════════ D05: FIRMWARE C++ Y MÁQUINA DE ESTADOS ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D05 = el;
          }}
          id="D05"
          className="rounded-3xl border border-purple-500/25 bg-gradient-to-b from-purple-950/25 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-3">
            <Code2 className="w-3 h-3" />
            05 · {t.sections.D05.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D05.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-purple-300/90 font-medium">
            {t.sections.D05.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D05.summary}
          </p>

          {/* Selector de Pestaña: Flujo de Estados (FSM) vs Código C++ */}
          <div className="mt-4 flex rounded-xl bg-slate-950 p-1 border border-white/10">
            <button
              onClick={() => setFsmTab('diagram')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                fsmTab === 'diagram'
                  ? 'bg-purple-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.meta.fsmTabDiagram}
            </button>
            <button
              onClick={() => setFsmTab('code')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                fsmTab === 'code'
                  ? 'bg-purple-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.meta.fsmTabCode}
            </button>
          </div>

          {fsmTab === 'diagram' ? (
            <div className="mt-3 space-y-2">
              {t.fsmStates.map((st, idx) => {
                const isActive = activeFsmState === idx;
                return (
                  <div
                    key={st.id}
                    onClick={() => setActiveFsmState(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-purple-400/60 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-950/60 border-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: st.color }}
                      >
                        {st.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {st.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-[#282a36]">
              <div className="px-3.5 py-2 bg-[#21222c] flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5555]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f1fa8c]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#50fa7b]" />
                </div>
                <span className="text-[11px] font-mono text-[#6272a4]">SITAR-firmware.ino</span>
              </div>
              <div className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed">
                {FIRMWARE_CODE_LINES.map((row) => {
                  const highlight = row.phase === activeFsmState;
                  return (
                    <div
                      key={row.line}
                      className={`flex whitespace-pre px-1.5 py-0.5 rounded ${
                        highlight ? 'bg-purple-500/20 border-l-2 border-purple-400' : ''
                      }`}
                    >
                      <span className="w-6 text-right pr-2.5 text-[#6272a4] select-none shrink-0">
                        {row.line}
                      </span>
                      <span className="text-[#f8f8f2]">{row.code}</span>
                      {row.comment && (
                        <span className="ml-2 text-[#8be9fd]">{row.comment}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tarjetas resumen D05 */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {t.sections.D05.keyPoints.map((kp, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/75 border border-purple-500/20 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">{kp.label}</span>
                <span className="text-xs font-bold text-purple-300 my-1 font-mono">{kp.value}</span>
                <span className="text-[11px] text-slate-400 leading-snug">{kp.detail}</span>
              </div>
            ))}
          </div>

          {renderSectionAudioBar('D05')}
        </section>

        {/* ════════════════ D06: INFRAESTRUCTURA CLOUD Y BACKEND ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D06 = el;
          }}
          id="D06"
          className="rounded-3xl border border-sky-500/25 bg-gradient-to-b from-sky-950/25 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 mb-3">
            <Server className="w-3 h-3" />
            06 · {t.sections.D06.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D06.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-sky-300/90 font-medium">
            {t.sections.D06.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D06.summary}
          </p>

          {/* Diagrama compacto del flujo desacoplado */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/85 border border-sky-500/20">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pb-3 border-b border-white/10">
              <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SIM800L (2G/GPRS)
              </span>
              <span className="text-sky-400">══►</span>
              <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Azure Ubuntu VM
              </span>
              <span className="text-emerald-400">══►</span>
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PostgreSQL
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {t.cloudArchitecture.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-white/5 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {item.layer}
                    </span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 font-semibold"
                      style={{ color: item.accent }}
                    >
                      {item.portOrRole}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 shrink-0" style={{ color: item.accent }} />
                    {item.tech}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {renderSectionAudioBar('D06')}
        </section>

        {/* ════════════════ D07: DASHBOARD LIVE (TELEMETRÍA EN VIVO) ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D07 = el;
          }}
          id="D07"
          className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-cyan-950/25 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-3">
            <Activity className="w-3 h-3" />
            07 · {t.sections.D07.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D07.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-cyan-300/90 font-medium">
            {t.sections.D07.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D07.summary}
          </p>

          {/* Mini-Dashboard Interactivo en Tiempo Real */}
          <div className="mt-4 rounded-2xl bg-[#080D1A] border border-cyan-500/30 p-3.5 shadow-inner">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      anomalyMode ? 'bg-red-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      anomalyMode ? 'bg-red-500' : 'bg-emerald-400'
                    }`}
                  />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  {t.meta.liveSimulationBadge}
                </span>
              </div>

              <button
                onClick={() => setAnomalyMode((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                  anomalyMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {anomalyMode ? t.meta.restoreNormalBtn : t.meta.simulateAnomalyBtn}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#0e1726] border border-white/10">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  SITAR-NODE-01 · Flow
                </div>
                <div
                  className={`text-xl font-bold font-mono mt-0.5 ${
                    anomalyMode ? 'text-red-400' : 'text-[#00E5FF]'
                  }`}
                >
                  {currentFlow.toFixed(2)} <span className="text-xs text-slate-400">L/s</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1726] border border-white/10">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Totalizer Volume
                </div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  {totalizer.toFixed(3)} <span className="text-xs text-slate-400">m³</span>
                </div>
              </div>
            </div>

            {/* Gráfica de barras / chispa en vivo */}
            <div className="mt-3 p-3 rounded-xl bg-[#0e1726]/70 border border-white/5">
              <div className="flex items-end justify-between gap-1.5 h-16">
                {flowHistory.map((val, idx) => {
                  const pct = Math.min(100, Math.max(18, (val / 9) * 100));
                  const isHigh = val > 5.5;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div
                        className={`w-full rounded-t transition-all duration-500 ${
                          isHigh ? 'bg-red-400' : 'bg-cyan-400'
                        }`}
                        style={{ height: `${pct}%`, opacity: 0.4 + (idx / flowHistory.length) * 0.6 }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
                <span>WebSocket: ws://sitar-cloud:8080/live</span>
                <span className="text-emerald-400">FTP: {recentFtpFile} [OK]</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {t.sections.D07.keyPoints.map((kp, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/75 border border-cyan-500/20 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">{kp.label}</span>
                <span className="text-xs font-bold text-cyan-300 my-1 font-mono">{kp.value}</span>
                <span className="text-[11px] text-slate-400 leading-snug">{kp.detail}</span>
              </div>
            ))}
          </div>

          {renderSectionAudioBar('D07')}
        </section>

        {/* ════════════════ D08: IMPACTO Y ROADMAP (DATALOGGER) ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D08 = el;
          }}
          id="D08"
          className="rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-indigo-950/25 via-slate-900/90 to-slate-950 p-5 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
            <ShieldCheck className="w-3 h-3" />
            08 · {t.sections.D08.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {t.sections.D08.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-indigo-300/90 font-medium">
            {t.sections.D08.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D08.summary}
          </p>

          {/* 4 Dimensiones de Impacto */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {t.impactCards.map((card, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col gap-1"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                  {card.category}
                </span>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Bloque Destacado: Roadmap Datalogger Local */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-400/30">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-300">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{t.roadmap.badge}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{t.roadmap.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.roadmap.desc}</p>
            <ul className="mt-2.5 space-y-1.5">
              {t.roadmap.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {renderSectionAudioBar('D08')}
        </section>

        {/* ════════════════ D09: CONCLUSIÓN Y CIERRE ════════════════ */}
        <section
          ref={(el) => {
            sectionRefs.current.D09 = el;
          }}
          id="D09"
          className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 p-5 shadow-2xl"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-3">
            <Globe className="w-3 h-3" />
            09 · {t.sections.D09.badge}
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.sections.D09.title}
          </h2>
          <p className="mt-1 text-sm text-cyan-300 font-medium">
            {t.sections.D09.subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.sections.D09.summary}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {t.sections.D09.keyPoints.map((kp, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/75 border border-white/10"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">{kp.label}</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{kp.value}</div>
                <p className="text-xs text-slate-400 mt-0.5">{kp.detail}</p>
              </div>
            ))}
          </div>

          {renderSectionAudioBar('D09')}

          {/* Pie de firma y acciones rápidas */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">Axel Fernando Langle Camacho</div>
              <div className="text-[11px] text-slate-400">{t.meta.authorRole}</div>
              <div className="text-[11px] text-cyan-400/90 mt-0.5">{t.meta.companyDesc}</div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition-all active:scale-95"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">{t.meta.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{t.meta.copyLink}</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-300 transition-all"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.meta.openSlidesDesktop}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ──────────────── REPRODUCTOR FLOTANTE INFERIOR (AUDIOGUÍA) ──────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-3 pointer-events-none">
        <div className="max-w-2xl mx-auto rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-black p-3 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            {/* Info de pista activa */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {playingSection ? `${playingSection} · ${playingLang}` : language}
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {playingSection
                    ? t.sections[playingSection].title
                    : t.meta.listenFullGuide}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {playingSection && (catalog[playingSection]?.[playingLang]?.length ?? 0) > 1 && (
                  <span className="text-[10px] font-mono text-cyan-400">
                    ({t.meta.partIndicator} {currentPartIndex + 1}/
                    {catalog[playingSection]?.[playingLang]?.length})
                  </span>
                )}
              </div>
            </div>

            {/* Controles principales de transporte */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => skipSection(-1)}
                aria-label="Sección anterior"
                className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white active:scale-90"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (playingSection) {
                    toggleSectionAudio(playingSection, playingLang);
                  } else {
                    toggleFullGuide();
                  }
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 active:scale-90"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => skipSection(1)}
                aria-label="Siguiente sección"
                className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white active:scale-90"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Velocidad 1x / 1.25x / 1.5x */}
              <button
                onClick={cycleSpeed}
                title={t.meta.speedLabel}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-mono font-bold text-cyan-300 hover:bg-slate-800"
              >
                {playbackRate}x
              </button>

              {/* Auto-scroll toggle */}
              <button
                onClick={() => setAutoScroll((prev) => !prev)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-mono transition-colors hidden sm:inline-flex ${
                  autoScroll
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900 border-white/10 text-slate-500'
                }`}
              >
                {t.meta.autoScrollLabel}
              </button>
            </div>
          </div>

          {/* Barra de progreso global */}
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentTime(val);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 block"
              aria-label="Línea de tiempo de audio"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
