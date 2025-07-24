import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaIdCard, FaCalendarAlt, FaArrowLeft, FaSave, FaLock, FaUserTie, FaIdCardAlt } from 'react-icons/fa';
import { useUserData } from '../contexts/UserDataContext';
import { formatCPF, unformatCPF } from '../utils/formatters';

const MeusDados = () => {
  const navigate = useNavigate();
  // Usa o hook useUserData para acessar e atualizar os dados do usuário
  const { userData, updateUserData } = useUserData();
  
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para o formulário, inicializado com os dados do contexto
  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    email: userData.email || '',
    cpf: userData.cpf || '',
    dataNascimento: userData.dataNascimento || '',
    nit: userData.nit || ''
  });
  
  // Debug: Log quando o estado isEditing mudar
  useEffect(() => {
    console.log('DEBUG - isEditing mudou para:', isEditing);
    console.log('DEBUG - Valor atual de formData:', formData);
  }, [isEditing, formData]);
  
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
  
  // Usamos useRef para rastrear a montagem inicial e o estado anterior
  const isInitialMount = useRef(true);
  const prevUserDataRef = useRef(userData);

  // Sincroniza o estado local com o contexto global
  useEffect(() => {
    // Não faz nada na montagem inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Se o CPF no contexto for diferente do estado local
    // E o campo não estiver em foco (para evitar conflitos durante a digitação)
    const currentUnformattedCPF = formData.cpf ? unformatCPF(formData.cpf) : '';
    if (userData.cpf && userData.cpf !== currentUnformattedCPF && document.activeElement?.id !== 'cpf') {
      // Formata o CPF do contexto antes de atualizar o estado local
      const formattedCPF = formatCPF(userData.cpf);
      setFormData(prev => ({
        ...prev,
        cpf: formattedCPF
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.cpf, formatCPF, unformatCPF]); // Adicionadas as dependências necessárias

  // Atualiza o estado local quando os dados do contexto mudam
  useEffect(() => {
    // Se for a primeira renderização, apenas armazena os dados iniciais
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevUserDataRef.current = userData;
      
      // Inicializa o formData com os dados do contexto
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
        cpf: userData.cpf || '',
        dataNascimento: userData.dataNascimento || '',
        nit: userData.nit || ''
      });
      
      return;
    }

    // Se não estiver editando, atualiza os dados do formulário quando o contexto mudar
    if (!isEditing) {
      setFormData(prev => {
        // Verifica se algum campo relevante mudou em relação ao estado anterior
        const hasChanges = 
          (userData.nome && prev.nome !== userData.nome) ||
          (userData.email && prev.email !== userData.email) ||
          (userData.cpf && prev.cpf !== userData.cpf) ||
          (userData.dataNascimento && prev.dataNascimento !== userData.dataNascimento) ||
          (userData.nit && prev.nit !== userData.nit);

        // Se não houve mudanças, retorna o estado anterior
        if (!hasChanges) return prev;

        console.log('Atualizando formData a partir do contexto:', userData);
        
        // Atualiza apenas os campos que mudaram
        return {
          ...prev,
          nome: userData.nome || prev.nome,
          email: userData.email || prev.email,
          cpf: userData.cpf || prev.cpf,
          dataNascimento: userData.dataNascimento || prev.dataNascimento,
          nit: userData.nit || prev.nit
        };
      });
    }

    // Atualiza a referência para os dados atuais
    prevUserDataRef.current = userData;
  }, [userData, isEditing]);

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

  // Formata o CPF
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    
    // Remove tudo que não for dígito
    const valorLimpo = cpf.replace(/\D/g, '');
    
    // Aplica a formatação
    let cpfFormatado = '';
    
    // Formatação progressiva: 000.000.000-00
    for (let i = 0; i < valorLimpo.length; i++) {
      if (i === 3 || i === 6) {
        cpfFormatado += '.';
      } else if (i === 9) {
        cpfFormatado += '-';
      }
      cpfFormatado += valorLimpo[i];
      
      // Limita a 14 caracteres (11 dígitos + 3 caracteres especiais)
      if (cpfFormatado.length >= 14) {
        cpfFormatado = cpfFormatado.substring(0, 14);
        break;
      }
    }
    
    return cpfFormatado;
  };

  // Formata o NIT/PIS/PASEP
  const formatarNIT = (nit) => {
    if (!nit) return '';
    
    // Remove tudo que não for dígito
    const valorLimpo = nit.replace(/\D/g, '');
    
    // Aplica a formatação
    let nitFormatado = '';
    
    // Formatação progressiva: 000.00000.00-0
    for (let i = 0; i < valorLimpo.length; i++) {
      if (i === 3 || i === 8) {
        nitFormatado += '.';
      } else if (i === 11) {
        nitFormatado += '-';
      }
      nitFormatado += valorLimpo[i];
      
      // Limita o tamanho
      if (nitFormatado.length >= 14) {
        nitFormatado = nitFormatado.substring(0, 14);
        break;
      }
    }
    
    return nitFormatado;
  };

  // Manipula mudanças nos campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica formatação específica para CPF e NIT
    if (name === 'cpf') {
      const cpfFormatado = formatarCPF(value);
      setFormData(prev => {
        const newData = { ...prev, [name]: cpfFormatado };
        // Atualiza o contexto global
        updateUserData({ [name]: cpfFormatado });
        return newData;
      });
    } else if (name === 'nit') {
      const nitFormatado = formatarNIT(value);
      setFormData(prev => {
        const newData = { ...prev, [name]: nitFormatado };
        // Atualiza o contexto global
        updateUserData({ [name]: nitFormatado });
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Atualiza o contexto global para outros campos
        updateUserData({ [name]: value });
        return newData;
      });
    }
  };

  // Formata a data de nascimento
  const formatarDataNascimento = (data) => {
    if (!data) return '';
    
    // Remove tudo que não for dígito
    const valorLimpo = data.replace(/\D/g, '');
    
    // Aplica a formatação
    let dataFormatada = '';
    
    // Formatação progressiva: DD/MM/AAAA
    for (let i = 0; i < valorLimpo.length; i++) {
      if (i === 2 || i === 4) {
        dataFormatada += '/';
      }
      dataFormatada += valorLimpo[i];
      
      // Limita a 10 caracteres (DD/MM/AAAA)
      if (dataFormatada.length >= 10) {
        dataFormatada = dataFormatada.substring(0, 10);
        break;
      }
    }
    
    return dataFormatada;
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
      setError('CPF inválido. O CPF deve ter 11 dígitos.');
      setLoading(false);
      return;
    }
    
    // Validação básica de CPF (apenas formato, não validação matemática)
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      setError('Formato de CPF inválido. Use o formato: 000.000.000-00');
      setLoading(false);
      return;
    }

    // Valida data de nascimento
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.dataNascimento)) {
      setError('Formato de data inválido. Use o formato DD/MM/AAAA');
      setLoading(false);
      return;
    }
    
    // Valida se a data é válida
    const [dia, mes, ano] = formData.dataNascimento.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const dataAtual = new Date();
    
    if (data.toString() === 'Invalid Date' || 
        data.getDate() !== dia || 
        data.getMonth() !== mes - 1 || 
        data.getFullYear() !== ano) {
      setError('Data de nascimento inválida');
      setLoading(false);
      return;
    }
    
    // Valida se a data não é futura
    if (data > dataAtual) {
      setError('A data de nascimento não pode ser futura');
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

  // Formata NIT/PIS/PASEP
  const formatNIT = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{5})(\d)/, '$1.$2')
      .replace(/(\d{5}\d{1,2})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  // Formata CPF - Usa o formatador de CPF compartilhado

  // Manipulador de mudança do CPF
  const handleCPFChange = (e) => {
    const { value } = e.target;
    const formattedCPF = formatCPF(value);
    
    // Atualiza o estado local
    setFormData(prev => ({
      ...prev,
      cpf: formattedCPF
    }));
    
    // Atualiza o contexto global em tempo real com o valor sem formatação
    // Isso permite a sincronização entre componentes durante a digitação
    updateUserData({ cpf: unformatCPF(formattedCPF) });
  };

  const handleNITChange = (e) => {
    const { value } = e.target;
    const formattedNIT = formatNIT(value);
    
    setFormData(prev => {
      const newData = { ...prev, nit: formattedNIT };
      // Atualiza o contexto com o NIT formatado
      if (formattedNIT.replace(/\D/g, '').length === 11) {
        updateUserData({ nit: formattedNIT });
      }
      return newData;
    });
  };

  const handleDataNascimentoChange = (e) => {
    const { value } = e.target;
    const dataFormatada = formatarDataNascimento(value);
    
    setFormData(prev => {
      const newData = { ...prev, dataNascimento: dataFormatada };
      // Valida e atualiza o contexto com a data formatada
      const validDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (validDateRegex.test(dataFormatada)) {
        updateUserData({ dataNascimento: dataFormatada });
      }
      return newData;
    });
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
  
  // Estilo base para os campos de formulário - Atualizado para combinar com DARF.js
  const inputBaseStyle = {
    width: '100%',
    padding: '0.5rem 0.5rem 0.5rem 2.5rem',
    borderRadius: '0 6px 6px 0',
    border: '1px solid #555',
    borderLeft: 'none',
    fontSize: '0.95rem',
    height: '38px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    },
    '&:disabled': {
      backgroundColor: '#3a3a3a',
      color: '#777',
      cursor: 'not-allowed',
      opacity: 0.8
    }
  };
  
  // Estilo para os campos de formulário
  const inputStyle = {
    ...inputBaseStyle,
    backgroundColor: isEditing ? '#2a2a2a' : '#3a3a3a',
    color: isEditing ? '#fff' : '#ccc',
    cursor: isEditing ? 'text' : 'not-allowed',
    opacity: 1
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
                    style={{
                      ...inputStyle
                    }}
                    disabled={!isEditing}
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
                    style={{
                      ...inputStyle
                    }}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <FaIdCard style={iconStyle} />
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    placeholder="CPF"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    style={{
                      ...inputStyle
                    }}
                    disabled={!isEditing}
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
                    onChange={handleDataNascimentoChange}
                    onBlur={(e) => {
                      // Garante que a data esteja no formato correto ao sair do campo
                      const value = e.target.value;
                      if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                        const cleaned = value.replace(/\D/g, '');
                        if (cleaned.length >= 8) {
                          const formatted = `${cleaned.substring(0,2)}/${cleaned.substring(2,4)}/${cleaned.substring(4,8)}`;
                          setFormData(prev => ({
                            ...prev,
                            dataNascimento: formatted
                          }));
                        }
                      }
                    }}
                    style={{
                      ...inputStyle
                    }}
                    disabled={!isEditing}
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
                    style={{
                      ...inputStyle
                    }}
                    disabled={!isEditing}
                    maxLength="14"
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                  {!isEditing ? (
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('DEBUG - Botão Editar Dados clicado');
                        console.log('DEBUG - Estado ANTES de setar isEditing para true:', { 
                          isEditing, 
                          formData,
                          userData
                        });
                        
                        // Atualiza o estado de edição primeiro
                        setIsEditing(true);
                        
                        // Força uma nova renderização com os dados atualizados
                        setFormData({
                          nome: userData.nome || '',
                          email: userData.email || '',
                          cpf: userData.cpf || '',
                          dataNascimento: userData.dataNascimento || '',
                          nit: userData.nit || ''
                        });
                        
                        console.log('DEBUG - Estado DEPOIS de setar isEditing para true');
                      }}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#1a73e8',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        minWidth: '120px'
                      }}
                    >
                      <FaUserTie />
                      Editar Dados
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button"
                        onClick={() => {
                          console.log('Botão Cancelar clicado');
                          setIsEditing(false);
                          // Reseta para os valores originais
                          setFormData({
                            nome: userData.nome || '',
                            email: userData.email || '',
                            cpf: userData.cpf || '',
                            dataNascimento: userData.dataNascimento || '',
                            nit: userData.nit || ''
                          });
                        }}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#dc3545',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          minWidth: '120px'
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading} 
                        style={{
                          ...buttonStyle,
                          opacity: loading ? 0.7 : 1,
                          padding: '0.5rem 1rem',
                          minWidth: '120px'
                        }}
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
                    </>
                  )}
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
