import React from 'react';
import { Heart, Brain, Users, Smile } from 'lucide-react';

interface ServicesProps {
  onOpenChat: (service?: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenChat }) => {
  const services = [
    {
      id: 'depresion',
      icon: Heart,
      title: 'Depresión',
      description: 'Acompañamiento basado en evidencia para recuperar funcionalidad.',
    },
    {
      id: 'ansiedad',
      icon: Brain,
      title: 'Ansiedad',
      description: 'Estrategias clínicas para reducir síntomas y prevenir recaídas.',
    },
    {
      id: 'disfuncion-erectil',
      icon: Smile,
      title: 'Disfunción eréctil',
      description: 'Abordaje médico y psicosexual integral, respetuoso y confidencial.',
    },
    {
      id: 'terapia-pareja',
      icon: Users,
      title: 'Terapia de pareja',
      description: 'Intervenciones focalizadas para mejorar vínculo y comunicación.',
    },
  ];

  return (
    <section id="servicios" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom mb-3">Servicios Especializados</h2>
            <p className="lead text-muted">
              Atención profesional y especializada para tu bienestar mental y sexual
            </p>
          </div>
        </div>
        
        <div className="row g-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="col-md-6 col-lg-3">
                <div 
                  className="card service-card h-100"
                  onClick={() => onOpenChat(service.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onOpenChat(service.id);
                    }
                  }}
                  aria-label={`Agendar consulta para ${service.title}`}
                >
                  <div className="card-body">
                    <IconComponent className="service-icon mb-3" />
                    <h5 className="card-title">{service.title}</h5>
                    <p className="card-text">{service.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;