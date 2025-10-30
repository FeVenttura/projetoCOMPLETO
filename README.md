# Sistema de Controle de Finanças Pessoais

Este projeto consiste em uma aplicação web full-stack para gerenciamento de finanças pessoais, desenvolvida como requisito para a disciplina de Codificação Segura. A aplicação permite que os usuários se cadastrem, controlem suas receitas e despesas, e categorizem suas transações, com um foco robusto na implementação de múltiplas camadas de segurança para proteger os dados e a integridade do sistema.

## ✨ Funcionalidades

* **Autenticação de Usuários:** Sistema completo de cadastro e login com senhas criptografadas.
* **Gerenciamento de Transações (CRUD):** Criação, leitura, atualização e exclusão de receitas e despesas.
* **Gerenciamento de Categorias (CRUD):** Criação, leitura, atualização e exclusão de categorias para organizar as transações.
* **Upload de Arquivos:** Capacidade de anexar um comprovante (cupom fiscal) em formato de imagem ou PDF a uma transação.
* **Segurança:** Proteções implementadas contra as principais vulnerabilidades da web (SQL Injection, XSS, CSRF, etc.).

## 🛠️ Tecnologias Utilizadas

#### **Backend**
* **Node.js** com **Express.js**: Ambiente de execução e framework para a construção da API RESTful.
* **Sequelize ORM**: Para abstração e interação segura com o banco de dados.
* **MySQL**: Banco de dados relacional para armazenamento dos dados.
* **JSON Web Tokens (JWT)**: Utilizado para a criação de tokens de sessão seguros.
* **Bcrypt.js**: Para hashing e armazenamento seguro de senhas.
* **Segurança:**
    * `helmet`: Proteção de cabeçalhos HTTP.
    * `cors`: Gerenciamento de Política de Origem Cruzada.
    * `csurf`: Prevenção de ataques de Cross-Site Request Forgery (CSRF).
    * `joi`: Validação de schemas para os dados de entrada (input validation).
    * `multer`: Gerenciamento seguro de uploads de arquivos.
    * `dotenv`: Gerenciamento de variáveis de ambiente.

#### **Frontend**
* **HTML5, CSS3, JavaScript (Vanilla JS)**: Construção de uma interface de cliente simples e funcional, sem a necessidade de frameworks.
* **VS Code Live Server**: Utilizado como servidor de desenvolvimento local para os arquivos estáticos.

## 📁 Estrutura do Projeto

O projeto foi organizado em uma arquitetura monorepo com separação clara entre o frontend e o backend.

```
📁 ProjetoCompleto/
   ├── 📁 backend/
   │   ├── config/         (Configuração do banco de dados)
   │   ├── controllers/    (Lógica de negócio da aplicação)
   │   ├── middleware/     (Camadas de segurança e validação)
   │   ├── models/         (Definição das tabelas do banco)
   │   ├── routes/         (Definição dos endpoints da API)
   │   ├── uploads/        (Armazenamento de arquivos enviados)
   │   ├── .env            (Arquivo de variáveis de ambiente)
   │   ├── package.json
   │   └── server.js       (Ponto de entrada do servidor)
   │
   └── 📁 frontend/
       ├── login.html      (Tela de login e registro)
       └── dashboard.html  (Painel principal da aplicação)
```

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar a aplicação em um ambiente de desenvolvimento local.

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Um servidor de banco de dados [MySQL](https://www.mysql.com/)
* [Visual Studio Code](https://code.visualstudio.com/) com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 1. Configuração do Backend

1.  **Abra um terminal** e navegue até a pasta `backend`.
    ```bash
    cd caminho/para/ProjetoCompleto/backend
    ```
2.  **Instale as dependências** do projeto.
    ```bash
    npm install
    ```
3.  **Crie o Banco de Dados:** Conecte-se ao seu servidor MySQL e execute o seguinte comando SQL:
    ```sql
    CREATE DATABASE financas_pessoais;
    ```
4.  **Configure as Variáveis de Ambiente:** Crie um arquivo `.env` na raiz da pasta `backend` e preencha com suas credenciais, usando o exemplo abaixo como base.
    ```ini
    # Arquivo: backend/.env
    DB_NAME=financas_pessoais
    DB_USER=root
    DB_PASSWORD=sua_senha_do_mysql
    DB_HOST=localhost
    DB_PORT=3306
    JWT_SECRET=crie_um_segredo_forte_aqui
    ```
5.  **Inicie o servidor backend.**
    ```bash
    npm start
    ```
    O terminal deve exibir a mensagem "Servidor rodando na porta 3000". Deixe este terminal aberto.

### 2. Configuração do Frontend

1.  **Configure o VS Code:**
    * Vá em `File > Preferences > Settings` (ou `Ctrl + ,`).
    * Procure por `Live Server Host`.
    * Mude o valor para `localhost`. Isso garante que o frontend e o backend operem no mesmo domínio.
2.  **Abra a pasta `frontend` no VS Code:** Vá em `File > Open Folder...` e selecione a pasta `ProjetoCompleto/frontend`.
3.  **Inicie o Live Server:** Na barra de arquivos, clique com o botão direito no arquivo `login.html` e selecione **"Open with Live Server"**.
4.  O navegador será aberto no endereço `http://localhost:5500/login.html` e a aplicação estará pronta para uso.

## 🔐 Arquitetura de Segurança Implementada

Esta seção detalha como cada um dos requisitos de segurança solicitados foi abordado no projeto.

### SQL Injection e Hardcoded SQL
* **Solução Implementada:** O projeto utiliza o **ORM Sequelize** para todas as interações com o banco de dados. O Sequelize parametriza automaticamente todas as consultas, tratando qualquer entrada do usuário como dado literal e não como código SQL executável. Isso elimina o risco de SQL Injection e a necessidade de escrever SQL diretamente no código (Hardcoded SQL).

### Cross-Site Scripting (XSS)
* **Solução Implementada:** A proteção é feita em múltiplas camadas:
    1.  **Helmet.js**: O middleware `helmet` configura cabeçalhos HTTP de segurança, como `Content-Security-Policy` e `X-XSS-Protection`, que instruem o navegador a bloquear ou sanitizar scripts não confiáveis.
    2.  **Cookies com Flag `HttpOnly`**: O token de autenticação JWT é armazenado em um cookie com a flag `HttpOnly`. Isso torna o cookie inacessível para o JavaScript em execução no navegador, impedindo que um script malicioso consiga roubar o token de sessão.

### Cross-Site Request Forgery (CSRF)
* **Solução Implementada:** Utilizamos o middleware **`csurf`**, que implementa o padrão *Double Submit Cookie*.
    1.  **Geração do Token:** Após o login, o backend gera um token secreto de sessão e um token CSRF, que é enviado ao cliente.
    2.  **Envio no Header:** Para cada requisição que modifica o estado do servidor (POST, PUT, DELETE), o frontend envia o token CSRF em um cabeçalho HTTP customizado (`X-CSRF-Token`).
    3.  **Validação:** O servidor compara o token recebido no cabeçalho com o segredo da sessão. Se não baterem, a requisição é rejeitada com um erro `403 Forbidden`, garantindo que a ação foi legitimamente iniciada pelo nosso frontend. As rotas públicas, como `login` e `register`, foram isentas dessa verificação.

### Mass Assignment
* **Solução Implementada:** A proteção é garantida em dois níveis:
    1.  **Validação de Schema com Joi**: Antes de qualquer controller ser executado, o middleware `validators.js` utiliza `Joi` para validar o `req.body`. Schemas rigorosos (como `transactionSchema` e `userSchema`) garantem que apenas os campos esperados sejam aceitos. Por padrão, o Joi rejeita quaisquer campos não declarados no schema, bloqueando tentativas de Mass Assignment e retornando um erro `400 Bad Request`.
    2.  **Construção Explícita de Objetos**: O frontend foi programado para construir o objeto de dados e remover campos desnecessários (`delete data.idTransaction`) antes de enviar a requisição de criação, garantindo que apenas os dados pertinentes sejam enviados.

### Session Hijacking
* **Solução Implementada:** A principal defesa é o uso de **cookies com a flag `HttpOnly`** para armazenar o token JWT. Como explicado na seção XSS, isso impede o roubo do cookie de sessão via scripts. Adicionalmente, a proteção CSRF garante que, mesmo que um invasor conheça a URL de uma ação, ele não pode forçar um usuário logado a executá-la a partir de um site malicioso.

### Outras Vulnerabilidades Relevantes
* **Validação de Entrada:** Todas as rotas que recebem dados são protegidas pelo `Joi`, garantindo que os dados estejam no formato, tipo e tamanho corretos antes de serem processados.
* **Autenticação Segura:** As senhas dos usuários são hasheadas com `bcrypt` (incluindo um `salt`) antes de serem armazenadas, tornando inviável a recuperação da senha original mesmo em caso de vazamento do banco de dados.