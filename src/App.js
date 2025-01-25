import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import Calculadora from './components/Calculadora';
import CoverContainer from './components/CoverContainer'; 
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Logout from './components/Logout';

function App() {
  return (
    <HashRouter>
      <CoverContainer style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> 
        <Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Rotas sem cabeçalho e sem rodapé */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cadastro" element={<SignUpForm />} />
            {/* Rotas com cabeçalho e rodapé */}
            <Route path="/" element={<WithHeaderAndFooter><Main /></WithHeaderAndFooter>} />
            <Route path="/contactForm" element={<WithHeaderAndFooter><ContactForm /></WithHeaderAndFooter>} />
            <Route path="/calculos" element={<WithHeaderAndFooter><Calculadora /></WithHeaderAndFooter>} />
          </Routes>
        </Container>
      </CoverContainer> 
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
