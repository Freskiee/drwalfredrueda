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
    { id: 'estado-animo', emoji: '🧠', title: 'Trastornos del estado de ánimo', description: 'Depresión, distimia, bipolaridad' },
    { id: 'ansiedad', emoji: '😰', title: 'Trastornos de ansiedad', description: 'TAG, fobias, TOC, pánico' },
    { id: 'terapia-breve', emoji: '🗣️', title: 'Terapia breve de apoyo', description: 'Intervención psicoterapéutica de corta duración' },
    { id: 'salud-sexual', emoji: '🌈', title: 'Salud sexual integral', description: 'Asesoría médica en disfunciones sexuales' },
    { id: 'farmacologica', emoji: '💊', title: 'Psiquiatría farmacológica', description: 'Tratamientos basados en evidencia' },
    { id: 'modalidades', emoji: '📡', title: 'Consulta presencial y en línea', description: 'Atención desde cualquier lugar' },
  ];

  return (
    <section id="servicios" className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-12 text-center mb-2">
            <h2 className="text-primary-custom reveal-base reveal-up">Servicios Especializados</h2>
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
              <article className="card h-100 border-0 bubble-card service-clean" aria-label={`${it.title}: ${it.description}`}>
                <div className="card-body d-flex flex-column p-3 p-sm-4 text-center">
                  {/* Emoji badge */}
                  <div className="emoji-badge mb-2" aria-hidden="true">
                    <span>{it.emoji}</span>
                  </div>

                  <h5 className="mb-1">{it.title}</h5>
                  <p className="text-muted mb-3" style={{ minHeight: 40 }}>{it.description}</p>

                  <div className="mt-auto">
                    {/* CTA suave (MÓVIL) */}
                    <button
                      type="button"
                      className="svc-cta d-lg-none"
                      onClick={() => onOpenChat(it.id)}
                      aria-label={`Más información sobre ${it.title}`}
                    >
                      Chatear
                    </button>

                    {/* CTA ghost (DESKTOP) */}
                    <button
                      type="button"
                      className="pill-ghost d-none d-lg-inline-flex"
                      onClick={() => onOpenChat(it.id)}
                      aria-label={`Más información sobre ${it.title}`}
                    >
                      Chatear
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
