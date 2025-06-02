import React from 'react';
import Footer from './Footer';
import './TermosDeUso.css';

function TermosDeUso() {
  // Rola para o topo ao carregar a página
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
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
          <h1 className="text-white mb-2" style={{ fontSize: '2rem' }}>Termos de uso do site</h1>
          <p className="text-white mb-4" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
            <i className="bi bi-calendar-check me-2"></i>
            Última atualização: 01/06/2025
          </p>

          {/* Seção 1 */}
          <section id="secao-1" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>1. Aceitação dos Termos</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', marginBottom: '1rem' }}>
              Ao acessar ou utilizar o <strong style={{ color: '#fff' }}>QuackContador</strong>, você concorda com estes termos e com a legislação brasileira, incluindo:
            </p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-journal-text text-white me-2"></i> <strong style={{ color: '#fff' }}>Código Civil (Lei nº 10.406/2002)</strong>
              </li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-journal-text text-white me-2"></i> <strong style={{ color: '#fff' }}>LGPD (Lei nº 13.709/2018)</strong>
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-journal-text text-white me-2"></i> <strong style={{ color: '#fff' }}>Marco Civil da Internet (Lei nº 12.965/2014)</strong>
              </li>
            </ul>
            <p className="alert alert-warning p-2 mt-3 mb-0" style={{ backgroundColor: '#333', color: '#fff', borderColor: '#fff', width: 'fit-content' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Caso discorde, interrompa o uso imediatamente.
            </p>
          </section>

          {/* Seção 2 */}
          <section id="secao-2" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>2. Natureza do Serviço</h2>
            <div style={{ fontSize: '1rem', textAlign: 'justify' }}>
              <p style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem', textAlign: 'justify' }}>
                O QuackContador é uma <strong style={{ color: '#fff' }}>ferramenta informativa</strong> para cálculos trabalhistas e tributários.
              </p>
              <p style={{ color: '#fff', fontSize: '1rem', textAlign: 'justify' }}>
                <strong style={{ color: '#fff' }}>Os resultados não constituem aconselhamento jurídico, contábil ou fiscal</strong>. Recomenda-se consultar um profissional qualificado para decisões críticas.
              </p>
            </div>
          </section>

          {/* Seção 3 */}
          <section id="secao-3" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>3. Funcionalidades do Site</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', fontSize: '1rem' }}>
              Plataforma de uso <span style={{ 
                backgroundColor: '#198754', 
                color: '#fff',
                padding: '0.25em 0.5em',
                borderRadius: '0.25rem',
                fontSize: '0.875em',
                fontWeight: 'bold'
              }}>gratuito</span> (mediante cadastro), que oferece:
            </p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Cálculos automatizados baseados em legislação vigente;</li>
              <li style={{ color: '#fff', fontSize: '1rem', listStyle: 'none' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Interface intuitiva para simulações rápidas.</li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section id="secao-4" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>4. Política de Cookies</h2>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-dash-lg text-white me-2"></i>Utilizamos <strong style={{ color: '#fff' }}>cookies essenciais</strong> para funcionalidade do site (ex.: login) e <strong style={{ color: '#fff' }}>cookies analíticos</strong> (Google Analytics) para melhorar a experiência.
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-dash-lg text-white me-2"></i>Ao continuar navegando, você concorda com o uso destes cookies. Para desativá-los, ajuste as configurações do seu navegador.
              </li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section id="secao-5" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>5. Responsabilidades do Usuário</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>Você se compromete a:</p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}><i className="bi bi-check2-square text-primary me-2"></i> Fornecer <strong style={{ color: '#fff' }}>dados cadastrais verdadeiros</strong>;</li>
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}><i className="bi bi-check2-square text-primary me-2"></i> Não utilizar o site para <strong style={{ color: '#fff' }}>fins ilícitos</strong> (fraudes, violação de direitos, etc.);</li>
              <li style={{ color: '#fff', fontSize: '1rem' }}><i className="bi bi-check2-square text-primary me-2"></i> Validar resultados em casos que exijam precisão absoluta.</li>
            </ul>
          </section>

          {/* Seção 6 */}
          <section id="secao-6" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>6. Privacidade e Dados</h2>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-shield-lock text-info me-2"></i><strong style={{ color: '#fff' }}>Dados pessoais</strong> são tratados conforme a <strong style={{ color: '#fff' }}>LGPD</strong>;
              </li>
              <li style={{ color: '#fff', fontSize: '1rem' }}>
                <i className="bi bi-database text-info me-2"></i><strong style={{ color: '#fff' }}>Dados de cálculos</strong> podem ser armazenados anonimamente para aprimoramento técnico.
              </li>
            </ul>
          </section>

          {/* Seção 7 */}
          <section id="secao-7" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>7. Limitação de Responsabilidade</h2>
            <p style={{ color: '#fff', fontSize: '1rem' }}>O QuackContador <strong style={{ color: '#fff' }}>não garante</strong>:</p>
            <ul className="list-unstyled ms-3">
              <li className="mb-2" style={{ color: '#fff', fontSize: '1rem' }}><i className="bi bi-exclamation-octagon text-warning me-2"></i> Exatidão absoluta dos cálculos (variações legais podem ocorrer);</li>
              <li style={{ color: '#fff', fontSize: '1rem' }}><i className="bi bi-exclamation-octagon text-warning me-2"></i> Disponibilidade ininterrupta do site.</li>
            </ul>
          </section>

          {/* Seção 8 */}
          <section id="secao-8" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>8. Propriedade Intelectual</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', fontSize: '1rem' }}>
              <i className="bi bi-c-circle text-white me-2"></i>
              O conteúdo do site (código, design, marcas) é protegido pela <strong style={{ color: '#fff' }}>Lei nº 9.610/1998</strong>.
            </p>
          </section>

          {/* Seção 9 */}
          <section id="secao-9" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>9. Modificações</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', fontSize: '1rem' }}>
              <i className="bi bi-pencil-square text-white me-2"></i>
              Estes termos podem ser atualizados e as alterações serão publicadas neste portal.
            </p>
          </section>

          {/* Seção 10 */}
          <section id="secao-10" className="mb-4" style={{ backgroundColor: '#333', color: '#fff' }}>
            <h2 className="border-bottom pb-2" style={{ color: '#fff', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>10. Lei e Foro</h2>
            <p style={{ color: '#fff', textAlign: 'justify', textJustify: 'inter-word', fontSize: '1rem' }}>
              <i className="bi bi-building text-white me-2"></i>
              As demandas serão resolvidas no <strong style={{ color: '#fff' }}>foro do Estado de São Paulo</strong>, sob leis brasileiras.
            </p>
          </section>

        </div>
      </div>
      
      {/* Footer */}
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

export default TermosDeUso;