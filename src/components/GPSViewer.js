import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Função para gerar um código de barras CODE128
const generateBarcode = (text, scale = 2, height = 50) => {
  // Tabela de caracteres CODE128 (simplificada para números e letras maiúsculas)
  const patterns = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
    'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001100',
    'G': '10011101100', 'H': '10011100110', 'I': '11001110010', 'J': '11001011100',
    'K': '11001001110', 'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
    'O': '11101001100', 'P': '11100101100', 'Q': '11100100110', 'R': '11101100100',
    'S': '11100110100', 'T': '11100110010', 'U': '11011011000', 'V': '11011000110',
    'W': '11000110110', 'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110'
  };

  // Remove qualquer caractere que não esteja na tabela de padrões
  text = text.toString().replace(/[^0-9A-Z]/g, '').toUpperCase();

  // Cria um canvas temporário
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Calcula a largura total necessária (apenas para as barras pretas)
  let totalBars = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (patterns[char]) {
      // Conta apenas as barras pretas (1s) no padrão
      totalBars += (patterns[char].match(/1/g) || []).length;
    }
  }
  
  // Configura as dimensões do canvas
  const barWidth = scale;
  const padding = 10 * scale;
  const charSpacing = scale * 2;
  
  // Largura total = (largura das barras) + (espaçamento entre caracteres) + (margens)
  canvas.width = (totalBars * barWidth) + ((text.length - 1) * charSpacing) + (padding * 2);
  canvas.height = height + (scale * 10); // Altura + espaço para o texto
  
  // Preenche o fundo de branco
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Desenha as barras
  let x = padding;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (patterns[char]) {
      const pattern = patterns[char];
      
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] === '1') { // Desenha apenas as barras pretas
          ctx.fillStyle = 'black';
          ctx.fillRect(x, 0, barWidth, height);
        }
        x += barWidth;
      }
      
      // Adiciona espaçamento entre caracteres
      x += charSpacing;
    }
  }
  
  // Retorna apenas a imagem do código de barras, sem texto
  return canvas.toDataURL('image/png');
};

// Estilos para o componente
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#333',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #3d3d3d',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    position: 'relative',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  primaryButton: {
    backgroundColor: '#3a7bd5',
    color: 'white',
    ':hover': {
      backgroundColor: '#2c5fb3',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      backgroundColor: '#3d3d3d',
      color: '#888',
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  closeButton: {
    backgroundColor: '#444',
    color: '#333',
    ':hover': {
      backgroundColor: '#555',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  pdfContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#333',
    position: 'relative',
    overflow: 'auto',
    padding: '10px 0',
  },
  iframe: {
    width: '95%',
    maxWidth: '800px',
    height: 'calc(100vh - 100px)',
    minHeight: '500px',
    border: 'none',
    backgroundColor: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    borderRadius: '4px',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    color: '#333',
    zIndex: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    zIndex: 100,
  },
};

const GPSViewer = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    pdfUrl: null,
    formData: null,
  });
  
  const pdfRef = useRef(null);
  const isMountedRef = useRef(true);
  const pdfBlobUrlRef = useRef(null);

  // Função para formatar data no padrão brasileiro (dd/mm/yyyy)
  const formatarDataBrasileira = (dataString) => {
    console.log('Data original:', dataString);
    if (!dataString) return '';
    
    // Se já estiver no formato brasileiro, retorna como está
    if (typeof dataString === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dataString)) {
      return dataString;
    }
    
    // Se estiver no formato ISO (YYYY-MM-DD)
    if (typeof dataString === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dataString)) {
      const [ano, mes, dia] = dataString.split('T')[0].split('-');
      return `${dia}/${mes}/${ano}`;
    }
    
    // Se for um objeto Date ou timestamp
    const data = new Date(dataString);
    if (!isNaN(data.getTime())) {
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
    
    console.error('Formato de data não suportado:', dataString);
    return dataString; // Retorna o valor original se não for um formato reconhecido
  };

  // Função para calcular o 15º dia útil do mês seguinte à competência
  const calcularDataVencimento = (competencia) => {
    try {
      if (!competencia) return null;
      
      // Extrai mês e ano da competência (formato MM/YYYY)
      const [mes, ano] = competencia.split('/');
      
      if (!mes || !ano) return null;
      
      // Converte para números
      const mesNum = parseInt(mes, 10);
      const anoNum = parseInt(ano, 10);
      
      if (isNaN(mesNum) || isNaN(anoNum)) return null;
      
      // Mês seguinte ao da competência (para o qual queremos o 15º dia útil)
      // Mês em JavaScript é 0-indexed, então mesNum já é o valor correto para o mês seguinte
      const mesSeguinte = mesNum === 12 ? 1 : mesNum + 1;
      const anoSeguinte = mesNum === 12 ? anoNum + 1 : anoNum;
      
      // Cria uma data para o primeiro dia do mês seguinte
      const primeiroDiaMesSeguinte = new Date(anoSeguinte, mesSeguinte - 1, 1);
      
      // Feriados nacionais fixos (para simplificar, consideramos apenas os principais)
      const feriadosNacionais = [
        `01/01/${anoSeguinte}`, // Ano Novo
        `21/04/${anoSeguinte}`, // Tiradentes
        `01/05/${anoSeguinte}`, // Dia do Trabalho
        `07/09/${anoSeguinte}`, // Independência
        `12/10/${anoSeguinte}`, // Nossa Senhora Aparecida
        `02/11/${anoSeguinte}`, // Finados
        `15/11/${anoSeguinte}`, // Proclamação da República
        `25/12/${anoSeguinte}`  // Natal
      ];
      
      // Contador de dias úteis
      let diasUteis = 0;
      let dataAtual = new Date(primeiroDiaMesSeguinte);
      
      // Loop até encontrar o 15º dia útil
      while (diasUteis < 15) {
        // Verifica se é dia útil (não é sábado, domingo ou feriado)
        const diaSemana = dataAtual.getDay();
        const dataFormatada = `${String(dataAtual.getDate()).padStart(2, '0')}/${String(dataAtual.getMonth() + 1).padStart(2, '0')}/${dataAtual.getFullYear()}`;
        
        // 0 = domingo, 6 = sábado
        if (diaSemana !== 0 && diaSemana !== 6 && !feriadosNacionais.includes(dataFormatada)) {
          diasUteis++;
        }
        
        // Se ainda não chegamos ao 15º dia útil, avança para o próximo dia
        if (diasUteis < 15) {
          dataAtual.setDate(dataAtual.getDate() + 1);
        }
      }
      
      return dataAtual;
    } catch (error) {
      console.error('Erro ao calcular data de vencimento:', error);
      return null;
    }
  };
  
  // Função para gerar o código de barras da GPS conforme regras da FEBRABAN
  const gerarCodigoBarrasGPS = (formData) => {
    try {
      if (!formData || !formData.valor || !formData.competencia || !formData.cpf) {
        return null;
      }
      
      // Extrai os dados necessários
      const valor = parseFloat(formData.valor).toFixed(2).replace('.', '');
      const valorFormatado = valor.padStart(10, '0'); // Valor com 10 dígitos
      
      // Extrai mês e ano da competência (formato MM/YYYY)
      const [mes, ano] = formData.competencia.split('/');
      const competenciaNum = `${ano}${mes.padStart(2, '0')}`; // Formato YYYYMM
      
      // Código de receita padrão para GPS (16 = INSS)
      const codigoReceita = '16';
      
      // Identificador do contribuinte (CPF)
      const cpf = formData.cpf.replace(/\D/g, '');
      
      // Monta o código de barras no formato FEBRABAN para GPS
      // Estrutura: BBBBCCCCCCCCCCDVVVVVVVVVVVAAAAMMDDDDDDDDDDDDD
      // B = código do banco (sempre 858 para GPS)
      // C = código da moeda (9) + código de segmento (9) + identificação da forma de arrecadação (0)
      // D = dígito verificador geral
      // V = valor do documento (10 dígitos)
      // A = ano da competência (4 dígitos)
      // M = mês da competência (2 dígitos)
      // D = identificador do contribuinte (CPF/CNPJ - 14 dígitos)
      
      const banco = '858'; // Código fixo para GPS
      const moedaSegmento = '990'; // 9 = Real, 9 = Segmento Arrecadação, 0 = forma
      
      // Monta o código sem o dígito verificador
      const codigoSemDV = `${banco}${moedaSegmento}${valorFormatado}${competenciaNum}${codigoReceita}${cpf.padStart(14, '0')}`;
      
      // Calcula o dígito verificador (módulo 11)
      let soma = 0;
      let peso = 2;
      
      for (let i = codigoSemDV.length - 1; i >= 0; i--) {
        soma += parseInt(codigoSemDV.charAt(i), 10) * peso;
        peso = peso === 9 ? 2 : peso + 1;
      }
      
      const resto = soma % 11;
      const dv = resto === 0 || resto === 1 ? 0 : 11 - resto;
      
      // Insere o dígito verificador na posição correta
      const codigoCompleto = `${banco}${moedaSegmento}${dv}${valorFormatado}${competenciaNum}${codigoReceita}${cpf.padStart(14, '0')}`;
      
      // Formata o código de barras para exibição (grupos de 5 dígitos)
      const codigoFormatado = codigoCompleto.match(/.{1,5}/g).join(' ');
      
      return {
        codigo: codigoCompleto,
        codigoFormatado: codigoFormatado
      };
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error);
      return null;
    }
  };

  // Função para validar os dados do formulário
  const isFormDataValid = useCallback((formData) => {
    return formData && 
           formData.nome && 
           formData.cpf && 
           formData.dataNascimento && 
           formData.competencia;
  }, []);

  // Função para obter os dados do formulário de várias fontes
  const getFormData = useCallback(() => {
    console.log('Buscando dados do formulário...');
    
    // Tenta obter os dados do estado da rota (prioridade máxima)
    try {
      const currentState = window.history?.state;
      console.log('Estado da rota:', currentState);
      
      if (currentState?.formData) {
        // Dados diretos no estado
        if (isFormDataValid(currentState.formData)) {
          console.log('Dados encontrados no estado da rota (formData)');
          return {
            formData: currentState.formData,
            source: 'route_state',
            timestamp: currentState.timestamp || new Date().toISOString(),
            documentId: currentState.documentId || `doc-${Date.now()}`
          };
        }
      } else if (currentState?.usr?.formData) {
        // Dados aninhados em state.usr (padrão do react-router-dom)
        if (isFormDataValid(currentState.usr.formData)) {
          console.log('Dados encontrados no estado da rota (state.usr.formData)');
          return {
            formData: currentState.usr.formData,
            source: 'route_state',
            timestamp: currentState.usr.timestamp || new Date().toISOString(),
            documentId: currentState.usr.documentId || `doc-${Date.now()}`
          };
        }
      }
    } catch (e) {
      console.error('Erro ao acessar o estado da rota:', e);
    }

    // Tenta obter os dados do sessionStorage (fallback)
    try {
      const gpsDataStr = sessionStorage.getItem('gpsData');
      console.log('Dados no sessionStorage:', gpsDataStr);
      
      if (gpsDataStr) {
        const parsedData = JSON.parse(gpsDataStr);
        const formData = parsedData.formData || parsedData;
        
        if (isFormDataValid(formData)) {
          console.log('Dados válidos encontrados no sessionStorage');
          return {
            formData,
            source: 'session_storage',
            timestamp: parsedData.timestamp || new Date().toISOString(),
            documentId: parsedData.documentId || `doc-${Date.now()}`
          };
        } else {
          console.log('Dados inválidos no sessionStorage:', formData);
        }
      } else {
        console.log('Nenhum dado encontrado no sessionStorage');
      }
    } catch (e) {
      console.error('Erro ao acessar o sessionStorage:', e);
    }

    // Tenta obter dados de teste da URL (apenas para desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const testData = urlParams.get('testData');
        
        if (testData) {
          console.log('Dados de teste encontrados na URL');
          const testFormData = JSON.parse(decodeURIComponent(testData));
          if (isFormDataValid(testFormData)) {
            return {
              formData: testFormData,
              source: 'url_test_data',
              timestamp: new Date().toISOString(),
              documentId: `test-${Date.now()}`
            };
          }
        }
      } catch (e) {
        console.error('Erro ao analisar dados de teste da URL:', e);
      }
    }

    console.log('Nenhum dado de formulário válido encontrado em nenhuma fonte');
    return null;
  }, [isFormDataValid]);

  // Função para gerar o PDF
  const generatePDF = useCallback((formData) => {
    console.log('Iniciando geração do PDF...');
    
    return new Promise((resolve) => {
      try {
        // Processa os dados do formulário
        const dadosProcessados = { ...formData };
        
        // Calcula a data de vencimento (15º dia útil do mês seguinte)
        if (formData.competencia && !formData.dataVencimento) {
          const dataVencimento = calcularDataVencimento(formData.competencia);
          if (dataVencimento) {
            dadosProcessados.dataVencimento = dataVencimento;
          }
        }
        
        // Gera o código de barras
        const codigoBarras = gerarCodigoBarrasGPS(dadosProcessados);
        if (codigoBarras) {
          dadosProcessados.codigoBarras = codigoBarras.codigo;
          dadosProcessados.codigoBarrasFormatado = codigoBarras.codigoFormatado;
        }
        
        // Cria um novo documento PDF
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Configurações iniciais
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const generatedAt = new Date().toISOString();
        
        // Define a cor de fundo da página
        doc.setFillColor(248, 249, 250); // Cor de fundo do tema QuackContador (#f8f9fa)
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Define a cor de fundo do conteúdo do PDF
        doc.setDrawColor(248, 249, 250);
        doc.setFillColor(248, 249, 250);
        
        // Adiciona o cabeçalho
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Documento: ${formData._documentId || 'N/A'}`, margin, 15);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth - margin, 15, { align: 'right' });
        
        // Título do documento
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('GUIA DA PREVIDÊNCIA SOCIAL - GPS', pageWidth / 2, 30, { align: 'center' });
        
        // Tabela de dados do contribuinte
        const tableData = [
          { field: 'Nome Completo', value: dadosProcessados.nome || 'Não informado' },
          { field: 'NIT/PIS/PASEP', value: dadosProcessados.nit || 'Não informado' },
          { field: 'Código de Pagamento', value: '1406' },
          { field: 'Competência', value: dadosProcessados.competencia || 'Não informada' },
          { field: 'Data de Vencimento', value: dadosProcessados.dataVencimento ? formatarDataBrasileira(dadosProcessados.dataVencimento) : 'Não informada' },
          { field: 'Valor Total', value: dadosProcessados.valor ? `R$ ${parseFloat(dadosProcessados.valor).toFixed(2).replace('.', ',')}` : 'Não informado' },
          { 
            field: 'Código de Barras', 
            value: dadosProcessados.codigoBarras ? '' : 'Não gerado',
            isBarcode: true
          }
        ];
        
        // Adiciona os dados em formato de tabela
        autoTable(doc, {
          startY: 40, // Tabela mais para cima
          head: [['Campo', 'Valor']],
          body: tableData.map(item => [item.field, item.value]),
          margin: { top: 10, right: margin, bottom: 10, left: margin },
          didDrawCell: function(data) {
            // Se for a célula do código de barras e tivermos o código
            if (data.cell.raw === '' && dadosProcessados.codigoBarras) {
              try {
                // Gera o código de barras com escala maior para aumentar a largura
                const barcodeDataUrl = generateBarcode(dadosProcessados.codigoBarras, 1.5, 25);
                
                // Ajusta o tamanho e posição do código de barras
                const barcodeHeight = 15; // Altura reduzida para caber melhor
                const barcodeWidth = data.cell.width - 16; // Largura com margem menor
                const barcodeX = data.cell.x + 8; // Margem esquerda reduzida
                const barcodeY = data.cell.y + 3; // Posição mais alta
                
                // Adiciona a imagem do código de barras centralizada
                doc.addImage(
                  barcodeDataUrl, 
                  'PNG', 
                  barcodeX, 
                  barcodeY, 
                  barcodeWidth, 
                  barcodeHeight
                );
                
                // Adiciona o código numérico formatado abaixo do código de barras
                if (dadosProcessados.codigoBarras) {
                  // Formata o código numérico em grupos para melhor legibilidade
                  const codigoFormatado = dadosProcessados.codigoBarras.replace(/(\d{4})(?=\d)/g, '$1 ');
                  
                  doc.setFontSize(8);
                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(0, 0, 0); // Texto preto
                  doc.text(
                    codigoFormatado,
                    data.cell.x + (data.cell.width / 2),
                    barcodeY + barcodeHeight + 5, // Posiciona abaixo do código de barras
                    { align: 'center', lineHeightFactor: 1.2 }
                  );
                }
                
                // Limpa qualquer outro texto que possa aparecer na célula
                doc.setTextColor(255, 255, 255, 0); // Torna o texto completamente transparente
                doc.setFontSize(0.1); // Tamanho mínimo possível
              } catch (error) {
                console.error('Erro ao gerar código de barras:', error);
              }
            }
          },
          styles: {
            fontSize: 10,
            cellPadding: 6,
            // Altura adequada para o código de barras e número
            cellHeight: 50,
            cellWidth: 'wrap',
            overflow: 'linebreak',
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
            valign: 'middle',
            halign: 'left',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            font: 'helvetica',
            fontStyle: 'normal',
            columnWidth: 'auto',
            rowHeight: 'auto',
            minCellHeight: 10
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });
        // Gera o blob do PDF
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        resolve({
          url: pdfUrl,
          blob: pdfBlob,
          generatedAt,
          formData: dadosProcessados // Retorna os dados processados para uso posterior
        });
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw new Error('Não foi possível gerar o PDF. Por favor, tente novamente.');
      }
    });
  }, []);

  // Função para carregar os dados e gerar o PDF
  const loadData = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    console.log('Iniciando carregamento de dados...');
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Tenta obter os dados do formulário
      const data = getFormData();
      console.log('Dados obtidos do formulário:', data);
      
      if (!data || !data.formData) {
        throw new Error('Nenhum dado de GPS encontrado. Por favor, preencha o formulário novamente.');
      }
      
      console.log('Gerando PDF com os dados:', data.formData);
      
      // Gera o PDF
      const { url, blob, generatedAt } = await generatePDF(data.formData);
      
      if (!isMountedRef.current) {
        console.log('Componente desmontado durante a geração do PDF, cancelando...');
        URL.revokeObjectURL(url);
        return;
      }
      
      console.log('PDF gerado com sucesso:', { url, generatedAt });
      
      // Limpa a URL anterior, se existir
      if (pdfBlobUrlRef.current) {
        console.log('Limpando URL do blob anterior');
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
      
      // Atualiza a referência e o estado
      pdfBlobUrlRef.current = url;
      
      console.log('Atualizando estado com o novo PDF');
      setState(prev => ({
        ...prev,
        loading: false,
        pdfUrl: url,
        formData: data.formData,
        documentId: data.documentId,
        generatedAt,
        blob,
        error: null
      }));
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      if (isMountedRef.current) {
        console.error('Detalhes do erro:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Ocorreu um erro ao carregar o documento. Por favor, tente novamente.'
        }));
      }
    }
  }, [getFormData, generatePDF]);

  // Efeito para carregar os dados quando o componente for montado
  useEffect(() => {
    isMountedRef.current = true;
    loadData();

    // Função para lidar com mensagens de outras abas
    const handleMessage = (event) => {
      if (event.data?.type === 'GPS_DATA' && event.data.payload) {
        try {
          const { formData, documentId } = event.data.payload;
          
          if (isFormDataValid(formData)) {
            // Salva os dados no sessionStorage para recarregamento
            sessionStorage.setItem('gpsData', JSON.stringify({
              formData,
              documentId,
              timestamp: new Date().toISOString()
            }));
            
            // Recarrega os dados
            loadData();
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      }
    };

    // Adiciona o listener para mensagens
    window.addEventListener('message', handleMessage);

    // Limpa o listener quando o componente for desmontado
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('message', handleMessage);
      
      // Limpa a URL do blob
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
    };
  }, [loadData, isFormDataValid]);

  // Renderização
  return (
    <div style={styles.pageContainer}>
      {/* Container do PDF */}
      <div style={styles.pdfContainer}>
        {state.error ? (
          <div style={styles.errorContainer}>
            <h3>Erro ao carregar o documento</h3>
            <p>{state.error}</p>
            <button 
              onClick={loadData}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                marginTop: '1rem'
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : state.loading ? (
          <div style={styles.loadingContainer}>
            <Spinner animation="border" variant="primary" />
            <p style={{ marginTop: '1rem' }}>Carregando documento...</p>
          </div>
        ) : state.pdfUrl ? (
          <iframe
            key={state.pdfUrl}
            src={`${state.pdfUrl}#toolbar=0&navpanes=0&zoom=fit`}
            style={styles.iframe}
            title="Visualização do GPS"
            ref={pdfRef}
            onLoad={() => {
              console.log('PDF carregado com sucesso');
            }}
            onError={(e) => {
              console.error('Erro ao carregar o PDF:', e);
              setState(prev => ({
                ...prev,
                error: 'Erro ao carregar o PDF. Tente baixar o arquivo.'
              }));
            }}
          />
        ) : (
          <div style={styles.loadingContainer}>
            <Spinner animation="border" variant="primary" />
            <p style={{ marginTop: '1rem' }}>Preparando visualização...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPSViewer;
