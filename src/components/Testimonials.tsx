import React from "react";
import { Quote } from "lucide-react";

const Testimonials: React.FC = () => {
  return (
    <section id="testimonios" className="py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2 className="text-primary-custom mb-2 reveal-base reveal-up">
              Testimonios
            </h2>
            <p className="lead text-muted reveal-base reveal-fade" data-reveal-delay="100">
              Lo que opinan mis pacientes
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {/* Testimonio 1 */}
          <div className="col-lg-6 reveal-base reveal-up" data-reveal-delay="100">
            <article className="t-card h-100">
              <div className="t-icon" aria-hidden="true">
                <Quote size={18} />
              </div>
              <blockquote className="t-quote">
                “Durante años viví con ansiedad sin saber cómo ponerle nombre.
                En esta consulta encontré un trato respetuoso, con explicaciones
                claras, tratamiento eficaz y acompañamiento psicológico breve
                pero transformador. Me sentí escuchada y por primera vez
                comprendida.”
              </blockquote>
              <footer className="t-meta">
                <span className="t-name">Mujer, 34 años</span>
                <span className="t-detail">Trastorno de ansiedad generalizada</span>
              </footer>
            </article>
          </div>

          {/* Testimonio 2 */}
          <div className="col-lg-6 reveal-base reveal-up" data-reveal-delay="160">
            <article className="t-card h-100">
              <div className="t-icon" aria-hidden="true">
                <Quote size={18} />
              </div>
              <blockquote className="t-quote">
                “Busqué orientación sobre mi vida sexual y encontré atención
                profesional, sin juicios, con una visión integral de mi salud
                emocional y sexual.”
              </blockquote>
              <footer className="t-meta">
                <span className="t-name">Hombre, 29 años</span>
                <span className="t-detail">Consulta por disfunción sexual</span>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
