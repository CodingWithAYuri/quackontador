import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
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
  const [resultados, setResultados] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converter entrada para número corretamente
    const salarioNumerico = parseFloat(
      salario.replace(/\./g, '').replace(',', '.')
    );
  
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
        <h2 className="mb-4 text-white" style={{ fontSize: '2.5rem', fontWeight: '300' }}>Calculadora</h2>
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
                        color: '#212529'
                      }}></th>
                      <th className="text-center py-3 px-4" style={{
                        background: 'transparent',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529'
                      }}>CLT</th>
                      <th className="text-center py-3 px-4" style={{
                        background: 'transparent',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#212529'
                      }}>Autônomo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#ffffff' }}>
                      <th className="text-center py-3 px-4" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529' }}>INSS</th>
                      <td className="valor" style={{ fontSize: '1.1rem' }}>{resultados.inssClt}</td>
                      <td className="valor" style={{ fontSize: '1.1rem' }}>{resultados.inssAutonomo}</td>
                    </tr>
                    <tr style={{ background: '#f9f9f9' }}>
                      <th className="text-center py-3 px-4" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529' }}>IR</th>
                      <td className="valor" style={{ fontSize: '1.1rem' }}>{resultados.irClt}</td>
                      <td className="valor" style={{ fontSize: '1.1rem' }}>{resultados.irClt}</td>
                    </tr>
                    <tr style={{ background: '#ffffff', borderTop: '2px solid #dee2e6' }}>
                      <th className="text-center py-3 px-4" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529' }}>Salário Líquido</th>
                      <td className="valor total" style={{ fontSize: '1.1rem' }}>{resultados.salarioLiquidoClt}</td>
                      <td className="valor total" style={{ fontSize: '1.1rem' }}>{resultados.salarioLiquidoAutonomo}</td>
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
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'black'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <label htmlFor="ano" className="text-white mb-0" style={{ fontSize: '1.1rem' }}>Ano</label>
                  </div>
                  <select
                    id="ano"
                    value={ano}
                    onChange={(e) => setAno(parseInt(e.target.value))}
                    style={{
                      height: '48px',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'black',
                      backgroundColor: 'white',
                      padding: '0 5px',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                  >
                    <option value={2025} style={{ textAlign: 'center', backgroundColor: 'white !important' }}>2025</option>
                    <option value={2024} style={{ textAlign: 'center', backgroundColor: 'white !important' }}>2024</option>
                  </select>
                </div>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                variant="outline-light"
                size="lg"
                className="mt-3 px-5"
                style={{
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Calcular
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default Calculadora;