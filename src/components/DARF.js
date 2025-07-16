import React, { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Person, FileEarmarkText } from 'react-bootstrap-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useUserEmail } from '../hooks/useUserEmail';

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
    marginBottom: '1rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroupText: {
    width: '44px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--input-bg)',
    border: '1px solid #555',
    color: '#fff',
    borderRight: 'none',
    borderRadius: '6px 0 0 6px',
    fontSize: '1rem',
    padding: '0',
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
    padding: '0.5rem',
    borderRadius: '0 6px 6px 0',
    fontSize: '0.95rem',
    height: '38px',
    '&:focus': {
      backgroundColor: 'var(--input-bg)',
      color: '#fff',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    },
    '&:disabled': {
      backgroundColor: '#3a3a3a',
      color: '#777',
      cursor: 'not-allowed'
    }
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#fff'
  },
  formText: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#bbb',
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
  // Base button styles
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
    minWidth: '120px',
    cursor: 'pointer',
    boxShadow: 'none',
    transform: 'translateY(0)'
  },
  // Back button styles
  backButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #6c757d'
  },
  backButtonHover: {
    color: '#000',
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  backButtonActive: {
    transform: 'translateY(0)',
    boxShadow: 'none'
  },
  backButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  // Generate button styles
  generateButton: {
    backgroundColor: '#28a745',
    border: '1px solid #28a745',
    color: '#fff'
  },
  generateButtonHover: {
    backgroundColor: '#ffffff',
    color: '#28a745',
    borderColor: '#28a745',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  generateButtonActive: {
    transform: 'translateY(0)',
    boxShadow: 'none'
  },
  generateButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  errorAlert: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    border: '1px solid #dc3545',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    width: '100%',
    textAlign: 'center'
  },
  loadingSpinner: {
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
    color: '#fff',
    textDecoration: 'none',
    marginBottom: '1.5rem',
    '&:hover': {
      color: '#80bdff',
      textDecoration: 'none'
    }
  },
  backIcon: {
    marginRight: '0.5rem'
  }
};

const DARF = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // User email is not currently used in the component
  useUserEmail();
  const { userData, updateUserData } = useUserData();
  
  // Estado local para o formulário
  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    cpf: userData.cpf || '',
    codigoReceita: userData.codigoReceita || '0190',
    mesReferencia: userData.mesReferencia || '',
    anoReferencia: userData.anoReferencia || '',
    valorIr: location.state?.valorIr || '0,00'
  });
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Atualiza o contexto quando os dados do formulário mudam
  useEffect(() => {
    updateUserData(formData);
  }, [formData, updateUserData]);
  
  // Atualiza o estado quando location.state mudar
  useEffect(() => {
    if (location.state?.valorIr) {
      setFormData(prev => ({
        ...prev,
        valorIr: location.state.valorIr
      }));
    }
  }, [location.state]);
  
  // Manipulador de mudança dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro de validação do campo alterado
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validação do formulário
  const validarFormulario = () => {
    const errors = {};
    let valido = true;
    
    // Valida CPF (apenas se estiver preenchido)
    if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      errors.cpf = 'CPF inválido. Formato esperado: 000.000.000-00';
      valido = false;
    }
    
    // Valida campos obrigatórios
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
      valido = false;
    }
    
    if (!formData.codigoReceita) {
      errors.codigoReceita = 'Código da Receita é obrigatório';
      valido = false;
    }
    
    if (!formData.mesReferencia) {
      errors.mesReferencia = 'Mês de referência é obrigatório';
      valido = false;
    }
    
    if (!formData.anoReferencia) {
      errors.anoReferencia = 'Ano de referência é obrigatório';
      valido = false;
    }
    
    // Valida valor do IR
    const valorNumerico = parseFloat(formData.valorIr.replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      errors.valorIr = 'Valor do IR deve ser maior que zero';
      valido = false;
    }
    
    setValidationErrors(errors);
    return valido;
  };
  
  // Formata o CPF
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    
    // Remove tudo que não for dígito
    const numeros = cpf.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const cpfLimitado = numeros.substring(0, 11);
    
    // Aplica a máscara
    return cpfLimitado
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  
  // Formata o valor monetário
  const formatarValor = (valor) => {
    if (!valor) return '0,00';
    
    // Remove tudo que não for dígito
    const numeros = valor.replace(/\D/g, '');
    
    // Converte para número e formata como moeda
    const numero = parseFloat(numeros) / 100;
    
    // Formata como moeda brasileira
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Manipulador de mudança do CPF
  const handleCPFChange = (e) => {
    const { value } = e.target;
    const cpfFormatado = formatarCPF(value);
    
    setFormData(prev => ({
      ...prev,
      cpf: cpfFormatado
    }));
    
    // Limpa o erro de validação do CPF
    if (validationErrors.cpf) {
      setValidationErrors(prev => ({
        ...prev,
        cpf: ''
      }));
    }
  };
  
  // Manipulador de mudança do valor do IR
  const handleValorChange = (e) => {
    const { value } = e.target;
    const valorFormatado = formatarValor(value);
    
    setFormData(prev => ({
      ...prev,
      valorIr: valorFormatado
    }));
    
    // Limpa o erro de validação do valor
    if (validationErrors.valorIr) {
      setValidationErrors(prev => ({
        ...prev,
        valorIr: ''
      }));
    }
  };
  
  // Gera o PDF da DARF
  const gerarDARF = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      setErro('Por favor, preencha todos os campos obrigatórios corretamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      setCarregando(true);
      setErro('');
      
      // Cria um novo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Adiciona o título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('DARF - Documento de Arrecadação de Receitas Federais', 105, 20, { align: 'center' });
      
      // Adiciona os dados do contribuinte
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('DADOS DO CONTRIBUINTE', 14, 40);
      
      // Linha horizontal
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(14, 43, 200 - 14, 43);
      
      // Tabela de dados
      const dados = [
        ['Nome:', formData.nome],
        ['CPF:', formData.cpf || 'Não informado'],
        ['Código da Receita:', formData.codigoReceita],
        ['Competência:', `${formData.mesReferencia}/${formData.anoReferencia}`],
        ['Valor a Pagar:', `R$ ${formData.valorIr}`]
      ];
      
      // Adiciona a tabela
      doc.autoTable({
        startY: 50,
        head: [['Campo', 'Valor']],
        body: dados,
        theme: 'grid',
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });
      
      // Adiciona o rodapé
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Este documento foi gerado pelo Quackontador App e não substitui o DARF oficial.', 105, 280, { align: 'center' });
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 105, 284, { align: 'center' });
      
      // Salva o PDF
      doc.save(`DARF_${formData.nome.replace(/\s+/g, '_')}_${formData.mesReferencia}_${formData.anoReferencia}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar DARF:', error);
      setErro('Ocorreu um erro ao gerar o DARF. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.formContainer}>
          <a 
            href="/calculos" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/calculos', { 
                state: { 
                  returnToMemory: true,
                  valorSalario: location.state?.valorSalario || '',
                  anoSelecionado: location.state?.anoSelecionado || new Date().getFullYear()
                }
              });
            }}
            style={styles.backLink}
          >
            <ArrowLeft style={styles.backIcon} /> Voltar para a memória dos cálculos
          </a>
          
          <h2 style={styles.formTitle}>DARF - Documento de Arrecadação de Receitas Federais</h2>
          <p style={styles.formSubtitle}>Preencha os dados abaixo para gerar o DARF</p>
          
          {erro && (
            <Alert variant="danger" style={styles.errorAlert}>
              {erro}
            </Alert>
          )}
          
          <Form onSubmit={gerarDARF} style={{ width: '100%' }}>
            <Row>
              <Col md={8}>
                <Form.Group style={styles.inputGroup}>
                  <Form.Label style={styles.label}>Nome Completo *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={styles.inputGroupText}>
                      <Person />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      style={{ ...styles.formControl, textAlign: 'left' }}
                      isInvalid={!!validationErrors.nome}
                    />
                  </InputGroup>
                  {validationErrors.nome && (
                    <span style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                      {validationErrors.nome}
                    </span>
                  )}
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group style={styles.inputGroup}>
                  <Form.Label style={styles.label}>CPF</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={styles.inputGroupText}>
                      <Person />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      style={{ ...styles.formControl, textAlign: 'center' }}
                      isInvalid={!!validationErrors.cpf}
                    />
                  </InputGroup>
                  {validationErrors.cpf && (
                    <span style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                      {validationErrors.cpf}
                    </span>
                  )}
                  <span style={styles.formText}>
                    Formato: 000.000.000-00
                  </span>
                </Form.Group>
              </Col>
            </Row>
            
            <Row style={{ marginTop: '1rem' }}>
              <Col md={3}>
                <Form.Group style={styles.inputGroup}>
                  <Form.Label style={styles.label}>Código da Receita *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={styles.inputGroupText}>
                      <FileEarmarkText />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      id="codigoReceita"
                      name="codigoReceita"
                      value={formData.codigoReceita}
                      onChange={handleChange}
                      required
                      style={{ ...styles.formControl, textAlign: 'center' }}
                      isInvalid={!!validationErrors.codigoReceita}
                    />
                  </InputGroup>
                  <span style={styles.formText}>
                    Código da Receita
                  </span>
                </Form.Group>
              </Col>
              
              <Col md={5}>
                <Form.Group style={styles.inputGroup}>
                  <Form.Label style={styles.label}>Competência *</Form.Label>
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
                        isInvalid={!!validationErrors.mesReferencia}
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
                        isInvalid={!!validationErrors.anoReferencia}
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
                  {(validationErrors.mesReferencia || validationErrors.anoReferencia) && (
                    <span style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                      {validationErrors.mesReferencia || validationErrors.anoReferencia}
                    </span>
                  )}
                  <span style={styles.formText}>
                    Mês/Ano de referência
                  </span>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group style={styles.inputGroup}>
                  <Form.Label style={styles.label}>Valor a Pagar *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{...styles.inputGroupText, borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                      R$
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      id="valorIr"
                      name="valorIr"
                      value={formData.valorIr}
                      onChange={handleValorChange}
                      placeholder="0,00"
                      required
                      style={{ ...styles.formControl, textAlign: "right", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      isInvalid={!!validationErrors.valorIr}
                    />
                  </InputGroup>
                  {validationErrors.valorIr && (
                    <span style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                      {validationErrors.valorIr}
                    </span>
                  )}
                  <span style={styles.formText}>
                    Valor do IR Autônomo
                  </span>
                </Form.Group>
              </Col>
            </Row>
            
            <div style={styles.buttonContainer}>
              <button 
                type="button"
                onClick={() => {
                  navigate('/calculos', { 
                    state: { 
                      returnToMemory: true,
                      valorSalario: location.state?.valorSalario || '',
                      anoSelecionado: location.state?.anoSelecionado || new Date().getFullYear()
                    }
                  });
                }}
                disabled={carregando}
                style={carregando ? 
                  {...styles.button, ...styles.backButton, ...styles.backButtonDisabled} : 
                  {...styles.button, ...styles.backButton}
                }
                onMouseOver={(e) => !carregando && Object.assign(e.target.style, styles.backButtonHover)}
                onMouseOut={(e) => {
                  if (!carregando) {
                    Object.assign(e.target.style, styles.button, styles.backButton);
                  }
                }}
                onMouseDown={(e) => !carregando && Object.assign(e.target.style, styles.backButtonActive)}
                onMouseUp={(e) => !carregando && Object.assign(e.target.style, styles.backButtonHover)}
              >
                Voltar
              </button>
              
              <button 
                type="submit" 
                disabled={carregando}
                style={carregando ? 
                  {...styles.button, ...styles.generateButton, ...styles.generateButtonDisabled} : 
                  {...styles.button, ...styles.generateButton}
                }
                onMouseOver={(e) => {
                  if (!carregando) {
                    e.target.style.backgroundColor = styles.generateButtonHover.backgroundColor;
                    e.target.style.color = styles.generateButtonHover.color;
                    e.target.style.borderColor = styles.generateButtonHover.borderColor;
                    e.target.style.transform = styles.generateButtonHover.transform;
                    e.target.style.boxShadow = styles.generateButtonHover.boxShadow;
                  }
                }}
                onMouseOut={(e) => {
                  if (!carregando) {
                    e.target.style.backgroundColor = styles.generateButton.backgroundColor;
                    e.target.style.color = styles.generateButton.color;
                    e.target.style.borderColor = styles.generateButton.borderColor;
                    e.target.style.transform = styles.button.transform;
                    e.target.style.boxShadow = styles.button.boxShadow;
                  }
                }}
                onMouseDown={(e) => !carregando && Object.assign(e.target.style, styles.generateButtonActive)}
                onMouseUp={(e) => !carregando && Object.assign(e.target.style, styles.generateButtonHover)}
              >
                {carregando ? (
                  <>
                    <span style={styles.loadingSpinner}></span>
                    Gerando...
                  </>
                ) : 'Gerar DARF'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DARF;
