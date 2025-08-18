import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface HeroProps {
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  return (
    <section
  id="inicio"
  className="hero position-relative overflow-hidden"
  style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '2.5rem',
    paddingBottom: '2.5rem',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
>

      {/* Overlay para contraste sobre la imagen de fondo (no rompe tu CSS) */}
      <div
        aria-hidden="true"
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.40) 45%, rgba(15, 23, 42, 0.35) 100%)',
        }}
      />

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="hero-content py-3">
              {/* Título + subtítulo con mejor legibilidad */}
              <h1
                className="mb-1"
                style={{
                  color: 'white',
                  textShadow: '0 2px 12px rgba(0,0,0,.35)',
                  letterSpacing: '.5px',
                  fontSize: 'clamp(2.1rem,5vw,3.2rem)',
                  marginBottom: '.6rem',
                }}
              >
                DR. WALFRED RUEDA
              </h1>

              <h2
                className="mb-3"
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  textShadow: '0 2px 10px rgba(0,0,0,.25)',
                }}
              >
                Psiquiatría y Salud Sexual
              </h2>

              <p
                className="lead mb-3"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: 700,
                  margin: '0 auto',
                  fontSize: '1.1rem',
                }}
              >
                Psiquiatría con calidez humana y rigor científico.
              </p>

              {/* CTA pills con el gradiente morado y el outline */}
              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center mb-2">
                <button
                  className="btn-holo"
                  onClick={onOpenChat}
                  aria-label="Abrir chat para agendar cita"
                >
                  <span className="ico"><MessageCircle size={18} /></span>
                  Iniciar chat
                  <span className="gloss" aria-hidden="true" />
                </button>

                <a
                  href="https://wa.me/525512999642"
                  className="btn-holo d-flex align-items-center justify-content-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar por WhatsApp al 55 1299 9642"
                  style={{ fontWeight: 700, fontSize: '1.08rem', minHeight: '44px', padding: '0 1.5rem', gap: '.5rem' }}
                >
                  <span className="ico" style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#25D366"/>
                      <path d="M23.5 19.9c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1c-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.3-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6.1-.2.2-.2.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.2.1-.3-.1-.5s-.7-1.7-.9-2.3c-.2-.6-.4-.5-.6-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.7.3-.2.2-.7.7-.7 1.7s.7 2.1 1.1 2.5c.5.6 2.2 2.6 4.2 3.2.6.2 1.1.2 1.5.1.4-.1 1.3-.5 1.5-.9.2-.3.2-.6.1-.8z" fill="#fff"/>
                    </svg>
                  </span>
                  WhatsApp
                  <span className="gloss" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
