import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserEmail } from "../hooks/useUserEmail";
import Avatar from "./Avatar";
import { IMAGE_PATHS } from "../constants/paths"; // Importe a constante

const Header = () => {
  const email = useUserEmail();

  return (
    <div className="masthead masthead-nav">
      <Container>
        <div className="container inner">
          <Navbar expand="lg" className="justify-content-center disable-btn-bg">
            {/* Logo */}
            <Navbar.Brand as={Link} to="/" className="masthead-brand">
              <Avatar src={IMAGE_PATHS.logo} size={50} alt="Psyduck Logo" />
            </Navbar.Brand>
            
            {/* Título */}
            <Link to="/" className="text-decoration-none d-flex align-items-center ms-0">
              <h3 className="mb-0 ms-0 header-title">QuackContador</h3>
            </Link>

            {/* Menu Avatar */}
            <Navbar.Collapse id="navbarNav" className="justify-content-end">
              <Nav>
                <Dropdown drop="down">
                  <Dropdown.Toggle variant="" id="navbarDropdownMenuAvatar">
                    <Avatar src={IMAGE_PATHS.avatar} size={40} alt="User Avatar" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="disable-dropdown-menu">
                    <Dropdown.Item as={Link} to="/contactForm" className="disable-dropdown-item-color">
                      <i className="far fa-envelope-open ms-2" />
                      <span className="ms-2">Contato</span>
                    </Dropdown.Item>
                    {email ? (
                      <Dropdown.Item as={Link} to="/logout" className="disable-dropdown-item-color">
                        <i className="fas fa-sign-in-alt ms-2" />
                        <span className="ms-2">Logout</span>
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item as={Link} to="/login" className="disable-dropdown-item-color">
                        <i className="fas fa-sign-in-alt ms-2" />
                        <span className="ms-2">Login</span>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
              <p className="ms-2 mb-0">{email ? `Olá, ${email}` : "Not logged in"}</p>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
};

export default Header;