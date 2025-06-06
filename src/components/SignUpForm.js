import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { mockedLoginResponse } from '../services/ApiMock';

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pega a rota de redirecionamento da localização ou usa a página inicial como padrão
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validação em tempo real
    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'password') {
      validatePassword(value);
    } else if (name === 'repeatPassword') {
      validatePasswordMatch(formData.password, value);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const validateEmail = (email) => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'O email é obrigatório' }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'A senha é obrigatória' }));
    } else if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'A senha deve ter pelo menos 8 caracteres' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
      validatePasswordMatch(password, formData.repeatPassword);
    }
  };

  const validatePasswordMatch = (password, repeatPassword) => {
    if (password && repeatPassword && password !== repeatPassword) {
      setErrors(prev => ({ ...prev, repeatPassword: 'As senhas não conferem' }));
    } else if (repeatPassword) {
      setErrors(prev => ({ ...prev, repeatPassword: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação final antes do envio
    validateEmail(formData.email);
    validatePassword(formData.password);
    validatePasswordMatch(formData.password, formData.repeatPassword);
    
    if (Object.values(errors).some(error => error) || !formData.name || !isChecked) {
      setSubmitError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulando chamada à API de cadastro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulando login após cadastro bem-sucedido
      const data = mockedLoginResponse(formData.email, formData.name);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(data));
      
      // Redireciona para a rota original ou para a página inicial após cadastro bem-sucedido
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setSubmitError('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilos inline para consistência com o tema
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      color: '#fff'
    },
    formContainer: {
      width: '100%',
      maxWidth: '480px',
      backgroundColor: '#333',
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
      backgroundColor: '#444',
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
      backgroundColor: '#444',
      color: '#fff',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease-in-out',
      boxSizing: 'border-box'
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
      minWidth: '120px',
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
      color: '#4dabf7',
      textDecoration: 'none',
      transition: 'color 0.2s ease-in-out',
      fontWeight: '500'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85rem',
      marginTop: '0.3rem',
      minHeight: '1.2rem',
      display: 'block'
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '1rem 0',
      cursor: 'pointer'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginRight: '0.5rem',
      cursor: 'pointer'
    },
    checkboxLabel: {
      fontSize: '0.9rem',
      color: '#ddd',
      cursor: 'pointer',
      userSelect: 'none'
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
        <h1 style={styles.title}>Criar Conta</h1>
        
        {submitError && <div style={{ ...styles.error, textAlign: 'center', marginBottom: '1rem' }}>{submitError}</div>}
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              autoComplete="name"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Seu melhor e-mail"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              autoComplete="email"
              required
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              autoComplete="new-password"
              required
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="repeatPassword"
              placeholder="Confirme sua senha"
              value={formData.repeatPassword}
              onChange={handleChange}
              style={styles.input}
              autoComplete="new-password"
              required
            />
            {errors.repeatPassword && <span style={styles.error}>{errors.repeatPassword}</span>}
          </div>
          
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={styles.checkbox}
              required
            />
            <label htmlFor="termsCheckbox" style={styles.checkboxLabel}>
              Li e concordo com os <Link to="/termos-de-uso" style={styles.link}>Termos de Uso</Link> e <Link to="/politica-de-privacidade" style={styles.link}>Política de Privacidade</Link>
            </label>
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? {} : { ':hover': styles.buttonHover })
              }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={styles.loading}></span>
                  Cadastrando...
                </span>
              ) : 'Cadastrar'}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#fff' }}>
          <span>Já tem uma conta? </span>
          <Link 
            to="/login" 
            style={{
              color: '#4dabf7',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#74c0fc'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4dabf7'}
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;