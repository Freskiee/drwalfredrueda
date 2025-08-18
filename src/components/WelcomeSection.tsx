import React, { useMemo } from "react";

const WelcomeSection: React.FC = () => {
  // Array de íconos para el badge
  const icons = ["💬", "🧠", "🌈", "😌", "💡"];

  // Elegir uno aleatorio en cada render (memoizado para no cambiar en cada re-render)
  const randomIcon = useMemo(
    () => icons[Math.floor(Math.random() * icons.length)],
    []
  );

  return (
    <section className="welcome-shell py-4">
      <div className="container">
        <div
          className="welcome-card border-0 mx-auto reveal-base reveal-up"
          aria-label="Mensaje de bienvenida"
        >
          {/* Icono decorativo dinámico */}
          <div className="welcome-icon mx-auto mb-3" aria-hidden="true">
            {randomIcon}
          </div>

          <h2 className="welcome-title text-center mb-3">
            Bienvenido(a) a mi consulta psiquiátrica
          </h2>

          <p className="welcome-text text-center mb-0">
            Este es un espacio de atención científica y humana, donde tu salud
            mental y bienestar sexual son abordados con respeto, profesionalismo
            y confidencialidad. Brindo acompañamiento clínico desde la
            psiquiatría basada en evidencia y la terapia breve, integrando
            escucha activa, intervención oportuna y comprensión profunda de cada
            persona que consulta.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
