/**
 * Formata um CPF no padrão 000.000.000-00
 * @param {string} value - O valor do CPF a ser formatado
 * @returns {string} O CPF formatado
 */
export const formatCPF = (value) => {
  if (!value) return '';
  
  // Remove tudo que não for dígito
  const numeros = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const cpf = numeros.slice(0, 11);
  
  // Aplica a formatação
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

/**
 * Remove a formatação de um CPF, retornando apenas os dígitos
 * @param {string} cpf - O CPF formatado
 * @returns {string} O CPF com apenas dígitos
 */
export const unformatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};
