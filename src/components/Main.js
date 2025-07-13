import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Main() {
  const mainStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 130px)', // Altura ajustada para considerar header e footer
    padding: '2rem 0',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center'
  };

  return (
    <main
      role="main"
      style={mainStyle}
    >
      <Container>
        <h2 className="cover-heading mb-4">Descomplique a sua contabilidade.</h2>
        <p className="lead mb-4">Explicação simples e sem muito blá blá blá</p>
        <p className="lead">
          <div className="d-flex justify-content-center">
            <Button
              as={Link}
              to="/calculos"
              variant="outline-light"
              size="lg"
              className="custom-hover-button"
              style={{
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                color: '#fff',
                backgroundColor: 'transparent',
                borderColor: '#fff',
                width: '200px',
                maxWidth: '100%'
              }}
            >
              Vamos aos cálculos!
            </Button>
          </div>
        </p>
      </Container>
    </main>
  );
}

export default Main;
