const fs = require('fs');
const path = require('path');

class Logger {
    constructor(filePath) {
        this.logs = [];
        this.filePath = filePath || process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log');
        const dir = path.dirname(this.filePath);
        try {
            fs.mkdirSync(dir, { recursive: true });
            this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
        } catch (err) {
            // fallback: no file stream available
            this.stream = null;
            console.error('[Logger] could not create log file:', err.message || err);
        }
    }

    _format(line, level) {
        const ts = new Date().toISOString();
        return level ? `[${ts}] ${level}: ${line}` : `[${ts}] ${line}`;
    }

    log(msg) {
        const linha = this._format(msg);
        console.log(linha);
        this.logs.push(linha);
        try {
            if (this.stream) this.stream.write(linha + '\n');
            else fs.appendFileSync(this.filePath, linha + '\n');
        } catch (err) {
            // swallow file errors to avoid breaking app flow
        }
    }

    error(msg) {
        const linha = this._format(msg, 'ERROR');
        console.error(linha);
        this.logs.push(linha);
        try {
            if (this.stream) this.stream.write(linha + '\n');
            else fs.appendFileSync(this.filePath, linha + '\n');
        } catch (err) {
            // swallow
        }
    }

    close() {
        if (this.stream) {
            this.stream.end();
            this.stream = null;
        }
    }
}

let instance = null;

module.exports = {
    getInstance: (filePath) => {
        if (!instance) instance = new Logger(filePath);
        return instance;
    }
};