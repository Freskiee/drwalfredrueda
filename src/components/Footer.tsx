import React from "react";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
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
              <li><a href="#">Aviso de privacidad</a></li>
              <li><a href="#">Términos y condiciones</a></li>
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
    </footer>
  );
};

export default Footer;
