const { Builder, Capabilities } = require('selenium-webdriver');
const CadastroPage = require('./POM/cadastroPage');
const ListagemPage = require('./POM/listagemPage');

jest.setTimeout(30000);

test('cadastro e listagem via selenium', async () => {
    const capabilities = Capabilities.chrome();
    const driver = await new Builder().withCapabilities(capabilities).build();
    const cadastro = new CadastroPage(driver);
    const listagem = new ListagemPage(driver);
    try {
        await cadastro.open();
        await cadastro.preencherFormulario({
            title: 'Quatro Livros e Cinco Clássicos',
            author: 'Confúcio',
            year: 500,
            category: 'Filosofia'
        });
        await cadastro.clicarSalvar();
        const msg = await cadastro.obterMensagem();
        expect(typeof msg).toBe('string');

        await listagem.open();
        const itens = await listagem.obterItens();
        const found = itens.some(t => t.includes('Quatro Livros e Cinco Clássicos'));
        expect(found).toBe(true);
    } finally {
        await driver.quit();
    }
});