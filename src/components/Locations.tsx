import React from 'react';
import { MapPin, ExternalLink, MessageCircle } from 'lucide-react';

interface LocationsProps {
  onOpenChat: () => void;
}

const Locations: React.FC<LocationsProps> = ({ onOpenChat }) => {
  const locations = [
    {
      name: 'Briyam Medical Polanco',
      address: 'Av Presidente Masaryk 134-Int. 402. Polanco, Polanco V Secc, Miguel Hidalgo',
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
      mapUrl: 'https://goo.gl/maps/example1'
    },
    {
      name: 'Briyam Medical Center Santa Fe',
      address: 'Vasco de Quiroga 3900-Torre B, Piso 5. Santa Fe, Contadero. Cuajimalpa de Morelos',
      image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=800',
      mapUrl: 'https://goo.gl/maps/example2'
    }
  ];

  return (
    <section id="ubicaciones" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom">Ubicaciones</h2>
            <p className="text-muted">Consultas presenciales en dos ubicaciones convenientes</p>
          </div>
        </div>
        
        <div className="row g-4">
          {locations.map((location, index) => (
            <div key={index} className="col-lg-6">
              <div className="card shadow-custom h-100">
                <img 
                  src={location.image}
                  className="card-img-top"
                  alt={location.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title text-primary-custom">{location.name}</h5>
                  <p className="card-text">
                    <MapPin size={16} className="me-2 text-muted" />
                    {location.address}
                  </p>
                  
                  <div className="d-flex gap-2 flex-wrap">
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      <ExternalLink size={16} className="me-2" />
                      Cómo llegar
                    </a>
                    <button 
                      className="btn btn-primary"
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
    </section>
  );
};

export default Locations;