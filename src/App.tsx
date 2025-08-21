import { useEffect, useState } from 'react';
import { initReveal } from "./utils/reveal";
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WelcomeSection from './components/WelcomeSection';
import Services from './components/Services';
import About from './components/About';
import Credentials from './components/Credentials';
import Testimonials from './components/Testimonials';
import Videos from './components/Videos';
import Locations from './components/Locations';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/Chat/ChatWidget';
import Faq from './components/Faq';

import 'bootstrap/dist/css/bootstrap.min.css'; // 1) primero bootstrap
import './styles/custom.css';                  // 2) luego overrides

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatService, setInitialChatService] = useState<string | undefined>();

  // Inicializa el IntersectionObserver cuando el árbol ya está montado
  useEffect(() => {
    const cleanup = initReveal();
    return cleanup;
  }, []);

  const handleOpenChat = (service?: string) => {
    setInitialChatService(service);
    setIsChatOpen(true);
  };

  const handleToggleChat = () => {
    setIsChatOpen((prev) => {
      const next = !prev;
      if (!next) setInitialChatService(undefined);
      return next;
    });
  };

  return (
    <div className="App">
      <Topbar />
      <Navbar onOpenChat={handleOpenChat} />

      <main>
        {/* Asegúrate de que dentro de cada componente pongamos clases reveal-* */}
        <Hero onOpenChat={handleOpenChat} />
        <WelcomeSection />
        <Services onOpenChat={handleOpenChat} />
        <About />
        <Credentials />
        <Testimonials />
        <Videos />
        <Locations onOpenChat={handleOpenChat} />
        <Faq />
        <Contact onOpenChat={handleOpenChat} />
      </main>

      <Footer />

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={handleToggleChat}
        initialService={initialChatService}
      />
    </div>
  );
}

export default App;
