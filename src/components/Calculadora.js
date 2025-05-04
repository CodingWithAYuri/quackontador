import React, { useState } from 'react';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { calcularInssClt, calcularIrClt, calcularInssAutonomo } from '../components/Calculos';

const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const Calculadora = () => {
  const [salario, setSalario] = useState('');
  const [ano, setAno] = useState(2025);
  const [resultados, setResultados] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const salarioFloat = parseFloat(salario.replace(/\./g, '').replace(',', '.'));
    if (isNaN(salarioFloat) || salarioFloat <= 0) return;

    const inssClt = calcularInssClt(salarioFloat, ano);
    const irClt = calcularIrClt(salarioFloat - inssClt, ano);
    const inssAutonomo = calcularInssAutonomo(salarioFloat, ano);

    setResultados({ 
      inssClt: formatarMoeda(inssClt),
      irClt: formatarMoeda(irClt),
      inssAutonomo: formatarMoeda(inssAutonomo),
      salarioLiquidoClt: formatarMoeda(salarioFloat - inssClt - irClt),
      salarioLiquidoAutonomo: formatarMoeda(salarioFloat - inssAutonomo - irClt)
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
    <Container className="d-flex align-items-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="w-100 text-center">
        <h2 className="mb-4 text-white" style={{ fontSize: '2.5rem', fontWeight: '300' }}>Calculadora</h2>
        {resultados ? (
          <div className="mx-auto" style={{ maxWidth: '600px' }}>
            <div style={{ 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              padding: '20px'
            }}>
              <Table 
                responsive 
                bordered 
                size="sm" 
                className="mb-4 text-white"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  background: 'transparent'
                }}
              >
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <th className="text-center py-3" style={{ background: 'transparent' }}></th>
                    <th className="text-center py-3" style={{ background: 'transparent' }}>CLT</th>
                    <th className="text-center py-3" style={{ background: 'transparent' }}>Autônomo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-center py-3" style={{ background: 'transparent' }}>INSS</th>
                    <td className="text-center py-3" style={{ background: 'transparent' }}>{resultados.inssClt}</td>
                    <td className="text-center py-3" style={{ background: 'transparent' }}>{resultados.inssAutonomo}</td>
                  </tr>
                  <tr>
                    <th className="text-center py-3" style={{ background: 'transparent' }}>IR</th>
                    <td className="text-center py-3" style={{ background: 'transparent' }}>{resultados.irClt}</td>
                    <td className="text-center py-3" style={{ background: 'transparent' }}>{resultados.irClt}</td>
                  </tr>
                  <tr style={{ background: 'rgba(13, 110, 253, 0.15)' }}>
                    <th className="text-center py-3" style={{ background: 'transparent' }}>Salário Líquido</th>
                    <td className="text-center py-3 fw-bold" style={{ background: 'transparent' }}>{resultados.salarioLiquidoClt}</td>
                    <td className="text-center py-3 fw-bold" style={{ background: 'transparent' }}>{resultados.salarioLiquidoAutonomo}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <Button 
              onClick={handleNewCalculation} 
              variant="outline-light" 
              size="lg"
              className="mt-4 px-4"
              style={{ 
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out'
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
                <Form.Group controlId="ano" className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Form.Label className="text-white mb-0" style={{ fontSize: '1.1rem' }}>Ano</Form.Label>
                  </div>
                  <Form.Select
                    value={ano}
                    onChange={(e) => setAno(parseInt(e.target.value))}
                    style={{ 
                      height: '48px',
                      fontSize: '1.1rem',  
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 1) !important',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'black'
                    }}
                  >
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                className="px-5"
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