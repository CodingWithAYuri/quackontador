import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaIdCard, FaArrowLeft, FaSave, FaLock, FaEye, FaEyeSlash, FaChevronUp, FaChevronDown } from 'react-icons/fa';

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
  const [showMainForm, setShowMainForm] = useState(true);
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

  // A animação de loading é definida diretamente nos estilos inline

  const containerStyle = {
    minHeight: 'calc(100vh - 120px)', // Ajusta a altura para considerar o header e footer
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    padding: '20px 0'
  };

  const contentStyle = {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: '1',
    minHeight: '0' // Permite que o flex funcione corretamente
  };



  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#4dabf7',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Voltar
          </Link>
          
          <h1 style={{ 
            textAlign: 'center',
            margin: '0 0 2rem 0',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: '500'
          }}>Meus Dados</h1>
          
          {error && <div style={{ 
            color: '#ff6b6b',
            fontSize: '0.85rem',
            margin: '0.3rem 0 1rem 0',
            textAlign: 'center',
            minHeight: '1.2rem',
            display: 'block'
          }}>{error}</div>}
          
          {success && <div style={{
            color: '#51cf66',
            fontSize: '0.85rem',
            margin: '0.3rem 0 1rem 0',
            minHeight: '1.2rem',
            display: 'block',
            textAlign: 'center'
          }}>{success}</div>}
          
          {/* Seção de dados principais */}
          {showMainForm && (
            <div style={{ 
              transition: 'all 0.3s ease',
              opacity: showChangePassword ? 0.7 : 1,
              maxHeight: showMainForm ? '1000px' : '0',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.5rem'
              }}>
                <h3 style={{ margin: 0 }}>Informações Pessoais</h3>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowMainForm(!showMainForm);
                    // Se estiver mostrando as informações pessoais, esconde o formulário de senha
                    if (showMainForm) {
                      setShowChangePassword(false);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4dabf7',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {showMainForm ? (
                    <>
                      <span>Minimizar</span>
                      <FaChevronUp />
                    </>
                  ) : (
                    <>
                      <span>Expandir</span>
                      <FaChevronDown />
                    </>
                  )}
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa'
                  }} />
                  <input
                    type="text"
                    name="cpf"
                    placeholder="CPF (000.000.000-00)"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      borderRadius: '4px',
                      border: '1px solid #555',
                      backgroundColor: '#444',
                      color: '#fff',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease-in-out',
                      boxSizing: 'border-box'
                    }}
                    maxLength="14"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaCalendarAlt style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa'
                  }} />
                  <input
                    type="text"
                    name="dataNascimento"
                    placeholder="Data de Nascimento (DD/MM/AAAA)"
                    value={formData.dataNascimento}
                    onChange={handleDateChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      borderRadius: '4px',
                      border: '1px solid #555',
                      backgroundColor: '#444',
                      color: '#fff',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease-in-out',
                      boxSizing: 'border-box'
                    }}
                    maxLength="10"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaIdCard style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa'
                  }} />
                  <input
                    type="text"
                    name="nit"
                    placeholder="NIT/PIS/PASEP (000.00000.00-0)"
                    value={formData.nit}
                    onChange={handleNITChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      borderRadius: '4px',
                      border: '1px solid #555',
                      backgroundColor: '#444',
                      color: '#fff',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease-in-out',
                      boxSizing: 'border-box'
                    }}
                    maxLength="14"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{
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
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1,
                    ':hover': !loading ? {
                      backgroundColor: '#339af0',
                      transform: 'translateY(-1px)'
                    } : {}
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: '#fff',
                        animation: 'spin 1s ease-in-out infinite',
                        marginRight: '0.5rem'
                      }}></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave style={{ marginRight: '0.5rem' }} />
                      Salvar Dados
                    </>
                  )}
                </button>
              </form>
              <div style={{ marginTop: '1rem' }}>
                <span 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#4dabf7',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    ':hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={() => {
                    setShowChangePassword(!showChangePassword);
                    // Se estiver mostrando o formulário de senha, minimiza o de informações pessoais
                    if (!showChangePassword) {
                      setShowMainForm(false);
                    } else {
                      setShowMainForm(true);
                    }
                  }}
                >
                  <FaLock style={{ marginRight: '0.5rem' }} />
                  {showChangePassword ? 'Mostrar Informações Pessoais' : 'Alterar Senha'}
                </span>
              </div>
            </div>
          )}

          {/* Formulário de alteração de senha */}
          {showChangePassword && (
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: '#fff',
                margin: '0 0 1rem 0',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #444'
              }}>Alterar Senha</h3>
              
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Senha atual"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: '#fff',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box',
                    paddingRight: '2.5rem'
                  }}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('current')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showPassword.current ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.currentPassword && (
                  <div style={{
                    color: '#ff6b6b',
                    fontSize: '0.85rem',
                    marginTop: '0.3rem',
                    minHeight: '1.2rem',
                    display: 'block'
                  }}>{passwordErrors.currentPassword}</div>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Nova senha"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: '#fff',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box',
                    paddingRight: '2.5rem'
                  }}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('new')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showPassword.new ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.newPassword && (
                  <div style={{
                    color: '#ff6b6b',
                    fontSize: '0.85rem',
                    marginTop: '0.3rem',
                    minHeight: '1.2rem',
                    display: 'block'
                  }}>{passwordErrors.newPassword}</div>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirme a nova senha"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: '#fff',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box',
                    paddingRight: '2.5rem'
                  }}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showPassword.confirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordErrors.confirmPassword && (
                  <div style={{
                    color: '#ff6b6b',
                    fontSize: '0.85rem',
                    marginTop: '0.3rem',
                    minHeight: '1.2rem',
                    display: 'block'
                  }}>{passwordErrors.confirmPassword}</div>
                )}
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    backgroundColor: '#4dabf7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '0.5rem 1.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s ease-in-out',
                    ':hover': {
                      backgroundColor: '#3b8fd9',
                      transform: 'translateY(-1px)'
                    },
                    ':active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: '#fff',
                        animation: 'spin 1s ease-in-out infinite',
                        marginRight: '0.5rem'
                      }}></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Alterar Senha</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusDados;
