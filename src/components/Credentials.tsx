import React from 'react';
import { Award, BookOpen } from 'lucide-react';

const Credentials: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom">Credenciales y Formación</h2>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-custom h-100">
              <div className="card-body text-center">
                <Award className="text-primary-custom mb-3" size={48} />
                <h5 className="card-title">Cédulas</h5>
                <div className="text-muted">
                  <p className="mb-2">
                    <strong>Cédula profesional:</strong> 3238649
                  </p>
                  <p className="mb-0">
                    <strong>Cédula Especialidad:</strong> 5052179
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card shadow-custom h-100">
              <div className="card-body">
                <div className="text-center mb-3">
                  <BookOpen className="text-primary-custom mb-3" size={48} />
                  <h5 className="card-title">Formación</h5>
                </div>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2">• Médico Cirujano (UNAM)</li>
                  <li className="mb-2">• Especialidad en Psiquiatría (UNAM–INPRFM)</li>
                  <li className="mb-2">• Maestría en Ciencias Médicas (UNAM)</li>
                  <li className="mb-2">• Alta Especialidad en TOC y Neurofisiología Cognitiva (UNAM–INPRFM)</li>
                  <li className="mb-2">• Estadística (CIMAT)</li>
                  <li className="mb-2">• TCC para Trastornos de la Alimentación (CPC)</li>
                  <li className="mb-2">• Doctor en Sexualidad Humana (AMSSAC–Nexum)</li>
                  <li className="mb-0">• Cursa Maestría en Terapia Sexual</li>
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