import React from "react";
import { Phone, Mail, Facebook, Instagram } from "lucide-react";

const TikTokIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  </svg>
);

import AvisoDePrivacidad from "./AvisoDePrivacidad";
import TerminosYCondiciones from "./TerminosYCondiciones";

const Footer: React.FC = () => {
  const [showAviso, setShowAviso] = React.useState(false);
  const [showTerminos, setShowTerminos] = React.useState(false);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Marca */}
          <section className="f-block">
            <h6 className="f-title">Dr. Walfred Rueda</h6>
            <p className="f-note">Psiquiatría con calidez humana y rigor científico</p>
          </section>

          {/* Legal */}
          <nav className="f-block">
            <h6 className="f-title">Legal</h6>
            <ul className="f-links">
              <li>
                <a href="#" onClick={e => { e.preventDefault(); setShowAviso(true); }}>Aviso de privacidad</a>
              </li>
              <li>
                <a href="#" onClick={e => { e.preventDefault(); setShowTerminos(true); }}>Términos y condiciones</a>
              </li>
            </ul>
          </nav>

          {/* Contacto */}
          <address className="f-block">
            <h6 className="f-title">Contacto</h6>
            <ul className="f-links">
              <li className="f-row">
                <Phone size={14} className="me-2" aria-hidden="true" />
                <a href="tel:+525591060145">55&nbsp;91&nbsp;06&nbsp;01&nbsp;45</a>
              </li>
              <li className="f-row">
                <Mail size={14} className="me-2" aria-hidden="true" />
                <a href="mailto:contacto@walfredrueda.com">contacto@walfredrueda.com</a>
              </li>
            </ul>
          </address>

          {/* Redes */}
          <section className="f-block">
            <h6 className="f-title">Redes sociales</h6>
            <div className="f-social">
              <a className="f-chip" href="#" aria-label="Facebook"><Facebook size={16} /></a>
              <a className="f-chip" href="https://www.instagram.com/drwalfredrueda/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
              <a className="f-chip" href="https://www.tiktok.com/@drwalfred" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TikTokIcon size={16} />
              </a>
            </div>
          </section>
        </div>

        <hr className="f-sep" />

        <p className="f-copy">
          © 2025 Dr. Walfred Rueda. Todos los derechos reservados.
        </p>
      </div>

      {/* Modal para Aviso de Privacidad */}
      {showAviso && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
          onClick={() => setShowAviso(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 8, boxShadow: "0 4px 32px #0003", padding: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{ float: "right", margin: 16, fontSize: 20, background: "none", border: "none", cursor: "pointer" }}
              aria-label="Cerrar"
              onClick={() => setShowAviso(false)}
            >
              &times;
            </button>
            <AvisoDePrivacidad />
          </div>
        </div>
      )}

      {/* Modal para Términos y Condiciones */}
      {showTerminos && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
          onClick={() => setShowTerminos(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 8, boxShadow: "0 4px 32px #0003", padding: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{ float: "right", margin: 16, fontSize: 20, background: "none", border: "none", cursor: "pointer" }}
              aria-label="Cerrar"
              onClick={() => setShowTerminos(false)}
            >
              &times;
            </button>
            <TerminosYCondiciones />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
