// Importa as dependências
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
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
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
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
    marginBottom: '1rem',
    '&:last-of-type': {
      marginBottom: 0
    },
    '&.compact': {
      marginBottom: '0.75rem'
    }
  },
  inputGroupText: {
    width: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
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
    backgroundColor: '#444',
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
    display: 'block'
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
    '&:hover': {
      backgroundColor: 'rgba(108, 117, 125, 0.1)',
      borderColor: '#fff'
    }
  },
  generateButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
      borderColor: '#1e7e34'
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
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    nit: '',
    valor: location.state?.valorInss || '0,00',
    mesReferencia: String(new Date().getMonth() + 1).padStart(2, '0'),
    anoReferencia: String(new Date().getFullYear()),
    competencia: ''
  });

  // Atualiza a competência quando mês ou ano mudam
  useEffect(() => {
    if (formData.mesReferencia && formData.anoReferencia) {
      setFormData(prev => ({
        ...prev,
        competencia: `${formData.mesReferencia}/${formData.anoReferencia}`
      }));
    }
  }, [formData.mesReferencia, formData.anoReferencia]);
  
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
  
  // Preenche o nome do usuário quando o componente é montado
  useEffect(() => {
    if (userName) {
      setFormData(prev => ({
        ...prev,
        nome: userName
      }));
    }
  }, [userName]);

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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
        }
      } catch (error) {
        console.error('Erro ao formatar valor do INSS:', error);
        setFormData(prev => ({
          ...prev,
          valor: '0,00'
        }));
      }
    }
  }, [location.state]);

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formata o campo de competência para aceitar apenas números e adicionar a barra automaticamente
    if (name === 'competencia') {
      // Remove tudo que não for número
      let formattedValue = value.replace(/\D/g, '');
      
      // Adiciona a barra após 2 dígitos
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 6);
      }
      
      // Limita o tamanho máximo (MM/AAAA)
      if (formattedValue.length > 7) {
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
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
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{5})(\d)/, '$1.$2')
      .replace(/(\d{2})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
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
    const dataNasc = new Date(formData.dataNascimento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data
    
    if (isNaN(dataNasc.getTime())) {
      setErro('❌ Data de nascimento inválida. Por favor, verifique a data informada.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    if (dataNasc >= hoje) {
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

  // Gera o PDF da guia GPS
  const gerarGPS = () => {
    // Foca no botão de gerar para garantir que o usuário veja o feedback visual
    const generateButton = document.getElementById('gerarGPSButton');
    if (generateButton) {
      generateButton.blur(); // Remove o foco para evitar múltiplos cliques
    }
    
    if (!validarFormulario()) return;
    
    setCarregando(true);
    
    // Adiciona um pequeno atraso para garantir que o estado de carregamento seja atualizado
    // antes de iniciar a geração do PDF (melhora a experiência do usuário)
    setTimeout(() => {
      try {
        // Cria o documento PDF
        const doc = new jsPDF();
        
        // Adiciona o cabeçalho
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Guia da Previdência Social', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Valida a competência
        if (!/^\d{2}\/\d{4}$/.test(formData.competencia)) {
          setErro('Por favor, informe uma competência válida no formato MM/AAAA');
          setCarregando(false);
          return;
        }
        
        // Dados da competência e valor
        const mesAno = formData.competencia;
        const dataVencimento = calcularVencimento(formData.competencia);
        
        // Garante que o valor esteja no formato correto para exibição
        const valorFormatado = (() => {
          try {
            // Converte o valor para número e formata novamente para garantir consistência
            const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
            return isNaN(valorNumerico) 
              ? 'R$ 0,00' 
              : 'R$ ' + valorNumerico.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                });
          } catch (error) {
            console.error('Erro ao formatar valor para PDF:', error);
            return 'R$ 0,00';
          }
        })();
        
        // Adiciona a tabela com os dados do contribuinte
        autoTable(doc, {
          startY: 35,
          head: [['CPF', 'Nome', 'NIT/PIS/PASEP']],
          body: [
            [
              formData.cpf,
              formData.nome.toUpperCase(),
              formData.nit
            ]
          ],
          theme: 'grid',
          headStyles: { fillColor: [220, 220, 220] },
          margin: { left: 14 }
        });
        
        // Ajusta o startY para posicionar a tabela de valores mais próxima da tabela de dados
        const startY = 60;
        
        // Tabela com competência e vencimento
        autoTable(doc, {
          startY: startY,
          head: [['Competência', 'Vencimento', 'Código do Pagamento', 'Valor']],
          body: [
            [
              mesAno,
              dataVencimento,
              '1007 - Contribuinte Individual',
              { content: valorFormatado, styles: { halign: 'right' } }
            ]
          ],
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 70 },
            3: { cellWidth: 30, halign: 'right' }
          },
          theme: 'grid',
          headStyles: { fillColor: [220, 220, 220] },
          margin: { left: 14 }
        });
        
        // Adicionar rodapé
        doc.setFontSize(8);
        doc.text('Documento de Arrecadação da Receita Federal do Brasil - GPS', 105, 150, { align: 'center' });
        doc.text('Impresso em: ' + new Date().toLocaleDateString(), 105, 155, { align: 'center' });
        
        // Salvar o PDF
        doc.save(`GPS-${formData.nome.split(' ')[0]}-${mesAno}.pdf`);
        
        // Navegar de volta após um pequeno atraso
        setTimeout(() => {
          setCarregando(false);
          const handleVoltar = () => {
            // Retorna para a calculadora com os valores anteriores
            navigate('/calculos', { 
              state: {
                manterValores: true,
                valorSalario: location.state?.valorSalario || '',
                anoSelecionado: location.state?.anoSelecionado || new Date().getFullYear()
              }
            });
          };
          handleVoltar();
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        setErro('❌ Ocorreu um erro ao gerar o PDF. Por favor, verifique os dados e tente novamente.');
        // Rola para o topo para mostrar a mensagem de erro
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCarregando(false);
      }
    }, 100);
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
          Voltar para o cálculo
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
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                    style={styles.formControl}
                    aria-required="true"
                    max={new Date().toISOString().split('T')[0]}
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
              <Col md={4} style={styles.inputGroup}>
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
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/calculos')}
                disabled={carregando}
                style={{ ...styles.button, ...styles.backButton }}
              >
                Cancelar
              </Button>
              
              <Button 
                id="gerarGPSButton"
                variant="primary" 
                onClick={gerarGPS}
                disabled={carregando}
                style={{ 
                  ...styles.button, 
                  ...styles.generateButton,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  ...(carregando ? {
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    opacity: 0.8,
                    cursor: 'wait'
                  } : {})
                }}
              >
                {carregando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Gerando...
                  </>
                ) : 'Gerar GPS'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GuiaGPS;
