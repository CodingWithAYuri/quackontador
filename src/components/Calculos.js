import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';

const Calculos = () => {
  const [salario, setSalario] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [inssClt, setInssClt] = useState(null);
  const [inssAutonomo, setInssAutonomo] = useState(null);
  const [irpfClt, setIrpfClt] = useState(null);
  const [irpfAutonomo, setIrpfAutonomo] = useState(null);

  const calculaInss = (salario) => {
    let total_a_recolher = 0;
    let faixa_anterior, faixa_atual, aliquota_faixa_atual;

    faixa_anterior = 0;
    faixa_atual = 1412;
    aliquota_faixa_atual = 0.075;

    if (salario >= faixa_anterior) {
      total_a_recolher += (Math.min(salario, faixa_atual) - faixa_anterior) * aliquota_faixa_atual;
    }

    faixa_anterior = 1412.00;
    faixa_atual = 2666.68;
    aliquota_faixa_atual = 0.09;

    if (salario >= faixa_anterior) {
      total_a_recolher += (Math.min(salario, faixa_atual) - faixa_anterior) * aliquota_faixa_atual;
    }

    faixa_anterior = 2666.69;
    faixa_atual = 4000.03;
    aliquota_faixa_atual = 0.12;

    if (salario >= faixa_anterior) {
      total_a_recolher += (Math.min(salario, faixa_atual) - faixa_anterior) * aliquota_faixa_atual;
    }

    faixa_anterior = 4000.04 ;
    faixa_atual = 7786.02;
    aliquota_faixa_atual = 0.14;

    if (salario >= faixa_anterior) {
      total_a_recolher += (Math.min(salario, faixa_atual) - faixa_anterior) * aliquota_faixa_atual;
    }

    return total_a_recolher.toFixed(2);
  };

  const calculoIr = (salario) => {
    const subtotal = parseFloat(salario);

    if (subtotal <= 2259.20) {
      const aliquota = 0.00;
      const parcela = 0.00;
      return calculoIrTotal(subtotal, aliquota, parcela);
    }

    if (subtotal >= 2259.21 && subtotal <= 2826.65) {
      const aliquota = 0.075;
      const parcela = 169.44;
      return calculoIrTotal(subtotal, aliquota, parcela);
    }

    if (subtotal >= 2826.66 && subtotal <= 3751.05) {
      const aliquota = 0.15;
      const parcela = 381.44;
      return calculoIrTotal(subtotal, aliquota, parcela);
    }

    if (subtotal >= 3751.06 && subtotal <= 4664.68) {
      const aliquota = 0.225;
      const parcela = 662.77;
      return calculoIrTotal(subtotal, aliquota, parcela);
    }

    if (subtotal > 4664.68) {
      const aliquota = 0.275;
      const parcela = 896.00;
      return calculoIrTotal(subtotal, aliquota, parcela);
    }
  };

  const calculoIrTotal = (subtotal, aliquota, parcela) => {
    const valorImposto = (subtotal * aliquota) - parcela;
    const valorFormatado = parseFloat(valorImposto.toFixed(2));
    return valorFormatado;
  };

  const calculaInssAutonomo = (salario) => {
    const aliquota = 0.2;
    const contribuicaoMinima = 282.40;
    const contribuicaoMaxima = 1557.20;
    const contribuicao = salario * aliquota;

    if (salario <= 1412.00) {
      return contribuicaoMinima.toFixed(2);
    }

    if (salario >= 1412.01 && salario <= 7786.02) {
      return contribuicao.toFixed(2);
    }

    if (salario >= 7786.02) {
      return contribuicaoMaxima.toFixed(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o salário é um número válido
  const salarioFloat = parseFloat(salario);
  if (isNaN(salarioFloat) || salarioFloat <= 0) {
    // Se não for um número válido, pode retornar ou exibir uma mensagem de erro
    // Neste exemplo, apenas retornamos sem fazer nada
    return;
  }

     // Reset dos resultados e o estado showResults
     setInssClt(null);
     setInssAutonomo(null);
     setIrpfClt(null);
     setIrpfAutonomo(null);
     setShowResults(false);

     // Calculos

    const resultadoInssClt = calculaInss(salario);
    const resultadoInssAutonomo = calculaInssAutonomo(salario);
    const resultadoIrpfClt = calculoIr(salario);
    const resultadoIrpfAutonomo = calculoIr(salario);

    // Atualizacao dos estados com os novos resultados

    setInssClt(resultadoInssClt);
    setInssAutonomo(resultadoInssAutonomo);
    setIrpfClt(resultadoIrpfClt);
    setIrpfAutonomo(resultadoIrpfAutonomo);

    setShowResults(true);
  };

  const handleNewCalculation = () => {
    // Resetando o estado e resultados para um novo cálculo
    setShowResults(false);
    setSalario('');
  };

  return (
    <main role="main" className="inner cover text-center d-flex justify-content-center align-items-center">
      <Container>
        <h1 className='container mb-5'>Calculadora</h1>
        {showResults ? (
          <div>
            <table className="table table-striped disable-bootstrap-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">CLT</th>
                  <th scope="col">Autônomo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">INSS</th>
                  <td data-testid="inssClt">{inssClt}</td>
                  <td data-testid="inssAutonomo">{inssAutonomo}</td>
                </tr>
                <tr>
                  <th scope="row">Imposto de Renda</th>
                  <td data-testid="irpfClt" className="irpf">{irpfClt}</td>
                  <td data-testid="irpfAutonomo" className="irpf">{irpfAutonomo}</td>
                </tr>
              </tbody>
            </table>
            <Button variant="info" onClick={handleNewCalculation}>
              Novo Cálculo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group row mb-4">
              <label htmlFor="salario" className="col-sm-3 col-form-label text-xl font-weight-bold">
                Salário mensal
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  id="salario"
                  placeholder=""
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                />
              </div>

              <div className="col-sm-3">
                <button type="submit" className="btn btn-info btn-round">
                  Calcular
                </button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
};

export default Calculos;