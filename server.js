const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const repo = require('./repo.memory');
// const repo = require('./repo.sqlite');

// POST /books
app.post('/books', async (req, res) => {
    try {
        const created = await repo.create(req.body || {});
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// GET /books
app.get('/books', async (_req, res) => {
    try {
        const items = await repo.list();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// GET /books/find?title=...&author=...
app.get('/books/find', async (req, res) => {
    try {
        const {
            title,
            author
        } = req.query;
        if (!title && !author) return res.status(400).json({
            error: 'Query Inválida'
        });
        const match = {};
        if (title) match.title = title;
        if (author) match.author = author;
        const item = await repo.get(match);
        if (!item) return res.status(404).json({
            error: 'Não Encontrado'
        });
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// PUT /books { match, patch }
app.put('/books', async (req, res) => {
    try {
        const {
            match,
            patch
        } = req.body || {};
        const updated = await repo.update(match, patch || {});
        res.status(200).json(updated);
    } catch (err) {
        const msg = err.message || '';
        if (/Não encontrado/i.test(msg)) return res.status(404).json({
            error: msg
        });
        res.status(400).json({
            error: msg
        });
    }
});

// DELETE /books { match }
app.delete('/books', async (req, res) => {
    try {
        const ok = await repo.del(req.body || {});
        if (!ok) return res.status(404).json({
            error: 'Não encontrado'
        });
        res.status(204).end();
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

if (require.main === module) {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
}

module.exports = {
    app,
    _reset: repo._reset
};