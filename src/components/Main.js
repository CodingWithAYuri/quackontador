import React from "react";
import { Container } from "react-bootstrap";
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
          <Link 
            to="/calculos" 
            className="btn btn-lg btn-secondary"
          >
            Vamos aos cálculos!
          </Link>
        </p>
      </Container>
    </main>
  );
}

export default Main;
