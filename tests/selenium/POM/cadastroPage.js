const {
    By,
    until
} = require('selenium-webdriver');

class CadastroPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'http://localhost:3000/cadastro.html';
    }

    async open() {
        await this.driver.get(this.url);
    }

    async preencherFormulario({
        title,
        author,
        year,
        category
    }) {
        await this.driver.findElement(By.id('titulo')).sendKeys(title);
        await this.driver.findElement(By.id('autor')).sendKeys(author);
        await this.driver.findElement(By.id('ano')).sendKeys(String(year));
        await this.driver.findElement(By.id('categoria')).sendKeys(category);
    }

    async clicarSalvar() {
        await this.driver.findElement(By.css('button[type="submit"]')).click();
    }

    async obterMensagem() {
        const el = await this.driver.wait(until.elementLocated(By.id('msg')), 2000);
        await this.driver.wait(async () => {
            const txt = await el.getText();
            return txt && txt.length > 0;
        }, 3000);
        return el.getText();
    }
}

module.exports = CadastroPage;