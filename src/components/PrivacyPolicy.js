import React from 'react';
import Footer from './Footer';
import './TermosDeUso.css';

function PrivacyPolicy() {
  // Rola para o topo ao carregar a página
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get current date in the format DD/MM/YYYY
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div style={{
      backgroundColor: '#333',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '100%',
      overflowX: 'hidden',
      paddingBottom: '80px' // Espaço para o footer
    }}>
      {/* Conteúdo Principal */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        minHeight: 'calc(100vh - 150px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        fontSize: '1rem',
        lineHeight: '1.6',
        textAlign: 'justify',
        textJustify: 'inter-word'
      }}>
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style>{
          `
            ::-webkit-scrollbar {
              display: none;
            }
          `
        }</style>
        
        <div id="content-container" className="text-justified">
          <h1 className="text-white mb-2" style={{ fontSize: '2rem' }}>Política de Privacidade</h1>
          <p className="text-white mb-4" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
            <i className="bi bi-calendar-check me-2"></i>
            Última atualização: {currentDate}
          </p>

          {/* Seção 1 - Introdução */}
          <section id="introducao" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>1. Introdução</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', marginBottom: '1rem', fontSize: '1rem' }}>
              Esta política explica como é efetuada a coleta, o uso e a proteção dos seus dados pessoais, em conformidade com a <strong style={{ color: '#fff' }}>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>. Ao usar este site, você concorda com estas práticas.
            </p>
          </section>

          {/* Seção 2 - Dados Coletados */}
          <section id="dados-coletados" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>2. Dados Coletados</h2>
            
            <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '1.2rem 0 0.75rem' }}>2.1. Dados fornecidos por você</h3>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-journal-text text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Cadastro</strong>: Nome, e-mail, CPF/CNPJ (se aplicável).
              </li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-journal-text text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Uso das ferramentas</strong>: Dados inseridos em formulários ou cálculos.
              </li>
            </ul>

            <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '1.2rem 0 0.75rem' }}>2.2. Dados coletados automaticamente</h3>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-cookie text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Cookies</strong>: Informações de sessão, preferências e analytics (ex.: Google Analytics).
              </li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-pc-display text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Metadados</strong>: IP, tipo de navegador, páginas acessadas.
              </li>
            </ul>
          </section>

          {/* Seção 3 - Finalidades do Tratamento */}
          <section id="finalidades" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>3. Finalidades do Tratamento</h2>
            <p style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Seus dados são usados para:</p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-check2-circle text-success me-2"></i> Fornecer os serviços do site (ex.: gerar cálculos);</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-graph-up-arrow text-success me-2"></i> Melhorar a experiência do usuário;</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-shield-lock text-success me-2"></i> Cumprir obrigações legais;</li>
              <li style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-envelope text-success me-2"></i> Enviar comunicações (se você optar por receber).</li>
            </ul>
          </section>

          {/* Seção 4 - Compartilhamento de Dados */}
          <section id="compartilhamento" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>4. Compartilhamento de Dados</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>
              Seus dados <strong style={{ color: '#fff' }}>não serão vendidos ou compartilhados</strong> com terceiros, exceto:
            </p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-people text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Parceiros técnicos</strong> (ex.: hospedagem do site) – apenas o necessário para operação;
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-shield-exclamation text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Exigência legal</strong> (ordem judicial ou autoridade competente).
              </li>
            </ul>
          </section>

          {/* Seção 5 - Direitos do Titular */}
          <section id="direitos" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>5. Direitos do Titular</h2>
            <p style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>
              Conforme a LGPD, você pode:
            </p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-eye text-info me-2"></i> Acessar seus dados;</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-pencil-square text-info me-2"></i> Corrigir dados incorretos;</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-trash text-danger me-2"></i> Excluir dados desnecessários;</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-download text-info me-2"></i> Portar seus dados para outro serviço;</li>
              <li style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-x-circle text-danger me-2"></i> Revogar consentimentos.</li>
            </ul>
            <p style={{ color: '#fff', fontSize: '1rem', marginTop: '1rem' }}>
              Para exercer esses direitos, entre em contato por: <a href="mailto:contato@quackontador.com" className="text-info">contato@quackontador.com</a>
            </p>
          </section>

          {/* Seção 6 - Segurança */}
          <section id="seguranca" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>6. Segurança</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>
              <i className="bi bi-shield-lock text-white me-2"></i>
              Adotamos medidas técnicas (ex.: criptografia) e organizacionais para proteger seus dados contra acessos não autorizados ou situações acidentais.
            </p>
          </section>

          {/* Seção 7 - Retenção de Dados */}
          <section id="retencao" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>7. Retenção de Dados</h2>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-clock-history text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Dados pessoais</strong>: Armazenados enquanto sua conta estiver ativa ou por prazo legal;
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-bar-chart text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Dados anônimos</strong>: Podem ser mantidos indefinidamente para análises.
              </li>
            </ul>
          </section>

          {/* Seção 8 - Cookies */}
          <section id="cookies" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>8. Cookies e Tecnologias Semelhantes</h2>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-shield-check text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Cookies essenciais</strong>: Necessários para o funcionamento do site (ex.: login);
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-graph-up text-white me-2"></i>
                <strong style={{ color: '#fff' }}>Cookies analíticos</strong>: Coletam dados de uso (você pode desativar no navegador).
              </li>
            </ul>
          </section>

          {/* Seção 9 - Alterações na Política */}
          <section id="alteracoes" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>9. Alterações na Política</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>
              <i className="bi bi-exclamation-triangle text-warning me-2"></i>
              Esta política pode ser atualizada. A versão mais recente estará sempre nesta página, com a data de atualização no topo.
            </p>
          </section>

          {/* Seção 10 - Contato */}
          <section id="contato" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>10. Contato</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>
              Dúvidas sobre esta política? Entre em contato com nosso Encarregado de Dados (DPO):
            </p>
            <ul className="list-unstyled ms-3">
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-envelope text-white me-2"></i>
                E-mail: <a href="mailto:dpo@quackontador.com" className="text-info">dpo@quackontador.com</a>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer Fixo */}
      <div style={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <Footer />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
