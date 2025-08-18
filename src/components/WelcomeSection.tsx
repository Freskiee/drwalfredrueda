import React from 'react';

const WelcomeSection: React.FC = () => (
  <section
    className="welcome-section-section py-4"
    style={{
      background: 'linear-gradient(120deg, #102542 70%, #233554 100%)', // azul profundo
      borderRadius: '1.2rem',
      boxShadow: '0 4px 24px 0 rgba(16,37,66,0.16)',
      maxWidth: 800,
      margin: '2.5rem auto',
      backdropFilter: 'blur(2px)',
      padding: '2.2rem 1.5rem',
      color: '#fff',
      fontFamily: "'Montserrat', 'Merriweather', 'Lato', sans-serif",
      letterSpacing: '.01em',
    }}
  >
    <h2
      className="fw-bold mb-3 text-center"
      style={{ 
        color: '#fff', 
        fontSize: 'clamp(1.7rem,4vw,2.25rem)', 
        letterSpacing: '.03em',
        fontFamily: "'Montserrat', 'Merriweather', 'Lato', sans-serif",
        textShadow: '0 2px 10px rgba(16,37,66,0.12)'
      }}
    >
      Bienvenido(a) a mi consulta psiquiátrica
    </h2>
    <p
      className="lead text-center mb-0"
      style={{ 
        color: '#e5e8ef', // gris claro
        fontSize: 'clamp(1.08rem,2.5vw,1.19rem)',
        fontWeight: 400,
        fontFamily: "'Lato', 'Montserrat', 'Merriweather', sans-serif",
        lineHeight: 1.7,
        letterSpacing: '.01em',
        margin: '0 auto',
        maxWidth: 650
      }}
    >
      Este es un espacio de atención científica y humana, donde tu salud mental y bienestar sexual son abordados con respeto, profesionalismo y confidencialidad. Brindo acompañamiento clínico desde la psiquiatría basada en evidencia y la terapia breve, integrando escucha activa, intervención oportuna y comprensión profunda de cada persona que consulta.
    </p>
  </section>
);

export default WelcomeSection;
