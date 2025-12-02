const Logger = require('./utils/logger').getInstance();

let books = [];

function _reset() {
    books = [];
    Logger.log('_reset memory repo');
}

function list() {
    return JSON.parse(JSON.stringify(books));
}

function get(match = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');
    const entry = books.find(l => {
        return Object.entries(match).every(([k, v]) => String(l[k]) === String(v));
    });
    return entry ? {
        ...entry
    } : null;
}

function create(data = {}) {
    const {
        title,
        author,
        year,
        category
    } = data;
    if (!title || !author || !year) throw new Error('Campos obrigatórios');
    const book = {
        id: books.length + 1,
        title: String(title).trim(),
        author: String(author).trim(),
        year: Number(year),
        category: category ? String(category).trim() : '',
        status: 'Disponível'
    };
    books.push(book);
    Logger.log(`create: ${book.title}`);
    return {
        ...book
    };
}

function update(match = {}, patch = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');
    if (!patch || Object.keys(patch).length === 0) throw new Error('patch vazio');

    const index = books.findIndex(l => Object.entries(match).every(([k, v]) => String(l[k]) === String(v)));
    if (index === -1) throw new Error('não encontrado');

    const book = books[index];
    if (patch.title) book.title = String(patch.title).trim();
    if (patch.author) book.author = String(patch.author).trim();
    if (patch.year) book.year = Number(patch.year);
    if (patch.category) book.category = String(patch.category).trim();
    if (patch.status) book.status = String(patch.status).trim();

    Logger.log(`update: ${book.id}`);
    return {
        ...book
    };
}

function del(match = {}) {
    if (!match || Object.keys(match).length === 0) throw new Error('match obrigatório');

    const before = books.length;
    books = books.filter(l => !Object.entries(match).every(([k, v]) => String(l[k]) === String(v)));
    const removed = before - books.length;
    Logger.log(`del removed ${removed}`);
    return removed > 0;
}

module.exports = {
    _reset,
    list,
    get,
    create,
    update,
    del
};