# Desafio Técnico - Desenvolvedor Backend

## Contexto

Você foi contratado para desenvolver a API backend de um sistema de livraria. Este sistema deve permitir o gerenciamento de livros, autores e pedidos, fornecendo endpoints RESTful para atender a essas funcionalidades. O objetivo é construir uma API que permita a criação, consulta, atualização e exclusão (CRUD) de recursos, além de realizar buscas filtradas e possibilitar a compra de livros.

## Requisitos do Desafio

### 1. Configuração do Ambiente

- Utilize **Node.js**, **Python (Django)**, **Java (Spring Boot)**, ou qualquer outra tecnologia backend de sua escolha.
- Utilize um banco de dados relacional (como **PostgreSQL** ou **MySQL**) ou NoSQL (**MongoDB**).
- Crie um repositório no **GitHub** para o projeto e mantenha commits frequentes e organizados.

### 2. Modelagem do Banco de Dados

- **Livros:** Devem conter informações como título, ISBN, descrição, preço, data de publicação, categoria (romance, ficção, técnico, etc.) e estoque.
- **Autores:** Devem conter nome, biografia e data de nascimento.
- **Pedidos:** Devem registrar o cliente, data do pedido, itens do pedido (livros comprados e suas quantidades) e valor total.

### 3. Funcionalidades Básicas

- CRUD para **Livros** e **Autores**.
- Relacionamento entre autores e livros, permitindo que um livro tenha um ou mais autores.
- CRUD para **Pedidos**.
- Atualização automática de estoque após a criação de um pedido.

### 4. Funcionalidades Avançadas

- Endpoint para buscar livros por **título**, **categoria** ou **autor**.
- Implementação de filtros de preços e ordenação por data de publicação.
- Um endpoint para listar os **livros mais vendidos**.
- Controle de estoque: o sistema não deve permitir criar pedidos para livros com estoque insuficiente.

### 5. Autenticação e Autorização

- Implementar um sistema de autenticação (JWT ou OAuth) para gerenciar as permissões.
- Somente usuários autenticados devem conseguir criar, atualizar ou deletar recursos (CRUD).
- Implementar diferentes níveis de autorização (admin e cliente).

### 6. Testes

- Implementar testes unitários e/ou de integração para garantir a qualidade do código.
- Testar as principais funcionalidades, como criação de pedidos e controle de estoque.

### 7. Documentação

- Crie uma documentação no `README.md` do repositório com as instruções para executar o projeto localmente.
- Documente os endpoints usando **Swagger**, **Postman** ou outra ferramenta de documentação de APIs.

### 8. Bônus (opcional)

- Implementar paginação nos endpoints de listagem.
- Criar um script de inicialização (seed) para popular o banco de dados com livros e autores fictícios.
- Implementar cache para otimizar as consultas de listagem e busca.
- Deploy do backend em uma plataforma de cloud, como **Heroku**, **AWS** ou **Vercel**.

## Lista de tarefas.

- [x] Configuração do projeto

  - [x] Utilize Node.js, Python (Django), Java (Spring Boot), ou qualquer outra tecnologia backend de sua escolha.
  - [x] Utilize um banco de dados relacional (como PostgreSQL ou MySQL) ou NoSQL (MongoDB).
  - [x] Crie um repositório no GitHub para o projeto e mantenha commits frequentes e organizados.

- [x] Modelagem de dados
  - [x] Livros: Devem conter informações como título, ISBN, descrição, preço, data de publicação, categoria (romance, ficção, técnico, etc.) e estoque.
  - [x] Autores: Devem conter nome, biografia e data de nascimento.
  - [x] Pedidos: Devem registrar o cliente, data do pedido, itens do pedido (livros comprados e suas quantidades) e valor total.
- [x] Funcionalidades básicas
  - [X] CRUD para Livros e Autores.
  - [x] Relacionamento entre autores e livros, permitindo que um livro tenha um ou mais autores.
  - [X] CRUD para Pedidos.
  - [X] Atualização automática de estoque após a criação de um pedido.
- [x] Funcionalidades Avançadas
  - [x] Endpoint para buscar livros por título, categoria ou autor.
  - [x] Implementação de filtros de preços e ordenação por data de publicação.
  - [x] Um endpoint para listar os livros mais vendidos.
  - [x] Controle de estoque: o sistema não deve permitir criar pedidos para livros com estoque insuficiente.
- [x] Autenticação e Autorização
  - [x] Documentar os endpoints do projeto
  - [x] Implementar um sistema de autenticação (JWT ou OAuth) para gerenciar as permissões.
  - [x] Somente usuários autenticados devem conseguir criar, atualizar ou deletar recursos (CRUD).
  - [x] Implementar diferentes níveis de autorização (admin e cliente).
-

## Critérios de Avaliação

- **Qualidade do Código:** Clareza, organização e boas práticas (lint, clean code).
- **Estrutura do Projeto:** Arquitetura e modularidade.
- **Documentação e Testes:** Qualidade dos testes implementados e clareza na documentação.
- **Funcionalidades Implementadas:** Adesão aos requisitos e criatividade nas funcionalidades extras.
- **Performance e Eficiência:** Eficiência nas consultas ao banco de dados e controle de estoque.

## Instruções Finais

- Crie um fork deste repositório e desenvolva sua solução na branch `main`.
- Submeta o link do repositório final através do e-mail de contato.
- O prazo de entrega é de **7 dias** a partir do recebimento deste desafio.

Boa sorte!
