import React, { useState } from "react";
import { Col, CardBody } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";  // Importe useNavigate aqui
import HttpClient from "./HttpClient";  // Certifique-se de importar a classe HttpClient

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // Inicialize o useNavigate
  const apiClient = new HttpClient("http://localhost:3001"); // Altere para a URL do seu JSON server

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevenir o comportamento padrão do formulário
    try {
      // TODO alterar em producao
      // const data = await apiClient.post("/login", { email, password });
      const data = await apiClient.get("/api-login");
      console.log("Login successful:", data);

      // Aqui você salva no localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(data));

      // Redireciona para a página Home após o login bem-sucedido
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center h-100">
        <Col col="12">
        <div className="bg-dark text-white my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <CardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
              <div className="card my-3 mt-0">
                <div
                  className="card-body bg-light p-lg-5 p-md-4 p-sm-3 p-2"
                  autoComplete="off"
                >
                  <div className="text-center">
                    <img
                      src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                      className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                      width="200px"
                      alt="profile"
                    />
                  </div>
                  <h2 className="mb-2 text-center">Login</h2>

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label login-text mt-5 mb-1" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=""
                        autoComplete="email"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label login-text" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control mb-5"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      

                    </div>

                    {/* Botão de envio */}
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-outline-primary px-5 mb-5 w-100"
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  <div
                    id="emailHelp"
                    className="form-text text-center mb-4 text-dark login-text-register"
                  >
                    Not Registered?{" "}
                    <Link to="/cadastro" className="text-dark fw-bold">
                      {" "}
                      Create an Account
                    </Link>
                  </div>
                </div>
              </div>
            </CardBody>
          </div>
        </Col>
      </div>
    </div>
  );
}

export default LoginForm;
