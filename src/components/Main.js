import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Main() {
  return (
    <main
      role="main"
      className="main inner cover text-center d-flex justify-content-center align-items-center"
    >
      <Container className="container mb-5">
      <h2 className="cover-heading">Descomplique a sua contabilidade.</h2>
      <p className="lead">Explicação simples e sem muito blá blá blá</p>
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
