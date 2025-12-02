# Biblioteca — CRUD de Livros

Uma API simples para gerenciar um acervo de livros com foco em testes (TDD) e automação de fluxo com Selenium (POM).

## **Visão Geral**

Projeto de exemplo para praticar testes automatizados e desenvolvimento orientado a testes (TDD). A aplicação fornece endpoints REST para CRUD de livros e páginas estáticas para cadastro e listagem.

## **Estrutura do Projeto**

```
biblioteca-api/
├─ package.json
├─ README.md
├─ server.js
├─ repo.memory.js
├─ repo.sqlite.js
├─ utils/
│   └─ logger.js
├─ public/
│   ├─ index.html
│   ├─ cadastro.html
│   ├─ listagem.html
│   └─ styles.css
├─ tests/
│   ├─ api.books.test.js          # testes API com supertest + jest
│   └─ selenium/
│       ├─ POM/
│       │   ├─ cadastroPage.js
│       │   └─ listagemPage.js
│       └─ cadastro.selenium.test.js
└─ library.db
```

## **Tecnologias**

- Node.js + Express
- SQLite (opcional, `repo.memory.js` usado para testes rápidos)
- Jest + Supertest (testes de API)
- Selenium WebDriver + POM (automação UI)


## **Como Executar (local)**

1. Instalar dependências:

```powershell
npm install
```

2. Rodar API localmente:

```powershell
npm start
# abre http://localhost:3000
```

3. Rodar todos os testes (API + outros):

```powershell
npm test
```

4. Executar apenas os testes da API:

```powershell
npm run test:api
```

5. Executar testes Selenium (ambiente com Chrome + chromedriver no PATH):

```powershell
npm run test:selenium
```

**Observações:**
- O teste Selenium exige um navegador Chrome instalado e um `chromedriver` compatível no `PATH`.
- Para execuções em CI, prefira um runner headless ou uma imagem com Chrome/Chromedriver pré-instalados.


## **TDD & Testes**

Esta seção reúne práticas e instruções para executar o fluxo de TDD no projeto.

