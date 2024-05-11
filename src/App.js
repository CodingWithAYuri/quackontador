import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import Calculos from './components/Calculos';
import CoverContainer from './components/CoverContainer'; 
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Logout from './components/Logout';


function App() {
  return (
    <Router>
      <CoverContainer style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> 
        <Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Rota sem cabeçalho */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cadastro" element={<SignUpForm />} />
            {/* Rotas com cabeçalho */}
            <Route path="/" element={<WithHeader><Main /></WithHeader>} />
            <Route path="/contactForm" element={<WithHeader><ContactForm /></WithHeader>} />
            <Route path="/calculos" element={<WithHeader><Calculos /></WithHeader>} />
          </Routes>
          <Footer />
        </Container>
      </CoverContainer> 
    </Router>  
  );
}

// Componente auxiliar para renderizar com cabeçalho
const WithHeader = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

export default App;
