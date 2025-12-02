const Database = require('better-sqlite3');
const Logger = require('./utils/logger').getInstance();
const db = new Database('library.db');

db.prepare(`
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'Disponível'
)
`).run();

function _reset() {
    db.prepare('DELETE FROM books').run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name='books'").run();
    Logger.log('_reset sqlite repo');
}

function list() {
    return db.prepare('SELECT * FROM books ORDER BY id').all();
}

function get(match = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');
    const keys = Object.keys(match);
    const where = keys.map(k => `${k} = ?`).join(' AND ');
    const vals = keys.map(k => match[k]);
    return db.prepare(`SELECT * FROM books WHERE ${where} LIMIT 1`).get(...vals) || null;
}

function create(data = {}) {
    const {
        title,
        author,
        year,
        category
    } = data;
    if (!title || !author || !year) throw new Error('Campos obrigatórios');
    const stmt = db.prepare('INSERT INTO books (title, author, year, category, status) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(String(title).trim(), String(author).trim(), Number(year), category ? String(category).trim() : '', 'Disponível');
    const id = info.lastInsertRowid;
    Logger.log(`create sqlite id=${id}, title="${title}"`);
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
}

function update(match = {}, patch = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');
    if (!patch || Object.keys(patch).length === 0) throw new Error('patch vazio');

    const found = get(match);
    if (!found) throw new Error('Não encontrado');

    const newtitle = patch.title ? String(patch.title).trim() : found.title;
    const newAuthor = patch.author ? String(patch.author).trim() : found.author;
    const newyear = patch.year ? Number(patch.year) : found.year;
    const newCategory = patch.category ? String(patch.category).trim() : found.category;
    const newStatus = patch.status ? String(patch.status).trim() : found.status;

    db.prepare('UPDATE books SET title = ?, author = ?, year = ?, category = ?, status = ? WHERE id = ?')
        .run(newtitle, newAuthor, newyear, newCategory, newStatus, found.id);

    Logger.log(`update sqlite id=${found.id}, title="${newtitle}, status="${newStatus}"`);
    return db.prepare('SELECT * FROM books WHERE id = ?').get(found.id);
}

function del(match = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');

    const keys = Object.keys(match);
    const where = keys.map(k => `${k} = ?`).join(' AND ');
    const vals = keys.map(k => match[k]);

    const rows = db.prepare(`SELECT id FROM books WHERE ${where}`).all(...vals);
    if (rows.length === 0) return false;

    const ids = rows.map(r => r.id);
    const stmt = db.prepare(`DELETE FROM books WHERE ${where}`);
    stmt.run(...vals);

    Logger.log(`del sqlite removed ${ids.length}`);
    return true;
}

module.exports = {
    _reset,
    list,
    get,
    create,
    update,
    del
};