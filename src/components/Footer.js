import React from 'react';
import { Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="mastfoot mt-auto">
      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="text-center py-2">
          QuackContador 2024 &copy;
          <span className="ms-2 heart-symbol">&#x2763;</span>
          <a href="https://github.com/CodingWithAYuri" className="ms-2 text-decoration-none opacity-50">CodingWithAYuri</a>
        </Col>
      </Row>
    </footer>
  );
}

    

export default Footer;