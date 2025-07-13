import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto de dados do usuário
const UserDataContext = createContext();

// Hook personalizado para facilitar o acesso ao contexto
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData deve ser usado dentro de um UserDataProvider');
  }
  return context;
};

// Provider que gerencia o estado dos dados do usuário
export const UserDataProvider = ({ children }) => {
  // Estado para armazenar os dados do usuário
  const [userData, setUserData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    nit: '',
    valor: '0,00',
    mesReferencia: String(new Date().getMonth() + 1).padStart(2, '0'),
    anoReferencia: String(new Date().getFullYear()),
    competencia: '',
    // Campos adicionais podem ser acrescentados conforme necessário
  });

  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    const savedData = localStorage.getItem('userGPSData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  // Função para atualizar os dados do usuário e salvar no localStorage
  const updateUserData = (newData) => {
    setUserData(prevData => {
      const updatedData = { ...prevData, ...newData };
      
      // Salva os dados no localStorage
      try {
        localStorage.setItem('userGPSData', JSON.stringify(updatedData));
      } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
      }
      
      return updatedData;
    });
  };

  // Limpa os dados do usuário
  const clearUserData = () => {
    setUserData({
      nome: '',
      cpf: '',
      dataNascimento: '',
      nit: '',
      valor: '0,00',
      mesReferencia: String(new Date().getMonth() + 1).padStart(2, '0'),
      anoReferencia: String(new Date().getFullYear()),
      competencia: ''
    });
    localStorage.removeItem('userGPSData');
  };

  // Valores e funções expostos pelo contexto
  const value = {
    userData,
    updateUserData,
    clearUserData
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
