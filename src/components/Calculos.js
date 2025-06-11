import { faixasInss, faixasIr,salariosMinimos } from '../config/FaixasConfig';

export const calcularInssClt = (salario, ano) => {
  const faixas = faixasInss[ano];
  const salarioMinimo = salariosMinimos[ano];
  const baseCalculo = Math.max(salario, salarioMinimo);
  let total = 0;

  faixas.forEach(({ faixa_anterior, faixa_atual, aliquota }) => {
    if (baseCalculo > faixa_anterior) {
      total += (Math.min(baseCalculo, faixa_atual) - faixa_anterior) * aliquota;
    }
  });

  return total.toFixed(2);
};

export const calcularIrClt = (salario, ano) => {
  const faixas = faixasIr[ano];

  for (const { limite, aliquota, parcela } of faixas) {
    if (salario <= limite) {
      const valorImposto = salario * aliquota - parcela;
      return Math.max(0, valorImposto).toFixed(2);
    }
  }
};

export const calcularInssAutonomo = (salario, ano) => {
  // Valores fixos para o teto do INSS por ano
  const tetoInss = {
    2024: 7786.02,
    2025: 8157.41
  };

  const salarioMinimo = salariosMinimos[ano];
  const teto = tetoInss[ano];
  
  if (!salarioMinimo || !teto) {
    throw new Error(`Parâmetros não definidos para o ano ${ano}`);
  }

  // Calcula 20% do salário bruto
  const contribuicao = salario * 0.2;
  
  // Se o salário for menor ou igual ao salário mínimo, retorna a contribuição mínima
  if (salario <= salarioMinimo) {
    return (salarioMinimo * 0.2).toFixed(2);
  }
  
  // Se o salário for maior que o teto do INSS, retorna a contribuição máxima
  if (salario > teto) {
    return (teto * 0.2).toFixed(2);
  }
  
  // Caso contrário, retorna 20% do salário
  return contribuicao.toFixed(2);
};