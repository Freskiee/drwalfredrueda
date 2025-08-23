import React, { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

interface HeroProps {
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) return; // respeta accesibilidad

    let raf = 0;

    const onScroll = () => {
      if (!sectionRef.current || !bgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Mueve la imagen en función de su posición relativa al viewport.
      // rect.top baja de 0→-altura al avanzar, así que usar -rect.top funciona bien.
      const speed = 0.45; // Más notorio
      const translate = Math.max(-120, Math.min(120, -rect.top * speed)); // clamp más amplio

      // Scale más fuerte para evitar bordes y dar más efecto
      bgRef.current.style.transform = `translateY(${translate}px) scale(1.12)`;
    };

    const loop = () => {
      onScroll();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="hero position-relative overflow-hidden"
    >
      {/* Imagen de fondo: iOS-friendly + parallax con transform */}
      <img
        ref={bgRef}
        src="/images/drWalter.png"
        alt=""
        aria-hidden="true"
        className="hero-bg"
      />

      {/* Overlay para contraste */}
      <div aria-hidden="true" className="hero-overlay" />

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="text-center px-3">
              <h1 className="hero-title mb-2">DR. WALFRED RUEDA</h1>

              <h2 className="hero-subtitle mb-3">Psiquiatría y Salud Sexual</h2>

              <p className="hero-lead mb-4">
                Psiquiatría con calidez humana y rigor científico.
              </p>

              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn hero-pill"
                  onClick={() => onOpenChat()}
                  aria-label="Abrir chat para agendar cita"
                >
                  <MessageCircle size={18} className="me-2" />
                  Abrir chat
                </button>

                <a
                  href="https://wa.me/525512999642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn hero-ghost d-inline-flex align-items-center justify-content-center"
                  aria-label="Contactar por WhatsApp al 55 1299 9642"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-2"
                    aria-hidden="true"
                  >
                    <path
                      d="M27.5 16.2c0 6.4-5.2 11.6-11.6 11.6-2.1 0-4.1-.6-5.8-1.6L6 27l.9-3c-1.2-1.8-1.9-3.9-1.9-6.1C5 11.5 10.2 6.3 16.6 6.3S27.5 9.8 27.5 16.2Z"
                      fill="#25D366"
                    />
                    <path
                      d="M22.9 19.6c-.2-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.1-.3.1-.5 0-1.5-.6-2.8-1.7-3.6-3.1-.1-.2 0-.4.1-.5.1-.1.2-.2.3-.3.1-.1.2-.3.3-.4.1-.1.1-.3 0-.4-.1-.2-.6-1.5-.8-2.1-.2-.7-.4-.6-.6-.6h-.5c-.2 0-.4.1-.6.3-.2.2-.8.7-.8 1.8s.8 2.1 1 2.4c.5.7 2.5 3.1 5.4 4.2.5.2.9.3 1.2.4.5.1 1 0 1.4-.3.4-.3.9-.6 1-1 .1-.3 0-.5-.1-.6Z"
                      fill="#fff"
                    />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
