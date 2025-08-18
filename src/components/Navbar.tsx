import React, { useState } from 'react';
import { Stethoscope, X } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Sobre mí', href: '#sobre-mi' },
    { name: 'Videos', href: '#videos' },
    { name: 'Ubicaciones', href: '#ubicaciones' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          <a className="navbar-brand" href="#inicio">
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>WALFRED RUEDA</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#6C757D' }}>
                Psiquiatría y Salud Sexual
              </div>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="navbar-nav ms-auto d-none d-lg-flex flex-row gap-3">
            {navItems.map((item) => (
              <a key={item.name} className="nav-link" href={item.href}>
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger d-lg-none ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu d-lg-none ${isMenuOpen ? 'show' : ''}`}>
        <div className="text-center mb-4">
          <Stethoscope size={48} className="text-primary-custom mb-3" />
        </div>
        
        <nav className="text-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              className="nav-link d-block"
              href={item.href}
              onClick={closeMenu}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <button
          className="btn position-absolute top-0 end-0 m-4"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        >
          <X size={24} className="text-primary-custom" />
        </button>
      </div>
    </>
  );
};

export default Navbar;