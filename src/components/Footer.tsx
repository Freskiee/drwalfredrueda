import React from 'react';
import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-primary-custom mb-3">Dr. Walfred Rueda</h6>
            <p className="small">Psiquiatría con calidez humana y rigor científico</p>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="small">Aviso de privacidad</a></li>
              <li><a href="#" className="small">Términos y condiciones</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="mb-3">Contacto</h6>
            <ul className="list-unstyled">
              <li className="small mb-2">
                <Phone size={14} className="me-2" />
                55 5555 5555
              </li>
              <li className="small">
                <Mail size={14} className="me-2" />
                contacto@walfredrrueda.com
              </li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="mb-3">Redes sociales</h6>
            <div className="d-flex gap-3">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="small text-muted mb-0">
              © 2025 Dr. Walfred Rueda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;