export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  chips?: string[];
  kind?: 'text' | 'summary';
}

export interface ChatState {
  messages: ChatMessage[];
  currentIntent: string | null;
  slots: {
    servicio?: string;
    modalidad?: 'en línea' | 'presencial';
    sede?: 'polanco' | 'santa fe';
    sintomas?: string;
    nombre?: string;
    edad?: string;
    diaRango?: 'lun-jue' | 'sab' | 'dom';
  };
  stepStack: string[];     // historial de pasos (para “Atrás”)
  isWaitingForInput: boolean;
}

export const INTENTS = {
  SALUDO: 'saludo',
  AGENDAR: 'agendar',
  SERVICIOS: 'servicios',
  INFORMACION: 'informacion',
  MODALIDAD: 'modalidad',
  SEDE: 'sede',
  HORARIOS: 'horarios',
  CREDENCIALES: 'credenciales',
  CAMBIAR_DATO: 'cambiar_dato',
  EMERGENCIA: 'emergencia',
  DESPEDIDA: 'despedida',
  FALLBACK: 'fallback'
} as const;

export const SERVICES_MAP: { [key: string]: string } = {
  depresion: 'depresión',
  'depresión': 'depresión',
  ansiedad: 'ansiedad',
  'disfuncion-erectil': 'disfunción eréctil',
  'disfunción eréctil': 'disfunción eréctil',
  'terapia-pareja': 'terapia de pareja',
  'terapia de pareja': 'terapia de pareja',
};

export const MODALIDAD_MAP: { [key: string]: 'en línea' | 'presencial' } = {
  'en línea': 'en línea',
  'en linea': 'en línea',
  online: 'en línea',
  zoom: 'en línea',
  videollamada: 'en línea',
  presencial: 'presencial',
  consultorio: 'presencial',
};

export const SEDE_MAP: { [key: string]: 'polanco' | 'santa fe' } = {
  polanco: 'polanco',
  'santa fe': 'santa fe',
  santafe: 'santa fe',
};

export function detectIntent(message: string): string {
  const lower = message.toLowerCase().trim();

  // emergencia
  if (/(suicid|matarme|hacerme daño|emergencia|urgencia)/.test(lower)) return INTENTS.EMERGENCIA;

  if (/(hola|buenos|buenas|saludos|hi|hello)/.test(lower)) return INTENTS.SALUDO;
  if (/(agendar|cita|consulta|appointment|schedule)/.test(lower)) return INTENTS.AGENDAR;
  if (/(servicio|tratamiento|ayuda)/.test(lower)) return INTENTS.SERVICIOS;
  if (/(línea|linea|online|presencial|consultorio|zoom|videollamada)/.test(lower)) return INTENTS.MODALIDAD;
  if (/(polanco|santa fe|ubicación|donde|address)/.test(lower)) return INTENTS.SEDE;
  if (/(horario|hora|cuando|schedule|time)/.test(lower)) return INTENTS.HORARIOS;
  if (/(credencial|cédula|formación|estudios)/.test(lower)) return INTENTS.CREDENCIALES;
  if (/(cambiar|cambio|modificar|update)/.test(lower)) return INTENTS.CAMBIAR_DATO;
  if (/(adiós|adios|bye|gracias|thank)/.test(lower)) return INTENTS.DESPEDIDA;

  return INTENTS.FALLBACK;
}

export function extractSlots(message: string): Partial<ChatState['slots']> {
  const lower = message.toLowerCase().trim();
  const slots: Partial<ChatState['slots']> = {};

  for (const [k, v] of Object.entries(SERVICES_MAP)) if (lower.includes(k)) { slots.servicio = v; break; }
  for (const [k, v] of Object.entries(MODALIDAD_MAP)) if (lower.includes(k)) { slots.modalidad = v; break; }
  for (const [k, v] of Object.entries(SEDE_MAP)) if (lower.includes(k)) { slots.sede = v; break; }

  // nombre y edad ( “soy Ana, 29” / “me llamo Luis” / “edad 31” )
  const nameMatch = lower.match(/(?:me llamo|soy)\s+([a-záéíóúñ\s]+)/i);
  if (nameMatch) slots.nombre = capitalize(nameMatch[1].trim());

  const ageMatch = lower.match(/(?:tengo|edad)\s+(\d{1,2})/);
  if (ageMatch) slots.edad = ageMatch[1];

  return slots;
}

function capitalize(s: string) {
  return s.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
}

export function dayRangeChips(): { key: ChatState['slots']['diaRango'], label: string }[] {
  return [
    { key: 'lun-jue', label: 'Lun–Jue 16:00–20:00' },
    { key: 'sab',     label: 'Sáb 9:00–13:00' },
    { key: 'dom',     label: 'Dom 9:00–12:00' },
  ];
}

export function empatheticIntro(servicio: string): string {
  const map: Record<string, string> = {
    'depresión':
      'Gracias por compartirlo. La depresión se aborda con tratamientos basados en evidencia y un plan cercano a tus necesidades.',
    'ansiedad':
      'Entiendo lo incómodo que puede ser. La ansiedad mejora con intervenciones clínicas efectivas y acompañamiento claro.',
    'disfunción eréctil':
      'Tratamos este tema con total confidencialidad y enfoque médico–psicosexual integral.',
    'terapia de pareja':
      'Podemos trabajar en comunicación, acuerdos y objetivos compartidos de manera estructurada y respetuosa.',
  };
  return map[servicio] ?? 'Te acompaño a resolverlo con enfoque profesional y cercano.';
}

export function followupLine(servicio: string): string {
  const map: Record<string, string> = {
    'depresión': '¿Te gustaría que avancemos con la modalidad de consulta?',
    'ansiedad': '¿Prefieres que revisemos modalidad y disponibilidad?',
    'disfunción eréctil': '¿Avanzamos con la modalidad de consulta?',
    'terapia de pareja': 'Para continuar, definimos modalidad y disponibilidad.',
  };
  return map[servicio] ?? 'Definamos modalidad y disponibilidad.';
}

export function calculateTypingDelay(text: string): number {
  const base = 450;
  const perChar = 15;
  return Math.min(1400, base + text.length * perChar);
}

export function saveChatState(state: ChatState): void {
  try { sessionStorage.setItem('chatState', JSON.stringify(state)); } catch {}
}
export function loadChatState(): ChatState | null {
  try {
    const raw = sessionStorage.getItem('chatState');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    parsed.messages = (parsed.messages || []).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    return parsed;
  } catch { return null; }
}

export function generateWhatsAppMessage(slots: ChatState['slots']): string {
  let msg = `Hola Dr. Rueda, me gustaría agendar:\n\n`;
  if (slots.servicio)  msg += `• Servicio: ${slots.servicio}\n`;
  if (slots.modalidad) msg += `• Modalidad: ${slots.modalidad}\n`;
  if (slots.modalidad === 'presencial' && slots.sede) msg += `• Sede: ${capitalize(slots.sede)}\n`;
  if (slots.diaRango)  msg += `• Disponibilidad: ${labelFromDia(slots.diaRango)}\n`;
  if (slots.sintomas)  msg += `• Motivo/Síntomas: ${slots.sintomas}\n`;
  if (slots.nombre)    msg += `• Nombre: ${slots.nombre}\n`;
  if (slots.edad)      msg += `• Edad: ${slots.edad}\n`;
  msg += `\nGracias.`;
  return encodeURIComponent(msg);
}

export function labelFromDia(key?: ChatState['slots']['diaRango']): string {
  const it = dayRangeChips().find(d => d.key === key);
  return it ? it.label : '';
}
