import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Check if the user object and email exist in the parsed data
      if (parsedData.user && parsedData.user.email) {
        setEmail(parsedData.user.email);
      }
    }
  }, []); // Empty dependency array means this effect runs only once on mount


  return (
    <div className="masthead masthead-nav">
      <Container>
      <div className="container inner">
        <Navbar expand="lg" className="justify-content-center disable-btn-bg">
          <Navbar.Brand className="masthead-brand" as={Link} to="/quackontador">
            <img src="psyduck.png" width="50" height="50" alt="Psyduck Logo" />
          </Navbar.Brand>
          <Link
            to="/quackontador"
            className="text-decoration-none d-flex align-items-center ms-0"
          >
            <h3 className="mb-0 ms-0" style={{ fontSize: "25px" }}>
              QuackContador
            </h3>
          </Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <Dropdown drop="down">
                <Dropdown.Toggle variant="" id="navbarDropdownMenuAvatar">
                  <img
                    src="user.png"
                    className="rounded-circle"
                    height="40"
                    alt="User Avatar"
                    loading="lazy"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="disable-dropdown-menu">
                  <Dropdown.Item as={Link} to="/contactForm" className="disable-dropdown-item-color">
                      <i className="far fa-envelope-open ms-2" />
                      <span className="ms-2">Contato</span>
                  </Dropdown.Item>
                {email ? (
                      <>
                        <Dropdown.Item as={Link} to="/logout" id="logout-link" className="disable-dropdown-item-color">
                          <i className="fas fa-sign-in-alt ms-2" />
                          <span className="ms-2">Logout</span>
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item as={Link} to="/login" className="disable-dropdown-item-color">
                        <i className="fas fa-sign-in-alt ms-2" />
                        <span className="ms-2">Login</span>
                      </Dropdown.Item>
                    )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <p className="ms-1 mb-0">{email ? `Olá, ${email}` : "Not logged in"}</p>
          </Navbar.Collapse>
        </Navbar>
        </div>
      </Container>
    </div>
  );
};

export default Header;
