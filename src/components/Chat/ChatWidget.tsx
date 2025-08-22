import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, ChevronLeft } from 'lucide-react';

type StepKey = 'nombre' | 'area' | 'motivo' | 'modalidad' | 'sede' | 'horario' | 'resumen';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface UserData {
  nombre: string;
  edad: string;
  area: string;
  motivo: string;
  modalidad: string;
  sede: string;
  horario: string;
  sintomas: string;
}

const topicsMental = [
  'Depresión', 'Ansiedad', 'TOC', 'Psicosis', 'Duelo', 'Trastorno Bipolar', 'Otro'
];
const topicsSexual = [
  'Dificultades sexuales', 'Terapia de pareja', 'Orientación sexual',
  'Disfunción eréctil', 'Bajo deseo sexual', 'Dolor sexual', 'Otro'
];

const HORARIOS = ['Lun–Jue 16:00–20:00', 'Sáb 09:00–13:00', 'Dom 09:00–12:00'];

function uid() { return Date.now().toString() + Math.random().toString(36).slice(2); }
function typingDelay(t: string) { return Math.min(1400, 400 + t.length * 14); }

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  /** “services:ansiedad”, “services:depresion”, ids sueltos (ansiedad/estado-animo/salud-sexual),
   * “locations:polanco”, “locations:santafe”, “contact” */
  initialService?: string;
}

function normalizeContext(s?: string) {
  const key = (s || '').toLowerCase().trim();
  if (!key) return '';
  if (key.startsWith('services:') || key.startsWith('locations:') || key === 'contact') return key;

  if (key.includes('polanco')) return 'locations:polanco';
  if (key.includes('santa')) return 'locations:santafe';

  if (key.includes('ansiedad')) return 'services:ansiedad';
  if (key.includes('estado-animo') || key.includes('depres')) return 'services:depresion';
  if (key.includes('salud-sexual') || key.includes('erect')) return 'services:disfuncion-erectil';
  if (key.includes('terapia')) return 'services:terapia-pareja';
  if (key.includes('contact')) return 'contact';
  return '';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle, initialService }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const askedRef = useRef<Set<StepKey>>(new Set());
  const lockRef = useRef(false);
  const lastContextRef = useRef<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<StepKey>('nombre');
  const [history, setHistory] = useState<StepKey[]>([]);
  const [user, setUser] = useState<UserData>({
    nombre: '', edad: '', area: '', motivo: '', modalidad: '', sede: '', horario: '', sintomas: ''
  });

  // 👇 map de intros por cada card de Servicios (ids que ya usas)
const SERVICE_INTRO: Record<string, { intro: string; area?: 'Salud Mental' | 'Salud Sexual' | 'Ambas' }> = {
  'estado-animo': {
    area: 'Salud Mental',
    intro: 'Estuviste viendo trastornos del estado de ánimo. Podemos acompañarte con un enfoque profesional y cercano.',
  },
  'ansiedad': {
    area: 'Salud Mental',
    intro: 'Veo que revisabas ansiedad. Puedo orientarte y ayudarte a agendar.',
  },
  'terapia-breve': {
    area: 'Salud Mental',
    intro: 'Consultaste terapia breve de apoyo. Es un abordaje focalizado y práctico; puedo contarte cómo se trabaja.',
  },
  'salud-sexual': {
    area: 'Salud Sexual',
    intro: 'Estuviste viendo salud sexual integral. Trabajamos con absoluta confidencialidad y calidez.',
  },
  'farmacologica': {
    area: 'Ambas',
    intro: 'Revisaste psiquiatría farmacológica. El Dr. Rueda usa tratamientos basados en evidencia y seguimiento cercano.',
  },
  'modalidades': {
    intro: 'Veo que te interesan las modalidades de consulta. Podemos decidir entre en línea o presencial, lo que te acomode.',
  },
};

// Opciones inline (dentro del chat, no abajo)
const [options, setOptions] = useState<string[]>([]);
  const [showAllMotivo, setShowAllMotivo] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 560;
  const canGoBack = history.length > 0;

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const addBot = async (text: string) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, typingDelay(text)));
    setIsTyping(false);
    setMessages(prev => [...prev, { id: uid(), type: 'bot', text, timestamp: new Date() }]);
    scrollToBottom();
  };
  const addUser = (text: string) => {
    setMessages(prev => [...prev, { id: uid(), type: 'user', text, timestamp: new Date() }]);
    scrollToBottom();
  };

  const goTo = (next: StepKey) => {
    setHistory(h => [...h, step]);
    setStep(next);
  };
  const goBack = async () => {
    const h = [...history];
    const prev = h.pop();
    setHistory(h);
    if (!prev) { resetFlow(); return; }
    setStep(prev);
    setOptions([]); // limpia opciones al retroceder para re-preguntar
    askedRef.current.delete(prev);
    await ask(prev);
  };

  // ---- Preguntas + set de opciones (siempre inline)
  const ask = async (k: StepKey) => {
    if (k !== 'motivo' && askedRef.current.has(k)) return;
    askedRef.current.add(k);
    setOptions([]); // evita que queden chips viejos en pantalla

    switch (k) {
      case 'nombre':
        await addBot('¡Hola! 👋 Soy el asistente del Dr. Walfred Rueda. Me da gusto ayudarte.\n\n¿Me compartes tu nombre y edad para comenzar? 😊');
        break;

      case 'area': {
        let saludo = '¿En qué área te gustaría recibir atención?';
        if (user.nombre) {
          saludo = `Gracias, ${user.nombre}. Te recordamos que toda tu información es tratada con confidencialidad. ¿En qué área te gustaría recibir atención?`;
        }
        await addBot(saludo);
        setOptions(['Salud Mental', 'Salud Sexual', 'Ambas']);
        break;
      }

      case 'motivo': {
        if (user.area === 'Salud Mental') {
          await addBot('Sabemos que hablar de salud mental puede ser difícil. Aquí puedes expresarte con confianza y sin prejuicios.');
          setOptions(topicsMental);
        } else if (user.area === 'Salud Sexual') {
          await addBot('Entendemos que los temas de salud sexual pueden ser un tabú. No te sientas incómodo, aquí puedes hablar con total confianza.');
          let opts: string[];
          if (!isMobile || showAllMotivo) {
            opts = topicsSexual;
          } else if (topicsSexual.length > 6) {
            opts = [...topicsSexual.slice(0, 6), 'Ver más…'];
          } else {
            opts = topicsSexual;
          }
          setOptions(opts);
        } else if (user.area === 'Ambas') {
          await addBot('Tanto la salud mental como la sexual son importantes y tratadas con total confidencialidad. Elige el motivo principal de tu consulta.');
          const all = Array.from(new Set([...topicsMental, ...topicsSexual]));
          const max = isMobile && !showAllMotivo ? 6 : all.length;
          const opts = all.slice(0, max);
          setOptions(all.length > 6 && !showAllMotivo ? [...opts, 'Ver más…', 'Continuar'] : [...opts, 'Continuar']);
        } else {
          setOptions([]);
        }
        break;
      }

      case 'modalidad':
        await addBot('Entiendo. ¿Prefieres una consulta en línea o presencial?');
        setOptions(['En línea', 'Presencial']);
        break;

      case 'sede':
        await addBot('¿En cuál de nuestras sedes te gustaría recibir atención?');
        setOptions(['Polanco', 'Santa Fe', 'Indistinto']);
        break;

      case 'horario':
        await addBot('¿Qué disponibilidad te acomoda mejor?');
        setOptions([...HORARIOS]);
        break;

      case 'resumen':
        await renderSummary();
        setOptions(['Enviar por WhatsApp', 'Editar']);
        break;
    }
  };

  const renderSummary = async () => {
    const sedeTxt = user.modalidad === 'Presencial' ? (user.sede || '—') : 'N/A (en línea)';
    const summary =
`**Resumen de tu solicitud**
• Nombre: ${user.nombre} (${user.edad})
• Área: ${user.area}
• Motivo: ${user.motivo}
• Modalidad: ${user.modalidad}
• Sede: ${sedeTxt}
• Horario: ${user.horario}
• Síntomas: ${user.sintomas || '—'}

¿Deseas enviarlo por WhatsApp o editar algún dato?`;
    await addBot(summary);
  };

  const withLock = (fn: () => Promise<void> | void) => async () => {
    if (lockRef.current) return;
    lockRef.current = true;
    try { await fn(); } finally { setTimeout(() => (lockRef.current = false), 220); }
  };

  // ---- Saludo contextual + reseteo si cambias de sección
const welcome = async () => {
  const key = (initialService || '').toLowerCase().trim();

  // Desde Servicios
  if (key.startsWith('services:')) {
    const id = key.split(':')[1] || '';
    const cfg = SERVICE_INTRO[id];
    if (cfg?.area) setUser(u => ({ ...u, area: cfg.area || '' }));
    const intro = cfg?.intro || 'Puedo orientarte y ayudarte a agendar.';

    await addBot(`${intro}\n\n¿Me compartes tu nombre y edad? 😊`);
    askedRef.current.add('nombre');
    return;
  }

  // Desde Ubicaciones
  if (key.startsWith('locations:')) {
    const loc = key.split(':')[1];
    const sede = loc === 'polanco' ? 'Polanco' : loc === 'santafe' ? 'Santa Fe' : undefined;
    if (sede) setUser(u => ({ ...u, modalidad: 'Presencial', sede }));

    await addBot(
      `Hola. Noté que vienes de **Ubicaciones** (${sede ?? 'sede'}). ` +
      (sede ? `¿Te gustaría agendar en **${sede}** o prefieres en línea?\n\n` : '\n\n') +
      `Para comenzar, ¿tu nombre y edad? 😊`
    );
    askedRef.current.add('nombre');
    return;
  }

  // Desde Contacto
  if (key === 'contact') {
    await addBot(
      '¡Hola! Desde **Contacto** puedo ayudarte a coordinar tu consulta de forma sencilla.\n\n' +
      '¿Me compartes tu nombre y edad? 😊'
    );
    askedRef.current.add('nombre');
    return;
  }

  // Default (burbuja flotante)
  await addBot(
    '¡Hola! 👋 Soy el asistente del Dr. Walfred Rueda. Estoy para ayudarte a agendar o resolver dudas.\n\n' +
    '¿Me compartes tu nombre y edad? 😊'
  );
  askedRef.current.add('nombre');
};

  const startIfNeeded = async () => {
    if (messages.length === 0) {
      await welcome();
      setStep('nombre');
    }
  };

  // Reinicia flujo si cambia el origen (servicio/ubicación) mientras el chat está abierto
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      await resetFlow(false);   // limpia sin despedida
      await welcome();          // saluda según initialService
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialService]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      resetFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // ---------- handler de opciones (INSIDE chat)
  const handleOptionClick = withLock(async () => { /* wrapper; lógica abajo */ });

  const handleOption = async (label: string) => {
    const val = label.trim();

    // “Ver más…” solo expande sin eco
    if (val === 'Ver más…') {
      setShowAllMotivo(true);
      askedRef.current.delete('motivo');
      await ask('motivo');
      return;
    }

    // eco del usuario (excepto toggles de "Ambas", que se ecoean al final con “Continuar”)
    if (!(step === 'motivo' && user.area === 'Ambas' && val !== 'Continuar')) {
      addUser(val);
    }

    // Ramas
    switch (step) {
      case 'area': {
        const ok = ['Salud Mental', 'Salud Sexual', 'Ambas'].includes(val);
        if (!ok) return;
        await new Promise(resolve => setUser(u => { const next = { ...u, area: val, motivo: '' }; resolve(next); return next; }));
        setShowAllMotivo(false);
        askedRef.current.delete('motivo');
        await ask('motivo');
        break;
      }

      case 'motivo': {
        if (user.area === 'Ambas') {
          if (val === 'Continuar') {
            if (!user.motivo) { await addBot('Elige al menos una opción antes de continuar.'); return; }
            // eco final con lo elegido
            addUser(user.motivo);
            goTo('modalidad'); askedRef.current.delete('modalidad'); await ask('modalidad');
          } else {
            // toggle interno sin eco
            setUser(u => {
              const parts = u.motivo ? u.motivo.split(', ').filter(Boolean) : [];
              const has = parts.includes(val);
              const next = has ? parts.filter(x => x !== val) : [...parts, val];
              return { ...u, motivo: next.join(', ') };
            });
          }
        } else {
          setUser(u => ({ ...u, motivo: val }));
          goTo('modalidad'); askedRef.current.delete('modalidad'); await ask('modalidad');
        }
        break;
      }

      case 'modalidad': {
        if (!/^(en línea|en linea|online|presencial)$/i.test(val)) return;
        const mod = /^presencial$/i.test(val) ? 'Presencial' : 'En línea';
        setUser(u => ({ ...u, modalidad: mod, sede: mod === 'En línea' ? '' : u.sede }));
        if (mod === 'Presencial') { goTo('sede'); askedRef.current.delete('sede'); await ask('sede'); }
        else { goTo('horario'); askedRef.current.delete('horario'); await ask('horario'); }
        break;
      }

      case 'sede': {
        if (!/^(polanco|santa fe|indistinto)$/i.test(val)) return;
        const cap = val === 'indistinto' ? 'Indistinto' : val.replace(/^\w/, c => c.toUpperCase());
        setUser(u => ({ ...u, sede: cap }));
        goTo('horario'); askedRef.current.delete('horario'); await ask('horario');
        break;
      }

      case 'horario': {
        if (!HORARIOS.includes(val)) return;
        setUser(u => ({ ...u, horario: val }));
        await addBot('Gracias. Antes de confirmar, ¿podrías contarme brevemente tus síntomas o motivo? (escríbelo abajo)');
        setOptions([]); // a partir de aquí el input libre recoge síntomas
        break;
      }

      case 'resumen': {
        if (/^enviar por whatsapp$/i.test(val)) {
          const sedeTxt = user.modalidad === 'Presencial' ? (user.sede || '—') : 'N/A (en línea)';
          const m =
`Hola Dr. Rueda, me gustaría agendar una consulta.

• Nombre: ${user.nombre} (${user.edad})
• Área: ${user.area}
• Motivo: ${user.motivo}
• Modalidad: ${user.modalidad}
• Sede: ${sedeTxt}
• Horario: ${user.horario}
• Síntomas: ${user.sintomas || '—'}

Gracias.`;
          window.open(`https://wa.me/525512999642?text=${encodeURIComponent(m)}`, '_blank');
          resetFlow(true);
          return;
        }
        if (/^editar$/i.test(val)) {
          await addBot('¿Qué te gustaría editar?');
          setOptions(['Nombre y edad', 'Área', 'Motivo', 'Modalidad', 'Sede', 'Horario', 'Síntomas']);
          setStep('resumen'); // seguimos en resumen pero con contexto de edición
          return;
        }

        // clic en opción de edición
        const map: Record<string, StepKey> = {
          'Nombre y edad': 'nombre',
          'Área': 'area',
          'Motivo': 'motivo',
          'Modalidad': 'modalidad',
          'Sede': 'sede',
          'Horario': 'horario',
          'Síntomas': 'horario',
        };
        if (map[val]) { setOptions([]); setStep(map[val]); askedRef.current.delete(map[val]); await ask(map[val]); }
        break;
      }
    }
  };

  const handleSend = withLock(async () => {
    const v = input.trim();
    if (!v) return;
    addUser(v);
    setInput('');

    if (step === 'nombre') {
      const m = v.match(/([a-záéíóúñ\s]+)[,\s]+(\d{1,2})/i);
      if (!m) { await addBot('¿Me lo confirmas como “Nombre, Edad”?'); return; }
      const nombre = m[1].trim().replace(/\s+/g, ' ').replace(/^\w/, c => c.toUpperCase());
      const edad = m[2];
      setUser(u => ({ ...u, nombre, edad }));
      await addBot(`Gracias, ${nombre}. Te recordamos que toda tu información es tratada con confidencialidad. ¿En qué área te gustaría recibir atención?`);
      setStep('area');
      setOptions(['Salud Mental', 'Salud Sexual', 'Ambas']);
      return;
    }

    // síntomas (después del horario)
    if (!user.sintomas && user.horario) {
      setUser(u => ({ ...u, sintomas: v }));
      goTo('resumen'); askedRef.current.delete('resumen'); await ask('resumen');
      return;
    }

    await addBot('Gracias, continúo con las opciones de arriba.');
  });

  const resetFlow = async (afterSend = false) => {
    setMessages([]);
    setIsTyping(false);
    setInput('');
    setStep('nombre');
    setHistory([]);
    setOptions([]);
    setShowAllMotivo(false);
    askedRef.current = new Set();
    setUser({ nombre: '', edad: '', area: '', motivo: '', modalidad: '', sede: '', horario: '', sintomas: '' });
    if (messages.length === 0) {
      await welcome();
    }
    if (afterSend) lastContextRef.current = normalizeContext(initialService);
  };

  // Opciones solo en barra inferior
  const currentOptions = (() => {
    switch (step) {
      case 'area':     return ['Salud Mental', 'Salud Sexual', 'Ambas'];
      case 'motivo': {
        const base = user.area === 'Salud Mental'
          ? topicsMental
          : user.area === 'Salud Sexual'
            ? topicsSexual
            : Array.from(new Set([...topicsMental, ...topicsSexual]));
        return user.area === 'Ambas' ? [...base, 'Continuar'] : base;
      }
      case 'modalidad': return ['En línea', 'Presencial'];
      case 'sede':      return ['Polanco', 'Santa Fe', 'Indistinto'];
      case 'horario':   return HORARIOS;
      case 'resumen':   return ['Enviar por WhatsApp', 'Editar', 'Cancelar'];
      default:          return [];
    }
  })();

  // ---- UI
  if (!isOpen) {
    return (
      <button className="chat-fab" onClick={onToggle} aria-label="Abrir chat">
        <MessageCircle />
      </button>
    );
  }

  return (
    <div className="chat-widget open" role="dialog" aria-label="Chat asistente">
      <div className="chat-header">
        <div className="chat-avatar">WR</div>
        <div className="flex-grow-1">
          <div className="fw-semibold">Asistente del Dr. Walfred Rueda</div>
          <div className="small opacity-75">No compartas datos sensibles</div>
        </div>
        <button className="btn btn-sm text-white" onClick={onToggle} aria-label="Cerrar chat">
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages" aria-live="polite" aria-label="Mensajes del chat">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.type}`}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            <div className="message-time">
              {m.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {/* ❌ chips inline eliminados para evitar duplicados */}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}

        {/* OPCIONES INLINE: dentro del chat, no fuera */}
        {options.length > 0 && (
          <div
            className="chat-chips"
            style={{
              padding: '6px 10px 10px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {options.map((c, i) => {
              const selected =
                step === 'motivo' &&
                user.area === 'Ambas' &&
                c !== 'Continuar' &&
                (user.motivo ? user.motivo.split(', ').includes(c) : false);

              return (
                <button
                  key={`opt-${i}`}
                  className={`chip ${selected ? 'active' : ''}`}
                  onClick={() => handleOption(c)}
                >
                  {selected ? '✓ ' : ''}{c}
                </button>
              );
            })}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Barra inferior (Atrás + input SOLO donde aplica) */}
      <div className="chat-input-area">
        <button
          className="btn btn-outline-secondary"
          style={{ borderRadius: 24, padding: '0 12px', minWidth: 44, opacity: canGoBack ? 1 : 0.45, pointerEvents: canGoBack ? 'auto' : 'none' }}
          onClick={goBack}
          aria-label="Atrás"
          title="Atrás"
        >
          <ChevronLeft size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={
            step === 'nombre'
              ? 'Escribe tu nombre y edad…'
              : (!user.sintomas && user.horario ? 'Describe brevemente tus síntomas…' : 'Escribe tu mensaje…')
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          aria-label="Campo de mensaje"
          style={{ opacity: (step === 'nombre' || (!user.sintomas && user.horario)) ? 1 : 0.35 }}
        />

        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!(step === 'nombre' || (!user.sintomas && user.horario)) || !input.trim()}
          aria-label="Enviar mensaje"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
