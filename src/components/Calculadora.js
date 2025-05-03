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
        <h2 className="mb-4">Calculadora</h2>
        {resultados ? (
          <div className="mx-auto" style={{ maxWidth: '600px' }}>
            <Table responsive bordered size="sm" className="mb-3">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">CLT</th>
                  <th className="text-center">Autônomo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>INSS</th>
                  <td className="text-center">{resultados.inssClt}</td>
                  <td className="text-center">{resultados.inssAutonomo}</td>
                </tr>
                <tr>
                  <th>IR</th>
                  <td className="text-center">{resultados.irClt}</td>
                  <td className="text-center">{resultados.irClt}</td>
                </tr>
                <tr className="table-primary">
                  <th>Salário Líquido</th>
                  <td className="text-center fw-bold">{resultados.salarioLiquidoClt}</td>
                  <td className="text-center fw-bold">{resultados.salarioLiquidoAutonomo}</td>
                </tr>
              </tbody>
            </Table>
            <Button 
              onClick={handleNewCalculation} 
              variant="outline-primary" 
              size="sm"
            >
              Novo Cálculo
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
            <Row className="g-3">
  <Col xs={8}>
    <Form.Group controlId="salario" className="d-flex flex-column">
      <div style={{ height: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <Form.Label className="mb-0">Salário Mensal (R$)</Form.Label>
      </div>
      <Form.Control
        type="text"
        value={salario}
        onChange={handleSalarioChange}
        placeholder="0,00"
        inputMode="decimal"
      />
    </Form.Group>
  </Col>
  <Col xs={4}>
    <Form.Group controlId="ano" className="d-flex flex-column">
      <div style={{ height: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <Form.Label className="mb-0">Ano</Form.Label>
      </div>
      <Form.Select
        value={ano}
        onChange={(e) => setAno(parseInt(e.target.value))}
        size="sm"
      >
        <option value={2025}>2025</option>
        <option value={2024}>2024</option>
      </Form.Select>
    </Form.Group>
  </Col>
</Row>
            <div className="d-flex justify-content-center mt-3">
              <Button 
                type="submit" 
                variant="primary" 
                className="fs-6"
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