import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import HttpClient from "./HttpClient";
import { mockedLoginResponse } from "../services/ApiMock";

function Logout() {
  console.log("Logout effect running");

  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      await serverLogout();
      localStorage.clear();
      navigate('/');
    }

    handleLogout();
  }, [navigate]);

  const nothing = null;
  return nothing;
}

function serverLogout() {
  //const apiClient = new HttpClient("http://localhost:3001");
  const data = mockedLoginResponse();
  //return apiClient.get("/api-logout");
  console.log("Logout successful:", data);
}

export default Logout;
