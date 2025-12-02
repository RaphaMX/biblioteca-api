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

## **Design Pattern adotado**

O projeto utiliza um **Singleton Logger** (arquivo `utils/logger.js`) para centralizar logs e evitar múltiplas instâncias espalhadas. Esse padrão facilita adicionar toggles de `verbose`/`level` e garante comportamento consistente de logging durante execução e testes.


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

### Explicação sobre o uso de TDD

Usamos TDD para guiar a implementação dos endpoints e para estruturar fluxos UI. O ciclo Red→Green→Refactor ajuda a manter o foco em comportamento observável, reduz bugs e facilita refatorações seguras, porque os testes atuam como uma rede de proteção.

Práticas adotadas:
- Escrever o teste que descreve o comportamento esperado antes de tocar no código.
- Manter os testes rápidos (usar `repo.memory.js` durante desenvolvimento) para feedback veloz.
- Refatorar com confiança: após garantir que a suíte verde, aplicar melhorias no design e limpeza de código.

### Resumo do ciclo Red → Green → Refactor

- Red: escrever um teste que descreva o comportamento esperado e observar que ele falha.
- Green: implementar o menor código necessário para fazer o teste passar.
- Refactor: melhorar o design/legibilidade do código mantendo os testes passando.

No projeto aplicamos esse ciclo repetidas vezes para endpoints e para fluxos UI automatizados.

### Exemplos concretos

1) Trecho de teste escrito antes do código (exemplo do teste de criação de livro):

```javascript
// tests/api.books.test.js (trecho)
test('POST /books -> 201 cria livro válido', async () => {
	const res = await request(app).post('/books').send({
		title: 'Tao Te Ching',
		author: 'Lao Tzu',
		year: 1868,
		category: 'Filosofia'
	});
	expect(res.status).toBe(201);
	expect(res.body.title).toBe('Tao Te Ching');
});
```

Esse teste foi adicionado antes do comportamento estar implementado no servidor. Ao rodar inicialmente, o teste falha (Red), então implementamos o endpoint e a função `create` (sempre minimamente para garantir sucesso) do repositório para salvar e validar os campos (Green) para então implementar as funcionalidades completas (Refactor).


### Classificação dos tipos de testes no projeto

- Unitário: funções puras do repositório e utilitários (planejado).
- Integração: endpoints da API exercitando app+repo (implementado via `supertest`).
- Funcional/E2E: fluxo de cadastro + listagem usando Selenium e POM (implementado).

