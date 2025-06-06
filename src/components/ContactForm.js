import React, { useState } from 'react';
import { Form, FormGroup, FormControl, Button, InputGroup, FormCheck, Alert } from 'react-bootstrap';
import { Person, Envelope, ChatLeftText, Check2Circle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    agree: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, insira seu nome';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, insira seu email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um email válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Por favor, insira sua mensagem';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'A mensagem deve ter pelo menos 10 caracteres';
    }

    if (!formData.agree) {
      newErrors.agree = 'Você deve concordar com os termos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulando uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você implementaria o envio real do formulário
      console.log('Dados do formulário:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '', agree: false });
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilos inline para melhor controle do layout
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 120px)', // Altura total menos o header e footer
      backgroundColor: '#333',
      padding: '1rem 0.5rem',
      boxSizing: 'border-box',
      margin: 0,
      width: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem'
    },
    contentContainer: {
      width: '100%',
      maxWidth: '480px',
      margin: '1rem auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      flex: '0 1 auto',
      backgroundColor: '#333',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.4)'
    },
    formContainer: {
      width: '100%',
      maxWidth: '100%',
      margin: '0',
      padding: '0.5rem 0.8rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      backgroundColor: '#333',
      borderRadius: '6px',
      boxShadow: '0 0 10px rgba(221, 104, 104, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      outline: '1px solid rgba(255, 255, 255, 0.3)',
      outlineOffset: '1px',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      backfaceVisibility: 'hidden',
      color: '#fff',
      position: 'relative',
      opacity: '0.8'
    },
    icon: {
      marginRight: '0.3rem',
      color: '#6c757d',
      fontSize: '0.9rem' // Smaller icons
    },
    form: {
      width: '100%',
      fontSize: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility'
    },
    input: {
      width: '100%',
      padding: '0.5rem 0.8rem',
      border: '1px solid #555',
      borderRadius: '4px',
      fontSize: '0.9rem',
      lineHeight: '1.4',
      backgroundColor: '#fff',
      color: '#333',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        borderColor: '#6c757d',
        outline: '0',
        boxShadow: '0 0 0 0.2rem rgba(108, 117, 125, 0.5)'
      },
      '&::placeholder': {
        color: '#bbb',
        opacity: '0.8'
      }
    },
    textarea: {
      width: '100%',
      padding: '0.8rem',
      border: '1px solid #555',
      borderRadius: '4px',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      margin: '0',
      minHeight: '120px',
      maxHeight: '220px',
      resize: 'vertical',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      color: '#333',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        borderColor: '#6c757d',
        outline: '0',
        boxShadow: '0 0 0 0.2rem rgba(108, 117, 125, 0.5)'
      },
      '&::placeholder': {
        color: '#bbb',
        opacity: '0.8'
      }
    },
    formTitle: {
      fontSize: '1.5rem', // Increased from 1.4rem (additional 20%)
      margin: '0.6rem 0', // Increased margin by additional 20%
      textAlign: 'center',
      color: '#fff',
      fontWeight: '600',
      letterSpacing: '0.3px'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.9rem',
      marginTop: '0.3rem',
      minHeight: '1rem',
      lineHeight: '1.1'
    },
    button: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '0.5rem 1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '4px',
      fontSize: '0.9rem',
      fontWeight: '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      textTransform: 'none',
      letterSpacing: 'normal',
      marginTop: '1rem',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      alignSelf: 'flex-start',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateY(-2px)'
      },
      '&:active': {
        transform: 'translateY(0)'
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none'
      }
    },
    inputGroupText: {
      width: '44px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      border: '1px solid #555',
      borderRight: 'none',
      borderRadius: '6px 0 0 6px',
      padding: '0.6rem',
      color: '#333'
    },
    inputGroupTextTextarea: {
      width: '44px',
      height: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: '#fff',
      border: '1px solid #555',
      borderRight: 'none',
      borderRadius: '6px 0 0 6px',
      padding: '0.6rem 0.6rem 0',
      color: '#333'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div className="d-flex justify-content-center">
            <img 
              src={`${process.env.PUBLIC_URL}/images/avatar.png`} 
              alt="Avatar" 
              className="rounded-circle" 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              onError={(e) => {
                console.error('Erro ao carregar a imagem:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>
            <h2 style={{ fontSize: '1.4rem', margin: '0.5rem 0', color: '#fff' }}>Fale Conosco</h2>
          <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', opacity: 0.9, color: '#fff', fontStyle: 'italic'}}>Tem alguma dúvida ou sugestão?</p>
          
          {submitStatus === 'success' && (
            <Alert variant="success" className="text-start">
              <Check2Circle className="me-2" />
              Mensagem enviada com sucesso!
            </Alert>
          )}
          
          {submitStatus === 'error' && (
            <Alert variant="danger" className="text-start">
              Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.
            </Alert>
          )}
          
          <Form 
            onSubmit={handleSubmit} 
            className="text-start" 
            style={styles.form}>
            <FormGroup controlId="formName" className="mb-1">
              <InputGroup>
                <InputGroup.Text style={styles.inputGroupText}>
                  <Person size={12} />
                </InputGroup.Text>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  style={styles.input}
                />
              </InputGroup>
              {errors.name && (
                <div className="text-danger" style={{ fontSize: '0.65rem', marginTop: '2px' }}>{errors.name}</div>
              )}
            </FormGroup>

            <FormGroup controlId="formEmail" className="mb-1">
              <InputGroup>
                <InputGroup.Text style={styles.inputGroupText}>
                  <Envelope size={12} />
                </InputGroup.Text>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  style={styles.input}
                />
              </InputGroup>
              {errors.email && (
                <div className="text-danger" style={{ fontSize: '0.65rem', marginTop: '2px' }}>{errors.email}</div>
              )}
            </FormGroup>

            <FormGroup controlId="formMessage" className="mb-1">
              <InputGroup>
                <InputGroup.Text style={styles.inputGroupText}>
                  <ChatLeftText size={12} />
                </InputGroup.Text>
                <FormControl
                  as="textarea"
                  name="message"
                  placeholder="Sua mensagem..."
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!errors.message}
                  style={styles.textarea}
                />
              </InputGroup>
              {errors.message && (
                <div className="text-danger" style={{ fontSize: '0.65rem', marginTop: '2px' }}>{errors.message}</div>
              )}
            </FormGroup>

            <FormGroup controlId="formAgree" className="mb-2">
              <div className="d-flex align-items-center">
                <FormCheck
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  isInvalid={!!errors.agree}
                  className="me-2"
                  style={{
                    '--bs-form-check-bg': formData.agree ? '#6c757d' : '#fff',
                    '--bs-border-color': errors.agree ? '#dc3545' : '#6c757d',
                    '--bs-form-check-checked-bg': '#6c757d',
                    '--bs-form-check-checked-border-color': '#6c757d',
                    '--bs-form-check-focus-border-color': '#6c757d',
                    '--bs-form-check-focus-box-shadow': '0 0 0 0.25rem rgba(108, 117, 125, 0.25)'
                  }}
                />
                <label htmlFor="agree" className="form-check-label m-0" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                  <span style={{ whiteSpace: 'pre' }}>Concordo com os </span>
                  <Link to="/termos-de-uso" style={{ color: '#fff', textDecoration: 'underline' }}>
                    termos de uso
                  </Link>
                  <span style={{ whiteSpace: 'pre' }}> e </span>
                  <Link to="/politica-de-privacidade" style={{ color: '#fff', textDecoration: 'underline' }}>
                  política de privacidade
                  </Link>
                </label>
              </div>
              {errors.agree && (
                <div className="text-danger" style={{ fontSize: '0.65rem', marginTop: '2px' }}>{errors.agree}</div>
              )}
            </FormGroup>

            <div className="d-flex justify-content-center" style={{ marginTop: '0.5rem' }}>
              <Button
                type="submit"
                variant="outline-light"
                size="lg"
                className="px-4"
                disabled={isSubmitting}
                style={{
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  fontSize: '0.945rem',
                  padding: '0.42rem 1.68rem',
                  lineHeight: '1.2'
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
