import React from 'react';
import { MapPin, ExternalLink, MessageCircle } from 'lucide-react';

interface LocationsProps {
  onOpenChat: () => void;
}

const Locations: React.FC<LocationsProps> = ({ onOpenChat }) => {
  const locations = [
    {
      name: 'Briyam Medical Polanco',
      address:
        'Av Presidente Masaryk 134-Int. 402. Polanco, Polanco V Secc, Miguel Hidalgo',
      image: '/images/masaryk.webp',
      mapUrl:
        'https://www.google.com/maps/place/Av.+Pdte.+Masaryk+134,+Polanco,+Polanco+V+Secc,+Miguel+Hidalgo,+11560+Ciudad+de+M%C3%A9xico,+CDMX/@19.4312613,-99.1895345,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f8ab28ff9397:0x66381ba05024771f!8m2!3d19.4312613!4d-99.1869596!16s%2Fg%2F11ydbl24rr?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Briyam Medical Center Santa Fe',
      address:
        'Vasco de Quiroga 3900-Torre B, Piso 5. Santa Fe, Contadero. Cuajimalpa de Morelos',
      image: '/images/santafe.jpg',
      mapUrl:
        'https://www.google.com/maps/place/Corporativo+Diamante+Santa+Fe,+Vasco+de+Quiroga+3900-Torre+B,+Piso+5,+Lomas+de+Santa+Fe,+Contadero,+Miguel+Hidalgo,+05348+Ciudad+de+M%C3%A9xico,+CDMX/@19.36079,-99.2812109,17z/data=!3m1!4b1!4m6!3m5!1s0x85d20734acbe7905:0x636ed8c5fe4a7968!8m2!3d19.36079!4d-99.278636!16s%2Fg%2F11m6qy0nv0?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D',
    },
  ];

  return (
    <section id="ubicaciones" className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-12 text-center mb-2">
            <h2 className="text-primary-custom reveal-base reveal-up">
              Ubicaciones
            </h2>
          </div>
          <div className="col-12 text-center mb-4">
            <p className="text-muted reveal-base reveal-fade" data-reveal-delay="100">
              Consultas presenciales en dos ubicaciones convenientes
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="col-lg-6 reveal-base reveal-up"
              data-reveal-delay={100 + index * 80}
            >
              <div className="card shadow-custom h-100 border-0 bubble-card overflow-hidden">
                {/* Imagen con overlay sutil */}
                <div className="position-relative">
                  <img
                    src={location.image}
                    className="card-img-top"
                    alt={location.name}
                    style={{ height: '220px', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div
                    aria-hidden="true"
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(15,62,87,0.00) 0%, rgba(15,62,87,0.10) 50%, rgba(15,62,87,0.18) 100%)',
                    }}
                  />
                </div>

                <div className="card-body">
                  <h5 className="card-title text-primary-custom mb-2">
                    {location.name}
                  </h5>

                  <p className="card-text d-flex align-items-start text-muted">
                    <MapPin size={16} className="me-2 mt-1" />
                    <span>{location.address}</span>
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary pill-btn pill-outline"
                    >
                      <ExternalLink size={16} className="me-2" />
                      Cómo llegar
                    </a>
                    <button
                      className="btn btn-primary pill-btn pill-primary"
                      onClick={onOpenChat}
                      aria-label="Abrir chat para agendar en esta ubicación"
                    >
                      <MessageCircle size={16} className="me-2" />
                      Abrir chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Responsive micro-ajustes solo para esta sección */}
      <style>{`
        #ubicaciones .card .card-body {
          padding: 1.25rem 1.25rem 1.5rem;
        }
        @media (max-width: 575.98px) {
          #ubicaciones .card .card-body {
            padding: 1rem 1rem 1.2rem;
          }
          #ubicaciones .card-img-top {
            height: 180px !important;
          }
          #ubicaciones .btn,
          #ubicaciones .pill-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Locations;
