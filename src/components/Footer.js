import React from 'react';
import { Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="mastfoot mt-auto">
      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="text-center py-2">
            QuackContador 2025 &copy;
          <span className="mx-2 heart-symbol">&#x2763;</span>
          <a href="https://github.com/CodingWithAYuri" className="text-decoration-none">CodingWithAYuri</a>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;