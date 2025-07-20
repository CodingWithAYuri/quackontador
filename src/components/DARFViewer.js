import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { ArrowLeft, Download, Printer, BoxArrowUpRight } from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Função para obter o último dia útil do mês seguinte
const getLastBusinessDayOfNextMonth = (month, year) => {
  // Converte para número e ajusta para o mês seguinte (0-11 para janeiro-dezembro)
  let nextMonth = parseInt(month, 10);
  let nextYear = parseInt(year, 10);
  
  // Ajusta para o mês seguinte
  nextMonth += 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  
  // Obtém o último dia do mês seguinte
  const lastDay = new Date(nextYear, nextMonth, 0);
  let lastBusinessDay = new Date(lastDay);
  
  // Ajusta para o último dia útil (segunda a sexta)
  const dayOfWeek = lastBusinessDay.getDay();
  if (dayOfWeek === 0) { // Domingo
    lastBusinessDay.setDate(lastBusinessDay.getDate() - 2); // Vai para sexta
  } else if (dayOfWeek === 6) { // Sábado
    lastBusinessDay.setDate(lastBusinessDay.getDate() - 1); // Vai para sexta
  }
  
  // Formata a data como DD/MM/YYYY
  const day = String(lastBusinessDay.getDate()).padStart(2, '0');
  const monthFormatted = String(nextMonth).padStart(2, '0');
  
  return `${day}/${monthFormatted}/${nextYear}`;
};

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

// Função para gerar código de barras do DARF
const gerarCodigoBarrasDARF = (formData) => {
  try {
    // Gera um código de barras baseado nos dados do DARF
    // Formato simplificado: Código da Receita + CPF (primeiros 8 dígitos) + Competência + Valor
    const codigoReceita = (formData.codigoReceita || '0190').padStart(4, '0');
    const cpfLimpo = (formData.cpf || '').replace(/\D/g, '').substring(0, 8).padStart(8, '0');
    const competencia = `${(formData.mesReferencia || '01').padStart(2, '0')}${(formData.anoReferencia || new Date().getFullYear()).toString().substring(2)}`;
    const valorCentavos = Math.round((parseFloat(formData.valorIr || 0) * 100)).toString().padStart(8, '0');
    
    // Monta o código (24 dígitos)
    const codigo = `${codigoReceita}${cpfLimpo}${competencia}${valorCentavos}`;
    
    // Formata o código para exibição (grupos de 4 dígitos)
    const codigoFormatado = codigo.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return {
      codigo: codigo,
      codigoFormatado: codigoFormatado
    };
  } catch (error) {
    console.error('Erro ao gerar código de barras do DARF:', error);
    return null;
  }
};

const DARFViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para voltar
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Função para baixar o PDF
  const handleDownloadPDF = useCallback(() => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `DARF-${formData?.nome?.replace(/\s+/g, '_') || 'documento'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, formData]);

  // Função para imprimir (abre em nova aba)
  const handlePrint = useCallback(() => {
    if (!pdfUrl) return;
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }, [pdfUrl]);

  // Função para abrir em nova aba
  const handleOpenInNewTab = useCallback(() => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank');
  }, [pdfUrl]);

  // Função para obter dados do formulário
  const getFormData = useCallback(() => {
    const currentState = location.state;
    
    // Verifica se há dados no estado da rota
    if (currentState?.formData) {
      console.log('Dados encontrados no estado da rota (formData)');
      return {
        formData: currentState.formData,
        source: 'route_state',
        timestamp: currentState.timestamp || new Date().toISOString(),
        documentId: currentState.documentId || `doc-${Date.now()}`
      };
    }
    
    // Fallback: tenta obter dados do sessionStorage
    try {
      const savedData = sessionStorage.getItem('darfData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Dados encontrados no sessionStorage');
        return {
          formData: parsedData.formData,
          source: 'session_storage',
          timestamp: parsedData.timestamp || new Date().toISOString(),
          documentId: parsedData.documentId || `doc-${Date.now()}`
        };
      }
    } catch (error) {
      console.error('Erro ao ler dados do sessionStorage:', error);
    }
    
    return null;
  }, [location.state]);

  // Função para gerar o PDF
  const generatePDF = useCallback(async (formData) => {
    try {
      return await generatePDFExportable(formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let currentPdfUrl = null;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = getFormData();
        
        if (!data) {
          if (isMounted) {
            setError('Dados do DARF não encontrados. Por favor, gere o DARF novamente.');
            setLoading(false);
          }
          return;
        }
        
        console.log('Dados obtidos:', data);
        
        // Gera o PDF
        const { url } = await generatePDF(data.formData);
        
        if (isMounted) {
          currentPdfUrl = url;
          setPdfUrl(url);
          setFormData(data.formData);
          setLoading(false);
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (isMounted) {
          setError(`Erro ao gerar PDF: ${error.message}`);
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
      }
    };
  }, [getFormData, generatePDF]);

  // Estilos do componente
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f8f9fa',
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
      borderBottom: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    button: {
      padding: '0.5rem 1rem',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      color: '#495057',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white',
      borderColor: '#007bff',
    },
    pdfContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflow: 'auto',
      margin: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
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
      backgroundColor: 'rgba(248, 249, 250, 0.9)',
      color: '#495057',
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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      zIndex: 100,
    },
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <Spinner animation="border" variant="primary" />
          <p style={{ marginTop: '1rem' }}>Carregando DARF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <h3>Erro ao carregar o documento</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/darf')}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              marginTop: '1rem'
            }}
          >
            Voltar para DARF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={handleGoBack}
            style={styles.button}
            title="Voltar"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleOpenInNewTab}
            style={styles.button}
            title="Abrir em Nova Aba"
          >
            <BoxArrowUpRight size={16} />
            <span>Nova Aba</span>
          </button>
          <button 
            onClick={handlePrint}
            style={styles.button}
            title="Imprimir"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
          <button 
            onClick={handleDownloadPDF}
            style={{...styles.button, ...styles.primaryButton}}
            title="Baixar PDF"
          >
            <Download size={16} />
            <span>Baixar</span>
          </button>
        </div>
      </div>

      {/* Conteúdo do PDF */}
      <div style={styles.pdfContainer}>
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&zoom=fit`}
            style={styles.iframe}
            title="Visualização do DARF"
            onLoad={() => {
              console.log('PDF carregado com sucesso');
            }}
            onError={(e) => {
              console.error('Erro ao carregar o PDF:', e);
              setError('Erro ao carregar o PDF. Tente baixar o arquivo.');
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

// Função para gerar o PDF (versão exportável)
const generatePDFExportable = async (formData) => {
  try {
    console.log('Iniciando geração do PDF do DARF...');
    
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Adiciona fundo cinza claro igual ao GPSViewer
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Cabeçalho com ID do documento e data (igual ao GPSViewer)
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    const docId = `darf-${Date.now()}`;
    const dataGeracao = new Date().toLocaleString('pt-BR');
    doc.text(`Documento: ${docId}`, 10, 10);
    doc.text(`Gerado em: ${dataGeracao}`, pageWidth - 10, 10, { align: 'right' });
    
    // Título principal (igual ao GPSViewer)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('DARF', pageWidth / 2, 30, { align: 'center' });
    
    // Gera o código de barras
    const dadosCodigoBarras = gerarCodigoBarrasDARF(formData);
    
    // Obtém a data de pagamento (último dia útil do mês seguinte)
    const dataPagamento = getLastBusinessDayOfNextMonth(
      formData.mesReferencia || '01',
      formData.anoReferencia || new Date().getFullYear()
    );

    // Formata o valor no padrão brasileiro (12.592,30)
    const formatarValor = (valor) => {
      // Remove todos os caracteres não numéricos, exceto vírgula e ponto
      const valorLimpo = String(valor || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      
      const numero = parseFloat(valorLimpo) || 0;
      return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    // Dados da tabela com código de barras (igual ao GPS)
    const tableData = [
      ['Nome Completo', formData.nome || ''],
      ['CPF', formData.cpf || ''],
      ['Código da Receita', formData.codigoReceita || '0190'],
      ['Competência', `${(formData.mesReferencia || '01').padStart(2, '0')}/${formData.anoReferencia || new Date().getFullYear()}`],
      ['Data de Vencimento', dataPagamento],
      ['Valor a Pagar', `R$ ${formatarValor(formData.valorIr)}`],
      ['Código de Barras', ''] // Célula vazia para o código de barras
    ];
    
    // Gera a tabela sem cabeçalho
    autoTable(doc, {
      startY: 40,
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 },
      // Adiciona o código de barras na célula correspondente
      didDrawCell: function(data) {
        // Se for a célula do código de barras e tivermos o código
        if (data.cell.raw === '' && dadosCodigoBarras) {
          try {
            // Gera o código de barras
            const barcodeDataUrl = generateBarcode(dadosCodigoBarras.codigo, 1.5, 25);
            
            // Ajusta o tamanho e posição do código de barras
            const barcodeHeight = 15.23; 
            const barcodeWidth = data.cell.width - 16.24; 
            const barcodeX = data.cell.x + 8.12; 
            const barcodeY = data.cell.y + 2; 
            
            // Adiciona a imagem do código de barras
            doc.addImage(
              barcodeDataUrl, 
              'PNG', 
              barcodeX, 
              barcodeY, 
              barcodeWidth, 
              barcodeHeight
            );
            
            // Adiciona o texto do código de barras abaixo da imagem
            if (dadosCodigoBarras.codigoFormatado) {
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0);
              doc.text(
                dadosCodigoBarras.codigoFormatado,
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
      }
    });
    
    // Calcula a posição Y após a tabela
    const finalY = doc.lastAutoTable.finalY || 120;
    
    // Adiciona o aviso legal igual ao GPS
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Posiciona o título mais próximo da tabela
    const startY = finalY + 15; // Reduzido para 15
    doc.text('AVISO LEGAL', 20, startY);
    
    // Texto do aviso legal
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Define a posição Y inicial para o texto que vem depois do título
    let yPosition = startY + 10; // Espaço reduzido após o título
    
    const avisoTexto = [
      'Os códigos de barras exibidos nesta plataforma são simulações técnicas criadas pelo sistema QuackContador, destinadas exclusivamente para:',
      '  - Fins educacionais;',
      '  - Testes de software;',
      '  - Demonstrações de funcionamento.',
      '',
      'Restrições de Uso:',
      'É expressamente proibido:',
      '  - Utilizar estes códigos para pagamentos ou transações reais;',
      '  - Apresentá-los como documentos fiscais ou declarações oficiais;',
      '  - Qualquer uso que implique representação de valor fiscal.',
      '',
      'Validade Legal:',
      'Os códigos de barras não possuem qualquer validade perante:',
      '  - Receita Federal do Brasil;',
      '  - Instituto Nacional do Seguro Social - INSS;',
      '  - Instituições financeiras.',
      '',
      'Canal Oficial:',
      'Para gerar os códigos de barras de forma válida, acesse o Sistema de Acréscimo Legal - RFB: https://sicalc.receita.economia.gov.br/sicalc/principal'
    ];
    
    const disclaimerTexto = 'O QuackContador não se responsabiliza pelo uso indevido destas simulações.';
    
    // A posição Y será definida após o título do aviso legal
    avisoTexto.forEach(linha => {
      if (linha.includes('Restrições de Uso:') || linha.includes('Validade Legal:') || linha.includes('Canal Oficial:')) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
      }
      
      // Verifica se a linha contém o link para formatá-lo em azul
      if (linha.includes('https://sicalc.receita.economia.gov.br/sicalc/principal')) {
        const parts = linha.split('https://sicalc.receita.economia.gov.br/sicalc/principal');
        
        // Texto introdutório
        doc.text(parts[0], 20, yPosition);
        yPosition += 5; // Pula para a próxima linha
        
        // Link em azul na linha de baixo, alinhado com o texto acima
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 255); // Azul
        doc.textWithLink('https://sicalc.receita.economia.gov.br/sicalc/principal', 
                        20, // Mesmo alinhamento do texto acima
                        yPosition, 
                        { url: 'https://sicalc.receita.economia.gov.br/sicalc/principal' });
        
        // Volta a cor padrão para as próximas linhas
        doc.setTextColor(0, 0, 0);
        yPosition += 5;
        return;
      }
      
      // Usa splitTextToSize para quebrar linhas longas
      const linhasQuebradas = doc.splitTextToSize(linha, pageWidth - 40);
      
      if (Array.isArray(linhasQuebradas)) {
        linhasQuebradas.forEach((linhaQuebrada, index) => {
          doc.text(linhaQuebrada, 20, yPosition);
          yPosition += 4;
        });
      } else {
        doc.text(linhasQuebradas, 20, yPosition);
        yPosition += linha === '' ? 3 : 4;
      }
    });
    
    // Nota final - posicionada mais próxima do rodapé
    const footerY = pageHeight - 15; // Posição fixa do rodapé
    const notaFinalY = footerY - 3; 
    
    // Texto de isenção de responsabilidade
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(200, 0, 0); // Vermelho
    doc.text(disclaimerTexto, 20, notaFinalY);
    
    // Linha do rodapé
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, pageWidth - 20, footerY);
    
    // Textos do rodapé
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.3); 
    doc.setTextColor(120, 120, 120);
    doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, 20, footerY + 5);
    doc.text(`QuackContador © ${new Date().getFullYear()}`, pageWidth - 20, footerY + 5, { align: 'right' });
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    console.log('PDF do DARF gerado com sucesso');
    
    return { url: pdfUrl, blob: pdfBlob, generatedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Erro ao gerar PDF do DARF:', error);
    throw error;
  }
};

// Exporta as funções que serão usadas por outros componentes
export const exportedFunctions = {
  generatePDF: generatePDFExportable
};

export default DARFViewer;
