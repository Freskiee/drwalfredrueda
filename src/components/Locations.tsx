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
      image: '/images/masaryk.webp',
      mapUrl: 'https://www.google.com/maps/place/Av.+Pdte.+Masaryk+134,+Polanco,+Polanco+V+Secc,+Miguel+Hidalgo,+11560+Ciudad+de+M%C3%A9xico,+CDMX/@19.4312613,-99.1895345,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f8ab28ff9397:0x66381ba05024771f!8m2!3d19.4312613!4d-99.1869596!16s%2Fg%2F11ydbl24rr?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D'
    },
    {
      name: 'Briyam Medical Center Santa Fe',
      address: 'Vasco de Quiroga 3900-Torre B, Piso 5. Santa Fe, Contadero. Cuajimalpa de Morelos',
      image: '/images/santafe.jpg',
      mapUrl: 'https://www.google.com/maps/place/Corporativo+Diamante+Santa+Fe,+Vasco+de+Quiroga+3900-Torre+B,+Piso+5,+Lomas+de+Santa+Fe,+Contadero,+Miguel+Hidalgo,+05348+Ciudad+de+M%C3%A9xico,+CDMX/@19.36079,-99.2812109,17z/data=!3m1!4b1!4m6!3m5!1s0x85d20734acbe7905:0x636ed8c5fe4a7968!8m2!3d19.36079!4d-99.278636!16s%2Fg%2F11m6qy0nv0?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D'
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