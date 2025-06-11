import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { Printer } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { calcularInssClt, calcularIrClt, calcularInssAutonomo } from '../components/Calculos';

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

const Calculadora = () => {
  useEffect(() => {
    // Sempre zera o margin-bottom inline das tabelas modernas
    const fixTableMargin = () => {
      document.querySelectorAll('table.table-modern').forEach(table => {
        table.style.marginBottom = '0px';
      });
    };
    fixTableMargin();

    // Também observa alterações futuras no DOM
    const observer = new MutationObserver(fixTableMargin);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    return () => observer.disconnect();
  }, []);

  const [salario, setSalario] = useState('');
  const [ano, setAno] = useState(2025);
  const [erro, setErro] = useState('');
  const [resultados, setResultados] = useState(null);
  
  const navigate = useNavigate();

  const handleImprimirGuia = (tipo) => {
    if (tipo === 'GPS') {
      // Navega para a rota do GuiaGPS passando o valor do INSS
      // Remove pontos de milhar e substitui vírgula por ponto para garantir um número válido
      const valorInss = resultados?.inssAutonomo 
        ? resultados.inssAutonomo.replace(/\./g, '').replace(',', '.')
        : '0.00';
        
      navigate('/guia-gps', { 
        state: { 
          valorInss: valorInss
        } 
      });
    } else if (tipo === 'DARF') {
      // Lógica para DARF (pode ser implementada posteriormente)
      console.log('Gerar DARF');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros anteriores
    
    // Verifica se o campo está vazio
    if (!salario.trim()) {
      setErro('Por favor, insira um valor de salário válido.');
      setResultados(null);
      return;
    }
    
    // Converter entrada para número corretamente
    const salarioNumerico = parseFloat(
      salario.replace(/\./g, '').replace(',', '.')
    );
    
    // Verifica se o valor é um número válido e maior que zero
    if (isNaN(salarioNumerico) || salarioNumerico <= 0) {
      setErro('Por favor, insira um valor de salário válido maior que zero.');
      setResultados(null);
      return;
    }
  
    // Garantir que os cálculos retornem números
    const inssClt = Number(calcularInssClt(salarioNumerico, ano));
    const irClt = Number(calcularIrClt(salarioNumerico - inssClt, ano));
    const inssAutonomo = Number(calcularInssAutonomo(salarioNumerico, ano));
  
    // Aplicar formatação
    setResultados({
      inssClt: formatarMoeda(inssClt),
      irClt: formatarMoeda(irClt),
      inssAutonomo: formatarMoeda(inssAutonomo),
      salarioLiquidoClt: formatarMoeda(salarioNumerico - inssClt - irClt),
      salarioLiquidoAutonomo: formatarMoeda(salarioNumerico - inssAutonomo - irClt)
    });
  };

  const handleNewCalculation = () => {
    setResultados(null);
    setSalario('');
  };

  const handleSalarioChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    valor = (Number(valor) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setSalario(valor);
  };

  return (
    <Container className="d-flex align-items-center" style={{ minHeight: 'calc(100vh - 140px)', padding: '0 20px' }}>
      <div className="w-100 text-center">
        <h2 className="mb-2 text-white" style={{ fontSize: '2.5rem', fontWeight: '300' }}>Calculadora</h2>
        {erro && (
          <div className="alert alert-danger mx-auto mb-3" style={{ maxWidth: '500px' }}>
            {erro}
          </div>
        )}
        {resultados ? (
          <div className="mx-auto" style={{ maxWidth: '600px' }}>
            <div style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              background: '#333',
              backdropFilter: 'blur(10px)',
              padding: '10px',
              marginBottom: 0
            }}>
              <div className="mb-0 p-0" style={{ margin: 0, padding: 0 }}>
                <Table
                  responsive
                  bordered
                  size="sm"
                  className="table-modern"
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: 0
                  }}
                >
                  <thead>
                    <tr style={{
                      background: '#f8f9fa',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      <th className="text-center py-3 px-4" style={{
                        background: 'transparent',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529',
                        borderRight: '1px solid #dee2e6'
                      }}></th>
                      <th className="text-center py-3 px-4" style={{
                        background: 'transparent',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529',
                        borderRight: '1px solid #dee2e6'
                      }}>CLT</th>
                      <th 
                        colSpan="2"
                        className="text-center py-3 px-4" 
                        style={{
                          background: 'transparent',
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          color: '#212529',
                          borderRight: '1px solid #dee2e6'
                        }}
                      >
                        Autônomo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#ffffff' }}>
                      <th className="text-center py-3 px-4" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>INSS</th>
                      <td className="valor text-right pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{resultados.inssClt}</td>
                      <td className="valor text-right pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        <div className="d-flex align-items-center justify-content-end">
                          <span className="me-2">{resultados.inssAutonomo}</span>
                          <Button 
                            variant="link" 
                            className="p-0 d-inline-flex align-items-center justify-content-center"
                            onClick={() => handleImprimirGuia('GPS')}
                            title="Imprimir GPS"
                            style={{ 
                              width: '32px',
                              height: '32px',
                              padding: '0.25rem',
                              flexShrink: 0
                            }}
                          >
                            <Printer className="text-primary" style={{ fontSize: '1.1rem' }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr style={{ background: '#f9f9f9' }}>
                      <th className="text-center py-3 px-4" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>IR</th>
                      <td className="valor text-right pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{resultados.irClt}</td>
                      <td className="valor text-right pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        <div className="d-flex align-items-center justify-content-end">
                          <span className="me-2">{resultados.irClt}</span>
                          <Button 
                            variant="link" 
                            className="p-0 d-inline-flex align-items-center justify-content-center"
                            onClick={() => handleImprimirGuia('DARF')}
                            title="Imprimir DARF"
                            style={{ 
                              width: '32px',
                              height: '32px',
                              padding: '0.25rem',
                              flexShrink: 0
                            }}
                          >
                            <Printer className="text-primary" style={{ fontSize: '1.1rem' }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr style={{ background: '#ffffff', borderTop: '2px solid #dee2e6' }}>
                      <th className="text-center py-3 px-4" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6'
                      }}>Salário Líquido</th>
                      <td className="valor total text-right pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6'
                      }}>{resultados.salarioLiquidoClt}</td>
                      <td 
                        colSpan="2"
                        className="valor total text-center" 
                        style={{ 
                          fontSize: '1.1rem',
                          borderRight: '1px solid #dee2e6',
                          padding: '0.75rem 0'
                        }}
                      >
                        {resultados.salarioLiquidoAutonomo}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <Button
              onClick={handleNewCalculation}
              variant="outline-light"
              size="lg"
              className="mt-4 px-4"
              style={{
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Novo Cálculo
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
            <Row className="g-4">
              <Col xs={8}>
                <Form.Group controlId="salario" className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Form.Label className="text-white mb-0" style={{ fontSize: '1.1rem' }}>Salário Mensal (R$)</Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    value={salario}
                    onChange={handleSalarioChange}
                    placeholder="0,00"
                    inputMode="decimal"
                    style={{
                      height: '48px',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 1) !important',
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="ano" className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Form.Label className="text-white mb-0" style={{ fontSize: '1.1rem' }}>Ano</Form.Label>
                  </div>
                  <Form.Select
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    style={{
                      height: '48px',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 1) !important',
                    }}
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} className="d-flex justify-content-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-5"
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    marginTop: '1.5rem'
                  }}
                >
                  Calcular
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default Calculadora;
