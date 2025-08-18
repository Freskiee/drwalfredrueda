import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { 
  ChatState, 
  ChatMessage, 
  detectIntent, 
  extractSlots, 
  generateTimeSlots,
  getEmpatheticResponse,
  calculateTypingDelay,
  saveChatState,
  loadChatState,
  generateWhatsAppMessage,
  INTENTS 
} from '../../utils/chatUtils';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialService?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle, initialService }) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    currentIntent: null,
    slots: {},
    isWaitingForInput: false
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved state or initialize
    const savedState = loadChatState();
    if (savedState) {
      setState(savedState);
    } else {
      // Initialize with welcome message from bot
      setTimeout(() => {
        addBotMessage(
          "¡Hola! 👋 Soy el asistente del Dr. Walfred Rueda.\n\nEstoy aquí para ayudarte a agendar tu consulta de manera rápida y sencilla. ¿Para qué servicio te gustaría agendar?",
          ['Depresión', 'Ansiedad', 'Disfunción eréctil', 'Terapia de pareja', 'Solo información']
        );
      }, 500);
    }
  }, []);

  useEffect(() => {
    // Handle initial service selection
    if (initialService && state.messages.length > 0 && !state.slots.servicio) {
      setTimeout(() => {
        handleServiceSelection(initialService);
      }, 1500);
    }
  }, [initialService, state.messages.length]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, isTyping]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Save state whenever it changes
    saveChatState(state);
  }, [state]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage]
    }));
  };

  const addBotMessage = async (text: string, chips?: string[]): Promise<void> => {
    const delay = calculateTypingDelay(text);
    
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    
    addMessage({
      text,
      sender: 'bot',
      chips
    });
  };

  const updateSlots = (newSlots: Partial<ChatState['slots']>): void => {
    setState(prevState => ({
      ...prevState,
      slots: { ...prevState.slots, ...newSlots }
    }));
  };

  const handleServiceSelection = (service: string): void => {
    const serviceMap: { [key: string]: string } = {
      'depresion': 'depresión',
      'disfuncion-erectil': 'disfunción eréctil',
      'terapia-pareja': 'terapia de pareja',
      'ansiedad': 'ansiedad'
    };
    
    const serviceName = serviceMap[service] || service;
    updateSlots({ servicio: serviceName });
    
    addMessage({
      text: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
      sender: 'user'
    });
    
    setTimeout(() => {
      const response = getEmpatheticResponse(serviceName, 'initial');
      const chips = serviceName === 'terapia de pareja' 
        ? ['Iremos los dos', 'Solo iré yo']
        : ['En línea', 'Presencial'];
      
      addBotMessage(response, chips);
    }, 500);
  };

  const processUserMessage = async (message: string): Promise<void> => {
    const intent = detectIntent(message);
    const extractedSlots = extractSlots(message);
    
    // Handle emergency
    if (intent === INTENTS.EMERGENCIA) {
      await addBotMessage(
        "🚨 Si estás en una situación de emergencia o riesgo inmediato, por favor contacta inmediatamente:",
        ['Llamar 911', 'WhatsApp Dr. Rueda']
      );
      return;
    }

    // Update slots
    updateSlots(extractedSlots);
    const currentSlots = { ...state.slots, ...extractedSlots };

    // Handle different intents
    switch (intent) {
      case INTENTS.SALUDO:
        await addBotMessage(
          "¡Hola! 😊 Me da mucho gusto saludarte.\n\n¿En qué puedo ayudarte hoy?",
          ['Agendar consulta', 'Ver servicios', 'Información general', 'Horarios y ubicaciones']
        );
        break;

      case INTENTS.SERVICIOS:
        await addBotMessage(
          "El Dr. Walfred Rueda ofrece servicios especializados en las siguientes áreas:\n\n¿Cuál te interesa?",
          ['Depresión', 'Ansiedad', 'Disfunción eréctil', 'Terapia de pareja']
        );
        break;

      case INTENTS.AGENDAR:
        if (!currentSlots.servicio) {
          await addBotMessage(
            "Perfecto, te ayudo a agendar tu consulta. 📅\n\n¿Para qué servicio necesitas la cita?",
            ['Depresión', 'Ansiedad', 'Disfunción eréctil', 'Terapia de pareja']
          );
        } else {
          await continueBookingFlow(currentSlots);
        }
        break;

      case INTENTS.MODALIDAD:
        if (extractedSlots.modalidad) {
          await continueBookingFlow(currentSlots);
        } else {
          await addBotMessage(
            "¿Cómo te gustaría tener tu consulta?",
            ['En línea', 'Presencial']
          );
        }
        break;

      case INTENTS.SEDE:
        if (currentSlots.modalidad === 'presencial') {
          await addBotMessage(
            "Perfecto. Tenemos dos ubicaciones disponibles para consultas presenciales:\n\n¿Cuál te queda más cómoda?",
            ['Polanco', 'Santa Fe']
          );
        } else {
          await addBotMessage(
            "Para consultas en línea no necesitas elegir sede. 💻\n\n¿Te propongo algunos horarios disponibles?",
            ['Sí, ver horarios', 'Primero más información']
          );
        }
        break;

      case INTENTS.HORARIOS:
        const timeSlots = generateTimeSlots();
        await addBotMessage(
          "Estos son los próximos horarios disponibles: 🕐\n\n¿Cuál te conviene más?",
          timeSlots
        );
        break;

      case INTENTS.PAGOS:
        await addBotMessage(
          "Los métodos de pago disponibles son:\n\n💵 Efectivo\n💳 Tarjeta Visa\n🏦 Transferencia bancaria\n💰 PayPal\n\n¿Te gustaría agendar una consulta?",
          ['Sí, agendar', 'Más información', 'Ver horarios']
        );
        break;

      case INTENTS.CREDENCIALES:
        await addBotMessage(
          "📋 **Credenciales del Dr. Walfred Rueda:**\n\n• Cédula profesional: 3238649\n• Cédula de Especialidad: 5052179\n\n🎓 Médico Cirujano (UNAM), Especialista en Psiquiatría (UNAM-INPRFM), Doctor en Sexualidad Humana.\n\n¿Te gustaría agendar una consulta?",
          ['Sí, agendar', 'Ver servicios', 'Más información']
        );
        break;

      case INTENTS.CAMBIAR_DATO:
        await handleDataChange(message, currentSlots);
        break;

      case INTENTS.DESPEDIDA:
        await addBotMessage(
          "Gracias por contactarnos. 😊\n\nSi necesitas algo más, estaré aquí para ayudarte. ¡Que tengas un excelente día!"
        );
        break;

      default:
        // Try to continue booking flow or provide fallback
        if (currentSlots.servicio) {
          await continueBookingFlow(currentSlots);
        } else {
          await addBotMessage(
            "Disculpa, no estoy seguro de entender. 🤔\n\n¿En qué puedo ayudarte?",
            ['Agendar consulta', 'Ver servicios', 'Información general', 'Hablar con humano']
          );
        }
    }
  };

  const continueBookingFlow = async (slots: ChatState['slots']): Promise<void> => {
    // Check what's missing and ask for it
    if (!slots.modalidad) {
      const response = slots.servicio 
        ? getEmpatheticResponse(slots.servicio, 'followup')
        : "¿Prefieres consulta en línea o presencial?";
      
      const chips = slots.servicio === 'terapia de pareja' && !slots.quienes
        ? ['Iremos los dos', 'Solo iré yo']
        : ['En línea', 'Presencial'];
      
      await addBotMessage(response, chips);
      return;
    }

    if (slots.modalidad === 'presencial' && !slots.sede) {
      await addBotMessage(
        "¿En qué ubicación prefieres tener tu consulta presencial?",
        ['Polanco', 'Santa Fe']
      );
      return;
    }

    if (slots.servicio === 'terapia de pareja' && !slots.quienes) {
      await addBotMessage(
        "Para la terapia de pareja, ¿irían ambos a la consulta o prefieres comenzar solo/a?",
        ['Iremos los dos', 'Solo iré yo']
      );
      return;
    }

    if (!slots.fechaISO || !slots.hora) {
      const timeSlots = generateTimeSlots();
      await addBotMessage(
        "Perfecto. 👍 Estos son los próximos horarios disponibles:\n\n¿Cuál te conviene más?",
        timeSlots
      );
      return;
    }

    if (!slots.nombre) {
      await addBotMessage("Para finalizar, ¿cuál es tu nombre completo?");
      return;
    }

    if (!slots.telefono) {
      await addBotMessage("¿Y cuál es tu número de teléfono para confirmar la cita?");
      return;
    }

    // All data collected, show summary
    await showBookingSummary(slots);
  };

  const showBookingSummary = async (slots: ChatState['slots']): Promise<void> => {
    let summary = "¡Perfecto! 🎉 Aquí está el resumen de tu consulta:\n\n";
    if (slots.servicio) summary += `• Servicio: ${slots.servicio}\n`;
    if (slots.modalidad) summary += `• Modalidad: ${slots.modalidad}\n`;
    if (slots.sede && slots.modalidad === 'presencial') summary += `• Sede: ${slots.sede}\n`;
    if (slots.quienes && slots.servicio === 'terapia de pareja') {
      summary += `• Participantes: ${slots.quienes === 'ambos' ? 'Irán ambos' : 'Solo irá uno'}\n`;
    }
    if (slots.fechaISO && slots.hora) summary += `• Fecha: ${slots.fechaISO} a las ${slots.hora}\n`;
    if (slots.nombre) summary += `• Nombre: ${slots.nombre}\n`;
    if (slots.telefono) summary += `• Teléfono: ${slots.telefono}\n`;
    
    summary += "\n¿Todo está correcto?";

    await addBotMessage(summary, ['Confirmar por WhatsApp', 'Llamar', 'Modificar datos']);
  };

  const handleDataChange = async (message: string, slots: ChatState['slots']): Promise<void> => {
    const newSlots = extractSlots(message);
    updateSlots(newSlots);
    
    await addBotMessage(
      "Perfecto, he actualizado la información. ✅\n\n¿Algo más que quieras cambiar?",
      ['Continuar', 'Modificar más datos']
    );
  };

  const handleChipClick = (chip: string): void => {
    setInput(chip);
    handleSendMessage(chip);
  };

  const handleSendMessage = async (messageText?: string): Promise<void> => {
    const message = messageText || input.trim();
    if (!message) return;

    // Add user message
    addMessage({
      text: message,
      sender: 'user'
    });

    // Clear input
    if (!messageText) {
      setInput('');
    }

    // Handle special chips
    if (message === 'Llamar') {
      window.location.href = 'tel:+525512999642';
      return;
    }

    if (message === 'Confirmar por WhatsApp') {
      const whatsappMessage = generateWhatsAppMessage(state.slots);
      window.open(`https://wa.me/525512999642?text=${whatsappMessage}`, '_blank');
      
      await addBotMessage(
        "¡Excelente! 🎉 Te he redirigido a WhatsApp con todos los datos.\n\nEl Dr. Rueda te confirmará la cita muy pronto. ¡Gracias por confiar en nosotros!"
      );
      return;
    }

    // Handle service chips
    if (['Depresión', 'Ansiedad', 'Disfunción eréctil', 'Terapia de pareja'].includes(message)) {
      const serviceId = message.toLowerCase().replace('ó', 'o').replace(' ', '-');
      handleServiceSelection(serviceId);
      return;
    }

    // Handle time slot selection
    if (message.match(/^\w{3} \d{2}:\d{2}$/)) {
      const [day, time] = message.split(' ');
      updateSlots({ fechaISO: `${day}`, hora: time });
      
      await addBotMessage("¡Excelente elección! 👍\n\nAhora necesito algunos datos personales para confirmar tu cita.");
      setTimeout(() => {
        continueBookingFlow({ ...state.slots, fechaISO: day, hora: time });
      }, 500);
      return;
    }

    // Process regular message
    await processUserMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="chat-fab"
        onClick={onToggle}
        aria-label="Abrir chat"
      >
        <MessageCircle />
      </button>
    );
  }

  return (
    <div className="chat-widget open">
      <div className="chat-header">
        <div className="chat-avatar">WR</div>
        <div className="flex-grow-1">
          <div className="fw-semibold">Asistente del Dr. Walfred Rueda</div>
          <div className="small opacity-75">No compartas datos sensibles</div>
        </div>
        <button 
          className="btn btn-sm text-white"
          onClick={onToggle}
          aria-label="Cerrar chat"
        >
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages" aria-live="polite" aria-label="Mensajes del chat">
        {state.messages.map((message) => (
          <div key={message.id}>
            <div className={`message ${message.sender}`}>
              <div>{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('es-MX', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              {message.sender === 'user' && (
                <div className="text-end mt-1">
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>✓✓</span>
                </div>
              )}
            </div>
            
            {message.chips && message.chips.length > 0 && (
              <div className="chat-chips">
                {message.chips.map((chip, index) => (
                  <button
                    key={index}
                    className="chip"
                    onClick={() => handleChipClick(chip)}
                    aria-label={`Seleccionar ${chip}`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Campo de mensaje"
        />
        <button 
          className="chat-send-btn"
          onClick={() => handleSendMessage()}
          disabled={!input.trim()}
          aria-label="Enviar mensaje"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;