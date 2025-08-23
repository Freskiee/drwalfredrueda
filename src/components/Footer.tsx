import React from "react";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

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
                <a href="tel:+525512999642">55&nbsp;12&nbsp;99&nbsp;96&nbsp;42</a>
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
              <a className="f-chip" href="#" aria-label="Instagram"><Instagram size={16} /></a>
              <a className="f-chip" href="#" aria-label="Twitter"><Twitter size={16} /></a>
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
        <div style={{
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
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 4px 32px #0003", padding: 0, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <button style={{ float: "right", margin: 16, fontSize: 20, background: "none", border: "none", cursor: "pointer" }} aria-label="Cerrar" onClick={() => setShowAviso(false)}>&times;</button>
            <AvisoDePrivacidad />
          </div>
        </div>
      )}
      {/* Modal para Términos y Condiciones */}
      {showTerminos && (
        <div style={{
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
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 4px 32px #0003", padding: 0, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <button style={{ float: "right", margin: 16, fontSize: 20, background: "none", border: "none", cursor: "pointer" }} aria-label="Cerrar" onClick={() => setShowTerminos(false)}>&times;</button>
            <TerminosYCondiciones />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
