import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaIdCard, FaCalendarAlt, FaArrowLeft, FaSave, FaLock, FaUserTie, FaIdCardAlt } from 'react-icons/fa';
import { useUserData } from '../contexts/UserDataContext';

const MeusDados = () => {
  const navigate = useNavigate();
  // Usa o hook useUserData para acessar e atualizar os dados do usuário
  const { userData, updateUserData } = useUserData();
  
  // Estado local para o formulário, inicializado com os dados do contexto
  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    email: userData.email || '',
    cpf: userData.cpf || '',
    dataNascimento: userData.dataNascimento || '',
    nit: userData.nit || ''
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

  // Atualiza o estado local quando os dados do contexto mudam
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nome: userData.nome || '',
      email: userData.email || '',
      cpf: userData.cpf || '',
      dataNascimento: userData.dataNascimento || '',
      nit: userData.nit || ''
    }));
  }, [userData]);

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

  // Função removida para corrigir warning do ESLint

  // Manipula mudanças nos campos de texto simples
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia o formulário de dados pessoais
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.nome || !formData.email || !formData.cpf || !formData.dataNascimento || !formData.nit) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido');
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

    // Salva os dados no contexto e no localStorage
    try {
      // Atualiza o contexto com os novos dados
      updateUserData({
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        nit: formData.nit
      });
      
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
    const formattedCPF = formatCPF(value);
    setFormData(prev => ({
      ...prev,
      cpf: formattedCPF
    }));
    
    // Atualiza o contexto com o CPF formatado
    if (formattedCPF.replace(/\D/g, '').length === 11) {
      updateUserData({ cpf: formattedCPF });
    }
  };

  const handleNITChange = (e) => {
    const { value } = e.target;
    const formattedNIT = formatNIT(value);
    setFormData(prev => ({
      ...prev,
      nit: formattedNIT
    }));
    
    // Atualiza o contexto com o NIT formatado
    if (formattedNIT.replace(/\D/g, '').length === 11) {
      updateUserData({ nit: formattedNIT });
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    const formattedDate = formatDate(value);
    setFormData(prev => ({
      ...prev,
      dataNascimento: formattedDate
    }));
    
    // Valida e atualiza o contexto com a data formatada
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(formattedDate)) {
      updateUserData({ dataNascimento: formattedDate });
    }
  };

  // A animação de loading é definida diretamente nos estilos inline

  // Estilos para o layout principal
  const containerStyle = {
    minHeight: 'calc(100vh - 120px)', // Ajusta a altura para considerar o header e footer
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)', // Atualizado para usar a variável CSS
    color: 'var(--text-primary)',
    width: '100%',
    boxSizing: 'border-box',
    padding: '20px 0',
    justifyContent: 'center' // Centraliza verticalmente
  };

  const contentStyle = {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  
  // Estilos para o card principal
  const cardStyle = {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)' // Nova borda para combinar com ContactForm
  };
  
  // Estilo para os campos de formulário
  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box'
  };
  
  // Estilo para os ícones nos campos
  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa'
  };
  
  // Estilo para os botões
  const buttonStyle = {
    backgroundColor: 'var(--accent-color)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0.5rem 1.25rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease-in-out'
  };
  
  // Estilo removido para corrigir warning do ESLint

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={cardStyle}>
          {!showChangePassword ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Link
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4dabf7',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
                onClick={() => setShowChangePassword(true)}
              >
                <FaLock style={{ marginRight: '0.5rem' }} /> Alterar Senha
              </Link>
            </div>
          ) : (
            <Link 
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#4dabf7',
                textDecoration: 'none',
                marginBottom: '1rem',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowChangePassword(false)}
            >
              <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Voltar para Meus Dados
            </Link>
          )}
          
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: 'var(--text-primary)'
          }}>{showChangePassword ? 'Alterar a Senha' : 'Meus Dados'}</h1>
          
          {/* Exibe as mensagens de erro/sucesso independentemente do formulário ativo */}
          {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: '#51cf66', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
          
          {/* Formulário de dados pessoais - exibido apenas quando showChangePassword é false */}
          {!showChangePassword && (
            <div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaUserTie style={iconStyle} />
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome Completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaEnvelope style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaIdCard style={iconStyle} />
                  <input
                    type="text"
                    name="cpf"
                    placeholder="CPF"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    style={inputStyle}
                    maxLength="14"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaCalendarAlt style={iconStyle} />
                  <input
                    type="text"
                    name="dataNascimento"
                    placeholder="Data de Nascimento"
                    value={formData.dataNascimento}
                    onChange={handleDateChange}
                    style={inputStyle}
                    maxLength="10"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaIdCardAlt style={iconStyle} />
                  <input
                    type="text"
                    name="nit"
                    placeholder="NIT/PIS/PASEP"
                    value={formData.nit}
                    onChange={handleNITChange}
                    style={inputStyle}
                    maxLength="14"
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1rem' }}>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{...buttonStyle, opacity: loading ? 0.7 : 1}}
                  >
                    {loading ? (
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
                    ) : (
                      <FaSave style={{ marginRight: '0.5rem' }} />
                    )}
                    {loading ? 'Salvando...' : 'Salvar Dados'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Botão para alternar entre os formulários removido - agora é um link */}
          {showChangePassword && (
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={iconStyle} />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Senha Atual"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={iconStyle} />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nova Senha"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <FaLock style={iconStyle} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Nova Senha"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{...buttonStyle, opacity: loading ? 0.7 : 1}}
                >
                  {loading ? (
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
                  ) : (
                    <FaSave style={{ marginRight: '0.5rem' }} />
                  )}
                  {loading ? 'Alterando...' : 'Alterar Senha'}
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
