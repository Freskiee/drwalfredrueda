import React from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Clock,
  CreditCard,
  Monitor,
  Banknote,
  Landmark,
  Wallet,
  Smartphone,
} from 'lucide-react';

interface ContactProps {
  onOpenChat: () => void;
}

const Contact: React.FC<ContactProps> = ({ onOpenChat }) => {
  return (
    <section
      id="contacto"
      className="py-5 position-relative"
      style={{ background: 'linear-gradient(135deg, #F6F8FA 0%, #E8F4F8 100%)' }}
    >
      {/* blobs decorativos suaves */}
      <div className="contact-blobs" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
      </div>

      <div className="container">
        {/* encabezado */}
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom mb-2">Información de Contacto</h2>
            <p className="text-muted lead m-0">
              Todo lo que necesitas saber para agendar tu consulta
            </p>
          </div>
        </div>

        {/* tarjetas “burbuja”: Modalidades / Horarios / Pagos / Contacto */}
        <div className="row g-4 mb-4">
          {/* Modalidades */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-custom h-100 border-0 bubble-card">
              <div className="card-body p-4">
                <div className="bubble-icon">
                  <Monitor strokeWidth={1.75} />
                </div>
                <h5 className="text-primary-custom text-center mb-3">Modalidades</h5>

                <ul className="contact-list">
                  <li className="contact-item">
                    <span className="dot online" />
                    <div className="label">
                      <strong>En línea</strong>
                      <small>Videoconsulta segura y privada</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="dot onsite" />
                    <div className="label">
                      <strong>Presencial</strong>
                      <small>En nuestros consultorios</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-custom h-100 border-0 bubble-card">
              <div className="card-body p-4">
                <div className="bubble-icon">
                  <Clock strokeWidth={1.75} />
                </div>
                <h5 className="text-primary-custom text-center mb-3">Horarios</h5>

                <ul className="contact-list">
                  <li className="contact-item">
                    <span className="chip chip-day">L–J</span>
                    <div className="label">
                      <strong>16:00 – 20:00</strong>
                      <small>Lunes a Jueves</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="chip chip-day">Sáb</span>
                    <div className="label">
                      <strong>9:00 – 13:00</strong>
                      <small>Sábados</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="chip chip-day">Dom</span>
                    <div className="label">
                      <strong>9:00 – 12:00</strong>
                      <small>Domingos</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pagos */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-custom h-100 border-0 bubble-card">
              <div className="card-body p-4">
                <div className="bubble-icon">
                  <CreditCard strokeWidth={1.75} />
                </div>
                <h5 className="text-primary-custom text-center mb-3">Pagos</h5>

                <ul className="contact-list">
                  <li className="contact-item">
                    <span className="icon-square">
                      <Banknote size={18} />
                    </span>
                    <div className="label">
                      <strong>Efectivo</strong>
                      <small>En consultorio</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="icon-square">
                      <CreditCard size={18} />
                    </span>
                    <div className="label">
                      <strong>Tarjeta Visa</strong>
                      <small>Con terminal</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="icon-square">
                      <Landmark size={18} />
                    </span>
                    <div className="label">
                      <strong>Transferencia</strong>
                      <small>Depósito o SPEI</small>
                    </div>
                  </li>
                  <li className="contact-item">
                    <span className="icon-square">
                      <Wallet size={18} />
                    </span>
                    <div className="label">
                      <strong>PayPal</strong>
                      <small>Pago seguro</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contacto / Acciones */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-custom h-100 border-0 bubble-card">
              <div className="card-body p-4">
                <div className="bubble-icon">
                  <Phone strokeWidth={1.75} />
                </div>
                <h5 className="text-primary-custom text-center mb-3">Contacto</h5>

                <div className="d-flex flex-column gap-2">
                  <a
                    href="tel:+525555555555"
                    className="pill-btn pill-outline d-inline-flex align-items-center justify-content-center"
                    aria-label="Llamar al consultorio"
                  >
                    <Phone size={16} className="me-2" />
                    Teléfono
                  </a>
                  <a
                    href="mailto:contacto@walfredrrueda.com"
                    className="pill-btn pill-outline d-inline-flex align-items-center justify-content-center"
                    aria-label="Enviar email"
                  >
                    <Mail size={16} className="me-2" />
                    Email
                  </a>
                  <a
                    href="https://wa.me/525555555555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn pill-outline d-inline-flex align-items-center justify-content-center"
                    aria-label="Contactar por WhatsApp"
                  >
                    <MessageSquare size={16} className="me-2" />
                    WhatsApp
                  </a>
                  <button
                    className="pill-btn pill-primary d-inline-flex align-items-center justify-content-center"
                    onClick={onOpenChat}
                    aria-label="Abrir chat para agendar"
                  >
                    <Smartphone size={16} className="me-2" />
                    Iniciar chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Franja-resumen de ubicaciones (sustituye a la card grande redundante) */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="locations-banner shadow-custom">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="chip chip-place">Polanco</span>
                <span className="text-muted small me-3">Av Presidente Masaryk 134-Int. 402</span>
                <span className="chip chip-place">Santa Fe</span>
                <span className="text-muted small">Vasco de Quiroga 3900 – Torre B, Piso 5</span>
              </div>
              <a href="#ubicaciones" className="pill-btn pill-outline ms-auto">
                Ver detalles
              </a>
            </div>
          </div>
        </div>

        {/* Aviso */}
        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning d-flex align-items-start border-0 shadow-sm rounded-3 contact-alert">
              <AlertTriangle size={20} className="me-3 text-warning flex-shrink-0" />
              <div className="small">
                <strong>Aviso importante: </strong>
                Este no es un servicio de urgencias. En caso de emergencia médica o
                psiquiátrica, llama al <strong>911</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
