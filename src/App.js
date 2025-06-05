import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import Calculadora from './components/Calculadora';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Logout from './components/Logout';
import TermosDeUso from './components/TermosDeUso';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  return (
    <HashRouter>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}>
        <Routes>
          {/* Rotas sem cabeçalho e sem rodapé */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cadastro" element={<SignUpForm />} />
          {/* Rotas com cabeçalho e rodapé */}
          <Route path="/" element={<WithHeaderAndFooter><Main /></WithHeaderAndFooter>} />
          <Route path="/contactForm" element={<WithHeaderAndFooter><ContactForm /></WithHeaderAndFooter>} />
          <Route path="/calculos" element={<WithHeaderAndFooter><Calculadora /></WithHeaderAndFooter>} />
          <Route path="/termos-de-uso" element={<WithHeaderAndFooter><TermosDeUso /></WithHeaderAndFooter>} />
          <Route path="/politica-de-privacidade" element={<WithHeaderAndFooter><PrivacyPolicy /></WithHeaderAndFooter>} />
        </Routes>
      </div> 
    </HashRouter>  
  );
}

// Componente auxiliar para renderizar com cabeçalho e rodapé
const WithHeaderAndFooter = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default App;
