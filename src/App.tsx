import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Credentials from './components/Credentials';
import Videos from './components/Videos';
import Locations from './components/Locations';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/Chat/ChatWidget';

import './styles/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatService, setInitialChatService] = useState<string | undefined>();

  const handleOpenChat = (service?: string) => {
    setInitialChatService(service);
    setIsChatOpen(true);
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setInitialChatService(undefined);
    }
  };

  return (
    <div className="App">
      <Topbar />
      <Navbar onOpenChat={handleOpenChat} />
      
      <main>
        <Hero onOpenChat={handleOpenChat} />
        <Services onOpenChat={handleOpenChat} />
        <About />
        <Credentials />
        <Videos />
        <Locations onOpenChat={handleOpenChat} />
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