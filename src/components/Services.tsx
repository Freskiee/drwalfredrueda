import React from 'react';

interface ServicesProps {
  onOpenChat: (service?: string) => void;
}

type Item = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

const Services: React.FC<ServicesProps> = ({ onOpenChat }) => {
  const items: Item[] = [
    {
      id: 'estado-animo',
      emoji: '🧠',
      title: 'Trastornos del estado de ánimo',
      description: 'Depresión, distimia, bipolaridad',
    },
    {
      id: 'ansiedad',
      emoji: '😰',
      title: 'Trastornos de ansiedad',
      description: 'TAG, fobias, TOC, pánico',
    },
    {
      id: 'terapia-breve',
      emoji: '🗣️',
      title: 'Terapia breve de apoyo',
      description: 'Intervención psicoterapéutica de corta duración',
    },
    {
      id: 'salud-sexual',
      emoji: '🌈',
      title: 'Salud sexual integral',
      description: 'Asesoría médica en disfunciones sexuales',
    },
    {
      id: 'farmacologica',
      emoji: '💊',
      title: 'Psiquiatría farmacológica',
      description: 'Tratamientos basados en evidencia',
    },
    {
      id: 'modalidades',
      emoji: '📡',
      title: 'Consulta presencial y en línea',
      description: 'Atención desde cualquier lugar',
    },
  ];

  return (
    <section id="servicios" className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-12 text-center mb-2">
            <h2 className="text-primary-custom reveal-base reveal-up">
              Servicios Especializados
            </h2>
          </div>
          <div className="col-12 text-center mb-4">
            <p className="lead text-muted reveal-base reveal-fade" data-reveal-delay="100">
              Atención profesional y especializada para tu bienestar mental y sexual
            </p>
          </div>
        </div>

        {/* Grid 2–3 por fila */}
        <div className="row g-3 g-sm-4">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="col-6 col-lg-4 reveal-base reveal-up"
              data-reveal-delay={100 + idx * 80}
            >
              <article
                className="card h-100 border-0 bubble-card service-clean"
                aria-label={`${it.title}: ${it.description}`}
              >
                <div className="card-body d-flex flex-column p-3 p-sm-4 text-center">
                  {/* Emoji badge */}
                  <div className="emoji-badge mb-2" aria-hidden="true">
                    <span>{it.emoji}</span>
                  </div>

                  <h5 className="mb-1">{it.title}</h5>
                  <p className="text-muted mb-3" style={{ minHeight: 40 }}>
                    {it.description}
                  </p>

                  <div className="mt-auto">
                    <button
                      type="button"
                      className="pill-btn pill-outline subtle-cta"
                      onClick={() => onOpenChat(it.id)}
                      aria-label={`Más información sobre ${it.title}`}
                    >
                      Más info
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Estilos locales suaves para no depender del hover azul agresivo */}
      <style>{`
        /* Tarjeta limpia con hover sutil */
        #servicios .service-clean {
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-color .18s ease;
          border: 1px solid rgba(15,62,87,0.06);
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #fbfdff 100%);
        }
        #servicios .service-clean:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(15,62,87,.10);
          border-color: rgba(15,62,87,0.12);
          background: linear-gradient(180deg, #ffffff 0%, #f7fbff 60%, #f3f9ff 100%);
        }

        /* Emoji dentro de burbuja suave */
        #servicios .emoji-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 6px;
          display: grid;
          place-items: center;
          font-size: 28px;
          background: linear-gradient(135deg, #eef7fb 0%, #f7fbff 100%);
          box-shadow: inset 0 6px 14px rgba(15,62,87,.06), 0 0 0 6px rgba(76, 144, 164, .06);
        }

        /* CTA pill más discreto (abre chat pero luce "Más info") */
        #servicios .subtle-cta {
          font-weight: 700;
          border-width: 2px;
          border-color: rgba(15,62,87,.22);
          color: var(--primary-color);
          background: #fff;
        }
        #servicios .subtle-cta:hover {
          border-color: rgba(15,62,87,.35);
          background: #f4f9fb;
          color: var(--secondary-color);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15,62,87,.10);
        }

        /* Ajustes responsivos */
        @media (max-width: 575.98px) {
          #servicios .card .card-body { padding: 14px; }
          #servicios .emoji-badge { width: 52px; height: 52px; font-size: 24px; }
          #servicios .subtle-cta { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Services;
