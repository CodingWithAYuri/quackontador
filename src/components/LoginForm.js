import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// Importação removida pois não é mais necessária
import { FaUserCircle, FaLock } from 'react-icons/fa';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pega a rota de redirecionamento da localização ou usa a página inicial como padrão
  const from = location.state?.from || '/';

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulando verificação de usuário cadastrado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verifica se existe um usuário cadastrado com este email e senha
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Usuários cadastrados:', users);
      
      const user = users.find(u => {
        console.log('Comparando:', {
          emailDigitado: email.toLowerCase(),
          emailCadastrado: u.email.toLowerCase(),
          senhaDigitada: password,
          senhaCadastrada: u.password,
          emailIgual: u.email.toLowerCase() === email.toLowerCase(),
          senhaIgual: u.password === password
        });
        return u.email.toLowerCase() === email.toLowerCase() && u.password === password;
      });
      
      console.log('Usuário encontrado:', user);
      
      if (!user) {
        setError('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        setIsLoading(false);
        return;
      }
      
      // Se chegou aqui, o usuário está cadastrado e a senha está correta, então faz o login
      const data = {
        success: true,
        session: { id: Date.now().toString() },
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(data));
      
      // Redireciona sempre para a página inicial após o login
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos inline para consistência com o tema
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      color: '#fff'
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '8px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    title: {
      textAlign: 'center',
      margin: '0 0 2rem 0',
      color: '#fff',
      fontSize: '1.8rem',
      fontWeight: '500'
    },
    avatarContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      marginTop: '-4rem'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      border: '3px solid rgba(255, 255, 255, 0.2)',
      objectFit: 'cover',
      backgroundColor: 'var(--input-bg)',
      padding: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '0.8rem 1rem 0.8rem 2.5rem',
      borderRadius: '4px',
      border: '1px solid #555',
      backgroundColor: 'var(--input-bg)',
      color: '#fff',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease-in-out'
    },
    inputFocus: {
      borderColor: '#6c757d',
      boxShadow: '0 0 0 2px rgba(108, 117, 125, 0.25)',
      outline: 'none'
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#aaa'
    },
    button: {
      padding: '0.5rem 1.25rem',
      backgroundColor: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '4px',
      fontSize: '0.95rem',
      fontWeight: '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      margin: '0.75rem 0 0',
      display: 'inline-block',
      textAlign: 'center',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      width: 'auto',
      minWidth: '100px',
      boxSizing: 'border-box'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '0.5rem'
    },
    buttonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.8)'
    },
    link: {
      color: '#6c757d',
      textDecoration: 'none',
      transition: 'color 0.2s ease-in-out'
    },
    linkHover: {
      color: '#fff',
      textDecoration: 'underline'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
      textAlign: 'center'
    },
    loading: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: '#fff',
      animation: 'spin 1s ease-in-out infinite',
      marginRight: '0.5rem'
    },
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <div style={styles.avatarContainer}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/avatar.png`} 
            alt="Avatar do Usuário" 
            style={styles.avatar}
            onError={(e) => {
              console.error('Erro ao carregar a imagem:', e);
              e.target.src = `${process.env.PUBLIC_URL}/images/user.png`;
            }}
          />
        </div>
        <h1 style={styles.title}>Acesso à Conta</h1>
        
        {error && (
          <div style={styles.error}>
            {error.includes('não cadastrado') 
              ? 'Usuário não cadastrado. Por favor, faça seu cadastro primeiro.' 
              : error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ marginBottom: '1.5rem' }}>
          <div style={styles.inputGroup}>
            <FaUserCircle style={styles.icon} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="username"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoComplete="current-password"
              required
            />
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? {} : { ':hover': styles.buttonHover })
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={styles.loading}></span>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#fff' }}>Não tem uma conta? </span>
          <Link 
            to="/cadastro" 
            state={{ from: from }}
            style={{
              color: '#4dabf7',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#74c0fc'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4dabf7'}
          >
            Cadastre-se
          </Link>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;
