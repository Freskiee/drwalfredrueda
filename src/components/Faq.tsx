import React from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Atiendes solo en línea o también de forma presencial?",
    a: "Ofrezco atención tanto presencial como en línea. Las sesiones virtuales se realizan por videollamada en plataformas seguras."
  },
  {
    q: "¿En qué trastornos puedes ayudarme?",
    a: "Trabajo con adultos que enfrentan depresión, ansiedad, trastorno obsesivo-compulsivo (TOC), trastorno bipolar, psicosis y problemas relacionados con la sexualidad (como disfunción eréctil, eyaculación precoz, anorgasmia, bajo deseo, entre otros)."
  },
  {
    q: "¿El tratamiento es solo con medicamentos?",
    a: "No. Combinamos, cuando es necesario, tratamiento farmacológico con intervenciones psicoterapéuticas breves, adaptadas a tus necesidades."
  },
  {
    q: "¿Ofreces orientación en salud sexual?",
    a: "Sí. Atiendo problemáticas relacionadas con el deseo, la identidad, la orientación y la funcionalidad sexual desde un enfoque médico, ético y sin prejuicios."
  },
  {
    q: "¿Atiendes a población LGBTQ+?",
    a: "Sí. Toda persona es bienvenida, sin distinción. Se garantiza una atención inclusiva, científica y respetuosa."
  },
  {
    q: "¿Cómo agendo una cita?",
    a: "Puedes enviarme un mensaje directo desde el formulario de contacto o escribir al correo que aparece en la sección “Contacto”."
  }
];

const Faq: React.FC = () => {
  return (
    <section id="faq" className="py-5 faq-section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="text-primary-custom mb-2">Preguntas frecuentes (FAQ)</h2>
          <p className="text-muted m-0">Respuestas claras para orientarte antes de agendar</p>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-summary">
                <span className="faq-title">{item.q}</span>
                <ChevronDown size={18} className="faq-caret" aria-hidden="true" />
              </summary>

              {/* ⚠️ importante: no-reveal evita que tus utilidades oculten el bloque */}
              <div className="faq-content no-reveal">
                <p className="mb-0">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
