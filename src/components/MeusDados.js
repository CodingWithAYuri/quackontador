import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaIdCard, FaArrowLeft, FaSave, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const MeusDados = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cpf: '',
    dataNascimento: '',
    nit: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para o formulário de mudança de senha
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Carrega os dados salvos ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem('userGPSData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Valida a força da senha
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    }
    return errors;
  };

  // Manipula a mudança nos campos de senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erros ao digitar
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Alterna a visibilidade da senha
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Envia o formulário de dados pessoais
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.cpf || !formData.dataNascimento || !formData.nit) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    // Valida CPF
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido');
      setLoading(false);
      return;
    }

    // Valida data de nascimento
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.dataNascimento)) {
      setError('Formato de data inválido. Use DD/MM/AAAA');
      setLoading(false);
      return;
    }

    // Salva os dados no localStorage
    try {
      localStorage.setItem('userGPSData', JSON.stringify(formData));
      setSuccess('Dados salvos com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar os dados. Tente novamente.');
      console.error('Erro ao salvar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Envia o formulário de alteração de senha
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação dos campos
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Senha atual é obrigatória';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else {
      const passwordErrors = validatePassword(passwordData.newPassword);
      if (passwordErrors.length > 0) {
        errors.newPassword = passwordErrors[0]; // Mostra apenas o primeiro erro
      }
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'As senhas não conferem';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Busca o usuário atual
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        throw new Error('Usuário não autenticado');
      }
      
      // Busca a lista de usuários
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Encontra o usuário atual na lista
      const userIndex = users.findIndex(u => u.email === userData.user.email);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }
      
      // Atualiza a senha do usuário
      users[userIndex].password = passwordData.newPassword;
      
      // Salva a lista de usuários atualizada
      localStorage.setItem('users', JSON.stringify(users));
      
      setSuccess('Senha alterada com sucesso! Redirecionando...');
      
      // Limpa os dados do formulário
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Limpa os dados de autenticação do localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      // Redireciona para a página de login após um pequeno atraso
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      setError('Erro ao alterar a senha. Verifique se a senha atual está correta.');
      console.error('Erro ao alterar senha:', err);
      setLoading(false);
    }
  };

  // Formata CPF
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Formata NIT/PIS/PASEP
  const formatNIT = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{5})(\d)/, '$1.$2')
      .replace(/(\d{5}\d{1,2})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  // Formata data
  const formatDate = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  };

  // Manipuladores de mudança com formatação
  const handleCPFChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cpf: formatCPF(value)
    }));
  };

  const handleNITChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      nit: formatNIT(value)
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      dataNascimento: formatDate(value)
    }));
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
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4dabf7',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      marginTop: '0.5rem',
      display: 'inline-block',
      textAlign: 'center',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      width: '100%',
      boxSizing: 'border-box'
    },
    buttonHover: {
      backgroundColor: '#339af0',
      transform: 'translateY(-1px)'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85rem',
      marginTop: '0.3rem',
      minHeight: '1.2rem',
      display: 'block'
    },
    success: {
      color: '#51cf66',
      fontSize: '0.85rem',
      marginTop: '0.3rem',
      minHeight: '1.2rem',
      display: 'block',
      textAlign: 'center',
      marginBottom: '1rem'
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
    backLink: {
      display: 'flex',
      alignItems: 'center',
      color: '#4dabf7',
      textDecoration: 'none',
      marginBottom: '1rem',
      fontSize: '0.95rem',
      cursor: 'pointer',
      '&:hover': {
        color: '#339af0',
        textDecoration: 'underline'
      }
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '500',
      color: '#fff',
      margin: '2rem 0 1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #444'
    },
    togglePasswordBtn: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#aaa',
      cursor: 'pointer',
      padding: '0.5rem'
    },
    changePasswordBtn: {
      background: 'none',
      border: 'none',
      color: '#4dabf7',
      cursor: 'pointer',
      fontSize: '0.9rem',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <Link 
          to="/" 
          style={styles.backLink}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Voltar
        </Link>
        
        <h1 style={styles.title}>Meus Dados</h1>
        
        {error && <div style={{ ...styles.error, textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="cpf"
              placeholder="CPF (000.000.000-00)"
              value={formData.cpf}
              onChange={handleCPFChange}
              style={styles.input}
              maxLength="14"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <FaCalendarAlt style={styles.icon} />
            <input
              type="text"
              name="dataNascimento"
              placeholder="Data de Nascimento (DD/MM/AAAA)"
              value={formData.dataNascimento}
              onChange={handleDateChange}
              style={styles.input}
              maxLength="10"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <FaIdCard style={styles.icon} />
            <input
              type="text"
              name="nit"
              placeholder="NIT/PIS/PASEP (000.00000.00-0)"
              value={formData.nit}
              onChange={handleNITChange}
              style={styles.input}
              maxLength="14"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? {} : { ':hover': styles.buttonHover }),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <span style={styles.loading}></span>
                Salvando...
              </>
            ) : (
              <>
                <FaSave />
                Salvar Dados
              </>
            )}
          </button>
        </form>
        
        {/* Seção de Alteração de Senha */}
        <div>
          <button 
            onClick={() => setShowChangePassword(!showChangePassword)}
            style={styles.changePasswordBtn}
          >
            <FaLock /> {showChangePassword ? 'Ocultar alteração de senha' : 'Alterar senha'}
          </button>
          
          {showChangePassword && (
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1.5rem' }}>
              <h3 style={styles.sectionTitle}>Alterar Senha</h3>
              
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Senha atual"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('current')}
                  style={styles.togglePasswordBtn}
                  aria-label={showPassword.current ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.currentPassword && (
                  <div style={styles.error}>{passwordErrors.currentPassword}</div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Nova senha"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('new')}
                  style={styles.togglePasswordBtn}
                  aria-label={showPassword.new ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.newPassword && (
                  <div style={styles.error}>{passwordErrors.newPassword}</div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.5rem' }}>
                  A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirme a nova senha"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={styles.togglePasswordBtn}
                  aria-label={showPassword.confirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.confirmPassword && (
                  <div style={styles.error}>{passwordErrors.confirmPassword}</div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? {} : { ':hover': styles.buttonHover }),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.loading}></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Alterar Senha
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    );
};

export default MeusDados;
