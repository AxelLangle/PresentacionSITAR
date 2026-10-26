import { Language } from './translations';

export type SectionId = 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06' | 'D07' | 'D08' | 'D09';

export interface SectionAudioConfig {
  tracks: string[];
  partLabels?: string[];
}

/**
 * Catálogo de pistas de audio actualmente disponibles en /public/audio/
 * Si una sección tiene 2 pistas (p. ej. 1_1.mp3 y 1_2.mp3), el reproductor
 * las encadena automáticamente en secuencia continua.
 */
export const AUDIO_CATALOG: Record<SectionId, Record<Language, string[]>> = {
  D01: {
    ES: ['/audio/D01/ES/1_1.mp3', '/audio/D01/ES/1_2.mp3'],
    EN: [],
    PL: ['/audio/D01/PL/1_1.mp3', '/audio/D01/PL/1_2.mp3'],
    SK: ['/audio/D01/SK/1_1.mp3', '/audio/D01/SK/1_2.mp3'],
  },
  D02: {
    ES: ['/audio/D02/ES/2_1.mp3', '/audio/D02/ES/2_2.mp3'],
    EN: [],
    PL: [],
    SK: ['/audio/D02/SK/2_1.mp3'],
  },
  D03: {
    ES: ['/audio/D03/ES/3_1.mp3'],
    EN: [],
    PL: [],
    SK: ['/audio/D03/SK/3_1.mp3'],
  },
  D04: {
    ES: ['/audio/D04/ES/4_1.mp3', '/audio/D04/ES/4_2.mp3'],
    EN: [],
    PL: [],
    SK: ['/audio/D04/SK/4_1.mp3'],
  },
  D05: {
    ES: ['/audio/D05/ES/5_1.mp3', '/audio/D05/ES/5_2.mp3'],
    EN: [],
    PL: [],
    SK: [],
  },
  D06: {
    ES: ['/audio/D06/ES/6_1.mp3', '/audio/D06/ES/6_2.mp3'],
    EN: [],
    PL: [],
    SK: [],
  },
  D07: {
    ES: ['/audio/D07/ES/7_1.mp3'],
    EN: [],
    PL: [],
    SK: [],
  },
  D08: {
    ES: ['/audio/D08/ES/8_1.mp3', '/audio/D08/ES/8_2.mp3'],
    EN: [],
    PL: [],
    SK: [],
  },
  D09: {
    ES: ['/audio/D09/ES/9_1.mp3'],
    EN: [],
    PL: [],
    SK: ['/audio/D09/SK/9_1.mp3'],
  },
};

export interface CommitteeSectionData {
  id: SectionId;
  number: string;
  shortNav: string;
  badge: string;
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: {
    label: string;
    value: string;
    detail: string;
  }[];
  transcriptSummary: string;
}

export interface CommitteeTranslation {
  meta: {
    headerBadge: string;
    committeeViewTitle: string;
    authorRole: string;
    companyDesc: string;
    listenFullGuide: string;
    stopFullGuide: string;
    playingFullGuide: string;
    listenSection: string;
    pauseSection: string;
    playingSection: string;
    partIndicator: string;
    audioPendingLang: string;
    playInSpanishFallback: string;
    playingSpanishFallback: string;
    transcriptToggle: string;
    hideTranscript: string;
    quickJump: string;
    interactiveHardware: string;
    fsmTabDiagram: string;
    fsmTabCode: string;
    liveSimulationBadge: string;
    simulateAnomalyBtn: string;
    restoreNormalBtn: string;
    shareQrTitle: string;
    shareQrDesc: string;
    copyLink: string;
    linkCopied: string;
    openSlidesDesktop: string;
    speedLabel: string;
    autoScrollLabel: string;
    tracksAvailableCount: string;
  };
  sections: Record<SectionId, CommitteeSectionData>;
  hardwareGallery: {
    title: string;
    caption: string;
    tag: string;
  }[];
  fsmStates: {
    id: string;
    name: string;
    role: string;
    desc: string;
    color: string;
  }[];
  cloudArchitecture: {
    layer: string;
    tech: string;
    portOrRole: string;
    desc: string;
    accent: string;
  }[];
  impactCards: {
    category: string;
    title: string;
    desc: string;
  }[];
  roadmap: {
    badge: string;
    title: string;
    desc: string;
    features: string[];
  };
}

export const committeeTranslations: Record<Language, CommitteeTranslation> = {
  ES: {
    meta: {
      headerBadge: 'DOSSIER COMITÉ CIENTÍFICO',
      committeeViewTitle: 'SITAR · Síntesis Técnica y Ejecutiva',
      authorRole: 'Ingeniería en Software (10.º Cuatrimestre) · Educación Dual y Estadías Profesionales',
      companyDesc: 'En colaboración con SOVETEC (+15 años en instrumentación, control y automatización de procesos industriales)',
      listenFullGuide: 'Escuchar Presentación Completa',
      stopFullGuide: 'Pausar Audioguía',
      playingFullGuide: 'Reproduciendo Audioguía',
      listenSection: 'Escuchar explicación',
      pauseSection: 'Pausar audio',
      playingSection: 'Reproduciendo sección',
      partIndicator: 'Parte',
      audioPendingLang: 'Audio en este idioma próximamente',
      playInSpanishFallback: 'Escuchar en ES',
      playingSpanishFallback: 'Reproduciendo en ES',
      transcriptToggle: 'Ver síntesis hablada',
      hideTranscript: 'Ocultar síntesis',
      quickJump: 'Secciones',
      interactiveHardware: 'Renders de Ingeniería y PCB (KiCad)',
      fsmTabDiagram: 'Flujo de Estados (FSM)',
      fsmTabCode: 'Código C++ (Firmware)',
      liveSimulationBadge: 'TELEMETRÍA SIMULADA EN TIEMPO REAL',
      simulateAnomalyBtn: 'Simular Pico',
      restoreNormalBtn: 'Flujo Normal',
      shareQrTitle: 'Compartir Vista Móvil',
      shareQrDesc: 'Enlace directo para miembros del Comité Científico',
      copyLink: 'Copiar enlace',
      linkCopied: '¡Enlace copiado!',
      openSlidesDesktop: 'Ver Diapositivas',
      speedLabel: 'Velocidad',
      autoScrollLabel: 'Auto-scroll',
      tracksAvailableCount: 'secciones con audio nativo',
    },
    sections: {
      D01: {
        id: 'D01',
        number: '01',
        shortNav: 'Intro',
        badge: 'INTRODUCCIÓN Y CONTEXTO',
        title: 'SITAR: Sistema Integrado de Telemetría Remota',
        subtitle: 'Tecnología propia creada desde cero para la gestión crítica del agua en México',
        summary:
          'Proyecto desarrollado dentro del modelo de Educación Dual y Estadías Profesionales de Ingeniería en Software en conjunto con SOVETEC. Ante la obsolescencia de las tecnologías de medición hídrica en el país, se diseñó una solución integral de hardware, firmware e infraestructura en la nube desde cero.',
        keyPoints: [
          {
            label: 'Autor',
            value: 'Axel Fernando Langle Camacho',
            detail: '10.º Cuatrimestre de Ingeniería en Software (Educación Dual / Estadías)',
          },
          {
            label: 'Empresa Aliada',
            value: 'SOVETEC',
            detail: '+15 años en instrumentación, control y automatización industrial',
          },
          {
            label: 'Alcance',
            value: 'Full-Stack Industrial IoT',
            detail: 'Diseño de PCB a medida + Firmware C++ FSM + Nube Distribuida + Dashboard Web',
          },
        ],
        transcriptSummary:
          '“El agua es el recurso más crítico que tenemos, pero irónicamente en México la tecnología que utilizamos para administrarla ha quedado obsoleta. Nos enfrentamos a un problema de telemetría y decidimos crear nuestra tecnología desde cero: el Sistema Integrado de Telemetría Remota (SITAR).”',
      },
      D02: {
        id: 'D02',
        number: '02',
        shortNav: 'Problema',
        badge: 'EL PROBLEMA Y NORMATIVA',
        title: 'La Crisis de Medición y la Norma NMX-AA-179-2018',
        subtitle: 'Del registro manual en libreta a la transmisión directa y autónoma por mandato legal',
        summary:
          'Según datos de CONAGUA, existen más de 537,000 aprovechamientos de agua en territorio mexicano, pero cerca del 97% carece de un medidor funcional. Donde sí existe medición, los operadores aún viajan horas por autopistas y terracerías bajo climas adversos e inseguridad para anotar lecturas manualmente.',
        keyPoints: [
          {
            label: 'Aprovechamientos (CONAGUA)',
            value: '+537,000',
            detail: 'Puntos de extracción registrados en el territorio nacional mexicano',
          },
          {
            label: 'Brecha de Medición',
            value: '~97%',
            detail: 'Carecen de un medidor funcional o sistema de telemetría activo',
          },
          {
            label: 'Mandato Regulatorio',
            value: 'NMX-AA-179-2018',
            detail: 'Exige transmisión directa y autónoma, prohibiendo intermediarios o RTUs obsoletas',
          },
        ],
        transcriptSummary:
          '“La norma NMX-AA-179-2018 ya no es una sugerencia: dicta que la transmisión de los datos hídricos debe hacerse de forma directa y completamente autónoma, evitando intermediarios o RTUs obsoletas. SOVETEC necesitaba una tecnología que cumpliera con esto de forma nativa frente a soluciones genéricas de alto costo.”',
      },
      D03: {
        id: 'D03',
        number: '03',
        shortNav: 'Concepto',
        badge: 'METODOLOGÍA Y CONCEPTO',
        title: 'La Anatomía del Dato: Arquitectura de 3 Pilares',
        subtitle: 'Método Analítico + Prototipado Evolutivo para telemetría industrial autónoma',
        summary:
          'Se aplicó el método analítico para descomponer el problema en unidades mínimas funcionales y una metodología de prototipado evolutivo para iterar pruebas agregando y depurando componentes hasta consolidar tres pilares fundamentales.',
        keyPoints: [
          {
            label: 'Pilar 1 · Hardware',
            value: 'Diseño Industrial a Medida',
            detail: 'Creado específicamente para soportar condiciones eléctricas y ambientales industriales',
          },
          {
            label: 'Pilar 2 · Conectividad',
            value: 'Red Celular 2G / GPRS',
            detail: 'Enlace robusto optimizado para pozos remotos donde la cobertura celular es baja',
          },
          {
            label: 'Pilar 3 · Nube',
            value: 'Procesamiento Autónomo',
            detail: 'Ingesta, validación y persistencia en la nube sin necesidad de intervención humana',
          },
        ],
        transcriptSummary:
          '“Utilicé el método analítico para desmenuzar todo el problema en unidades mínimas y posteriormente una metodología de prototipado evolutivo. Diseñé una arquitectura basada en tres pilares fundamentales: hardware hecho a la medida, conectividad robusta por red celular y procesamiento autónomo en la nube.”',
      },
      D04: {
        id: 'D04',
        number: '04',
        shortNav: 'Hardware',
        badge: 'INGENIERÍA DE HARDWARE Y PCB',
        title: 'Placa Industrial en KiCad y Mitigación de Transitorios',
        subtitle: 'PCB circular de 9 cm con MCU ATtiny1614, interfaz RS-485, SIM800L y red de capacitores',
        summary:
          'Lejos de usar una placa de desarrollo escolar, se diseñó una PCB industrial en KiCad con formato de disco de 9 cm de diámetro. Integra conversión AC-DC (110V AC a 5V DC) con aislamiento de plano digital y resuelve el reto crítico de caída de tensión por los picos de 2 A del módem celular.',
        keyPoints: [
          {
            label: 'Microcontrolador (MCU)',
            value: 'ATtiny1614',
            detail: 'Ultrabajo consumo energético y periféricos independientes ideales para campo',
          },
          {
            label: 'Control de Picos (2 A)',
            value: '1000, 100 y 0.1 µF',
            detail: 'Red de capacitores para absorber transitorios del módulo SIM800L al conectar a 2G/GPRS',
          },
          {
            label: 'Etapa de Potencia y Formato',
            value: '110V AC → 5V DC · Ø 9 cm',
            detail: 'Fuente integrada en PCB circular de 9 cm con aislamiento entre alta tensión y tierra digital',
          },
        ],
        transcriptSummary:
          '“No es una placa de desarrollo escolar, sino una PCB industrial diseñada en KiCad de 9 cm de diámetro con el microcontrolador ATtiny1614. Para absorber los picos de hasta 2 amperios del módulo SIM800L en 2G/GPRS sin reiniciar el procesador, diseñé una red de capacitores de 1000, 100 y 0.1 microfaradios junto con una fuente integrada de 110V AC a 5V DC.”',
      },
      D05: {
        id: 'D05',
        number: '05',
        shortNav: 'Firmware',
        badge: 'EL CEREBRO · FIRMWARE C++',
        title: 'Máquina de Estados Finitos (FSM) No Bloqueante',
        subtitle: 'Maestro Modbus RTU (RS-485) + Orquestación de Comandos AT + Respaldo SMS',
        summary:
          'Un enfoque secuencial inicial bloqueaba el microcontrolador ante latencias de red. Se reescribió el núcleo en C++ (Arduino IDE) implementando una Máquina de Estados Finitos determinista que gestiona lecturas industriales, transmisión dual y recuperación automática ante fallos.',
        keyPoints: [
          {
            label: 'Protocolo de Campo',
            value: 'Modbus RTU (RS-485)',
            detail: 'SITAR actúa como Maestro interrogando directamente al caudalímetro electromagnético',
          },
          {
            label: 'Transmisión y Reintentos',
            value: 'Comandos AT · TCP/IP',
            detail: 'Negocia bearer GPRS, transmite trama HTTP y archivo FTP con control de timeouts y reintentos',
          },
          {
            label: 'Resiliencia Autónoma',
            value: 'Fallback SMS + Bajo Consumo',
            detail: 'Respaldo vía SMS tras ≥3 fallos de red y retorno garantizado al estado IDLE en segundos',
          },
        ],
        transcriptSummary:
          '“Reescribí la lógica en C++ utilizando una Máquina de Estados Finitos. SITAR despierta, asume el rol de maestro vía protocolo industrial Modbus RTU RS-485 e interroga directamente al caudalímetro electromagnético. Extrae volumen y alarmas, orquesta comandos AT sobre TCP/IP, transmite la trama y vuelve a bajo consumo manejando errores y reintentos sin intervención humana.”',
      },
      D06: {
        id: 'D06',
        number: '06',
        shortNav: 'Cloud',
        badge: 'LA MEMORIA · INFRAESTRUCTURA CLOUD',
        title: 'Arquitectura Distribuida de Doble Servidor en Azure',
        subtitle: 'Servicios HTTP (FastAPI) y FTP (vsftpd) desacoplados con persistencia en PostgreSQL',
        summary:
          'Sobre una máquina virtual Ubuntu Server en Microsoft Azure se implementó una arquitectura de responsabilidades separadas con usuarios dedicados del sistema operativo. Si el servidor web entra en mantenimiento o se satura, el servidor FTP continúa operando de forma independiente.',
        keyPoints: [
          {
            label: 'Canal Tiempo Real (HTTP)',
            value: 'FastAPI · Python (Pto. 8080)',
            detail: 'Endpoint POST /api/telemetry para ingesta y validación instantánea de tramas JSON',
          },
          {
            label: 'Canal de Archivos (FTP)',
            value: 'vsftpd (Puerto 21)',
            detail: 'Servidor FTP aislado con usuario dedicado para recepción ininterrumpida de reportes',
          },
          {
            label: 'Base de Datos Relacional',
            value: 'PostgreSQL',
            detail: 'Ambos flujos convergen tras validación para garantizar un historial hídrico inmutable',
          },
        ],
        transcriptSummary:
          '“Construí una infraestructura distribuida en la nube para separar responsabilidades: por un lado un servidor HTTP en tiempo real con FastAPI en Python, y por otro un servidor FTP completamente separado. Si el servidor web se satura o está en mantenimiento, el canal FTP sigue operando independientemente, inyectando ambos flujos en PostgreSQL.”',
      },
      D07: {
        id: 'D07',
        number: '07',
        shortNav: 'Dashboard',
        badge: 'LA VISIÓN · INTERFAZ EN TIEMPO REAL',
        title: 'Dashboard Web con Telemetría vía WebSockets',
        subtitle: 'Monitoreo continuo sin recarga de página validado desde locación remota',
        summary:
          'Toda la circuitería, el firmware de bajo nivel y los servidores convergen en una interfaz web construida con HTML5, CSS y librerías de visualización en JavaScript. Mediante WebSockets, el administrador visualiza el caudal instantáneo y el totalizador en vivo con latencia mínima.',
        keyPoints: [
          {
            label: 'Comunicación Push',
            value: 'WebSockets en Vivo',
            detail: 'Actualización automática de gráficas y bitácoras sin necesidad de refrescar el navegador',
          },
          {
            label: 'Variables Monitoreadas',
            value: 'Caudal (L/s) y Volumen (m³)',
            detail: 'Serie temporal de flujo instantáneo, totalizador acumulado y logs de transferencia FTP',
          },
          {
            label: 'Validación de Campo',
            value: 'Latencia Mínima Comprobada',
            detail: 'Transmisión exitosa de tramas desde locación remota hacia la nube en pruebas reales',
          },
        ],
        transcriptSummary:
          '“Desarrollamos un dashboard web utilizando HTML5, CSS y librerías de visualización en JavaScript. Mediante WebSockets, el administrador no necesita refrescar la página para ver el comportamiento de sus redes de agua en tiempo real. Durante las pruebas de prototipo transmitimos exitosamente tramas desde una locación remota con latencia mínima.”',
      },
      D08: {
        id: 'D08',
        number: '08',
        shortNav: 'Impacto',
        badge: 'IMPACTO Y ROADMAP DE INGENIERÍA',
        title: 'Impacto Legal, Económico, Laboral, Ambiental y Evolución',
        subtitle: 'Cumplimiento normativo hoy y evolución hacia Datalogger autónomo en PCB',
        summary:
          'SITAR demuestra cómo la ingeniería mexicana resuelve problemas normativos y operativos reales, al tiempo que traza una hoja de ruta clara hacia el almacenamiento local en placa para tolerancia total a caídas prolongadas de red celular.',
        keyPoints: [
          {
            label: 'Legal y Económico',
            value: 'NMX-AA-179-2018 + Ahorro',
            detail: 'Cumplimiento normativo nativo y recorte drástico de gastos logísticos y viáticos',
          },
          {
            label: 'Laboral y Ambiental',
            value: 'Seguridad y Acuíferos',
            detail: 'Retira a los ingenieros de carreteras peligrosas y combate la sobreexplotación hídrica',
          },
          {
            label: 'Roadmap · Siguiente Meta',
            value: 'Memoria Local (Datalogger)',
            detail: 'Almacenamiento in-situ en PCB ante caída celular con retransmisión en ráfaga al reconectar',
          },
        ],
        transcriptSummary:
          '“SITAR cumple en lo legal con la norma NMX-AA-179-2018, en lo económico recorta gastos en viáticos, laboralmente saca a los ingenieros de carreteras peligrosas y ambientalmente frena la sobreexplotación de acuíferos. Nuestra principal meta a futuro es integrar memoria local en la PCB para actuar como datalogger autónomo y retransmitir en ráfaga.”',
      },
      D09: {
        id: 'D09',
        number: '09',
        shortNav: 'Cierre',
        badge: 'CONCLUSIÓN',
        title: 'El Agua, Conectada.',
        subtitle: 'El recurso de nuestro futuro impulsado por la tecnología del presente',
        summary:
          'SITAR valida la capacidad de innovación tecnológica de SOVETEC mediante una solución propietaria, escalable y alineada con las exigencias regulatorias e industriales del sector hídrico.',
        keyPoints: [
          {
            label: 'Estado del Proyecto',
            value: 'Prototipo Funcional Validado',
            detail: 'Probado de extremo a extremo: desde el sensor RS-485 hasta el dashboard en la nube',
          },
          {
            label: 'Propiedad Tecnológica',
            value: '100% Desarrollo Propio',
            detail: 'Independencia tecnológica frente a equipos importados o cerrados de alto costo',
          },
        ],
        transcriptSummary:
          '“Este proyecto valida la innovación de SOVETEC. El agua es el recurso de nuestro futuro, pero requiere la tecnología del presente. Esto es SITAR. Muchas gracias por su atención.”',
      },
    },
    hardwareGallery: [
      {
        title: 'Render 3D de la PCB Industrial (Ø 9 cm)',
        caption: 'Diseño compacto en forma de disco en KiCad con aislamiento entre etapa AC (110V) y plano digital.',
        tag: 'KiCad 3D',
      },
      {
        title: 'Microcontrolador ATtiny1614',
        caption: 'Cerebro del nodo sensor: arquitectura de ultrabajo consumo con periféricos independientes.',
        tag: 'MCU / Control',
      },
      {
        title: 'Etapa de Comunicaciones: RS-485 y SIM800L',
        caption: 'Interfaz industrial Modbus RTU hacia el caudalímetro y módem celular 2G/GPRS con red de capacitores (1000, 100 y 0.1 µF).',
        tag: 'RS-485 + GPRS',
      },
      {
        title: 'Fuente de Alimentación Integrada (Power Supply)',
        caption: 'Conversión directa de 110V AC a 5V DC capaz de sostener picos transitorios de hasta 2 A durante la transmisión celular.',
        tag: 'Potencia 110V→5V',
      },
    ],
    fsmStates: [
      {
        id: 'IDLE',
        name: '1. IDLE (Bajo Consumo)',
        role: 'Temporizador no bloqueante (ciclo cada 12 s)',
        desc: 'El MCU permanece en espera de bajo consumo hasta cumplir el intervalo de muestreo sin bloquear el procesador.',
        color: '#f1fa8c',
      },
      {
        id: 'LEER_MODBUS',
        name: '2. LEER_MODBUS (RS-485)',
        role: 'Maestro Modbus RTU → Caudalímetro',
        desc: 'Conmuta pines a RS-485, ejecuta readInputRegisters(0,5) y (5,5) para extraer caudal, totalizador y alarmas.',
        color: '#8be9fd',
      },
      {
        id: 'GPRS_HTTP',
        name: '3. INIT_GPRS → ENVIAR_HTTP',
        role: 'Comandos AT · Bearer GPRS · POST JSON',
        desc: 'Verifica el portador SAPBR y envía la trama de telemetría vía HTTP (AT+HTTPACTION=1). Reintenta hasta 3 veces ante error.',
        color: '#bd93f9',
      },
      {
        id: 'ENVIAR_FTP',
        name: '4. CERRAR_HTTP → ENVIAR_FTP',
        role: 'Respaldo de archivo por canal independiente',
        desc: 'Tras confirmar HTTP 200/201, transmite el paquete al servidor FTP dedicado para garantizar trazabilidad normativa.',
        color: '#ffb86c',
      },
      {
        id: 'FALLBACK_SMS',
        name: '5. FALLBACK_SMS (Contingencia)',
        role: 'Tolerancia a fallos tras ≥ 3 reintentos',
        desc: 'Si falla el bearer GPRS o el servidor HTTP tras 3 intentos, envía la lectura crítica vía SMS (+CMGF / +CMGS) y regresa a IDLE.',
        color: '#ff79c6',
      },
    ],
    cloudArchitecture: [
      {
        layer: 'Infraestructura Base',
        tech: 'Microsoft Azure · Ubuntu Server VM',
        portOrRole: 'Aislamiento por usuarios de SO',
        desc: 'Entorno Linux endurecido con separación de permisos entre el servicio de archivos y la API web.',
        accent: '#38bdf8',
      },
      {
        layer: 'Ingesta en Tiempo Real',
        tech: 'FastAPI (Python) · Servicio HTTP',
        portOrRole: 'Puerto 8080 · POST /api/telemetry',
        desc: 'Procesa lecturas de caudal instantáneo con mínima latencia y notifica al dashboard mediante WebSockets.',
        accent: '#34d399',
      },
      {
        layer: 'Recepción de Archivos',
        tech: 'vsftpd · Servidor FTP Independiente',
        portOrRole: 'Puerto 21 · Usuario dedicado',
        desc: 'Desacoplado del servidor HTTP: sigue recibiendo bitácoras CSV/JSON aunque la API web esté en mantenimiento.',
        accent: '#22d3ee',
      },
      {
        layer: 'Persistencia Histórica',
        tech: 'PostgreSQL · Base de Datos Relacional',
        portOrRole: 'Almacenamiento ACID Inmutable',
        desc: 'Centraliza y valida tanto el flujo HTTP como los archivos FTP para auditoría y cumplimiento normativo.',
        accent: '#818cf8',
      },
    ],
    impactCards: [
      {
        category: 'Legal y Normativo',
        title: 'Cumplimiento NMX-AA-179-2018',
        desc: 'Transmisión directa y autónoma de volúmenes de aguas nacionales sin intermediarios ni RTUs obsoletas.',
      },
      {
        category: 'Económico y Logístico',
        title: 'Reducción Drástica de Viáticos',
        desc: 'Elimina traslados periódicos a pozos remotos para tomar lecturas manuales en libreta.',
      },
      {
        category: 'Seguridad Laboral',
        title: 'Protección de Ingenieros y Operadores',
        desc: 'Retira al personal de autopistas, terracerías peligrosas y climas extremos centralizando la operación.',
      },
      {
        category: 'Ambiental e Hídrico',
        title: 'Protección de Mantos Acuíferos',
        desc: 'Detección oportuna de anomalías y fugas en tiempo real para frenar la sobreexplotación del recurso.',
      },
    ],
    roadmap: {
      badge: 'ROADMAP DE EVOLUCIÓN · PRÓXIMA FASE',
      title: 'Memoria Local en PCB (Modo Datalogger Autónomo)',
      desc: 'Integración de módulos de memoria no volátil directamente en la PCB para garantizar cero pérdida de datos ante caídas prolongadas de la red celular.',
      features: [
        'Almacenamiento in-situ de lecturas con estampa de tiempo cuando la red celular falle',
        'Retransmisión automática en ráfaga (burst) al restablecerse la conexión GPRS',
        'Continuidad total del historial hídrico exigido por la autoridad normativa',
      ],
    },
  },
  EN: {
    meta: {
      headerBadge: 'SCIENTIFIC COMMITTEE DOSSIER',
      committeeViewTitle: 'SITAR · Technical & Executive Synthesis',
      authorRole: 'Software Engineering (10th Quarter) · Dual Education & Professional Internship',
      companyDesc: 'In collaboration with SOVETEC (+15 years in industrial process instrumentation, control, and automation)',
      listenFullGuide: 'Listen to Full Presentation',
      stopFullGuide: 'Pause Audio Guide',
      playingFullGuide: 'Playing Audio Guide',
      listenSection: 'Listen to explanation',
      pauseSection: 'Pause audio',
      playingSection: 'Playing section',
      partIndicator: 'Part',
      audioPendingLang: 'Audio in EN coming soon (available in ES)',
      playInSpanishFallback: 'Listen in ES',
      playingSpanishFallback: 'Playing in ES',
      transcriptToggle: 'View spoken synthesis',
      hideTranscript: 'Hide synthesis',
      quickJump: 'Sections',
      interactiveHardware: 'Engineering & PCB Renders (KiCad)',
      fsmTabDiagram: 'State Flow (FSM)',
      fsmTabCode: 'C++ Code (Firmware)',
      liveSimulationBadge: 'REAL-TIME SIMULATED TELEMETRY',
      simulateAnomalyBtn: 'Simulate Spike',
      restoreNormalBtn: 'Normal Flow',
      shareQrTitle: 'Share Mobile View',
      shareQrDesc: 'Direct link for Scientific Committee members',
      copyLink: 'Copy link',
      linkCopied: 'Link copied!',
      openSlidesDesktop: 'View Slides',
      speedLabel: 'Speed',
      autoScrollLabel: 'Auto-scroll',
      tracksAvailableCount: 'sections with native audio',
    },
    sections: {
      D01: {
        id: 'D01',
        number: '01',
        shortNav: 'Intro',
        badge: 'INTRODUCTION & CONTEXT',
        title: 'SITAR: Integrated Remote Telemetry System',
        subtitle: 'Proprietary technology built from scratch for critical water management in Mexico',
        summary:
          'Developed within the Software Engineering Dual Education and Professional Internship program in partnership with SOVETEC. Facing obsolete water management technology in Mexico, an end-to-end hardware, firmware, and cloud telemetry solution was engineered from the ground up.',
        keyPoints: [
          {
            label: 'Author',
            value: 'Axel Fernando Langle Camacho',
            detail: '10th Quarter Software Engineering Student (Dual Education Program)',
          },
          {
            label: 'Industry Partner',
            value: 'SOVETEC',
            detail: '+15 years of experience in industrial instrumentation, control & automation',
          },
          {
            label: 'Scope',
            value: 'Full-Stack Industrial IoT',
            detail: 'Custom KiCad PCB + Non-blocking C++ FSM Firmware + Distributed Cloud + Live Dashboard',
          },
        ],
        transcriptSummary:
          '“Water is our most critical resource, yet in Mexico the technology used to manage it has become obsolete. Facing a telemetry challenge, we decided to build our own technology from scratch: SITAR, the Integrated Remote Telemetry System.”',
      },
      D02: {
        id: 'D02',
        number: '02',
        shortNav: 'Problem',
        badge: 'THE PROBLEM & REGULATION',
        title: 'The Measurement Crisis & Standard NMX-AA-179-2018',
        subtitle: 'From manual paper logbooks to mandatory direct and autonomous telemetry',
        summary:
          'According to CONAGUA data, there are over 537,000 water extraction points across Mexico, yet roughly 97% lack a functional meter. Where meters exist, operators still travel hours across highways and dirt roads under adverse weather and security risks just to write down readings by hand.',
        keyPoints: [
          {
            label: 'Water Extraction Sites',
            value: '+537,000',
            detail: 'Registered national water concessions across Mexican territory (CONAGUA)',
          },
          {
            label: 'Measurement Gap',
            value: '~97%',
            detail: 'Lack a functional flow meter or active remote telemetry system',
          },
          {
            label: 'Regulatory Mandate',
            value: 'NMX-AA-179-2018',
            detail: 'Mandates direct, fully autonomous data transmission—banning intermediaries or obsolete RTUs',
          },
        ],
        transcriptSummary:
          '“Mexican authorities enforced standard NMX-AA-179-2018. It is no longer a suggestion: it mandates that water volume data be transmitted directly and autonomously, avoiding intermediaries or obsolete RTUs. SOVETEC needed native compliance where the market only offered costly generic solutions.”',
      },
      D03: {
        id: 'D03',
        number: '03',
        shortNav: 'Concept',
        badge: 'METHODOLOGY & ARCHITECTURE',
        title: 'The Anatomy of Data: 3-Pillar Architecture',
        subtitle: 'Analytical Method + Evolutionary Prototyping for autonomous industrial telemetry',
        summary:
          'The analytical method was applied to break down the telemetry problem into minimal functional units, followed by evolutionary prototyping to iteratively test, refine, and validate three core architectural pillars.',
        keyPoints: [
          {
            label: 'Pillar 1 · Hardware',
            value: 'Custom Industrial PCB',
            detail: 'Engineered from scratch to withstand harsh electrical and industrial environments',
          },
          {
            label: 'Pillar 2 · Connectivity',
            value: 'Robust 2G / GPRS Cellular',
            detail: 'Reliable cellular link tailored for remote water wells with weak signal coverage',
          },
          {
            label: 'Pillar 3 · Cloud',
            value: 'Autonomous Processing',
            detail: 'Zero-touch cloud ingestion, validation, and immutable database persistence',
          },
        ],
        transcriptSummary:
          '“I used the analytical method to decompose the problem into minimal units, followed by evolutionary prototyping. I designed an architecture built on three pillars: custom industrial hardware, robust cellular connectivity for low-signal wells, and autonomous cloud processing without human intervention.”',
      },
      D04: {
        id: 'D04',
        number: '04',
        shortNav: 'Hardware',
        badge: 'HARDWARE & PCB ENGINEERING',
        title: 'Industrial KiCad PCB & Transient Current Mitigation',
        subtitle: '9 cm circular PCB with ATtiny1614 MCU, RS-485 interface, SIM800L & capacitor bank',
        summary:
          'Rather than using an educational development board, a custom 9 cm disc-shaped industrial PCB was designed in KiCad. It integrates an onboard AC-DC power supply (110V AC to 5V DC) with high-voltage isolation and solves the critical 2 A current spike challenge during GPRS transmission.',
        keyPoints: [
          {
            label: 'Microcontroller (MCU)',
            value: 'ATtiny1614',
            detail: 'Ultra-low power consumption and independent peripherals ideal for remote deployment',
          },
          {
            label: '2 A Spike Suppression',
            value: '1000, 100 & 0.1 µF',
            detail: 'Capacitor network engineered to absorb SIM800L 2G/GPRS current transients and prevent MCU brownouts',
          },
          {
            label: 'Power Stage & Form Factor',
            value: '110V AC → 5V DC · Ø 9 cm',
            detail: 'Compact 9 cm circular PCB isolating 110V AC lines from the digital ground plane',
          },
        ],
        transcriptSummary:
          '“What you see is not a school development board, but a 9 cm circular industrial PCB designed in KiCad using the ATtiny1614 microcontroller. Because the SIM800L module demands up to 2 Amps during 2G/GPRS connection bursts, I designed a 1000, 100, and 0.1 microfarad capacitor network alongside an integrated 110V AC to 5V DC power supply.”',
      },
      D05: {
        id: 'D05',
        number: '05',
        shortNav: 'Firmware',
        badge: 'THE BRAIN · C++ FIRMWARE',
        title: 'Non-Blocking Finite State Machine (FSM)',
        subtitle: 'Modbus RTU Master (RS-485) + AT Command Orchestration + SMS Fallback',
        summary:
          'An initial sequential approach blocked the microcontroller during network delays. The core was rewritten in C++ (Arduino IDE) as a Finite State Machine that interrogates the electromagnetic flowmeter, manages TCP/IP & FTP transfers, and handles retries autonomously.',
        keyPoints: [
          {
            label: 'Field Bus Protocol',
            value: 'Modbus RTU (RS-485)',
            detail: 'SITAR acts as Master, directly querying the electromagnetic flowmeter registers for volume and alarms',
          },
          {
            label: 'Transmission & Retries',
            value: 'AT Commands · TCP/IP',
            detail: 'Negotiates GPRS bearer, posts HTTP JSON payload, and uploads FTP backup with automatic retry logic',
          },
          {
            label: 'Autonomous Resilience',
            value: 'SMS Fallback + Sleep Mode',
            detail: 'Triggers SMS backup after ≥3 failed network attempts and returns to low-power IDLE state within seconds',
          },
        ],
        transcriptSummary:
          '“I rewrote the firmware logic in C++ using a Finite State Machine. SITAR wakes up, assumes the Master role over industrial Modbus RTU RS-485, and queries the electromagnetic flowmeter directly. Once volume and alarms are extracted, it orchestrates AT commands over TCP/IP, transmits the data frame, and returns to low-power sleep—handling errors and retries without a single button press.”',
      },
      D06: {
        id: 'D06',
        number: '06',
        shortNav: 'Cloud',
        badge: 'THE MEMORY · CLOUD INFRASTRUCTURE',
        title: 'Distributed Dual-Server Architecture on Azure',
        subtitle: 'Decoupled HTTP (FastAPI) and FTP (vsftpd) services backed by PostgreSQL',
        summary:
          'Hosted on a Microsoft Azure Ubuntu Server VM, the backend separates responsibilities across dedicated OS users and independent services. If the web server is under maintenance or heavy load, the FTP channel continues ingesting files independently.',
        keyPoints: [
          {
            label: 'Real-Time Channel (HTTP)',
            value: 'FastAPI · Python (Port 8080)',
            detail: 'Dedicated HTTP service (POST /api/telemetry) processing real-time telemetry frames',
          },
          {
            label: 'File Channel (FTP)',
            value: 'vsftpd (Port 21)',
            detail: 'Completely separated FTP server for autonomous file reception and regulatory backup',
          },
          {
            label: 'Relational Database',
            value: 'PostgreSQL',
            detail: 'Both pipelines are validated and injected into PostgreSQL, ensuring an immutable water history',
          },
        ],
        transcriptSummary:
          '“I built a distributed cloud infrastructure to separate responsibilities: a dedicated HTTP server powered by FastAPI in Python for real-time data, and a completely separate FTP server for file reception. If the web server saturates or undergoes maintenance, the FTP channel continues operating independently, with both streams persisted in PostgreSQL.”',
      },
      D07: {
        id: 'D07',
        number: '07',
        shortNav: 'Dashboard',
        badge: 'THE VISION · REAL-TIME UI',
        title: 'Live Web Dashboard Powered by WebSockets',
        subtitle: 'Zero-refresh real-time telemetry validated from a remote field location',
        summary:
          'All circuitry, low-level C++ code, and cloud servers converge in a web dashboard built with HTML5, CSS, and JavaScript visualization libraries. Using WebSockets, administrators monitor water network behavior in real time without refreshing the page.',
        keyPoints: [
          {
            label: 'Push Streaming',
            value: 'Live WebSockets',
            detail: 'Instantaneous chart and event log updates without manual page reloads',
          },
          {
            label: 'Key Telemetry Metrics',
            value: 'Flow (L/s) & Volume (m³)',
            detail: 'Real-time instantaneous flow rate, accumulated totalizer volume, and live FTP transfer logs',
          },
          {
            label: 'Field Validation',
            value: 'Minimal Latency Proven',
            detail: 'Successfully transmitted live telemetry frames from a remote location to cloud infrastructure',
          },
        ],
        transcriptSummary:
          '“All circuitry, low-level code, and servers converge in the user interface. Built with HTML5, CSS, and JavaScript visualization libraries over WebSockets, administrators see water network behavior in real time without refreshing the page—validated in prototype field tests from a remote location with minimal latency.”',
      },
      D08: {
        id: 'D08',
        number: '08',
        shortNav: 'Impact',
        badge: 'IMPACT & ENGINEERING ROADMAP',
        title: 'Legal, Economic, Occupational, Environmental Impact & Roadmap',
        subtitle: 'Native regulatory compliance today and onboard PCB Datalogger evolution tomorrow',
        summary:
          'SITAR is a functional prototype proving how Mexican engineering solves regulatory and operational challenges, with a clear engineering roadmap to integrate local onboard memory for offline resilience.',
        keyPoints: [
          {
            label: 'Legal & Economic',
            value: 'NMX-AA-179-2018 + Savings',
            detail: 'Full regulatory compliance while drastically cutting travel allowances and field logistics costs',
          },
          {
            label: 'Occupational & Environmental',
            value: 'Safety & Aquifer Protection',
            detail: 'Keeps engineers off dangerous highways and provides tools to stop aquifer overexploitation',
          },
          {
            label: 'Future Roadmap',
            value: 'Onboard PCB Datalogger',
            detail: 'Local non-volatile memory on the PCB to store readings in-situ during cellular outages and burst-retransmit upon reconnection',
          },
        ],
        transcriptSummary:
          '“Legally, SITAR complies with NMX-AA-179-2018; economically, it cuts travel expenses; occupationally, it removes engineers from dangerous roads; environmentally, it helps stop aquifer overexploitation. Our primary future milestone is integrating local memory onto the PCB to act as an autonomous in-situ datalogger with burst retransmission.”',
      },
      D09: {
        id: 'D09',
        number: '09',
        shortNav: 'Closing',
        badge: 'CONCLUSION',
        title: 'Water, Connected.',
        subtitle: 'The resource of our future powered by the technology of the present',
        summary:
          'SITAR validates SOVETEC’s engineering innovation through a proprietary, scalable telemetry platform ready for modern water resource governance.',
        keyPoints: [
          {
            label: 'Project Status',
            value: 'Validated Functional Prototype',
            detail: 'Tested end-to-end from industrial RS-485 sensor acquisition to cloud visualization',
          },
          {
            label: 'Technological Sovereignty',
            value: '100% In-House Engineering',
            detail: 'Complete independence from expensive, closed third-party RTU hardware',
          },
        ],
        transcriptSummary:
          '“This project validates SOVETEC’s innovation. Water is the resource of our future, but it requires the technology of the present. This is SITAR. Thank you very much for your attention.”',
      },
    },
    hardwareGallery: [
      {
        title: 'Industrial PCB 3D Render (Ø 9 cm)',
        caption: 'Compact disc-shaped KiCad design with galvanic/clearance isolation between 110V AC stage and digital ground.',
        tag: 'KiCad 3D',
      },
      {
        title: 'ATtiny1614 Microcontroller',
        caption: 'Sensor node brain: ultra-low-power architecture with independent peripherals.',
        tag: 'MCU / Control',
      },
      {
        title: 'Communications Stage: RS-485 & SIM800L',
        caption: 'Industrial Modbus RTU transceiver and 2G/GPRS cellular modem backed by the 1000, 100, and 0.1 µF capacitor bank.',
        tag: 'RS-485 + GPRS',
      },
      {
        title: 'Integrated AC-DC Power Supply',
        caption: 'Direct 110V AC to 5V DC conversion engineered to sustain 2 A transient current bursts during cellular transmission.',
        tag: '110V→5V Power',
      },
    ],
    fsmStates: [
      {
        id: 'IDLE',
        name: '1. IDLE (Low-Power Wait)',
        role: 'Non-blocking timer (12 s cycle)',
        desc: 'MCU remains in low-power state until the sampling interval elapses without blocking execution.',
        color: '#f1fa8c',
      },
      {
        id: 'LEER_MODBUS',
        name: '2. LEER_MODBUS (RS-485)',
        role: 'Modbus RTU Master → Flowmeter',
        desc: 'Switches pins to RS-485 and executes readInputRegisters(0,5) & (5,5) to extract flow rate, totalizer, and alarms.',
        color: '#8be9fd',
      },
      {
        id: 'GPRS_HTTP',
        name: '3. INIT_GPRS → ENVIAR_HTTP',
        role: 'AT Commands · GPRS Bearer · HTTP POST',
        desc: 'Verifies SAPBR bearer and transmits JSON telemetry via HTTP (AT+HTTPACTION=1) with up to 3 automatic retries.',
        color: '#bd93f9',
      },
      {
        id: 'ENVIAR_FTP',
        name: '4. CERRAR_HTTP → ENVIAR_FTP',
        role: 'Independent FTP file backup',
        desc: 'After HTTP 200/201 confirmation, uploads the telemetry file to the dedicated FTP server for regulatory traceability.',
        color: '#ffb86c',
      },
      {
        id: 'FALLBACK_SMS',
        name: '5. FALLBACK_SMS (Failover)',
        role: 'Fault tolerance after ≥ 3 retries',
        desc: 'If GPRS bearer or HTTP fails after 3 attempts, dispatches critical telemetry via SMS (+CMGF / +CMGS) and returns to IDLE.',
        color: '#ff79c6',
      },
    ],
    cloudArchitecture: [
      {
        layer: 'Core Infrastructure',
        tech: 'Microsoft Azure · Ubuntu Server VM',
        portOrRole: 'OS-level user isolation',
        desc: 'Hardened Linux environment separating permissions between file ingestion and web API services.',
        accent: '#38bdf8',
      },
      {
        layer: 'Real-Time Ingestion',
        tech: 'FastAPI (Python) · HTTP Service',
        portOrRole: 'Port 8080 · POST /api/telemetry',
        desc: 'Processes live flow readings with minimal latency and streams updates to the dashboard via WebSockets.',
        accent: '#34d399',
      },
      {
        layer: 'File Ingestion',
        tech: 'vsftpd · Independent FTP Server',
        portOrRole: 'Port 21 · Dedicated user',
        desc: 'Decoupled from the HTTP server: continues receiving telemetry files even if the web API is under maintenance.',
        accent: '#22d3ee',
      },
      {
        layer: 'Historical Persistence',
        tech: 'PostgreSQL · Relational Database',
        portOrRole: 'Immutable ACID Storage',
        desc: 'Validates and stores both HTTP and FTP streams to guarantee an immutable water volume history.',
        accent: '#818cf8',
      },
    ],
    impactCards: [
      {
        category: 'Legal & Regulatory',
        title: 'NMX-AA-179-2018 Compliance',
        desc: 'Direct, autonomous transmission of national water volumes without intermediaries or obsolete RTUs.',
      },
      {
        category: 'Economic & Logistics',
        title: 'Drastic Reduction in Travel Costs',
        desc: 'Eliminates costly recurring trips to remote wells for manual paper logbook readings.',
      },
      {
        category: 'Occupational Safety',
        title: 'Protection for Field Engineers',
        desc: 'Removes personnel from dangerous highways, unpaved roads, and extreme weather by centralizing operations.',
      },
      {
        category: 'Environmental Impact',
        title: 'Aquifer Preservation',
        desc: 'Real-time anomaly and leak detection providing concrete tools to stop groundwater overexploitation.',
      },
    ],
    roadmap: {
      badge: 'ENGINEERING ROADMAP · NEXT MILESTONE',
      title: 'Onboard PCB Local Memory (Autonomous Datalogger Mode)',
      desc: 'Integration of non-volatile memory modules directly onto the PCB to guarantee zero data loss during extended cellular network outages.',
      features: [
        'In-situ timestamped storage of flow readings whenever cellular connectivity drops',
        'Automatic burst retransmission once the 2G/GPRS connection is restored',
        'Uninterrupted regulatory audit trail under any field connectivity condition',
      ],
    },
  },
  SK: {
    meta: {
      headerBadge: 'DOSSIER PRE VEDECKÝ VÝBOR',
      committeeViewTitle: 'SITAR · Technická a exekutívna syntéza',
      authorRole: 'Softvérové inžinierstvo (10. štvrťrok) · Duálne vzdelávanie a odborná prax',
      companyDesc: 'V spolupráci so spoločnosťou SOVETEC (+15 rokov v priemyselnej meracej, riadiacej a automatizačnej technike)',
      listenFullGuide: 'Vypočuť celú prezentáciu',
      stopFullGuide: 'Pozastaviť audiosprievodcu',
      playingFullGuide: 'Prehráva sa audiosprievodca',
      listenSection: 'Vypočuť výklad sekcie',
      pauseSection: 'Pozastaviť zvuk',
      playingSection: 'Prehráva sa sekcia',
      partIndicator: 'Časť',
      audioPendingLang: 'Audio v SK pre túto sekciu čoskoro (dostupné v ES)',
      playInSpanishFallback: 'Prehrať v ES',
      playingSpanishFallback: 'Prehráva sa v ES',
      transcriptToggle: 'Zobraziť prepis výkladu',
      hideTranscript: 'Skryť prepis',
      quickJump: 'Sekcie',
      interactiveHardware: 'Inžinierske rendery a PCB (KiCad)',
      fsmTabDiagram: 'Stavový automat (FSM)',
      fsmTabCode: 'C++ Kód (Firmvér)',
      liveSimulationBadge: 'SIMULOVANÁ TELEMETRIA V REÁLNOM ČASE',
      simulateAnomalyBtn: 'Simulovať špičku',
      restoreNormalBtn: 'Normálny prietok',
      shareQrTitle: 'Zdieľať mobilné zobrazenie',
      shareQrDesc: 'Priamy odkaz pre členov vedeckého výboru',
      copyLink: 'Kopírovať odkaz',
      linkCopied: 'Odkaz skopírovaný!',
      openSlidesDesktop: 'Prezentácia',
      speedLabel: 'Rýchlosť',
      autoScrollLabel: 'Auto-posun',
      tracksAvailableCount: 'sekcií s natívnym SK zvukom',
    },
    sections: {
      D01: {
        id: 'D01',
        number: '01',
        shortNav: 'Úvod',
        badge: 'ÚVOD A KONTEXT PROJEKTU',
        title: 'SITAR: Integrovaný systém diaľkovej telemetrie',
        subtitle: 'Vlastná technológia vyvinutá od základov pre kritické vodné hospodárstvo v Mexiku',
        summary:
          'Projekt vyvinutý v rámci systému duálneho vzdelávania a odbornej praxe v odbore Softvérové inžinierstvo v spolupráci so spoločnosťou SOVETEC. Vzhľadom na zastaranosť technológií na správu vody v Mexiku bolo od nuly navrhnuté vlastné komplexné riešenie zahŕňajúce hardvér, firmvér a cloud.',
        keyPoints: [
          {
            label: 'Autor projektu',
            value: 'Axel Fernando Langle Camacho',
            detail: 'Študent 10. štvrťroka Softvérového inžinierstva (Duálne vzdelávanie)',
          },
          {
            label: 'Priemyselný partner',
            value: 'SOVETEC',
            detail: '+15 rokov skúseností v meraní, riadení a priemyselnej automatizácii',
          },
          {
            label: 'Rozsah riešenia',
            value: 'Full-Stack Industrial IoT',
            detail: 'Priemyselná PCB v KiCade + C++ FSM firmvér + distribuovaný cloud + živý dashboard',
          },
        ],
        transcriptSummary:
          '„Voda je náš najkritickejší zdroj, no v Mexiku je technológia na jej správu zastaraná. Čelili sme telemetrickej výzve a rozhodli sme sa vytvoriť vlastnú technológiu od nuly: projekt SITAR – Integrovaný systém diaľkovej telemetrie.“',
      },
      D02: {
        id: 'D02',
        number: '02',
        shortNav: 'Problém',
        badge: 'PROBLÉM A LEGISLATÍVA',
        title: 'Kríza merania vody a norma NMX-AA-179-2018',
        subtitle: 'Od ručného zapisovania do zošita k povinnému priamemu a autonómnemu prenosu',
        summary:
          'Podľa údajov úradu CONAGUA sa v Mexiku nachádza viac ako 537 000 odberných miest vody, pričom približne 97 % z nich nemá funkčný merač. Tam, kde merače sú, operátori stále cestujú hodiny po diaľniciach a nespevnených cestách v nepriaznivom počasí, aby údaje zapísali ručne.',
        keyPoints: [
          {
            label: 'Odberné miesta (CONAGUA)',
            value: '+537 000',
            detail: 'Evidované odbery vody na území Mexika',
          },
          {
            label: 'Chýbajúca telemetria',
            value: '~97 %',
            detail: 'Nemá funkčný merač alebo aktívny diaľkový prenos údajov',
          },
          {
            label: 'Legislatívny príkaz',
            value: 'NMX-AA-179-2018',
            detail: 'Nariaďuje priamy a plne autonómny prenos údajov bez sprostredkovateľov či zastaraných RTU',
          },
        ],
        transcriptSummary:
          '„Mexická vláda zaviedla normu NMX-AA-179-2018. Tento predpis nariaďuje, aby bol prenos vodohospodárskych údajov priamy a plne autonómny, pričom zakazuje sprostredkovateľské zariadenia alebo zastarané jednotky RTU. SOVETEC potreboval zariadenie, ktoré by túto normu spĺňalo natívne.“',
      },
      D03: {
        id: 'D03',
        number: '03',
        shortNav: 'Koncept',
        badge: 'METODOLÓGIA A ARCHITEKTÚRA',
        title: 'Anatómia dát: Architektúra na 3 pilieroch',
        subtitle: 'Analytická metóda + evolučné prototypovanie pre autonómnu telemetriu',
        summary:
          'Pomocou analytickej metódy bol problém rozložený na minimálne funkčné celky a následne bolo použité evolučné prototypovanie na iteratívne testovanie. Výsledkom je architektúra postavená na troch kľúčových pilieroch.',
        keyPoints: [
          {
            label: 'Pilier 1 · Hardvér',
            value: 'Priemyselný návrh na mieru',
            detail: 'Odolný hardvér navrhnutý pre nepretržitú prevádzku v náročných priemyselných podmienkach',
          },
          {
            label: 'Pilier 2 · Konektivita',
            value: 'Mobilná sieť 2G / GPRS',
            detail: 'Robustné spojenie pre odľahlé vrty a studne so slabým pokrytím signálu',
          },
          {
            label: 'Pilier 3 · Cloud',
            value: 'Autonómne spracovanie',
            detail: 'Príjem, validácia a ukladanie dát v cloude bez zásahu človeka',
          },
        ],
        transcriptSummary:
          '„Použil som analytickú metódu na rozloženie problému na minimálne jednotky a následne metodológiu evolučného prototypovania. Navrhol som architektúru založenú na troch pilieroch: hardvér na mieru, robustná mobilná konektivita a autonómne spracovanie v cloude.“',
      },
      D04: {
        id: 'D04',
        number: '04',
        shortNav: 'Hardvér',
        badge: 'HARDVÉROVÉ INŽINIERSTVO A PCB',
        title: 'Priemyselná doska v KiCade a potlačenie prúdových špičiek',
        subtitle: '9 cm kruhová PCB s MCU ATtiny1614, RS-485, SIM800L a kondenzátorovou sieťou',
        summary:
          'Nejde o školskú vývojovú dosku, ale o priemyselnú dosku plošných spojov (PCB) s priemerom 9 cm navrhnutú v programe KiCad. Integruje menič AC-DC (110 V AC na 5 V DC) s izolačnými vzdialenosťami a rieši kritickú výzvu prúdových špičiek až 2 A pri vysielaní modulu SIM800L.',
        keyPoints: [
          {
            label: 'Mikrokontrolér (MCU)',
            value: 'ATtiny1614',
            detail: 'Nízka spotreba energie a nezávislé periférie ideálne pre terénne nasadenie',
          },
          {
            label: 'Kompenzácia špičiek (2 A)',
            value: '1000, 100 a 0,1 µF',
            detail: 'Kondenzátorová sieť absorbujúca prechodové javy modulu SIM800L v sieti 2G/GPRS bez reštartu MCU',
          },
          {
            label: 'Napájanie a rozmery',
            value: '110 V AC → 5 V DC · Ø 9 cm',
            detail: 'Integrovaný zdroj na kruhovej doske s oddelením vysokého napätia od digitálnej zeme',
          },
        ],
        transcriptSummary:
          '„To, čo vidíte, nie je školská vývojová doska, ale priemyselná PCB navrhnutá v programe KiCad s mikrokontrolérom ATtiny1614. Keďže modul SIM800L vyžaduje pri vysielaní v 2G/GPRS prúdové špičky až 2 ampéry, navrhol som sieť kondenzátorov 1000, 100 a 0,1 mikrofaradu spolu s integrovaným meničom 110 V AC na 5 V DC na kompaktnej 9 cm doske.“',
      },
      D05: {
        id: 'D05',
        number: '05',
        shortNav: 'Firmvér',
        badge: 'MOZOG SYSTÉMU · C++ FIRMVÉR',
        title: 'Neblokujúci konečný stavový automat (FSM)',
        subtitle: 'Master Modbus RTU (RS-485) + orchestrácia AT príkazov + SMS záloha',
        summary:
          'Pôvodný sekvenčný prístup blokoval mikrokontrolér pri sieťovej latencii. Jadro bolo prepísané v jazyku C++ (Arduino IDE) ako konečný stavový automat, ktorý vyčítava elektromagnetický prietokomer, riadi TCP/IP komunikáciu a automaticky rieši chyby.',
        keyPoints: [
          {
            label: 'Priemyselný protokol',
            value: 'Modbus RTU (RS-485)',
            detail: 'SITAR vystupuje ako Master a priamo dopytuje registre elektromagnetického prietokomera',
          },
          {
            label: 'Prenos a opakovania',
            value: 'AT príkazy · TCP/IP',
            detail: 'Nadväzuje GPRS spojenie, odosiela HTTP JSON a FTP súbor s automatickým opakovaním pri chybe',
          },
          {
            label: 'Autonómna odolnosť',
            value: 'SMS Fallback + Spánok',
            detail: 'Záložné odoslanie cez SMS po ≥3 neúspešných pokusoch a návrat do úsporného režimu IDLE',
          },
        ],
        transcriptSummary:
          '„Jadro som naprogramoval v C++ ako konečný stavový automat. SITAR sa prebudí, prevezme rolu Mastera cez priemyselný protokol Modbus RTU RS-485 a priamo osloví elektromagnetický prietokomer. Po získaní objemu a alarmov pomocou AT príkazov cez TCP/IP odošle dátový rámec a vráti sa do režimu nízkej spotreby.“',
      },
      D06: {
        id: 'D06',
        number: '06',
        shortNav: 'Cloud',
        badge: 'PAMÄŤ · CLOUDOVÁ INFRAŠTRUKTÚRA',
        title: 'Distribuovaná dvojserverová architektúra v Azure',
        subtitle: 'Oddelené služby HTTP (FastAPI) a FTP (vsftpd) s databázou PostgreSQL',
        summary:
          'Na virtuálnom serveri Ubuntu v Microsoft Azure bola vybudovaná distribuovaná infraštruktúra s oddelenými zodpovednosťami. Ak je webový server vyťažený alebo v údržbe, nezávislý FTP kanál naďalej prijíma súbory bez výpadku.',
        keyPoints: [
          {
            label: 'Kanál reálneho času (HTTP)',
            value: 'FastAPI · Python (Port 8080)',
            detail: 'Dedikovaný HTTP server spracúvajúci telemetriu v reálnom čase (POST /api/telemetry)',
          },
          {
            label: 'Súborový kanál (FTP)',
            value: 'vsftpd (Port 21)',
            detail: 'Úplne oddelený FTP server s vyhradeným používateľom pre príjem a správu súborov',
          },
          {
            label: 'Relačná databáza',
            value: 'PostgreSQL',
            detail: 'Oba toky sú validované a uložené do PostgreSQL, čo zaručuje nemennosť vodohospodárskej histórie',
          },
        ],
        transcriptSummary:
          '„Vybudoval som distribuovanú cloudovú infraštruktúru na oddelenie zodpovedností: HTTP server postavený na FastAPI v Pythone pre dáta v reálnom čase a úplne oddelený FTP server pre súbory. Oba toky sú validované a zapísané do relačnej databázy PostgreSQL.“',
      },
      D07: {
        id: 'D07',
        number: '07',
        shortNav: 'Dashboard',
        badge: 'VÍZIA · ROZHRANIE V REÁLNOM ČASE',
        title: 'Webový Dashboard s telemetriou cez WebSockets',
        subtitle: 'Sledovanie vodovodnej siete naživo bez obnovovania stránky',
        summary:
          'Všetka elektronika, nízkoúrovňový kód a servery sa stretávajú vo webovom rozhraní vytvorenom pomocou HTML5, CSS a JavaScriptových vizualizačných knižníc. Vďaka protokolu WebSockets administrátor sleduje prietok a počítadlo v reálnom čase.',
        keyPoints: [
          {
            label: 'Obojsmerná komunikácia',
            value: 'Živé WebSockets',
            detail: 'Okamžitá aktualizácia grafov a záznamov bez nutnosti ručného obnovovania stránky',
          },
          {
            label: 'Sledované veličiny',
            value: 'Prietok (L/s) a Objem (m³)',
            detail: 'Okamžitý prietok, akumulovaný objem a živý denník udalostí a FTP prenosov',
          },
          {
            label: 'Terénne overenie',
            value: 'Minimálna latencia v praxi',
            detail: 'Úspešný prenos dátových rámcov zo vzdialenej lokality do cloudovej infraštruktúry',
          },
        ],
        transcriptSummary:
          '„Vyvinuli sme webový dashboard pomocou HTML5, CSS a vizualizačných knižníc v JavaScripte. Vďaka WebSockets administrátor nemusí obnovovať stránku a vidí správanie vodovodných sietí v reálnom čase. Počas testov prototypu sme úspešne prenášali dáta zo vzdialenej lokality s minimálnou latenciou.“',
      },
      D08: {
        id: 'D08',
        number: '08',
        shortNav: 'Dopad',
        badge: 'DOPAD A INŽINIERSKY ROADMAP',
        title: 'Legislatívny, ekonomický, pracovný a environmentálny dopad',
        subtitle: 'Súlad s normou dnes a vývoj smerom k lokálnej pamäti (Datalogger) na PCB',
        summary:
          'SITAR dokazuje, že vlastný inžiniersky vývoj dokáže vyriešiť legislatívne aj prevádzkové problémy. Zároveň má jasný plán rozvoja (roadmap) – integráciu lokálnej pamäte priamo na PCB.',
        keyPoints: [
          {
            label: 'Právny a ekonomický',
            value: 'NMX-AA-179-2018 + Úspora',
            detail: 'Plný súlad s normou a výrazné zníženie cestovných a logistických nákladov',
          },
          {
            label: 'Bezpečnosť a ekológia',
            value: 'Ochrana ľudí a vodných zdrojov',
            detail: 'Sťahuje inžinierov z nebezpečných ciest a pomáha zastaviť nadmerné čerpanie podzemných vôd',
          },
          {
            label: 'Budúci cieľ (Roadmap)',
            value: 'Lokálna pamäť (Datalogger)',
            detail: 'Ukladanie meraní in-situ na PCB pri výpadku mobilnej siete a následné dávkové odoslanie',
          },
        ],
        transcriptSummary:
          '„Po právnej stránke SITAR spĺňa normu NMX-AA-179-2018, ekonomicky znižuje cestovné náklady, pracovne sťahuje inžinierov z nebezpečných ciest a environmentálne chráni podzemné vody. Naším hlavným budúcim cieľom je integrovať lokálnu pamäť na PCB, aby uzol fungoval ako autonómny datalogger s dávkovým doposlaním dát.“',
      },
      D09: {
        id: 'D09',
        number: '09',
        shortNav: 'Záver',
        badge: 'ZÁVER',
        title: 'Voda, pripojená.',
        subtitle: 'Zdroj našej budúcnosti poháňaný technológiou prítomnosti',
        summary:
          'Projekt SITAR potvrdzuje inovačnú schopnosť spoločnosti SOVETEC prostredníctvom vlastného, škálovateľného telemetrického systému pripraveného na nasadenie v reálnom svete.',
        keyPoints: [
          {
            label: 'Stav projektu',
            value: 'Overený funkčný prototyp',
            detail: 'Otestovaný od priemyselného snímača RS-485 až po vizualizáciu v cloude',
          },
          {
            label: 'Technologická nezávislosť',
            value: '100 % vlastný vývoj',
            detail: 'Plná nezávislosť od predražených komerčných riešení tretích strán',
          },
        ],
        transcriptSummary:
          '„Tento projekt potvrdzuje inováciu spoločnosti SOVETEC. Voda je zdrojom našej budúcnosti, ale vyžaduje si technológiu prítomnosti. Toto je SITAR. Ďakujem vám za pozornosť.“',
      },
    },
    hardwareGallery: [
      {
        title: '3D render priemyselnej PCB (Ø 9 cm)',
        caption: 'Kompaktný kruhový návrh v programe KiCad s izolačným oddelením vysokého napätia 110 V od digitálnej zeme.',
        tag: 'KiCad 3D',
      },
      {
        title: 'Mikrokontrolér ATtiny1614',
        caption: 'Riadiaca jednotka uzla: veľmi nízka spotreba energie a nezávislé periférie.',
        tag: 'MCU / Riadenie',
      },
      {
        title: 'Komunikačná časť: RS-485 a SIM800L',
        caption: 'Priemyselné rozhranie Modbus RTU a mobilný modem 2G/GPRS so sieťou kondenzátorov (1000, 100 a 0,1 µF).',
        tag: 'RS-485 + GPRS',
      },
      {
        title: 'Integrovaný napájací zdroj (Power Supply)',
        caption: 'Priama transformácia 110 V AC na 5 V DC dimenzovaná na prúdové špičky až 2 A počas vysielania.',
        tag: 'Napájanie 110V→5V',
      },
    ],
    fsmStates: [
      {
        id: 'IDLE',
        name: '1. IDLE (Režim spánku)',
        role: 'Neblokujúci časovač (cyklus každých 12 s)',
        desc: 'MCU čaká v úspornom režime do uplynutia intervalu merania bez blokovania procesora.',
        color: '#f1fa8c',
      },
      {
        id: 'LEER_MODBUS',
        name: '2. LEER_MODBUS (RS-485)',
        role: 'Master Modbus RTU → Prietokomer',
        desc: 'Prepne piny na RS-485 a volá readInputRegisters(0,5) a (5,5) pre načítanie prietoku, objemu a alarmov.',
        color: '#8be9fd',
      },
      {
        id: 'GPRS_HTTP',
        name: '3. INIT_GPRS → ENVIAR_HTTP',
        role: 'AT príkazy · GPRS Bearer · HTTP POST',
        desc: 'Overí SAPBR bearer a odošle JSON telemetriu cez HTTP (AT+HTTPACTION=1) s max. 3 opakovaniami.',
        color: '#bd93f9',
      },
      {
        id: 'ENVIAR_FTP',
        name: '4. CERRAR_HTTP → ENVIAR_FTP',
        role: 'Záloha súboru cez nezávislý FTP kanál',
        desc: 'Po potvrdení HTTP 200/201 odošle rovnaký dátový súbor na vyhradený FTP server.',
        color: '#ffb86c',
      },
      {
        id: 'FALLBACK_SMS',
        name: '5. FALLBACK_SMS (Záloha SMS)',
        role: 'Odolnosť voči poruchám po ≥ 3 pokusoch',
        desc: 'Ak zlyhá GPRS alebo HTTP po 3 pokusoch, odošle kritické údaje cez SMS (+CMGF / +CMGS) a vráti sa do IDLE.',
        color: '#ff79c6',
      },
    ],
    cloudArchitecture: [
      {
        layer: 'Základná infraštruktúra',
        tech: 'Microsoft Azure · Ubuntu Server VM',
        portOrRole: 'Izolácia používateľov v OS',
        desc: 'Zabezpečené linuxové prostredie s oddelenými oprávneniami pre FTP a HTTP služby.',
        accent: '#38bdf8',
      },
      {
        layer: 'Spracovanie v reálnom čase',
        tech: 'FastAPI (Python) · Služba HTTP',
        portOrRole: 'Port 8080 · POST /api/telemetry',
        desc: 'Spracúva okamžitý prietok s minimálnou latenciou a posiela dáta na dashboard cez WebSockets.',
        accent: '#34d399',
      },
      {
        layer: 'Príjem súborov',
        tech: 'vsftpd · Nezávislý FTP server',
        portOrRole: 'Port 21 · Vyhradený používateľ',
        desc: 'Oddelený od webového servera: pokračuje v prijímaní súborov aj počas údržby HTTP API.',
        accent: '#22d3ee',
      },
      {
        layer: 'Historické úložisko',
        tech: 'PostgreSQL · Relačná databáza',
        portOrRole: 'Nemenné ACID úložisko',
        desc: 'Validuje a ukladá oba dátové toky pre audit a plnenie vodohospodárskej normy.',
        accent: '#818cf8',
      },
    ],
    impactCards: [
      {
        category: 'Legislatíva a normy',
        title: 'Súlad s NMX-AA-179-2018',
        desc: 'Priamy a autonómny prenos objemov národných vôd bez sprostredkovateľov a zastaraných RTU.',
      },
      {
        category: 'Ekonomika a logistika',
        title: 'Výrazná úspora nákladov',
        desc: 'Odstraňuje nákladné výjazdy technikov k odľahlým vrtom kvôli ručnému odpočtu.',
      },
      {
        category: 'Bezpečnosť práce',
        title: 'Ochrana inžinierov v teréne',
        desc: 'Sťahuje pracovníkov z nebezpečných ciest a extrémneho počasia vďaka centralizovanej prevádzke.',
      },
      {
        category: 'Životné prostredie',
        title: 'Ochrana podzemných vôd',
        desc: 'Detekcia únikov a anomálií v reálnom čase pomáha zabrániť nadmernému čerpaniu vodných zdrojov.',
      },
    ],
    roadmap: {
      badge: 'PLÁN ROZVOJA (ROADMAP) · ĎALŠIA FÁZA',
      title: 'Lokálna pamäť na PCB (Režim autonómneho Dataloggera)',
      desc: 'Integrácia energeticky nezávislej pamäte priamo na PCB, aby nedošlo k strate dát ani pri dlhodobom výpadku mobilnej siete.',
      features: [
        'Ukladanie meraní in-situ s časovou pečiatkou pri výpadku mobilného signálu',
        'Automatické dávkové (burst) odoslanie dát po obnovení GPRS spojenia',
        'Nepretržitá kontinuita vodohospodárskej histórie za akýchkoľvek podmienok',
      ],
    },
  },
  PL: {
    meta: {
      headerBadge: 'DOSSIER DLA KOMITETU NAUKOWEGO',
      committeeViewTitle: 'SITAR · Synteza Techniczna i Wykonawcza',
      authorRole: 'Inżynieria Oprogramowania (10. kwartał) · Studia Dualne i Praktyki Zawodowe',
      companyDesc: 'We współpracy z firmą SOVETEC (+15 lat doświadczenia w aparaturze kontrolno-pomiarowej i automatyce przemysłowej)',
      listenFullGuide: 'Odsłuchaj całą prezentację',
      stopFullGuide: 'Wstrzymaj audioprzewodnik',
      playingFullGuide: 'Odtwarzanie audioprzewodnika',
      listenSection: 'Odsłuchaj sekcję',
      pauseSection: 'Wstrzymaj audio',
      playingSection: 'Odtwarzanie sekcji',
      partIndicator: 'Część',
      audioPendingLang: 'Audio w PL dla tej sekcji wkrótce (dostępne w ES)',
      playInSpanishFallback: 'Odsłuchaj w ES',
      playingSpanishFallback: 'Odtwarzanie w ES',
      transcriptToggle: 'Pokaż syntezę wypowiedzi',
      hideTranscript: 'Ukryj syntezę',
      quickJump: 'Sekcje',
      interactiveHardware: 'Rendery Inżynieryjne i PCB (KiCad)',
      fsmTabDiagram: 'Maszyna Stanów (FSM)',
      fsmTabCode: 'Kod C++ (Firmware)',
      liveSimulationBadge: 'SYMULOWANA TELEMETRIA W CZASIE RZECZYWISTYM',
      simulateAnomalyBtn: 'Symuluj skok',
      restoreNormalBtn: 'Normalny przepływ',
      shareQrTitle: 'Udostępnij widok mobilny',
      shareQrDesc: 'Bezpośredni link dla członków Komitetu Naukowego',
      copyLink: 'Kopiuj link',
      linkCopied: 'Skopiowano link!',
      openSlidesDesktop: 'Pokaz slajdów',
      speedLabel: 'Prędkość',
      autoScrollLabel: 'Auto-przewijanie',
      tracksAvailableCount: 'sekcji z natywnym audio PL',
    },
    sections: {
      D01: {
        id: 'D01',
        number: '01',
        shortNav: 'Wstęp',
        badge: 'WPROWADZENIE I KONTEKST',
        title: 'SITAR: Zintegrowany System Telemetrii Zdalnej',
        subtitle: 'Autorska technologia stworzona od podstaw dla krytycznego zarządzania wodą w Meksyku',
        summary:
          'Projekt zrealizowany w ramach systemu kształcenia dualnego i praktyk zawodowych na kierunku Inżynieria Oprogramowania we współpracy z firmą SOVETEC. W obliczu przestarzałej technologii gospodarki wodnej w Meksyku zaprojektowano od zera kompletny system sprzętu, oprogramowania układowego i chmury.',
        keyPoints: [
          {
            label: 'Autor',
            value: 'Axel Fernando Langle Camacho',
            detail: 'Student 10. kwartału Inżynierii Oprogramowania (Kształcenie Dualne)',
          },
          {
            label: 'Partner Przemysłowy',
            value: 'SOVETEC',
            detail: '+15 lat doświadczenia w pomiarach, sterowaniu i automatyce przemysłowej',
          },
          {
            label: 'Zakres Projektu',
            value: 'Full-Stack Industrial IoT',
            detail: 'Przemysłowe PCB w KiCad + Firmware C++ FSM + Rozproszona Chmura + Panel Live',
          },
        ],
        transcriptSummary:
          '„Woda jest naszym najbardziej krytycznym zasobem, ale w Meksyku technologia używana do zarządzania nią stała się przestarzała. Stanęliśmy przed problemem telemetrii i postanowiliśmy stworzyć własną technologię od podstaw: projekt SITAR – Zintegrowany System Telemetrii Zdalnej.”',
      },
      D02: {
        id: 'D02',
        number: '02',
        shortNav: 'Problem',
        badge: 'PROBLEM I REGULACJE PRAWNE',
        title: 'Kryzys Pomiarowy i Norma NMX-AA-179-2018',
        subtitle: 'Od ręcznych zapisów w zeszycie do obowiązkowej, bezpośredniej i autonomicznej transmisji',
        summary:
          'Według danych CONAGUA w Meksyku istnieje ponad 537 000 punktów poboru wody, jednak około 97% z nich nie posiada sprawnego licznika. Tam, gdzie liczniki istnieją, operatorzy wciąż podróżują godzinami po autostradach i drogach gruntowych w trudnych warunkach, aby ręcznie spisać odczyty.',
        keyPoints: [
          {
            label: 'Punkty Poboru Wody',
            value: '+537 000',
            detail: 'Zarejestrowane ujęcia wody na terytorium Meksyku (CONAGUA)',
          },
          {
            label: 'Luka Pomiarowa',
            value: '~97%',
            detail: 'Brak działającego wodomierza lub aktywnego systemu telemetrii',
          },
          {
            label: 'Wymóg Prawny',
            value: 'NMX-AA-179-2018',
            detail: 'Nakazuje bezpośrednią i w pełni autonomiczną transmisję danych bez pośredników i przestarzałych RTU',
          },
        ],
        transcriptSummary:
          '„Władze meksykańskie wdrożyły normę NMX-AA-179-2018. Nakazuje ona bezpośrednią i w pełni autonomiczną transmisję danych wodnych, eliminując pośredników oraz przestarzałe jednostki RTU. SOVETEC potrzebował technologii spełniającej te wymogi natywnie.”',
      },
      D03: {
        id: 'D03',
        number: '03',
        shortNav: 'Koncepcja',
        badge: 'METODOLOGIA I ARCHITEKTURA',
        title: 'Anatomia Danych: Architektura 3 Filarów',
        subtitle: 'Metoda analityczna + prototypowanie ewolucyjne dla autonomicznej telemetrii',
        summary:
          'Zastosowano metodę analityczną, aby rozbić problem na minimalne jednostki funkcjonalne, a następnie prototypowanie ewolucyjne do iteracyjnych testów i budowy architektury opartej na trzech filarach.',
        keyPoints: [
          {
            label: 'Filar 1 · Sprzęt',
            value: 'Przemysłowe PCB na Miarę',
            detail: 'Zaprojektowane specjalnie, aby wytrzymać trudne warunki przemysłowe',
          },
          {
            label: 'Filar 2 · Łączność',
            value: 'Sieć Komórkowa 2G / GPRS',
            detail: 'Niezawodna łączność dla odległych studni o niskim poziomie sygnału',
          },
          {
            label: 'Filar 3 · Chmura',
            value: 'Autonomiczne Przetwarzanie',
            detail: 'Odbiór, walidacja i zapis danych w chmurze bez udziału człowieka',
          },
        ],
        transcriptSummary:
          '„Wykorzystałem metodę analityczną do rozłożenia problemu na najmniejsze jednostki oraz metodologię prototypowania ewolucyjnego. Zaprojektowałem architekturę opartą na trzech filarach: dedykowanym sprzęcie przemysłowym, niezawodnej łączności komórkowej oraz autonomicznym przetwarzaniu w chmurze.”',
      },
      D04: {
        id: 'D04',
        number: '04',
        shortNav: 'Sprzęt',
        badge: 'INŻYNIERIA SPRZĘTU I PCB',
        title: 'Przemysłowe PCB w KiCad i Tłumienie Skoków Prądowych',
        subtitle: 'Okrągła płytka Ø 9 cm z MCU ATtiny1614, RS-485, SIM800L i siecią kondensatorów',
        summary:
          'Zamiast szkolnej płytki uruchomieniowej zaprojektowano w KiCad przemysłową płytkę PCB w kształcie dysku o średnicy 9 cm. Integruje ona zasilacz AC-DC (110V AC na 5V DC) z izolacją galwaniczną oraz rozwiązuje problem impulsów prądowych do 2 A podczas transmisji GPRS.',
        keyPoints: [
          {
            label: 'Mikrokontroler (MCU)',
            value: 'ATtiny1614',
            detail: 'Niskie zużycie energii i niezależne peryferia idealne do pracy w terenie',
          },
          {
            label: 'Tłumienie Impulsów (2 A)',
            value: '1000, 100 i 0,1 µF',
            detail: 'Sieć kondensatorów pochłaniająca stany przejściowe modułu SIM800L w sieci 2G/GPRS',
          },
          {
            label: 'Zasilanie i Wymiary',
            value: '110V AC → 5V DC · Ø 9 cm',
            detail: 'Zintegrowany zasilacz na tarczy 9 cm z separacją wysokiego napięcia od masy cyfrowej',
          },
        ],
        transcriptSummary:
          '„To nie jest szkolna płytka rozwojowa, lecz przemysłowe PCB zaprojektowane w KiCad o średnicy 9 cm z mikrokontrolerem ATtiny1614. Aby pochłonąć skoki prądu do 2 amperów modułu SIM800L podczas łączenia z siecią 2G/GPRS, zaprojektowałem sieć kondensatorów 1000, 100 i 0,1 mikrofarada oraz zintegrowany zasilacz 110V AC na 5V DC.”',
      },
      D05: {
        id: 'D05',
        number: '05',
        shortNav: 'Firmware',
        badge: 'MÓZG SYSTEMU · FIRMWARE C++',
        title: 'Nieblokująca Maszyna Stanów Skończonych (FSM)',
        subtitle: 'Master Modbus RTU (RS-485) + Orkiestracja Komend AT + Awaryjny SMS',
        summary:
          'Początkowe podejście sekwencyjne blokowało mikrokontroler. Przepisano rdzeń w języku C++ (Arduino IDE) z użyciem Maszyny Stanów Skończonych (FSM), która odpytuje przepływomierz elektromagnetyczny, zarządza transmisją TCP/IP oraz automatycznie obsługuje błędy i ponowienia.',
        keyPoints: [
          {
            label: 'Protokół Przemysłowy',
            value: 'Modbus RTU (RS-485)',
            detail: 'SITAR działa jako Master, bezpośrednio odpytując przepływomierz elektromagnetyczny',
          },
          {
            label: 'Transmisja i Ponowienia',
            value: 'Komendy AT · TCP/IP',
            detail: 'Negocjuje połączenie GPRS, wysyła ramkę HTTP JSON oraz plik FTP z obsługą ponowień',
          },
          {
            label: 'Autonomiczna Odporność',
            value: 'Fallback SMS + Uśpienie',
            detail: 'Wysyła dane przez SMS po ≥3 nieudanych próbach sieciowych i wraca do stanu niskiego poboru mocy IDLE',
          },
        ],
        transcriptSummary:
          '„Przepisałem logikę w C++ z użyciem Maszyny Stanów Skończonych. SITAR budzi się, przyjmuje rolę Mastera przez przemysłowy protokół Modbus RTU RS-485 i odpytuje przepływomierz elektromagnetyczny. Po pobraniu objętości i alarmów wykonuje komendy AT przez TCP/IP, przesyła ramkę danych i wraca do stanu uśpienia.”',
      },
      D06: {
        id: 'D06',
        number: '06',
        shortNav: 'Chmura',
        badge: 'PAMIĘĆ · INFRASTRUKTURA CHMUROWA',
        title: 'Rozproszona Architektura Dwuserwerowa w Azure',
        subtitle: 'Niezależne usługi HTTP (FastAPI) i FTP (vsftpd) z bazą danych PostgreSQL',
        summary:
          'Na maszynie wirtualnej Ubuntu Server w chmurze Microsoft Azure wdrożono architekturę rozdzielającą odpowiedzialności. Jeśli serwer WWW jest przeciążony lub w trakcie konserwacji, niezależny serwer FTP nadal odbiera pliki pomiarowe.',
        keyPoints: [
          {
            label: 'Kanał Czasu Rzeczywistego',
            value: 'FastAPI · Python (Port 8080)',
            detail: 'Dedykowany serwer HTTP przetwarzający dane w czasie rzeczywistym (POST /api/telemetry)',
          },
          {
            label: 'Kanał Plików (FTP)',
            value: 'vsftpd (Port 21)',
            detail: 'Całkowicie odseparowany serwer FTP z dedykowanym użytkownikiem do odbioru plików',
          },
          {
            label: 'Relacyjna Baza Danych',
            value: 'PostgreSQL',
            detail: 'Oba strumienie są walidowane i zapisywane w PostgreSQL, gwarantując niezmienność historii wodnej',
          },
        ],
        transcriptSummary:
          '„Zbudowałem rozproszoną infrastrukturę w chmurze rozdzielającą odpowiedzialności: serwer HTTP oparty na FastAPI w Pythonie dla danych w czasie rzeczywistym oraz całkowicie osobny serwer FTP do odbioru plików. Oba strumienie trafiają po walidacji do relacyjnej bazy danych PostgreSQL.”',
      },
      D07: {
        id: 'D07',
        number: '07',
        shortNav: 'Dashboard',
        badge: 'WIZJA · INTERFEJS CZASU RZECZYWISTEGO',
        title: 'Panel Webowy z Telemetrią przez WebSockets',
        subtitle: 'Monitoring sieci wodociągowej na żywo bez konieczności odświeżania strony',
        summary:
          'Cała elektronika, niskopoziomowy kod i serwery spotykają się w interfejsie webowym zbudowanym w HTML5, CSS i bibliotekach wizualizacji JavaScript. Dzięki WebSockets administrator obserwuje zachowanie sieci wodnej w czasie rzeczywistym.',
        keyPoints: [
          {
            label: 'Komunikacja Push',
            value: 'WebSockets na Żywo',
            detail: 'Natychmiastowa aktualizacja wykresów i dzienników zdarzeń bez przeładowywania strony',
          },
          {
            label: 'Monitorowane Parametry',
            value: 'Przepływ (L/s) i Objętość (m³)',
            detail: 'Chwilowy przepływ, skumulowany licznik objętości oraz dziennik transferów FTP na żywo',
          },
          {
            label: 'Walidacja w Terenie',
            value: 'Minimalne Opóźnienie',
            detail: 'Pomyślna transmisja ramek pomiarowych z odległej lokalizacji do infrastruktury chmurowej',
          },
        ],
        transcriptSummary:
          '„Opracowaliśmy panel webowy przy użyciu HTML5, CSS i bibliotek wizualizacji JavaScript. Dzięki WebSockets administrator nie musi odświeżać strony, aby widzieć pracę sieci wodnej w czasie rzeczywistym. W testach prototypu pomyślnie przesłaliśmy dane z odległej lokalizacji przy minimalnym opóźnieniu.”',
      },
      D08: {
        id: 'D08',
        number: '08',
        shortNav: 'Wpływ',
        badge: 'WPŁYW I ROADMAP INŻYNIERYJNY',
        title: 'Wpływ Prawny, Ekonomiczny, Społeczny, Środowiskowy i Rozwój',
        subtitle: 'Zgodność z normą dziś i rozwój w kierunku lokalnej pamięci Datalogger na PCB',
        summary:
          'SITAR to działający prototyp pokazujący, jak autorska technologia rozwiązuje problemy prawne i operacyjne, posiadający jednocześnie jasny plan rozwoju (roadmap) obejmujący lokalną pamięć na płytce PCB.',
        keyPoints: [
          {
            label: 'Prawny i Ekonomiczny',
            value: 'NMX-AA-179-2018 + Oszczędność',
            detail: 'Pełna zgodność z normą oraz drastyczne obniżenie kosztów delegacji i logistyki',
          },
          {
            label: 'Bezpieczeństwo i Ekologia',
            value: 'Ochrona Ludzi i Warstw Wodonośnych',
            detail: 'Wycofuje inżynierów z niebezpiecznych dróg i zapobiega nadmiernej eksploatacji wód podziemnych',
          },
          {
            label: 'Cel Przyszłościowy (Roadmap)',
            value: 'Lokalna Pamięć (Datalogger)',
            detail: 'Zapis odczytów in-situ na PCB podczas awarii sieci komórkowej i pakietowa retransmisja po odzyskaniu sygnału',
          },
        ],
        transcriptSummary:
          '„Pod względem prawnym SITAR spełnia normę NMX-AA-179-2018, ekonomicznie tnie koszty delegacji, zawodowo zabiera inżynierów z niebezpiecznych dróg, a środowiskowo chroni warstwy wodonośne. Naszym głównym celem na przyszłość jest integracja lokalnej pamięci na PCB jako autonomicznego dataloggera z transmisją pakietową.”',
      },
      D09: {
        id: 'D09',
        number: '09',
        shortNav: 'Finał',
        badge: 'PODSUMOWANIE',
        title: 'Woda, połączona.',
        subtitle: 'Zasób naszej przyszłości wspierany przez technologię teraźniejszości',
        summary:
          'Projekt SITAR potwierdza innowacyjność firmy SOVETEC poprzez autorskie, skalowalne rozwiązanie telemetryczne gotowe do wdrożenia przemysłowego.',
        keyPoints: [
          {
            label: 'Status Projektu',
            value: 'Zwalidowany Prototyp Funkcjonalny',
            detail: 'Przetestowany kompleksowo od czujnika RS-485 po wizualizację w chmurze',
          },
          {
            label: 'Niezależność Technologiczna',
            value: '100% Własna Inżynieria',
            detail: 'Pełna niezależność od drogich, zamkniętych rozwiązań komercyjnych',
          },
        ],
        transcriptSummary:
          '„Ten projekt potwierdza innowacyjność firmy SOVETEC. Woda jest zasobem naszej przyszłości, ale wymaga technologii teraźniejszości. To jest SITAR. Bardzo dziękuję za uwagę.”',
      },
    },
    hardwareGallery: [
      {
        title: 'Render 3D Przemysłowego PCB (Ø 9 cm)',
        caption: 'Kompaktowy projekt w kształcie dysku w KiCad z izolacją wysokiego napięcia 110V od płaszczyzny masy cyfrowej.',
        tag: 'KiCad 3D',
      },
      {
        title: 'Mikrokontroler ATtiny1614',
        caption: 'Jednostka sterująca węzła: ultraniskie zużycie energii i niezależne peryferia.',
        tag: 'MCU / Sterowanie',
      },
      {
        title: 'Moduły Komunikacji: RS-485 i SIM800L',
        caption: 'Przemysłowy interfejs Modbus RTU oraz modem 2G/GPRS wspierany przez sieć kondensatorów (1000, 100 i 0,1 µF).',
        tag: 'RS-485 + GPRS',
      },
      {
        title: 'Zintegrowany Zasilacz (Power Supply)',
        caption: 'Bezpośrednia konwersja 110V AC na 5V DC wytrzymująca skoki prądu do 2 A podczas transmisji komórkowej.',
        tag: 'Zasilanie 110V→5V',
      },
    ],
    fsmStates: [
      {
        id: 'IDLE',
        name: '1. IDLE (Stan Uśpienia)',
        role: 'Nieblokujący licznik czasu (cykl co 12 s)',
        desc: 'Mikrokontroler oczekuje w trybie niskiego poboru mocy do upływu interwału pomiarowego.',
        color: '#f1fa8c',
      },
      {
        id: 'LEER_MODBUS',
        name: '2. LEER_MODBUS (RS-485)',
        role: 'Master Modbus RTU → Przepływomierz',
        desc: 'Przełącza piny na RS-485 i wywołuje readInputRegisters(0,5) oraz (5,5) pobierając przepływ, licznik i alarmy.',
        color: '#8be9fd',
      },
      {
        id: 'GPRS_HTTP',
        name: '3. INIT_GPRS → ENVIAR_HTTP',
        role: 'Komendy AT · Bearer GPRS · HTTP POST',
        desc: 'Weryfikuje bearer SAPBR i wysyła telemetrię JSON przez HTTP (AT+HTTPACTION=1) z maks. 3 ponowieniami.',
        color: '#bd93f9',
      },
      {
        id: 'ENVIAR_FTP',
        name: '4. CERRAR_HTTP → ENVIAR_FTP',
        role: 'Kopia pliku przez niezależny kanał FTP',
        desc: 'Po potwierdzeniu HTTP 200/201 przesyła ten sam pakiet danych na dedykowany serwer FTP.',
        color: '#ffb86c',
      },
      {
        id: 'FALLBACK_SMS',
        name: '5. FALLBACK_SMS (Tryb Awaryjny)',
        role: 'Odporność na błędy po ≥ 3 próbach',
        desc: 'Jeśli GPRS lub HTTP zawiedzie po 3 próbach, wysyła odczyt przez SMS (+CMGF / +CMGS) i wraca do stanu IDLE.',
        color: '#ff79c6',
      },
    ],
    cloudArchitecture: [
      {
        layer: 'Infrastruktura Bazowa',
        tech: 'Microsoft Azure · Ubuntu Server VM',
        portOrRole: 'Izolacja użytkowników systemu',
        desc: 'Zabezpieczone środowisko Linux rozdzielające uprawnienia serwera plików i API webowego.',
        accent: '#38bdf8',
      },
      {
        layer: 'Przetwarzanie Czasu Rzeczywistego',
        tech: 'FastAPI (Python) · Usługa HTTP',
        portOrRole: 'Port 8080 · POST /api/telemetry',
        desc: 'Przetwarza odczyty przepływu z minimalnym opóźnieniem i przesyła je do panelu przez WebSockets.',
        accent: '#34d399',
      },
      {
        layer: 'Odbiór Plików',
        tech: 'vsftpd · Niezależny Serwer FTP',
        portOrRole: 'Port 21 · Dedykowany użytkownik',
        desc: 'Odseparowany od serwera HTTP: kontynuuje odbiór plików nawet podczas konserwacji API webowego.',
        accent: '#22d3ee',
      },
      {
        layer: 'Trwała Pamięć Historyczna',
        tech: 'PostgreSQL · Relacyjna Baza Danych',
        portOrRole: 'Niezmienny zapis ACID',
        desc: 'Waliduje i przechowuje strumienie HTTP oraz FTP, zapewniając audytowalną historię wodną.',
        accent: '#818cf8',
      },
    ],
    impactCards: [
      {
        category: 'Prawo i Normy',
        title: 'Zgodność z NMX-AA-179-2018',
        desc: 'Bezpośrednia i autonomiczna transmisja objętości wód krajowych bez pośredników i przestarzałych RTU.',
      },
      {
        category: 'Ekonomia i Logistyka',
        title: 'Drastyczna Redukcja Kosztów Wyjazdów',
        desc: 'Eliminuje kosztowne, regularne dojazdy do odległych studni w celu ręcznego spisywania liczników.',
      },
      {
        category: 'Bezpieczeństwo Pracy',
        title: 'Ochrona Inżynierów i Operatorów',
        desc: 'Wycofuje personel z niebezpiecznych dróg i trudnych warunków pogodowych dzięki centralizacji operacji.',
      },
      {
        category: 'Środowisko Naturalne',
        title: 'Ochrona Warstw Wodonośnych',
        desc: 'Wykrywanie wycieków i anomalii w czasie rzeczywistym pozwala zatrzymać nadmierną eksploatację wód.',
      },
    ],
    roadmap: {
      badge: 'ROADMAP ROZWOJU · KOLEJNY ETAP',
      title: 'Lokalna Pamięć na PCB (Tryb Autonomicznego Dataloggera)',
      desc: 'Integracja modułów pamięci nieulotnej bezpośrednio na płytce PCB, aby zagwarantować zero utraty danych podczas awarii sieci komórkowej.',
      features: [
        'Zapis odczytów in-situ ze znacznikiem czasu w przypadku zaniku sygnału komórkowego',
        'Automatyczna retransmisja pakietowa (burst) natychmiast po przywróceniu połączenia GPRS',
        'Pełna ciągłość historii pomiarowej wymagana przez instytucje regulacyjne',
      ],
    },
  },
};
