import React from 'react';
import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <div className="topbar d-flex align-items-center">
      <div className="container-fluid">
        <div className="row w-100">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <a 
                href="tel:+525512999642" 
                className="d-flex align-items-center gap-1"
                aria-label="Llamar al consultorio 55 1299 9642"
              >
                <Phone size={14} />
                <span className="d-none d-sm-inline">55 1299 9642</span>
              </a>
              <a 
                href="mailto:contacto@walfredrrueda.com" 
                className="d-flex align-items-center gap-1"
                aria-label="Enviar email"
              >
                <Mail size={14} />
                <span className="d-none d-md-inline">contacto@walfredrueda.com</span>
              </a>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a href="#" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;