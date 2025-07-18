// Importa as dependências
import React, { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Person, CreditCard, Calendar, FileEarmarkText } from 'react-bootstrap-icons';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useUserEmail } from '../hooks/useUserEmail';

// Adiciona o plugin autoTable ao jsPDF
jsPDF.autoTable = autoTable; 

// Estilos inline para o componente
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 120px)',
    backgroundColor: '#333',
    padding: '1rem 0.5rem',
    boxSizing: 'border-box',
    margin: 0,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    color: '#fff'
  },
  contentContainer: {
    width: '100%',
    maxWidth: '800px',
    margin: '1rem auto',
    padding: '1.5rem',
    backgroundColor: '#333',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.4)'
  },
  formContainer: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formTitle: {
    fontSize: '1.5rem',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600'
  },
  formSubtitle: {
    fontSize: '1rem',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    color: '#aaa',
    fontStyle: 'italic'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  lastInputGroup: {
    marginBottom: 0
  },
  compactInputGroup: {
    marginBottom: '0.75rem'
  },
  inputGroupText: {
    width: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--input-bg)',
    border: '1px solid #555',
    color: '#fff',
    borderRight: 'none',
    borderRadius: '6px 0 0 6px',
    fontSize: '1rem',
    padding: '0.6rem',
    '&.disabled': {
      backgroundColor: '#3a3a3a',
      color: '#777'
    }
  },
  formControl: {
    backgroundColor: 'var(--input-bg)',
    border: '1px solid #555',
    borderLeft: 'none',
    color: '#fff',
    padding: '0.6rem 0.8rem',
    borderRadius: '0 6px 6px 0',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease-in-out',
    '&:focus': {
      backgroundColor: '#555',
      borderColor: '#6c757d',
      color: '#fff',
      boxShadow: '0 0 0 0.2rem rgba(108, 117, 125, 0.25)'
    },
    '&:disabled': {
      backgroundColor: '#3a3a3a',
      color: '#aaa',
      cursor: 'not-allowed',
      opacity: 0.8
    },
    '&.compact': {
      width: 'auto',
      minWidth: '120px',
      padding: '0.4rem 0.6rem',
      display: 'inline-block'
    },
    '&.valorGuia': {
      width: 'auto',
      minWidth: '80px',
      textAlign: 'right',
      padding: '0.35rem 0.5rem',
      fontSize: '0.9rem',
      marginLeft: '-1px',
      display: 'inline-block'
    },
    '&.competencia': {
      width: 'auto',
      minWidth: '80px',
      padding: '0.35rem 0.5rem',
      display: 'inline-block'
    }
  },

  label: {
    display: 'block',
    marginBottom: '0.35rem',
    color: '#e0e0e0',
    fontWeight: '500',
    fontSize: '0.78rem',
    letterSpacing: '0.3px'
  },
  formText: {
    fontSize: '0.7rem',
    color: '#aaa',
    marginTop: '0.25rem',
    display: 'block',
    textTransform: 'lowercase',
    fontStyle: 'italic'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    gap: '1rem',
    flexWrap: 'wrap',
    width: '100%'
  },
  button: {
    padding: '0.6rem 1.25rem',
    fontWeight: '500',
    borderRadius: '6px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'none'
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    }
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #6c757d',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      color: '#000 !important',
      backgroundColor: '#f8f9fa !important',
      borderColor: '#f8f9fa !important',
      transform: 'translateY(-2px) !important',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2) !important'
    },
    '&:active': {
      transform: 'translateY(0) !important',
      boxShadow: 'none !important'
    }
  },
  generateButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#218838',
      borderColor: '#1e7e34',
      transform: 'translateY(-2px) !important',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2) !important'
    },
    '&:active': {
      transform: 'translateY(0) !important',
      boxShadow: 'none !important'
    }
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
    minHeight: '1.25rem'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    textDecoration: 'none',
    marginBottom: '1rem',
    '&:hover': {
      color: '#ddd',
      textDecoration: 'none'
    }
  },
  icon: {
    marginRight: '0.5rem'
  }
};

const GuiaGPS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtém os dados do usuário logado
  const { name: userName } = useUserEmail();
  
  // Obtém os dados do usuário do contexto
  const { userData, updateUserData } = useUserData();
  
  // Estado local para o formulário
  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    cpf: userData.cpf || '',
    dataNascimento: userData.dataNascimento || '',
    nit: userData.nit || '',
    valor: location.state?.valorInss || userData.valor || '0,00',
    mesReferencia: userData.mesReferencia || String(new Date().getMonth() + 1).padStart(2, '0'),
    anoReferencia: userData.anoReferencia || String(new Date().getFullYear()),
    competencia: userData.competencia || ''
  });
  
  // Atualiza o contexto quando os dados do formulário mudam
  useEffect(() => {
    const { nome, cpf, dataNascimento, nit } = formData;
    updateUserData({ nome, cpf, dataNascimento, nit });
  }, [formData, updateUserData]); // Incluindo formData e updateUserData como dependências
  
  // Atualiza o valor quando receber da rota
  useEffect(() => {
    if (location.state?.valorInss) {
      setFormData(prev => ({
        ...prev,
        valor: location.state.valorInss
      }));
    }
  }, [location.state?.valorInss, setFormData]);

  // Atualiza a competência quando mês ou ano mudam
  useEffect(() => {
    if (formData.mesReferencia && formData.anoReferencia) {
      const competencia = `${formData.mesReferencia.padStart(2, '0')}/${formData.anoReferencia}`;
      setFormData(prev => ({
        ...prev,
        competencia
      }));
      
      // Atualiza o contexto com mês, ano e competência
      updateUserData({
        mesReferencia: formData.mesReferencia,
        anoReferencia: formData.anoReferencia,
        competencia: competencia
      });
    }
  }, [formData.mesReferencia, formData.anoReferencia, updateUserData]); // Adicionado updateUserData como dependência
  
  // Função para calcular o vencimento (15 do mês seguinte, ou próximo dia útil se for final de semana)
  const calcularVencimento = (mesAno) => {
    try {
      const [mes, ano] = mesAno.split('/').map(Number);
      
      // Pega o dia 15 do próximo mês
      let proximoMes = mes === 12 ? 1 : mes + 1;
      let anoProxMes = mes === 12 ? ano + 1 : ano;
      
      let dataVencimento = new Date(anoProxMes, proximoMes - 1, 15);
      
      // Verifica se é sábado (6) ou domingo (0)
      if (dataVencimento.getDay() === 6) { // Sábado
        dataVencimento.setDate(dataVencimento.getDate() + 2); // Vai para segunda
      } else if (dataVencimento.getDay() === 0) { // Domingo
        dataVencimento.setDate(dataVencimento.getDate() + 1); // Vai para segunda
      }
      
      // Formata a data para dd/mm/yyyy
      return dataVencimento.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao calcular vencimento:', error);
      // Se houver erro, retorna o 15 do próximo mês como fallback
      const hoje = new Date();
      const proximoMes = hoje.getMonth() + 2 > 12 ? 1 : hoje.getMonth() + 2;
      const anoProxMes = hoje.getMonth() + 2 > 12 ? hoje.getFullYear() + 1 : hoje.getFullYear();
      return `15/${String(proximoMes).padStart(2, '0')}/${anoProxMes}`;
    }
  };
  
  // Preenche o nome do usuário quando o componente é montado ou quando o userName muda
  useEffect(() => {
    if (userName && userName !== formData.nome) {
      setFormData(prev => ({
        ...prev,
        nome: userName
      }));
      // Atualiza o contexto com o nome do usuário
      updateUserData({ nome: userName });
    }
  }, [userName, formData.nome, updateUserData]); // Adicionando formData.nome e updateUserData como dependências

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [calculadoraData] = useState({
    valorSalario: '0,00',
    anoSelecionado: new Date().getFullYear()
  });

  // Carrega o valor do INSS da rota quando o componente é montado
  useEffect(() => {
    if (location.state?.valorInss) {
      try {
        // Converte para número e formata para o padrão brasileiro (vírgula como separador decimal)
        const valorNumerico = parseFloat(location.state.valorInss);
        if (!isNaN(valorNumerico)) {
          const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          
          setFormData(prev => ({
            ...prev,
            valor: valorFormatado
          }));
          
          // Atualiza o contexto com o valor formatado
          updateUserData({ valor: valorFormatado });
        }
      } catch (error) {
        console.error('Erro ao formatar valor do INSS:', error);
        setFormData(prev => ({
          ...prev,
          valor: '0,00'
        }));
        
        // Atualiza o contexto com valor padrão em caso de erro
        updateUserData({ valor: '0,00' });
      }
    }
  }, [location.state?.valorInss, updateUserData]); // Adicionado updateUserData como dependência

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Atualiza o estado local imediatamente para melhor resposta da UI
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Atualiza o contexto com os dados relevantes
      const { nome, cpf, dataNascimento, nit } = newData;
      updateUserData({ nome, cpf, dataNascimento, nit });
      
      return newData;
    });
    
    // Formatação do CPF
    if (name === 'cpf' && value) {
      // Remove todos os caracteres não numéricos
      const cpfLimpo = value.replace(/\D/g, '');
      
      // Limita a 11 dígitos
      const cpfLimitado = cpfLimpo.slice(0, 11);
      
      // Aplica a formatação
      let cpfFormatado = cpfLimitado;
      if (cpfLimitado.length > 9) {
        cpfFormatado = cpfLimitado.replace(
          /^(\d{3})(\d{3})(\d{3})(\d{1,2}).*$/,
          (_, p1, p2, p3, p4) => `${p1}.${p2}.${p3}-${p4}`
        );
      } else if (cpfLimitado.length > 6) {
        cpfFormatado = cpfLimitado.replace(
          /^(\d{3})(\d{3})(\d{1,3})/,
          (_, p1, p2, p3) => `${p1}.${p2}.${p3}`
        );
      } else if (cpfLimitado.length > 3) {
        cpfFormatado = cpfLimitado.replace(
          /^(\d{3})(\d{1,3})/,
          (_, p1, p2) => `${p1}.${p2}`
        );
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: cpfFormatado
      }));
      
      // Atualiza o contexto com o CPF formatado
      updateUserData({ cpf: cpfFormatado });
      return;
    }
    
    // Formatação da Data de Nascimento
    if (name === 'dataNascimento' && value) {
      const dataFormatada = formatarDataBrasileira(value);
      setFormData(prev => ({
        ...prev,
        [name]: dataFormatada
      }));
      
      // Atualiza o contexto com a data formatada
      if (validarDataBrasileira(dataFormatada)) {
        updateUserData({ dataNascimento: dataFormatada });
      }
      return;
    }
    
    // Formatação do NIT
    if (name === 'nit' && value) {
      const nitFormatado = formatarNIT(value);
      setFormData(prev => ({
        ...prev,
        [name]: nitFormatado
      }));
      
      // Atualiza o contexto com o NIT formatado
      if (nitFormatado.replace(/\D/g, '').length === 11) {
        updateUserData({ nit: nitFormatado });
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formata CPF
  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  
  // Formata NIT no padrão 111.11111.11-1
  const formatarNIT = (value) => {
    if (!value) return '';
    
    // Remove todos os caracteres não numéricos
    const onlyNums = value.replace(/\D/g, '');
    
    // Aplica a máscara 000.00000.00-0
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 8) {
      return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3)}`;
    }
    if (onlyNums.length <= 10) {
      return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 8)}.${onlyNums.slice(8)}`;
    }
    return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 8)}.${onlyNums.slice(8, 10)}-${onlyNums.slice(10, 11)}`;
  };

  // Formata a data para o formato brasileiro (dd/mm/aaaa)
  const formatarDataBrasileira = (value) => {
    if (!value) return '';
    
    // Remove qualquer caractere que não seja número
    const onlyNums = value.replace(/\D/g, '');
    
    // Aplica a máscara dd/mm/aaaa
    if (onlyNums.length <= 2) {
      return onlyNums;
    }
    if (onlyNums.length <= 4) {
      return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`;
    }
    return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(4, 8)}`;
  };

  // Converte data no formato brasileiro para ISO (yyyy-mm-dd)
  const dataBrasileiraParaISO = (dataBr) => {
    if (!dataBr) return '';
    const [dia, mes, ano] = dataBr.split('/');
    if (dia && mes && ano) {
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return '';
  };

  // Valida se a data está no formato dd/mm/aaaa e é uma data válida
  const validarDataBrasileira = (dataBr) => {
    if (!dataBr) return false;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataBr)) return false;
    
    const [dia, mes, ano] = dataBr.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return (
      data.getDate() === dia &&
      data.getMonth() === mes - 1 &&
      data.getFullYear() === ano
    );
  };
  
  // Busca dados adicionais do usuário no localStorage se necessário
  // Removido o segundo useEffect que não é mais necessário

  // Validação do formulário
  const validarFormulario = () => {
    const camposObrigatorios = [
      { key: 'nome', label: 'Nome Completo' },
      { key: 'cpf', label: 'CPF' },
      { key: 'dataNascimento', label: 'Data de Nascimento' },
      { key: 'nit', label: 'NIT/PIS/PASEP' },
      { key: 'competencia', label: 'Competência' }
    ];

    // Valida campos obrigatórios
    for (const { key, label } of camposObrigatorios) {
      if (!formData[key]?.trim()) {
        setErro(`❌ O campo ${label} é obrigatório`);
        // Rola para o topo para mostrar a mensagem de erro
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }

    // Valida CPF
    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('❌ CPF inválido. Deve conter exatamente 11 dígitos.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Valida NIT/PIS/PASEP
    const nitLimpo = formData.nit.replace(/\D/g, '');
    if (nitLimpo.length !== 11) {
      setErro('❌ NIT/PIS/PASEP inválido. Deve conter exatamente 11 dígitos.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Valida Data de Nascimento
    if (!validarDataBrasileira(formData.dataNascimento)) {
      setErro('❌ Data de nascimento inválida. Use o formato dd/mm/aaaa');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Converte a data para o formato ISO (yyyy-mm-dd) para validação
    const dataISO = dataBrasileiraParaISO(formData.dataNascimento);
    const dataNasc = new Date(dataISO);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data
    
    if (isNaN(dataNasc.getTime())) {
      setErro('❌ Data de nascimento inválida. Por favor, verifique a data informada.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Valida se a data não é futura
    if (dataNasc > hoje) {
      setErro('❌ Data de nascimento inválida. A data não pode ser futura.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Valida idade mínima (16 anos)
    const idadeMinima = new Date(hoje);
    idadeMinima.setFullYear(hoje.getFullYear() - 16);
    
    if (dataNasc > idadeMinima) {
      setErro('❌ Data de nascimento inválida. O contribuinte deve ter pelo menos 16 anos.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    // Limpa mensagem de erro se tudo estiver válido
    setErro('');
    return true;
  };

  // Gera o PDF da guia GPS e abre em uma nova aba
  // @param {Event} e - Evento do formulário (opcional)
  // @param {boolean} autoPrint - Define se deve imprimir automaticamente (padrão: false)
  const gerarGPS = async (e, autoPrint = false) => {
    console.log('gerarGPS chamado', { autoPrint });
    
    // Previne o comportamento padrão do evento se existir
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Foca no botão de gerar para garantir que o usuário veja o feedback visual
    const generateButton = document.getElementById('gerarGPSButton');
    if (generateButton) {
      generateButton.blur(); // Remove o foco para evitar múltiplos cliques
    }
    
    if (!validarFormulario()) {
      console.log('Validação do formulário falhou');
      return;
    }
    
    setCarregando(true);
    setErro('');
    
    try {
      console.log('Preparando dados do GPS...');
      
      // Prepara os dados do GPS
      const gpsData = {
        ...formData,
        dataVencimento: calcularVencimento(formData.competencia),
        valor: formData.valor !== undefined && formData.valor !== null ? 
          parseFloat(String(formData.valor).replace(/\./g, '').replace(',', '.')) : 0
      };

      // Gera um ID único para o documento
      const documentId = `gps-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      // Prepara o objeto completo para salvar
      const dataToSave = {
        formData: {
          ...gpsData,
          _documentId: documentId,
          _timestamp: timestamp
        },
        calculadoraData: {
          manterValores: true,
          valorSalario: calculadoraData.valorSalario || '0,00',
          anoSelecionado: calculadoraData.anoSelecionado || new Date().getFullYear()
        },
        timestamp: timestamp,
        documentId: documentId
      };

      // Salva os dados no sessionStorage como fallback
      sessionStorage.setItem('gpsData', JSON.stringify(dataToSave));
      console.log('Dados salvos no sessionStorage');
      
      // Importa o componente GPSViewer e suas funções exportadas
      import('./GPSViewer').then(async (GPSViewerModule) => {
        try {
          const { exportedFunctions } = GPSViewerModule;
          
          if (!exportedFunctions || !exportedFunctions.generatePDF) {
            throw new Error('Função de geração de PDF não encontrada');
          }
          
          // Gera o PDF diretamente usando a função do GPSViewer
          const pdfResult = await exportedFunctions.generatePDF(dataToSave.formData);
          
          // Abre o PDF em uma nova aba
          const printWindow = window.open(pdfResult.url, '_blank');
          if (printWindow) {
            // Se autoPrint for true, inicia a impressão automaticamente quando o PDF carregar
            if (autoPrint) {
              printWindow.onload = () => {
                printWindow.print();
              };
            }
          } else {
            // Se o navegador bloqueou o popup, mostra uma mensagem para o usuário
            alert('Por favor, permita popups para visualizar o GPS');
          }
          
          setCarregando(false);
        } catch (error) {
          console.error('Erro ao gerar PDF diretamente:', error);
          
          // Fallback: navega para o GPSViewer se não conseguir gerar o PDF diretamente
          navigate('/gps-viewer', { 
            state: dataToSave,
            replace: true
          });
          
          // Fecha o loading após um pequeno delay
          setTimeout(() => {
            setCarregando(false);
          }, 1000);
        }
      }).catch(error => {
        console.error('Erro ao importar GPSViewer:', error);
        
        // Fallback: navega para o GPSViewer se não conseguir importar o módulo
        navigate('/gps-viewer', { 
          state: dataToSave,
          replace: true
        });
        
        // Fecha o loading após um pequeno delay
        setTimeout(() => {
          setCarregando(false);
        }, 1000);
      });
    } catch (error) {
      console.error('Erro ao gerar GPS:', error);
      setErro(`Ocorreu um erro ao gerar o GPS: ${error.message}. Por favor, tente novamente.`);
      setCarregando(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <button 
          onClick={() => navigate('/calculos', {
            state: {
              manterValores: true,
              valorSalario: location.state?.valorSalario || '',
              anoSelecionado: location.state?.anoSelecionado || new Date().getFullYear()
            }
          })}
          style={{
            ...styles.backLink,
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          <ArrowLeft style={styles.icon} />
          Voltar para a memória dos cálculos
        </button>
        
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Gerar Guia de Previdência Social</h2>
          <p style={styles.formSubtitle}>
            Preencha os dados abaixo para gerar a Guia da Previdência Social.
          </p>
          
          {erro && (
            <Alert 
              variant="danger" 
              style={{ 
                marginBottom: '1.5rem',
                borderRadius: '8px',
                borderLeft: '4px solid #dc3545',
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#fff'
              }}
              className="d-flex align-items-center"
            >
              <div style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>⚠️</div>
              <div style={{ color: '#fff' }}>{erro}</div>
            </Alert>
          )}
          
          <Form>
            <Row>
              <Col md={6} style={styles.inputGroup}>
                <label htmlFor="nomeCompleto" style={styles.label}>Nome Completo *</label>
                <InputGroup>
                  <InputGroup.Text style={styles.inputGroupText}>
                    <Person />
                  </InputGroup.Text>
                  <Form.Control
                    id="nomeCompleto"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder={userName || "Digite seu nome completo"}
                    required
                    style={styles.formControl}
                    aria-required="true"
                    maxLength={100}
                  />
                </InputGroup>
              </Col>
              
              <Col md={6} style={styles.inputGroup}>
                <label htmlFor="cpf" style={styles.label}>CPF *</label>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                    <InputGroup.Text style={styles.inputGroupText}>
                      <CreditCard />
                    </InputGroup.Text>
                    <Form.Control
                      id="cpf"
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={(e) => {
                        e.target.value = formatarCPF(e.target.value);
                        handleChange(e);
                      }}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      required
                      style={styles.formControl}
                      className="compact"
                      aria-required="true"
                      aria-describedby="cpfHelp"
                    />
                  </InputGroup>
                  <small id="cpfHelp" style={{ color: '#aaa', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                    Apenas números
                  </small>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col md={4} style={styles.inputGroup}>
                <label htmlFor="dataNascimento" style={styles.label}>Data de Nascimento *</label>
                <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                  <InputGroup.Text style={styles.inputGroupText}>
                    <Calendar />
                  </InputGroup.Text>
                  <Form.Control
                    id="dataNascimento"
                    type="text"
                    name="dataNascimento"
                    placeholder="dd/mm/aaaa"
                    value={formData.dataNascimento || ''}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Aplica a máscara de data
                      const dataFormatada = formatarDataBrasileira(valor);
                      
                      setFormData(prev => ({
                        ...prev,
                        dataNascimento: dataFormatada
                      }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value && !validarDataBrasileira(e.target.value)) {
                        // Se a data for inválida, limpa o campo
                        setFormData(prev => ({
                          ...prev,
                          dataNascimento: ''
                        }));
                      }
                    }}
                    maxLength={10}
                    required
                    style={styles.formControl}
                    aria-required="true"
                  />
                </InputGroup>
              </Col>
              
              <Col md={4} style={styles.inputGroup}>
                <label htmlFor="nit" style={styles.label}>NIT/PIS/PASEP *</label>
                <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                  <InputGroup.Text style={styles.inputGroupText}>
                    <FileEarmarkText />
                  </InputGroup.Text>
                  <Form.Control
                    id="nit"
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={(e) => {
                      e.target.value = formatarNIT(e.target.value);
                      handleChange(e);
                    }}
                    placeholder="000.00000.00-0"
                    maxLength="14"
                    required
                    style={styles.formControl}
                    aria-required="true"
                    aria-describedby="nitHelp"
                  />
                </InputGroup>
                <small id="nitHelp" style={{ color: '#aaa', fontSize: '0.75rem' }}>
                  Formato: 000.00000.00-0
                </small>
              </Col>
              
              <Col md={4} style={styles.inputGroup}>
                <label htmlFor="valorInss" style={styles.label}>Valor da Guia *</label>
                <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                  <InputGroup.Text style={{
                    ...styles.inputGroupText,
                    padding: '0.4rem 0.6rem',
                    borderRight: 'none',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    fontSize: '0.9rem',
                    minWidth: '36px'
                  }}>
                    R$
                  </InputGroup.Text>
                  <Form.Control
                    id="valorInss"
                    type="text"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                    style={{...styles.formControl, textAlign: 'right'}}
                    className="valorGuia"
                  />
                </InputGroup>
              </Col>
              <Col md={4} style={{...styles.inputGroup, ...styles.lastInputGroup}}>
                <label htmlFor="mesReferencia" style={styles.label}>Competência *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                    <Form.Select
                      id="mesReferencia"
                      name="mesReferencia"
                      value={formData.mesReferencia}
                      onChange={handleChange}
                      required
                      style={styles.formControl}
                      className="competencia"
                    >
                      <option value="">Mês</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthNumber = String(i + 1).padStart(2, '0');
                        return (
                          <option key={monthNumber} value={monthNumber}>
                            {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </InputGroup>
                  <InputGroup style={{ display: 'inline-flex', width: 'auto' }}>
                    <Form.Select
                      id="anoReferencia"
                      name="anoReferencia"
                      value={formData.anoReferencia}
                      onChange={handleChange}
                      required
                      style={styles.formControl}
                      className="competencia"
                    >
                      <option value="">Ano</option>
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </InputGroup>
                </div>
                <span style={styles.formText}>
                  Mês/Ano de referência da guia
                </span>
              </Col>
            </Row>
            
            <div style={styles.buttonContainer}>
              <button 
                onClick={() => {
                  // Retorna para a memória de cálculo
                  navigate('/calculos', { state: { returnToMemory: true } });
                }}
                disabled={carregando}
                className={`guia-cancel-button ${carregando ? 'loading' : ''}`}
              >
                Cancelar
              </button>
              
              <button 
                id="gerarGPSButton"
                onClick={(e) => gerarGPS(e, false)}
                disabled={carregando}
                style={{
                  backgroundColor: '#28a745',
                  border: '1px solid #28a745',
                  color: '#fff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  minWidth: '120px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  if (!carregando) {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#28a745';
                    e.target.style.borderColor = '#28a745';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!carregando) {
                    e.target.style.backgroundColor = '#28a745';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = '#28a745';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                onMouseDown={(e) => {
                  if (!carregando) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {carregando ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{
                        display: 'inline-block',
                        width: '1rem',
                        height: '1rem',
                        border: '0.15em solid currentColor',
                        borderRightColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spinner-border 0.75s linear infinite',
                        marginRight: '0.5rem'
                      }}
                      role="status"
                      aria-hidden="true"
                    />
                    Processando...
                  </span>
                ) : 'Gerar GPS'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GuiaGPS;
