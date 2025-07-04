import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const generatePDF = useCallback(async (formData) => {
    console.log('Iniciando geração do PDF...');
    
    return new Promise((resolve) => {
      try {
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
        doc.text('COMPROVANTE DE PAGAMENTO - GPS', pageWidth / 2, 30, { align: 'center' });
        
        // Linha separadora
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, 40, pageWidth - margin, 40);
        
        // Tabela de dados do contribuinte
        const tableData = [
          { field: 'Nome Completo', value: formData.nome || 'Não informado' },
          { field: 'CPF', value: formData.cpf ? formData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'Não informado' },
          { field: 'Data de Nascimento', value: formData.dataNascimento ? new Date(formData.dataNascimento).toLocaleDateString('pt-BR') : 'Não informada' },
          { field: 'NIT/PIS/PASEP', value: formData.nit || 'Não informado' },
          { field: 'Valor Total', value: formData.valor ? `R$ ${parseFloat(formData.valor).toFixed(2).replace('.', ',')}` : 'Não informado' },
          { field: 'Competência', value: formData.competencia || 'Não informada' },
          { field: 'Data de Vencimento', value: formData.dataVencimento ? new Date(formData.dataVencimento).toLocaleDateString('pt-BR') : 'Não informada' },
          { field: 'Código de Barras', value: formData.codigoBarras || 'Não gerado' }
        ];
        
        // Adiciona os dados em formato de tabela
        autoTable(doc, {
          startY: 50,
          head: [['Campo', 'Valor']],
          body: tableData.map(item => [item.field, item.value]),
          margin: { top: 10, right: margin, bottom: 10, left: margin },
          styles: {
            fontSize: 10,
            cellPadding: 6,
            headStyles: {
              fillColor: [240, 240, 240],
              textColor: [0, 0, 0],
              fontStyle: 'bold',
              lineWidth: 0.2
            },
            bodyStyles: {
              textColor: [0, 0, 0],
              lineWidth: 0.2
            },
            alternateRowStyles: {
              fillColor: [250, 250, 250]
            },
            margin: { top: 45, left: margin, right: margin },
            theme: 'grid',
            head: [
              ['fill', 'text', 'text', 'text', 'fill']
            ],
            styles: {
              cellPadding: 5,
              fontSize: 10,
              cellWidth: 'wrap',
              lineColor: [200, 200, 200],
              lineWidth: 0.2,
            },
          },
        });

        // Gera o blob do PDF
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        resolve({
          url: pdfUrl,
          blob: pdfBlob,
          generatedAt,
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
