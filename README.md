![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-000000?logo=railway&logoColor=white)

# 💰 Minha Grana

> Aplicação web de gerenciamento financeiro pessoal desenvolvida para facilitar o controle de receitas, despesas, transações recorrentes, parcelas e metas financeiras.

O **Minha Grana** é uma aplicação full-stack desenvolvida com foco em organização financeira e experiência de uso. A aplicação permite acompanhar o saldo, visualizar gastos por categoria, registrar transações e estabelecer metas financeiras com acompanhamento de progresso.

---

## 📸 Screenshots

### Dashboard

O dashboard apresenta uma visão geral das finanças do usuário, incluindo receitas, despesas, saldo, distribuição dos gastos por categoria e histórico das transações.

![Dashboard](docs/screenshots/home.png)

### Transações

A página de transações utiliza um calendário para facilitar a visualização das movimentações financeiras por dia. Também é possível criar e excluir transações diretamente pela interface.

![Transações](docs/screenshots/transactions.png)

### Metas

O sistema de metas permite definir objetivos financeiros, acompanhar o valor acumulado e visualizar o progresso de cada objetivo.

![Metas](docs/screenshots/goals.png)

---

## ✨ Funcionalidades

### 📊 Dashboard financeiro

- Visualização do saldo geral.
- Total de receitas e despesas.
- Visão geral das despesas por categoria.
- Histórico das transações do mês.
- Navegação entre diferentes meses e anos.

### 💸 Transações

- Criação de transações de entrada e saída.
- Transações recorrentes e parceladas.
- Definição de categoria.
- Definição da data.
- Exclusão de transações.
- Visualização das transações através de um calendário.

### 🔄 Transações recorrentes

O sistema possui suporte para transações recorrentes.

Uma transação recorrente pode continuar sendo considerada nos meses seguintes de acordo com sua data original, permitindo representar despesas e receitas como:

- Salário.
- Aluguel.
- Assinaturas.
- Mensalidades.
- Outras despesas ou receitas periódicas.

### 📑 Transações parceladas

O sistema também possui suporte para transações parceladas, permitindo dividir uma compra em múltiplas parcelas e registrar seus respectivos valores.

### 🎯 Metas financeiras

- Criação de metas personalizadas.
- Definição de valor-alvo.
- Acompanhamento do valor atual.
- Barra de progresso.
- Adição e remoção de valores.
- Conclusão de metas.
- Exclusão de metas.

### 🔐 Autenticação

- Registro de usuários.
- Login.
- Logout.
- Autenticação utilizando JWT.
- Token armazenado em cookie `HttpOnly`.
- Proteção das rotas autenticadas.
- Expiração do token.
- Controle de acesso baseado no usuário autenticado.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **React Icons**
- **date-fns**
- **Vite**

### Backend

- **Node.js**
- **Express**
- **JavaScript**
- **MySQL**
- **mysql2**
- **JWT**
- **bcrypt**

### Segurança

- **Helmet**
- **express-rate-limit**
- **CORS**
- Cookies `HttpOnly`
- Variáveis de ambiente
- Validação de autenticação no backend

### Deploy

- **Vercel** — Frontend
- **Railway** — Backend e banco de dados MySQL

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separada entre frontend e backend:

```text
Minha-Grana/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── server.js
│   └── ...
│
└── README.md
```

A aplicação segue uma separação entre **rotas, controllers e services** no backend, mantendo a lógica de negócio fora do arquivo principal do servidor.

---

## 🔄 Fluxo da aplicação

De maneira simplificada, o fluxo de uma operação é:

```text
React
  │
  │ Axios
  ▼
Express API
  │
  ├── Middleware de autenticação
  │
  ├── Controller
  │
  └── Service
        │
        ▼
      MySQL
```

Essa separação permite manter o backend organizado e facilita a manutenção e expansão da aplicação.

---

## 🔒 Segurança

O backend possui algumas medidas para proteger a aplicação:

- Autenticação através de JWT.
- Tokens armazenados em cookies `HttpOnly`.
- Cookies configurados para ambiente de produção.
- `Helmet` para aplicação de headers de segurança.
- Rate limiting para reduzir tentativas excessivas de requisições.
- CORS configurado para permitir apenas a origem do frontend.
- Senhas armazenadas utilizando `bcrypt`.
- Informações sensíveis mantidas através de variáveis de ambiente.
- Validação de autenticação nas rotas protegidas.

---

## 🗄️ Banco de dados

O projeto utiliza **MySQL** para armazenar os dados da aplicação.

Entre as principais entidades estão:

- Usuários.
- Transações.
- Categorias.
- Metas.

As transações possuem relacionamento com usuários e categorias através de chaves estrangeiras, garantindo a integridade dos dados.

---

## 🚀 Deploy

A aplicação está preparada para produção utilizando:

```text
Frontend → Vercel
Backend  → Railway
Database → Railway MySQL
```

As configurações específicas de produção, como URLs, chave secreta e credenciais do banco de dados, são armazenadas através de variáveis de ambiente.

---

## 🎯 Objetivos do projeto

O Minha Grana foi desenvolvido com o objetivo de aplicar conhecimentos de desenvolvimento **frontend e backend** em uma aplicação real, trabalhando conceitos como:

- Desenvolvimento de APIs REST.
- Autenticação e autorização.
- Integração entre React e Express.
- Persistência de dados com MySQL.
- Modelagem de banco de dados.
- Organização de código em camadas.
- Tratamento de erros.
- Segurança de aplicações web.
- Gerenciamento de estado no frontend.
- Deploy de aplicações full-stack.
- Tratamento de datas e regras de negócio financeiras.

---

## 📚 Aprendizados

Durante o desenvolvimento do projeto, foram trabalhados conceitos importantes de desenvolvimento web, principalmente na integração entre diferentes partes da aplicação.

O projeto também serviu para aprofundar conhecimentos em **React, TypeScript, Node.js, Express, MySQL, autenticação JWT, APIs REST, segurança, arquitetura de software e deploy em produção**.

---

## 🔮 Possíveis melhorias futuras

Algumas funcionalidades que podem ser adicionadas futuramente:

- Gráficos financeiros mais avançados.
- Relatórios personalizados.
- Exportação de transações.
- Filtros avançados.
- Notificações financeiras.
- Categorias personalizadas.
- Suporte a diferentes contas bancárias.
- Melhorias na análise de gastos.
- Aplicativo mobile.

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Vitor Gabriel** como projeto de estudo e portfólio, com foco em desenvolvimento **Full-Stack**.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.
