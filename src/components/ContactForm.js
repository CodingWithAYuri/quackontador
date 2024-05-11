import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
  FormGroup,
  FormCheck,
} from "react-bootstrap";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Implementar a lógica de envio do formulário aqui
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("Agree:", agree);
  };

  return (
    <main
      role="main"
      className="main inner text-center d-flex justify-content-center align-items-center"
    >
      <Container className="contact-container">
        <Form onSubmit={handleSubmit} className="">
          <FormGroup className="mb-4">
            <Form.Label className="text-large">Endereço de email</Form.Label>
            <InputGroup className="mt-1">
              <FormControl
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={handleEmailChange}
              />
            </InputGroup>
            <Form.Text className="mt-1 small-text-left text-white text-left  muted">
              Não iremos compartilhar seu email com ninguém.
            </Form.Text>
          </FormGroup>
          <FormGroup>
            <Form.Label className="text-large">Mensagem</Form.Label>
            <InputGroup className="mt-1">
              <FormControl
                as="textarea"
                rows="3"
                value={message}
                onChange={handleMessageChange}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup className="form-check mb-4">
            <FormCheck
              type="checkbox"
              id="exampleCheck1"
              checked={agree}
              onChange={handleAgreeChange}
            />
            <FormCheck.Label className="small mb-4" htmlFor="exampleCheck1">
              Concordo com os termos e política do Quackontador
            </FormCheck.Label>
          </FormGroup>
          <Button type="submit" variant="info" className="btn-round">
            Enviar
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default ContactForm;
