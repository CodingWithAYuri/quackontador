export const faixasInss = {
  2024: [
    { faixa_anterior: 0, faixa_atual: 1412, aliquota: 0.075 },
    { faixa_anterior: 1412.01, faixa_atual: 2666.68, aliquota: 0.09 },
    { faixa_anterior: 2666.69, faixa_atual: 4000.03, aliquota: 0.12 },
    { faixa_anterior: 4000.04, faixa_atual: 7786.02, aliquota: 0.14 },
  ],
  2025: [
    { faixa_anterior: 0, faixa_atual: 1518, aliquota: 0.075 },
    { faixa_anterior: 1518.01, faixa_atual: 2793.88, aliquota: 0.09 },
    { faixa_anterior: 2793.89, faixa_atual: 4190.83, aliquota: 0.12 },
    { faixa_anterior: 4190.84, faixa_atual: 8157.41, aliquota: 0.14 },
  ],
};

export const faixasIr = {
  2024: [
    { limite: 2259.20, aliquota: 0.00, parcela: 0.00 },
    { limite: 2826.65, aliquota: 0.075, parcela: 169.44 },
    { limite: 3751.05, aliquota: 0.15, parcela: 381.44 },
    { limite: 4664.68, aliquota: 0.225, parcela: 662.77 },
    { limite: Infinity, aliquota: 0.275, parcela: 896.00 },
  ],
};

// Apontamento das faixas de 2024 para 2025
faixasIr[2025] = faixasIr[2024];

export const salariosMinimos = {
  2024: 1412.00,
  2025: 1518.00,
};