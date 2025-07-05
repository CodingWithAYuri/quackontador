import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserEmail } from "../hooks/useUserEmail";
import Avatar from "./Avatar";
import { IMAGE_PATHS } from "../constants/paths";

const Header = () => {
  const { email, name } = useUserEmail();

  return (
    <header className="masthead masthead-nav">
      <Container>
        <Navbar expand="lg" className="justify-content-between disable-btn-bg">
          <div className="d-flex align-items-center">
            {/* Logo e Título */}
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <Avatar 
                src={IMAGE_PATHS.logo} 
                size={50} 
                alt="Psyduck Logo"
                className="me-2"
              />
              <h3 className="mb-0 header-title">QuackContador</h3>
            </Navbar.Brand>
          </div>

          {/* Menu Avatar */}
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav className="align-items-center">
              <p className="mb-0 me-2">{name ? `Olá, ${name}` : email ? `Olá, ${email}` : "Não logado"}</p>
              <Dropdown>
                <Dropdown.Toggle 
                  variant="" 
                  id="navbarDropdownMenuAvatar"
                  className="p-0 bg-transparent border-0"
                >
                  <Avatar 
                    src={IMAGE_PATHS.avatar} 
                    size={40} 
                    alt="User Avatar"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="disable-dropdown-menu">
                  <Dropdown.Item as={Link} to="/contactForm" className="disable-dropdown-item-color">
                    <i className="far fa-envelope-open" />
                    <span className="ms-2">Contato</span>
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/meus-dados" className="disable-dropdown-item-color">
                    <i className="far fa-user" />
                    <span className="ms-2">Meus Dados</span>
                  </Dropdown.Item>
                  {email ? (
                    <Dropdown.Item as={Link} to="/logout" className="disable-dropdown-item-color">
                      <i className="fas fa-sign-out-alt" />
                      <span className="ms-2">Sair</span>
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item as={Link} to="/login" className="disable-dropdown-item-color">
                      <i className="fas fa-sign-in-alt" />
                      <span className="ms-2">Login</span>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;