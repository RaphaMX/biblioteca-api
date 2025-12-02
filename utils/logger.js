class Logger {
    constructor() {
        this.logs = [];
    }

    log(msg) {
        const linha = `[${new Date().toISOString()}] ${msg}`;
        console.log(linha);
        this.logs.push(linha);
    }

    error(msg) {
        const linha = `[${new Date().toISOString()}] ERROR: ${msg}`;
        console.error(linha);
        this.logs.push(linha);
    }
}

let instance = null;

module.exports = {
    getInstance: () => {
        if (!instance) instance = new Logger();
        return instance;
    }
};