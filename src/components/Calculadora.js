import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { Printer } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const location = useLocation();
  const navigate = useNavigate();
  
  // Verifica se há estado de retorno da GuiaGPS
  useEffect(() => {
    if (location.state?.manterValores) {
      if (location.state.valorSalario) {
        setSalario(location.state.valorSalario);
      }
      if (location.state.anoSelecionado) {
        setAno(location.state.anoSelecionado);
        // Se houver salário, recalcula automaticamente
        if (location.state.valorSalario) {
          const salarioNumerico = parseFloat(location.state.valorSalario.replace(/\./g, '').replace(',', '.'));
          if (!isNaN(salarioNumerico)) {
            const inssClt = parseFloat(calcularInssClt(salarioNumerico, location.state.anoSelecionado));
            const irClt = parseFloat(calcularIrClt(salarioNumerico - inssClt, location.state.anoSelecionado));
            const inssAutonomo = parseFloat(calcularInssAutonomo(salarioNumerico, location.state.anoSelecionado));
            
            setResultados({
              inssClt: formatarMoeda(inssClt),
              irClt: formatarMoeda(irClt),
              inssAutonomo: formatarMoeda(inssAutonomo),
              salarioLiquidoClt: formatarMoeda(salarioNumerico - inssClt - irClt),
              salarioLiquidoAutonomo: formatarMoeda(salarioNumerico - inssAutonomo - irClt)
            });
          }
        }
      }
      // Limpa o estado de navegação para evitar recálculos indesejados
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const [salario, setSalario] = useState('');
  const [ano, setAno] = useState(2025);
  const [erro, setErro] = useState('');
  const [resultados, setResultados] = useState(null);

  const handleImprimirGuia = (tipo) => {
    if (tipo === 'GPS') {
      // Navega para a rota do GuiaGPS passando o valor do INSS e os dados atuais
      // Remove pontos de milhar e substitui vírgula por ponto para garantir um número válido
      const valorInss = resultados?.inssAutonomo 
        ? resultados.inssAutonomo.replace(/\./g, '').replace(',', '.')
        : '0.00';
        
      navigate('/guia-gps', { 
        state: { 
          valorInss: valorInss,
          valorSalario: salario,
          anoSelecionado: ano
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
      return;
    }
    
    const salarioNumerico = parseFloat(salario.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(salarioNumerico) || salarioNumerico <= 0) {
      setErro('Por favor, informe um valor de salário válido.');
      return;
    }
    
    setErro('');
    
    const inssClt = parseFloat(calcularInssClt(salarioNumerico, ano));
    const irClt = parseFloat(calcularIrClt(salarioNumerico - inssClt, ano));
    const inssAutonomo = parseFloat(calcularInssAutonomo(salarioNumerico, ano));
    
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
        <h2 className="mb-4 text-white" style={{ fontSize: '2.5rem', fontWeight: '300' }}>Calculadora</h2>
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
                  className="table-modern m-0"
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    borderCollapse: 'collapse',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    margin: 0,
                    width: '100%'
                  }}
                >
                  <thead>
                    <tr style={{
                      background: '#f8f9fa',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      <th className="text-center py-3" style={{
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        width: '25%'
                      }}></th>
                      <th className="text-center py-3" style={{
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        width: '25%'
                      }}>CLT</th>
                      <th 
                        colSpan="2"
                        className="text-center py-3" 
                        style={{
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          color: '#212529',
                          borderRight: '1px solid #dee2e6',
                          width: '50%'
                        }}
                      >
                        Autônomo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* INSS Row */}
                    <tr style={{ background: '#ffffff' }}>
                      <th className="text-center py-3" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>INSS</th>
                      <td className="text-right py-3 pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        {resultados.inssClt}
                      </td>
                      <td className="text-right py-3 pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        {resultados.inssAutonomo}
                      </td>
                      <td className="text-center py-3" style={{ 
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle',
                        width: '60px'
                      }}>
                        <Button 
                          variant="link" 
                          onClick={() => handleImprimirGuia('GPS')}
                          title="Imprimir GPS"
                          className="p-0"
                          style={{ 
                            color: '#28a745',
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}
                        >
                          <Printer style={{ fontSize: '1.1rem' }} />
                        </Button>
                      </td>
                    </tr>
                    
                    {/* IR Row */}
                    <tr style={{ background: '#f9f9f9' }}>
                      <th className="text-center py-3" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>IR</th>
                      <td className="text-right py-3 pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        {resultados.irClt}
                      </td>
                      <td className="text-right py-3 pe-4" style={{ 
                        fontSize: '1.1rem',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        {resultados.irClt}
                      </td>
                      <td className="text-center py-3" style={{ 
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle',
                        width: '60px'
                      }}>
                        <Button 
                          variant="link" 
                          onClick={() => handleImprimirGuia('DARF')}
                          title="Imprimir DARF"
                          className="p-0"
                          style={{ 
                            color: '#28a745',
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}
                        >
                          <Printer style={{ fontSize: '1.1rem' }} />
                        </Button>
                      </td>
                    </tr>
                    
                    {/* Salário Líquido Row */}
                    <tr style={{ background: '#ffffff', borderTop: '2px solid #dee2e6' }}>
                      <th className="text-center py-3" style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem', 
                        color: '#212529',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>Salário Líquido</th>
                      <td className="text-right py-3 pe-4" style={{ 
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>
                        {resultados.salarioLiquidoClt}
                      </td>
                      <td 
                        colSpan="2"
                        className="text-right py-3 pe-4" 
                        style={{ 
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          borderRight: '1px solid #dee2e6',
                          verticalAlign: 'middle'
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
                  variant="outline-light"
                  size="lg"
                  className="px-4"
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    marginTop: '0.75rem',
                    padding: '0.5rem 1.5rem'
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
