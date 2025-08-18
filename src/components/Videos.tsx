import React from 'react';
import { ExternalLink } from 'lucide-react';

const Videos: React.FC = () => {
  return (
    <section id="videos" className="py-5 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom">Videos Informativos</h2>
            <p className="text-muted">Contenido educativo sobre salud mental y sexual</p>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-custom">
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/6uX_fRprN_8"
                  title="Video educativo sobre salud mental"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-custom">
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/yCw2wcaS_9w"
                  title="Video educativo sobre psiquiatría"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-custom">
              <div className="card-body text-center">
                <h5 className="card-title">Video en Facebook</h5>
                <p className="card-text text-muted">
                  Contenido adicional disponible en nuestra página de Facebook
                </p>
                <a 
                  href="https://www.facebook.com/watch/?v=399258438928709"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  <ExternalLink size={16} className="me-2" />
                  Ver en Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videos;