import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Send, X, ChevronLeft } from 'lucide-react';

type StepKey = 'nombre' | 'area' | 'motivo' | 'modalidad' | 'sede' | 'horario' | 'resumen' | 'editar_sintomas' | 'editar';

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

  // Persistencia de sesión
  const SESSION_KEY = 'chatDrWalfred';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<StepKey>('nombre');
const [editando, setEditando] = useState<StepKey|null>(null);
  const [history, setHistory] = useState<StepKey[]>([]);
  const [user, setUser] = useState<UserData>({
    nombre: '', edad: '', area: '', motivo: '', modalidad: '', sede: '', horario: '', sintomas: ''
  });
  const [options, setOptions] = useState<string[]>([]);
  const [showAllMotivo, setShowAllMotivo] = useState(false);

  // Guardar en sessionStorage
  useEffect(() => {
    const payload = JSON.stringify({ user, messages, step, options, showAllMotivo, history });
    sessionStorage.setItem(SESSION_KEY, payload);
  }, [user, messages, step, options, showAllMotivo, history]);

  // Restaurar de sessionStorage
  useEffect(() => {
    if (!isOpen) return;
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && (!initialService || normalizeContext(initialService) === lastContextRef.current)) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.step) setStep(parsed.step);
        if (parsed.options) setOptions(parsed.options);
        if (parsed.showAllMotivo !== undefined) setShowAllMotivo(parsed.showAllMotivo);
        if (parsed.history) setHistory(parsed.history);
      } catch { }
    }
  }, [isOpen]);

  // 👇 map de intros por cada card de Servicios (ids que ya usas)
  const SERVICE_GREETINGS: Record<string, string> = {
    'estado-animo': 'Veo que revisabas Trastornos del estado de ánimo. Puedo orientarte y ayudarte a agendar.\n¿Me compartes tu nombre y edad? 😊',
    'trastornos-ansiedad': 'Veo que revisabas Trastornos de ansiedad. Puedo orientarte y ayudarte a agendar.\n¿Me compartes tu nombre y edad? 😊',
    'terapia-breve-apoyo': 'Veo que revisabas Terapia breve de apoyo.\nPuedo orientarte y ayudarte a agendar.\n¿Me compartes tu nombre y edad? 😊',
    'salud-sexual-integral': 'Veo que revisabas Salud sexual integral.\nPuedo orientarte y ayudarte a agendar.\n¿Me compartes tu nombre y edad? 😊',
    'psiquiatria-farmacologica': 'Veo que revisabas Psiquiatría farmacológica.\nPuedo orientarte y ayudarte a agendar.\n¿Me compartes tu nombre y edad? 😊',
    'consulta-presencial-linea': '¡Hola! 👋 Soy el asistente del Dr. Walfred Rueda. Estoy para ayudarte a agendar o resolver dudas.\n\n¿Me compartes tu nombre y edad? 😊',
  };

  const SERVICE_INTRO: Record<string, { intro: string; area?: 'Salud Mental' | 'Salud Sexual' | 'Ambas' }> = {
    'estado-animo': {
      area: 'Salud Mental',
      intro: SERVICE_GREETINGS['estado-animo'],
    },
    'trastornos-ansiedad': {
      area: 'Salud Mental',
      intro: SERVICE_GREETINGS['trastornos-ansiedad'],
    },
    'terapia-breve-apoyo': {
      area: 'Salud Mental',
      intro: SERVICE_GREETINGS['terapia-breve-apoyo'],
    },
    'salud-sexual-integral': {
      area: 'Salud Sexual',
      intro: SERVICE_GREETINGS['salud-sexual-integral'],
    },
    'psiquiatria-farmacologica': {
      area: 'Ambas',
      intro: SERVICE_GREETINGS['psiquiatria-farmacologica'],
    },
    'consulta-presencial-linea': {
      intro: SERVICE_GREETINGS['consulta-presencial-linea'],
    },
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 560;
  const canGoBack = step !== 'nombre' && step !== 'resumen';

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
    if (step === 'resumen') {
      setStep('editar_sintomas');
      setOptions([]);
      await addBot('¿Cuáles son tus síntomas o motivo de consulta?');
      return;
    }
    if (history.length === 0) {
      if (step !== 'nombre') {
        setStep('nombre');
        setOptions([]);
        await ask('nombre');
      }
      return;
    }
    const h = [...history];
    const prev = h.pop();
    setHistory(h);
    if (!prev) return;
    setStep(prev);
    setOptions([]);
    await ask(prev);
  };

  // Pregunta de motivo siempre sincronizada con el área
  useEffect(() => {
    if (step === 'motivo' && user.area) {
      (async () => {
        // Mensaje solo si cambia el área o paso, no al expandir
        if (!showAllMotivo) {
          if (user.area === 'Salud Mental') await addBot('Sabemos que hablar de salud mental puede ser difícil. Aquí puedes expresarte con confianza y sin prejuicios.');
          else if (user.area === 'Salud Sexual') await addBot('Entendemos que los temas de salud sexual pueden ser un tabú. No te sientas incómodo, aquí puedes hablar con total confianza.');
          else if (user.area === 'Ambas') {
            await addBot('Puedes seleccionar todos los motivos que apliquen y luego presionar ENVIAR.');
          }
        }
        // Opciones de motivos siempre actualizadas
        const arr = user.area === 'Salud Mental'
          ? topicsMental
          : user.area === 'Salud Sexual'
            ? topicsSexual
            : Array.from(new Set([...topicsMental, ...topicsSexual]));
        const opts = (showAllMotivo || arr.length <= 3)
          ? arr
          : [...arr.slice(0, 3), `__VER_MAS__(${arr.length - 3})`];
        setOptions(opts);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllMotivo, step, user.area]);

  // ---- Preguntas + set de opciones (siempre inline)
  const ask = async (k: StepKey) => {
    setOptions([]);
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
        // Helper para chips
        const renderMotivoOptions = (arr: string[]) => {
          if (showAllMotivo || arr.length <= 3) return arr;
          const n = arr.length - 3;
          return [...arr.slice(0, 3), `__VER_MAS__(${n})`];
        };
        if (user.area === 'Salud Mental') {
          await addBot('Sabemos que hablar de salud mental puede ser difícil. Aquí puedes expresarte con confianza y sin prejuicios.');
          setOptions(renderMotivoOptions(topicsMental));
        } else if (user.area === 'Salud Sexual') {
          await addBot('Entendemos que los temas de salud sexual pueden ser un tabú. No te sientas incómodo, aquí puedes hablar con total confianza.');
          setOptions(renderMotivoOptions(topicsSexual));
        } else if (user.area === 'Ambas') {
          await addBot('Tanto la salud mental como la sexual son importantes y tratadas con total confidencialidad. Elige el motivo principal de tu consulta.');
          const all = Array.from(new Set([...topicsMental, ...topicsSexual]));
          setOptions(renderMotivoOptions(all));
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
        setOptions(['Enviar por WhatsApp', 'Comenzar de nuevo']);
        break;
      case 'editar':
        await addBot('¿Qué deseas editar?');
        setOptions([
          'Nombre y edad',
          'Área',
          'Motivo',
          'Modalidad',
          'Sede',
          'Horario',
          'Síntomas',
          'Cancelar'
        ]);
        break;
    }
  };

  const renderSummary = async () => {
    const sedeTxt = user.modalidad === 'Presencial' ? (user.sede || '—') : 'N/A (en línea)';
    const sintomasTxt = user.sintomas && user.sintomas.trim() ? user.sintomas : '—';
    const summary =
      `**Resumen de tu solicitud**
• Nombre: ${user.nombre} (${user.edad})
• Área: ${user.area}
• Motivo: ${user.motivo}
• Modalidad: ${user.modalidad}
• Sede: ${sedeTxt}
• Horario: ${user.horario}
• Síntomas: ${sintomasTxt}

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
      // Alias para ids alternativos de cards
      const idAliases: Record<string, string> = {
        'ansiedad': 'trastornos-ansiedad',
        'trastornos-ansiedad': 'trastornos-ansiedad',
        'depresion': 'estado-animo',
        'estado-animo': 'estado-animo',
        'disfuncion-erectil': 'salud-sexual-integral',
        'salud-sexual': 'salud-sexual-integral',
        'salud-sexual-integral': 'salud-sexual-integral',
        'terapia-breve': 'terapia-breve-apoyo',
        'terapia_breve': 'terapia-breve-apoyo',
        'terapia breve': 'terapia-breve-apoyo',
        'terapia-breve-apoyo': 'terapia-breve-apoyo',
        'farmacologica': 'psiquiatria-farmacologica',
        'psiquiatria-farmacologica': 'psiquiatria-farmacologica',
        'modalidades': 'consulta-presencial-linea',
        'consulta-presencial-linea': 'consulta-presencial-linea',
        'contact': 'consulta-presencial-linea'
      };

      const normalizedId = (id.replace(/_/g, '-').toLowerCase());
      const finalId = idAliases[normalizedId] || normalizedId;
      // console.log('DEBUG: initialService:', initialService, 'id:', id, 'normalizedId:', normalizedId, 'finalId:', finalId);
      if (SERVICE_INTRO[finalId]?.area) setUser(u => ({ ...u, area: SERVICE_INTRO[finalId]?.area || '' }));
      if (SERVICE_GREETINGS[finalId]) {
        await addBot(SERVICE_GREETINGS[finalId]);
      } else {
        await addBot(`ERROR: id de servicio no reconocido (${finalId}). Contacta a soporte para agregarlo.`);
      }
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
        '¡Hola! 👋 Soy el asistente del Dr. Walfred Rueda. Estoy para ayudarte a agendar o resolver dudas.\n\n' +
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
      await resetFlow(false, false);   // limpia y SIEMPRE saluda según initialService
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialService]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !initialService) {
      resetFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Mostrar el resumen actualizado solo cuando step cambia a 'resumen'
  const resumenMostradoRef = useRef(false);
  useEffect(() => {
    if (step === 'resumen') {
      if (!resumenMostradoRef.current) {
        ask('resumen');
        resumenMostradoRef.current = true;
      }
    } else {
      resumenMostradoRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ---------- handler de opciones (INSIDE chat)
  const handleOptionClick = withLock(async () => { /* wrapper; lógica abajo */ });

  const handleOption = async (label: string) => {
  // Edición parcial desde el resumen
  if (step === 'resumen' && label === 'Comenzar de nuevo') {
    addUser('Comenzar de nuevo');
    await resetFlow();
    return;
  }
  if (step === 'resumen' && label === 'Editar') {
    addUser('Editar');
    setStep('editar');
    return await ask('editar');
  }
  if (step === 'editar') {
    if (label === 'Cancelar') {
      setStep('resumen');
      setEditando(null);
      return;
    }
    // Mapeo de opciones a StepKey
    const map: Record<string, StepKey> = {
      'Nombre y edad': 'nombre',
      'Área': 'area',
      'Motivo': 'motivo',
      'Modalidad': 'modalidad',
      'Sede': 'sede',
      'Horario': 'horario',
      'Síntomas': 'editar_sintomas',
    };
    const next = map[label];
    if (next) {
      addUser(label);
      setEditando(next);
      setStep(next);
      askedRef.current.delete(next);
      // Limpiar flags de estado relacionados
      if (next === 'motivo') setShowAllMotivo(false);
      if (next === 'modalidad') setUser(u => ({ ...u, sede: '', modalidad: '' }));
      if (next === 'sede') setUser(u => ({ ...u, sede: '' }));
      return await ask(next);
    }
  }

    const val = label.trim();

    // 'Ver más' solo expande sin eco ni mensaje
    if (val === 'VER_MAS') {
      setShowAllMotivo(true);
      return;
    }

    // Si es motivo y área 'Ambas', solo actualiza selección, input y user.motivo
    if (step === 'motivo' && user.area === 'Ambas') {
      setUser(u => {
        const parts = u.motivo ? u.motivo.split(', ').filter(Boolean) : [];
        const has = parts.includes(val);
        const next = has ? parts.filter(x => x !== val) : [...parts, val];
        setInput(next.join(', '));
        return { ...u, motivo: next.join(', ') };
      });
      return;
    }

    // eco del usuario para otros casos
    addUser(val);
    setOptions([]); // Oculta inmediatamente las opciones

    // Ramas
    switch (step) {
      case 'area': {
        const ok = ['Salud Mental', 'Salud Sexual', 'Ambas'].includes(val);
        if (!ok) return;
        setShowAllMotivo(false);
        await new Promise(resolve => setUser(u => { const next = { ...u, area: val, motivo: '' }; resolve(next); return next; }));
        if (editando === 'area') {
          setStep('motivo');
          askedRef.current.delete('motivo');
          // Mensaje correcto según área seleccionada
          if (val === 'Salud Mental') {
            await addBot('Sabemos que hablar de salud mental puede ser difícil. Aquí puedes expresarte con confianza y sin prejuicios.');
            setOptions(topicsMental);
          } else if (val === 'Salud Sexual') {
            await addBot('Entendemos que los temas de salud sexual pueden ser un tabú. No te sientas incómodo, aquí puedes hablar con total confianza.');
            setOptions(topicsSexual);
          } else if (val === 'Ambas') {
            await addBot('Tanto la salud mental como la sexual son importantes y tratadas con total confidencialidad. Elige el motivo principal de tu consulta.');
            const all = Array.from(new Set([...topicsMental, ...topicsSexual]));
            setOptions(all);
          }
        } else {
          goTo('motivo');
        }
        break;
      }

      case 'motivo': {
        if (editando === 'area' || editando === 'motivo') {
          setUser(u => ({ ...u, motivo: val }));
          setEditando(null);
          setStep('resumen');
          setOptions([]);
        } else if (user.area === 'Ambas') {
          // No acción aquí, el input y el envío lo maneja el usuario
        } else {
          setUser(u => ({ ...u, motivo: val }));
          setStep('modalidad');
          askedRef.current.delete('modalidad');
          await ask('modalidad');
        }
        break;
      }

      case 'modalidad': {
        if (!/^(en línea|en linea|online|presencial)$/i.test(val)) return;
        const mod = /^presencial$/i.test(val) ? 'Presencial' : 'En línea';
        setUser(u => ({ ...u, modalidad: mod, sede: mod === 'En línea' ? '' : (u.sede || '') }));
        if (editando === 'modalidad') {
          setEditando(null);
          setStep('resumen');
          setOptions([]);
        } else if (mod === 'Presencial') {
          goTo('sede');
          askedRef.current.delete('sede');
          await ask('sede');
        } else {
          setUser(u => ({ ...u, sede: '' }));
          goTo('horario');
          askedRef.current.delete('horario');
          await ask('horario');
        }
        break;
      }

      case 'sede': {
        if (!/^(polanco|santa fe|indistinto)$/i.test(val)) return;
        const cap = val === 'indistinto' ? 'Indistinto' : val.replace(/^\w/, c => c.toUpperCase());
        setUser(u => ({ ...u, sede: cap }));
        if (editando === 'sede') {
          setEditando(null);
          setStep('resumen');
          setOptions([]);
        } else {
          goTo('horario');
          askedRef.current.delete('horario');
          await ask('horario');
        }
        break;
      }

      case 'horario': {
        if (!HORARIOS.includes(val)) return;
        setUser(u => ({ ...u, horario: val, sintomas: '' }));
        if (editando === 'horario') {
          setEditando(null);
          setStep('resumen');
          setOptions([]);
        } else {
          await addBot('Gracias. Antes de confirmar, ¿podrías contarme brevemente tus síntomas o motivo? (escríbelo abajo)');
          setOptions([]);
        }
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
          onToggle();
          return;
        }
        if (/^editar$/i.test(val)) {
          await addBot('¿Qué te gustaría editar?');
          setOptions(['Nombre y edad', 'Área', 'Motivo', 'Modalidad', 'Sede', 'Horario', 'Síntomas']);
          setStep('resumen'); // seguimos en resumen pero con contexto de edición
          return;
        }

        // clic en opción de edición
        const map: Record<string, StepKey | 'editar_sintomas'> = {
          'Nombre y edad': 'nombre',
          'Área': 'area',
          'Motivo': 'motivo',
          'Modalidad': 'modalidad',
          'Sede': 'sede',
          'Horario': 'horario',
          'Síntomas': 'editar_sintomas',
        };
        if (map[val]) {
          setOptions([]);
          if (map[val] === 'editar_sintomas') {
            setInput(user.sintomas || '');
            await addBot('¿Cuáles son tus síntomas o motivo de consulta?');
            setStep('editar_sintomas');
            setOptions([]);
          } else {
            setStep(map[val] as StepKey);
            askedRef.current.delete(map[val] as StepKey);
            // Limpiar flags de estado relacionados
            if (map[val] === 'motivo') setShowAllMotivo(false);
            if (map[val] === 'modalidad') setUser(u => ({ ...u, sede: '', modalidad: '' }));
            if (map[val] === 'sede') setUser(u => ({ ...u, sede: '' }));
            await ask(map[val] as StepKey);
          }
        }
        break;
      }
    }
  };

  const handleSend = withLock(async () => {
  // Si estamos editando solo una sección
  if (editando && step === editando) {
    // Procesa el input normalmente, luego vuelve a resumen
    const v = input.trim();
    if (!v) return;
    addUser(v);
    setInput('');
    switch (editando) {
      case 'nombre': {
        const [nombre, edad] = v.split(/\s*,\s*|\s+/);
        setUser(u => ({ ...u, nombre: nombre || '', edad: edad || '' }));
        break;
      }
      case 'area': setUser(u => ({ ...u, area: v })); break;
      case 'motivo': setUser(u => ({ ...u, motivo: v })); break;
      case 'modalidad': setUser(u => ({ ...u, modalidad: v })); break;
      case 'sede': setUser(u => ({ ...u, sede: v })); break;
      case 'horario': setUser(u => ({ ...u, horario: v })); break;
      case 'editar_sintomas': setUser(u => ({ ...u, sintomas: v })); break;
    }
    setEditando(null);
    setStep('resumen');
    // No llamar a ask('resumen') aquí, solo desde useEffect
    return;

  }

    const v = input.trim();
    if (!v) return;

    if (step === 'motivo' && user.area === 'Ambas') {
      setUser(u => ({ ...u, motivo: v }));
      addUser(v);
      setInput('');
      goTo('modalidad'); askedRef.current.delete('modalidad'); await ask('modalidad');
      return;
    }

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

    // síntomas (después del horario, resumen o editar_sintomas)
    if (step === 'horario' || step === 'resumen' || step === 'editar_sintomas') {
      // Solo actualiza síntomas y pasa a resumen, el useEffect mostrará el resumen actualizado
      await new Promise(resolve => setUser(u => { setTimeout(resolve, 0); return { ...u, sintomas: v }; }));
      setStep('resumen');
      setOptions([]);
      return;
    }

    await addBot('Gracias, continúo con las opciones de arriba.');
  });

  const resetFlow = async (afterSend = false, skipWelcome = false) => {
    setMessages([]);
    setIsTyping(false);
    await Promise.resolve();
    setInput('');
    setStep('nombre');
    setHistory([]);
    setOptions([]);
    setShowAllMotivo(false);
    askedRef.current = new Set();
    setUser({ nombre: '', edad: '', area: '', motivo: '', modalidad: '', sede: '', horario: '', sintomas: '' });
    if (!skipWelcome) {
      await welcome();
    }
    if (afterSend) lastContextRef.current = normalizeContext(initialService);
  };

  // Opciones solo en barra inferior
  const currentOptions = (() => {
    switch (step) {
      case 'area': return ['Salud Mental', 'Salud Sexual', 'Ambas'];
      case 'motivo': {
        const base = user.area === 'Salud Mental'
          ? topicsMental
          : user.area === 'Salud Sexual'
            ? topicsSexual
            : Array.from(new Set([...topicsMental, ...topicsSexual]));
        return base; // Ya no hay botón 'Continuar' para 'Ambas'
      }
      case 'modalidad': return ['En línea', 'Presencial'];
      case 'sede': return ['Polanco', 'Santa Fe', 'Indistinto'];
      case 'horario': return HORARIOS;
      case 'resumen': return ['Enviar por WhatsApp', 'Editar', 'Cancelar'];
      default: return [];
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
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {m.type === 'bot' ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
            <div className="message-time">
              <span className="chat-time">
                {(() => {
                  let ts = m.timestamp;
                  if (!(ts instanceof Date)) ts = new Date(ts);
                  return ts.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                })()}
              </span>
              <span className="double-check" aria-label="Entregado">
                <svg width="20" height="16" viewBox="0 0 30 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                  <polyline points="2 14 9 21 23 7" />
                  <polyline points="7 14 14 21 27 7" />
                </svg>
              </span>
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
              if (c.startsWith('__VER_MAS__')) {
                // Chip especial para ver más
                return (
                  <button
                    key={`opt-more`}
                    className="chip chip-more"
                    onClick={() => handleOption('VER_MAS')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.98em', letterSpacing: '0.01em' }}>Ver más</span>
                    <span className="chip-more__arrow">&#8594;</span>
                  </button>
                );
              }
              const selected =
                step === 'motivo' &&
                user.area === 'Ambas' &&
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
          className="btn btn-link p-0 me-2"
          tabIndex={0}
          aria-label="Regresar"
          onClick={withLock(goBack)}
          style={{
            display: canGoBack ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
            border: 'none',
            padding: 0,
            marginRight: 12,
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}
        >
          <ChevronLeft size={28} color="#1976d2" style={{ display: 'block' }} />
        </button>

        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={
            step === 'nombre'
              ? 'Escribe tu nombre y edad…'
              : (step === 'motivo' && user.area === 'Ambas')
                ? 'Selecciona y luego envía tus motivos…'
                : (step === 'horario' && !user.sintomas)
                  ? 'Describe brevemente tus síntomas…'
                  : (step === 'editar_sintomas')
                    ? 'Edita tus síntomas…'
                    : ''
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          aria-label="Campo de mensaje"
          style={{ opacity: (step === 'nombre' || (step === 'motivo' && user.area === 'Ambas') || (step === 'horario' && !user.sintomas) || step === 'editar_sintomas') ? 1 : 0.35 }}
          disabled={!(step === 'nombre' || (step === 'motivo' && user.area === 'Ambas') || step === 'horario' || step === 'editar_sintomas')}
        />

        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={
            !(
              (step === 'nombre' && input.trim()) ||
              (step === 'motivo' && user.area === 'Ambas' && input.trim()) ||
              (step === 'horario' && input.trim()) ||
              (step === 'resumen' && input.trim()) ||
              (step === 'editar_sintomas' && input.trim() && input.trim() !== user.sintomas.trim()) ||
              (typeof editando !== 'undefined' && editando === 'editar_sintomas' && step === 'editar_sintomas' && input.trim() && input.trim() !== user.sintomas.trim())
            )
          }
          aria-label="Enviar mensaje"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
