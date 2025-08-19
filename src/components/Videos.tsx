import React, { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

/* ---- Card YouTube con póster ---- */
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
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
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

/* ---- Sección Videos con scroll-reveal local ---- */
const Videos: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  // Reveal local para #videos (no depende de scripts globales)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-base")
    );

    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Si no quieres que se “oculte” al salir:
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Facebook: plugin embebido directo
  const fbWatch = "https://www.facebook.com/watch/?v=399258438928709";
  const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    fbWatch
  )}&show_text=false&height=315&width=560&allowfullscreen=true`;

  return (
    <section id="videos" className="py-5 bg-white" ref={rootRef}>
      <div className="container">
        <div className="row">
          <div
            className="col-12 text-center mb-5 reveal-base reveal-fade"
            data-reveal-delay="50"
          >
            <h2 className="text-primary-custom mb-2">Videos Informativos</h2>
            <p className="text-muted">
              Contenido educativo sobre salud mental y sexual
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* YouTube 1 */}
          <div
            className="col-lg-4 col-md-6 reveal-base reveal-up"
            data-reveal-delay="100"
          >
            <YouTubeCard
              title="¿Cómo se diagnostica la esquizofrenia?"
              watchUrl="https://www.youtube.com/watch?v=6uX_fRprN_8"
              poster="/images/yt-video-1.png"
            />
          </div>

          {/* YouTube 2 */}
          <div
            className="col-lg-4 col-md-6 reveal-base reveal-up"
            data-reveal-delay="180"
          >
            <YouTubeCard
              title="¿Qué es la esquizofrenia?"
              watchUrl="https://www.youtube.com/watch?v=yCw2wcaS_9w"
              poster="/images/yt-video-2.png"
            />
          </div>

          {/* Facebook embebido */}
          <div
            className="col-lg-4 col-md-6 reveal-base reveal-up"
            data-reveal-delay="260"
          >
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
