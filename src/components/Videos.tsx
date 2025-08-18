import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

function YouTubeCard({
  title,
  watchUrl,
  poster,
}: {
  title: string;
  watchUrl: string;
  poster: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = new URL(watchUrl).searchParams.get("v");
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

  return (
    <div className="card shadow-custom video-card h-100">
      <div className="video-embed">
        {!playing ? (
          <button
            className="video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir: ${title}`}
            style={{ backgroundImage: `url(${poster})` }}
          >
            <span className="video-playpulse" />
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="27" cy="27" r="27" fill="rgba(0,0,0,0.45)" />
              <path d="M22 18l16 9-16 9V18z" fill="#fff" />
            </svg>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      <div className="video-caption">
        <h6 className="mb-1">{title}</h6>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="subtle-cta"
        >
          <ExternalLink size={16} className="me-2" />
          Ver en YouTube
        </a>
      </div>
    </div>
  );
}

const Videos: React.FC = () => {
  // Facebook: usar el plugin de video (iframe embebido directo)
  const fbWatch = "https://www.facebook.com/watch/?v=399258438928709";
  const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    fbWatch
  )}&show_text=false&height=315&width=560&allowfullscreen=true`;

  return (
    <section id="videos" className="py-5 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-primary-custom">Videos Informativos</h2>
            <p className="text-muted">
              Contenido educativo sobre salud mental y sexual
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* YouTube con miniatura personalizada */}
          <div className="col-lg-4 col-md-6">
            <YouTubeCard
              title="¿Cómo se diagnostica la esquizofrenia?"
              watchUrl="https://www.youtube.com/watch?v=6uX_fRprN_8"
              poster="/images/yt-video-1.png"
            />
          </div>

          <div className="col-lg-4 col-md-6">
            <YouTubeCard
              title="¿Qué es la esquizofrenia?"
              watchUrl="https://www.youtube.com/watch?v=yCw2wcaS_9w"
              poster="/images/yt-video-2.png"
            />
          </div>

          {/* Facebook directo con iframe */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-custom video-card h-100">
              <div className="video-embed">
                <iframe
                  src={fbEmbed}
                  title="Video en Facebook"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="video-caption">
                <h6 className="mb-1">Video en Facebook</h6>
                <a
                  href={fbWatch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subtle-cta"
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
