// ...imports
import React from 'react';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';

const TikTokIcon = ({ width = 14, height = 14, className = "" }: { width?: number; height?: number; className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
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

const Topbar: React.FC = () => {
  return (
    <div className="topbar d-flex align-items-center">
      <div className="container-fluid">
        <div className="row w-100">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <a href="tel:+525591060145" className="d-flex align-items-center gap-1" aria-label="Llamar al consultorio 55 91 06 01 45">
                <Phone size={14} />
                <span className="d-none d-sm-inline">55 91 06 01 45</span>
              </a>
              <a href="mailto:contacto@walfredrueda.com" className="d-flex align-items-center gap-1" aria-label="Enviar email">
                <Mail size={14} />
                <span className="d-none d-md-inline">contacto@walfredrueda.com</span>
              </a>
            </div>

            <div className="d-flex align-items-center gap-2">
              <a href="#" aria-label="Facebook" className="text-white">
                <Facebook size={14} />
              </a>
              <a href="https://www.instagram.com/drwalfredrueda/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white">
                <Instagram size={14} />
              </a>
              {/* 👇 Añade color explícito para que el fill herede y se vea */}
              <a href="https://www.tiktok.com/@drwalfred" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white">
                <TikTokIcon width={14} height={14} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
