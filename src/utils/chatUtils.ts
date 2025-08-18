export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  chips?: string[];
}

export interface ChatState {
  messages: ChatMessage[];
  currentIntent: string | null;
  slots: {
    servicio?: string;
    modalidad?: string;
    sede?: string;
    quienes?: string;
    fechaISO?: string;
    hora?: string;
    nombre?: string;
    telefono?: string;
  };
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
  PAGOS: 'pagos',
  CREDENCIALES: 'credenciales',
  UBICACIONES: 'ubicaciones',
  CAMBIAR_DATO: 'cambiar_dato',
  CANCELAR: 'cancelar',
  EMERGENCIA: 'emergencia',
  DESPEDIDA: 'despedida',
  FALLBACK: 'fallback'
} as const;

export const SERVICES_MAP: { [key: string]: string } = {
  'depresion': 'depresión',
  'depression': 'depresión',
  'depresión': 'depresión',
  'ansiedad': 'ansiedad',
  'anxiety': 'ansiedad',
  'ataques de panico': 'ansiedad',
  'ataques de pánico': 'ansiedad',
  'panic': 'ansiedad',
  'disfuncion-erectil': 'disfunción eréctil',
  'disfuncion erectil': 'disfunción eréctil',
  'disfunción eréctil': 'disfunción eréctil',
  'erección': 'disfunción eréctil',
  'ereccion': 'disfunción eréctil',
  'de': 'disfunción eréctil',
  'erectile': 'disfunción eréctil',
  'terapia-pareja': 'terapia de pareja',
  'terapia de pareja': 'terapia de pareja',
  'pareja': 'terapia de pareja',
  'matrimonio': 'terapia de pareja',
  'couple': 'terapia de pareja'
};

export const MODALIDAD_MAP: { [key: string]: string } = {
  'en línea': 'en línea',
  'en linea': 'en línea',
  'online': 'en línea',
  'zoom': 'en línea',
  'video': 'en línea',
  'videollamada': 'en línea',
  'presencial': 'presencial',
  'consultorio': 'presencial',
  'físico': 'presencial',
  'fisico': 'presencial',
  'personal': 'presencial'
};

export const SEDE_MAP: { [key: string]: string } = {
  'polanco': 'polanco',
  'santa fe': 'santa fe',
  'santafe': 'santa fe',
  'masaryk': 'polanco',
  'quiroga': 'santa fe'
};

export const QUIENES_MAP: { [key: string]: string } = {
  'ambos': 'ambos',
  'los dos': 'ambos',
  'iremos los dos': 'ambos',
  'both': 'ambos',
  'solo uno': 'solo uno',
  'solo yo': 'solo uno',
  'solo iré yo': 'solo uno',
  'individual': 'solo uno',
  'one': 'solo uno'
};

export function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Emergency detection
  if (lowerMessage.includes('suicidio') || 
      lowerMessage.includes('suicidarme') ||
      lowerMessage.includes('matarme') ||
      lowerMessage.includes('hacerme daño') ||
      lowerMessage.includes('urgencia') ||
      lowerMessage.includes('emergencia')) {
    return INTENTS.EMERGENCIA;
  }
  
  // Greeting
  if (lowerMessage.match(/(hola|buenos|buenas|saludos|hi|hello)/)) {
    return INTENTS.SALUDO;
  }
  
  // Scheduling
  if (lowerMessage.match(/(agendar|cita|consulta|appointment|schedule)/)) {
    return INTENTS.AGENDAR;
  }
  
  // Services
  if (lowerMessage.match(/(servicio|tratamiento|ayuda|que|cual)/)) {
    return INTENTS.SERVICIOS;
  }
  
  // Modality
  if (lowerMessage.match(/(línea|linea|online|presencial|consultorio|zoom)/)) {
    return INTENTS.MODALIDAD;
  }
  
  // Location
  if (lowerMessage.match(/(polanco|santa fe|ubicación|donde|address)/)) {
    return INTENTS.SEDE;
  }
  
  // Schedule
  if (lowerMessage.match(/(horario|hora|cuando|schedule|time)/)) {
    return INTENTS.HORARIOS;
  }
  
  // Payments
  if (lowerMessage.match(/(pago|costo|precio|tarjeta|efectivo)/)) {
    return INTENTS.PAGOS;
  }
  
  // Credentials
  if (lowerMessage.match(/(credencial|cédula|formación|estudios)/)) {
    return INTENTS.CREDENCIALES;
  }
  
  // Change data
  if (lowerMessage.match(/(cambiar|cambio|mejor|modificar|update)/)) {
    return INTENTS.CAMBIAR_DATO;
  }
  
  // Cancel
  if (lowerMessage.match(/(cancelar|cancel|no|stop)/)) {
    return INTENTS.CANCELAR;
  }
  
  // Goodbye
  if (lowerMessage.match(/(adiós|adios|bye|gracias|thank)/)) {
    return INTENTS.DESPEDIDA;
  }
  
  return INTENTS.FALLBACK;
}

export function extractSlots(message: string): Partial<ChatState['slots']> {
  const lowerMessage = message.toLowerCase().trim();
  const slots: Partial<ChatState['slots']> = {};
  
  // Extract service
  for (const [key, value] of Object.entries(SERVICES_MAP)) {
    if (lowerMessage.includes(key)) {
      slots.servicio = value;
      break;
    }
  }
  
  // Extract modality
  for (const [key, value] of Object.entries(MODALIDAD_MAP)) {
    if (lowerMessage.includes(key)) {
      slots.modalidad = value;
      break;
    }
  }
  
  // Extract location
  for (const [key, value] of Object.entries(SEDE_MAP)) {
    if (lowerMessage.includes(key)) {
      slots.sede = value;
      break;
    }
  }
  
  // Extract "quienes" for couples therapy
  for (const [key, value] of Object.entries(QUIENES_MAP)) {
    if (lowerMessage.includes(key)) {
      slots.quienes = value;
      break;
    }
  }
  
  // Extract phone (basic validation)
  const phoneMatch = lowerMessage.match(/(\+52|52)?\s*([0-9]{10})/);
  if (phoneMatch) {
    slots.telefono = phoneMatch[2];
  }
  
  // Extract name (simple heuristic)
  if (lowerMessage.match(/me llamo|soy|my name is/)) {
    const nameMatch = lowerMessage.match(/(me llamo|soy|my name is)\s+([a-zA-ZÀ-ÿ\s]+)/);
    if (nameMatch) {
      slots.nombre = nameMatch[2].trim();
    }
  }
  
  return slots;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const now = new Date();
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  for (let i = 1; i <= 10; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const dayName = daysOfWeek[dayOfWeek];
    
    let availableHours: string[] = [];
    
    // Monday to Thursday: 16:00-20:00
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      availableHours = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
    }
    // Saturday: 9:00-13:00
    else if (dayOfWeek === 6) {
      availableHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
    }
    // Sunday: 9:00-12:00
    else if (dayOfWeek === 0) {
      availableHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    }
    
    // If it's today, filter out past hours
    if (i === 1) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      availableHours = availableHours.filter(timeStr => {
        const [hour, minute] = timeStr.split(':').map(Number);
        const timeInMinutes = hour * 60 + minute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        return timeInMinutes > currentTimeInMinutes + 60; // At least 1 hour ahead
      });
    }
    
    // Add a few slots from this day
    for (let j = 0; j < Math.min(2, availableHours.length); j++) {
      const timeStr = availableHours[j];
      slots.push(`${dayName} ${timeStr}`);
    }
    
    if (slots.length >= 5) break;
  }
  
  return slots.slice(0, 5);
}

export function getEmpatheticResponse(service: string, context: 'initial' | 'followup' | 'confirmation'): string {
  const responses = {
    'depresión': {
      initial: [
        "Entiendo que estás pasando por un momento difícil con la depresión. El Dr. Rueda tiene amplia experiencia con enfoques basados en evidencia. ¿Te gustaría agendar una consulta para recibir el apoyo que necesitas?",
        "Gracias por compartirlo. La depresión puede sentirse muy abrumadora, pero podemos trabajar juntos en recuperar tu energía y funcionalidad.",
        "Comprendo lo que estás viviendo. El Dr. Rueda combina calidez humana con tratamientos científicamente probados para la depresión."
      ],
      followup: [
        "Podemos trabajar en recuperar tu energía y funcionalidad. ¿Prefieres consulta en línea o presencial?",
        "El abordaje será personalizado según tus necesidades. ¿Cómo te gustaría comenzar?"
      ]
    },
    'ansiedad': {
      initial: [
        "La ansiedad puede sentirse abrumadora. Trabajamos con estrategias clínicas para reducir síntomas y prevenir recaídas. ¿Cómo te gustaría iniciar, en línea o presencial?",
        "Entiendo lo que estás experimentando con la ansiedad. Podemos ayudarte a recuperar calma y control.",
        "Los síntomas de ansiedad pueden ser muy intensos. El Dr. Rueda tiene experiencia especializada en este área."
      ],
      followup: [
        "Podemos ayudarte a recuperar calma y control. ¿Te gustaría que te proponga horarios?",
        "Hay técnicas muy efectivas para manejar la ansiedad. ¿Prefieres comenzar en línea o presencial?"
      ]
    },
    'disfunción eréctil': {
      initial: [
        "Lo hablamos con respeto y confidencialidad. El abordaje es médico y psicosexual integral. ¿Prefieres consulta en línea o presencial?",
        "Este tema se trata con total profesionalismo y discreción. El Dr. Rueda tiene formación especializada en salud sexual.",
        "Comprendo que puede ser difícil hablar de esto. Te aseguro un ambiente respetuoso y confidencial."
      ],
      followup: [
        "Si te parece bien, puedo sugerirte horarios cercanos.",
        "El tratamiento es integral, médico y psicosexual. ¿Cómo prefieres la consulta?"
      ]
    },
    'terapia de pareja': {
      initial: [
        "Podemos enfocarnos en comunicación, acuerdos y vínculo. ¿Irían ambos a la consulta o solo uno al inicio?",
        "Las dificultades de pareja tienen solución con el abordaje adecuado. ¿Participarían ambos desde el inicio?",
        "Entiendo que atraviesan un momento difícil. Podemos trabajar en mejorar la comunicación y el vínculo."
      ],
      followup: [
        "Perfecto, ajusto horarios que funcionen para ambos. ¿En línea o en consultorio?",
        "De acuerdo, comenzamos individual y luego vemos si se une tu pareja. ¿En línea o presencial?"
      ]
    }
  };
  
  const serviceResponses = responses[service as keyof typeof responses];
  if (!serviceResponses) {
    return "Te ayudo a agendar tu consulta. ¿Prefieres en línea o presencial?";
  }
  
  const contextResponses = serviceResponses[context] || serviceResponses.initial;
  return contextResponses[Math.floor(Math.random() * contextResponses.length)];
}

export function calculateTypingDelay(text: string): number {
  const baseDelay = 400; // minimum 400ms
  const maxDelay = 1500; // maximum 1.5s
  const charsPerMs = 50; // 40-70 range, using 50 as middle
  
  const calculatedDelay = Math.min(maxDelay, baseDelay + (text.length * charsPerMs));
  return calculatedDelay;
}

export function saveChatState(state: ChatState): void {
  try {
    localStorage.setItem('chatState', JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save chat state to localStorage:', error);
  }
}

export function loadChatState(): ChatState | null {
  try {
    const saved = localStorage.getItem('chatState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      parsed.messages = parsed.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      return parsed;
    }
  } catch (error) {
    console.warn('Could not load chat state from localStorage:', error);
  }
  return null;
}

export function generateWhatsAppMessage(slots: ChatState['slots']): string {
  let message = "Hola Dr. Rueda, me gustaría agendar una consulta con los siguientes datos:\n\n";
  
  if (slots.servicio) message += `• Servicio: ${slots.servicio}\n`;
  if (slots.modalidad) message += `• Modalidad: ${slots.modalidad}\n`;
  if (slots.sede && slots.modalidad === 'presencial') message += `• Sede: ${slots.sede}\n`;
  if (slots.quienes && slots.servicio === 'terapia de pareja') {
    message += `• Participantes: ${slots.quienes === 'ambos' ? 'Iremos los dos' : 'Solo iré yo'}\n`;
  }
  if (slots.fechaISO && slots.hora) message += `• Fecha y hora: ${slots.fechaISO} a las ${slots.hora}\n`;
  if (slots.nombre) message += `• Nombre: ${slots.nombre}\n`;
  if (slots.telefono) message += `• Teléfono: ${slots.telefono}\n`;
  
  message += "\nGracias por su tiempo.";
  
  return encodeURIComponent(message);
}