import { faixasInss, faixasIr,salariosMinimos } from '../config/FaixasConfig';

export const calcularInssClt = (salario, ano) => {
  const faixas = faixasInss[ano];
  let total = 0;

  faixas.forEach(({ faixa_anterior, faixa_atual, aliquota }) => {
    if (salario > faixa_anterior) {
      total += (Math.min(salario, faixa_atual) - faixa_anterior) * aliquota;
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
  const salarioMinimo = salariosMinimos[ano];
  if (!salarioMinimo) {
    throw new Error(`Salário mínimo não definido para o ano ${ano}`);
  }

  const contribuicaoMinima = salariosMinimos * 0.2; // 20% do salário mínimo
  const contribuicaoMaxima = salariosMinimos * 11; // Teto baseado em 11 salários mínimos
  const contribuicao = salario * 0.2; // Contribuição padrão de 20%

  if (salario <= salariosMinimos) {
    return contribuicaoMinima.toFixed(2);
  }

  if (salario >= contribuicaoMaxima) {
    return contribuicaoMaxima.toFixed(2);
  }

  return contribuicao.toFixed(2);
};