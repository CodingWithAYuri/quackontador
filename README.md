# Projeto QuackContador

## Visão Geral

O QuackContador é uma aplicação web desenvolvida com React e Bootstrap, destinada a simplificar os processos contábeis para usuários leigos e profissionais.

## Funcionalidades

- **Autenticação**: suporta login e cadastro de usuários para acessar funcionalidades exclusivas.
- **Calculadora de Tributos**: facilita o cálculo de INSS e IRPF para empregados CLT e autônomos.
- **Formulário de Contato**: permite aos usuários enviar consultas ou pedidos de forma direta.

## Tecnologias Utilizadas

- **React**: construção da interface do usuário.
- **Bootstrap e React-Bootstrap**: componentes e estilos para design responsivo.
- **React Router**: navegação entre páginas sem recarregar.
- **Json Server**: simulação de API RESTful para armazenamento e recuperação de dados.

## Como Executar o Projeto

1. **Pré-requisitos:**
   - Node.js e npm instalados.

2. **Instalação das dependências:**
   ```bash
   npm install
   ```

3. **Execução do servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   O app estará disponível em `http://localhost:3000`.

4. **Execução do servidor simulado (Json Server):**
   ```bash
   npm run start-json-server
   ```
   O backend simulado estará disponível em `http://localhost:3001`.

## Testes Unitários

Os testes unitários são fundamentais para garantir a qualidade e a funcionalidade do código. Eles foram implementados usando `Jest` e `React Testing Library` para simular interações do usuário e verificar se a lógica de UI está funcionando como esperado.

Para rodar os testes:
```bash
npm test
```

## Deploy

O projeto pode ser acessado em produção pelo GitHub Pages:
[https://codingwithayuri.github.io/quackontador/](https://codingwithayuri.github.io/quackontador/)

## Estrutura do Projeto

- `src/`: código-fonte do frontend React.
- `public/`: arquivos estáticos.
- `db.json`: banco de dados simulado para o Json Server.

## Licença

Este projeto está licenciado sob a licença MIT.
