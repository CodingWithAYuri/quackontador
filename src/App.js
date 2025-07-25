import React, { useEffect } from 'react';
import { useUserData } from './contexts/UserDataContext';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ProtectedRoute from './components/ProtectedRoute';
import GuiaGPS from './components/GuiaGPS';
import GPSViewer from './components/GPSViewer';
import MeusDados from './components/MeusDados';
import DARF from './components/DARF';
import DARFViewer from './components/DARFViewer';

function App() {
  const { updateUserData } = useUserData();
  const hasLoadedUserData = React.useRef(false);

  // Efeito para sincronizar os dados do usuário do localStorage com o UserDataContext
  useEffect(() => {
    if (hasLoadedUserData.current) return;
    
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData?.user) {
          updateUserData({
            nome: userData.user.name || '',
            email: userData.user.email || ''
          });
        }
      }
      hasLoadedUserData.current = true;
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      hasLoadedUserData.current = true;
    }
  }, [updateUserData]);

  const appStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    }
  };

  return (
    <HashRouter>
      <div style={appStyles.container}>
        <Routes>
          {/* Rotas públicas sem cabeçalho e sem rodapé */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cadastro" element={<SignUpForm />} />
          
          {/* Rotas públicas com cabeçalho e rodapé */}
          <Route path="/" element={
            <WithHeaderAndFooter><Main /></WithHeaderAndFooter>
          } />
          <Route path="/contactForm" element={<WithHeaderAndFooter><ContactForm /></WithHeaderAndFooter>} />
          <Route path="/termos-de-uso" element={<WithHeaderAndFooter><TermosDeUso /></WithHeaderAndFooter>} />
          <Route path="/politica-de-privacidade" element={<WithHeaderAndFooter><PrivacyPolicy /></WithHeaderAndFooter>} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/calculos" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <Calculadora />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route 
            path="/guia-gps" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <GuiaGPS />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route 
            path="/darf" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <DARF />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route 
            path="/gps-viewer" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <GPSViewer key={window.location.pathname + window.location.search} />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          {/* Rota alternativa com parâmetro de cache busting */}
          <Route 
            path="/gps-viewer/:timestamp" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <GPSViewer key={window.location.pathname} />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route 
            path="/darf-viewer" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <DARFViewer key={window.location.pathname + window.location.search} />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route 
            path="/darf-viewer/:timestamp" 
            element={
              <WithHeaderAndFooter>
                <ProtectedRoute>
                  <DARFViewer key={window.location.pathname} />
                </ProtectedRoute>
              </WithHeaderAndFooter>
            } 
          />
          <Route path="/meus-dados" element={
            <WithHeaderAndFooter>
              <ProtectedRoute>
                <MeusDados />
              </ProtectedRoute>
            </WithHeaderAndFooter>
          } />
          
          {/* Rota de fallback para páginas não encontradas - deve ser a última rota */}
          <Route path="*" element={
            <WithHeaderAndFooter>
              <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>Página não encontrada</div>
            </WithHeaderAndFooter>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
