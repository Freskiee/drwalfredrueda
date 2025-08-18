import React from 'react';
import { Award, BookOpen } from 'lucide-react';

const Credentials: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container">
        {/* Título */}
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom reveal-base reveal-up">
              Credenciales y Formación
            </h2>
          </div>
        </div>

        <div className="row g-4">
          {/* Cédulas */}
          <div className="col-md-6 reveal-base reveal-up" data-reveal-delay="100">
            <div className="card shadow-custom h-100">
              <div className="card-body text-center">
                <Award className="text-primary-custom mb-3" size={48} />
                <h5 className="card-title">Cédulas</h5>
                <div className="text-muted">
                  <p className="mb-2">
                    <strong>Cédula Profesional:</strong> 3238649
                  </p>
                  <p className="mb-0">
                    <strong>Cédula Especialidad:</strong> 5052179
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formación */}
          <div className="col-md-6 reveal-base reveal-up" data-reveal-delay="150">
            <div className="card shadow-custom h-100">
              <div className="card-body">
                <div className="text-center mb-3">
                  <BookOpen className="text-primary-custom mb-3" size={48} />
                  <h5 className="card-title">Formación</h5>
                </div>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="100">• Médico Cirujano (UNAM)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="130">• Especialidad en Psiquiatría (UNAM–INPRFM)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="160">• Maestría en Ciencias Médicas (UNAM)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="190">• Alta Especialidad en TOC y Neurofisiología Cognitiva (UNAM–INPRFM)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="220">• Estadística (CIMAT)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="250">• TCC para Trastornos de la Alimentación (CPC)</li>
                  <li className="mb-2 reveal-base reveal-up" data-reveal-delay="280">• Doctor en Sexualidad Humana (AMSSAC–Nexum)</li>
                  <li className="mb-0 reveal-base reveal-up" data-reveal-delay="310">• Cursa Maestría en Terapia Sexual</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
