const {
    By,
    until
} = require('selenium-webdriver');

class ListagemPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'http://localhost:3000/listagem.html';
    }

    async open() {
        await this.driver.get(this.url);
    }

    async obterItens() {
        await this.driver.wait(until.elementLocated(By.id('lista')), 2000);
        // Timeout de 5s para carregar itens
        await this.driver.wait(async () => {
            const els = await this.driver.findElements(By.css('#lista li'));
            return els.length > 0;
        }, 5000).catch(() => {});
        const els = await this.driver.findElements(By.css('#lista li'));
        const textos = [];
        for (let e of els) textos.push(await e.getText());
        return textos;
    }
}

module.exports = ListagemPage;