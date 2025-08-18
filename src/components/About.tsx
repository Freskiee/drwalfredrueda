import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre-mi" className="py-5 bg-white">
      <div className="container">
        <div className="row align-items-center">
          {/* Imagen */}
          <div className="col-lg-6 mb-4 mb-lg-0 reveal-base reveal-left" data-reveal-delay="100">
            <img 
              src="/images/drWalter.png" 
              alt="Dr. Walfred Rueda"
              className="img-fluid rounded shadow-custom"
              loading="lazy"
            />
          </div>

          {/* Texto */}
          <div className="col-lg-6">
            <h2 className="text-primary-custom mb-4 reveal-base reveal-up">
              Sobre el Doctor
            </h2>

            <div className="mb-4 reveal-base reveal-fade" data-reveal-delay="100">
              <p className="text-muted">
                Médico Cirujano por la UNAM, con especialidad en Psiquiatría por la UNAM y el Instituto Nacional de Psiquiatría Ramón de la Fuente Muñiz (INPRFM). Maestría en Ciencias Médicas y Alta Especialidad en TOC y Neurofisiología Cognitiva en Psiquiatría (UNAM–INPRFM). Formación en Estadística por CIMAT y Terapia Cognitivo-Conductual para Trastornos de la Alimentación (Centro de Psicoterapia Cognitivo Conductual). Doctor en Sexualidad Humana (AMSSAC) y Universidad Nexum de México. Actualmente cursa la Maestría en Terapia Sexual con enfoque clínico e interdisciplinario.
              </p>
            </div>

            <div className="card shadow-custom reveal-base reveal-right" data-reveal-delay="150">
              <div className="card-body">
                <h5 className="card-title text-primary-custom">Propuesta de valor</h5>
                <p className="card-text mb-2">
                  <strong>Especialidades:</strong> Psiquiatría y Salud Sexual
                </p>
                <p className="card-text">
                  <strong>Psiquiatría con calidez humana y rigor científico:</strong> Espacio para adultos en búsqueda de salud mental y sexual. Un enfoque integral que combina la escucha empática, la comprensión humanista y los tratamientos basados en evidencia, para acompañar procesos como depresión, ansiedad, duelo, psicosis y dificultades sexuales, con respeto y profesionalismo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
