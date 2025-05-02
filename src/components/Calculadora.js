import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { calcularInssClt, calcularIrClt } from '../components/Calculos';
import { calcularInssAutonomo } from '../components/Calculos';

const Calculadora = () => {
  const [salario, setSalario] = useState('');
  const [ano, setAno] = useState(2024);
  const [resultados, setResultados] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const salarioFloat = parseFloat(salario);
    if (isNaN(salarioFloat) || salarioFloat <= 0) return;

    const inssClt = calcularInssClt(salarioFloat, ano);
    const irClt = calcularIrClt(salarioFloat, ano);
    const inssAutonomo = calcularInssAutonomo(salarioFloat, ano);

    setResultados({ inssClt, irClt, inssAutonomo });
  };

  const handleNewCalculation = () => {
    setResultados(null);
    setSalario('');
  };

  return (
    <Container className="d-flex flex-column justify-content-center min-vh-100">
      <h1 className="text-center mb-5">Calculadora</h1>
      {resultados ? (
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>CLT</th>
                <th>Autônomo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>INSS</th>
                <td>{resultados.inssClt}</td>
                <td>{resultados.inssAutonomo}</td>
              </tr>
              <tr>
                <th>IR</th>
                <td>{resultados.irClt}</td>
                <td>{resultados.irClt}</td>
              </tr>
            </tbody>
          </table>
          <Button onClick={handleNewCalculation}>Novo Cálculo</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-100">
          <div className="mx-auto" style={{ maxWidth: '500px' }}>
            <div className="form-group mb-4">
            <label htmlFor="salario">Salário Mensal</label>
            <input
              type="number"
              id="salario"
              className="form-control"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
          </div>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="ano">Ano</label>
            <select
              id="ano"
              className="form-control"
              value={ano}
              onChange={(e) => setAno(parseInt(e.target.value))}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
          <Button type="submit">Calcular</Button>
        </form>
      )}
    </Container>
  );
};

export default Calculadora;
